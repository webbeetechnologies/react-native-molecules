# molecules-registry

A compile-time transform that resolves `getRegisteredComponentWithFallback` (and its styles/utils siblings) into direct references — so user overrides tree-shake the defaults instead of bundling both.

The library ships source. The transform runs on all code — molecules source, consumer code, and any declared third-party packages — at consumer build time in a single pass.

---

## Problem

molecules ships a runtime registry so consumers can replace any `Button`, `TextInput`, their styles or utils. Current implementation:

```ts
// packages/molecules/core/componentsRegistry.ts
export function getRegisteredComponentWithFallback<T extends ComponentType<any>>(
    name: string,
    defaultComponent: T,
): T {
    return (getRegisteredMoleculesComponent(name) ?? defaultComponent) as T;
}
```

Used inside every component:

```tsx
import { Button as DefaultButton } from './DefaultButton';
const Button = getRegisteredComponentWithFallback('Button', DefaultButton);
```

Even when a consumer registers their own `Button`, the default is still a **static import** at the call site. Bundlers (Metro, webpack, Rollup) cannot tree-shake it — they must keep it in case the runtime lookup returns `undefined`. The user ships both.

The more components a consumer overrides, the worse the bundle bloat. At full replacement, they ship two of everything.

---

## Goal

Resolve registry lookups at compile time. Consumer API stays the same (`registerMolecules({ Button: { component: MyButton } })` still works at runtime for Storybook, tests, unconfigured environments). When the transform is configured and a consumer has declared an override, the call site is rewritten to reference the override directly — defaults fall out of the bundle.

```tsx
// Consumer writes — unchanged
const Button = getRegisteredComponentWithFallback('Button', DefaultButton);

// Transform — override declared for 'Button'
import MyButton from '/abs/path/src/components/MyButton';
const Button = MyButton;
// DefaultButton import is removed → tree-shaken

// Transform — no override
const Button = DefaultButton;
// registry lookup eliminated → smaller runtime, still bundles default
```

Three helpers covered:
- `getRegisteredComponentWithFallback(name, default)` — components
- `getRegisteredComponentStylesWithFallback(name, default)` — styles
- `getRegisteredComponentUtilsWithFallback(name, default, key?)` — utils (note the optional `key`)

---

## Implementation

**Not a Babel plugin.** Babel AST transforms add a second Babel instance on top of Metro's own, fragile across syntax evolutions, and slower.

Instead:
- **Core**: SWC-based transform (Rust via `@swc/core` JS API initially, native Rust plugin later if needed)
- **Primary adapter**: Metro transformer (React Native — main target)
- **Secondary adapter**: unplugin (Vite, webpack, Rollup, esbuild, Rspack — web / Expo Web)

Same architecture as `molecules-slots`. Transform logic is written once; adapters are thin wrappers.

---

## How It Works

### 1. Consumer declares overrides

A config file resolved statically by the plugin at startup:

```ts
// molecules.overrides.ts
import MyButton from './src/components/MyButton';
import MyButtonStyles from './src/components/MyButton.styles';

export default {
    components: {
        Button: MyButton,
    },
    styles: {
        Button: MyButtonStyles,
    },
    utils: {
        // 'Button': { someHelper: myHelper }
    },
} as const;
```

Why a TS file and not JSON: imports resolve through the project's tsconfig paths, types flow through, and the plugin can statically read import specifiers without executing user code.

### 2. Plugin tells the transform which packages to process

Following [react-native-unistyles](examples/expo-example/babel.config.js)'s `autoProcessPaths` pattern — consumers list the packages that contain registry call sites:

```js
// metro.config.js
const { createTransformer } = require('molecules-registry/metro');

config.transformer.transformerPath = createTransformer({
    overridesFile: './molecules.overrides.ts',
    autoProcessPaths: [
        'react-native-molecules',     // defaults + molecules' own internal call sites
        'some-ui-kit',                // third-party lib that uses molecules
        'packages/molecules',         // monorepo/linked source
    ],
});
```

The transform only rewrites files whose path matches `autoProcessPaths` **or** lives under the project root. Everything else passes through untouched. This is what makes it work across `node_modules` and transitive deps.

### 3. Transform rewrites call sites

