import { theme } from '../constants/theme';
import { LoadingProvider } from '../context/LoadingContext';
import { usePlayer } from '../context/PlayerContext'
import { useWindows } from '../context/WindowContext';
import { icons } from '../utils/imports'
import Button from './Button'

const MusicPlayer = () => {
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
        showWindow
    } = useWindows();

    const format = (secs: number) => {
        const m = Math.floor(secs / 60);
        const s = Math.floor(secs % 60);
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    return (
        <div className='relative flex flex-col items-center gap-3'>
            <LoadingProvider loadingKey='Music Player'/>
            <img
                className={`
                    w-64 h-64 
                    rounded-xl border-4 ${theme.outline.border}
                    object-cover mt-4`}
                src={currentTrack?.thumbnail}
                alt={currentTrack?.title}
            />
            <div className='flex flex-col w-full px-8'>
                <p className='text-md line-clamp-2'>{currentTrack?.title || 'No Track Selected'}</p>
                <p className='text-sm line-clamp-1'>{currentTrack?.songWriter || 'Songwriter'}</p>
            </div>

            <div className='w-full flex flex-col gap-1 px-8'>
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

            <div className="flex flex-row justify-between items-center px-4 gap-8">
                <Button cn='w-fit h-fit' value={{ name: "Replay", url: icons.replay }} type="button" onClick={replay} />
                <div className='flex flex-row justify-evenly items-center gap-3'>
                    <Button value={{ name: "Previous", url: icons.previous }} type="button" onClick={playPrev} />
                    <Button value={{ name: "Play", url: isPlaying ? icons.pause : icons.play }} type="button" onClick={togglePlay} />
                    <Button value={{ name: "Next", url: icons.next }} type="button" onClick={playNext} />
                </div>
                <Button cn='w-fit h-fit' value={{ name: "Display", url: icons.miniDisplay }} type="button" onClick={() => {showWindow(2)}}/>
            </div>

            <div className='w-full flex flex-row justify-between items-center mt-2 px-4 py-8'>
                <div className={`
                    w-full
                    flex flex-col justify-center gap-6 p-4
                    ${theme.primary.bg} ${theme.secondary.text}
                    ${theme.outline.border} border-4 rounded-xl
                    `}>
                    <p className={`
                        text-xl text-start 
                        pb-2
                        border-b-4 ${theme.secondary.border}
                        `}>
                            Next Queue
                    </p>
                    <div className={`flex flex-row gap-4 items-cente truncate`}>
                        <img className='w-16 h-16 rounded-xl border-2 border-white object-cover' src={nextTrack?.thumbnail} alt={nextTrack?.title} />
                        <div className="text-start line-clamp-1 w-48">
                            <p className='text-lg'>{nextTrack?.title || 'No Track Selected'}</p>
                            <p className='text-sm'>{nextTrack?.songWriter || 'Songwriter'}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MusicPlayer;