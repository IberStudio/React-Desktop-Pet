import { createContext, useContext, useState, useEffect, useMemo, type ReactNode } from "react";
import { getData, deleteData } from "../utils/api";
import type { Endpoint } from "../types/endpoint";
import type { ScheduleType } from "../features/Schedule/types/schedule";

type SelectedDateContextType = {
    selectedStart: string;
    selectedEnd: string;
    setSelectedRange: (start: string, end: string) => void;
    clearSelection: () => void;
    scheduleData: ScheduleType[];
    todaySchedule: ScheduleType[];
    todayDate: string;
    allEvents: ScheduleType[];
    refetch: () => void;
    deleteSchedule: (title: string, date: string, hour: string) => Promise<void>;
    deleteByDate: (date: string) => Promise<void>;
};

const SelectedDateContext = createContext<SelectedDateContextType | null>(null);

function getTodayKey(): string {
    const today = new Date();
    const y = today.getFullYear();
    const m = String(today.getMonth() + 1).padStart(2, "0");
    const d = String(today.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
}

export function SelectedDateProvider({ children }: { children: ReactNode }) {
    const [selectedStart, setSelectedStart] = useState("");
    const [selectedEnd, setSelectedEnd] = useState("");
    const [allEvents, setAllEvents] = useState<ScheduleType[]>([]);

    const todayDate = useMemo(() => getTodayKey(), []);

    const fetchAll = async () => {
        try {
            const data = await getData<ScheduleType[]>("schedules" as Endpoint, "calendar-events");
            setAllEvents(data ?? []);
        } catch (err) {
            console.error(err);
        }
    };

    const setSelectedRange = (start: string, end: string) => {
        setSelectedStart(start);
        setSelectedEnd(end);
    };

    const clearSelection = () => {
        setSelectedStart("");
        setSelectedEnd("");
    };

    const deleteSchedule = async (title: string, date: string, hour: string) => {
        try {
            const params = new URLSearchParams({ title, date, hour });

            await deleteData(
                "schedules" as Endpoint,
                `?${params.toString()}` as unknown as number,
                "calendar-events"
            );
            await fetchAll();
        } catch (err) {
            console.error(err);
        }
    };

    const deleteByDate = async (date: string) => {
        try {
            const params = new URLSearchParams({ date });

            await deleteData(
                "schedules/day" as Endpoint,
                `?${params.toString()}` as unknown as number,
                "calendar-events"
            );
            await fetchAll();
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchAll();
    }, []);

    const scheduleData = useMemo(() => {
        if (!selectedStart) return [];
        const [rangeStart, rangeEnd] = selectedStart <= selectedEnd
            ? [selectedStart, selectedEnd]
            : [selectedEnd, selectedStart];

        return allEvents.filter((ev) => ev.date >= rangeStart && ev.date <= rangeEnd);
    }, [allEvents, selectedStart, selectedEnd]);

    const todaySchedule = useMemo(() => {
        return allEvents.filter((ev) => ev.date === todayDate);
    }, [allEvents, todayDate]);

    return (
        <SelectedDateContext.Provider value={{
            selectedStart, selectedEnd, setSelectedRange, clearSelection,
            scheduleData, todaySchedule, todayDate, allEvents, refetch: fetchAll, deleteSchedule, deleteByDate
        }}>
            {children}
        </SelectedDateContext.Provider>
    );
}

export function useSelectedDate() {
    const ctx = useContext(SelectedDateContext);
    if (!ctx) throw new Error("useSelectedDate must be used within SelectedDateProvider");
    return ctx;
}