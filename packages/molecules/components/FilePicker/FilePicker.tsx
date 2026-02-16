import { memo, useCallback, useMemo } from 'react';

import useControlledValue from '../../hooks/useControlledValue';
import useFilePicker from '../../hooks/useFilePicker';
import type { DocumentPickerOptions, DocumentResult } from '../../utils/DocumentPicker';
import { IconButton } from '../IconButton';
import { TextInput, type TextInputProps } from '../TextInput';

export type OmitProp =
    | 'editable'
    | 'multiline'
    | 'onChangeText'
    | 'onChange'
    | 'keyboardType'
    | 'defaultValue'
    | 'value'
    | 'left'
    | 'right';

export type Props = Omit<TextInputProps, OmitProp> &
    DocumentPickerOptions & {
        /**
         * Allows multiple files to be selected from the system UI.
         * @default false
         */
        multiple?: boolean;
        /**
         * Default value for uncontrolled usage
         */
        defaultValue?: DocumentResult[];
        /**
         * To Control the value
         */
        value?: DocumentResult[];
        /**
         * The Callback function to return the selected files as an array or object
         */
        onChange?: (result: DocumentResult[] | undefined) => any;
    };

const FilePicker = ({
    ref,
    type,
    multiple,
    transitionStyle,
    mode,
    presentationStyle,
    value: valueProp,
    defaultValue,
    onChange,
    onCancel,
    onError,
    children,
    ...rest
}: Props) => {
    const [value, onValueChange] = useControlledValue<DocumentResult[] | undefined>({
        value: valueProp,
        defaultValue,
        onChange,
    });

    const { openFilePicker } = useFilePicker({
        type,
        mode,
        multiple,
        transitionStyle,
        presentationStyle,
        onCancel,
        onError,
    });

    const displayText = useMemo(() => {
        if (!value) return '';

        if (value.length > 1) {
            return `${value.length} files`;
        }
        return value[0]?.name || '';
    }, [value]);

    const onPress = useCallback(() => {
        openFilePicker(response => {
            onValueChange(response);
        });
    }, [onValueChange, openFilePicker]);

    return (
        <TextInput value={displayText} {...rest} editable={false} ref={ref}>
            <TextInput.Label>Choose file</TextInput.Label>
            <TextInput.Right>
                <IconButton type="material-community" name="upload" onPress={onPress} />
            </TextInput.Right>
            {children}
        </TextInput>
    );
};

export default memo(FilePicker);