Pass 1 — identify calls where the callee is `getRegisteredComponentWithFallback` (or the styles/utils variants). Resolve by binding, not identifier name, so minified/renamed imports still match.

Pass 2 — inspect the first arg (must be a string literal). If it's not, leave the call alone — runtime path stays.

Pass 3 — rewrite based on override table:

```tsx
// Input
import { Button as DefaultButton } from './DefaultButton';
const Button = getRegisteredComponentWithFallback('Button', DefaultButton);

// Output (override present)
import _override_Button from '/abs/path/src/components/MyButton';
const Button = _override_Button;
// 'DefaultButton' import removed if now unused

// Output (no override)
const Button = DefaultButton;
```

Pass 4 — dead-import removal. After rewriting, walk the file and drop imports that have no remaining references. The bundler can then tree-shake the target files.

---

## Edge Cases

### Dynamic names

```tsx
const Button = getRegisteredComponentWithFallback(name, DefaultButton);
```

First arg is not a string literal → leave the call intact, runtime path handles it.

### Partial overrides

```tsx
// Override table has 'Button' but not 'TextInput'
getRegisteredComponentWithFallback('Button', DefaultButton);     // → rewritten to MyButton
getRegisteredComponentWithFallback('TextInput', DefaultText);    // → rewritten to DefaultText (direct ref, no lookup)
```

### Styles — same shape, different helper

```tsx
const styles = getRegisteredComponentStylesWithFallback('Button', defaultStyles);
// → const styles = overrideTable.styles.Button ?? defaultStyles (rewritten statically)
```

### Utils with optional `key`

```tsx
getRegisteredComponentUtilsWithFallback('Button', defaultFn, 'formatLabel');
// Override shape is utils.Button.formatLabel → resolved statically
// Without a key: entire utils object for that component name
```

### Transform not configured

Call sites are left untouched. The runtime `getRegisteredComponentWithFallback` still works. This means Storybook, Jest, and apps without the plugin keep working — zero breakage.

### Minified/renamed imports in published third-party code

The plugin resolves the callee via scope binding, not identifier name. `_m.getRegisteredComponentWithFallback` still matches if the binding traces back to `react-native-molecules`.

### Duplicate molecules in node_modules (hoisting failure)

Each `getRegisteredComponentWithFallback` call site is rewritten independently. The override import resolves to one absolute path, so the bundler dedupes the override. Defaults from both copies drop out.

---

## Runtime

The runtime registry (`componentsRepository` etc.) stays in place, unchanged. It serves:

- Environments without the transform (Storybook, Jest, unconfigured apps)
- Dynamic `getRegisteredComponentWithFallback(someVar, ...)` calls the transform skipped
- Any consumer who prefers runtime registration over build-time config

The transform is purely additive — opting in means better bundle size; opting out means current behavior.

---

## Bundler Support

Same adapter matrix as `molecules-slots`.

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

`transformerPath` wraps an upstream transformer (same composition pattern as `react-native-svg-transformer` and `molecules-slots/metro`):

```js
// metro.config.js
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const { createTransformer } = require('molecules-registry/metro');

const config = {
    transformer: {
        transformerPath: createTransformer({
            overridesFile: './molecules.overrides.ts',
            autoProcessPaths: [
                'react-native-molecules',
                'some-ui-kit',
            ],
        }),
    },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
```

Composing with other transformers:

```js
transformerPath: createTransformer({
    overridesFile: './molecules.overrides.ts',
    autoProcessPaths: ['react-native-molecules'],
    upstreamTransformers: [
        require.resolve('molecules-slots/metro'),
        require.resolve('react-native-svg-transformer'),
    ],
}),
```

Execution order: `molecules-registry → molecules-slots → svg-transformer → Metro default`.

### unplugin adapter

```ts
// vite.config.ts
import { moleculesRegistry } from 'molecules-registry/vite';

export default {
    plugins: [
        moleculesRegistry({
            overridesFile: './molecules.overrides.ts',
            autoProcessPaths: ['react-native-molecules', 'some-ui-kit'],
        }),
    ],
};
```

Same `moleculesRegistry()` export is re-exposed under `/webpack`, `/rollup`, `/esbuild`, `/rspack`.

---

## Why `autoProcessPaths`

