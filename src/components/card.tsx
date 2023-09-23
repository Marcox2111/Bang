import React, { useState, useRef } from 'react';

export function Card({itemId, title}: { itemId: string; title: string;}) {

    const [longHover, setLongHover] = useState(false);
    const hoverTimeout = useRef(null);

    const handleMouseEnter = () => {
        hoverTimeout.current = setTimeout(() => {
            setLongHover(true);
        }, 1000); // 1000ms = 1 second
    };

    const handleMouseLeave = () => {
        clearTimeout(hoverTimeout.current);
        setLongHover(false);
    };

    return (
        <button
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className={`inline-block px-4 py-8 cursor-pointer select-none ${longHover ? 'long-hover' : ''}`}>
            <div
                className="w-64 h-64 max-w-xs rounded-lg shadow-md bg-white hover:shadow-lg hover:scale-105 transition duration-300 ease-in-out">
                <div className="p-4">
                    <div className="font-bold">{title}</div>
                </div>
            </div>
        </button>
    );
}
