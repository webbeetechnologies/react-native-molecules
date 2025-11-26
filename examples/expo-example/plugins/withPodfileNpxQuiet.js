const { withPodfile } = require('@expo/config-plugins');

const withPodfileNpxQuiet = config => {
    return withPodfile(config, config => {
        if (config.modResults.language === 'ruby') {
            config.modResults.contents = config.modResults.contents.replace(
                /'npx',\s*'expo-modules-autolinking'/g,
                "'npx', '--quiet', 'expo-modules-autolinking'",
            );
        }
        return config;
    });
};

module.exports = withPodfileNpxQuiet;
