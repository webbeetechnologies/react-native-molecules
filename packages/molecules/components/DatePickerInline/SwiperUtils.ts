import { type RefObject, useEffect } from 'react';

import { useLatest } from '../../hooks';
import { addMonths, differenceInMonths, getRealIndex, startAtIndex } from './dateUtils';

export type SwiperProps = {
    initialIndex: number;
    scrollMode: 'horizontal' | 'vertical';
    renderItem: (index: number) => any;
    renderHeader?: () => any;
    renderFooter?: () => any;
};

export function useYearChange(
    onChange: (index: number | undefined) => void,
    {
        selectedYear,
        currentIndexRef,
    }: {
        currentIndexRef: RefObject<number>;
        selectedYear: number | undefined;
    },
) {
    const onChangeRef = useLatest(onChange);
    useEffect(() => {
        if (selectedYear) {
            const currentIndex = currentIndexRef.current || 0;
            const currentDate = addMonths(new Date(), getRealIndex(currentIndex));
            currentDate.setFullYear(selectedYear);

            const today = new Date();
            const months = differenceInMonths(today, currentDate);

            const newIndex = startAtIndex + months;
            if (currentIndex !== newIndex) {
                onChangeRef.current(newIndex);
            }
        }
    }, [currentIndexRef, onChangeRef, selectedYear]);
}
