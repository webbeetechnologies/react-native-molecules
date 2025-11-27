React Native Molecules
================


<h3 align="center">
  Material 3-powered primitives for React Native + Web.<br/>
  <a href="https://github.com/webbeetechnologies/bamboo-molecules/tree/main/docs">Explore the docs</a>
</h3>

---

[![Build Status][build-badge]][build] [![Version][version-badge]][package] [![MIT License][license-badge]][license] [![All Contributors][all-contributors-badge]][all-contributors] [![PRs Welcome][prs-welcome-badge]][prs-welcome] [![Chat][chat-badge]][chat] [![Sponsored by TaylorDB][taylordb-badge]][taylordb]

<p align="center"><i>React Native Molecules ships a comprehensive library of React Native + Web components powered by Material 3 tokens. Every component includes production-ready props, sensible defaults, and playground docs in the `/docs` site.</i></p>

Why React Native Molecules?
---------------------

-   High performance – built on top of `react-native-unistyles`, with CSS variables on the web.
-   Modular & lightweight – no barrel files, self-registerable components, and optional peer deps.
-   Fully customizable – swap internal implementations or override styles using your own tokens.
-   Unified design – ships with Material 3 light/dark themes out-of-the-box.

Quick start
-----------

```tsx
import { Button } from 'react-native-molecules/components/Button';

export function MyComponent() {
    return <Button onPress={() => console.log('Pressed!')}>Click me</Button>;
}
```

Installation overview
---------------------

> Refer to `docs/docs/getting-started/installation.mdx` for the full walkthrough.

1. **Prerequisites**  
   - React Native New Architecture (Fabric)  
   - React 19 or higher
2. **Install the package**  
   ```bash
   pnpm add react-native-molecules
   ```  
   (npm and yarn examples are in the docs; pnpm is recommended for the monorepo.)
3. **Add peer dependencies**  
   Required:  
   ```bash
   pnpm add react-native-unistyles
   ```  
   Optional per-component deps, e.g. `FilePicker` requires `@react-native-documents/picker`.
4. **Configure fonts & icons (web)**  
   - Copy `MaterialDesignIcons.ttf` from `@react-native-vector-icons/material-design-icons/Fonts/` into your public assets.  
   - Register the font via `@font-face`.
5. **Register Unistyles themes**  
   Set up `StyleSheet.configure` with provided MD3 light/dark themes and your breakpoints for typed theme access.
6. **Wrap with `PortalProvider` (optional)**  
   Needed for components that render inside portals (e.g., `Popover`, `Tooltip`, `Menu`, `Modal`).

Next steps
----------

1. Read `docs/docs/getting-started/introduction.mdx` for an overview of the component catalog, hooks, and customization guides.
2. Follow the Installation guide above to wire up peer dependencies, fonts, and theming.
3. Explore the rest of the docs to dive into components, hooks, and utilities. Each entry includes prop tables, behavior notes, and playground examples.

Contributing
------------

We welcome issues and pull requests. Please ensure any new component stories and docs accompany your changes so they appear in the React Native Molecules docs site.

## Contributors

Thanks goes to these wonderful people ([emoji key](https://github.com/all-contributors/all-contributors#emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://github.com/thetaungg"><img src="https://avatars.githubusercontent.com/u/30053822?v=4" width="100px;" alt="Thet Aung"/><br /><sub><b>Thet Aung</b></sub></a><br /><a href="https://github.com/webbeetechnologies/react-native-molecules/commits?author=thetaungg" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/shashank1010"><img src="https://avatars.githubusercontent.com/u/3106368?v=4" width="100px;" alt="Shashank Shekhar"/><br /><sub><b>shashank1010</b></sub></a><br /><a href="https://github.com/webbeetechnologies/react-native-molecules/commits?author=shashank1010" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/elvisduru"><img src="https://avatars.githubusercontent.com/u/28690701?v=4" width="100px;" alt="Elvis Duru"/><br /><sub><b>elvisduru</b></sub></a><br /><a href="https://github.com/webbeetechnologies/react-native-molecules/commits?author=elvisduru" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/jasimawan"><img src="https://avatars.githubusercontent.com/u/31315869?v=4" width="100px;" alt="Jasim Awan"/><br /><sub><b>jasimawan</b></sub></a><br /><a href="https://github.com/webbeetechnologies/react-native-molecules/commits?author=jasimawan" title="Code">💻</a></td>
  </tr>
</table>
<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!

[build-badge]: https://github.com/webbeetechnologies/bamboo-molecules/actions/workflows/lint.yml/badge.svg
[build]: https://github.com/webbeetechnologies/bamboo-molecules/actions/workflows/lint.yml
[version-badge]: https://img.shields.io/npm/v/react-native-molecules.svg
[package]: https://www.npmjs.com/package/react-native-molecules
[license-badge]: https://img.shields.io/badge/license-MIT-green.svg
[license]: https://github.com/webbeetechnologies/bamboo-molecules/blob/main/LICENSE
[all-contributors-badge]: https://img.shields.io/badge/all_contributors-7-orange.svg?style=flat-square
[all-contributors]: #contributors
[prs-welcome-badge]: https://img.shields.io/badge/PRs-welcome-brightgreen.svg
[prs-welcome]: https://github.com/webbeetechnologies/bamboo-molecules/issues
[chat-badge]: https://img.shields.io/badge/chat-Discussions-5865F2.svg
[chat]: https://github.com/webbeetechnologies/bamboo-molecules/discussions
[taylordb-badge]: https://img.shields.io/badge/sponsored%20by-TaylorDB-000000.svg
[taylordb]: https://taylordb.com/
