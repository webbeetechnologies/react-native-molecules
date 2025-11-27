import { useCallback } from 'react';

import {
    DocumentPicker,
    type DocumentPickerOptions,
    type DocumentResult,
} from '../utils/DocumentPicker';
import { isNil, omitBy } from '../utils/lodash';

export const useFilePicker = ({
    multiple,
    onCancel,
    onError,
    ...options
}: DocumentPickerOptions) => {
    const openFilePicker = useCallback(
        async (callback: (response: DocumentResult | DocumentResult[]) => void): Promise<void> => {
            const omittedOptions = omitBy(options, isNil);

            try {
                let response;

                if (multiple) {
                    response = await DocumentPicker.pickMultiple(omittedOptions);
                } else {
                    response = await DocumentPicker.pickSingle(omittedOptions);
                }

                callback?.(response);
            } catch (e: any) {
                // eslint-disable-next-line no-console
                console.log('FilePicker Error', e, e?.code);

                if (e?.code === 'DOCUMENT_PICKER_CANCELED.') {
                    onCancel?.();
                    return;
                }
                // It might result in an error.
                onError?.(e);
            }
        },
        [multiple, onCancel, onError, options],
    );

    return { openFilePicker };
};

export default useFilePicker;
