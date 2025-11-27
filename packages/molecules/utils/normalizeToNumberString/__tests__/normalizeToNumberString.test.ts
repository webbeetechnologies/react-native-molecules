import { normalizeToNumberString } from '../normalizeToNumberString';

describe('normalizeToNumberString', () => {
    it('should work if the input is empty string', () => {
        const normalizedNumberString = normalizeToNumberString({ text: '', separator: '.' });

        expect(normalizedNumberString).toBe('');
    });
    it('should still work if the input is null or undefined', () => {
        // @ts-ignore
        const normalizedNumberString = normalizeToNumberString({ text: null, separator: '.' });

        expect(normalizedNumberString).toBe('');
    });

    it('should give a correct output if the input string contains characters', () => {
        const normalizedNumberString = normalizeToNumberString({
            text: 'test22.22',
            separator: '.',
        });

        expect(normalizedNumberString).toBe('22.22');
    });
    it('should give a correct output integer value without prefix', () => {
        const normalizedNumberString = normalizeToNumberString({
            text: '1223',
        });

        expect(normalizedNumberString).toBe('1223');
    });
    it('should give correct value even if it is zero', () => {
        const normalizedNumberString = normalizeToNumberString({
            text: '0',
        });

        expect(normalizedNumberString).toBe('0');
    });

    it('should give a correct output if the input string contains characters and trailing dots', () => {
        const normalizedNumberString = normalizeToNumberString({
            text: 'test22.22....',
            separator: '.',
        });

        expect(normalizedNumberString).toBe('22.22');
    });

    it('should disregard subsequent dots if it contains leading dots', () => {
        const normalizedNumberString = normalizeToNumberString({
            text: '.22.22',
            separator: '.',
        });

        expect(normalizedNumberString).toBe('0.22');
    });

    it('should still work if the separator is anything other than dot', () => {
        const normalizedNumberString = normalizeToNumberString({
            text: 'test,22.22,,,asa.222',
            separator: ',',
        });

        expect(normalizedNumberString).toBe('0.22');
    });

    it('should display the minus sign if it is in front of then numbers', () => {
        const normalizedNumberString = normalizeToNumberString({
            text: 'test-124.525',
            separator: '.',
            allowNegative: true,
        });

        expect(normalizedNumberString).toBe('-124.525');
    });

    it('should work with prefix that includes the same characters as separator', () => {
        const normalizedNumberString = normalizeToNumberString({
            text: 'Rs.124.525',
            separator: '.',
            prefix: 'Rs.',
        });

        expect(normalizedNumberString).toBe('124.525');
    });
    it('should work with suffix', () => {
        const normalizedNumberString = normalizeToNumberString({
            text: '52.25%',
            separator: '.',
            suffix: '%',
        });

        expect(normalizedNumberString).toBe('52.25');
    });
    it('should discard the minus sign if it is in between the numbers', () => {
        const normalizedNumberString = normalizeToNumberString({
            text: '$123-353.23',
            separator: '.',
            prefix: '$',
            allowNegative: true,
        });

        expect(normalizedNumberString).toBe('123353.23');
    });
    it('should give me empty string if the text is empty string', () => {
        const normalizedNumberString = normalizeToNumberString({
            text: '',
        });

        expect(normalizedNumberString).toBe('');
    });
    it('should give me empty string if the text result in empty string after normalization', () => {
        const normalizedNumberString = normalizeToNumberString({
            text: '-$',
            prefix: '$',
            allowNegative: true,
        });

        expect(normalizedNumberString).toBe('');
    });
    it('should correctly apply precision and remove unnecessary decimal points', () => {
        const normalizedNumberString = normalizeToNumberString({
            text: '12.24',
            precision: 0,
        });

        expect(normalizedNumberString).toBe('12');
    });
    it('should correctly apply non-zero precision', () => {
        const normalizedNumberString = normalizeToNumberString({
            text: '12.24',
            precision: 3,
        });

        expect(normalizedNumberString).toBe('12.240');
    });
});
