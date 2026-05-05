import { StyleSheet } from 'react-native-unistyles';

import { getRegisteredComponentStylesWithFallback } from '../../core';

/** Web-only marker on Select.Option roots so keyboard nav does not depend on role/accessibilityRole overrides. */
export const SELECT_OPTION_DATA_ATTR = 'data-molecules-select-option';

const SELECT_OPTION_SELECTOR = `[${SELECT_OPTION_DATA_ATTR}], [data-option-id], [role="option"]`;

export function collectWebSelectKeyboardOptionElements(container: ParentNode): HTMLElement[] {
    return Array.from(container.querySelectorAll(SELECT_OPTION_SELECTOR)).filter(
        (el): el is HTMLElement => {
            if (!(el instanceof HTMLElement)) return false;
            if (el.getAttribute('aria-disabled') === 'true') return false;
            return true;
        },
    );
}

const triggerDefaultStyles = StyleSheet.create(theme => ({
    trigger: {
        borderRadius: theme.shapes.corner.extraSmall,
        paddingHorizontal: theme.spacings['3'],
        paddingVertical: theme.spacings['2'],
        minHeight: 48,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        variants: {
            state: {
                disabled: {
                    opacity: 0.38,
                    backgroundColor: theme.colors.surfaceVariant,
                },
                errorDisabled: {
                    opacity: 0.38,
                },
            },
        },
    },
    outline: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        borderRadius: theme.shapes.corner.extraSmall,
        borderWidth: 1,
        borderColor: theme.colors.outline,
        pointerEvents: 'none',
        variants: {
            state: {
                focused: {
                    borderWidth: 2,
                    borderColor: theme.colors.primary,
                },
                hovered: {
                    borderColor: theme.colors.onSurface,
                },
                hoveredAndFocused: {
                    borderWidth: 2,
                    borderColor: theme.colors.primary,
                },
                disabled: {
                    borderColor: theme.colors.onSurface,
                },
                error: {
                    borderColor: theme.colors.error,
                },
                errorFocused: {
                    borderWidth: 2,
                    borderColor: theme.colors.error,
                },
                errorHovered: {
                    borderColor: theme.colors.onErrorContainer,
                },
                errorFocusedAndHovered: {
                    borderWidth: 2,
                    borderColor: theme.colors.error,
                },
                errorDisabled: {
                    borderColor: theme.colors.error,
                },
            },
        },
    },
    triggerIcon: {
        marginLeft: theme.spacings['2'],
        color: theme.colors.onSurfaceVariant,
    },
}));

export const defaultStyles = StyleSheet.create(theme => ({
    chipContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 6,
        maxWidth: '90%',
    },
    searchInput: {
        marginHorizontal: theme.spacings['2'],
        marginVertical: theme.spacings['3'],
    },
}));

export const triggerStyles = getRegisteredComponentStylesWithFallback(
    'Select_Trigger',
    triggerDefaultStyles,
);

export const styles = getRegisteredComponentStylesWithFallback('Select', defaultStyles);
