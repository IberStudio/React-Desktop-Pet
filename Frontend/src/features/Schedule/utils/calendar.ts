export function pad(n: number): string {
    return String(n).padStart(2, "0");
}

export function toDateKey(y: number, m: number, d: number): string {
    return `${y}-${pad(m + 1)}-${pad(d)}`;
}

export function buildMonthGrid(year: number, month: number): { key: string; day: number; inMonth: boolean }[] {
    const firstOfMonth = new Date(year, month, 1);
    const startOffset = firstOfMonth.getDay(); // 0-6, Sun-Sat
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const cells: { key: string; day: number; inMonth: boolean }[] = [];

    // Leading days from previous month
    for (let i = startOffset - 1; i >= 0; i--) {
        const day = daysInPrevMonth - i;
        const prevMonth = month === 0 ? 11 : month - 1;
        const prevYear = month === 0 ? year - 1 : year;
        cells.push({ key: toDateKey(prevYear, prevMonth, day), day, inMonth: false });
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
        cells.push({ key: toDateKey(year, month, day), day, inMonth: true });
    }

    // Trailing days from next month to fill a 6-row grid (42 cells)
    const nextMonth = month === 11 ? 0 : month + 1;
    const nextYear = month === 11 ? year + 1 : year;
    let nextDay = 1;
    while (cells.length < 42) {
        cells.push({ key: toDateKey(nextYear, nextMonth, nextDay), day: nextDay, inMonth: false });
        nextDay++;
    }

    return cells;
}

export function enumerateDates(start: string, end: string): string[] {
    const [s, e] = start <= end ? [start, end] : [end, start];
    const [sy, sm, sd] = s.split("-").map(Number);
    const [ey, em, ed] = e.split("-").map(Number);

    const startDate = new Date(sy, sm - 1, sd);
    const endDate = new Date(ey, em - 1, ed);

    const dates: string[] = [];
    const cur = new Date(startDate);
    while (cur <= endDate) {
        dates.push(toDateKey(cur.getFullYear(), cur.getMonth(), cur.getDate()));
        cur.setDate(cur.getDate() + 1);
    }
    return dates;
}