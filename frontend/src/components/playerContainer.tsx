import React from "react";
import Carousel from "./Carousel";
import {useResizeDetector} from "react-resize-detector";
import {PlayerType} from "../../../shared/types";
import {EquippedCard} from "./EquippedCard";
import {useGame} from "../context/Context";
// import {useMediaQuery} from "react-responsive";

type PlayerContainerProps = {
    player: PlayerType;
};

export function PlayerContainer({player}: PlayerContainerProps) {
    // const isSmallScreen = useMediaQuery({maxWidth: 640});
    const {followPlayingPlayer, RotatePlayer, isYourTurn, drawCards, passTurn} =
        useGame();

    const {height: carHeight, ref: carRef} = useResizeDetector();
    const {width: containerWidth, ref: containerDiv} = useResizeDetector();

    return (
        <div className="flex flex-col justify-between h-full w-full overflow-hidden p-0 m-0 touch-none">
            <div
                ref={containerDiv}
                className="flex flex-col justify-between items-center h-full w-full max-w-full"
            >
                <div className="flex h-[8%] justify-between items-center w-full space-x-4">
                    <div className="flex w-1/3 justify-center ">{player.role}</div>
                    <div className="flex w-1/3 justify-center ">{player.name}</div>
                    <div className="flex w-1/3 justify-center ">{player.hp}</div>
                </div>
                <div className="flex flex-grow w-full justify-between items-center">
                    <div className="flex flex-grow space-x-4 justify-between">
                        <div className="items-center" onClick={() => RotatePlayer("left")}>
                            B
                        </div>
                        <div
                            className="items-center"
                            onClick={() => {
                                if (isYourTurn()) drawCards();
                            }}
                        >
                            mazzo
                        </div>
                        <div className="items-center" onClick={() => RotatePlayer("right")}>
                            F
                        </div>
                    </div>
                </div>
                <div
                    className="flex h-1/12 items-center"
                    onClick={() => {
                        if (isYourTurn()) {
                            passTurn();
                            followPlayingPlayer();
                        } else {
                            followPlayingPlayer();
                        }
                    }}

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
                            d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z"
                        />
                    </svg>
                </div>
                <div ref={carRef} className="flex h-1/4 w-full justify-center">
                    {carHeight > 0 && (
                        <Carousel
                            key={player.id}
                            divHeight={carHeight}
                            divWidth={containerWidth}
                            cards={player.cards}
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
