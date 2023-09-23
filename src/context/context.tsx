import React, {createContext, useContext, useState} from 'react';
import {start} from "repl";
import {act} from "react-dom/test-utils";

type Card = {
    id: string;
    title: string;
};

type Player = {
    id: number;
    character: Card;
    role: Card;
    hand: Card[];
    ground: Card[];
};

const GameContext = createContext({
    activePlayer: null as Player | null,
    players: [] as Player[],
    setActivePlayer: (() => {
    }) as React.Dispatch<React.SetStateAction<Player | null>>,
    moveCardList: ((startList:string, endList:string, startIndex:number, endIndex:number) => { }),
    removeCardActivePlayer: ((_: string) => {    }) as (cardIndex: string) => void,
    addCardToPlayerHand: ((type: string, newCard: Card) => {
    }) as (type: string, newCard: Card) => void
});


export function useGame() {
    return useContext(GameContext);
}

export function GameProvider({children}) {
    // useState è un hook di react che mi restituisce il player e una funzione setPlayers che mi permette di modificare questi player
    //<Player[]> è un cast per dire che players è un array di Player, lo inizializzo creando solo un player per ora che non ha nessuna carta o niente
    const [players, setPlayers] = useState<Player[]>([
        {
            id: 1,
            character: {
                id: 'asd',
                title: 'asss'
            },
            role: {
                id: 'qwe',
                title: 'qwww'
            },
            hand: [], ground: []
        },
        {
            id: 2,
            character: {
                id: 'zxc',
                title: 'zxxx'
            },
            role: {
                id: 'vvv',
                title: 'vfr'
            },
            hand: [], ground: []
        },

    ]);
    const [activePlayer, setActivePlayer] = useState<Player>(players[0]);

    const removeCardActivePlayer = (cardIndex:string) => {
        const newHand = activePlayer.hand.filter(c => c.id !== cardIndex);
        setActivePlayer({
            ...activePlayer,
            hand: newHand,
        });

    }

    const moveCardList = (startList, endList, startIndex, endIndex) => {
        const card = activePlayer[startList][startIndex];
        if (!card) return;

        // Remove the card from the hand
        const newStartList = activePlayer[startList].filter(c => c.id !== startIndex);

        // Add the card to the ground
        const newEndList = [...activePlayer[endList], card];

        // Update the activePlayer's hand and ground
        setActivePlayer({
            ...activePlayer,
            [startList]: newStartList,
            [endList]: newEndList,
        });
    };

    const addCardToPlayerHand = (type: string, newCard: Card) => {
        setActivePlayer(prevPlayer => {
            if (!prevPlayer) return null;

            // Check the type and update the appropriate array
            if (type === "Hand") {
                return { ...prevPlayer, hand: [...prevPlayer.hand, newCard] };
            } else if (type === "Ground") {
                return { ...prevPlayer, ground: [...prevPlayer.ground, newCard] };
            }
            return prevPlayer; // return the previous state if type doesn't match any condition
        });

        // Update the specific player in the players array
        setPlayers(prevPlayers => {
            return prevPlayers.map(player => {
                if (player.id === activePlayer.id) {
                    if (type === "Hand") {
                        return { ...player, hand: [...player.hand, newCard] };
                    } else if (type === "Ground") {
                        return { ...player, ground: [...player.ground, newCard] };
                    }
                }
                return player;
            });
        });
    };


    return (
        <GameContext.Provider
            value={{activePlayer, players, setActivePlayer, moveCardList,removeCardActivePlayer, addCardToPlayerHand}}>
            {children}
        </GameContext.Provider>
    );
}
