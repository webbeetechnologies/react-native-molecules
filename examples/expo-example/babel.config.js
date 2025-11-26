module.exports = function (api) {
    api.cache(true);
    const unistylesPluginOptions = {
        root: 'src',
        autoProcessPaths: [
            // this is not repetition, this is for when linking the molecules
            'packages/molecules',
            // this is for when molecules is installed normally
            'react-native-molecules',
            "@react-native-vector-icons/common"
        ],
    };

    return {
        // or for Expo
        presets: [
            [
                'babel-preset-expo',
                {
                    unstable_transformImportMeta: true,
                },
            ],
        ],

        // other config
        plugins: [
            ['@babel/plugin-proposal-decorators', { legacy: true }],
            ['@babel/plugin-transform-class-properties', { loose: true }],
            [
                '@babel/plugin-transform-runtime',
                { version: require('@babel/runtime/package.json').version, useESModules: false },
            ],
            '@babel/plugin-transform-class-static-block',
            ['react-native-unistyles/plugin', unistylesPluginOptions],
        ],
    };
};
