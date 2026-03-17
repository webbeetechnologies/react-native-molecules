# molecules-slots

A compile-time transform that routes named slot children to their declared positions in compound components — zero runtime scanning overhead, no `slot` prop required.

The library ships source. The transform runs on all code — both library source and consumer code — at consumer build time in a single pass.

---

## Problem

Compound components like `TextInput` currently use `extractSubcomponents` to scan `children` on every render and route each child to the right position in the layout. This works but runs on every render.

```tsx
// Consumer writes
<TextInput>
    <TextInput.Label>Email</TextInput.Label>
    <TextInput.Left><Icon name="mail" /></TextInput.Left>
</TextInput>

// Parent scans children on every render — runs on every keystroke
const { TextInput_Label, TextInput_Left } = extractSubcomponents({ children, ... });
```

---

## Goal

Move child-routing to compile time. Consumer API stays exactly the same. The transform does the work.

```tsx
// Consumer writes — unchanged
<TextInput>
    <TextInput.Label>Email</TextInput.Label>
    <TextInput.Left><Icon name="mail" /></TextInput.Left>
</TextInput>

// Transform rewrites the call site to
<TextInput __slots={{
    TextInput_Label: <TextInput.Label>Email</TextInput.Label>,
    TextInput_Left: <TextInput.Left><Icon name="mail" /></TextInput.Left>,
}}>
</TextInput>

// Component reads slots as plain prop access — O(1), no scanning
{__slots?.['TextInput_Label']}
{__slots?.['TextInput_Left']}
```

---

## Implementation

**Not a Babel plugin.** Babel AST transforms are fragile, JSX syntax evolves, and maintenance compounds quickly across edge cases.

Instead:
- **Core**: SWC-based transform (Rust, fast, handles all JSX syntax correctly)
- **Primary adapter**: Metro transformer (React Native — main target)
- **Secondary adapter**: unplugin (Vite, webpack, Rollup, esbuild, Rspack — web / Expo Web)

The transform logic is written once in SWC. Both adapters are thin wrappers that call it.

---

## How It Works

### 1. Component declares its slots

```ts
TextInput.__slots = [
    'TextInput_Label',
    'TextInput_Left',
    'TextInput_Right',
    'TextInput_SupportingText',
    'TextInput_Outline',
] as const;
```

Co-located with the component. No separate manifest or config file needed. The transform reads this static array when processing call sites.

### 2. Component uses `<Slot />` as a placeholder

```tsx
import { Slot } from '../Slot';

const TextInput = ({ children, __slots }) => (
    <View>
        <Slot name="TextInput_Outline" />
        <Slot name="TextInput_Left" />
        <View>
            <Slot name="TextInput_Label" />
            {/* native input */}
        </View>
        <Slot name="TextInput_Right" />
        {children}
        <Slot name="TextInput_SupportingText" />
    </View>
);
```

### 3. Transform rewrites `<Slot />` in component definitions

```tsx
// Before
<Slot name="TextInput_Label" />

// After
{__slots?.['TextInput_Label']}
```

### 4. Transform rewrites call sites

1. Reads `TextInput.__slots` via static import resolution
2. For each child, resolves its component → reads `.displayName`
3. If `displayName` is in `__slots`, moves it to the `__slots` prop
4. Leaves non-slot children in `children`

```tsx
// Before
<TextInput>
    <TextInput.Label>Email</TextInput.Label>
    <TextInput.Left><Icon /></TextInput.Left>
    <SomeOtherThing />
</TextInput>

// After
<TextInput __slots={{
    TextInput_Label: <TextInput.Label>Email</TextInput.Label>,
    TextInput_Left: <TextInput.Left><Icon /></TextInput.Left>,
}}>
    <SomeOtherThing />
</TextInput>
```

**How slot names are resolved without a `slot` prop:**
- Sees `<TextInput.Label>` → follows import → resolves to `TextInputLabel`
- Reads `TextInputLabel.displayName = 'TextInput_Label'` (static string literal in AST)
- Checks against `TextInput.__slots` → match → hoist

---

## Edge Cases

### Conditionals — rewritten into `__slots`

```tsx
// Consumer writes
<TextInput>
    {showLabel && <TextInput.Label>Email</TextInput.Label>}
    {isError
        ? <TextInput.Label>Error</TextInput.Label>
        : <TextInput.Label>Email</TextInput.Label>}
</TextInput>

// Transform rewrites to
<TextInput __slots={{
    TextInput_Label: showLabel
        ? <TextInput.Label>Email</TextInput.Label>
        : undefined,
    // last-wins: overwrites previous entry
    TextInput_Label: isError
        ? <TextInput.Label>Error</TextInput.Label>
        : <TextInput.Label>Email</TextInput.Label>,
}}>
</TextInput>
```

