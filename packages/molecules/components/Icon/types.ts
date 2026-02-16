import type { ColorValue, TextProps } from 'react-native';

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

/**
 * Interface for registering custom icon types.
 * Users can extend this interface via declaration merging to add their own icon types.
 *
 * @example
 * // In your app's type declarations (e.g., global.d.ts or a dedicated types file)
 * declare module 'react-native-molecules' {
 *   interface CustomIconTypes {
 *     'my-custom-icons': true;
 *     'another-icon-set': true;
 *   }
 * }
 */

export interface CustomIconTypes {}

export type IconType = 'material-community' | 'feather' | keyof CustomIconTypes;

export type IconProps = VectorIconProps & {
    type?: IconType;
};
