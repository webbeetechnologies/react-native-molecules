import { getRegisteredComponentWithFallback } from '../../core';
import PopoverDefault, {
    PopoverArrow,
    PopoverContent,
    PopoverOverlay,
    PopoverTrigger,
} from './Popover';

const PopoverBase = getRegisteredComponentWithFallback('Popover', PopoverDefault);

export const Popover = Object.assign(PopoverBase, {
    Trigger: PopoverTrigger,
    Content: PopoverContent,
    Arrow: PopoverArrow,
    Overlay: PopoverOverlay,
});

export type { Align, PopoverProps, Position } from './common';
export { PopoverContext, PopoverPanelContext } from './common';
