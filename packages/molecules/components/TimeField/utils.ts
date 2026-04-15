import { format, parse, set } from 'date-fns';

export const timeMask24Hour = (text: string = '') => {
    const cleanTime = text.replace(/\D+/g, '');

    const hourFirstDigit = /[012]/;
    let hourSecondDigit = /\d/;

    if (cleanTime.charAt(0) === '2') {
        hourSecondDigit = /[0123]/;
    }

    return [hourFirstDigit, hourSecondDigit, ':', /[012345]/, /\d/];
};

export const timeMask12Hour = (text: string = '') => {
    const cleanTime = text.replace(/\D+/g, '');

    const hourFirstDigit = /[01]/;
    let hourSecondDigit = /\d/;

    if (cleanTime.charAt(0) === '1') {
        hourSecondDigit = /[012]/;
    }

    return [hourFirstDigit, hourSecondDigit, ':', /[012345]/, /\d/, /[ap]/, 'm'];
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

export const sanitizeTime = (value: string, is24Hour = false) => {
    const sanitizedValue = value.replace(/[^0-9:apm]/gi, '');

    const singleDigitHour = sanitizedValue.match(/^(\d{1,2})$/);
    if (singleDigitHour) {
        const hours = parseInt(singleDigitHour[1], 10);
        if (!is24Hour && hours >= 1 && hours <= 12) {
            return `${hours}:00am`;
        }
        if (is24Hour && hours >= 0 && hours < 24) {
            return `${hours.toString().padStart(2, '0')}:00`;
        }
    }

    if (is24Hour) {
        const match24Hour = sanitizedValue.match(/^(\d{1,2}):?(\d{2})$/);

        if (match24Hour) {
            const hours = parseInt(match24Hour[1], 10);
            const minutes = parseInt(match24Hour[2], 10);

            if (hours >= 0 && hours < 24 && minutes >= 0 && minutes < 60) {
                return `${hours.toString().padStart(2, '0')}:${minutes
                    .toString()
                    .padStart(2, '0')}`;
            }
        }

        const match12Hour = sanitizedValue.match(/^(\d{1,2}):?(\d{2})\s*([ap]m)$/i);
        if (match12Hour) {
            let hours = parseInt(match12Hour[1], 10);
            const minutes = parseInt(match12Hour[2], 10);
            const period = match12Hour[3].toLowerCase();

            if (hours >= 1 && hours <= 12 && minutes >= 0 && minutes < 60) {
                if (period === 'pm' && hours < 12) {
                    hours += 12;
                } else if (period === 'am' && hours === 12) {
                    hours = 0;
                }

                return `${hours.toString().padStart(2, '0')}:${minutes
                    .toString()
                    .padStart(2, '0')}`;
            }
        }

        return '';
    }

    const match24Hour = sanitizedValue.match(/^(\d{1,2}):?(\d{2})$/);
    if (match24Hour) {
        let hours = parseInt(match24Hour[1], 10);
        const minutes = parseInt(match24Hour[2], 10);
        let period = 'am';

        if (hours >= 0 && hours < 24 && minutes >= 0 && minutes < 60) {
            if (hours >= 12) {
                period = 'pm';
                if (hours > 12) {
                    hours -= 12;
                }
            } else if (hours === 0) {
                hours = 12;
            }
            return `${hours}:${minutes.toString().padStart(2, '0')}${period}`;
        }
    }

    const match12Hour = sanitizedValue.match(/^(\d{1,2}):?(\d{2})\s*([ap]m)$/i);
    if (match12Hour) {
        const hours = parseInt(match12Hour[1], 10);
        const minutes = parseInt(match12Hour[2], 10);
        const period = match12Hour[3].toLowerCase();

        if (hours >= 1 && hours <= 12 && minutes >= 0 && minutes < 60) {
            return `${hours}:${minutes.toString().padStart(2, '0')}${period}`;
        }
    }

    return '';
};

export const getFormattedTime = ({ time, is24Hour }: { time: string; is24Hour: boolean }) => {
    if (!time) return '';

    const [hour = '0', minute = '0'] = sanitizeTimeString(time).split(':');

    return format(
        set(referenceDate, { hours: +hour.padStart(2, '0'), minutes: +minute.padStart(2, '0') }),
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
