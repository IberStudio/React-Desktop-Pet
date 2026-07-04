
export interface ScheduleType {
    id: string;
    title: string;
    date: string; // "YYYY-MM-DD"
    hour?: string; // "HH:MM"
    color: "blue" | "green" | "red" | "purple" | "orange";
}
