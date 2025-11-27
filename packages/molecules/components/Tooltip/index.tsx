import { getRegisteredComponentWithFallback, registerMoleculesComponents } from '../../core';
import TooltipComponent from './Tooltip';
import TooltipContent from './TooltipContent';
import TooltipTrigger from './TooltipTrigger';

export const TooltipDefault = Object.assign(TooltipComponent, {
    Trigger: TooltipTrigger,
    Content: TooltipContent,
});

registerMoleculesComponents({
    Tooltip: TooltipDefault,
});

export const Tooltip = getRegisteredComponentWithFallback('Tooltip', TooltipDefault);

export type { Props as TooltipProps } from './Tooltip';
export type { Props as TooltipContentProps } from './TooltipContent';
export type { Props as TooltipTriggerProps } from './TooltipTrigger';
export { tooltipStyles } from './utils';
