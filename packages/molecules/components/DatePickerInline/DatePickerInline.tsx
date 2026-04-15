import { memo, useCallback } from 'react';
import { View, type ViewStyle } from 'react-native';

import { useControlledValue } from '../../hooks';
import DatePickerDockedHeader from './DatePickerDockedHeader';
import DatePickerInlineBase from './DatePickerInlineBase';
import DatePickerInlineHeader from './DatePickerInlineHeader';
import type { CalendarDate, CalendarDates, DatePickerInlineBaseProps } from './types';
import { datePickerStyles } from './utils';

type LocalState = LocalStateSingle | LocalStateMultiple | LocalStateRange;
type LocalStateSingle = { date: CalendarDate };
type LocalStateMultiple = { dates: CalendarDates };
type LocalStateRange = { startDate: CalendarDate; endDate: CalendarDate };

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
    headerLayout = 'inline',
    HeaderComponent,
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

    const resolvedHeader =
        HeaderComponent ??
        (headerLayout === 'docked' ? DatePickerDockedHeader : DatePickerInlineHeader);

    return (
        <View style={[datePickerStyles.container, datePickerStyles.root, containerStyleProp]}>
            <DatePickerInlineBase
                {...rest}
                headerLayout={headerLayout}
                locale={locale}
                mode={mode}
                startDate={(state as LocalStateRange)?.startDate}
                endDate={(state as LocalStateRange)?.endDate}
                date={(state as LocalStateSingle)?.date}
                onChange={onStateChange as typeof onInnerChange}
                dates={(state as LocalStateMultiple)?.dates}
                // TODO - fix ts issues
                // @ts-ignore
                HeaderComponent={resolvedHeader}
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
