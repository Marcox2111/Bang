import React from "react";
import {useGame} from "../context/Context";
import Carousel from "./Carousel";
import {useMediaQuery} from 'react-responsive';
import {useResizeDetector} from "react-resize-detector";
import { motion, PanInfo, useSpring } from 'framer-motion';


export function Game() {
    const isSmallScreen = useMediaQuery({maxWidth: 640});

    const {activePlayerID,setActivePlayerID, players,setPlayers} = useGame();
    const {height: carHeight,ref:carRef} = useResizeDetector();
    const {width: containerWidth,ref:containerDiv} = useResizeDetector();

    if (players[1].Hand.length > 4) {
        const newPlayers = [...players]; // Create a shallow copy of the players array
        newPlayers[1].Hand = newPlayers[1].Hand.slice(0, -1
        ); // Remove the last card from player 1's hand
        setPlayers(newPlayers); // Update the state with the new players array
    }

    function scrollPlayer(event: PointerEvent, info: PanInfo) {

        console.log(info.velocity.x);
        const nextPlayerID = info.velocity.x > 0 ? activePlayerID - 1 : activePlayerID + 1;
        setActivePlayerID((nextPlayerID + players.length) % players.length);

    }

    return (
        <div
            className="flex flex-col justify-between h-screen w-screen overflow-hidden p-0 m-0 sm:p-4 sm:min-h-screen sm:items-center sm:justify-center touch-none">
            <div ref={containerDiv}
                className="flex flex-col justify-between items-center h-full w-full sm:shadow-2xl sm:rounded-xl max-w-full">
                <motion.div onPanEnd={scrollPlayer} className="text-2xl font-bold mt-4 mb-4">{players[activePlayerID].name}</motion.div>
                <div ref={carRef} className="basis-1/3 overflow-hidden sm:basis-1/4">
                    {carHeight > 0 && <Carousel divHeight={carHeight} divWidth={containerWidth} cards={players[activePlayerID].Hand}/>}
                </div>
            </div>
        </div>
    );
}
