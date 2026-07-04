import { useState } from 'react'

import Main from './layout/Main'
import './styles/globals.css'
import { PlayerProvider } from './context/PlayerContext';
import HiddenButton from './components/HiddenButton';
import Pet from './features/Pet/Pet';
import { PetProvider } from './features/Pet/hook/PetContext';
import { WindowProvider, type WindowState } from './context/WindowContext';
import WindowsLayer from './layout/WindowsLayer';
import MusicPlayer from './layout/Windowed/MusicPlayer';
import { BorderSize } from './constants/borders';
import { SelectedDateProvider } from './context/ScheduleContext';

const initialWindows: WindowState[] = [
  { id: 2, x: 800, y: 500, width: 0, height: 0, size: BorderSize.small, title: "Music", children: <MusicPlayer /> },
];

function App() {
  const [isHidden, setIsHidden] = useState(false)

  const toggleHidden = () => setIsHidden(!isHidden)

  return (
    <PetProvider>
      <div className={`
        h-screen w-screen flex flex-row
        `}>
        
        <div
          className='w-fit h-fit'  
          onMouseMove={() => {window.electronAPI.setIgnoreMouseEvents(false)}}
          onMouseEnter={() => {window.electronAPI.setIgnoreMouseEvents(false)}}
          onMouseLeave={() => {window.electronAPI.setIgnoreMouseEvents(true)}}
        >
          <HiddenButton 
            setIsHidden={toggleHidden}
            isHidden={isHidden}
          />
        </div>  

        <PlayerProvider>
          <WindowProvider initialWindows={initialWindows}>
            <SelectedDateProvider>
              <div 
                className='w-full h-full flex-1 min-h-0'
              >
                <Main 
                isHidden={isHidden} 
                toggleHidden={toggleHidden}
                ignoreFalse={() => window.electronAPI.setIgnoreMouseEvents(false)}
                ignoreTrue={() => window.electronAPI.setIgnoreMouseEvents(true)}
                closeApp={() => window.electronAPI.close()}
                />
              </div>
            </SelectedDateProvider>

            <WindowsLayer 
            ignoreTrue={() => window.electronAPI.setIgnoreMouseEvents(true)}
            ignoreFalse={() => window.electronAPI.setIgnoreMouseEvents(false)}
            />

            <div className='absolute w-full h-full pointer-events-none'>
              <Pet 
                mouseIgnoreTrue={() => window.electronAPI.setIgnoreMouseEvents(true)}
                mouseIgnoreFalse={() => window.electronAPI.setIgnoreMouseEvents(false)}
                isHidden={isHidden}
              />
            </div>
          </WindowProvider>
        </PlayerProvider>
      </div>
    </PetProvider>
  )
}

export default App