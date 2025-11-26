import { useColorMode, useThemeConfig } from '@docusaurus/theme-common';
import IconDarkMode from '@theme/Icon/DarkMode';
import IconLightMode from '@theme/Icon/LightMode';
import clsx from 'clsx';
import React, { ReactNode } from 'react';

import styles from './styles.module.css';

type ColorModeOption = {
    id: 'light' | 'dark';
    label: string;
    Icon: (props: React.SVGProps<SVGSVGElement>) => ReactNode;
};

const COLOR_OPTIONS: ColorModeOption[] = [
    {
        id: 'light',
        label: 'Switch to light mode',
        Icon: IconLightMode,
    },
    {
        id: 'dark',
        label: 'Switch to dark mode',
        Icon: IconDarkMode,
    },
];

type Props = {
    className?: string;
};

export default function NavbarColorModeToggle({ className }: Props) {
    const navbarStyle = useThemeConfig().navbar.style;
    const { disableSwitch } = useThemeConfig().colorMode;
    const { colorMode, setColorMode } = useColorMode();

    if (disableSwitch) {
        return null;
    }

    return (
        <div
            className={clsx(
                styles.toggle,
                navbarStyle === 'dark' && styles.darkNavbarToggle,
                className,
            )}
            role="group"
            aria-label="Color mode toggle"
            data-mode={colorMode}>
            <span aria-hidden className={styles.thumb} />
            {COLOR_OPTIONS.map(({ id, label, Icon }) => {
                const isActive = colorMode === id;

                return (
                    <button
                        key={id}
                        type="button"
                        className={clsx('clean-btn', styles.toggleButton)}
                        data-active={isActive ? 'true' : 'false'}
                        aria-pressed={isActive}
                        aria-label={label}
                        onClick={() => {
                            if (!isActive) {
                                setColorMode(id);
                            }
                        }}>
                        <Icon aria-hidden className={styles.icon} />
                    </button>
                );
            })}
        </div>
    );
}
