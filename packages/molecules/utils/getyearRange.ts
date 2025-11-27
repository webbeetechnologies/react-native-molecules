import { range } from './dateTimePicker';

export const getYearRange = (startYear = 1800, endYear = 2200) => {
    return range(startYear, endYear);
};
