import { getRegisteredComponentWithFallback } from '../../core';
import ModalDefault from './Modal';

export const Modal = getRegisteredComponentWithFallback('Modal', ModalDefault);

export type { Props as ModalProps } from './Modal';
export { modalStyles } from './utils';
