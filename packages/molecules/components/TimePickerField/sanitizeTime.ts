export const sanitizeTime = (value: string, is24hour = false) => {
    // Remove all non-numeric and non-colon characters except am/pm
    const sanitizedValue = value.replace(/[^0-9:apm]/gi, '');

    const singleDigitHour = sanitizedValue.match(/^(\d{1,2})$/);
    if (singleDigitHour) {
        const hours = parseInt(singleDigitHour[1], 10);
        if (!is24hour && hours >= 1 && hours <= 12) {
            return `${hours}:00am`;
        } else if (is24hour && hours >= 0 && hours < 24) {
            return `${hours.toString().padStart(2, '0')}:00`;
        }
    }

    if (is24hour) {
        // Check if it's a valid 24-hour time format (HH:MM)
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

        // Convert 12-hour time to 24-hour time format if necessary
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

    // Convert 24-hour time to 12-hour time format if necessary
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

    // Check if it's a valid 12-hour time format (HH:MM am/pm)
    const match12Hour = sanitizedValue.match(/^(\d{1,2}):?(\d{2})\s*([ap]m)$/i);
    if (match12Hour) {
        const hours = parseInt(match12Hour[1], 10);
        const minutes = parseInt(match12Hour[2], 10);
        const period = match12Hour[3].toLowerCase();

        if (hours >= 1 && hours <= 12 && minutes >= 0 && minutes < 60) {
            return `${hours}:${minutes.toString().padStart(2, '0')}${period}`;
        }
    }

    // If no match, return empty string as invalid input
    return '';
};
