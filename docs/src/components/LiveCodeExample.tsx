import './LiveCodeExample.css';

import { useColorMode } from '@docusaurus/theme-common';
import { themes as prismThemes } from 'prism-react-renderer';
import { useEffect, useMemo, useRef, useState } from 'react';
import { LiveEditor, LiveError, LivePreview, LiveProvider } from 'react-live';

import { defaultScope } from './LiveCodeExampleScope';

type Language = 'tsx' | 'jsx';

type Props = {
    code: string;
    language?: Language;
    title?: string;
    noInline?: boolean;
    scope?: Record<string, any>;
    center?: boolean;
};

export default function LiveCodeExample({
    code,
    language = 'tsx',
    title,
    noInline = false,
    scope = {},
    center = true,
}: Props) {
    const { colorMode } = useColorMode();
    const mergedScope = useMemo(() => ({ ...defaultScope, ...scope }), [scope]);
    const [editableCode, setEditableCode] = useState(code);
    const [copyState, setCopyState] = useState<'idle' | 'copied'>('idle');
    const copyResetTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        setEditableCode(code);
    }, [code]);

    useEffect(() => {
        return () => {
            if (copyResetTimeoutRef.current) {
                clearTimeout(copyResetTimeoutRef.current);
            }
        };
    }, []);

    const executableCode = useMemo(() => {
        const codeWithoutImports = stripImports(editableCode);
        const processedCode =
            language === 'jsx' ? stripTypeAnnotations(codeWithoutImports) : codeWithoutImports;

        return autoRenderIfNeeded(processedCode);
    }, [editableCode, language]);

    const handleCodeChange = (newCode: string) => {
        setEditableCode(newCode);
    };

    const handleReload = () => {
        setEditableCode(code);
    };

    const handleReset = () => {
        setEditableCode(code);
    };

    const handleCopy = async () => {
        if (typeof navigator === 'undefined' || !navigator.clipboard) {
            return;
        }

        try {
            await navigator.clipboard.writeText(editableCode);
            setCopyState('copied');
            if (copyResetTimeoutRef.current) {
                clearTimeout(copyResetTimeoutRef.current);
            }
            copyResetTimeoutRef.current = setTimeout(() => {
                setCopyState('idle');
            }, 1600);
        } catch {
            // ignore clipboard failures
        }
    };

    const syntaxTheme = colorMode === 'dark' ? prismThemes.dracula : prismThemes.github;
    const fileLabel = title ?? getDefaultFileName(language);

    return (
        <div className="live-code-example">
            <div className="live-code-example__header">
                <div className="live-code-example__file">
                    <span className="live-code-example__file-indicator" />
                    <span className="live-code-example__file-name">{fileLabel}</span>
                </div>
                <div className="live-code-example__actions">
                    <button
                        aria-label="Reload initial example"
                        className="live-code-example__action-button"
                        onClick={handleReload}
                        title="Reload initial code"
                        type="button">
                        <RotateIcon />
                    </button>
                </div>
            </div>

            <LiveProvider
                code={executableCode}
                noInline={noInline}
                scope={mergedScope}
                theme={syntaxTheme}>
                <div className="live-code-example__layout">
                    <div className="live-code-example__panel live-code-example__panel--preview">
                        <div className="live-code-example__preview">
                            <div
                                className={`live-code-example__preview-surface ${
                                    !center ? 'live-code-example__preview-surface--no-center' : ''
                                }`}>
                                <LivePreview />
                            </div>
                        </div>
                        <LiveError className="live-code-example__error" />
                    </div>
                    <div className="live-code-example__panel live-code-example__panel--code">
                        <div className="live-code-example__editor-actions">
                            <button
                                aria-label="Copy code"
                                className={`live-code-example__floating-button ${
                                    copyState === 'copied'
                                        ? 'live-code-example__floating-button--copied'
                                        : ''
                                }`}
                                onClick={handleCopy}
                                title="Copy code"
                                type="button">
                                {copyState === 'copied' ? <CheckIcon /> : <CopyIcon />}
                            </button>
                            <button
                                aria-label="Reset to original code"
                                className="live-code-example__floating-button"
                                onClick={handleReset}
                                title="Reset to original code"
                                type="button">
                                <ResetIcon />
                            </button>
                        </div>
                        <div className="live-code-example__editor-scroll">
                            <LiveEditor
                                className="live-code-example__editor-content"
                                theme={syntaxTheme}
                                code={editableCode}
                                onChange={handleCodeChange}
                            />
                        </div>
                    </div>
                </div>
            </LiveProvider>
        </div>
    );
}

