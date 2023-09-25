import React, {createContext, useContext, useState} from 'react';

type CardType = {
    id: string;
    title: string;
};

type Player = {
    id: string;
    character: CardType;
    role: CardType;
    Hand: CardType[];
    Ground: CardType[];
};

type GameContextType = {
    activePlayer: Player | null;
    addCardToPlayerHand: (type: string, newCard: CardType) => void;
    addNewPlayer: (name: string, character: string) => void;
    moveCardList: (startList: string, endList: string, startIndex: number, endIndex: number) => void;
    players: Player[];
    removeCardActivePlayer: (cardIndex: string) => void;
    setActivePlayer: React.Dispatch<React.SetStateAction<Player | null>>;
};

const defaultContext: GameContextType = {
    activePlayer: null,
    players: [],
    setActivePlayer: () => {},  // This is a placeholder and will be overridden by the actual function
    moveCardList: () => {},    // Placeholder
    removeCardActivePlayer: () => {},  // Placeholder
    addCardToPlayerHand: () => {},  // Placeholder
    addNewPlayer: () => {}  // Placeholder
};

const GameContext = createContext<GameContextType>(defaultContext);


export function useGame() {
    return useContext(GameContext);
}

export function GameProvider({children}) {
    // useState è un hook di react che mi restituisce il player e una funzione setPlayers che mi permette di modificare questi player
    //<Player[]> è un cast per dire che players è un array di Player, lo inizializzo creando solo un player per ora che non ha nessuna carta o niente
    const [players, setPlayers] = useState<Player[]>([]);
    const [activePlayer, setActivePlayer] = useState<Player>(players[0]);


    const addNewPlayer = (name:string,character:string) => {

        const newPlayer: Player = {
            id: name, // This will give a new ID based on the current number of players
            character: {
                id: 'defaultCharacterId', // You can adjust this as needed
                title: character
            },
            role: {
                id: 'defaultRoleId', // You can adjust this as needed
                title: 'Default Role'
            },
            Hand: [],
            Ground: []
        };

        setPlayers(prevPlayers => [...prevPlayers, newPlayer]);
    };

    const removeCardActivePlayer = (cardIndex:string) => {
        const newHand = activePlayer.Hand.filter(c => c.id !== cardIndex);
        setActivePlayer({
            ...activePlayer,
            Hand: newHand,
        });

    }

    const moveCardList = (startList, endList, startIndex, endIndex) => {
        const card = activePlayer[startList][startIndex];
        if (!card) return;

        if (startList === endList) {
            // If moving within the same list
            const updatedList = [...activePlayer[startList]];
            updatedList.splice(startIndex, 1); // Remove the card from its original position
            updatedList.splice(endIndex, 0, card); // Insert the card at the endIndex position

            setActivePlayer({
                ...activePlayer,
                [startList]: updatedList,
            });
        } else {
            // If moving between different lists
            const newStartList = activePlayer[startList].filter(c => c.id !== card.id);

            const newEndList = [...activePlayer[endList]];
            newEndList.splice(endIndex, 0, card); // Insert the card at the endIndex position

            setActivePlayer({
                ...activePlayer,
                [startList]: newStartList,
                [endList]: newEndList,
            });
        }

    };


    const addCardToPlayerHand = (type: "Hand" | "Ground", newCard: CardType) => {
        setActivePlayer(prevPlayer => {
            if (!prevPlayer) return null;

            const updatedPlayer = {...prevPlayer};
            console.log(type); // Debug log
            updatedPlayer[type] = [...updatedPlayer[type], newCard];
            return updatedPlayer;
        });

        setPlayers(prevPlayers => prevPlayers.map(player => {
            if (player.id !== activePlayer.id) return player;

            const updatedPlayer = {...player};
            updatedPlayer[type] = [...updatedPlayer[type], newCard];
            return updatedPlayer;
        }));
    };


    return (
        <GameContext.Provider value={{activePlayer, players,addNewPlayer, setActivePlayer, moveCardList, removeCardActivePlayer, addCardToPlayerHand}}>
            {children}
        </GameContext.Provider>
    );
}
