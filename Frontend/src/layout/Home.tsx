import Button from "../components/Button";
import { theme } from "../constants/theme";
import { usePlayer } from "../context/PlayerContext";
import { useWindows } from "../context/WindowContext";
import { icons } from "../utils/imports";
import { LoadingProvider } from "../context/LoadingContext";
import Tasks from "./Tasks";
import { ScheduleContent } from "../features/Schedule/Schedule";
import { useSelectedDate } from "../context/ScheduleContext";

const HomeMusic = () => {
  const { 
    currentTrack,
    nextTrack,
    isPlaying,
    currentTime,
    duration,
    togglePlay,
    playNext,
    playPrev,
    handleSeek,
    replay,
  } = usePlayer();

  const {
      windows,
      showWindow
  } = useWindows();

  const format = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div
    className={`
      w-full h-fit flex flex-row items-center justify-between gap-4 px-8 py-4
      ${theme.secondary.bg}
      border-t-4 ${theme.outline.border}
      `}
    >
      <div className="max-w-[30%] flex-1 flex flex-row gap-4 items-center">
        <img 
        className={`
          w-16 h-16
          aspect-square
          rounded-xl border-4 ${theme.outline.border}
          object-cover
          `}
        src={currentTrack?.thumbnail} 
        alt={currentTrack?.title} 
        />
        <div className="flex flex-col w-full">
          <p className="text-lg font-bold line-clamp-1">{currentTrack?.title || 'No song selected'}</p>
          <p className="line-clamp-2">{currentTrack?.songWriter || 'Songwriter' }</p>
        </div>
      </div>
      <div
      className="flex-1 w-[30%] flex flex-col items-center gap-1" 
      >
        <div className='w-full flex flex-col gap-1'>
          <input
              type="range"
              min={0}
              max={duration || 0}
              value={currentTime}
              onChange={(e) => handleSeek(Number(e.target.value))}
              className={`w-full rounded-xl cursor-pointer`}
          />
          <div className='flex justify-between text-xs text-gray-800'>
              <span>{format(currentTime)}</span>
              <span>{format(duration)}</span>
          </div>
        </div>
        <div
        className="flex flex-row gap-8 items-center"
        >
          <Button cn="h-fit mx-4" value={{ name: "Replay", url: icons.replay }} type="button" onClick={replay} />
          <Button cn='p-2' value={{ name: "Previous", url: icons.previous }} type="button" onClick={playPrev} />
          <Button cn='p-2' value={{ name: "Play", url: isPlaying ? icons.pause : icons.play }} type="button" onClick={togglePlay} />
          <Button cn='p-2' value={{ name: "Next", url: icons.next }} type="button" onClick={playNext} />
          <Button cn="h-fit mx-4" value={{ name: "Mini Player", url: icons.miniDisplay }} type="button" onClick={() => {showWindow(2); console.log(windows)}} />
        </div>
      </div>
      <div className="flex-1">
        <p></p>
      </div>
    </div>
  )
}

const HomeTask = () => {

  return (
    <div className={`relative flex-1 min-h-0 flex`}>
      <LoadingProvider loadingKey='Task Item'/>
      <Tasks />
    </div>
  )
}

const HomeSchedule = () => {

  const { todayDate } = useSelectedDate();

  return (
    <div className="relative flex-1">
      <ScheduleContent cn="w-full" todayDate={todayDate} />
    </div>
  )
}

const Home = () => {

  return (
    <>
    <div className="h-full flex flex-col">
      <div className={`relative flex-3 min-h-0 flex flex-row`}>
        <HomeTask />
        <HomeSchedule />
      </div>
      <HomeMusic />
    </div>
    </>
  )
}

export default Home