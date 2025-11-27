import type Color from 'color';

export function lightenBy(color: Color, ratio: number) {
    const lightness = color.lightness();
    return color.lightness(lightness + (100 - lightness) * ratio);
}

export function darkenBy(color: Color, ratio: number) {
    const lightness = color.lightness();
    return color.lightness(lightness - lightness * ratio);
}
