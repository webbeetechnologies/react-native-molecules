# babel-molecules-slots

A Babel plugin that transforms named slot usage in bamboo-molecules compound components at compile time — zero runtime scanning overhead, no `slot` prop required.

The library ships source. The plugin runs on all code — both library source and consumer code — at consumer build time in a single pass.

---

## Problem

Compound components like `TextInput` currently use `extractSubcomponents` to scan `children` on every render and route each child to the right position in the layout. This works but runs on every render.

```tsx
// Consumer writes this today
<TextInput>
    <TextInput.Label>Email</TextInput.Label>
    <TextInput.Left><Icon name="mail" /></TextInput.Left>
</TextInput>

// Parent does this on every render
const { TextInput_Label, TextInput_Left } = extractSubcomponents({ children, ... });
```

---

## Goal

Move the child-routing to compile time. The consumer API stays exactly the same. The plugin does the work.

```tsx
// Consumer writes — unchanged
<TextInput>
    <TextInput.Label>Email</TextInput.Label>
    <TextInput.Left><Icon name="mail" /></TextInput.Left>
</TextInput>

// Plugin transforms call site to
<TextInput __slots={{
    TextInput_Label: <TextInput.Label>Email</TextInput.Label>,
    TextInput_Left: <TextInput.Left><Icon name="mail" /></TextInput.Left>,
}}>
</TextInput>

// Component reads slots as props — O(1), no scanning
{props.__slots?.TextInput_Label ?? null}
{props.__slots?.TextInput_Left ?? null}
```

---

## How It Works

### 1. Component declares its slots (co-located)

```ts
TextInput.__slots = [
    'TextInput_Label',
    'TextInput_Left',
    'TextInput_Right',
    'TextInput_SupportingText',
    'TextInput_Outline',
] as const;
```

The plugin reads this static array from the import when processing call sites.

### 2. Component uses `<Slot />` as placeholder

```tsx
import { Slot } from '../Slot';

const TextInput = ({ children, __slots }) => (
    <View>
        <Slot name="TextInput_Outline" fallback={<TextInputOutline />} />
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

### 3. Plugin transforms the component definition

`<Slot name="..." />` becomes a direct prop read:

```tsx
// Before
<Slot name="TextInput_Label" />
<Slot name="TextInput_Outline" fallback={<TextInputOutline />} />

// After
{props.__slots?.['TextInput_Label'] ?? null}
{props.__slots?.['TextInput_Outline'] ?? <TextInputOutline />}
```

### 4. Plugin transforms call sites

At every `<TextInput>` call site:

1. Read `TextInput.__slots` via static import resolution
2. For each direct child, resolve its component → read `.displayName`
3. If `displayName` is in `__slots`, move to `__slots` prop
4. Leave non-slot children in `children`

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

**How the plugin resolves slot names:**
- Sees `<TextInput.Label>` → follows import → resolves to `TextInputLabel` export
- Reads `TextInputLabel.displayName = 'TextInput_Label'` (static string literal in AST)
- Checks `'TextInput_Label'` against `TextInput.__slots` → match → hoist

No `slot` prop needed. No changes to consumer API.

---

## Edge Cases

The plugin aims for full parity with `extractSubcomponents`. The same patterns that work at runtime should work with the plugin.

### Conditionals — transformed, not skipped

The plugin rewrites the conditional expression into the `__slots` value:

```tsx
// Consumer writes
<TextInput>
    {showLabel && <TextInput.Label>Email</TextInput.Label>}
    {isError ? <TextInput.Label>Error</TextInput.Label> : <TextInput.Label>Email</TextInput.Label>}
</TextInput>

