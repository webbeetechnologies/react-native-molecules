/**
 * Custom category sidebar item that displays icons beside labels.
 */

import Link from '@docusaurus/Link';
import type { PropSidebarItemCategory, PropSidebarItemLink } from '@docusaurus/plugin-content-docs';
import {
    findFirstSidebarItemLink,
    isActiveSidebarItem,
    useDocSidebarItemsExpandedState,
    useVisibleSidebarItems,
} from '@docusaurus/plugin-content-docs/client';
import {
    Collapsible,
    ThemeClassNames,
    useCollapsible,
    usePrevious,
    useThemeConfig,
} from '@docusaurus/theme-common';
import { isSamePath } from '@docusaurus/theme-common/internal';
import { translate } from '@docusaurus/Translate';
import useIsBrowser from '@docusaurus/useIsBrowser';
import type { Props } from '@theme/DocSidebarItem/Category';
import DocSidebarItemLink from '@theme/DocSidebarItem/Link';
import DocSidebarItems from '@theme/DocSidebarItems';
import clsx from 'clsx';
import React, { type ComponentProps, type ReactNode, useEffect, useMemo } from 'react';

import SidebarIcon from '../SidebarIcon';
import styles from './styles.module.css';

type CategoryIconProps = {
    icon?: string;
    label: string;
};

function CategoryLinkContent({ icon, label }: CategoryIconProps) {
    return (
        <span className={styles.categoryLinkContent}>
            {icon && (
                <span className={styles.categoryIcon} aria-hidden="true">
                    <SidebarIcon icon={icon} />
                </span>
            )}
            <span title={label} className={styles.categoryLinkLabel}>
                {label}
            </span>
        </span>
    );
}

function getCategoryIcon(item: Props['item']): string | undefined {
    const customIcon = (item as { customProps?: { icon?: string } }).customProps?.icon;
    return typeof customIcon === 'string' ? customIcon : undefined;
}

function useAutoExpandActiveCategory({
    isActive,
    collapsed,
    updateCollapsed,
    activePath,
}: {
    isActive: boolean;
    collapsed: boolean;
    updateCollapsed: (b: boolean) => void;
    activePath: string;
}) {
    const wasActive = usePrevious(isActive);
    const previousActivePath = usePrevious(activePath);
    useEffect(() => {
        const justBecameActive = isActive && !wasActive;
        const stillActiveButPathChanged =
            isActive && wasActive && activePath !== previousActivePath;
        if ((justBecameActive || stillActiveButPathChanged) && collapsed) {
            updateCollapsed(false);
        }
    }, [isActive, wasActive, collapsed, updateCollapsed, activePath, previousActivePath]);
}

function useCategoryHrefWithSSRFallback(item: Props['item']): string | undefined {
    const isBrowser = useIsBrowser();
    return useMemo(() => {
        if (item.href && !item.linkUnlisted) {
            return item.href;
        }
        if (isBrowser || !item.collapsible) {
            return undefined;
        }
        return findFirstSidebarItemLink(item);
    }, [item, isBrowser]);
}

function CollapseButton({
    collapsed,
    categoryLabel,
    onClick,
}: {
    collapsed: boolean;
    categoryLabel: string;
    onClick: ComponentProps<'button'>['onClick'];
}) {
    return (
        <button
            aria-label={
                collapsed
                    ? translate(
                          {
                              id: 'theme.DocSidebarItem.expandCategoryAriaLabel',
                              message: "Expand sidebar category '{label}'",
                              description: 'The ARIA label to expand the sidebar category',
                          },
                          { label: categoryLabel },
                      )
                    : translate(
                          {
                              id: 'theme.DocSidebarItem.collapseCategoryAriaLabel',
                              message: "Collapse sidebar category '{label}'",
                              description: 'The ARIA label to collapse the sidebar category',
                          },
                          { label: categoryLabel },
                      )
            }
            aria-expanded={!collapsed}
            type="button"
            className="clean-btn menu__caret"
            onClick={onClick}
        />
    );
}

export default function DocSidebarItemCategory(props: Props): ReactNode {
    const visibleChildren = useVisibleSidebarItems(props.item.items, props.activePath);
    if (visibleChildren.length === 0) {
        return <DocSidebarItemCategoryEmpty {...props} />;
    }
    return <DocSidebarItemCategoryCollapsible {...props} />;
}

