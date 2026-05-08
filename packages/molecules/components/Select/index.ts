import { getRegisteredComponentWithFallback } from '../../core';
import SelectRoot, {
    SelectContent,
    SelectDropdown,
    SelectOption,
    SelectSearchInput,
    SelectTrigger,
    SelectTriggerOutline,
    SelectValue,
} from './Select';

const SelectWithSubcomponents = Object.assign(SelectRoot, {
    Trigger: SelectTrigger,
    TriggerOutline: SelectTriggerOutline,
    Value: SelectValue,
    Dropdown: SelectDropdown,
    Content: SelectContent,
    Option: SelectOption,
    SearchInput: SelectSearchInput,
});

export const Select = getRegisteredComponentWithFallback('Select', SelectWithSubcomponents);

export * from './context';
export type * from './types';
export * from './utils';
