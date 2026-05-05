import { getRegisteredComponentWithFallback } from '../../core';
import ListDefault from './List';
export type { InternalListItemProps as ListItemProps } from './List';

export const List = getRegisteredComponentWithFallback('List', ListDefault);

export * from './context';
export type * from './types';
export * from './utils';
