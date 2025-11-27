import * as React from 'react';
import { Platform } from 'react-native';

export default function createPseudoHook<T>({ events }: { events: string[] }) {
    return function (ref: React.RefObject<T>, listen: boolean = true) {
        if (Platform.OS !== 'web') {
            return false;
        }

        const [isActive, setActive] = React.useState(false);

        React.useEffect(() => {
            const [eventIn, eventOut] = events;

            const node = ref?.current;
            if (!node || !listen) {
                return;
            }
            const resolve = (value: boolean) => {
                setActive(value);
            };

            // @ts-ignore
            const onStart = resolve.bind(this, true);
            // @ts-ignore
            const onEnd = resolve.bind(this, false);

            // @ts-ignore
            node.addEventListener(eventIn, onStart);
            // @ts-ignore
            node.addEventListener(eventOut, onEnd);

            // Special case for useActive to respond when the user drags out of the view and releases.
            if (eventOut === 'mouseup') {
                document.addEventListener(eventOut, onEnd, false);
            }
            return () => {
                document.removeEventListener(eventOut, onEnd, false);
                // @ts-ignore
                node.removeEventListener(eventIn, onStart);
                // @ts-ignore
                node.removeEventListener(eventOut, onEnd);
            };
            // we only take initial value of listen
            // eslint-disable-next-line
        }, [ref]);

        return isActive;
    };
}
