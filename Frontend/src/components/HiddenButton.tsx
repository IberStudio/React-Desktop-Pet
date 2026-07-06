import React, { useEffect, useRef, useState } from 'react'
import { icons } from '../utils/imports';
import gsap from 'gsap';
import { useGSAP } from "@gsap/react"
import { theme } from '../constants/theme';

gsap.registerPlugin(useGSAP);

const HiddenButton = ({ isHidden, setIsHidden }: { isHidden: boolean, setIsHidden?: () => void }) => {
    const [y, setY] = useState(0);
    const [isHeld, setIsHeld] = useState(false);
    const isDragging = useRef(false);
    const startY = useRef(0);
    const startTop = useRef(0);
    const elementRef = useRef<HTMLDivElement>(null);
    const holdTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
    const hasMoved = useRef(false);

    function onMouseDown(e: React.MouseEvent) {
        isDragging.current = true;
        hasMoved.current = false;
        startY.current = e.clientY;
        startTop.current = y;
        isHeld;

        holdTimeout.current = setTimeout(() => {
            if (!hasMoved.current) {
                setIsHeld(true);
            }
        }, 500);
    }

    function onMouseMove(e: MouseEvent) {
        if (!isDragging.current) return;
        const delta = e.clientY - startY.current;

        if (Math.abs(delta) > 5) {
            hasMoved.current = true;
            if (holdTimeout.current) clearTimeout(holdTimeout.current);
        }

        const next = startTop.current + delta;
        const elementHeight = elementRef.current?.offsetHeight ?? 0;
        const maxY = window.innerHeight - elementHeight;

        setY(Math.min(Math.max(0, next), maxY));
    }

    function onMouseUp() {
        isDragging.current = false;
        setIsHeld(false);

        if (holdTimeout.current) clearTimeout(holdTimeout.current);

    }

    useEffect(() => {
        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("mouseup", onMouseUp);
        return () => {
            window.removeEventListener("mousemove", onMouseMove);
            window.removeEventListener("mouseup", onMouseUp);
        };
    }, []);

    useGSAP(() => {
        gsap.set(elementRef.current, {
            x: "-100%"
        })
    })

    useEffect(() => {
        gsap.to(elementRef.current, {
            x: isHidden ? "0%" : "-110%",
            y: y,
            duration: 0.3
        })
    }, [isHidden, y])

    return (
        <div
        ref={elementRef}
        onMouseDown={onMouseDown}
        onDoubleClick={setIsHidden}
        style={{ 
            transform: `translateY(${y}px)`,
        }}
        className={`
            z-200 w-20 h-20 absolute flex justify-center items-center cursor-pointer pb-1 pr-2
            ${theme.primary.bg} 
            border-4 rounded-xl ${theme.outline.border}
            shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]
            `}
        >
            <img 
            className='w-[90%] h-[90%] icon-outline'
            src={icons.mainIcon} 
            alt="Main Icon" 
            draggable="false"
            />
        </div>
    );
}

export default HiddenButton