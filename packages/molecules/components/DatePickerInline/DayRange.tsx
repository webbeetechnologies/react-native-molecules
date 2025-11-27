import { memo } from 'react';
import { StyleSheet, View } from 'react-native';

import { resolveStateVariant } from '../../utils';
import { datePickerDayRangeStyles } from './utils';

function DayRange({
    leftCrop,
    rightCrop,
    inRange,
}: {
    leftCrop: boolean;
    rightCrop: boolean;
    inRange: boolean;
}) {
    const bothWays = inRange && leftCrop && rightCrop;
    const isCrop = inRange && (leftCrop || rightCrop) && !(leftCrop && rightCrop);

    datePickerDayRangeStyles.useVariants({
        state: resolveStateVariant({
            isRightCrop: rightCrop,
            isLeftCrop: leftCrop,
            inRange,
            bothWays,
            isCrop,
        }) as any,
    });

    return (
        <>
            {(inRange || isCrop) && (
                <View
                    pointerEvents="none"
                    style={[StyleSheet.absoluteFill, datePickerDayRangeStyles.container]}>
                    {isCrop && (
                        <>
                            <View style={datePickerDayRangeStyles.rightCrop} />
                            <View style={datePickerDayRangeStyles.centerCrop} />
                            <View style={datePickerDayRangeStyles.leftCrop} />
                        </>
                    )}
                </View>
            )}
        </>
    );
}

export default memo(DayRange);
