# molecules-registry

Compile-time resolution for `react-native-molecules`' component registry. Swap out any `Button`, `TextInput`, their styles or utils — and drop the defaults from your bundle.

## Why

molecules lets you replace any component at runtime via `registerMolecules({ Button: { component: MyButton } })`. That works, but the defaults still ship in your bundle because the bundler can't statically tell which ones you replaced.

This package solves that. It rewrites every `getRegisteredComponentWithFallback('Button', DefaultButton)` call site at build time — if you declared an override for `Button`, the call becomes a direct reference to your component and the default import is dropped. The bundler tree-shakes it away.

Zero runtime cost. Zero API change for your components.

## Install

```sh
pnpm add -D molecules-registry
```

## Setup

### 1. Declare overrides

Create `molecules.overrides.ts` at your project root:

```ts
import type { MoleculesOverrides } from 'molecules-registry';
import MyButton from './src/components/MyButton';
import MyButtonStyles from './src/components/MyButton.styles';

const overrides: MoleculesOverrides = {
    components: {
        Button: MyButton,
    },
    styles: {
        Button: MyButtonStyles,
    },
};

export default overrides;
```

You only need to list what you're overriding. Anything you don't list keeps the default.

### 2. Wire up the transform

#### Metro (React Native / Expo)

```js
// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');
const { createTransformer } = require('molecules-registry/metro');

const config = getDefaultConfig(__dirname);

config.transformer.transformerPath = createTransformer({
    overridesFile: './molecules.overrides.ts',
    autoProcessPaths: [
        'react-native-molecules',
        // add any third-party package that uses molecules internally:
        // 'some-ui-kit',
    ],
});

module.exports = config;
```

`autoProcessPaths` tells the transformer which packages in `node_modules` to rewrite. molecules itself always goes here. Add any third-party library that is built on molecules and whose registry lookups you also want rewritten.

#### Composing with other transformers

```js
config.transformer.transformerPath = createTransformer({
    overridesFile: './molecules.overrides.ts',
    autoProcessPaths: ['react-native-molecules'],
    upstreamTransformers: [
        require.resolve('molecules-slots/metro'),
        require.resolve('react-native-svg-transformer'),
    ],
});
```

Execution order: `molecules-registry → molecules-slots → svg-transformer → Metro default`.

#### Vite / Expo Web

```ts
// vite.config.ts
import { moleculesRegistry } from 'molecules-registry/vite';

export default {
    plugins: [
        moleculesRegistry({
            overridesFile: './molecules.overrides.ts',
            autoProcessPaths: ['react-native-molecules'],
        }),
    ],
};
```

Same `moleculesRegistry()` export is available at `/webpack`, `/rollup`, `/esbuild`, `/rspack`.

## How it works

Before:

```tsx
import { Button as DefaultButton } from './DefaultButton';
const Button = getRegisteredComponentWithFallback('Button', DefaultButton);
```

After (override declared):

```tsx
import _override_Button from '<absolute path to your MyButton>';
const Button = _override_Button;
```

After (no override declared):

```tsx
import { Button as DefaultButton } from './DefaultButton';
const Button = DefaultButton;
```

The runtime registry still exists as a fallback, so Storybook, Jest, and apps without this transform keep working unchanged.

## Transitive dependencies

If you depend on `some-ui-kit` which itself uses molecules internally, add `'some-ui-kit'` to `autoProcessPaths`. Your override for `Button` will be applied to every call site in every listed package — including theirs.

```js
autoProcessPaths: [
    'react-native-molecules',
    'some-ui-kit',
],
```

Without that entry, the transform leaves `some-ui-kit`'s code alone and that package continues to use molecules' defaults at runtime.

## What gets rewritten

All three registry helpers:

- `getRegisteredComponentWithFallback(name, default)` — components
- `getRegisteredComponentStylesWithFallback(name, default)` — styles
- `getRegisteredComponentUtilsWithFallback(name, default, key?)` — utils

Only calls where the first argument is a string literal get rewritten. Dynamic names (`getRegisteredComponentWithFallback(name, default)`) fall through to the runtime registry.

## TypeScript

Import the `MoleculesOverrides` type from the package to get autocomplete and type-checking on your overrides file:

```ts
import type { MoleculesOverrides } from 'molecules-registry';

const overrides: MoleculesOverrides = { /* ... */ };
export default overrides;
```

## License

MIT
