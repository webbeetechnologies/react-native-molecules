module.exports = {
    presets: [require.resolve('@docusaurus/core/lib/babel/preset')],
    plugins: [
        [
            'react-native-unistyles/plugin',
            {
                root: 'src',
                autoProcessPaths: [
                    'packages/molecules',
                    'react-native-molecules',
                    '@react-native-vector-icons/common',
                    '@react-native-vector-icons/feather',
                    '@react-native-vector-icons/material-design-icons',
                ],
            },
        ],
    ],
};
