import React, {useState, useRef} from 'react';
import { useDraggable } from '@dnd-kit/core';
import { useSortable } from "@dnd-kit/sortable";
import {CSS} from "@dnd-kit/utilities";

type ListProps = {
    cardID: string
    cardName: string
};
export function Card({cardID, cardName}: ListProps) {

    const {
        setNodeRef,
        attributes,
        listeners,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: cardID,
        data: {
            type: "Card",
        },
    });

    const style = {
        transition,
        transform: CSS.Transform.toString(transform),
    };

    // const [longHover, setLongHover] = useState(false);
    // const hoverTimeout = useRef(null);
    //
    // // const handleMouseEnter = () => {
    // //     hoverTimeout.current = setTimeout(() => {
    // //         setLongHover(true);
    // //     }, 2500); // 1000ms = 1 second
    // // };
    // //
    // // const handleMouseLeave = () => {
    // //     clearTimeout(hoverTimeout.current);
    // //     setLongHover(false);
    // // };
    // //
    // // const handleDragStart = (e, cardId) => {
    // //     e.dataTransfer.setData("text/plain", cardId);
    // // }

    return (
        <button
            ref={setNodeRef} style={style} {...attributes} {...listeners}
            className="inline-block px-4 py-8 cursor-pointer select-none">
            <div
                 className="w-64 h-64 max-w-xs rounded-lg shadow-md bg-white hover:shadow-lg hover:scale-105 transition duration-300 ease-in-out">
                <div className="p-4">
                    <div className="font-bold">{cardName}</div>
                </div>
            </div>
        </button>

    );
}
