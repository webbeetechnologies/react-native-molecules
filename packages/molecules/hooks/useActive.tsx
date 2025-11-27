import createPseudoHook from './createPsuedoHook';

export const useActive = createPseudoHook({
    events: ['mousedown', 'mouseup'],
});
