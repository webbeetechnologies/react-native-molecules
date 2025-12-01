import { getRegisteredComponentWithFallback } from '../../core';
import ListItemComponent from './ListItem';
import ListItemDescription from './ListItemDescription';
import ListItemTitle from './ListItemTitle';

const ListItemDefault = Object.assign(ListItemComponent, {
    Title: ListItemTitle,
    Description: ListItemDescription,
});

export const ListItem = getRegisteredComponentWithFallback('ListItem', ListItemDefault);

export type { Props as ListItemProps } from './ListItem';
export { listItemDescriptionStyles, listItemStyles, listItemTitleStyles } from './utils';
