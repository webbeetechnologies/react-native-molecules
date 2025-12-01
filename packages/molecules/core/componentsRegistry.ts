import type { ComponentType } from 'react';

interface RepositoryConstructor<T> {
    onRegister?: (arg: T, name: string, registery: Record<string, T>) => T;
    name?: string;
}

let id = Date.now();

export class Repository<T> {
    private registry: Record<string, T> = {};
    readonly #name!: string;

    readonly #onRegister!: (arg: T, name: string, registery: Record<string, T>) => T;

    get name() {
        return this.#name;
    }

    static get uniqueId() {
        return (id++).toString(36).substring(0, 15);
    }

    constructor({
        onRegister = arg => arg,
        name = Repository.uniqueId,
    }: RepositoryConstructor<T> = {}) {
        this.#onRegister = onRegister;
        this.#name = name;
    }

    has = (itemName: string): boolean => {
        return !!this.registry[itemName];
    };

    /**
     * Register a item with the src.
     */
    registerOne = <X extends T = T, ItemName extends string = ''>(itemName: ItemName, item: X) => {
        let updatedItem = this.#onRegister?.(item, itemName, { ...this.registry });
        if (!updatedItem) updatedItem = item;

        if (this.registry[itemName]) return;

        this.registry = {
            ...this.registry,
            [itemName]: updatedItem,
        };
    };

    /**
     * Register a item with the src.
     */
    register = (items: Record<string, any>) => {
        // let updatedItem = this.#onRegister?.(item, itemName, { ...this.registry });
        // if (!updatedItem) updatedItem = item;

        Object.keys(items).forEach(itemName => {
            if (this.registry[itemName]) return;
            this.registry = {
                ...this.registry,
                [itemName]: items[itemName],
            };
        });
    };

    /**
     * Get all registered module from the registry.
     */
    getAll = () => {
        return this.registry;
    };

    get = (name: string) => {
        return this.registry[name];
    };
}

export const componentsRepository = new Repository<Record<string, any>>({
    name: 'Components_Repository',
});

export const componentsStylesRepository = new Repository<Record<string, any>>({
    name: 'Components_Styles_Repository',
});

export const componentsUtilsRepository = new Repository<Record<string, any>>({
    name: 'Components_Utils_Repository',
});

export const registerMoleculesComponent = componentsRepository.registerOne;
export const registerMoleculesComponents = componentsRepository.register;
export const registerComponentStyles = componentsStylesRepository.registerOne;
export const registerComponentsStyles = componentsStylesRepository.register;
export const registerComponentUtils = componentsUtilsRepository.registerOne;
export const registerComponentsUtils = componentsUtilsRepository.register;

type RegisterMoleculesConfig = {
    component: ComponentType<any>;
    styles?: Record<string, any>;
    utils?: Record<string, any>;
};

export const registerMolecules = (molecules: Record<string, RegisterMoleculesConfig>) => {
    const components: Record<string, ComponentType<any>> = {};
    const styles: Record<string, Record<string, any>> = {};
    const utils: Record<string, Record<string, any>> = {};

    Object.entries(molecules).forEach(([name, config]) => {
        if (config.component) {
            components[name] = config.component;
        }
        if (config.styles) {
            styles[name] = config.styles;
        }
        if (config.utils) {
            utils[name] = config.utils;
        }
    });

    if (Object.keys(components).length) {
        registerMoleculesComponents(components);
    }
    if (Object.keys(styles).length) {
        registerComponentsStyles(styles);
    }
    if (Object.keys(utils).length) {
        registerComponentsUtils(utils);
    }
};

export const getRegisteredMoleculesComponent = componentsRepository.get;
export const getRegisteredMoleculesComponentStyles = componentsStylesRepository.get;
export const getRegisteredComponentUtils = componentsUtilsRepository.get;

/**
 * Gets a registered component with a fallback to the default component
 * @param name The name of the component to retrieve
 * @param defaultComponent The default component to use as fallback
 * @returns The registered component or the default component
 */
export function getRegisteredComponentWithFallback<T extends ComponentType<any>>(
    name: string,
    defaultComponent: T,
): T {
    return (getRegisteredMoleculesComponent(name) ?? defaultComponent) as T;
}

/**
 * Gets a registered component with a fallback to the default component
 * @param name The name of the component to retrieve
 * @param defaultStyles The default styles to use as fallback
 * @returns The registered styles or the default styles
 */
export function getRegisteredComponentStylesWithFallback<T extends unknown>(
    name: string,
    defaultStyles: T,
): T {
    return (getRegisteredMoleculesComponentStyles(name) ?? defaultStyles) as T;
}

/**
 * Gets a registered component with a fallback to the default component
 * @param name The name of the component to retrieve
 * @param defaultUtils The default utils to use as fallback
 * @returns The registered utils or the default utils
 */
export function getRegisteredComponentUtilsWithFallback<T extends unknown>(
    name: string,
    defaultUtils: T,
    key?: string,
): T {
    return key
        ? (((getRegisteredComponentUtils(name) as Record<string, any>)?.[key] ?? defaultUtils) as T)
        : ((getRegisteredComponentUtils(name) ?? defaultUtils) as T);
}
