import createPseudoHook from './createPsuedoHook';

export const useFocus = createPseudoHook({
    events: ['focus', 'blur'],
});
