import { memo, useMemo } from 'react';
import { View } from 'react-native';

import { Text } from '../Text';
import { circleSize } from './timeUtils';
import { timePickerClockMinutesStyles } from './utils';
function AnalogClockMinutes({ minutes }: { minutes: number }) {
    const range = getMinuteNumbers(circleSize, 12);

    const { activeTextColor, outerHourRootStyle, outerHourInnerStyle } = useMemo(() => {
        const { outerHourRoot, outerHourInner } = timePickerClockMinutesStyles;

        return {
            activeTextColor: timePickerClockMinutesStyles.root?._activeTextColor,
            outerHourRootStyle: (a: number[]) => [
                outerHourRoot,
                {
                    top: a[1] || 0,
                    left: a[0] || 0,
                },
            ],
            outerHourInnerStyle: outerHourInner,
        };
    }, []);

    return (
        <>
            {range.map((a, i) => {
                const currentMinutes = i * 5;
                const isZero = currentMinutes === 0;
                let isCurrent = currentMinutes - 1 <= minutes && currentMinutes + 1 >= minutes;
                if (isZero) {
                    isCurrent = minutes >= 59 || currentMinutes + 1 >= minutes;
                }
                return (
                    <View key={i} pointerEvents="none" style={outerHourRootStyle(a)}>
                        <View style={outerHourInnerStyle}>
                            <Text
                                style={isCurrent ? { color: activeTextColor } : undefined}
                                selectable={false}>
                                {isZero ? '00' : currentMinutes}
                            </Text>
                        </View>
                    </View>
                );
            })}
        </>
    );
}

function getMinuteNumbers(size: number, count: number) {
    let angle = 0;
    const step = (2 * Math.PI) / count;
    const radius = size / 2.5;

    angle = angle = (-90 * Math.PI) / 180;

    return Array(12)
        .fill(true)
        .map(() => {
            const x = Math.round(size / 2 + radius * Math.cos(angle));
            const y = Math.round(size / 2 + radius * Math.sin(angle));
            angle += step;
            return [x, y];
        });
}

export default memo(AnalogClockMinutes);
