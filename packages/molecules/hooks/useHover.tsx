import createPseudoHook from './createPsuedoHook';

export const useHover = createPseudoHook({
    events: ['mouseenter', 'mouseleave'],
});
