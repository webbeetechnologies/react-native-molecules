import { memo, useCallback } from 'react';
import { View } from 'react-native';

import { datePickerHeaderItemStyles } from '../DatePicker/utils';
import { Icon } from '../Icon';
import { IconButton } from '../IconButton';
import { Text } from '../Text';
import { TouchableRipple } from '../TouchableRipple';
import { useDatePickerInlineStoreValue } from './store';

function HeaderItem({
    value,
    selecting,
    type,
    pickerType,
    onPressDropdown,
    onNext,
    onPrev,
}: {
    value: number | string;
    type?: 'month' | 'year';
    selecting?: boolean;
    pickerType: 'month' | 'year' | undefined;
    onPressDropdown?: (type: 'month' | 'year') => void;
    onNext?: (type: 'month' | 'year' | undefined) => void;
    onPrev?: (type: 'month' | 'year' | undefined) => void;
}) {
    const { startDateYear, endDateYear } = useDatePickerInlineStoreValue(state => ({
        startDateYear: state.startDateYear,
        endDateYear: state.endDateYear,
    }));
    const disabled = pickerType && pickerType !== type;

    const handlePressDropDown = useCallback(() => {
        type && onPressDropdown && onPressDropdown(type);
    }, [onPressDropdown, type]);

    const handleOnPrevious = useCallback(() => {
        onPrev && onPrev(type);
    }, [onPrev, type]);

    const handleOnNext = useCallback(() => {
        onNext && onNext(type);
    }, [onNext, type]);

    return (
        <View
            style={[
                datePickerHeaderItemStyles.buttonContainer,
                // eslint-disable-next-line react-native/no-inline-styles
                {
                    justifyContent: !onPressDropdown
                        ? 'flex-end'
                        : !onNext
                        ? 'flex-start'
                        : 'center',
                },
            ]}
            pointerEvents={'box-none'}>
            {onPrev && (
                <View
                    style={[
                        datePickerHeaderItemStyles.buttonWrapper,
                        // eslint-disable-next-line react-native/no-inline-styles
                        (selecting || disabled) && { opacity: 0 },
                    ]}>
                    <IconButton
                        type="material-community"
                        name="chevron-left"
                        size={24}
                        // Todo: Translate
                        accessibilityLabel={'Previous'}
                        onPress={handleOnPrevious}
                        disabled={value === startDateYear || selecting || disabled}
                    />
                </View>
            )}
            {type && (
                <TouchableRipple
                    disabled={disabled}
                    onPress={handlePressDropDown}
                    accessibilityRole="button"
                    accessibilityLabel={`${value}`}
                    style={datePickerHeaderItemStyles.buttonStyle}>
                    <View style={datePickerHeaderItemStyles.innerStyle}>
                        <Text
                            style={[
                                datePickerHeaderItemStyles.labelStyle,
                                // eslint-disable-next-line react-native/no-inline-styles
                                disabled && { opacity: 0.5 },
                            ]}
                            selectable={false}>
                            {value}
                        </Text>
                        {!disabled && (
                            <Icon
                                onPress={handlePressDropDown}
                                name={selecting && type === pickerType ? 'menu-up' : 'menu-down'}
                                size={18}
                            />
                        )}
                    </View>
                </TouchableRipple>
            )}
            {onNext && (
                <View
                    style={[
                        datePickerHeaderItemStyles.buttonWrapper,
                        // eslint-disable-next-line react-native/no-inline-styles
                        (selecting || disabled) && { opacity: 0 },
                    ]}>
                    <IconButton
                        name="chevron-right"
                        size={24}
                        // Todo: Translate
                        accessibilityLabel={'Next'}
                        onPress={handleOnNext}
                        disabled={value === endDateYear || selecting || disabled}
                    />
                </View>
            )}
        </View>
    );
}

export default memo(HeaderItem);
