import { I18nManager, type TextStyle } from 'react-native';

export type SpacingKey =
    | 'margin'
    | 'marginBottom'
    | 'marginEnd'
    | 'marginHorizontal'
    | 'marginLeft'
    | 'marginRight'
    | 'marginStart'
    | 'marginTop'
    | 'marginVertical'
    | 'padding'
    | 'paddingBottom'
    | 'paddingEnd'
    | 'paddingHorizontal'
    | 'paddingLeft'
    | 'paddingRight'
    | 'paddingStart'
    | 'paddingTop'
    | 'paddingVertical';

export type SpacingType =
    | 'paddingTop'
    | 'paddingBottom'
    | 'paddingLeft'
    | 'paddingRight'
    | 'marginTop'
    | 'marginBottom'
    | 'marginLeft'
    | 'marginRight';

type StyleObject = TextStyle & Partial<Record<SpacingKey, number>>; // only support number values

const normalizeMarginRight = (styleObj: StyleObject) => {
    return (
        styleObj?.marginRight ||
        styleObj?.marginHorizontal ||
        styleObj?.margin ||
        (I18nManager.isRTL ? styleObj?.marginStart : styleObj?.marginEnd) ||
        0
    );
};

const normalizeMarginLeft = (styleObj: StyleObject) => {
    return (
        styleObj?.marginLeft ||
        styleObj?.marginHorizontal ||
        styleObj?.margin ||
        (I18nManager.isRTL ? styleObj?.marginEnd : styleObj?.marginStart) ||
        0
    );
};

const normalizeMarginTop = (styleObj: StyleObject) => {
    return styleObj?.marginTop || styleObj?.marginVertical || styleObj?.margin || 0;
};

const normalizeMarginBottom = (styleObj: StyleObject) => {
    return styleObj?.marginBottom || styleObj?.marginVertical || styleObj?.margin || 0;
};

const normalizePaddingRight = (styleObj: StyleObject) => {
    return (
        styleObj?.paddingRight ||
        styleObj?.paddingHorizontal ||
        styleObj?.padding ||
        (I18nManager.isRTL ? styleObj?.paddingStart : styleObj?.paddingEnd) ||
        0
    );
};

const normalizePaddingLeft = (styleObj: StyleObject) => {
    return (
        styleObj?.paddingLeft ||
        styleObj?.paddingHorizontal ||
        styleObj?.padding ||
        (I18nManager.isRTL ? styleObj?.paddingEnd : styleObj?.paddingStart) ||
        0
    );
};

const normalizePaddingTop = (styleObj: StyleObject) => {
    return styleObj?.paddingTop || styleObj?.paddingVertical || styleObj?.padding || 0;
};

const normalizePaddingBottom = (styleObj: StyleObject) => {
    return styleObj?.paddingBottom || styleObj?.paddingVertical || styleObj?.padding || 0;
};

export const normalizeSpacings = (styleObj: StyleObject, spacingType: SpacingType) => {
    switch (spacingType) {
        case 'paddingTop':
            return normalizePaddingTop(styleObj);
        case 'paddingBottom':
            return normalizePaddingBottom(styleObj);
        case 'paddingLeft':
            return normalizePaddingLeft(styleObj);
        case 'paddingRight':
            return normalizePaddingRight(styleObj);
        case 'marginTop':
            return normalizeMarginTop(styleObj);
        case 'marginBottom':
            return normalizeMarginBottom(styleObj);
        case 'marginLeft':
            return normalizeMarginLeft(styleObj);
        case 'marginRight':
            return normalizeMarginRight(styleObj);
    }
};
