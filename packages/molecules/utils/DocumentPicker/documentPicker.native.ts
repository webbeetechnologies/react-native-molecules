import { type DocumentPickerOptions, pick } from '@react-native-documents/picker';

const pickMultiple = ({ allowMultiSelection = true, ...rest }: DocumentPickerOptions) =>
    pick({ allowMultiSelection, ...rest });

// to make sure only these 2 functions are available for all three platforms
export default {
    pickSingle: pick,
    pickMultiple: pickMultiple,
};
