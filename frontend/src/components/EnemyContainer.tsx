import React from 'react';
import CardCarousel from './CardCarousel';
// import {useMediaQuery} from "react-responsive";
import {useResizeDetector} from 'react-resize-detector';
import {PlayerType} from '../../../shared/types';
import {EquippedCard} from "./EquippedCard";

type PlayerContainerProps = {
    player: PlayerType;
};

export function EnemyContainer({player}: PlayerContainerProps) {


    const {height: carHeight, ref: carRef} = useResizeDetector();
    const {width: containerWidth, ref: containerDiv} = useResizeDetector();

    return (
        <div className="flex flex-col justify-between h-full w-full overflow-hidden p-0 m-0 touch-none ">
            <div
                ref={containerDiv}
                className="flex flex-col justify-between items-center h-full w-full max-w-full "
            >
                <div className="flex h-[8%] justify-between items-center w-full space-x-4">
                    <div className="flex w-1/3 justify-center ">{player.role}</div>
                    <div className="flex w-1/3 justify-center ">{player.name}</div>
                    <div className="flex w-1/3 justify-center ">{player.hp}</div>
                </div>
                <div className="flex flex-grow ">
                    //TODO: ADD DECK OR SOMETHING I STILL DON'T KNOW
                </div>
                <div ref={carRef} className="flex h-1/4 w-full justify-center">
                    {carHeight > 0 && (
                        <CardCarousel
                            key={player.id}
                            divHeight={carHeight}
                            divWidth={containerWidth}
                            cards={player.cards}
                            reaction={null}
                        />
                    )}
                </div>
                <div className="flex h-[5%] w-full justify-center items-center">
                    <EquippedCard/>
                </div>
            </div>
        </div>
    );
}
