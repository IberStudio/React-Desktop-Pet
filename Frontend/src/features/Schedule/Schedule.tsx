import Calendar from './components/Calendar'
import { theme } from '../../constants/theme'
import { LoadingProvider } from '../../context/LoadingContext'
import { COLOR_MAP } from './constant/constant'
import { useSelectedDate } from '../../context/ScheduleContext'
import { icons } from '../../utils/imports'
import Button from '../../components/Button'
import { BorderSize } from '../../constants/borders'
import { dateToDay } from '../Schedule/utils/dateFormat'
import { useMemo } from 'react'
import type { ScheduleType } from './types/schedule'

export const ScheduleContent = ({ cn, todaySchedule, todayDate }: { cn?: string, todaySchedule?: ScheduleType[], todayDate?: string }) => {
    const { selectedStart, scheduleData, deleteSchedule, deleteByDate } = useSelectedDate();

    const displayData = todaySchedule ? todaySchedule : scheduleData;

    const groupedByDate = useMemo(() => {
        const map: Record<string, ScheduleType[]> = {};
        for (const ev of displayData) {
            if (!map[ev.date]) map[ev.date] = [];
            map[ev.date].push(ev);
        }
        return Object.entries(map).sort(([a], [b]) => a.localeCompare(b));
    }, [displayData]);

    return (
        <>
            <LoadingProvider loadingKey='calendar-events'/>
            <div 
            className={`
                relative
                w-1/2 h-full
                flex flex-col 
                border-r-4 ${theme.outline.border}
                bg-white
                ${cn}
                `}
                
            >
                <h2 
                className={`
                    w-full h-fit
                    text-3xl text-center text-white font-bold 
                    ${theme.primary.bg} py-6
                `}>
                    Schedule
                </h2>
                <div className="flex-1 flex flex-col overflow-y-auto">
                    {displayData.length === 0 ? (
                        <>
                        <div className={`w-full flex flex-row items-center justify-between px-4 ${theme.secondary.bg}`}>
                            {displayData && 
                                <p className={`px-4 py-2 text-lg font-bold`}>
                                    {todayDate ? dateToDay(todayDate) : (
                                        selectedStart && dateToDay(selectedStart)
                                    )}
                                </p>
                            }
                        </div>
                        <p className='w-full h-full flex items-center justify-center text-2xl'>No Schedule</p>
                        </>
                    ): (
                        groupedByDate.map(([date, schedules]) => (
                            <div key={date} className="flex flex-col">
                                <div className={`w-full flex flex-row items-center justify-between px-4 ${theme.secondary.bg}`}>
                                    <p className={`px-4 py-2 text-lg font-bold`}>
                                        {dateToDay(date)}
                                    </p>    
                                    <Button 
                                    cn='text-white'
                                    value="Delete All"
                                    type='button'
                                    onClick={() => deleteByDate(date)}
                                    />
                                </div>

                                {schedules.map((schedule, index) => (
                                    <div
                                    key={index}
                                    className={`
                                        group/schedule
                                        w-full p-2
                                        flex flex-row items-center gap-4
                                        `}
                                    >
                                        <span
                                        className={`
                                            w-4 h-4 rounded-full
                                            shrink-0
                                            ${COLOR_MAP[schedule.color]}
                                        `}
                                        />
                                        <p className='text-lg shrink-0'>{schedule.hour}</p>
                                        <p className='wrap-break-words text-xl flex-1 min-w-0'>
                                            {schedule.title}
                                        </p>
                                        <Button 
                                        cn='aspect-square shrink-0 ml-auto opacity-0 scale-90 group-hover/schedule:opacity-100 group-hover/schedule:scale-100 transition-all duration-200 ease-out'
                                        value={{
                                            name: 'Delete',
                                            url: icons.cross
                                        }}
                                        type='button'
                                        size={BorderSize.medium}
                                        onClick={() => {
                                            deleteSchedule(
                                                schedule.title,
                                                schedule.date,
                                                schedule.hour as string
                                            )
                                        }}
                                        />
                                    </div>
                                ))}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </>
    )
}

const Schedule = () => (
    <div className="w-full h-full flex flex-row">
        <ScheduleContent />
        <Calendar />
    </div>
);

export default Schedule