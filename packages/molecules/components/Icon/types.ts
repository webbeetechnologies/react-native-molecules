import type { ColorValue, TextProps } from 'react-native';

export enum IconPacks {
    MaterialCommunity = 'material-community',
    Feather = 'feather',
}

export interface VectorIconProps extends TextProps {
    /**
     * Size of the icon, can also be passed as fontSize in the style object.
     *
     * @default 12
     */
    size?: number | undefined;

    /**
     * Name of the icon to show
     *
     * See Icon Explorer app
     * {@link https://github.com/oblador/react-native-vector-icons/tree/master/Examples/IconExplorer}
     */
    name: string;

    /**
     * Color of the icon
     *
     */
    color?: ColorValue | number | undefined;
}

export type IconType = `${IconPacks}`; // in TS 4.1+, we can do this to make enum values as a union type

export type IconProps = VectorIconProps & {
    type?: IconType;
};
