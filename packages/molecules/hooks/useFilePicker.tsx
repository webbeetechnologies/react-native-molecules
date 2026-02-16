import { useCallback } from 'react';

import {
    DocumentPicker,
    type DocumentPickerOptions,
    type DocumentResult,
} from '../utils/DocumentPicker';
import { isNil, omitBy } from '../utils/lodash';

export const useFilePicker = (options: DocumentPickerOptions) => {
    const openFilePicker = useCallback(
        async (callback: (response: DocumentResult[]) => void) => {
            const { multiple, ...rest } = options;
            const omittedOptions = omitBy(rest, isNil);

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
                // Error and cancel callbacks are handled by DocumentPicker itself
            }
        },
        [options],
    );

    return { openFilePicker };
};

export default useFilePicker;
