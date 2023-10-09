import React, {useEffect, useRef, useState} from "react";
import {useGame} from "../context/Context";
import Carousel from "./Carousel";


export function Game() {
    const {activePlayerID, players} = useGame();
    const divCarRef = useRef<HTMLDivElement>(null);
    const [carWidth, setCarWidth] = useState(0);

    useEffect(() => {
        const resizeObserver = new ResizeObserver(entries => {
            if (!Array.isArray(entries) || !entries.length) {
                return;
            }
            const target = entries[0].target as HTMLElement;
            setCarWidth(target.offsetWidth);
        });

        if (divCarRef.current) {
            resizeObserver.observe(divCarRef.current);
        }

        return () => {
            resizeObserver.disconnect();
        };
    }, [divCarRef.current]);

    return (
        <div className="flex flex-col justify-between h-screen w-screen overflow-hidden p-0 m-0 sm:p-4 sm:min-h-screen sm:items-center sm:justify-center">
            <div  ref={divCarRef}
                className="flex flex-col justify-between items-center h-full w-full sm:h-auto sm:shadow-2xl sm:rounded-xl max-w-full">
                <div className="text-2xl font-bold mt-4 mb-4">Game</div>
                <div className="basis-1/3 overflow-hidden">
                    {carWidth > 0 && <Carousel divWidth={carWidth} cards={players[activePlayerID].Hand}/>}
                </div>
            </div>
        </div>

    );
}