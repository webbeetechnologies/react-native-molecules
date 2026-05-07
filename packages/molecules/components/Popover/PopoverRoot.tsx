import { type ComponentType, memo, type ReactNode, useMemo, useRef } from 'react';
import { type View } from 'react-native';

import { extractSubcomponents } from '../../utils/extractSubcomponents';
import { PopoverContext, type PopoverProps } from './common';

type PopoverPanelInternalProps = PopoverProps & { backdrop?: ReactNode };

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
            Popover_Backdrop,
            rest: restChildren,
        } = extractSubcomponents({
            children,
            allowedChildren: [
                { name: 'Popover_Trigger', allowMultiple: false },
                { name: 'Popover_Backdrop', allowMultiple: false },
            ] as const,
            includeRest: true,
        });

        const hasTrigger = Popover_Trigger.length > 0;
        const resolvedTriggerRef = triggerRefProp ?? (hasTrigger ? internalTriggerRef : undefined);

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
                    backdrop={Popover_Backdrop[0]}
                    {...rest}>
                    {restChildren}
                </PopoverPanel>
            </PopoverContext>
        );
    };

    return memo(PopoverRoot);
};
