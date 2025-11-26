export type ComponentPropRow = {
    name: string;
    type: string;
    optional: boolean;
    description: string;
    defaultValue: string | null;
};

export type ComponentPropDoc = {
    name: string;
    sourcePath: string;
    props: ComponentPropRow[];
};

export type ComponentCategory =
    | 'Surfaces & Layout'
    | 'Inputs & Controls'
    | 'Navigation'
    | 'Feedback & Status'
    | 'Overlay & Menus'
    | 'Data Display'
    | 'Utilities';

export type ComponentDocMeta = {
    name: string;
    title?: string;
    description: string;
    category: ComponentCategory;
    status?: 'stable' | 'beta' | 'experimental';
    usage: string;
    highlights?: string[];
    whenToUse?: string[];
    related?: string[];
    subcomponents?: string[];
    inherits?: string[];
    propsNote?: string;
};

