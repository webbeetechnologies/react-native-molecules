import { getRegisteredComponentWithFallback } from '../../core';
import { Slot as SlotComponent, Slottable } from './Slot';

const SlotDefault = Object.assign(SlotComponent, { Slottable, Root: SlotComponent });

export const Slot = getRegisteredComponentWithFallback('Slot', SlotDefault);

export { createSlot, createSlottable, type SlotProps } from './Slot';
