import { createContext, useContext, useState, useEffect, useMemo, type ReactNode } from "react";
import { getData, deleteData } from "../utils/api";
import type { Endpoint } from "../types/endpoint";
import type { ScheduleType } from "../features/Schedule/types/schedule";

type SelectedDateContextType = {
    selectedDate: string;
    setSelectedDate: (date: string) => void;
    scheduleData: ScheduleType[];
    allEvents: ScheduleType[];
    refetch: () => void;
    deleteByDate: (date: string) => Promise<void>;
};

const SelectedDateContext = createContext<SelectedDateContextType | null>(null);

export function SelectedDateProvider({ children }: { children: ReactNode }) {
    const [selectedDate, setSelectedDate] = useState("");
    const [allEvents, setAllEvents] = useState<ScheduleType[]>([]);

    const fetchAll = async () => {
        try {
            const data = await getData<ScheduleType[]>("schedules" as Endpoint, "calendar-events");
            setAllEvents(data ?? []);
        } catch (err) {
            console.error(err);
        }
    };

    const deleteByDate = async (date: string) => {
        try {
            await deleteData(
                "schedules" as Endpoint,
                `?date=${date}` as unknown as number,
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

    const scheduleData = useMemo(
        () => allEvents.filter((ev) => ev.date === selectedDate),
        [allEvents, selectedDate]
    );

    return (
        <SelectedDateContext.Provider value={{ selectedDate, setSelectedDate, scheduleData, allEvents, refetch: fetchAll, deleteByDate }}>
            {children}
        </SelectedDateContext.Provider>
    );
}

export function useSelectedDate() {
    const ctx = useContext(SelectedDateContext);
    if (!ctx) throw new Error("useSelectedDate must be used within SelectedDateProvider");
    return ctx;
}