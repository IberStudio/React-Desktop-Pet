import Calendar from './components/Calendar'
import { theme } from '../../constants/theme'
import { LoadingProvider } from '../../context/LoadingContext'
import { COLOR_MAP } from './constant/constant'
import { SelectedDateProvider, useSelectedDate } from '../../context/ScheduleContext'
import { icons } from '../../utils/imports'
import Button from '../../components/Button'
import { BorderSize } from '../../constants/borders'

const ScheduleContent = () => {
    const { scheduleData, deleteByDate } = useSelectedDate();

    return (
        <div className="w-full h-full flex flex-row">
            <LoadingProvider loadingKey='calendar-events'/>
            <div 
            className={`
                relative
                w-1/3 h-full
                flex flex-col 
                border-r-4 ${theme.outline.border}`}
                bg-white
            >
                <h2 
                className={`
                    w-full h-fit
                    text-3xl text-center text-white font-bold 
                    ${theme.primary.bg} py-6
                `}>
                    Schedule
                </h2>
                <div className="flex-1 flex flex-col">
                    {scheduleData.length === 0 ? (
                        <p className='w-full h-full flex items-center justify-center text-2xl'>No Schedule</p>
                    ): (
                        scheduleData.map((schedule, index) => (
                            <div
                            key={index}
                            className={`
                                w-full p-4
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
                                <p>{schedule.hour}</p>
                                <p className='wrap-break-words text-xl'>
                                    {schedule.title}
                                </p>
                                <Button 
                                cn=''
                                value={{
                                    name: 'Delete',
                                    url: icons.cross
                                }}
                                type='button'
                                size={BorderSize.small}
                                onClick={() => {deleteByDate(schedule.date)}}
                                />
                            </div>
                        ))
                    )}
                </div>
            </div>
            <Calendar />
        </div>
    )
}

const Schedule = () => (
    <SelectedDateProvider>
        <ScheduleContent />
    </SelectedDateProvider>
);

export default Schedule