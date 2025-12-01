import { forwardRef, memo, useMemo } from 'react';
import { StyleSheet } from 'react-native-unistyles';

import { getRegisteredComponentStylesWithFallback } from '../../core';
import { tokenStylesParser } from '../../utils/tokenStylesParser';
import iconFactory from './iconFactory';
import type { IconProps } from './types';

/**
 * Neutral component. Doesn't have platform specific styles
 */
const Icon = ({ type = 'material-community', style, color, ...rest }: IconProps, ref: any) => {
    const IconComponent = iconFactory(type);
    const componentStyles = useMemo(
        () => [styles.root, style, tokenStylesParser.getColor(color as string)],
        [style, color],
    );

    return <IconComponent ref={ref} style={componentStyles} {...rest} />;
};

export const iconStylesDefault = StyleSheet.create(theme => ({
    root: {
        color: theme.colors.onSurface,
    },
}));

export const styles = getRegisteredComponentStylesWithFallback('Icon', iconStylesDefault);

export default memo(forwardRef(Icon));
