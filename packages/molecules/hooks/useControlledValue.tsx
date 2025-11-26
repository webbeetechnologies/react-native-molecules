import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

type ReturnType<T> = [T, (value: T, ...args: any[]) => void];

type Args<T> = {
    value?: T;
    defaultValue?: T;
    onChange?: (value: T, ...args: any[]) => any;
    disabled?: boolean;
    manipulateValue?: (value: T | undefined, prevValue: T | undefined) => T;
};

const defaultManipulateValue = (val: any) => val;

const useControlledValue = <T,>({
    value: valueProp,
    defaultValue,
    disabled = false,
    onChange,
    manipulateValue = defaultManipulateValue,
}: Args<T>): ReturnType<T> => {
    const value = useMemo(
        () =>
            valueProp !== undefined
                ? manipulateValue(valueProp, undefined)
                : manipulateValue(defaultValue, undefined),
        [defaultValue, manipulateValue, valueProp],
    );

    const hasWarnedRef = useRef(false);

    const isUncontrolled = useRef(valueProp).current === undefined;
    const [uncontrolledValue, setValue] = useState(value);

    const updateValue = useCallback(
        (val: T, ...rest: any[]) => {
            if (disabled) return;

            if (isUncontrolled) {
                setValue(manipulateValue(val, uncontrolledValue));
            }

            onChange?.(
                manipulateValue(val, isUncontrolled ? uncontrolledValue : valueProp),
                ...rest,
            );
        },
        [disabled, isUncontrolled, manipulateValue, onChange, uncontrolledValue, valueProp],
    );

    useEffect(() => {
        if (hasWarnedRef.current) return;
        hasWarnedRef.current = true;

        if (valueProp !== undefined && isUncontrolled) {
            console.warn(
                'Trying to change the value from uncontrolled to controlled can lead to inconsistencies',
            );
        }
    }, [isUncontrolled, valueProp]);

    return useMemo(
        () => [isUncontrolled ? uncontrolledValue : value, updateValue],
        [isUncontrolled, uncontrolledValue, updateValue, value],
    );
};

export default useControlledValue;
