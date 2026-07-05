import { useState } from "react";
import { BorderSize } from "../constants/borders";
import { theme } from "../constants/theme";
import { icons } from "../utils/imports";

type IconProps = {
    name: string;
    url: string;
    value?: boolean
}

type ButtonProps = {
    cn?: string
    value: IconProps | string
    type: "button" | "submit" | "checkbox"
    size?: number
    color?: string
    onClick?: () => void
}


const Button = ({ cn, value, type, size = BorderSize.medium, color, onClick }: ButtonProps) => {

    type ButtonType = "button" | "submit";

    const [isChecked, setIsChecked] = useState(false);

    function isButtonType(value: any): value is ButtonType {
        return value === "button" || value === "submit";
    }

    if (!isButtonType(type)) {
        return (
        <>
            <input 
            type="checkbox" 
            checked={typeof value !== "string" && value.value}
            onChange={(e) => {
                onClick && onClick();
                setIsChecked(e.target.checked)
            }}
            style={{ '--check-icon': `url(${icons.tick})` } as React.CSSProperties}
            className={`
                appearance-none relative
                w-10 h-10 cursor-pointer
                border-4 ${theme.outline.border} rounded-md
                shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]
                checked:bg-[var(--color-primary)]
                checked:before:content-['']
                checked:before:absolute 
                checked:before:inset-1
                checked:before:bg-[image:var(--check-icon)]
                checked:before:bg-center checked:before:bg-no-repeat
                checked:before:bg-contain
                checked:before:invert
            `}
            />
        </>
        )
    }

    return (
        <button
        className={`max-h-12 p-1 rounded-md
        ${color ? `${color}` : `${theme.primary.bg} text-white [&_img]:invert`} 
        border-3 ${theme.outline.border}
        shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]
        cursor-pointer
        ${cn}
        `}
        type={type as ButtonType}
        onClick={onClick}
        >
            {typeof value === "string" 
                ? value 
                : <img 
                className={color ? "" : "invert"}
                src={value.url} 
                alt={value.name} 
                style={{
                    width: size, 
                    height: size
                }}/>
            }
        </button>
    )
}

export default Button