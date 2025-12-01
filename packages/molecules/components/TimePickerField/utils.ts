import { format, parse, set } from 'date-fns';
import { StyleSheet } from 'react-native-unistyles';

export declare type MaskItem = string | RegExp | [RegExp];
export declare type MaskArray = Array<MaskItem>;
export declare type Mask = MaskArray | ((value?: string) => MaskArray);

import { getRegisteredComponentStylesWithFallback } from '../../core';

const timepickerFieldStylesDefault = StyleSheet.create({
    root: {},
});

export const styles = getRegisteredComponentStylesWithFallback(
    'TimePickerField',
    timepickerFieldStylesDefault,
);

export const timeMask24Hour: Mask = (text: string = '') => {
    const cleanTime = text.replace(/\D+/g, '');

    const hourFirstDigit = /[012]/; // only 0,1 or 2
    let hourSecondDigit = /\d/; // any number

    if (cleanTime.charAt(0) === '2') {
        hourSecondDigit = /[0123]/; // only 0,1,2 or 3
    }

    const minuteFirstDigit = /[012345]/; // only 0,1,2,3,4 or 5
    const minuteSecondDigit = /\d/; // any number

    return [hourFirstDigit, hourSecondDigit, ':', minuteFirstDigit, minuteSecondDigit];
};
export const timeMask12Hour: Mask = (text: string = '') => {
    const cleanTime = text.replace(/\D+/g, '');

    const hourFirstDigit = /[01]/; // only 0,1 or 2
    let hourSecondDigit = /\d/; // any number

    if (cleanTime.charAt(0) === '1') {
        hourSecondDigit = /[012]/; // only 0,1,2 or 3
    }

    const minuteFirstDigit = /[012345]/; // only 0,1,2,3,4 or 5
    const minuteSecondDigit = /\d/; // any number

    return [hourFirstDigit, hourSecondDigit, ':', minuteFirstDigit, minuteSecondDigit, /[ap]/, 'm'];
};
export const timeFormat = {
    '24': {
        format: 'HH:mm',
        mask: timeMask24Hour,
    },
    '12': {
        format: 'hh:mmaaa',
        mask: timeMask12Hour,
    },
};

const referenceDate = new Date('2022-01-01T00:00:00.000Z');

export const sanitizeTimeString = (time: string): string => time.replace(/[^\d:]/g, '');

export const getFormattedTime = ({ time, is24Hour }: { time: string; is24Hour: boolean }) => {
    if (!time) {
        return '';
    }

    const [hour = '0', minute = '0'] = sanitizeTimeString(time).split(':');

    const newHour = hour.padStart(2, '0');
    const newMinute = minute.padStart(2, '0');

    return format(
        set(referenceDate, { hours: +newHour, minutes: +newMinute }),
        timeFormat[is24Hour ? '24' : '12'].format,
    );
};

export const getOutputTime = ({ time, is24Hour }: { time: string; is24Hour: boolean }) => {
    if (!time) return '';

    const formattedTime = sanitizeTimeString(getFormattedTime({ time, is24Hour }));
    const isPM = time.replace(/[\d:]/g, '').includes('p');

    return format(
        parse(
            formattedTime + (is24Hour ? '' : isPM ? 'pm' : 'am'),
            timeFormat[is24Hour ? '24' : '12'].format,
            referenceDate,
        ),
        'HH:mm',
    );
};
