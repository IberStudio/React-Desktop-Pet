import Button from "../../components/Button";
import { LoadingProvider } from "../../context/LoadingContext";
import { usePlayer } from "../../context/PlayerContext";
import { icons } from "../../utils/imports";

const MusicPlayer = () => {

    const {
            currentTrack,
            isPlaying,
            currentTime,
            duration,
            togglePlay,
            playNext,
            playPrev,
            handleSeek,
        } = usePlayer();
    
    const format = (secs: number) => {
        const m = Math.floor(secs / 60);
        const s = Math.floor(secs % 60);
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    return (
            <div
            className='relative max-w-96 flex flex-col gap-2 justify-between py-2'
            >
                <LoadingProvider loadingKey='Music Player'/>
                <div 
                className={`
                    w-full flex flex-row justify-between items-center gap-3 px-2`}
                >
                    <div className='size-28 shrink-0 border-2 border-gray-800 rounded-xl overflow-hidden'>
                        <img className='w-full h-full object-cover' src={currentTrack?.thumbnail} alt={currentTrack?.title} />
                    </div>
                    <div className='min-w-0 flex flex-col gap-1 flex-1'>
                        <div className='px-4'>
                            <p className='text-md truncate'>{currentTrack?.title || 'No Track Selected'}</p>
                            <p className='text-sm truncate'>{currentTrack?.songWriter || 'artist'}</p>
                        </div>
                        <div className='px-4 flex flex-col gap-1'>
                            <input
                                id="default-range"
                                type="range"
                                min={0}
                                max={duration || 0}
                                value={currentTime}
                                onChange={(e) => handleSeek(Number(e.target.value))}
                                className={`w-full rounded-xl cursor-pointer`}
                            />
                        <div className='flex justify-between text-xs text-gray-700'>
                                <span>{format(currentTime)}</span>
                                <span>{format(duration)}</span>
                            </div>
                        </div>
                        <div className="flex flex-row justify-evenly items-center px-4 gap-4">
                            <Button value={{ name: "Previous", url: icons.previous }} type="button" onClick={playPrev}
                            />
                            <Button value={{ name: "Play", url: isPlaying ? icons.pause : icons.play }} type="button" onClick={togglePlay}
                            />
                            <Button value={{ name: "Next", url: icons.next }} type="button" onClick={playNext}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
}

export default MusicPlayer