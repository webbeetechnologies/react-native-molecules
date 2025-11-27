import { useMemo, useState } from 'react';

type DefaultItem = { id: string | number; [key: string]: any };

export type UseQueryFilterProps<TItem extends DefaultItem = DefaultItem> = {
    records: TItem[];
    filterKey?: string;
};

type ReturnType<TItem extends DefaultItem = DefaultItem> = [
    records: TItem[],
    query: string,
    onChange: (value: string) => void,
];

export const useQueryFilter = <TItem extends DefaultItem = DefaultItem>({
    records: _records,
    filterKey = 'label',
}: UseQueryFilterProps<TItem>): ReturnType<TItem> => {
    const [query, setQuery] = useState('');

    const records = useMemo(
        // TODO: match all unicode character with regex
        () =>
            _records.filter(item => {
                const value = item[filterKey];
                if (typeof value !== 'string') return !query;

                return value.toLowerCase().includes(query.toLowerCase());
            }),
        [_records, filterKey, query],
    );

    return useMemo(() => [records, query, setQuery], [records, query, setQuery]);
};
