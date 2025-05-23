import { ComponentType } from 'react';

import EventEmitter, { ConstructorOptions, event as Event, eventNS } from 'eventemitter2';

interface RepositoryConstructor<T> extends ConstructorOptions {
    onRegister?: (arg: T, name: string, registery: Record<string, T>) => T;
    name?: string;
}

let id = Date.now();

export class Repository<T> extends EventEmitter {
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
        ...options
    }: RepositoryConstructor<T> = {}) {
        super(options);
        this.#onRegister = onRegister;
        this.#name = name;
    }

    has = (itemName: string): boolean => {
        return !!this.registry[itemName];
    };

    emit(event: eventNS | Event, ...values: any[]) {
        event = typeof event === 'string' ? `${this.#name}::event` : event;
        return super.emit(event, ...values);
    }

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

        this.emit('item_registered', itemName);
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
    maxListeners: 0,
});

export const componentsStylesRepository = new Repository<Record<string, any>>({
    name: 'Components_Styles_Repository',
    maxListeners: 0,
});

export const componentsUtilsRepository = new Repository<Record<string, any>>({
    name: 'Components_Utils_Repository',
    maxListeners: 0,
});

export const registerMoleculesComponent = componentsRepository.registerOne;
export const registerMoleculesComponents = componentsRepository.register;
export const registerComponentStyles = componentsStylesRepository.registerOne;
export const registerComponentsStyles = componentsStylesRepository.register;
export const registerComponentUtils = componentsUtilsRepository.registerOne;
export const registerComponentsUtils = componentsUtilsRepository.register;

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
