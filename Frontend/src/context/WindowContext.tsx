import { createContext, useContext, useState, useCallback, useMemo, useRef } from 'react';
import type { ReactNode } from 'react';

export type WindowState = {
    id: number;
    key?: string;
    x: number;
    y: number;
    width: number;
    height: number;
    size: number;
    title: string;
    hidden?: boolean;
    draggable?: boolean;
    children?: ReactNode;
};

type OpenWindowOptions = Partial<Omit<WindowState, 'id'>> & {
    title: string;
    children: ReactNode;
    key?: string;
};

type WindowContextValue = {
    windows: WindowState[];
    openWindow: (options: OpenWindowOptions) => number;
    closeWindow: (id: number) => void;
    closeWindowByKey: (key: string) => void;
    isOpen: (key: string) => boolean;
    hideWindow: (id: number) => void;
    showWindow: (id: number) => void;
    toggleHidden: (id: number) => void;
    updatePosition: (id: number, x: number, y: number) => void;
    updateSize: (id: number, width: number, height: number) => void;
};

const WindowContext = createContext<WindowContextValue | undefined>(undefined);

type WindowProviderProps = {
    children: ReactNode;
    initialWindows?: WindowState[];
};

export function WindowProvider({ children, initialWindows = [] }: WindowProviderProps) {
    const [windows, setWindows] = useState<WindowState[]>(
        initialWindows.map(w => ({ hidden: true, ...w }))
        );
    const nextId = useRef(
        initialWindows.length ? Math.max(...initialWindows.map(w => w.id)) + 1 : 1
    );

    const openWindow = useCallback((options: OpenWindowOptions) => {
        let newId = -1;

    setWindows(prev => {
        if (options.key) {
            const existing = prev.find(w => w.key === options.key);
            if (existing) {
            newId = existing.id;
            return prev;
            }
        }

        newId = nextId.current++;
        const win: WindowState = {
            id: newId,
            x: 100,
            y: 100,
            width: 0,
            height: 0,
            size: 24,
            ...options,
        };
        
        return [...prev, win];
        });

    return newId;
    }, []);

    const closeWindow = useCallback((id: number) => {
        setWindows(prev => prev.filter(w => w.id !== id));
    }, []);

    const closeWindowByKey = useCallback((key: string) => {
        setWindows(prev => prev.filter(w => w.key !== key));
    }, []);

    const isOpen = useCallback(
        (key: string) => windows.some(w => w.key === key),
        [windows]
    );

    const hideWindow = useCallback((id: number) => {
        setWindows(prev => prev.map(w => w.id === id ? { ...w, hidden: true } : w));
    }, []);

    const showWindow = useCallback((id: number) => {
        setWindows(prev => prev.map(w => w.id === id ? { ...w, hidden: false } : w));
    }, []);

    const toggleHidden = useCallback((id: number) => {
        setWindows(prev => prev.map(w => w.id === id ? { ...w, hidden: !w.hidden } : w));
    }, []);

    const updatePosition = useCallback((id: number, x: number, y: number) => {
        setWindows(prev => prev.map(w => w.id === id ? { ...w, x, y } : w));
    }, []);

    const updateSize = useCallback((id: number, width: number, height: number) => {
        setWindows(prev => prev.map(w => w.id === id ? { ...w, width, height } : w));
    }, []);

    const value = useMemo(
        () => ({ windows, openWindow, closeWindow, closeWindowByKey, isOpen, hideWindow, showWindow, toggleHidden, updatePosition, updateSize }),
        [windows, openWindow, closeWindow, closeWindowByKey, isOpen, hideWindow, showWindow, toggleHidden, updatePosition, updateSize]
    );

    return <WindowContext.Provider value={value}>{children}</WindowContext.Provider>;
}

export function useWindows() {
    const ctx = useContext(WindowContext);
    if (!ctx) throw new Error('useWindows must be used within a WindowProvider');
    return ctx;
}