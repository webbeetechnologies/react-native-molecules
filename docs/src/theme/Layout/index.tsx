import ErrorBoundary from '@docusaurus/ErrorBoundary';
import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';
import {
    PageMetadata,
    SkipToContentFallbackId,
    ThemeClassNames,
    useColorMode,
} from '@docusaurus/theme-common';
import { useKeyboardNavigation } from '@docusaurus/theme-common/internal';
import AnnouncementBar from '@theme/AnnouncementBar';
import ErrorPageContent from '@theme/ErrorPageContent';
import Footer from '@theme/Footer';
import LayoutProvider from '@theme/Layout/Provider';
import Navbar from '@theme/Navbar';
import SkipToContent from '@theme/SkipToContent';
import clsx from 'clsx';
import React, { useEffect, useLayoutEffect } from 'react';
import { UnistylesRuntime } from 'react-native-unistyles';

import styles from './styles.module.css';

const useClientLayoutEffect = ExecutionEnvironment.canUseDOM ? useLayoutEffect : useEffect;

type LayoutProps = {
    children: React.ReactNode;
    noFooter?: boolean;
    wrapperClassName?: string;
    title?: string;
    description?: string;
};

function ColorModeSync() {
    const { colorMode } = useColorMode();
    const nextTheme = colorMode === 'dark' ? 'dark' : 'light';

    useClientLayoutEffect(() => {
        if (!ExecutionEnvironment.canUseDOM) {
            return;
        }

        if (UnistylesRuntime.themeName !== nextTheme) {
            UnistylesRuntime.setTheme(nextTheme);
        }
    }, [nextTheme]);

    return null;
}

export default function Layout(props: LayoutProps) {
    const { children, noFooter, wrapperClassName, title, description } = props;

    useKeyboardNavigation();

    return (
        <LayoutProvider>
            <ColorModeSync />
            <PageMetadata title={title} description={description} />

            <SkipToContent />

            <AnnouncementBar />

            <Navbar />

            <div
                id={SkipToContentFallbackId}
                className={clsx(
                    ThemeClassNames.layout.main.container,
                    ThemeClassNames.wrapper.main,
                    styles.mainWrapper,
                    wrapperClassName,
                )}>
                <ErrorBoundary fallback={params => <ErrorPageContent {...params} />}>
                    {children}
                </ErrorBoundary>
            </div>

            {!noFooter && <Footer />}
        </LayoutProvider>
    );
}
