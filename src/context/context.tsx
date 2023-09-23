import React, {createContext, useContext, useState} from 'react';

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
    moveCardToGround: ((_: number, __: number) => {
    }) as (playerId: number, cardIndex: number) => void,
    addCardToPlayerHand: ((newCard: Card) => {
    }) as (newCard: Card) => void
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
                id: '',
                title: ''
            },
            role: {
                id: '',
                title: ''
            },
            hand: [], ground: []
        },
        {
            id: 2,
            character: {
                id: '',
                title: ''
            },
            role: {
                id: '',
                title: ''
            },
            hand: [], ground: []
        },

    ]);
    const [activePlayer, setActivePlayer] = useState<Player>(players[0]);


    const moveCardToGround = (playerId: number, cardIndex: number) => {
    };

    const addCardToPlayerHand = (newCard: Card) => {
        setActivePlayer(prevPlayer => {
            if (!prevPlayer) return null;
            return {...prevPlayer, hand: [...prevPlayer.hand, newCard]};
        });

        // Update the specific player in the players array
        setPlayers(prevPlayers => {
            return prevPlayers.map(player => {
                if (player.id === activePlayer.id) {
                    return { ...player, hand: [...player.hand, newCard] };
                }
                return player;
            });
        });
    };

    return (
        <GameContext.Provider
            value={{activePlayer, players, setActivePlayer, moveCardToGround, addCardToPlayerHand}}>
            {children}
        </GameContext.Provider>
    );
}