### Fragments — unwrapped

```tsx
// Before
<TextInput>
    <>
        <TextInput.Label>Email</TextInput.Label>
    </>
</TextInput>

// After — same result as a direct child
<TextInput __slots={{ TextInput_Label: <TextInput.Label>Email</TextInput.Label> }}>
</TextInput>
```

### Other cases

| Case | Behaviour |
|------|-----------|
| Multiple children with same slot name | Last-wins — matches current `extractSubcomponents` behaviour |
| `.map()` over slot component | Left in `children` — mapping over a named slot is semantically odd |
| Transform not configured | `Slot` renders at runtime → throws with a clear setup error |

---

## Runtime

Since the library ships source, the transform runs on everything at consumer build time in one pass — component definitions and call sites together.

### `Slot` component — error sentinel only

`<Slot />` is transformed away entirely and never called at runtime. Its only job is to throw a clear error if the transform was not configured:

```tsx
// packages/molecules/components/Slot/Slot.tsx
const Slot = ({ name }: { name: string }) => {
    throw new Error(
        `[molecules-slots] <Slot name="${name}" /> was not transformed. ` +
        `Configure the molecules-slots Metro transformer or unplugin in your bundler config.`
    );
};
```

No context. No fallback. No scanning. At runtime, slot access is a plain `__slots` prop read.

---

## Bundler Support

Metro is the primary target. unplugin covers the rest.

| Bundler | Adapter | Priority |
|---------|---------|----------|
| Metro | Custom Metro transformer | Primary |
| Vite | unplugin | Secondary |
| webpack 4/5 | unplugin | Secondary |
| Rollup | unplugin | Secondary |
| esbuild | unplugin | Secondary |
| Rspack | unplugin | Secondary |
| Re.Pack | unplugin (webpack adapter) | Secondary |

### Metro adapter

Metro exposes a `transformerPath` config option. The adapter hooks in there, intercepts each file, runs the SWC transform, and returns the result. Metro receives normal transformed source — it never knows about SWC.

`transformerPath` is a single value — you can't stack multiple transformers by just assigning twice. To handle composition, `molecules-slots/metro` exposes a `createTransformer` function that wraps an upstream transformer. This is the standard pattern in the Metro ecosystem (same approach used by `react-native-svg-transformer`).

#### Bare React Native

```js
// metro.config.js
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const { createTransformer } = require('molecules-slots/metro');

const config = {
    transformer: {
        // No upstream — molecules-slots wraps Metro's default transformer internally
        transformerPath: createTransformer(),
    },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
```

#### Expo

```js
// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');
const { createTransformer } = require('molecules-slots/metro');

const config = getDefaultConfig(__dirname);
// No upstream — wraps Metro's default transformer internally
config.transformer.transformerPath = createTransformer();

module.exports = config;
```

#### Composing with other transformers

`createTransformer` accepts an `upstreamTransformers` array. molecules-slots runs first, then each transformer in the array runs in order, each receiving the output of the previous:

```js
// metro.config.js
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const { createTransformer } = require('molecules-slots/metro');

const config = {
    transformer: {
        transformerPath: createTransformer({
            upstreamTransformers: [
                require.resolve('react-native-svg-transformer'),
                require.resolve('./my-custom-transformer'),
            ],
        }),
    },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
```

Execution order for the above:
```
molecules-slots → react-native-svg-transformer → my-custom-transformer
```

A single transformer is also accepted as shorthand:

```js
transformerPath: createTransformer({
    upstreamTransformers: require.resolve('react-native-svg-transformer'),
}),
```

### unplugin adapter

One plugin definition that unplugin adapts to each web bundler automatically.

#### Vite / Expo Web

```ts
// vite.config.ts
import { moleculesSlots } from 'molecules-slots/vite';

export default {
    plugins: [moleculesSlots()],
};
```

#### Next.js

```js
// next.config.js
const { moleculesSlots } = require('molecules-slots/webpack');

module.exports = {
    webpack(config) {
        config.plugins.push(moleculesSlots());
        return config;
    },
};
```

#### webpack

```js
// webpack.config.js
const { moleculesSlots } = require('molecules-slots/webpack');

module.exports = {
    plugins: [moleculesSlots()],
};
```

#### Rollup

```js
// rollup.config.js
import { moleculesSlots } from 'molecules-slots/rollup';

export default {
    plugins: [moleculesSlots()],
};
```

