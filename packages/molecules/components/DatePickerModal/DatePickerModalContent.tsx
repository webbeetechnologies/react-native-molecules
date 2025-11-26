import { memo, useCallback, useState } from 'react';

import { useControlledValue } from '../../hooks';
import { DatePickerInlineBase, getStateValue } from '../DatePickerInline';
import DatePickerInlineHeader from '../DatePickerInline/DatePickerInlineHeader';
import AnimatedCrossView from './AnimatedCrossView';
import CalendarEdit from './CalendarEdit';
import DatePickerModalContentHeader from './DatePickerModalContentHeader';
import DatePickerModalHeader from './DatePickerModalHeader';
import DatePickerModalHeaderBackground from './DatePickerModalHeaderBackground';
import type {
    DatePickerModalContentMultiProps,
    DatePickerModalContentRangeProps,
    DatePickerModalContentSingleProps,
    LocalState,
    LocalStateMultiple,
    LocalStateRange,
    LocalStateSingle,
} from './types';

type Props =
    | DatePickerModalContentSingleProps
    | DatePickerModalContentRangeProps
    | DatePickerModalContentMultiProps;

export function DatePickerModalContent(props: Props) {
    const {
        mode = 'single',
        onChange,
        onConfirm,
        onClose,
        disableSafeTop,
        disableWeekDays,
        // locale = 'en',
        validRange,
        dateMode,
        startYear,
        endYear,
        date,
        startDate,
        endDate,
        dates,
    } = props;
    const [collapsed, setCollapsed] = useState<boolean>(true);

    const onInnerChange = useCallback(
        (params: any) => {
            onChange?.(params);
        },
        [onChange],
    );

    const [state, onStateChange] = useControlledValue<LocalState>({
        value: getStateValue(
            {
                date,
                dates,
                startDate,
                endDate,
            },
            mode,
        ),
        onChange: onInnerChange,
    });

    const onInnerConfirm = useCallback(() => {
        if (mode === 'single') {
            (onConfirm as DatePickerModalContentSingleProps['onConfirm'])?.({
                date: (state as LocalStateSingle)?.date,
            });
        } else if (mode === 'range') {
            (onConfirm as DatePickerModalContentRangeProps['onConfirm'])?.({
                startDate: (state as LocalStateRange)?.startDate,
                endDate: (state as LocalStateRange)?.endDate,
            });
        } else if (mode === 'multiple') {
            (onConfirm as DatePickerModalContentMultiProps['onConfirm'])?.({
                dates: (state as LocalStateMultiple)?.dates || [],
            });
        }
    }, [state, mode, onConfirm]);

    const onToggleCollapse = useCallback(() => {
        setCollapsed(prev => !prev);
    }, [setCollapsed]);

    return (
        <>
            <DatePickerModalHeaderBackground>
                <DatePickerModalHeader
                    onSave={onInnerConfirm}
                    onClose={onClose}
                    saveLabel={props.saveLabel}
                    saveLabelDisabled={props.saveLabelDisabled || false}
                    disableSafeTop={disableSafeTop}
                    closeIcon={props.closeIcon}
                />
                <DatePickerModalContentHeader
                    state={state || { startDate, dates, date, endDate }}
                    mode={mode}
                    collapsed={collapsed}
                    onToggle={onToggleCollapse}
                    headerSeparator={props.headerSeparator}
                    emptyLabel={props.emptyLabel}
                    label={props.label}
                    moreLabel={props.moreLabel}
                    startLabel={props.startLabel}
                    endLabel={props.endLabel}
                    uppercase={props.uppercase || true}
                    // locale={locale}
                    editIcon={props.editIcon}
                    calendarIcon={props.calendarIcon}
                />
            </DatePickerModalHeaderBackground>

            <AnimatedCrossView
                collapsed={collapsed}
                calendar={
                    <DatePickerInlineBase
                        // locale={locale}
                        mode={mode}
                        startDate={(state as LocalStateRange)?.startDate}
                        endDate={(state as LocalStateRange)?.endDate}
                        date={(state as LocalStateSingle)?.date}
                        onChange={onStateChange as typeof onInnerChange}
                        disableWeekDays={disableWeekDays}
                        dates={(state as LocalStateMultiple)?.dates}
                        validRange={validRange}
                        dateMode={dateMode}
                        startYear={startYear}
                        endYear={endYear}
                        // TODO - fix ts issues
                        // @ts-ignore
                        HeaderComponent={DatePickerInlineHeader}
                    />
                }
                calendarEdit={
                    <CalendarEdit
                        mode={mode}
                        state={state || { startDate, dates, date, endDate }}
                        label={props.label}
                        startLabel={props.startLabel}
                        endLabel={props.endLabel}
                        collapsed={collapsed}
                        onChange={onStateChange}
                        validRange={validRange}
                        // locale={locale}
                    />
                }
            />
        </>
    );
}

export default memo(DatePickerModalContent);
