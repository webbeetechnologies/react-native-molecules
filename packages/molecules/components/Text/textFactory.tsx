import { type ComponentType, createContext, forwardRef, memo, useContext } from 'react';
import { Text, type TextProps } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

const HasAncestorContext = createContext(false);

const defaultStyles = StyleSheet.create(theme => ({
    root: { color: theme.colors.onSurface, ...theme.typescale.bodyMedium },
}));

export const textFactory = (
    componentStyles: typeof defaultStyles = defaultStyles,
    isBlockLevelElement = false,
    DefaultComponent: ComponentType<any> = Text,
) => {
    return memo(
        forwardRef((props: TextProps, ref: any) => {
            const { style, ...rest } = props;
            const hasAncestorText = useContext(HasAncestorContext);

            const styles =
                hasAncestorText && !isBlockLevelElement ? style : [componentStyles?.root, style];

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
