import React, { createContext, useContext, useState } from 'react';


type Player = {
    id: number;
    hand: any[];
    ground: any[];
};

type GameContextType = {
    activePlayer: Player | null;
    players: Player[];  // Add this line
    setActivePlayer: React.Dispatch<React.SetStateAction<Player | null>>;
    addCardToHand: (playerId: number) => void;
    moveCardToGround: (playerId: number, cardIndex: number) => void;
};
const defaultContextValue: GameContextType = {
    activePlayer: null,
    players: null,  // Add this line
    setActivePlayer: () => {}, // Empty function for default value
    addCardToHand: () => {},
    moveCardToGround: () => {}
};
const GameContext = createContext<GameContextType>(defaultContextValue);


export function useGame() {
    return useContext(GameContext);
}

export function GameProvider({ children }) {

    const [players, setPlayers] = useState([
        { id: 1, hand: [], ground: [] },
        { id: 2, hand: [], ground: [] },
        { id: 3, hand: [], ground: [] },
        { id: 4, hand: [], ground: [] },
        // ... other players
    ]);
    const [activePlayer, setActivePlayer] = useState(players[0]);

    const addCardToHand = (playerId) => {
        const newCard = {};
        setPlayers(prevPlayers => {
            return prevPlayers.map(player => {
                if (player.id === playerId) {
                    return { ...player, hand: [...player.hand, newCard] };
                }
                return player;
            });
        });
    };

    const moveCardToGround = (playerId, cardIndex) => {
        setPlayers(prevPlayers => {
            return prevPlayers.map(player => {
                if (player.id === playerId) {
                    const cardToMove = player.hand[cardIndex];
                    const newHand = [...player.hand];
                    newHand.splice(cardIndex, 1);
                    return { ...player, hand: newHand, ground: [...player.ground, cardToMove] };
                }
                return player;
            });
        });
    };

    // ... other game-related functions

    return (
        <GameContext.Provider value={{ activePlayer,players, setActivePlayer, addCardToHand, moveCardToGround }}>
            {children}
        </GameContext.Provider>
    );
}
