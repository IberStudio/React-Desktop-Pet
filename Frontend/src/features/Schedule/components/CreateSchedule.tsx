import { useRef, useState } from "react"
import { theme } from "../../../constants/theme"
import Button from "../../../components/Button"
import { icons } from "../../../utils/imports"
import { COLOR_MAP } from "../constant/constant"
import { postData } from "../../../utils/api"
import type { ScheduleType } from "../types/schedule"
import { useSelectedDate } from "../../../context/ScheduleContext"
import { enumerateDates } from "../utils/calendar"
import { generateTitles } from "../utils/inputShortcut"

const CreateSchedule = ({ startDate, endDate, onClose }: { startDate: string, endDate: string, onClose: () => void }) => {

    const [selectedColor, setSelectedColor] = useState("");
    const { refetch } = useSelectedDate();

    const inputRef = {
        title: useRef<HTMLInputElement>(null),
        hour: useRef<HTMLInputElement>(null),
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const title = inputRef.title.current?.value?.trim();
        const hour = inputRef.hour.current?.value?.trim();
        const color = selectedColor;

        if (!title || !hour || !color) return;

        const dates = enumerateDates(startDate, endDate);
        const titles = generateTitles(title, dates.length);

        try {
            await Promise.all(
                dates.map((date, index) =>
                    postData<ScheduleType>("schedules", { title: titles[index], date, hour, color }, "Schedule")
                )
            );
            refetch();
        } catch (err) {
            console.error(err);
            return;
        }

        onClose();
    };

    return (
        <div 
        className='
            absolute w-full h-full 
            flex flex-col items-center justify-center
            bg-black/30'
        >
            <div
            className='w-[50%] flex flex-col'
            >
                <div
                className={`
                    w-full h-fit px-4 py-2
                    flex flex-row justify-between
                    border-4 border-b rounded-t-2xl ${theme.outline.border}
                    ${theme.primary.bg}
                    `}
                >
                    <h2 
                    className={`
                        text-3xl text-center text-white font-bold
                        `}
                    >
                        Create Schedule
                    </h2>
                    <Button 
                    cn="text-white"
                    value={{
                        name: 'Close',
                        url: icons.cross
                    }}
                    type="button"
                    color={theme.secondary.bg}
                    onClick={() => {onClose()}}
                    />
                </div>
                <div
                className={`
                    w-full
                    flex flex-col
                    border-4 border-t rounded-b-2xl ${theme.outline.border}
                    ${theme.secondary.bg}
                    `}
                >
                    <form 
                    className='flex flex-col gap-6 px-4 py-2'
                    onSubmit={handleSubmit}
                    >
                        <label className='self-center text-2xl' htmlFor='title'>Put Your Schedule</label>
                        <input 
                        id='title'
                        ref={inputRef.title}
                        type="text" 
                        placeholder='Schedule'
                        className={`
                            w-full px-4 py-2
                            bg-white
                            border-4 ${theme.outline.border} rounded-full
                            `}
                        required
                        />
                        <div className="flex flex-col items-center gap-8 px-4">
                            <input
                            id='hour' 
                            ref={inputRef.hour}
                            type="time" 
                            className={`
                                w-[50%] p-2 px-4
                                text-lg
                                bg-white
                                border-4 ${theme.outline.border} rounded-2xl
                                `}
                            />
                            <div className="flex flex-row justify-between items-center gap-2 px-4 w-full">
                                 {Object.entries(COLOR_MAP).map(([color, colorCode]) => (
                                    <button
                                    key={color}
                                    type="button"
                                    onClick={() => setSelectedColor(color)}
                                    className={`size-8 rounded-full ${colorCode} ${
                                        selectedColor === color ? "border-4 border-black" : ""
                                    }`}
                                    title={color}
                                    />
                                ))}
                            </div>
                        </div>
                        <Button 
                        cn="text-white text-xl font-bold py-2"
                        value="Create"
                        type="submit"
                        />
                    </form>
                </div>
            </div>
        </div>
    )
}

export default CreateSchedule