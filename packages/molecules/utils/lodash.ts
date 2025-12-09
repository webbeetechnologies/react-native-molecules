type MemoizeCache<K = any, V = any> = {
    has(key: K): boolean;
    get(key: K): V | undefined;
    set(key: K, value: V): unknown;
};

type MemoizeFn = {
    <T extends (...args: any[]) => any>(
        func: T,
        resolver?: (...args: Parameters<T>) => any,
    ): MemoizedFunction<T>;
    Cache: { new (): MemoizeCache<any, any> };
};

export interface MemoizedFunction<T extends (...args: any[]) => any> {
    (...args: Parameters<T>): ReturnType<T>;
    cache: MemoizeCache<any, ReturnType<T>>;
}

export const memoize: MemoizeFn = ((
    func: (...args: any[]) => any,
    resolver?: (...args: any[]) => any,
) => {
    if (typeof func !== 'function') {
        throw new TypeError('Expected a function');
    }
    const memoized = function (this: unknown, ...args: any[]) {
        const key = resolver ? resolver.apply(this, args) : args[0];
        const { cache } = memoized as MemoizedFunction<typeof func>;
        if (cache.has(key)) {
            return cache.get(key);
        }
        const result = func.apply(this, args);
        cache.set(key, result);
        return result;
    } as MemoizedFunction<typeof func>;

    (memoized as MemoizedFunction<typeof func>).cache = new memoize.Cache();
    return memoized;
}) as MemoizeFn;

memoize.Cache = Map;

type Iteratee<T> = ((item: T) => string | number | symbol) | keyof T;

export const keyBy = <T extends Record<string, any>>(
    collection: T[],
    iteratee: Iteratee<T>,
): Record<string, T> => {
    const result: Record<string, T> = {};
    if (!Array.isArray(collection)) return result;

    const getter = typeof iteratee === 'function' ? iteratee : (item: T) => item[iteratee];
    for (const item of collection) {
        const key = getter(item);
        if (key != null) {
            result[String(key)] = item;
        }
    }
    return result;
};

type Predicate = (value: any, key: string) => boolean;

export const omitBy = <T extends Record<string, any>>(
    object: T,
    predicate: Predicate,
): Partial<T> => {
    if (object == null) return {};
    const result: Partial<T> = {};
    for (const [key, value] of Object.entries(object)) {
        if (!predicate(value, key)) {
            result[key as keyof T] = value;
        }
    }
    return result;
};

export const isNil = (value: unknown): value is null | undefined => value == null;
export const noop = () => {};

const uniqueIdFactory = () => {
    let number = Number.MAX_SAFE_INTEGER;
    return () => number--;
};

const getUniqueId = uniqueIdFactory();
const weakMemoize = Object.assign(memoize.bind(null), { Cache: WeakMap });
const getObjectMemoryAddress = weakMemoize((x: unknown | null) => x && getUniqueId());

export const allArgumentResolver = (...args: unknown[]) =>
    args
        .map(x => {
            const type = typeof x;
            switch (type) {
                case 'object':
                case 'function':
                    return type.slice(0, 2)! + getObjectMemoryAddress(x);
                default:
                    return type.slice(0, 2)! + String(x);
            }
        })
        .join('_');

export const createMemoizedFunction = ({
    resolver = allArgumentResolver,
    Cache = Map,
}: {
    resolver?: (...args: any[]) => any;
    Cache?: typeof memoize.Cache;
} = {}) => {
    const memo = Object.assign(memoize.bind(null), { Cache });
    return Object.assign(
        <T extends (...args: any[]) => any>(func: T, resolverOverwride?: (...args: any[]) => any) =>
            memo(func, resolverOverwride ?? resolver),
    );
};

export const weakMemoized = createMemoizedFunction({
    Cache: WeakMap,
});
