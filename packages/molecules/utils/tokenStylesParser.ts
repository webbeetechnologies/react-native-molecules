import { StyleSheet } from 'react-native-unistyles';

export const tokenStylesParser = StyleSheet.create(theme => ({
    getColor: (color: string | undefined, propertyName: string = 'color') => ({
        ...(color ? { [propertyName]: theme.colors[color] ?? color } : {}),
    }),
}));
