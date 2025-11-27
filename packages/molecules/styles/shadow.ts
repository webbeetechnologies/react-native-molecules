import type { MD3Elevation } from '../types/theme';
import { MD3Colors } from './themes/tokens';

const MD3_SHADOW_OPACITY = 0.3;
const MD3_SHADOW_COLOR = MD3Colors.primary0;

export const inputRange: MD3Elevation[] = [0, 1, 2, 3, 4, 5];
export const shadowHeight = [0, 1, 2, 4, 6, 8];
export const shadowRadius = [0, 3, 6, 8, 10, 12];

export default function shadow(elevation: number) {
    return {
        shadowColor: MD3_SHADOW_COLOR,
        shadowOpacity: elevation ? MD3_SHADOW_OPACITY : 0,
        shadowOffset: {
            width: 0,
            height: shadowHeight[elevation],
        },
        shadowRadius: shadowRadius[elevation],
    };
}
