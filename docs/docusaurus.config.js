// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import path from 'path';
import { themes as prismThemes } from 'prism-react-renderer';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/** @type {import('@docusaurus/types').Config} */
const config = {
    title: 'Bamboo Molecules',
    tagline: 'React Native + Web components built on Material 3',
    favicon: 'img/favicon.ico',

    // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
    future: {
        v4: true, // Improve compatibility with the upcoming Docusaurus v4
    },

    // Set the production url of your site here
    url: 'https://webbeetechnologies.github.io',
    // Set the /<baseUrl>/ pathname under which your site is served
    // For GitHub pages deployment, it is often '/<projectName>/'
    baseUrl: '/bamboo-molecules/',

    // GitHub pages deployment config.
    // If you aren't using GitHub pages, you don't need these.
    organizationName: 'webbeetechnologies', // Usually your GitHub org/user name.
    projectName: 'bamboo-molecules', // Usually your repo name.
    trailingSlash: false,

    onBrokenLinks: 'throw',

    // Even if you don't use internationalization, you can use this field to set
    // useful metadata like html lang. For example, if your site is Chinese, you
    // may want to replace "en" with "zh-Hans".
    i18n: {
        defaultLocale: 'en',
        locales: ['en'],
    },

    presets: [
        [
            'classic',
            /** @type {import('@docusaurus/preset-classic').Options} */
            ({
                docs: {
                    sidebarPath: './sidebars.js',
                    // Please change this to your repo.
                    // Remove this to remove the "edit this page" links.
                    editUrl:
                        'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
                },
                theme: {
                    customCss: './src/css/custom.css',
                },
            }),
        ],
    ],

    themeConfig:
        /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
        ({
            // Replace with your project's social card
            image: 'img/docusaurus-social-card.jpg',
            colorMode: {
                respectPrefersColorScheme: true,
            },
            navbar: {
                title: 'Bamboo Molecules',
                logo: {
                    alt: 'Bamboo Molecules Logo',
                    src: 'img/logo.svg',
                },
                items: [
                    {
                        type: 'doc',
                        docId: 'getting-started/introduction',
                        position: 'left',
                        label: 'Getting Started',
                    },
                    // {
                    //     type: 'docSidebar',
                    //     docId: 'components/button',
                    //     sidebarId: 'componentSidebar',
                    //     position: 'left',
                    //     label: 'Components',
                    // },
                    {
                        href: 'https://github.com/webbeetechnologies/bamboo-molecules',
                        label: 'GitHub',
                        position: 'right',
                    },
                ],
            },
            footer: {
                style: 'dark',
                links: [
                    {
                        title: 'Docs',
                        items: [
                            {
                                label: 'Tutorial',
                                to: '/docs/getting-started/introduction',
                            },
                        ],
                    },
                    {
                        title: 'Community',
                        items: [
                            {
                                label: 'Stack Overflow',
                                href: 'https://stackoverflow.com/questions/tagged/docusaurus',
                            },
                            {
                                label: 'Discord',
                                href: 'https://discordapp.com/invite/docusaurus',
                            },
                            {
                                label: 'X',
                                href: 'https://x.com/docusaurus',
                            },
                        ],
                    },
                    {
                        title: 'More',
                        items: [
                            {
                                label: 'GitHub',
                                href: 'https://github.com/webbeetechnologies/bamboo-molecules',
                            },
                        ],
                    },
                ],
                copyright: `Copyright © ${new Date().getFullYear()} Bamboo Molecules. Built with Docusaurus.`,
            },
            prism: {
                theme: prismThemes.github,
                darkTheme: prismThemes.dracula,
            },
        }),

    plugins: [
        function (_context, _options) {
            const webpack = require('webpack');
            const workspaceMoleculesDir = path.resolve(__dirname, '../packages/molecules');
            const vectorIconPackages = [
                '@react-native-vector-icons/common',
                '@react-native-vector-icons/feather',
                '@react-native-vector-icons/material-design-icons',
            ];
            const vectorIconPackageDirs = /** @type {string[]} */ (
                vectorIconPackages
                    .map(pkg => {
                        try {
                            return path.dirname(
                                require.resolve(`${pkg}/package.json`, { paths: [__dirname] }),
                            );
                        } catch {
                            return null;
                        }
                    })
                    .filter(Boolean)
            );

            return {
                name: 'react-native-web-plugin',
                configureWebpack(webpackConfig, isServer, utils) {
                    webpackConfig.plugins = webpackConfig.plugins || [];
                    if (!isServer) {
                        webpackConfig.plugins.push(
                            new webpack.DefinePlugin({
                                __DEV__: JSON.stringify(process.env.NODE_ENV === 'development'),
                            }),
                        );
                    }

                    const resolveAlias = {
                        'react-native$': 'react-native-web',
                        // '@react-native-vector-icons/get-image': path.resolve(
                        //     __dirname,
                        //     './src/polyfills/reactNativeVectorIconsGetImage',
                        // ),
                    };
                    webpackConfig.resolve = webpackConfig.resolve || {};
                    webpackConfig.resolve.alias = {
                        ...(webpackConfig.resolve.alias || {}),
                        ...resolveAlias,
                    };
                    const extensionPreference = [
                        '.web.js',
                        '.web.jsx',
                        '.web.ts',
                        '.web.tsx',
                        '.js',
                        '.jsx',
                        '.ts',
                        '.tsx',
                        '.json',
                    ];
                    const existingExtensions = webpackConfig.resolve.extensions || [];
                    webpackConfig.resolve.extensions = Array.from(
                        new Set([...extensionPreference, ...existingExtensions]),
                    );

                    const extraTranspileTargets = [
                        workspaceMoleculesDir,
                        ...vectorIconPackageDirs,
                    ].filter(Boolean);

                    if (extraTranspileTargets.length > 0) {
                        webpackConfig.module = webpackConfig.module || {};
                        webpackConfig.module.rules = webpackConfig.module.rules || [];
                        
                        const jsLoader = utils.getJSLoader({ isServer });
                        // Ensure we use our local babel config for these external files
                        // because they are outside the root of 'docs' and won't find babel.config.js otherwise
                        if (jsLoader && typeof jsLoader === 'object' && jsLoader.options && typeof jsLoader.options === 'object') {
                            // @ts-ignore
                            jsLoader.options.configFile = path.resolve(__dirname, 'babel.config.js');
                        }

                        webpackConfig.module.rules.push({
                            test: /\.[jt]sx?$/,
                            include: extraTranspileTargets,
                            use: jsLoader,
                        });
                    }

                    return {};
                },
            };
        },
    ],
};

export default config;
