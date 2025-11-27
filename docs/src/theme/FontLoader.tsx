import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';
import { useEffect } from 'react';

/**
 * Injects @font-face rule for MaterialDesignIcons font with correct baseUrl.
 * This component handles the baseUrl prefix for production deployments.
 */
export default function FontLoader() {
    useEffect(() => {
        if (!ExecutionEnvironment.canUseDOM) {
            return;
        }

        // Check if already injected
        if (document.getElementById('material-design-icons-font')) {
            return;
        }

        // Detect baseUrl - in development it's empty, in production it's '/react-native-molecules'
        let baseUrl = '';

        // Method 1: Check window.docusaurus (available after Docusaurus loads)
        const docusaurus = (window as any).docusaurus;
        if (docusaurus?.baseUrl) {
            baseUrl = docusaurus.baseUrl.replace(/\/$/, '');
        } else {
            // Method 2: Infer from pathname
            const pathname = window.location.pathname;
            if (pathname.startsWith('/react-native-molecules/')) {
                baseUrl = '/react-native-molecules';
            }
            // In development, baseUrl remains empty
        }

        // Construct font path
        const fontPath = `${baseUrl}/fonts/MaterialDesignIcons.ttf`;

        // Inject @font-face rule
        const style = document.createElement('style');
        style.id = 'material-design-icons-font';
        style.textContent = `
            @font-face {
                font-family: 'MaterialDesignIcons';
                src: url('${fontPath}') format('truetype');
                font-weight: normal;
                font-style: normal;
            }
        `;

        document.head.appendChild(style);
    }, []);

    return null;
}
