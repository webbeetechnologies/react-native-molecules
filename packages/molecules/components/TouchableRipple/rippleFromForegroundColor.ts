import setColor from 'color';

/** Ripple ink derived from background color for better contrast. */
export function rippleColorFromBackground(
    backgroundColor: string | undefined,
    fallback: string,
    alpha: number = 0.24,
): string {
    if (!backgroundColor || backgroundColor === '') {
        return fallback;
    }
    try {
        const base = setColor(backgroundColor);
        if (base.alpha() < 0.05) {
            return fallback;
        }
        return base.isLight() ? `rgba(0, 0, 0, ${alpha})` : `rgba(255, 255, 255, ${alpha})`;
    } catch {
        return fallback;
    }
}
