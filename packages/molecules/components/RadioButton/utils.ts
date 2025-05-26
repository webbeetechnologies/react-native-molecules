import { getRegisteredMoleculesComponentStyles, registerComponentsStyles } from '../../core';
import { StyleSheet } from 'react-native-unistyles';

// type States = 'disabled' | 'checked' | 'hovered' | 'checkedAndHovered';

export const DEFAULT_ICON_SIZE = 24;
export const ANIMATION_DURATION = 100;

const radioButtonStylesDefault = StyleSheet.create(theme => ({
    root: {
        // color: theme.colors.onSurfaceVariant,
        // uncheckedColor: theme.colors.onSurfaceVariant,
        // variants: {
        //     state: {
        //         checked: {
        //             color: theme.colors.primary,
        //         },
        //         disabled: {
        //             color: theme.colors.onSurfaceDisabled,
        //             uncheckedColor: theme.colors.onSurfaceDisabled,
        //         },
        //     },
        // },
    },

    container: {
        borderRadius: theme.shapes.corner.full as unknown as number,
    },
    radioContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    radio: {
        height: 20,
        width: 20,
        borderRadius: 10,
        margin: 8,
        borderColor: theme.colors.onSurfaceVariant,

        variants: {
            state: {
                checked: {
                    borderColor: theme.colors.primary,
                },
                disabled: {
                    borderColor: theme.colors.onSurfaceDisabled,
                },
            },
        },
    },
    dot: {
        height: 10,
        width: 10,
        borderRadius: 5,
        backgroundColor: theme.colors.onSurfaceVariant,

        variants: {
            state: {
                checked: {
                    backgroundColor: theme.colors.primary,
                },
                disabled: {
                    backgroundColor: theme.colors.onSurfaceDisabled,
                },
            },
        },
    },
    icon: {
        backgroundColor: theme.colors.onSurfaceVariant,

        variants: {
            state: {
                checked: {
                    backgroundColor: theme.colors.primary,
                },
                disabled: {
                    backgroundColor: theme.colors.onSurfaceDisabled,
                },
            },
        },
    },
    stateLayer: {
        variants: {
            state: {
                hovered: {
                    backgroundColor: theme.colors.stateLayer.hover.onSurface,
                },

                checkedAndHovered: {
                    backgroundColor: theme.colors.stateLayer.hover.primary,
                },
            },
        },
    },
}));

const radioButtonItemStylesDefault = StyleSheet.create(theme => ({
    root: {
        paddingVertical: theme.spacings['2'],
        paddingHorizontal: theme.spacings['4'],

        variants: {
            state: {
                checked: {},
                disabled: {},
            },
        },
    },
    label: {
        color: theme.colors.onSurface,

        variants: {
            state: {
                checked: {},
                disabled: {
                    color: theme.colors.onSurfaceDisabled,
                },
            },
        },
    },
}));

registerComponentsStyles({
    RadioButton: radioButtonStylesDefault,
    RadioButton_Item: radioButtonItemStylesDefault,
});

export const radioButtonStyles = getRegisteredMoleculesComponentStyles('RadioButton');
export const radioButtonItemStyles = getRegisteredMoleculesComponentStyles('RadioButton_Item');

export const handlePress = ({
    onPress,
    value,
    onValueChange,
}: {
    onPress?: () => void;
    value: string;
    onValueChange?: (value: string) => void;
}) => {
    if (onPress && onValueChange) {
        console.warn(
            `onPress in the scope of RadioButtonGroup will not be executed, use onValueChange instead`,
        );
    }

    onValueChange ? onValueChange(value) : onPress?.();
};

export const isChecked = ({
    value,
    status,
    contextValue,
}: {
    value: string;
    status?: 'checked' | 'unchecked';
    contextValue?: string;
}) => {
    if (contextValue !== undefined && contextValue !== null) {
        return contextValue === value ? 'checked' : 'unchecked';
    } else {
        return status;
    }
};
