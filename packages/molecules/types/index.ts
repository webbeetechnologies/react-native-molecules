import type { ComponentPropsWithoutRef, ComponentType } from 'react';
import type { StyleProp } from 'react-native';

export * from './theme';

export type NoInfer<T> = [T][T extends any ? 0 : never];

export type DeepPartial<T> = T extends object
    ? {
          [P in keyof T]?: DeepPartial<T[P]>;
      }
    : T;

export type $Omit<T, K> = Pick<T, Exclude<keyof T, K>>;

export type $RemoveChildren<T extends ComponentType<any>> = $Omit<
    ComponentPropsWithoutRef<T>,
    'children'
>;

/*
 *  T stands for ComponentStyle type eg. ViewStyl
 *  C stands for Customer Properties
 *  S stands for ComponentStates
 * */
export type ComponentStyleProp<T, C = {}> = StyleProp<T> & C;

export type ComponentStylePropWithResolvers<
    T,
    S extends ComponentState,
    C = {},
    Z = {},
> = ComponentStyleProp<T, C> & {
    states?: {
        [key in S]?: ComponentStyleProp<T, C>;
    };
    sizes?: {
        [key: string]: ComponentSize<Z>;
    };
};

export type ComponentStylePropWithVariants<
    T,
    S extends ComponentState = ComponentState,
    C = {},
    Z = {},
> = ComponentStylePropWithResolvers<T, S, C, Z> & {
    variants?: {
        [key: string]: ComponentStylePropWithResolvers<T, S, C, Z>;
    };
};

export type ComponentState =
    | 'selected_disabled'
    | 'selected'
    | 'disabled'
    | 'hovered'
    | 'focused'
    | 'pressed'
    | string;

export type ComponentSize<Z = {}> = Z & {
    margin?: number | string;
    marginBottom?: number | string;
    marginEnd?: number | string;
    marginHorizontal?: number | string;
    marginLeft?: number | string;
    marginRight?: number | string;
    marginStart?: number | string;
    marginTop?: number | string;
    marginVertical?: number | string;

    padding?: number | string;
    paddingBottom?: number | string;
    paddingEnd?: number | string;
    paddingHorizontal?: number | string;
    paddingLeft?: number | string;
    paddingRight?: number | string;
    paddingStart?: number | string;
    paddingTop?: number | string;
    paddingVertical?: number | string;

    maxHeight?: number | string;
    maxWidth?: number | string;
    minHeight?: number | string;
    minWidth?: number | string;
    height?: number | string;
    width?: number | string;

    borderBottomWidth?: number | string;
    borderEndWidth?: number | string;
    borderLeftWidth?: number | string;
    borderRightWidth?: number | string;
    borderStartWidth?: number | string;
    borderTopWidth?: number | string;
    borderWidth?: number | string;

    borderBottomEndRadius?: number | string;
    borderBottomLeftRadius?: number | string;
    borderBottomRightRadius?: number | string;
    borderBottomStartRadius?: number | string;
    borderRadius?: number | string;
    borderTopEndRadius?: number | string;
    borderTopLeftRadius?: number | string;
    borderTopRightRadius?: number | string;
    borderTopStartRadius?: number | string;

    fontSize?: number | string;
    fontWeight?:
        | 'normal'
        | 'bold'
        | '100'
        | '200'
        | '300'
        | '400'
        | '500'
        | '600'
        | '700'
        | '800'
        | '900'
        | string;
    letterSpacing?: number | string;
    lineHeight?: number | string;
};

export type WithElements<T> = {
    left?: T;
    right?: T;
};
