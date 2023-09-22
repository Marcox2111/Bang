import React, { createContext, useContext, useState } from 'react';

type Card = {
    id: string;
    title: string;
};

type Player = {
    id: number;
    hand: Card[];
    ground: Card[];
};

type GameContextType = {
    activePlayer: Player | null;
    players: Player[];
    setActivePlayer: React.Dispatch<React.SetStateAction<Player | null>>;
    addCardToHand: (playerId: number) => void;
    moveCardToGround: (playerId: number, cardIndex: number) => void;
};

const defaultContextValue: GameContextType = {
    activePlayer: null,
    players: [],
    setActivePlayer: () => {},
    addCardToHand: () => {},
    moveCardToGround: () => {}
};

const GameContext = createContext<GameContextType>(defaultContextValue);

export function useGame() {
    return useContext(GameContext);
}

export function GameProvider({ children }) {
    const [players, setPlayers] = useState<Player[]>([
        { id: 1, hand: [], ground: [] },
        { id: 2, hand: [], ground: [] },
        { id: 3, hand: [], ground: [] },
        { id: 4, hand: [], ground: [] },
    ]);
    const [activePlayer, setActivePlayer] = useState<Player | null>(players[0]);

    const addCardToHand = (playerId: number) => {
        const newCard = { id: 'newCard', title: 'New Card' };
        setPlayers(prevPlayers => {
            return prevPlayers.map(player => {
                if (player.id === playerId) {
                    return { ...player, hand: [...player.hand, newCard] };
                }
                return player;
            });
        });
    };

    const moveCardToGround = (playerId: number, cardIndex: number) => {
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

    return (
        <GameContext.Provider value={{ activePlayer, players, setActivePlayer, addCardToHand, moveCardToGround }}>
            {children}
        </GameContext.Provider>
    );
}
