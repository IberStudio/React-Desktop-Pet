import { createContext, useContext, useEffect, useState } from "react";
import { registerLoadingSetter, unregisterLoadingSetter } from "../services/loadingBridge";
import { theme } from "../constants/theme";

const LoadingContext = createContext<{
    isLoading: boolean;
    setIsLoading: (v: boolean) => void;
} | undefined>(undefined);

type LoadingProviderProps = {
    loadingKey: string;
    isHidden?: boolean;
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
};

export const LoadingProvider = ({ loadingKey, isHidden = false, onMouseEnter, onMouseLeave }: LoadingProviderProps) => {

    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        registerLoadingSetter(loadingKey, setIsLoading);
        return () => unregisterLoadingSetter(loadingKey, setIsLoading);
    }, [loadingKey]);

    return (
        <LoadingContext.Provider value={{ isLoading, setIsLoading }}>
            {isLoading && (
                <div 
                className={`w-full h-full bg-black/50 inset-0 absolute z-60 ${isHidden ? "hidden": "flex"} justify-center items-center pointer-events-auto`}
                onMouseMove={onMouseEnter}
                onMouseLeave={onMouseLeave}
                >
                    <div className="relative">
                        <div className="absolute w-16 h-16 rounded-full" />
                        
                        <div 
                        className={`w-16 h-16 rounded-full 
                        border-8 ${theme.secondary.border} border-t-transparent 
                        bg-transparent
                        animate-spin
                        `} 
                        style={{ animationDuration: '1s' }} />
                    </div>
                </div>
            )}
        </LoadingContext.Provider>
    )
}

export const useLoading = () => {
    const ctx = useContext(LoadingContext);
    if (!ctx) throw new Error("useLoading must be used within LoadingProvider");
    return ctx;
};