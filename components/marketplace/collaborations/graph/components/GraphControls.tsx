'use client';

interface GraphControlsProps {
    onZoomIn: () => void;
    onZoomOut: () => void;
}

export function GraphControls({ onZoomIn, onZoomOut }: GraphControlsProps) {
    return (
        <div className="absolute top-4 right-4 flex flex-col gap-2">
            <button
                onClick={onZoomIn}
                className="w-10 h-10 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/80 hover:text-white transition-colors"
            >
                +
            </button>
            <button
                onClick={onZoomOut}
                className="w-10 h-10 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/80 hover:text-white transition-colors"
            >
                -
            </button>
        </div>
    );
}
