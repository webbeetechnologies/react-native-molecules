import { StyleSheet } from 'react-native-unistyles';
import get from 'lodash.get';

export const tokenStylesParser = StyleSheet.create(theme => ({
    getColor: (color: string | undefined, propertyName: string = 'color') => ({
        ...(color ? { [propertyName]: get(theme.colors, color) ?? color } : {}),
    }),
}));