#### Re.Pack (webpack-based React Native bundler)

```js
// webpack.config.mjs
import { moleculesSlots } from 'molecules-slots/webpack';

export default {
    plugins: [moleculesSlots()],
};
```

---

## TypeScript

`__slots` is generated by the transform — consumers never write it manually.

```ts
// Helper type for component props
type WithSlots<Slots extends string> = {
    __slots?: Partial<Record<Slots, ReactNode>>;
};

// Usage in TextInput
type TextInputProps = BaseProps & WithSlots<
    'TextInput_Label' | 'TextInput_Left' | 'TextInput_Right' |
    'TextInput_SupportingText' | 'TextInput_Outline'
>;
```

To suppress TS errors on `__slots` in transformed consumer output, augment React's `Attributes` (shipped with molecules):

```ts
// types/slots.d.ts
declare module 'react' {
    interface Attributes {
        __slots?: Record<string, ReactNode>;
    }
}
```

---

## File Structure

```
packages/
  molecules-slots/
    src/
      core/
        index.ts            # SWC transform entry — runs both passes
        resolve.ts          # static resolution: follows imports, reads displayName + __slots
        transform-slot.ts   # pass 1: <Slot name="..." /> → __slots prop read
        transform-call.ts   # pass 2: call site children → __slots prop
      adapters/
        metro.ts            # Metro transformerPath adapter (primary)
        unplugin.ts         # unplugin adapter — Vite, webpack, Rollup, esbuild, Rspack
    package.json
    tsconfig.json
    PLAN.md

  molecules/
    components/
      Slot/
        Slot.tsx             # error sentinel — throws if transform not configured
        index.ts
    utils/
      extractSubcomponents.ts  # unchanged — still used by Appbar (dual-position title)
```

---

## Migration Steps

1. Build and unit-test the SWC core transform in isolation (`transform-slot`, `transform-call`)
2. Wire up the Metro adapter — test end-to-end in the example app
3. Add `Slot` error-sentinel component to molecules
4. Migrate `TextInput` as proof of concept — add `__slots`, replace `extractSubcomponents` with `<Slot />`
5. Verify the example app builds and runs correctly with the Metro adapter
6. Wire up the unplugin adapter — test with Vite (Expo Web)
7. Roll out to other compound components
8. Document consumer setup

---

## Learning Plan

Everything needed to build this from scratch, in order.

---

### Stage 1 — AST Fundamentals (start here, 1-2 days)

Before writing any transform, you need to be able to read an AST and know what nodes you're dealing with.

