// import { textFactory } from '../Text/textFactory';
import { memoize } from '../../utils/lodash';
import { IconPacks, type IconType } from './types';

const customIcons: any = {};

export const registerCustomIconType = (id: string, customIcon: any) => {
    customIcons[id] = customIcon;
};

export default memoize((type: IconType) => {
    switch (type) {
        case IconPacks.MaterialCommunity:
            return require('@react-native-vector-icons/material-design-icons').default;
        case IconPacks.Feather:
            return require('@react-native-vector-icons/feather').default;
        default:
            if (Object.prototype.hasOwnProperty.call(customIcons, type)) {
                return customIcons[type];
            }
            return require('@react-native-vector-icons/material-design-icons').default;
    }
});
