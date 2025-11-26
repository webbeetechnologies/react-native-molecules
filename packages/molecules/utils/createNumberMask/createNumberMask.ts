import { escapeRegex } from '../escapeRegex';

export type Mask = MaskArray | ((value?: string) => MaskArray);
export type MaskArray = Array<MaskItem>;
export type MaskItem = string | RegExp | [RegExp];

export type Props = {
    /** Character for thousands delimiter. Defaults to `"."` */
    delimiter?: string;
    /** Decimal precision. Defaults to `2` */
    precision?: number;
    /** Decimal separator character. Defaults to `","`  */
    separator?: string;
    prefix?: string | string[];
    suffix?: string | string[];
    getDelimiterOffset?: (index: number) => number;
    allowNegative?: boolean;
    optionalPrefix?: string | string[];
};

const joinIfStringArr = (value: string | string[]) =>
    Array.isArray(value) ? value.join('') : value || '';

export default function createNumberMask(props?: Props): Mask {
    const {
        delimiter = ',',
        precision = 2,
        prefix = [],
        separator = '.',
        suffix = [],
        getDelimiterOffset = (_index: number) => 3,
        allowNegative = true,
    } = props || {};

    return (value: string | number = '') => {
        value = String(value);

        // the first prefix will allow plus sign, minus sign(if allowNegative is true), and the prefix from the args
        let firstPrefix: string | RegExp = new RegExp(
            `[+${allowNegative ? '\\-' : ''}${escapeRegex(joinIfStringArr(prefix))}]`,
            'g',
        );

        // if the first value already included, plus or minus sign, the value that comes after it should be the prefix
        // otherwise, it means the first value has the prefix (doesnt matter if it's an array)
        let secondPrefix: string | string[] = ['+', '-'].includes(value[0]) ? prefix : [];

        const hasMinusSign = allowNegative && value[0] === '-';
        const hasMinusSignOrPlusSign = hasMinusSign || value[0] === '+';
        const isFirstValueNumber = !Number.isNaN(value[0]);

        // if the first value that has been entered is a number and not plus or minus sign, the prefix should be displayed before that value
        if (isFirstValueNumber && !hasMinusSignOrPlusSign) {
            firstPrefix = '';
            secondPrefix = prefix;
        }

        const shouldAddSeparatorOnMask = !!value && precision > 0 && !!separator;
        const [normalizedValue = '', ...mantissa] =
            shouldAddSeparatorOnMask || precision === 0 ? value.split(separator) : [value];
        const numericValue = normalizedValue.replace(/\D+/g, '') || '';
        const decimalLength = Math.max(
            0,
            Math.min(mantissa.join('').replace(/\D+/g, '').length, precision),
        );

        const mask: MaskArray = numericValue.split('').map(() => /\d/);

        if (delimiter) {
            let i = 0;
            let elapsed = numericValue.length;

            do {
                const precisionOffset = 0;
                const separatorOffset = 0;
                const thousandOffset = getDelimiterOffset(i) + (delimiter ? 1 : 0);
                elapsed -= getDelimiterOffset(i);

                if (elapsed <= 0) {
                    break;
                }

                const delimiterPosition =
                    -precisionOffset - separatorOffset - i * thousandOffset - 3;

                mask.splice(delimiterPosition, 0, delimiter);
                i++;
            } while (true);
        }

        const hasDecimalAlready = shouldAddSeparatorOnMask && value.includes(separator);
        if (hasDecimalAlready) {
            mask.push(separator, ...Array.from({ length: decimalLength }, () => /\d/));
        }

        return [firstPrefix, ...secondPrefix, ...mask, ...suffix];
    };
}
