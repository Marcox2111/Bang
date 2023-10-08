import React from "react";
import {useGame} from "../context/Context";
import Carousel from "./Carousel";


export function Game() {
    const {activePlayerID, players} = useGame();

    return (
        <div
            className="flex flex-col justify-between h-screen w-screen overflow-hidden p-0 m-0 sm:p-4 sm:min-h-screen sm:items-center sm:justify-center">
            <div
                className="flex flex-col justify-between items-center h-full w-full sm:h-auto sm:shadow-2xl sm:rounded-xl max-w-full">
                <div className="text-2xl font-bold mt-4 mb-4">Game</div>
                {/*<div className="w-full overflow-auto hide-scroll-bar">*/}
                {/*    <div className="flex flex-row space-x-2">*/}
                {/*        {players[activePlayerID].Hand.map((c) => (*/}
                {/*            <Card key={c.id} id={c.id} cardName={c.title}/>*/}
                {/*        ))}*/}
                {/*    </div>*/}
                {/*</div>*/}

                <div className="basis-1/3 overflow-hidden">
                    <Carousel cards={players[activePlayerID].Hand}/>
                </div>
            </div>
        </div>
    );
}