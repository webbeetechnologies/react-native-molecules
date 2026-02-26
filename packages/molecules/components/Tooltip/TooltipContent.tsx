import { memo, type ReactNode, useContext, useMemo } from 'react';
import { type StyleProp, Text, type ViewStyle } from 'react-native';

import { Popover, type PopoverProps } from '../Popover';
import { TooltipContext } from './Tooltip';
import { tooltipStyles } from './utils';

export type Props = Omit<PopoverProps, 'isOpen' | 'triggerRef' | 'onClose' | 'children'> & {
    children?: ReactNode;
};

const TooltipContent = memo(({ children, style, ...rest }: Props) => {
    const { isOpen, triggerRef, onClose, onMouseEnter, onMouseLeave } = useContext(TooltipContext);

    const popoverStyle = useMemo<StyleProp<ViewStyle>>(
        () => [tooltipStyles.content, style],
        [style],
    );

    if (!isOpen) return null;

    return (
        <Popover
            isOpen={isOpen}
            inverted
            triggerRef={triggerRef}
            onClose={onClose}
            {...rest}
            style={popoverStyle}
            // @ts-ignore — onMouseEnter/onMouseLeave spread onto the inner View via ...rest in Popover
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}>
            <Text style={tooltipStyles.contentText}>{children}</Text>
        </Popover>
    );
});

TooltipContent.displayName = 'Tooltip_Content';
export default TooltipContent;