**Tool: [astexplorer.net](https://astexplorer.net)**
Paste any JSX and see the full AST in real time. This is the single most important tool. Use it constantly.

Key node types you'll encounter in this transform:
- `JSXElement` — any `<Foo>` element
- `JSXOpeningElement` — the opening tag, holds the component name
- `JSXMemberExpression` — `TextInput.Label` (it's not a simple identifier)
- `JSXAttribute` — props like `name="TextInput_Label"`
- `ObjectExpression` — object literals `{ key: value }`
- `AssignmentExpression` — `TextInput.__slots = [...]`
- `StringLiteral` / `Identifier` — values and names

Paste these into AST Explorer and study the output:
```tsx
<TextInput>
    <TextInput.Label>Email</TextInput.Label>
</TextInput>

TextInput.__slots = ['TextInput_Label'] as const;

TextInputLabel.displayName = 'TextInput_Label';
```

---

### Stage 2 — AST Manipulation with `@swc/core` JS API (2-3 days)

Do not use `@babel/parser` or `@babel/traverse` in the implementation — even as a library, not a plugin. Metro already uses Babel internally. Adding `@babel/parser` introduces a second Babel instance, potential version conflicts, and is slower than SWC. Use `@swc/core` from the start.

**Important**: astexplorer.net uses Babel's parser for visualization — that's fine for learning and exploring AST shapes. Just don't bring those packages into the implementation.

`@swc/core` exposes a Node.js API that lets you parse source code and visit/transform AST nodes from JavaScript, no Rust required:

```ts
import { parse } from '@swc/core';

const ast = await parse(
    `<TextInput><TextInput.Label>Email</TextInput.Label></TextInput>`,
    { syntax: 'typescript', tsx: true }
);

// Walk the AST manually or use @swc/core's visitor pattern
```

SWC's AST node names are similar to Babel's but not identical — use astexplorer.net (select "typescript" parser) to understand the shape, then map to `@swc/core` types.

**The Babel Plugin Handbook** (github.com/jamiebuilds/babel-handbook) is still worth reading for the visitor pattern and general AST manipulation concepts — just don't use the Babel packages themselves in implementation code.

Key `@swc/core` APIs:
- `parse` / `parseSync` — source → AST
- `print` — AST → source + source map
- `Visitor` class — walk and transform nodes

---

### Stage 3 — Static import resolution (the hard part, 2-3 days)

This is the trickiest piece of this specific transform. The challenge: when you see `<TextInput.Label>` in a file, you need to find where `TextInput` was imported from, follow that import, read the `TextInputLabel.displayName` assignment from the source of that file.

This is called **cross-file static analysis**. It's what makes transforms like this hard.

Concepts to learn:
- How `import` declarations map to file paths (module resolution)
- How to read a second file's AST during a transform
- How to follow re-exports (`export { TextInputLabel as Label } from './TextInput'`)

Study these real-world examples:
- `babel-plugin-module-resolver` — follows imports to resolve paths
- `babel-plugin-import` (from Ant Design) — resolves component imports to their source files

The key insight: you build a small in-memory cache. The first time you encounter `TextInput`, you resolve its import path, parse that file, scan for `__slots` and `displayName` assignments, cache the result. Subsequent references use the cache.

---

### Stage 4 — Metro transformer API (1-2 days)

Metro's transformer is a Node.js module that exports a `transform` function. It receives a file's source code and returns transformed code + source map.

**Read these in order:**
1. Metro docs: "Configuring Metro" → `transformer.transformerPath`
2. Source of `metro-react-native-babel-transformer` — this is the default. See what a real transformer looks like.
3. Source of `react-native-svg-transformer` — the simplest real-world custom transformer. ~100 lines. Read every line.

The transformer function signature:
```ts
export async function transform(
    config: JsTransformerConfig,
    projectRoot: string,
    filename: string,
    data: Buffer,
    options: JsTransformOptions,
): Promise<TransformResponse>
```

For chaining (`upstreamTransformers`), study how `react-native-svg-transformer` calls through to the upstream transformer for non-SVG files.

---

### Stage 5 — unplugin (1 day)

unplugin gives you one plugin API that works with Vite, webpack, Rollup, esbuild, and Rspack.

**Read:** [unplugin README](https://github.com/unjs/unplugin) + the starter template.

The core hook you'll use is `transform`:
```ts
import { createUnplugin } from 'unplugin';

export const moleculesSlots = createUnplugin(() => ({
    name: 'molecules-slots',
    transform(code, id) {
        if (!id.endsWith('.tsx') && !id.endsWith('.jsx')) return;
        const result = runSWCTransform(code, id);
        return { code: result.code, map: result.map };
    },
}));
```

That's most of it. The hard work is in `runSWCTransform` which you'll have already built in Stage 2-3.

---

### Stage 6 — SWC (when ready to move off Babel tools, 3-5 days)

Once the transform is working with Babel tools, port it to SWC for production performance.

Two paths:

**Path A — SWC via Node.js JS API (no Rust)**
Use `@swc/core`'s `transform` with a JS-based visitor. The API is less mature than Babel traverse but works fine for most cases. The AST shapes are similar but not identical to Babel's.

**Path B — Native SWC plugin in Rust (advanced)**
Write the transform in Rust, compile to Wasm. Maximum performance. Requires:
- Basic Rust (The Rust Book — doc.rust-lang.org/book — chapters 1-10 are enough)
- SWC plugin API (`swc_core` crate, visitor pattern)
- `wasm-pack` for building

Start with Path A. Only go to Path B if Metro build times become a real problem.

**Reference**: Look at how `react-native-unistyles` v3 implemented their SWC transform — they've solved the same Metro + SWC integration problem.

---

### Recommended order of real implementation

1. Use astexplorer.net to understand the AST shapes you need to handle (Stage 1)
2. Write the transform logic using `@swc/core` JS API (Stage 2-3)
3. Wrap it in a Metro transformer (Stage 4) — get it working end-to-end
4. Wrap it in unplugin (Stage 5)
5. Port to native SWC Rust plugin (Stage 6) only if build performance requires it

No Babel in implementation code at any stage.

---

## Open Questions

- `__slots` type: `ReactElement` or `ReactNode`? Leaning `ReactNode` for flexibility.
- `forwardRef`-wrapped components at call sites: the transform needs to look through the wrapper to read `displayName`.
- SWC Wasm vs native bindings in Metro: Wasm adds startup cost — measure and decide.
- Package naming: `molecules-slots` or `unplugin-molecules-slots` (convention for unplugin packages)?
