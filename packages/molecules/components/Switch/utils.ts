import { getRegisteredMoleculesComponentStyles, registerComponentsStyles } from '../../core';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

type States =
    | 'selected'
    | 'selected_disabled'
    | 'selected_pressed'
    | 'disabled'
    | 'hovered'
    | 'focused'
    | 'pressed'
    | 'hovered_pressed'
    | 'selected_hovered'
    | 'selected_focused'
    | 'selected_hovered_pressed'
    | 'selected_focused_pressed';

export const useSwitchColors = (state: States) => {
    const theme = useUnistyles().theme;

    return (
        {
            selected: {
                thumbColor: theme.colors.onPrimary,
                checkedColor: theme.colors.primary,
            },
            selected_hovered: {
                thumbColor: theme.colors.primaryContainer,
                checkedColor: theme.colors.primary,
            },
            selected_focused: {
                thumbColor: theme.colors.primaryContainer,
                checkedColor: theme.colors.primary,
            },
            disabled: {
                thumbColor: theme.colors.onSurfaceDisabled,
                uncheckedColor: theme.colors.surfaceContainerHighest,
            },
            selected_disabled: {
                checkedColor: theme.colors.onSurface,
            },
            selected_pressed: {
                thumbColor: theme.colors.primaryContainer,
                checkedColor: theme.colors.primary,
            },
            selected_hovered_pressed: {
                thumbColor: theme.colors.primaryContainer,
                checkedColor: theme.colors.primary,
            },
            selected_focused_pressed: {
                thumbColor: theme.colors.primaryContainer,
                checkedColor: theme.colors.primary,
            },
            hovered_pressed: {
                thumbColor: theme.colors.onSurfaceVariant,
            },
            pressed: {
                thumbColor: theme.colors.onSurfaceVariant,
            },
            hovered: {
                thumbColor: theme.colors.onSurfaceVariant,
            },
            focused: {
                thumbColor: theme.colors.onSurfaceVariant,
            },
        }[state] ?? {
            uncheckedColor: theme.colors.surfaceContainerHighest,
            checkedColor: theme.colors.primary,
            thumbColor: theme.colors.outline,
        }
    );
};

const switchStylesDefault = StyleSheet.create(theme => ({
    root: {
        ...({
            uncheckedColor: theme.colors.surfaceContainerHighest,
            checkedColor: theme.colors.primary,
            thumbColor: theme.colors.outline,
        } as any),

        variants: {
            state: {
                selected: {
                    thumbColor: theme.colors.onPrimary,
                    checkedColor: theme.colors.primary,
                },
                selected_hovered: {
                    thumbColor: theme.colors.primaryContainer,
                    checkedColor: theme.colors.primary,
                },
                selected_focused: {
                    thumbColor: theme.colors.primaryContainer,
                    checkedColor: theme.colors.primary,
                },
                disabled: {
                    thumbColor: theme.colors.onSurfaceDisabled,
                    uncheckedColor: theme.colors.surfaceContainerHighest,
                },
                selected_disabled: {
                    checkedColor: theme.colors.onSurface,
                },
                selected_pressed: {
                    thumbColor: theme.colors.primaryContainer,
                    checkedColor: theme.colors.primary,
                },
                selected_hovered_pressed: {
                    thumbColor: theme.colors.primaryContainer,
                    checkedColor: theme.colors.primary,
                },
                selected_focused_pressed: {
                    thumbColor: theme.colors.primaryContainer,
                    checkedColor: theme.colors.primary,
                },
                hovered_pressed: {
                    thumbColor: theme.colors.onSurfaceVariant,
                },
                pressed: {
                    thumbColor: theme.colors.onSurfaceVariant,
                },
                hovered: {
                    thumbColor: theme.colors.onSurfaceVariant,
                },
                focused: {
                    thumbColor: theme.colors.onSurfaceVariant,
                },
            },
        },
    },

    switchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        backgroundColor: theme.colors.surfaceContainerHighest,
        borderColor: theme.colors.outline,

        variants: {
            state: {
                selected: {
                    borderWidth: 0,
                },
                selected_hovered: {
                    borderWidth: 0,
                },
                selected_focused: {
                    borderWidth: 0,
                },
                disabled: {
                    opacity: 0.2,
                    borderColor: theme.colors.onSurface,
                },
                selected_disabled: {
                    opacity: 0.2,
                },
                selected_pressed: {
                    borderWidth: 0,
                },
                selected_hovered_pressed: {
                    borderWidth: 0,
                },
                selected_focused_pressed: {
                    borderWidth: 0,
                },
                hovered_pressed: {},
                pressed: {},
                hovered: {},
                focused: {},
            },
        },
    },

    thumbContainer: { flexDirection: 'row', alignItems: 'center' },

    overlay: {
        display: 'none',
        position: 'absolute',
        right: 0,

        variants: {
            state: {
                selected: {},
                selected_hovered: {
                    backgroundColor: theme.colors.stateLayer.hover.primary,
                    display: 'flex',
                },
                selected_focused: {
                    backgroundColor: theme.colors.stateLayer.focussed.primary,
                    display: 'flex',
                },
                disabled: {},
                selected_disabled: {},
                selected_pressed: {
                    backgroundColor: theme.colors.stateLayer.pressed.primary,
                    display: 'flex',
                },
                selected_hovered_pressed: {
                    backgroundColor: theme.colors.stateLayer.pressed.primary,
                    display: 'flex',
                },
                selected_focused_pressed: {
                    backgroundColor: theme.colors.stateLayer.pressed.primary,
                    display: 'flex',
                },
                hovered_pressed: {
                    backgroundColor: theme.colors.stateLayer.pressed.onSurface,
                    display: 'flex',
                },
                pressed: {
                    backgroundColor: theme.colors.stateLayer.pressed.onSurface,
                    display: 'flex',
                },
                hovered: {
                    backgroundColor: theme.colors.stateLayer.hover.onSurface,
                    display: 'flex',
                },
                focused: {
                    backgroundColor: theme.colors.stateLayer.focussed.onSurface,
                    display: 'flex',
                },
            },
        },
    },

    thumb: {
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 1.5,

        variants: {
            state: {
                disabled: {
                    // opacity: 0.38,
                },
                selected_disabled: {
                    opacity: 1,
                },
            },
        },
    },

    icon: {
        color: theme.colors.surfaceContainerHighest,

        variants: {
            state: {
                selected: {
                    color: theme.colors.onPrimaryContainer,
                },
                selected_hovered: {
                    color: theme.colors.onPrimaryContainer,
                },
                selected_focused: {
                    color: theme.colors.onPrimaryContainer,
                },
                disabled: {
                    color: theme.colors.surfaceContainerHighest,
                    opacity: 0.38,
                },
                selected_disabled: {
                    color: theme.colors.onSurface,
                    opacity: 0.38,
                },
                selected_pressed: {
                    color: theme.colors.onPrimaryContainer,
                },
                selected_hovered_pressed: {
                    color: theme.colors.onPrimaryContainer,
                },
                selected_focused_pressed: {
                    color: theme.colors.onPrimaryContainer,
                },
            },
        },
    },
}));

registerComponentsStyles({
    Switch: switchStylesDefault,
});

export const switchStyles = getRegisteredMoleculesComponentStyles('Switch');
