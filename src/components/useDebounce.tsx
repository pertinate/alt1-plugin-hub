import { useEffect, useRef } from 'react';

export function useDebounce<T>(value: T, callback: (value: T) => void, delay: number = 500) {
    const handler = useRef<ReturnType<typeof setTimeout>>(undefined);

    useEffect(() => {
        if (handler.current) {
            clearTimeout(handler.current);
        }
        handler.current = setTimeout(() => {
            callback(value);
        }, delay);

        return () => {
            if (handler.current) clearTimeout(handler.current);
        };
    }, [value, delay, callback]);
}
