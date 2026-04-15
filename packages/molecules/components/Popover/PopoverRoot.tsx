import {
    type ComponentType,
    memo,
    type ReactElement,
    type ReactNode,
    useMemo,
    useRef,
} from 'react';
import { type View } from 'react-native';

import { extractSubcomponents } from '../../utils/extractSubcomponents';
import { PopoverContext, type PopoverProps } from './common';

type PopoverPanelInternalProps = PopoverProps & { overlay?: ReactNode };

export const createPopoverRoot = (PopoverPanel: ComponentType<PopoverPanelInternalProps>) => {
    const PopoverRoot = ({
        triggerRef: triggerRefProp,
        isOpen,
        onClose,
        children,
        ...rest
    }: PopoverProps) => {
        const internalTriggerRef = useRef<View>(null);

        const {
            Popover_Trigger,
            Popover_Content,
            Popover_Overlay,
            rest: restChildren,
        } = extractSubcomponents({
            children,
            allowedChildren: [
                { name: 'Popover_Trigger', allowMultiple: false },
                { name: 'Popover_Content', allowMultiple: false },
                { name: 'Popover_Overlay', allowMultiple: false },
            ] as const,
            includeRest: true,
        });

        const hasTrigger = Popover_Trigger.length > 0;
        const resolvedTriggerRef = triggerRefProp ?? (hasTrigger ? internalTriggerRef : undefined);

        const panelContent =
            Popover_Content.length > 0
                ? (Popover_Content[0] as ReactElement<{ children?: ReactNode }>).props.children
                : restChildren;

        const contextValue = useMemo(
            () => ({
                triggerRef: resolvedTriggerRef ?? internalTriggerRef,
                isOpen,
                onClose,
            }),
            [resolvedTriggerRef, isOpen, onClose],
        );

        return (
            <PopoverContext value={contextValue}>
                {hasTrigger && Popover_Trigger[0]}
                <PopoverPanel
                    triggerRef={resolvedTriggerRef}
                    isOpen={isOpen}
                    onClose={onClose}
                    overlay={Popover_Overlay[0]}
                    {...rest}>
                    {panelContent}
                </PopoverPanel>
            </PopoverContext>
        );
    };

    return memo(PopoverRoot);
};
