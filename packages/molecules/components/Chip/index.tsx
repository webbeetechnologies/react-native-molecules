import type { ComponentType } from 'react';

import { getRegisteredComponentWithFallback, registerMoleculesComponents } from '../../core';
import { default as ChipComponent, type Props as ChipProps } from './Chip';

export const ChipDefault = Object.assign(
    // @component ./Chip.tsx
    ChipComponent,
    {
        Assist: ChipComponent as ComponentType<
            Omit<
                ChipProps,
                | 'onClose'
                | 'closeIconName'
                | 'closeIconType'
                | 'selected'
                | 'selectedColor'
                | 'selectionBackgroundColor'
            >
        >,
        Filter: ChipComponent as ComponentType<
            Omit<ChipProps, 'onClose' | 'closeIconName' | 'closeIconType'>
        >,
        Input: ChipComponent,
        Suggestion: ChipComponent as ComponentType<
            Omit<
                ChipProps,
                | 'onClose'
                | 'closeIconName'
                | 'closeIconType'
                | 'selected'
                | 'selectedColor'
                | 'selectionBackgroundColor'
                | 'left'
                | 'right'
                | 'leftElementContainerStyle'
                | 'rightElementContainerStyle'
            >
        >,
    },
);

registerMoleculesComponents({
    Chip: ChipDefault,
});

export const Chip = getRegisteredComponentWithFallback('Chip', ChipDefault);

export type { Props as ChipProps } from './Chip';
export type { States } from './utils';
export { styles as chipStyles } from './utils';
