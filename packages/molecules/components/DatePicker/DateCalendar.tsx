import { memo } from 'react';

import { getRegisteredComponentWithFallback } from '../../core';
import {
    DatePickerInline,
    type DatePickerInlineProps,
    type RangeChange,
    type SingleChange,
} from '../DatePickerInline';
import { useOptionalDatePickerContext } from './context';

export type DateCalendarProps = DatePickerInlineProps;

const DateCalendarDefault = memo((props: DateCalendarProps) => {
    const ctx = useOptionalDatePickerContext();

    const hasExplicitState =
        props.date !== undefined ||
        props.startDate !== undefined ||
        props.endDate !== undefined ||
        props.dates !== undefined ||
        props.onChange !== undefined;

    const isRange = props.mode === 'range' || ctx?.mode === 'range';
    const effectiveHeaderLayout = props.headerLayout ?? (ctx ? 'docked' : 'inline');
    const showOutsideDays =
        props.showOutsideDays ?? (effectiveHeaderLayout === 'docked' && !isRange);

    if (!ctx || hasExplicitState) {
        return <DatePickerInline {...props} showOutsideDays={showOutsideDays} />;
    }

    const locale = props.locale ?? ctx.locale;
    const validRange = props.validRange ?? ctx.validRange;

    if (ctx.mode === 'range') {
        const range =
            ctx.draftValue && typeof ctx.draftValue === 'object' && 'start' in ctx.draftValue
                ? ctx.draftValue
                : { start: null, end: null };
        const onChange: RangeChange = ({ startDate, endDate }) => {
            ctx.setValue({ start: startDate ?? null, end: endDate ?? null });
        };
        return (
            <DatePickerInline
                {...props}
                mode="range"
                startDate={range.start ?? undefined}
                endDate={range.end ?? undefined}
                onChange={onChange}
                locale={locale}
                validRange={validRange}
                headerLayout={props.headerLayout ?? 'docked'}
                showOutsideDays={showOutsideDays}
            />
        );
    }

    const single =
        ctx.draftValue && typeof ctx.draftValue === 'object' && 'start' in ctx.draftValue
            ? null
            : ctx.draftValue;
    const onChange: SingleChange = ({ date }) => {
        ctx.setValue(date ?? null);
    };

    return (
        <DatePickerInline
            {...props}
            mode="single"
            date={single ?? undefined}
            onChange={onChange}
            locale={locale}
            validRange={validRange}
            headerLayout={props.headerLayout ?? 'docked'}
            showOutsideDays={showOutsideDays}
        />
    );
});

DateCalendarDefault.displayName = 'DateCalendar';

export const DateCalendar = getRegisteredComponentWithFallback('DateCalendar', DateCalendarDefault);
