/**
 * Custom sidebar link component that prepends per-item icons.
 */

import isInternalUrl from '@docusaurus/isInternalUrl';
import Link from '@docusaurus/Link';
import { isActiveSidebarItem } from '@docusaurus/plugin-content-docs/client';
import { ThemeClassNames } from '@docusaurus/theme-common';
import type { Props } from '@theme/DocSidebarItem/Link';
import IconExternalLink from '@theme/Icon/ExternalLink';
import clsx from 'clsx';
import { type ReactNode, useEffect, useRef } from 'react';

import SidebarIcon from '../SidebarIcon';
import styles from './styles.module.css';

function LinkLabel({ label }: { label: string }) {
    return (
        <span title={label} className={styles.linkLabel}>
            {label}
        </span>
    );
}

function getIconFromItem(item: Props['item']): string | undefined {
    const customIcon = (item as { customProps?: { icon?: string } }).customProps?.icon;
    return typeof customIcon === 'string' ? customIcon : undefined;
}

export default function DocSidebarItemLink({
    item,
    onItemClick,
    activePath,
    level,
    index: _,
    ...props
}: Props): ReactNode {
    const { href, label, className, autoAddBaseUrl } = item;
    const isActive = isActiveSidebarItem(item, activePath);
    const isInternalLink = isInternalUrl(href);
    const icon = getIconFromItem(item);
    const itemRef = useRef<HTMLLIElement | null>(null);

    useEffect(() => {
        if (isActive && itemRef.current) {
            itemRef.current.scrollIntoView({
                behavior: 'instant',
                block: 'center',
                inline: 'nearest',
            });
        }
    }, [isActive]);

    return (
        <li
            ref={itemRef}
            className={clsx(
                ThemeClassNames.docs.docSidebarItemLink,
                ThemeClassNames.docs.docSidebarItemLinkLevel(level),
                'menu__list-item',
                className,
            )}
            key={label}>
            <Link
                className={clsx('menu__link', !isInternalLink && styles.menuExternalLink, {
                    'menu__link--active': isActive,
                })}
                autoAddBaseUrl={autoAddBaseUrl}
                aria-current={isActive ? 'page' : undefined}
                to={href}
                {...(isInternalLink && {
                    onClick: onItemClick ? () => onItemClick(item) : undefined,
                })}
                {...props}>
                <span className={styles.linkContent}>
                    {icon && (
                        <span className={styles.linkIcon}>
                            <SidebarIcon icon={icon} />
                        </span>
                    )}
                    <LinkLabel label={label} />
                </span>
                {!isInternalLink && <IconExternalLink />}
            </Link>
        </li>
    );
}
