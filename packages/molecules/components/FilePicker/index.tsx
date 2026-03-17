import { getRegisteredComponentWithFallback } from '../../core';
import FilePickerDefault from './FilePicker';

export const FilePicker = getRegisteredComponentWithFallback('FilePicker', FilePickerDefault);

export type { Props as FilePickerProps } from './FilePicker';
export type { FilePickerContextType } from './utils';
export { defaultStyles, FilePickerContext } from './utils';
