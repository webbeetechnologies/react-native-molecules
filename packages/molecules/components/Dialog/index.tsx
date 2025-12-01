import { getRegisteredComponentWithFallback } from '../../core';
import DialogComponent from './Dialog';
import DialogActions from './DialogActions';
import DialogContent from './DialogContent';
import DialogTitle from './DialogTitle';

export const DialogDefault = Object.assign(
    // @component ./Checkbox.tsx
    DialogComponent,
    {
        // @component ./DialogContent.tsx
        Content: DialogContent,
        // @component ./DialogActions.tsx
        Actions: DialogActions,
        // @component ./DialogTitle.tsx
        Title: DialogTitle,
    },
);

export const Dialog = getRegisteredComponentWithFallback('Dialog', DialogDefault);

export type { Props as DialogProps } from './Dialog';
export type { Props as DialogActionsProps } from './DialogActions';
export type { Props as DialogContentProps } from './DialogContent';
export type { Props as DialogTitleProps } from './DialogTitle';
export {
    dialogActionsStyles,
    dialogContentStyles,
    dialogIconStyles,
    dialogScrollAreaStyles,
    dialogStyles,
    dialogTitleStyles,
} from './utils';
