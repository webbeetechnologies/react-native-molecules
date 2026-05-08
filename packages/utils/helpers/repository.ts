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
    register = <X extends T = T, ItemName extends string = ''>(itemName: ItemName, item: X) => {
        let updatedItem = this.#onRegister?.(item, itemName, { ...this.registry });
        if (!updatedItem) updatedItem = item;

        this.registry = {
            ...this.registry,
            [itemName]: updatedItem,
        };
    };

    /**
     * Get all registered module from the registry.
     */
    getAll = () => {
        return this.registry;
    };
}
