import { useState, useMemo, useEffect } from "react";
import Button from "../../../components/Button";
import { icons } from "../../../utils/imports";
import { theme } from "../../../constants/theme";
import type { ScheduleType } from "../types/schedule";
import { getData } from "../../../utils/api";
import type { Endpoint } from "../../../types/endpoint";
import { BorderSize } from "../../../constants/borders";
import CreateSchedule from "./CreateSchedule";
import { COLOR_MAP, MONTH_NAMES, WEEKDAYS } from "../constant/constant";
import { buildMonthGrid, toDateKey } from "../utils/calendar";
import { useSelectedDate } from "../../../context/ScheduleContext";

const Calendar = () => {
    const today = new Date();
    const [viewYear, setViewYear] = useState(today.getFullYear());
    const [viewMonth, setViewMonth] = useState(today.getMonth());
    const { selectedDate: selectedKey, setSelectedDate: setSelectedKey, allEvents } = useSelectedDate();
    const [events, setEvents] = useState<ScheduleType[]>([]);

    const todayKey = toDateKey(today.getFullYear(), today.getMonth(), today.getDate());
    const cells = useMemo(() => buildMonthGrid(viewYear, viewMonth), [viewYear, viewMonth]);

    const [hoveredKey, setHoveredKey] = useState<string | null>(null);
    const [showCreate, setShowCreate] = useState(false);

    useEffect(() => {
        let cancelled = false;

        async function fetchMonthEvents() {
            const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
            const dateKeys = Array.from({ length: daysInMonth }, (_, i) =>
                toDateKey(viewYear, viewMonth, i + 1)
            );

            const results = await Promise.all(
                dateKeys.map((dateKey) =>
                    getData<ScheduleType[]>(
                        `schedules?date=${dateKey}` as Endpoint,
                        "calendar-events"
                    ).catch(() => [])
                )
            );

            if (!cancelled) {
                setEvents(results.flat());
            }
        }

        fetchMonthEvents();

        return () => {
            cancelled = true;
        };
    }, [viewYear, viewMonth]);

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
            <div className="flex items-center gap-4 px-4 py-3">
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
            <div className="grid grid-cols-7 grid-rows-6 flex-1">
                {cells.map((cell, idx) => {
                const isToday = cell.key === todayKey;
                const isSelected = cell.key === selectedKey;
                const dayEvents = eventsByDate[cell.key] || [];

                return (
                    <button
                    key={idx}
                    onClick={() => setSelectedKey(cell.key)}
                    onMouseEnter={() => setHoveredKey(cell.key)}
                    onMouseLeave={() => setHoveredKey(null)}
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
                        {hoveredKey === cell.key && (
                            <div className="absolute w-full h-full">
                                <Button 
                                cn="absolute right-4 bottom-4"
                                value={{
                                    name: "Add",
                                    url: icons.add
                                }} 
                                size={BorderSize.small}
                                type="button"
                                onClick={() => {
                                    setSelectedKey(cell.key);
                                    setShowCreate(true);
                                }}
                                />
                            </div>
                        )}
                    </button>
                );
                })}
            </div>

            {showCreate && (
                <CreateSchedule currentDate={selectedKey as string} onClose={() => setShowCreate(false)} />
            )}
        </div>
    );
};

export default Calendar;