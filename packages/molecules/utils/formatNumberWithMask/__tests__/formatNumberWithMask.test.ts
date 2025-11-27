import { formatNumberWithMask } from '../formatNumberWithMask';

describe('normalizeToNumberString', () => {
    it('should work if the input is empty string', () => {
        const normalizedNumberString = formatNumberWithMask({ number: null, separator: '.' });

        expect(normalizedNumberString).toBe('');
    });

    it('should give correctly formatted number with currency symbol prefix and delimiter', () => {
        const normalizedNumberString = formatNumberWithMask({
            number: 12455635,
            separator: '.',
            delimiter: ',',
            prefix: '$',
        });

        expect(normalizedNumberString).toBe('$12,455,635');
    });

    it('should give correctly formatted number with suffix and precision', () => {
        const normalizedNumberString = formatNumberWithMask({
            number: 12123.23,
            allowNegative: true,
            delimiter: '',
            precision: 2,
            prefix: '',
            separator: '.',
            suffix: '%',
        });

        expect(normalizedNumberString).toBe('12123.23%');
    });

    it('should correctly apply different separator without losing decimal place', () => {
        const normalizedNumberString = formatNumberWithMask({
            number: 2322.22,
            separator: ',',
            delimiter: '.',
            precision: 2,
        });

        expect(normalizedNumberString).toBe('2.322,22');
    });
    it('should give correct decimal points if the number is integer', () => {
        const normalizedNumberString = formatNumberWithMask({
            number: 1,
            separator: '.',
            precision: 2,
        });

        expect(normalizedNumberString).toBe('1.00');
    });
    it('should give correct decimal points if the number is integer and has prefix', () => {
        const normalizedNumberString = formatNumberWithMask({
            number: 12,
            separator: '.',
            precision: 2,
            suffix: '%',
        });

        expect(normalizedNumberString).toBe('12.00%');
    });
    it('should return empty string if the number is null and suffix is there', () => {
        const normalizedNumberString = formatNumberWithMask({
            number: null,
            separator: '.',
            precision: 2,
            suffix: '%',
        });

        expect(normalizedNumberString).toBe('');
    });
    it('should work if the user passed empty string', () => {
        const normalizedNumberString = formatNumberWithMask({
            number: '',
            separator: '.',
        });

        expect(normalizedNumberString).toBe('');
    });
    it('should work if the user passed NaN', () => {
        const normalizedNumberString = formatNumberWithMask({
            number: NaN,
            separator: '.',
        });

        expect(normalizedNumberString).toBe('');
    });
    it('should work if the user passed number string', () => {
        const normalizedNumberString = formatNumberWithMask({
            number: '13.422',
            separator: '.',
            precision: 3,
        });

        expect(normalizedNumberString).toBe('13.422');
    });
});
