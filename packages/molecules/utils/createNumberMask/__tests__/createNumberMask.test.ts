import { formatWithMask } from '../../formatNumberWithMask/formatWithMask';
import type { MaskArray } from '../createNumberMask';
import createNumberMask, { type Props as CreateNumberMaskProps } from '../createNumberMask';

interface Props extends Partial<CreateNumberMaskProps> {
    value: string;
    suffix?: string | string[];
    getDelimiterOffset?: (index: number) => number;
}

const getMaskedValue = ({
    precision = 0,
    delimiter = ',',
    separator = '.',
    value,
    prefix,
    suffix,
    getDelimiterOffset,
    allowNegative,
}: Props) => {
    const mask = (
        createNumberMask({
            precision,
            delimiter,
            separator,
            suffix,
            prefix,
            getDelimiterOffset,
            allowNegative,
        }) as (value?: string) => MaskArray
    )(value);

    return formatWithMask({
        text: value && [value, ...(suffix ?? ([] as string[]))].join(''),
        mask,
    });
};

const getMaskedValueWithDefaultPrefix = ({ prefix = ['$'], ...props }: Props) =>
    getMaskedValue({ ...props, prefix });

describe('createNumberMask', () => {
    it('works with a 5 digit amount without precision', () => {
        const { masked } = getMaskedValueWithDefaultPrefix({ value: '10000' });

        expect(masked).toBe('$10,000');
    });

    it('works with a 3 digit amount without precision', () => {
        const { masked } = getMaskedValueWithDefaultPrefix({ value: '100' });
        expect(masked).toBe('$100');
    });

    it('works with a 6 digit amount without precision', () => {
        const { masked } = getMaskedValueWithDefaultPrefix({ value: '100000' });
        expect(masked).toBe('$100,000');
    });

    it('works with a 10 digit amount without precision', () => {
        const { masked } = getMaskedValueWithDefaultPrefix({ value: '9876543210' });
        expect(masked).toBe('$9,876,543,210');
    });

    it('works with a 3 digit amount precision 2', () => {
        const { masked } = getMaskedValueWithDefaultPrefix({ precision: 2, value: '100' });
        expect(masked).toBe('$100');
    });

    it('works with a 3 digit amount precision 2 for decimal', () => {
        const { masked } = getMaskedValueWithDefaultPrefix({ precision: 2, value: '100.' });
        expect(masked).toBe('$100.');
    });

    it('works with a 3 digit amount precision 2 for proper number', () => {
        const { masked } = getMaskedValueWithDefaultPrefix({ precision: 2, value: '100.20' });
        expect(masked).toBe('$100.20');
    });

    it('works with a 3 digit amount precision 2 for number with improper precision', () => {
        const { masked } = getMaskedValueWithDefaultPrefix({ precision: 2, value: '100.203' });
        expect(masked).toBe('$100.20');
    });

    it('works without a prefix', () => {
        const { masked } = getMaskedValue({ prefix: [], precision: 2, value: '100.203' });
        expect(masked).toBe('100.20');
    });

    it('works when value a decimal number but precision is 0', () => {
        const { masked } = getMaskedValue({ precision: 0, value: '100.203' });
        expect(masked).toBe('100');
    });

    it('works with a suffix', () => {
        const { masked } = getMaskedValue({ suffix: ['%'], precision: 0, value: '100.203%' });
        expect(masked).toBe('100%');
    });

    it('works with a suffix and a precision', () => {
        const { masked } = getMaskedValue({
            suffix: ['%'],
            precision: 2,
            value: '100.20',
        });

        expect(masked).toBe('100.20%');
    });

    it('works with a suffix, a precision of 5, and a custom prefix', () => {
        const { masked } = getMaskedValue({
            prefix: ['USD '],
            suffix: ['%'],
            precision: 5,
            value: '10000.20300%',
        });

        expect(masked).toBe('USD 10,000.20300%');
    });

    it('works with a suffix, a precision of 5, a custom prefix, and lesser precision', () => {
        const { masked } = getMaskedValue({
            prefix: ['USD '],
            suffix: ['%'],
            precision: 5,
            value: '10000.200%',
        });

        expect(masked).toBe('USD 10,000.200%');
    });

    it('works with a different delimiter', () => {
        const { masked } = getMaskedValue({
            value: '23123123123,20',
            precision: 2,
            delimiter: '.',
            separator: ',',
        });

        expect(masked).toBe('23.123.123.123,20');
    });

    it('with a custom getDelimiterOffset', () => {
        const { masked } = getMaskedValue({
            prefix: ['INR '],
            precision: 2,
            value: '98765432.10',
            getDelimiterOffset: i => (i > 0 ? 2 : 3),
        });

        expect(masked).toBe('INR 9,87,65,432.10');
    });

    it('works with negative sign and prefix', () => {
        const { masked } = getMaskedValue({
            prefix: 'INR ',
            precision: 2,
            value: '-98765432.10',
            getDelimiterOffset: i => (i > 0 ? 2 : 3),
        });

        expect(masked).toBe('-INR 9,87,65,432.10');
    });

    it('doesnt accept negative sign when allowNegative is false', () => {
        const { masked } = getMaskedValue({
            prefix: ['INR '],
            allowNegative: false,
            precision: 2,
            value: '-98765432.10',
            getDelimiterOffset: i => (i > 0 ? 2 : 3),
        });

        expect(masked).toBe('INR 9,87,65,432.10');
    });
});
