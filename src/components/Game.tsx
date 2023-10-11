import React from "react";
import {useGame} from "../context/Context";
import Carousel from "./Carousel";
import {useMediaQuery} from 'react-responsive';
import {useResizeDetector} from "react-resize-detector";


export function Game() {
    const isSmallScreen = useMediaQuery({maxWidth: 640});

    const {activePlayerID, players} = useGame();
    const {height: carHeight,ref:carRef} = useResizeDetector();


    return (
        <div
            className="flex flex-col justify-between h-screen w-screen overflow-hidden p-0 m-0 sm:p-4 sm:min-h-screen sm:items-center sm:justify-center">
            <div
                className="flex flex-col justify-between items-center h-full w-full sm:shadow-2xl sm:rounded-xl max-w-full">
                <div className="text-2xl font-bold mt-4 mb-4">Game</div>
                <div ref={carRef} className="basis-1/3 overflow-hidden sm:basis-1/4">
                    {carHeight||0 > 0 && <Carousel divHeight={carHeight||0} cards={players[activePlayerID].Hand}/>}
                </div>
            </div>
        </div>
    );
}
