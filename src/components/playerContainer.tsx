import React from 'react';
import Carousel from "./Carousel";
import {useMediaQuery} from "react-responsive";
import {useResizeDetector} from "react-resize-detector";
import {Player} from "../types";

type PlayerContainerProps = {
    player: Player;
}

export function PlayerContainer({ player }: PlayerContainerProps) {
    const isSmallScreen = useMediaQuery({maxWidth: 640});


    const {height: carHeight,ref:carRef} = useResizeDetector();
    const {width: containerWidth,ref:containerDiv} = useResizeDetector();


    return (
        <div
            className="flex flex-col justify-between h-full w-full overflow-hidden p-0 m-0 sm:p-4 sm:min-h-screen sm:items-center sm:justify-center touch-none">
            <div ref={containerDiv}
                 className="flex flex-col justify-between items-center h-full w-full sm:shadow-2xl sm:rounded-xl max-w-full">
                <div className="text-2xl font-bold mt-4 mb-4">{player.name}</div>
                <div ref={carRef} className="basis-1/3 overflow-hidden sm:basis-1/4">
                    {carHeight > 0 && <Carousel divHeight={carHeight} divWidth={containerWidth} cards={player.Hand}/>}
                </div>
            </div>
        </div>

    );
}
