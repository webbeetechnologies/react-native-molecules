import { forwardRef, memo, type PropsWithoutRef, useCallback, useMemo } from 'react';
import { type ViewProps } from 'react-native';

import { useActionState } from '../../hooks';
import { resolveStateVariant } from '../../utils';
import { tokenStylesParser } from '../../utils/tokenStylesParser';
import { Icon } from '../Icon';
import { StateLayer } from '../StateLayer';
import { TouchableRipple } from '../TouchableRipple';
import type { CheckBoxBaseProps, States } from './types';
import { iconSizeMap, styles } from './utils';

export type Props = Omit<CheckBoxBaseProps, 'value' | 'defaultValue'> & {
    value: boolean;
    /**
     * props for the stateLayer
     */
    stateLayerProps?: PropsWithoutRef<ViewProps>;
};

const CheckboxAndroid = (
    {
        value: checked,
        indeterminate,
        disabled = false,
        size = 'md',
        onChange: onChangeProp,
        testID,
        style,
        color: colorProp,
        uncheckedColor: uncheckedColorProp,
        stateLayerProps = {},
        ...rest
    }: Props,
    ref: any,
) => {
    const { actionsRef, hovered } = useActionState({ ref, actionsToListen: ['hover'] });

    const state = resolveStateVariant({
        disabled,
        checkedAndHovered: checked && !indeterminate && hovered,
        checked: checked && !indeterminate,
        hovered,
    });

    styles.useVariants({
        variant: 'android',
        // @ts-ignore // TODO - fix this
        state: state as States,
        size,
    });

    const { rippleContainerStyles, iconStyle } = useMemo(() => {
        const _color = tokenStylesParser.getColor(checked ? colorProp : uncheckedColorProp);

        return {
            iconStyle: [styles.icon, _color],
            rippleContainerStyles: [styles.root, style],
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [checked, colorProp, uncheckedColorProp, style, size, state]);

    const onChange = useCallback(() => {
        onChangeProp?.(!checked);
    }, [checked, onChangeProp]);

    const icon = indeterminate
        ? 'minus-box'
        : checked
        ? 'checkbox-marked'
        : 'checkbox-blank-outline';

    const accessibilityState = useMemo(() => ({ disabled, checked }), [checked, disabled]);

    return (
        <TouchableRipple
            {...rest}
            borderless
            onPress={onChange}
            disabled={disabled}
            accessibilityRole="checkbox"
            accessibilityState={accessibilityState}
            accessibilityLiveRegion="polite"
            style={rippleContainerStyles}
            testID={testID}
            ref={actionsRef}>
            <>
                <Icon
                    allowFontScaling={false}
                    type="material-community"
                    name={icon}
                    size={iconSizeMap[size]}
                    style={iconStyle}
                />
                <StateLayer
                    testID={testID ? `${testID}-stateLayer` : ''}
                    {...stateLayerProps}
                    style={[styles.stateLayer, stateLayerProps?.style]}
                />
            </>
        </TouchableRipple>
    );
};

export default memo(forwardRef(CheckboxAndroid));
