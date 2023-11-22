import React, {useEffect} from "react";
import CardCarousel from "./CardCarousel";
import {useResizeDetector} from "react-resize-detector";
import {PlayerType} from "../../../shared/types";
import {EquippedCard} from "./EquippedCard";
import {useGame} from "../context/Context";

type PlayerContainerProps = {
    player: PlayerType;
};

export function PlayerContainer({player}: PlayerContainerProps) {
    const {passTurn, reactToCard, isYourTurn, reactedCard} = useGame()

    const handleNoReaction = () => {
        // Implement logic for when the player has no reaction cards
    };


    useEffect(() => {
        console.log(reactToCard)
    }, [reactToCard])

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
                {isYourTurn() ?
                    <div className="flex flex-grow ">

                    </div>
                    :
                    <div className="flex flex-grow ">
                        {reactToCard.type != null ?
                            <div className="flex w-full justify-center">{reactToCard.type}</div> :
                            <div/>
                        }
                    </div>
                }
                <div className="flex h-[4%] items-center"
                     onClick={() => {
                         isYourTurn() ? passTurn() : handleNoReaction();
                     }}
                >
                    {isYourTurn() ? "Pass" : "No Reaction"}
                </div>
                <div ref={carRef} className="flex h-1/4 w-full justify-center">
                    {carHeight > 0 && (
                        <CardCarousel
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
