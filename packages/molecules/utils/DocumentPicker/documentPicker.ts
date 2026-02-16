import { Platform } from 'react-native';

import type { DocumentPickerOptions, DocumentResult } from './types';

class OperationCanceledError extends Error {
    code = 'OPERATION_CANCELED';
    constructor() {
        super('user canceled the document picker');
        this.name = 'OperationCanceledError';
    }
}

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
    onCancel,
    onError,
}: DocumentPickerOptions): Promise<DocumentResult[]> => {
    // SSR guard
    if (Platform.OS !== 'web') {
        const error = new OperationCanceledError();
        onCancel?.();
        throw error;
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

    return new Promise((resolve, reject) => {
        input.addEventListener('change', async () => {
            try {
                if (input.files && input.files.length > 0) {
                    const response: Promise<DocumentResult>[] = [];

                    Array.from(input.files).forEach(file => response.push(resolveFileData(file)));

                    const results = await Promise.all(response);
                    resolve(results);
                } else {
                    const error = new OperationCanceledError();
                    onCancel?.();
                    reject(error);
                }
            } catch (error) {
                onError?.(error);
                reject(error);
            } finally {
                document.body.removeChild(input);
            }
        });

        const event = new MouseEvent('click');
        input.dispatchEvent(event);
    });
};

const pickSingle = (options: DocumentPickerOptions = {}) =>
    getDocumentAsyncWeb({ ...options, multiple: false });

const pickMultiple = (options: DocumentPickerOptions = {}) =>
    getDocumentAsyncWeb({ ...options, multiple: true });

export default {
    pickSingle,
    pickMultiple,
};