// Plugin transforms to
<TextInput __slots={{
    // && becomes ternary
    TextInput_Label: showLabel ? <TextInput.Label>Email</TextInput.Label> : undefined,
    // ternary stays ternary (last-wins: second assignment overwrites first)
    TextInput_Label: isError ? <TextInput.Label>Error</TextInput.Label> : <TextInput.Label>Email</TextInput.Label>,
}}>
</TextInput>
```

### Maps — left in children (unusual for named slots)

`.map()` over a named slot is semantically odd — slots are single-instance by convention. Leave mapped children in `children` and let the runtime handle them via the fallback path.

### Other cases

| Case | Behaviour |
|------|-----------|
| Fragment wrapping: `<><TextInput.Label>...</></>` | Unwrap and hoist the inner element |
| Multiple children with same slot name | Last-wins (matches current `extractSubcomponents` behaviour) |
| `<Slot>` with `fallback` | `?? fallback` in transformed output |
| Plugin not installed | `Slot` renders at runtime → throws with a clear setup error |

---

## Runtime

Since the library ships source, the plugin runs on everything at consumer build time — component definitions and call sites together. There is no separate "library compiled output" to worry about.

### `Slot` component

`<Slot />` exists only as an error sentinel. When the plugin runs it is transformed away entirely and never called. When the plugin is absent (misconfigured consumer), `Slot` renders at runtime and throws:

```tsx
// packages/molecules/components/Slot/Slot.tsx
const Slot = ({ name }: { name: string }) => {
    throw new Error(
        `[babel-molecules-slots] <Slot name="${name}" /> was rendered without being transformed. ` +
        `Add babel-molecules-slots to your babel.config.js.`
    );
};
```

No context, no fallback scanning. If you see this error, the plugin is not configured.

### What the plugin produces

**Component definition** (library source, transformed at consumer build time):

```tsx
// Source
const TextInput = ({ children, __slots }) => (
    <View>
        <Slot name="TextInput_Outline" fallback={<TextInputOutline />} />
        <Slot name="TextInput_Left" />
        <View>
            <Slot name="TextInput_Label" />
        </View>
        <Slot name="TextInput_Right" />
        {children}
        <Slot name="TextInput_SupportingText" />
    </View>
);

// After plugin
const TextInput = ({ children, __slots }) => (
    <View>
        {__slots?.['TextInput_Outline'] ?? <TextInputOutline />}
        {__slots?.['TextInput_Left']}
        <View>
            {__slots?.['TextInput_Label']}
        </View>
        {__slots?.['TextInput_Right']}
        {children}
        {__slots?.['TextInput_SupportingText']}
    </View>
);
```

**Call site** (consumer code, transformed at consumer build time):

```tsx
// Source
<TextInput>
    <TextInput.Label>Email</TextInput.Label>
    <TextInput.Left><Icon /></TextInput.Left>
    <SomeOtherThing />
</TextInput>

// After plugin
<TextInput __slots={{
    TextInput_Label: <TextInput.Label>Email</TextInput.Label>,
    TextInput_Left: <TextInput.Left><Icon /></TextInput.Left>,
}}>
    <SomeOtherThing />
</TextInput>
```

Both transforms happen in the same build pass. At runtime, slot access is a plain property read — no scanning, no context, no hooks.

---

## TypeScript

`__slots` is generated by the plugin, consumers never write it manually. To keep TypeScript happy in the component definition:

```ts
// Helper type
type WithSlots<Slots extends string> = {
    __slots?: Partial<Record<Slots, ReactElement>>;
};

// Usage in component props
type TextInputProps = BaseProps & WithSlots<
    'TextInput_Label' | 'TextInput_Left' | 'TextInput_Right' |
    'TextInput_SupportingText' | 'TextInput_Outline'
>;
```

For the global `__slots` prop (to avoid TS errors in plugin output), augment `IntrinsicAttributes`:

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
  babel-molecules-slots/
    src/
      index.ts            # plugin entry, wires together the two visitors
      resolve.ts          # follows imports, reads displayName + __slots statically
      transform-slot.ts   # visitor: <Slot name="..." /> → prop read
      transform-call.ts   # visitor: call site child hoisting
    package.json
    tsconfig.json
    PLAN.md               # this file

  molecules/
    components/
      Slot/
        Slot.tsx           # error sentinel — throws if plugin not configured
        index.ts
    utils/
      extractSubcomponents.ts  # unchanged, still used by Appbar and other non-slot components
```

---

## Migration Steps

1. Build and unit-test the plugin standalone (transform-slot, transform-call separately)
2. Add `Slot` error-sentinel component to molecules
3. Migrate `TextInput` as proof of concept — add `__slots`, replace `extractSubcomponents` call with `<Slot />` placeholders
4. Add plugin to the example app's `babel.config.js` and verify end-to-end
5. Roll out to other compound components
6. Document consumer setup: add `babel-molecules-slots` to `babel.config.js`

---

## Open Questions

- Should `__slots` accept `ReactElement` or `ReactNode`? Leaning `ReactNode` for flexibility.
- How to handle `forwardRef`-wrapped components at call sites? Plugin needs to look through the wrapper to read `displayName`.
- Should the plugin warn (or error) when a child's `displayName` matches a slot but the parent doesn't declare `__slots`? Probably a no-op with an optional `--verbose` flag.
- Metro (RN) compatibility: Metro uses Babel under the hood — standard Babel plugins work. Confirm with a smoke test.