function getDefaultFileName(_language: Language) {
    return 'Preview (Web)';
}

function CopyIcon() {
    return (
        <svg
            aria-hidden="true"
            height="18"
            width="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round">
            <rect x="9" y="9" width="11" height="11" rx="2" />
            <path d="M5 15V7a2 2 0 0 1 2-2h8" />
        </svg>
    );
}

function ResetIcon() {
    return (
        <svg
            aria-hidden="true"
            height="18"
            width="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round">
            <polyline points="1 4 1 10 7 10" />
            <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
        </svg>
    );
}

function CheckIcon() {
    return (
        <svg
            aria-hidden="true"
            height="18"
            width="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round">
            <path d="M20 6L9 17l-5-5" />
        </svg>
    );
}

function RotateIcon() {
    return (
        <svg
            aria-hidden="true"
            height="18"
            width="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round">
            <path d="M21.5 2v6h-6" />
            <path d="M21.34 15.57a10 10 0 1 1-.57-8.38" />
        </svg>
    );
}

const IMPORT_REGEX = /^import\s+.*?from\s+['"].*?['"];?\s*$/gm;
const EXPORT_DEFAULT_FUNCTION_REGEX = /export\s+default\s+function\s+([A-Za-z0-9_]+)/;
const EXPORT_FUNCTION_REGEX = /export\s+function\s+([A-Za-z0-9_]+)/;
const EXPORT_DEFAULT_IDENTIFIER_REGEX = /export\s+default\s+([A-Za-z0-9_]+)\s*;?/;

function stripImports(code: string) {
    return code.replace(IMPORT_REGEX, '').trim();
}

function stripTypeAnnotations(code: string) {
    return code
        .replace(/:\s*\w+(\[\])?/g, '')
        .replace(/<(\w+)>/g, '<$1>')
        .replace(/as\s+\w+/g, '');
}

function autoRenderIfNeeded(code: string) {
    const { cleanedCode, componentToRender } = findComponentToRender(code);

    if (!componentToRender) {
        return code;
    }

    const alreadyRendered = new RegExp(`<\\s*${componentToRender}\\b`).test(cleanedCode);

    if (alreadyRendered) {
        return cleanedCode;
    }

    return wrapWithAutoRender(cleanedCode, componentToRender);
}

function findComponentToRender(code: string) {
    if (EXPORT_DEFAULT_FUNCTION_REGEX.test(code)) {
        const match = code.match(EXPORT_DEFAULT_FUNCTION_REGEX);
        if (match) {
            const componentToRender = match[1];
            return {
                componentToRender,
                cleanedCode: code.replace(
                    EXPORT_DEFAULT_FUNCTION_REGEX,
                    `function ${componentToRender}`,
                ),
            };
        }
    }

    if (EXPORT_FUNCTION_REGEX.test(code)) {
        const match = code.match(EXPORT_FUNCTION_REGEX);
        if (match) {
            const componentToRender = match[1];
            return {
                componentToRender,
                cleanedCode: code.replace(EXPORT_FUNCTION_REGEX, `function ${componentToRender}`),
            };
        }
    }

    if (EXPORT_DEFAULT_IDENTIFIER_REGEX.test(code)) {
        const match = code.match(EXPORT_DEFAULT_IDENTIFIER_REGEX);
        if (match) {
            const componentToRender = match[1];
            return {
                componentToRender,
                cleanedCode: code.replace(EXPORT_DEFAULT_IDENTIFIER_REGEX, '').trim(),
            };
        }
    }

    return { cleanedCode: code, componentToRender: null };
}

function wrapWithAutoRender(code: string, componentName: string) {
    return `(function () {
${code}
return <${componentName} />;
})()`;
}
