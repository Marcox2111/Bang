import React from 'react';
import Carousel from './Carousel';
// import {useMediaQuery} from "react-responsive";
import { useResizeDetector } from 'react-resize-detector';
import { PlayerType } from '../../../shared/types';
import { useGame } from '../context/Context';

type PlayerContainerProps = {
    player: PlayerType;
};

export function EnemyContainer({ player }: PlayerContainerProps) {
    // const isSmallScreen = useMediaQuery({maxWidth: 640});
    //TODO da rifare completamente questa parte del rotate,magari il container deve essere sempre lo stesso, da pensare
    const RotatePlayer=((test: string) => {
        return 0
    })


    const { height: carHeight, ref: carRef } = useResizeDetector();
    const { width: containerWidth, ref: containerDiv } = useResizeDetector();

    return (
        <div className="flex flex-col justify-between h-full w-full overflow-hidden p-0 m-0 touch-none">
            <div
                className="flex flex-col justify-between items-center h-full w-full max-w-full"
                ref={containerDiv}
            >
                <div className="flex h-[8%] justify-between items-center w-full space-x-4">
                    <div className="flex h-1/3 justify-center ">
                        {player.role}
                    </div>
                    <div className="flex h-1/3 justify-center ">
                        {player.name}
                    </div>
                    <div className="flex h-1/3 justify-center ">
                        {player.hp}
                    </div>
                </div>
                <div className="flex flex-grow w-full justify-between items-center">
                    <div className="flex flex-grow space-x-4 justify-between">
                        <div
                            className="items-center h-full"
                            onClick={() => RotatePlayer('left')}
                        >
                            B
                        </div>
                        <div className="items-center"> EquipCard</div>
                        <div
                            className="items-center h-full"
                            onClick={() => RotatePlayer('right')}
                        >
                            F
                        </div>
                    </div>
                </div>
                <div
                    className="flex h-1/12 items-center"
                    onClick={() => RotatePlayer('home')}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                        />
                    </svg>
                </div>
                <div ref={carRef} className="flex h-1/5 w-full justify-center">
                    {carHeight > 0 && (
                        <Carousel
                            key={player.id}
                            divHeight={carHeight}
                            divWidth={containerWidth}
                            cards={player.cards}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