Metro and most web bundlers **skip `node_modules` transformation by default** for speed. molecules and any third-party ui-kit built on top of it live in `node_modules`, so without an opt-in list, the transform would never see those call sites.

`autoProcessPaths` is the standard pattern in the RN ecosystem for this problem — `react-native-unistyles` uses it, `react-native-reanimated`'s plugin uses a similar include list internally. It gives the consumer explicit control and keeps Metro's default fast-path intact for everything else.

Matching rules:
- String in the list → treated as a substring match against the absolute module path (e.g. `'react-native-molecules'` matches `…/node_modules/react-native-molecules/components/Button/index.ts`)
- Files under the project root are always processed
- `node_modules` paths outside the list are skipped — zero cost

---

## TypeScript

Types on the overrides file give the consumer autocomplete and catches typos:

```ts
// molecules-registry/types.d.ts — shipped with the package
export interface MoleculesOverrides {
    components?: {
        Button?: ComponentType<ButtonProps>;
        TextInput?: ComponentType<TextInputProps>;
        // … generated from molecules' public component list
    };
    styles?: { /* … */ };
    utils?: { /* … */ };
}
```

Consumers:

```ts
import type { MoleculesOverrides } from 'molecules-registry';
const overrides: MoleculesOverrides = { components: { Button: MyButton } };
export default overrides;
```

---

## File Structure

```
packages/
  molecules-registry/
    src/
      core/
        index.ts              # SWC transform entry
        load-overrides.ts     # parse overridesFile, extract override map + abs import paths
        resolve-callee.ts     # binding-based match for the 3 getRegistered* helpers
        rewrite-call.ts       # pass that rewrites a matched call site
        prune-imports.ts      # dead-import removal after rewrites
        path-filter.ts        # autoProcessPaths matching
      adapters/
        metro.ts              # Metro transformerPath adapter (primary)
        unplugin.ts           # unplugin adapter — Vite, webpack, Rollup, esbuild, Rspack
    package.json
    tsconfig.json
    README.md
    PLAN.md
```

---

## Migration Steps

1. Build the SWC core transform in isolation. Unit-test `resolve-callee`, `rewrite-call`, `prune-imports` against fixtures
2. Wire up the Metro adapter. Test end-to-end in `examples/expo-example`
3. Add `molecules.overrides.ts` to the example app with a swapped-out `Button`. Verify the default `Button` is absent from the bundle (via `metro bundle --dev=false --platform=ios` + bundle-size tooling)
4. Extend to styles and utils variants
5. Add the unplugin adapter. Test with Vite (Expo Web)
6. Document consumer setup in README
7. Publish as `molecules-registry` with matching major version track as molecules

---

## Learning Plan

Same stages as [molecules-slots PLAN.md](../molecules-slots/PLAN.md) — AST fundamentals, `@swc/core` JS API, Metro transformer API, unplugin, optional native Rust plugin. This transform is mechanically simpler than molecules-slots (no cross-file displayName resolution) so **Stage 3 (static import resolution) collapses to just loading one file — the overrides file — at startup**.

Skip straight to:
1. Stage 1 — AST Fundamentals (shared)
2. Stage 2 — `@swc/core` JS API (shared)
3. Stage 4 — Metro transformer API (shared)
4. Stage 5 — unplugin (shared)

---

## Open Questions

- **Overrides file format**: TS module with default export (proposed) vs. explicit config object in `metro.config.js`? TS wins on type-safety; config-object wins on not needing static import resolution in the plugin.
- **Shared config between adapters**: should `molecules.overrides.ts` live at a conventional path (`<projectRoot>/molecules.overrides.ts`) so Metro and unplugin both auto-discover it?
- **Partial styles overrides**: if consumer overrides `Button.styles.pressed` only, do we deep-merge with the default or require a full replacement? Runtime API currently does full replacement — compile-time should match for consistency.
- **Interaction with `molecules-slots`**: both transforms rewrite JSX/calls. Order matters — registry first (turns calls into direct refs), slots second (reads JSX structure). Document the ordering explicitly.
- **Measuring the win**: need a bundle-size benchmark in `examples/expo-example` before/after to quantify. Guess: ~20–40% reduction on apps that override most components.
