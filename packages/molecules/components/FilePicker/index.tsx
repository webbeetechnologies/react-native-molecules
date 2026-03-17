import { getRegisteredComponentWithFallback } from '../../core';
import FilePickerDefault from './FilePicker';

export const FilePicker = getRegisteredComponentWithFallback('FilePicker', FilePickerDefault);

export type { Props as FilePickerProps } from './FilePicker';
export { FilePickerContext, defaultStyles } from './utils';
export type { FilePickerContextType } from './utils';
