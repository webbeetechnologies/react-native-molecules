import { getRegisteredComponentWithFallback, registerMoleculesComponents } from '../../core';
import AccordionDefault from './Accordion';
import AccordionItemComponent from './AccordionItem';
import AccordionItemContent from './AccordionItemContent';
import AccordionItemHeader from './AccordionItemHeader';

const AccordionItemDefault = Object.assign(AccordionItemComponent, {
    Header: AccordionItemHeader,
    Content: AccordionItemContent,
});

registerMoleculesComponents({
    Accordion: AccordionDefault,
    AccordionItem: AccordionItemDefault,
});

export const Accordion = getRegisteredComponentWithFallback('Accordion', AccordionDefault);
export const AccordionItem = getRegisteredComponentWithFallback(
    'AccordionItem',
    AccordionItemDefault,
);

export type { Props as AccordionProps } from './Accordion';
export type { Props as AccordionItemProps } from './AccordionItem';
export type { Props as AccordionItemContentProps } from './AccordionItemContent';
export type {
    AccordionHeaderElementProps,
    Props as AccordionItemHeaderProps,
} from './AccordionItemHeader';
export {
    accordionItemContentStyles,
    accordionItemHeaderStyles,
    accordionItemStyles,
    accordionStyles,
} from './utils';
