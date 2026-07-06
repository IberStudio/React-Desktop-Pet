import { useEffect, useRef, useState } from "react"
import { icons } from "../utils/imports"
import Button from "../components/Button";

const Timer = () => {


    const FOCUS_SECONDS = 25 * 60;
    const BREAK_SECONDS = 5 * 60;

    const [totalSeconds, setTotalSeconds] = useState(FOCUS_SECONDS);
    const [isRunning, setIsRunning] = useState(false);
    const [isBreak, setIsBreak] = useState(false);

    const isBreakRef = useRef(isBreak);

    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const format = (num: number) => num.toString().padStart(2, '0');

    useEffect(() => {
        isBreakRef.current = isBreak;
    }, [isBreak]);

    useEffect(() => {
        if (!isRunning) return;

        const intervalId = setInterval(() => {
            setTotalSeconds((prev) => {
                if (prev <= 0) {
                    const nextIsBreak = !isBreakRef.current;
                    setIsBreak(nextIsBreak);
                    return nextIsBreak ? BREAK_SECONDS : FOCUS_SECONDS;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(intervalId);
    }, [isRunning]);

    function adjustMinutes(delta: number) {
        if (isRunning) return;
        setTotalSeconds((prev) => {
            const next = prev + delta * 60;
            if (next < 0) return 0;
            if (next > 59 * 60) return 59 * 60;
            return next;
        });
    }

    function reset() {
        setIsRunning(false);
        setIsBreak(false);
        setTotalSeconds(FOCUS_SECONDS);
    }

    function switchMode() {
        const toBreak = !isBreak;
        setIsRunning(false);
        setIsBreak(toBreak);
        setTotalSeconds(toBreak ? BREAK_SECONDS : FOCUS_SECONDS);
    }
    
    function toggleStart() {
        setIsRunning((prev) => !prev);
    }

    return (
        <div
        className="flex flex-row justify-evenly items-center w-full gap-2 p-2"
        >
            <div
            className="flex flex-row items-center gap-2"
            >
                <div>
                    <div
                    className="w-full flex flex-row justify-around"
                    >
                        <button
                        className={`${isBreak ? "text-gray-500" : "text-black"} group relative pb-1`}
                        onClick={() => {isBreak && switchMode()}}
                        >
                            Focus
                            <span
                                className={`
                                ${isBreak ? "" : "w-full" }
                                absolute bottom-0 left-1/2
                                h-0.5 w-0
                                -translate-x-1/2
                                bg-current
                                transition-all duration-300
                                group-hover:w-full
                                `}
                            />
                        </button>
                        <button
                        className={`${!isBreak ? "text-gray-500" : "text-black"} group relative pb-1`}
                        onClick={() => {!isBreak && switchMode()}}
                        >
                            Break
                            <span
                                className={`
                                ${isBreak ? "w-full" : ""}
                                absolute bottom-0 left-1/2
                                h-0.5 w-0
                                -translate-x-1/2
                                bg-current
                                transition-all duration-300
                                group-hover:w-full
                                `}
                            />
                        </button>
                    </div>
                    <p 
                    className="text-7xl text-black"
                    >
                        {format(minutes)}:{format(seconds)}
                    </p>
                </div>
                <div
                className="flex flex-col gap-4"
                >
                    <Button 
                    value={{
                        name: "Up",
                        url: icons.upArrow
                    }} 
                    type="button"
                    onClick={() => adjustMinutes(1)}
                    />
                    <Button 
                    value={{
                        name: "Down",
                        url: icons.downArrow
                    }}
                    type="button"
                    onClick={() => adjustMinutes(-1)}
                    />
                </div>
            </div>
            <div
            className="flex flex-col gap-2"
            >
                <Button 
                value={isRunning ? "Pause" : "Start"} 
                type="button"
                onClick={toggleStart}
                />
                <Button 
                value="Reset" 
                type="button"
                onClick={reset}
                />
            </div>
        </div>
    )
}

export default Timer