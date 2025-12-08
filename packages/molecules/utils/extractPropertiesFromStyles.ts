import { StyleSheet } from 'react-native-unistyles';

// TODO - abstract this
export function extractPropertiesFromStyles(
    _objectsArray: Record<string, any>,
    propertiesToExtract: string[],
) {
    const extracted: Record<string, any> = {};

    const objectsArray = StyleSheet.flatten(_objectsArray);

    for (let i = objectsArray.length - 1; i >= 0; i--) {
        const obj = objectsArray[i];

        for (const prop of propertiesToExtract) {
            if (!obj) continue;
            if (prop in obj) {
                // @ts-ignore
                extracted[prop] = obj[prop];
            }
        }
    }

    return extracted;
}
