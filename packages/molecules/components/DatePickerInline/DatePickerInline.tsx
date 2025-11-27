import { memo, useCallback, useMemo } from 'react';
import { View, type ViewStyle } from 'react-native';

import { useControlledValue } from '../../hooks';
import type {
    LocalState,
    LocalStateMultiple,
    LocalStateRange,
    LocalStateSingle,
} from '../DatePickerModal/types';
import DatePickerInlineBase from './DatePickerInlineBase';
import DatePickerInlineHeader from './DatePickerInlineHeader';
import type { DatePickerInlineBaseProps } from './types';
import { datePickerStyles } from './utils';

export type DatePickerInlineProps = DatePickerInlineBaseProps & {
    containerStyle?: ViewStyle;
};

const DatePickerInline = ({
    date,
    startDate,
    endDate,
    dates,
    onChange,
    locale = 'en',
    mode = 'single',
    containerStyle: containerStyleProp,
    ...rest
}: DatePickerInlineProps) => {
    const onInnerChange = useCallback(
        (params: any) => {
            onChange?.(params);
        },
        [onChange],
    );

    const [state, onStateChange] = useControlledValue<LocalState>({
        value: getStateValue({ date, dates, startDate, endDate }, mode),
        onChange: onInnerChange,
    });

    const { containerStyle } = useMemo(() => {
        return {
            containerStyle: [datePickerStyles.container, datePickerStyles.root, containerStyleProp],
        };
    }, [containerStyleProp]);

    return (
        <View style={containerStyle}>
            <DatePickerInlineBase
                {...rest}
                locale={locale}
                mode={mode}
                startDate={(state as LocalStateRange)?.startDate}
                endDate={(state as LocalStateRange)?.endDate}
                date={(state as LocalStateSingle)?.date}
                onChange={onStateChange as typeof onInnerChange}
                dates={(state as LocalStateMultiple)?.dates}
                // TODO - fix ts issues
                // @ts-ignore
                HeaderComponent={DatePickerInlineHeader}
            />
        </View>
    );
};

export const getStateValue = (state: LocalState, mode: DatePickerInlineProps['mode']) => {
    if (mode === 'single') {
        return (state as LocalStateSingle).date !== undefined ? state : undefined;
    } else if (mode === 'range') {
        return (state as LocalStateRange).startDate !== undefined ||
            (state as LocalStateRange).endDate !== undefined
            ? state
            : undefined;
    } else if (mode === 'multiple') {
        return (state as LocalStateMultiple).dates !== undefined ? state : undefined;
    }
    return state;
};

export default memo(DatePickerInline);
