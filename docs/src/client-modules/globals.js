// Define React Native globals for web environment
// This ensures __DEV__ is available for React Native libraries
(function () {
    if (typeof window !== 'undefined') {
        // In browser, check if we're in development mode
        // Docusaurus sets this via webpack, but we provide a fallback
        if (typeof window.__DEV__ === 'undefined') {
            // Check if we're in development by looking at hostname or other indicators
            window.__DEV__ =
                window.location.hostname === 'localhost' ||
                window.location.hostname === '127.0.0.1' ||
                window.location.hostname.includes('.local');
        }
    }

    // For Node.js/server-side rendering
    if (typeof global !== 'undefined' && typeof global.__DEV__ === 'undefined') {
        global.__DEV__ = process.env.NODE_ENV === 'development';
    }
})();
