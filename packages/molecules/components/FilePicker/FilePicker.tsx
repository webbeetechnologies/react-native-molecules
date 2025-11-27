import { forwardRef, memo, type ReactNode, useCallback, useEffect, useMemo, useState } from 'react';

import useFilePicker from '../../hooks/useFilePicker';
import type { DocumentPickerOptions, DocumentResult } from '../../utils/DocumentPicker';
import { ActivityIndicator } from '../ActivityIndicator';
import { IconButton } from '../IconButton';
import { TextInput, type TextInputProps } from '../TextInput';

export type OmitProp =
    | 'editable'
    | 'multiline'
    | 'onChangeText'
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
         * Displays the Spinner on the right side in place of the default upload icon
         * @default false
         */
        loading?: boolean;
        left?: ReactNode;
        right?: ReactNode;
        /**
         * To Control the value
         */
        value?: DocumentResult | DocumentResult[];
        /**
         * The Callback function to return the selected files as an array or object
         */
        onChange?: (result: DocumentResult | DocumentResult[]) => any;
        /**
         * To replace the default progress indicator
         */
        progressIndicator?: ReactNode;
    };

const FilePicker = (
    {
        loading,
        right: rightProp,
        progressIndicator,
        type,
        multiple,
        transitionStyle,
        mode,
        presentationStyle,
        value,
        onChange = () => {},
        onCancel,
        onError,
        ...rest
    }: Props,
    ref: any,
) => {
    const [displayText, setDisplayText] = useState('');

    const { openFilePicker } = useFilePicker({
        type,
        mode,
        multiple,
        transitionStyle,
        presentationStyle,
        onCancel,
        onError,
    });

    const onSetInputValue = useCallback(
        (response: DocumentResult | DocumentResult[] | undefined) => {
            if (Array.isArray(response)) {
                if (response.length > 1) {
                    setDisplayText(`${response.length} file${response.length > 1 ? 's' : ''}`);
                    return;
                }

                setDisplayText(response[0].name || '');
                return;
            }

            setDisplayText(response?.name || '');
        },
        [],
    );

    const onPress = useCallback(() => {
        openFilePicker(response => {
            onSetInputValue(response);

            onChange?.(response);
        });
    }, [onChange, onSetInputValue, openFilePicker]);

    const rightElement = useMemo(() => {
        if (!loading) {
            return (
                <>
                    {rightProp || (
                        <IconButton type="material-community" name="upload" onPress={onPress} />
                    )}
                </>
            );
        } else {
            return <>{progressIndicator || <ActivityIndicator />}</>;
        }
    }, [loading, onPress, progressIndicator, rightProp]);

    // if the value changes, we only want file name or the length of the array to display the text
    useEffect(() => {
        onSetInputValue(value);
    }, [onSetInputValue, value]);

    return (
        <TextInput
            label="Choose file"
            {...rest}
            value={displayText}
            editable={false}
            right={rightElement}
            ref={ref}
        />
    );
};

export default memo(forwardRef(FilePicker));
