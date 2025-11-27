import { Platform } from 'react-native';

export const getOS = () => {
    return Platform.OS;
};

export const isMac = () => false;
