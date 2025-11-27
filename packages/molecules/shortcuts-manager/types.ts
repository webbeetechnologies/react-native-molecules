export type Shortcut = {
    name: string;
    keys: (string | string[])[];
    scope?: string;
    preventDefault?: boolean;
    matcher?: (e: KeyboardEvent, key: string | string[], details: ShortcutEventDetail) => boolean;
};

export type Scope = {
    name: string;
    /*
     * HTMLElement
     * this is currently the only way for now to get focustrap feature.
     * TODO - find a solution with ref
     * */
    node?: Element | null;
};

export type ShortcutEventDetail = {
    pressedKeys: string[];
    normalizedKey: string;
    modifiers: string[];
    key: string;
};
