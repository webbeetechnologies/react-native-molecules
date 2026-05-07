import { getRegisteredComponentWithFallback } from '../../core';
import PopoverDefault, { PopoverArrow, PopoverBackdrop, PopoverTrigger } from './Popover';

const PopoverBase = getRegisteredComponentWithFallback('Popover', PopoverDefault);

export const Popover = Object.assign(PopoverBase, {
    Trigger: PopoverTrigger,
    Arrow: PopoverArrow,
    Backdrop: PopoverBackdrop,
});

export type { Align, PopoverProps, Position } from './common';
export { PopoverContext, PopoverPanelContext } from './common';
