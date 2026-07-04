import Button from '../components/Button'
import type { Pages } from '../types/pages'
import { theme } from '../constants/theme'
import { icons } from '../utils/imports'
import { capitalizeWords } from '../utils/textCase'

const navItem = [
  {
    name: "home" as Pages,
    icon: icons.home
  },
  {
    name: "schedule" as Pages,
    icon: icons.calendar
  },
  {
    name: "music" as Pages,
    icon: icons.music
  },
  {
    name: "pet" as Pages,
    icon: icons.petIcon
  },
]

const PageTab = ({ activePage, setPage, toggleHidden, closeApp }: { activePage: Pages, setPage: (page: Pages) => void, toggleHidden?: () => void, closeApp?: () => void }) => {

  return (
    <>
    <div
    className={`flex flex-row justify-between items-center p-1 border-b-4 ${theme.outline.border}`}
    >
      <div
      className='flex flex-row gap-1'
      >
        {navItem.map((prop) => (
          <div
          className={`max-w-64 flex py-2 px-8 gap-4
            ${theme.outline.border} border-4 border-b-0 rounded-t-xl
            ${activePage === prop.name ? `${theme.primary.bg} -mb-2` : `${theme.shadow.bg} -mb-1`}
            `}
          onClick={() => {setPage(prop.name)}}
          >
            <img 
            className='size-6 icon-outline'
            src={prop.icon} 
            alt={prop.name} 
            />
            <h1
            className={`${theme.secondary.text} self-end text-start text-xl truncate`}
            >
              {capitalizeWords(prop.name)}
            </h1>
          </div>
        ))}
      </div>
      <div
      className='flex flex-row gap-2 px-4'
      >
        <Button 
        value={{
          name: "minimize",
          url: icons.minimize
        }}
        type="button"
        onClick={toggleHidden}
        color={theme.secondary.bg}
        />
        <Button 
        value={{
          name: "restore",
          url: icons.restore
        }}
        type="button"
        color={theme.secondary.bg}
        />
        <Button 
        value={{
          name: "close",
          url: icons.cross
        }}
        type="button"
        onClick={closeApp}
        color={theme.secondary.bg}
        />
      </div>
      
    </div>
    </>
  )
}

const Navbar = (
  { currentPage, onClick, toggleHidden, closeApp }: 
  { currentPage: Pages, onClick?: (value: Pages) => void, toggleHidden?: () => void, closeApp?: () => void }
) => {

  return (
    <nav
    className={`flex flex-col z-50`}
    >
      <PageTab 
      activePage={currentPage}
      setPage={onClick ?? (() => {})}
      toggleHidden={toggleHidden}
      closeApp={closeApp}
      />
      <div
      className={`
        ${theme.primary.bg} border-b-4 border-t-0 ${theme.outline.border}
        flex flex-row justify-center items-center
        px-4 py-2 gap-2
        `}
      >
        <input 
        className={`${theme.secondary.bg} 
          border-4 ${theme.outline.border}
          w-[80%] h-10 px-10
          rounded-full
          `}
        type="text" 
        placeholder={`${currentPage}.com`}
        disabled/>
        <Button 
        value={{
          name: "setting",
          url: icons.gear
        }}
        type="button"
        color={theme.secondary.bg}
        onClick={() => {onClick?.("settings")}}
        />
      </div>
    </nav>
  )
}

export default Navbar