function isCategoryWithHref(
    category: PropSidebarItemCategory,
): category is PropSidebarItemCategory & { href: string } {
    return typeof category.href === 'string';
}

function DocSidebarItemCategoryEmpty({ item, ...props }: Props): ReactNode {
    if (!isCategoryWithHref(item)) {
        return null;
    }
    const {
        type: _type,
        collapsed: _collapsed,
        collapsible: _collapsible,
        items: _items,
        linkUnlisted: _linkUnlisted,
        ...forwardableProps
    } = item;
    const linkItem: PropSidebarItemLink = {
        type: 'link',
        ...forwardableProps,
    };
    return <DocSidebarItemLink item={linkItem} {...props} />;
}

function DocSidebarItemCategoryCollapsible({
    item,
    onItemClick,
    activePath,
    level,
    index,
    ...props
}: Props): ReactNode {
    const { items, label, collapsible, className, href } = item;
    const {
        docs: {
            sidebar: { autoCollapseCategories },
        },
    } = useThemeConfig();
    const hrefWithSSRFallback = useCategoryHrefWithSSRFallback(item);

    const isActive = isActiveSidebarItem(item, activePath);
    const isCurrentPage = isSamePath(href, activePath);
    const icon = getCategoryIcon(item);

    const { collapsed, setCollapsed } = useCollapsible({
        initialState: () => {
            if (!collapsible) {
                return false;
            }
            return isActive ? false : item.collapsed;
        },
    });

    const { expandedItem, setExpandedItem } = useDocSidebarItemsExpandedState();
    const updateCollapsed = (toCollapsed: boolean = !collapsed) => {
        setExpandedItem(toCollapsed ? null : index);
        setCollapsed(toCollapsed);
    };
    useAutoExpandActiveCategory({
        isActive,
        collapsed,
        updateCollapsed,
        activePath,
    });
    useEffect(() => {
        if (
            collapsible &&
            expandedItem != null &&
            expandedItem !== index &&
            autoCollapseCategories
        ) {
            setCollapsed(true);
        }
    }, [collapsible, expandedItem, index, setCollapsed, autoCollapseCategories]);

    const handleItemClick: ComponentProps<'a'>['onClick'] = e => {
        onItemClick?.(item);
        if (collapsible) {
            if (href) {
                if (isCurrentPage) {
                    e.preventDefault();
                    updateCollapsed();
                } else {
                    updateCollapsed(false);
                }
            } else {
                e.preventDefault();
                updateCollapsed();
            }
        }
    };

    return (
        <li
            className={clsx(
                ThemeClassNames.docs.docSidebarItemCategory,
                ThemeClassNames.docs.docSidebarItemCategoryLevel(level),
                'menu__list-item',
                {
                    'menu__list-item--collapsed': collapsed,
                },
                className,
            )}>
            <div
                className={clsx('menu__list-item-collapsible', {
                    'menu__list-item-collapsible--active': isCurrentPage,
                })}>
                <Link
                    className={clsx(styles.categoryLink, 'menu__link', {
                        'menu__link--sublist': collapsible,
                        'menu__link--sublist-caret': !href && collapsible,
                        'menu__link--active': isActive,
                    })}
                    onClick={handleItemClick}
                    aria-current={isCurrentPage ? 'page' : undefined}
                    role={collapsible && !href ? 'button' : undefined}
                    aria-expanded={collapsible && !href ? !collapsed : undefined}
                    href={collapsible ? hrefWithSSRFallback ?? '#' : hrefWithSSRFallback}
                    {...props}>
                    <CategoryLinkContent icon={icon} label={label} />
                </Link>
                {href && collapsible && (
                    <CollapseButton
                        collapsed={collapsed}
                        categoryLabel={label}
                        onClick={e => {
                            e.preventDefault();
                            updateCollapsed();
                        }}
                    />
                )}
            </div>

            <Collapsible lazy as="ul" className="menu__list" collapsed={collapsed}>
                <DocSidebarItems
                    items={items}
                    tabIndex={collapsed ? -1 : 0}
                    onItemClick={onItemClick}
                    activePath={activePath}
                    level={level + 1}
                />
            </Collapsible>
        </li>
    );
}
