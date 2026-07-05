import { useState, useMemo, useEffect } from "react";
import Button from "../../../components/Button";
import { icons } from "../../../utils/imports";
import { theme } from "../../../constants/theme";
import type { ScheduleType } from "../types/schedule";
import { BorderSize } from "../../../constants/borders";
import CreateSchedule from "./CreateSchedule";
import { COLOR_MAP, MONTH_NAMES, WEEKDAYS } from "../constant/constant";
import { buildMonthGrid, toDateKey } from "../utils/calendar";
import { useSelectedDate } from "../../../context/ScheduleContext";

const Calendar = () => {
    const today = new Date();
    const [viewYear, setViewYear] = useState(today.getFullYear());
    const [viewMonth, setViewMonth] = useState(today.getMonth());
    const { selectedStart, selectedEnd, setSelectedRange, allEvents } = useSelectedDate();

    const todayKey = toDateKey(today.getFullYear(), today.getMonth(), today.getDate());
    const cells = useMemo(() => buildMonthGrid(viewYear, viewMonth), [viewYear, viewMonth]);

    const [showCreate, setShowCreate] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [dragStartKey, setDragStartKey] = useState<string | null>(null);
    const [dragEndKey, setDragEndKey] = useState<string | null>(null);

    // Live range while dragging; falls back to the committed context range otherwise
    const activeStart = isDragging ? dragStartKey : selectedStart;
    const activeEnd = isDragging ? dragEndKey : selectedEnd;

    const [rangeMin, rangeMax] = useMemo(() => {
        if (!activeStart || !activeEnd) return [null, null];
        return activeStart <= activeEnd ? [activeStart, activeEnd] : [activeEnd, activeStart];
    }, [activeStart, activeEnd]);

    function isInRange(key: string) {
        if (!rangeMin || !rangeMax) return false;
        return key >= rangeMin && key <= rangeMax;
    }

    // Commit the drag on mouseup, wherever it happens
    useEffect(() => {
        function handleMouseUp() {
            if (isDragging && dragStartKey && dragEndKey) {
                setSelectedRange(dragStartKey, dragEndKey);
            }
            setIsDragging(false);
        }
        window.addEventListener("mouseup", handleMouseUp);
        return () => window.removeEventListener("mouseup", handleMouseUp);
    }, [isDragging, dragStartKey, dragEndKey, setSelectedRange]);

    const eventsByDate = useMemo(() => {
        const map: Record<string, ScheduleType[]> = {};
        for (const ev of allEvents) {
            if (!map[ev.date]) map[ev.date] = [];
            map[ev.date].push(ev);
        }
        return map;
    }, [allEvents]);

    function goToday() {
        setViewYear(today.getFullYear());
        setViewMonth(today.getMonth());
    }

    function goPrev() {
        if (viewMonth === 0) {
            setViewMonth(11);
            setViewYear((y) => y - 1);
        } else {
            setViewMonth((m) => m - 1);
        }
    }

    function goNext() {
        if (viewMonth === 11) {
            setViewMonth(0);
            setViewYear((y) => y + 1);
        } else {
            setViewMonth((m) => m + 1);
        }
    }

    return (
        <div className={`
            relative
            w-full h-full min-h-150 flex flex-col overflow-hidden
            ${theme.secondary.bg}
            `}> 
            <div className="relative flex items-center gap-4 px-4 py-3">
                <div className="flex items-center gap-3">
                    <Button 
                    value={{
                        name: "Prev",
                        url: icons.chevLeft
                    }}
                    type="button"
                    onClick={goPrev}
                    />
                    <h2 className="text-2xl font-bold">
                        {MONTH_NAMES[viewMonth]} {viewYear}
                    </h2>
                    <Button 
                    value={{
                        name: "Next",
                        url: icons.chevRight
                    }}
                    type="button"
                    onClick={goNext}
                    />
                </div>

                <Button 
                value="Today"
                type="button"
                onClick={goToday}
                />

                <div className="flex-1"/>
                
                <Button 
                cn="mx-3"
                value={{
                    name: "Guide",
                    url: icons.question
                }}
                type="button"
                onClick={goToday}
                />

                {selectedStart && (
                    <Button 
                    value={{
                        name: "Add",
                        url: icons.add
                    }} 
                    size={BorderSize.large}
                    type="button"
                    onClick={() => setShowCreate(true)}
                    />
                )}

            </div>

            {/* Weekday header */}
            <div className="grid grid-cols-7">
                {WEEKDAYS.map((wd) => (
                <div
                    key={wd}
                    className={`py-2 text-center text-xs font-medium uppercase tracking-wide ${theme.secondary.text} ${theme.primary.bg}`}
                >
                    {wd}
                </div>
                ))}
            </div>

            {/* Month grid */}
            <div className="grid grid-cols-7 grid-rows-6 flex-1 select-none">
                {cells.map((cell, idx) => {
                const isToday = cell.key === todayKey;
                const isSelected = isInRange(cell.key);
                const dayEvents = eventsByDate[cell.key] || [];

                return (
                    <button
                    key={idx}
                    onMouseDown={() => {
                        setIsDragging(true);
                        setDragStartKey(cell.key);
                        setDragEndKey(cell.key);
                    }}
                    onMouseEnter={() => {
                        if (isDragging) setDragEndKey(cell.key);
                    }}
                    className={`relative flex flex-col items-start p-1.5 text-left align-top hover:bg-neutral-200 transition-colors
                        ${!cell.inMonth ? "bg-neutral-50 text-neutral-400" : "text-neutral-800"}
                        ${isSelected ? `border-4 ${theme.primary.border} rounded-sm` : ""}
                    `}
                    >
                        <span
                            className={`text-sm w-7 h-7 flex items-center justify-center rounded-full mb-1
                            ${isToday ? `${theme.primary.bg} text-white font-medium` : ""}
                            `}
                        >
                            {cell.day}
                        </span>

                        <div className="flex flex-col gap-0.5 w-full overflow-hidden">
                            {dayEvents.slice(0, 1).map((ev) => (
                            <div
                                key={ev.id}
                                className="flex items-center gap-1 text-[11px] leading-tight px-1 py-0.5 rounded truncate hover:opacity-90"
                                title={ev.title}
                            >
                                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${COLOR_MAP[ev.color ?? "blue"]}`} />
                                {ev.hour && <span className="text-neutral-500 shrink-0">{ev.hour}</span>}
                                <span className="truncate text-neutral-700">{ev.title}</span>
                            </div>
                            ))}
                            {dayEvents.length > 1 && (
                            <span className="text-[11px] text-neutral-500 px-1">
                                +{dayEvents.length - 1} more
                            </span>
                            )}
                        </div>
                    </button>
                );
                })}
            </div>

            {showCreate && (
                <CreateSchedule 
                startDate={selectedStart} 
                endDate={selectedEnd} 
                onClose={() => setShowCreate(false)} 
                />
            )}
        </div>
    );
};

export default Calendar;