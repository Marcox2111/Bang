import React, {useEffect} from "react";
import CardCarousel from "./CardCarousel";
import {useResizeDetector} from "react-resize-detector";
import {CardType, PlayerType} from "../../../shared/types";
import {useGame} from "../context/Context";
import {CardComponent} from "./CardComponent";
import LogComponent from "./LogComponent";

type PlayerContainerProps = {
    player: PlayerType;
};

export function PlayerContainer({player}: PlayerContainerProps) {
    const {passTurn, reactToCard, reactToBang, reactToIndians, reactToDuel, reactToEmporio, emporioCards} = useGame()

    //TODO: Implement logic for when is waiting for reaction (it has also to be adjusted because the flag it goes true also for cards like beer)

    const handleNoReaction = () => {
        switch (reactToCard.type) {
            case 'bang':
            case 'gatling':
                reactToBang(null);
                break;
            case 'indiani':
                reactToIndians(null);
                break;
            case 'duello':
                reactToDuel(null);
                break;
        }
        // Implement logic for when the player has no reaction cards
    };

    const handleEmporioCard = (card: CardType) => {
        console.log(card);
        reactToEmporio(card);
    }

    const {height: carHeight, ref: carRef} = useResizeDetector();
    const {width: containerWidth, ref: containerDiv} = useResizeDetector();

    return (
        <div className="flex flex-col justify-between h-full w-full overflow-hidden p-0 m-0 touch-none ">
            <div
                ref={containerDiv}
                className="flex flex-col justify-between items-center h-full w-full max-w-full "
            >
                <LogComponent key={player.id}/>

                <div className="flex h-[8%] justify-between items-center w-full space-x-4">
                    <div className="flex w-1/3 justify-center ">{player.role}</div>
                    <div className="flex w-1/3 justify-center ">{player.name}</div>
                    <div className="flex w-1/3 justify-center ">{player.hp}</div>
                </div>

                <div className="flex flex-grow flex-col ">
                    {reactToCard.type != null ?
                        (reactToCard.type === 'emporio' ?
                                // Handling the 'emporio' reaction type
                                <div className="flex justify-center items-center">
                                    {emporioCards.map((card, index) => (
                                        <div
                                            onClick={() => handleEmporioCard(card)}
                                        >
                                            <CardComponent key={index} cardName={card.name}/>
                                        </div>
                                    ))}
                                </div>
                                :
                                // Handling other reaction types
                                <>
                                    <div className="flex h-[40%] justify-center items-center">
                                        {reactToCard.actor}
                                    </div>
                                    <div className="flex h-[60%] justify-center items-center">
                                        <CardComponent key={reactToCard.type} cardName={reactToCard.type}/>
                                    </div>
                                </>
                        )
                        :
                        // Display nothing when it's not the player's turn and there's no reaction
                        <div>
                            {/* Empty container */}
                        </div>
                    }

                </div>

                <div className="flex h-[7%] items-center">
                    <button className={"w-full h-full bg-amber-50 hover:bg-amber-100"}
                            onClick={() => {
                                reactToCard.type === null ? passTurn() : handleNoReaction();
                            }}>
                        {reactToCard.type === null ? "Pass" : "No Reaction"}
                    </button>
                </div>
                <div ref={carRef} className="flex h-1/4 w-full justify-center">
                    {carHeight > 0 && (
                        <CardCarousel
                            key={player.id}
                            divHeight={carHeight}
                            divWidth={containerWidth}
                            cards={player.cards}
                            reaction={reactToCard.type}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
