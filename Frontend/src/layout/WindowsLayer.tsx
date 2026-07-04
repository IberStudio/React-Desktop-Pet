import Window from '../components/Window';
import { useWindows } from '../context/WindowContext';

function WindowsLayer({
    ignoreTrue,
    ignoreFalse,
}: {
    ignoreTrue?: () => void;
    ignoreFalse?: () => void;
}) {
    const { windows } = useWindows();

    return (
        <div 
        className="absolute inset-0 pointer-events-none"
        onMouseEnter={ignoreFalse}
        onMouseMove={ignoreFalse}
        onMouseLeave={ignoreTrue}
        >
            {windows.map(w => (
                <Window
                key={w.id}
                id={w.id}
                title={w.title}
                size={w.size}
                cn="pointer-events-auto size-fit"
                draggable={w.draggable || true}
                >
                {w.children}
                </Window>
            ))}
        </div>
    );
}

export default WindowsLayer;