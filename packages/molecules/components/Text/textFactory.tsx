import { type ComponentType, createContext, forwardRef, memo, useContext } from 'react';
import { Text, type TextProps } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

import { MD3TypescaleKey } from '../../types/theme';

const HasAncestorContext = createContext(false);

const defaultStyles = StyleSheet.create(theme => ({
    root: { color: theme.colors.onSurface, ...theme.typescale.bodyMedium },
}));

export type TypescaleKey = `${MD3TypescaleKey}`;

export type TextFactoryProps = TextProps & {
    typescale?: TypescaleKey;
};

export const textFactory = (
    componentStyles: typeof defaultStyles = defaultStyles,
    isBlockLevelElement = false,
    DefaultComponent: ComponentType<any> = Text,
) => {
    return memo(
        forwardRef((props: TextFactoryProps, ref: any) => {
            const { style, typescale, ...rest } = props;
            const hasAncestorText = useContext(HasAncestorContext);
            const { theme } = useUnistyles();

            const typescaleStyle = typescale ? theme.typescale[typescale] : undefined;

            const baseStyle =
                hasAncestorText && !isBlockLevelElement ? null : componentStyles?.root;
            const styles = [baseStyle, typescaleStyle, style];

            return hasAncestorText ? (
                <DefaultComponent ref={ref} style={styles} {...rest} />
            ) : (
                <HasAncestorContext.Provider value={true}>
                    <DefaultComponent ref={ref} style={styles} {...rest} />
                </HasAncestorContext.Provider>
            );
        }),
    );
};
