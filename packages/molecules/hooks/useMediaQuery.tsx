import { useMemo } from 'react';
import { useWindowDimensions } from 'react-native';

import { isNil } from '../utils/lodash';

type Query = {
    maxWidth?: number;
    minWidth?: number;
    maxHeight?: number;
    minHeight?: number;
    orientation?: 'portrait' | 'landscape';
};

export function useMediaQuery(query: Query) {
    const dims = useWindowDimensions();
    const height = dims?.height;
    const width = dims?.width;

    return useMemo(() => queryResolver(query, width, height), [height, query, width]);
}

function queryResolver(query: Query, width?: number, height?: number) {
    for (const queryKey in query) {
        // if the func returns false, stop the loop and return false
        if (!calculateQuery(queryKey, query[queryKey as keyof Query], height, width)) {
            return false;
        }
    }
    return true;
}

function calculateQuery(key: string, val?: number | string, height?: number, width?: number) {
    let returnVal: boolean;
    if (isNil(width) || isNil(height) || isNil(val)) {
        return false;
    }

    switch (key) {
        case 'maxWidth':
            returnVal = width <= +val;
            break;
        case 'minWidth':
            returnVal = width >= +val;
            break;
        case 'maxHeight':
            returnVal = height <= +val;
            break;
        case 'minHeight':
            returnVal = height >= +val;
            break;
        case 'orientation':
            if (width > height) {
                returnVal = val === 'landscape';
            } else {
                returnVal = val === 'portrait';
            }
            break;
        default:
            returnVal = false;
            break;
    }

    return returnVal;
}
