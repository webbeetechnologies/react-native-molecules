import { useShortcutsManagerContextValueSelector } from '../ShortcutsManager';

const useIsKeyPress = (key: string) => {
    return useShortcutsManagerContextValueSelector(
        prev => !!prev.pressedKeys.find(pressedKey => pressedKey === key),
    );
};

export default useIsKeyPress;
