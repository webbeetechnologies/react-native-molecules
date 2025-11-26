import { Platform } from 'react-native';

import type { DocumentPickerOptions, DocumentResult } from './types';

const resolveFileData = (file: File): Promise<DocumentResult> => {
    return new Promise((resolve, reject) => {
        const mimeType = file.type;
        const reader = new FileReader();

        reader.onerror = () => {
            reject(new Error(`Failed to read the selected media because the operation failed.`));
        };
        reader.onload = ({ target }) => {
            const uri = (target as any).result;

            resolve({
                type: 'success',
                uri,
                mimeType,
                name: file.name,
                file: file,
                lastModified: file.lastModified,
                size: file.size,
            });
        };
        // Read in the image file as a binary string.
        reader.readAsDataURL(file);
    });
};

const getDocumentAsyncWeb = async ({
    type = '*/*',
    multiple = false,
}: DocumentPickerOptions): Promise<DocumentResult | DocumentResult[]> => {
    // SSR guard
    if (Platform.OS !== 'web') {
        return { type: 'cancel' };
    }

    const input = document.createElement('input');
    input.style.display = 'none';
    input.setAttribute('type', 'file');
    // @ts-expect-error
    input.setAttribute('accept', Array.isArray(type) ? type.join(',') : type);

    if (multiple) {
        input.setAttribute('multiple', 'multiple');
    }

    document.body.appendChild(input);

    return new Promise(resolve => {
        input.addEventListener('change', () => {
            if (input.files) {
                const response: Promise<DocumentResult>[] = [];

                Array.from(input.files).forEach(file => response.push(resolveFileData(file)));

                return resolve(Promise.all(response));
            } else {
                resolve({ type: 'cancel' });
            }

            document.body.removeChild(input);
        });

        const event = new MouseEvent('click');
        input.dispatchEvent(event);
    });
};

export default {
    pickSingle: ({ type }: DocumentPickerOptions) => getDocumentAsyncWeb({ type, multiple: false }),
    pickMultiple: ({ type }: DocumentPickerOptions) =>
        getDocumentAsyncWeb({ type, multiple: true }),
};
