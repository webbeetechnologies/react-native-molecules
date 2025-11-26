import { memo, useContext, useMemo } from 'react';
import { type TextProps, View, type ViewProps } from 'react-native';

import { Text } from '../Text';
import { DisplayModeContext } from './DisplayModeContext';
import { circleSize } from './timeUtils';
import { timePickerClockHoursStyles } from './utils';

const outerRange = getHourNumbers(false, circleSize, 12, 12, 1);
const innerRange = getHourNumbers(true, circleSize, 12, 12, 13);

function AnalogClockHours({ is24Hour, hours }: { is24Hour: boolean; hours: number }) {
    const { mode } = useContext(DisplayModeContext);

    const {
        activeTextColor,
        outerHourRootStyle,
        innerHourRootStyle,
        innerHourTextStyle,
        innerHourInner,
        outerHourInner,
    } = useMemo(() => {
        const {
            outerHourRoot,
            outerHourInner: _outerHourInner,
            innerHourRoot,
            innerHourInner: _innerHourInner,
            innerHourText,
        } = timePickerClockHoursStyles;

        return {
            activeTextColor: timePickerClockHoursStyles.root?._activeTextColor,
            outerHourRootStyle: outerHourRoot,
            innerHourRootStyle: innerHourRoot,
            innerHourTextStyle: innerHourText,
            outerHourInner: _outerHourInner,
            innerHourInner: _innerHourInner,
        };
    }, []);

    return (
        <>
            {outerRange.map((a, i) => (
                <HourWrapper key={i} pointerEvents="none" style={outerHourRootStyle} position={a}>
                    <View style={outerHourInner}>
                        {/* Display 00 instead of 12 for AM hours */}
                        <HourText
                            hours={hours}
                            is24Hour={is24Hour}
                            activeTextColor={activeTextColor}
                            type="outer"
                            index={i}>
                            {mode === 'AM' && !is24Hour && a.hourValue === 12 ? '00' : a.hourValue}
                        </HourText>
                    </View>
                </HourWrapper>
            ))}
            <>
                {is24Hour
                    ? innerRange.map((a, i) => (
                          <HourWrapper
                              key={i}
                              pointerEvents="none"
                              style={innerHourRootStyle}
                              position={a}>
                              <View style={innerHourInner}>
                                  <HourText
                                      hours={hours}
                                      is24Hour={is24Hour}
                                      activeTextColor={activeTextColor}
                                      type="inner"
                                      index={i}
                                      style={innerHourTextStyle}>
                                      {a.hourValue === 24 ? '00' : a.hourValue}
                                  </HourText>
                              </View>
                          </HourWrapper>
                      ))
                    : null}
            </>
        </>
    );
}

const HourWrapper = memo(
    ({
        style,
        position,
        ...rest
    }: ViewProps & {
        position: { x: number; y: number };
    }) => {
        const componentStyles = useMemo(() => {
            return [
                style,
                {
                    top: position.y || 0,
                    left: position.x || 0,
                },
            ];
        }, [position.x, position.y, style]);

        return <View pointerEvents="none" style={componentStyles} {...rest} />;
    },
);

const HourText = memo(
    ({
        style,
        children,
        type,
        index: i,
        hours,
        activeTextColor,
        is24Hour,
        ...rest
    }: TextProps & {
        type: 'outer' | 'inner';
        index: number;
        hours: number;
        activeTextColor: string;
        is24Hour: boolean;
    }) => {
        const componentStyles = useMemo(() => {
            const isOuterActive = (!is24Hour && hours === 0 && hours === i - 11) || hours === i + 1;
            const isInnerActive = i + 13 === hours || (i + 13 === 24 && hours === 0);
            const isActive = type === 'outer' ? isOuterActive : isInnerActive;

            return [style, isActive ? { color: activeTextColor } : null];
        }, [activeTextColor, hours, i, is24Hour, style, type]);

        return (
            <Text style={componentStyles} selectable={false} {...rest}>
                {children}
            </Text>
        );
    },
);

function getHourNumbers(
    is24Hour: boolean,
    size: number,
    count: number,
    arrayLength: number,
    startsAt: number,
) {
    let angle = 0;
    const step = (2 * Math.PI) / count;
    const radius = size / (is24Hour ? 4 : 2.5);

    angle = (-90 * Math.PI) / 180 + Math.PI / 6;

    return Array(arrayLength)
        .fill(true)
        .map(() => {
            const x = Math.round(size / 2 + radius * Math.cos(angle));
            const y = Math.round(size / 2 + radius * Math.sin(angle));
            angle += step;
            return { x, y, hourValue: startsAt++ };
        });
}

export default memo(AnalogClockHours);
