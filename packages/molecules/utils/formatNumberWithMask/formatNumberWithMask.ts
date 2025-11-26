import { createNumberMask, type CreateNumberMaskProps } from '../createNumberMask';
import { isNil } from '../lodash';
import { formatWithMask } from './formatWithMask';

export type FormatNumberWithMaskProps = CreateNumberMaskProps & {
    number: number | string | undefined | null;
};

export const formatNumberWithMask = ({
    number,
    separator = '.',
    suffix = '',
    precision = 0,
    ...rest
}: FormatNumberWithMaskProps) => {
    if (isNil(number) || number === '' || isNaN(Number(number))) return '';

    const numberMask = createNumberMask({ separator, suffix, precision, ...rest });

    const numberString = `${Number(number).toFixed(precision)}`;

    const separatorReplacedNumber =
        numberString.replace('.', separator) + (numberString ? suffix : '');

    return formatWithMask({ text: separatorReplacedNumber, mask: numberMask }).masked;
};
