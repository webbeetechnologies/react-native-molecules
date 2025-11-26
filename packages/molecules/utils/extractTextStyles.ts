import type { TextStyle } from 'react-native';

import { memoize } from './lodash';

const textStyleProps = [
    'color',
    'fontFamily',
    'fontSize',
    'fontStyle',
    'fontWeight',
    'letterSpacing',
    'lineHeight',
    'textAlign',
    'textDecorationLine',
    'textDecorationStyle',
    'textDecorationColor',
    'textShadowColor',
    'textShadowOffset',
    'textShadowRadius',
    'textTransform',
] as const;

const defaultTextStyle: TextStyle = {};
const extract = <T extends TextStyle>(styles: T) => {
    const { textStyle, otherStyle } = textStyleProps.reduce(
        (obj, key) => {
            if (key in obj.otherStyle) {
                const value = obj.otherStyle[key] as T[typeof key];

                // delete from the object;
                obj.otherStyle = { ...obj.otherStyle };
                delete obj.otherStyle[key];

                // return if value is falsy
                if (!value) return obj;

                obj.textStyle = { ...obj.textStyle, [key]: value };
            }
            return obj;
        },
        {
            textStyle: defaultTextStyle,
            otherStyle: styles as T,
        },
    );

    return [textStyle, otherStyle];
};

export const extractTextStyle = Object.assign(memoize, { Cache: Map })(extract, style =>
    JSON.stringify(style),
);
