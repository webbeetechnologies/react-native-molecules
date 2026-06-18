export type IconButtonVariant = 'default' | 'outlined' | 'contained' | 'contained-tonal';
export type IconButtonShape = 'round' | 'square';
export type IconButtonWidth = 'narrow' | 'default' | 'wide';

export type IconButtonDefaultProps = {
    size: 'xs' | 'sm' | 'md' | 'lg' | number;
    variant: IconButtonVariant;
    shape: IconButtonShape;
    width: IconButtonWidth;
    animated: boolean;
};
