import { memo, useId } from 'react';
import { View } from 'react-native';

import {
    cookie4Path,
    cookie9Path,
    expressFastSpatial,
    loadingIndicatorStyles as componentStyles,
    ovalPath,
    pentagonPath,
    pillPath,
    type Props,
    softBurstPath,
    sunnyPath,
    useProcessProps,
} from './utils';

/**
 * Material 3 Expressive Loading Indicator for Web.
 * Uses CSS 'd' attribute transitions for true shape morphing.
 */
const LoadingIndicator = ({
    animating = true,
    color: colorProp,
    size: sizeProp = 'md',
    style,
    variant = 'default',
    innerContainerProps,
}: Props) => {
    const id = useId();
    componentStyles.useVariants({
        variant: variant as 'contained',
    });

    const { size, strokeColor } = useProcessProps({
        variant,
        size: sizeProp,
        color: colorProp,
    });

    if (!animating) return null;

    return (
        <View
            style={[
                componentStyles.container,
                {
                    width: Math.floor((10 / 48) * size * 2) + size,
                    height: Math.floor((10 / 48) * size * 2) + size,
                },
                style,
            ]}
            accessible
            accessibilityLabel="Loading"
            accessibilityRole="progressbar"
            accessibilityState={{ busy: animating }}>
            <View
                {...innerContainerProps}
                style={[
                    { width: size, height: size },
                    componentStyles.innerContainer,
                    innerContainerProps?.style,
                ]}>
                <svg
                    className={`m3-expressive-svg-${id}`}
                    width={size}
                    height={size}
                    viewBox="0 0 38 38">
                    <path className={`m3-expressive-path-${id}`} fill={strokeColor} />
                </svg>
            </View>
            <style>
                {`
                .m3-expressive-svg-${id} {
                    transform-origin: center;
                    display: block;
                }

                .m3-expressive-path-${id} {
                    animation: m3-expressive-combined 4.55s linear infinite;
                    transform-origin: center;
                }

                @keyframes m3-expressive-pulse-${id} {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.1); }
                }

                @keyframes m3-expressive-combined {
                    0% {
                        animation-timing-function: ${expressFastSpatial};
                        transform: rotate(0deg);
                        d: path('${softBurstPath}');
                    }
                    14.28% {
                        animation-timing-function: ${expressFastSpatial};
                        transform: rotate(154.29deg);
                        d: path('${cookie9Path}');
                    }
                    28.57% {
                        animation-timing-function: ${expressFastSpatial};
                        transform: rotate(308.57deg);
                        d: path('${pentagonPath}');
                    }
                    42.85% {
                        animation-timing-function: ${expressFastSpatial};
                        transform: rotate(462.86deg);
                        d: path('${pillPath}');
                    }
                    57.14% {
                        animation-timing-function: ${expressFastSpatial};
                        transform: rotate(617.14deg);
                        d: path('${sunnyPath}');
                    }
                    71.42% {
                        animation-timing-function: ${expressFastSpatial};
                        transform: rotate(771.43deg);
                        d: path('${cookie4Path}');
                    }
                    85.71% {
                        animation-timing-function: ${expressFastSpatial};
                        transform: rotate(925.71deg);
                        d: path('${ovalPath}');
                    }
                    100% {
                        transform: rotate(1080deg);
                        d: path('${softBurstPath}');
                    }
                }
                `}
            </style>
        </View>
    );
};

export default memo(LoadingIndicator);
