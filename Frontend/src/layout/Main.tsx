import Tasks from "./Tasks";
import Settings from "./Settings";
import Home from "./Home";
import Music from "./Music";
import type { Pages } from "../types/pages";
import PetPages from "./PetPages";
import { useRef, useState } from "react";
import Navbar from "./Navbar";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Schedule from "../features/Schedule/Schedule";

gsap.registerPlugin(useGSAP);

const Main = ({ isHidden, toggleHidden, ignoreFalse, ignoreTrue, closeApp }: { isHidden: boolean, toggleHidden: () => void, ignoreFalse?: () => void, ignoreTrue?: () => void, closeApp?: () => void }) => {
    const pages = {
        home: <Home />,
        tasks: <Tasks />,
        settings: <Settings />,
        music: <Music />,
        pet: <PetPages />,
        schedule: <Schedule />
    };

    const [currentPage, setCurrentPage] = useState<Pages>("home")

    const mainPageRef = useRef<HTMLDivElement>(null);

    const navbarRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        gsap.to(navbarRef.current, {
            y: isHidden ? '-100%' : 0,
            duration: 0.5
        })
        gsap.to(mainPageRef.current, {
            y: isHidden ? '100%' : 0,
            duration: 0.5
        })
    }, [isHidden])

    return (
        <>
            <div
            className="w-full h-full flex flex-col"
            >
                <div 
                className="h-fit"
                ref={navbarRef}
                onMouseEnter={ignoreFalse}
                onMouseMove={ignoreFalse}
                onMouseLeave={ignoreTrue}
                >
                    <Navbar 
                    currentPage={currentPage}
                    onClick={setCurrentPage}
                    toggleHidden={toggleHidden}
                    closeApp={closeApp}
                    />
                </div>
                <div 
                className="flex-1 min-h-0" 
                ref={mainPageRef}
                onMouseEnter={ignoreFalse}
                onMouseMove={ignoreFalse}
                onMouseLeave={ignoreTrue}
                >
                    {pages[currentPage]}
                </div>
            </div>
        </>
    )
}

export default Main