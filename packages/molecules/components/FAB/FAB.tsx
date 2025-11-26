import { forwardRef, memo, useMemo } from 'react';
import type { TextProps, ViewProps, ViewStyle } from 'react-native';
import { Text } from 'react-native';

import { useActionState } from '../../hooks';
import type { MD3Elevation } from '../../types/theme';
import { resolveStateVariant } from '../../utils';
import { Icon, type IconProps, type IconType } from '../Icon';
import { StateLayer } from '../StateLayer';
import { Surface, type SurfaceProps } from '../Surface';
import { TouchableRipple, type TouchableRippleProps } from '../TouchableRipple';
import type { FABVariant } from './types';
import { fabStyles, iconSizeMap } from './utils';

export type Props = Omit<TouchableRippleProps, 'children'> & {
    /**
     * name of the icon
     * */
    iconName: string;
    /**
     * type of the icon
     * */
    iconType?: IconType;
    /**
     * icon component's props
     * */
    iconProps?: Omit<IconProps, 'name' | 'type' | 'ref'>;
    /**
     * Label of the FAB, if provided the FAB will be on extended mode
     * */
    label?: string;
    /**
     * Props of the label
     * */
    labelProps?: Omit<Partial<TextProps>, 'children'>;
    /**
     * Props for the surface container
     * */
    containerProps?: Omit<SurfaceProps, 'style' | 'ref'>;
    /**
     * Props for the innner touchable container
     * */
    innerContainerStyle?: ViewStyle;
    /**
     * sizes of the FAB
     * @default 'md'
     * */
    size?: 'sm' | 'md' | 'lg';
    /**
     * variants of the FAB
     * */
    variant?: FABVariant;
    /**
     * Elevation level
     * @default 2
     * */
    elevation?: MD3Elevation;
    /**
     * Props for the state layer
     * */
    stateLayerProps?: ViewProps;
};

const emptyObj = {};

const FAB = (
    {
        iconName,
        iconType,
        iconProps = emptyObj,
        label,
        variant = 'primary',
        size = 'md',
        elevation: elevationProp,
        containerProps,
        innerContainerStyle: innerContainerStyleProp = emptyObj,
        labelProps = emptyObj,
        stateLayerProps = emptyObj,
        disabled = false,
        onPress,
        style,
        testID,
        ...rest
    }: Props,
    ref: any,
) => {
    const { hovered, actionsRef } = useActionState({ ref, actionsToListen: ['hover'] });

    const elevation = useMemo(
        () => (elevationProp === undefined ? 3 : elevationProp),
        [elevationProp],
    );

    const state = resolveStateVariant({
        disabled,
        hovered,
    });

    fabStyles.useVariants({
        variant,
        size,
        state: state as any,
    });

    const {
        containerStyle,
        innerContainerStyle,
        iconStyle,
        labelStyle,
        iconSize,
        stateLayerStyle,
    } = useMemo(() => {
        return {
            containerStyle: [fabStyles.root, style],
            innerContainerStyle: [fabStyles.innerContainer, innerContainerStyleProp],
            iconStyle: [fabStyles.icon, iconProps?.style],
            // @ts-ignore
            labelStyle: [fabStyles.label, labelProps?.style],
            iconSize: iconSizeMap[size],
            stateLayerStyle: [fabStyles.stateLayer, stateLayerProps?.style],
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        iconProps?.style,
        innerContainerStyleProp,
        labelProps?.style,
        stateLayerProps?.style,
        style,
        state,
        variant,
        size,
    ]);
    // TODO: abstract the stateLayer
    return (
        <Surface
            testID={testID ? `${testID}-container` : ''}
            {...containerProps}
            elevation={(disabled ? 0 : hovered ? elevation + 1 : elevation) as MD3Elevation}
            style={containerStyle}>
            <TouchableRipple
                testID={testID}
                {...rest}
                disabled={disabled}
                onPress={onPress}
                style={innerContainerStyle}
                ref={actionsRef}>
                <>
                    <Icon
                        name={iconName}
                        type={iconType}
                        testID={testID ? `${testID}-icon` : ''}
                        {...iconProps}
                        size={iconSize}
                        style={iconStyle}
                    />
                    {label && (
                        <Text
                            selectable={false}
                            testID={testID ? `${testID}-label` : ''}
                            {...labelProps}
                            style={labelStyle}>
                            {label}
                        </Text>
                    )}
                    <StateLayer
                        testID={testID ? `${testID}-stateLayer` : ''}
                        {...stateLayerProps}
                        style={stateLayerStyle}
                    />
                </>
            </TouchableRipple>
        </Surface>
    );
};

export default memo(forwardRef(FAB));
