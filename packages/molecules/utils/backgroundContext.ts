import { createContext } from 'react';

export const BackgroundContext = createContext<{
    backgroundColor?: string;
    color?: string;
}>({
    backgroundColor: undefined,
    color: undefined,
});
