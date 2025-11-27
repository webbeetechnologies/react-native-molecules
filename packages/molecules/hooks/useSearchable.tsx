import { type ReactElement, useCallback, useMemo } from 'react';

import { IconButton } from '../components/IconButton';
import {
    TextInput,
    type TextInputElementProps,
    type TextInputProps,
} from '../components/TextInput';
import useControlledValue from './useControlledValue';

export interface UseSearchableProps {
    searchable?: boolean;
    onQueryChange?: (search: string) => void;
    query?: string;
    searchInputProps?: Omit<TextInputProps, 'value' | 'onChangeText'>;
}

const useSearchInputProps = (props?: Partial<TextInputProps>) => {
    const onChange = props?.onChangeText;
    const onPressClear = useCallback(() => {
        onChange?.('');
    }, [onChange]);

    const right = useCallback(
        ({ color, forceFocus }: TextInputElementProps) => (
            <IconButton
                name={props?.value ? 'close-circle-outline' : 'magnify'}
                onPress={props?.value ? onPressClear : forceFocus}
                color={color}
            />
        ),
        [onPressClear, props?.value],
    );

    return useMemo(
        () => (props?.right === undefined ? props : { right, ...props }),
        [props, right],
    );
};

const useSearchable = ({
    searchable,
    onQueryChange,
    query,
    searchInputProps,
}: UseSearchableProps = {}): ReactElement<TextInputProps> | null => {
    const [value, onValueChange] = useControlledValue({
        value: query || '',
        defaultValue: '', // to disable the useControlledValue inside TextInput
        onChange: onQueryChange,
        disabled: !searchable,
    });

    const props = useSearchInputProps(
        useMemo(
            () => ({
                ...searchInputProps,
                value,
                onChangeText: onValueChange,
            }),
            [onValueChange, searchInputProps, value],
        ),
    );

    return useMemo(() => {
        if (!searchable || !onQueryChange) return null;

        return <TextInput {...props} />;
    }, [onQueryChange, props, searchable]);
};

export { useSearchInputProps };

export default useSearchable;
