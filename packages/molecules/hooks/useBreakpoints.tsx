import { useTheme } from './useTheme';

const useBreakpoints = () => {
    return useTheme().grid.breakpoints;
};

export default useBreakpoints;
