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
    activePlayerID: string | null;
    addCardToPlayerHand: (type: string, newCard: CardType) => void;
    addNewPlayer: (name: string, character: string) => void;
    moveCardList: (startList: string, endList: string, startIndex: number, endIndex: number) => void;
    players: Player[];
    removeCardActivePlayer: (cardIndex: string) => void;
    setActivePlayerID: React.Dispatch<React.SetStateAction<string | null>>;
};

const defaultContext: GameContextType = {
    activePlayerID: null,
    players: [],
    setActivePlayerID: () => {},  // This is a placeholder and will be overridden by the actual function
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
    const [activePlayerID, setActivePlayerID] = useState<string | null>(null);


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
        // const newHand = activePlayer.Hand.filter(c => c.id !== cardIndex);
        // setActivePlayer({
        //     ...activePlayer,
        //     Hand: newHand,
        // });

    }

    const moveCardList = (startList, endList, startIndex, endIndex) => {
        const playerIndex = players.findIndex(player => player.id === activePlayerID);
        const card = players[playerIndex][startList][startIndex];
        if (!card) return;

        if (startList === endList) {
            // If moving within the same list
            setPlayers(prevPlayers => {
                const updatedPlayers = [...prevPlayers];
                const updatedPlayer = {...updatedPlayers[playerIndex]};
                const updatedList = [...updatedPlayer[startList]];
        
                // Move the card within the list
                updatedList.splice(endIndex, 0, ...updatedList.splice(startIndex, 1));
        
                // Update the player's list and the players array
                updatedPlayer[startList] = updatedList;
                updatedPlayers[playerIndex] = updatedPlayer;
        
                return updatedPlayers;
            });
        } else {
            // If moving between lists
            setPlayers(prevPlayers => {
                const updatedPlayers = [...prevPlayers];
                const updatedPlayer = {...updatedPlayers[playerIndex]};
                const updatedStartList = [...updatedPlayer[startList]];
                const updatedEndList = [...updatedPlayer[endList]];
        
                // Move the card from the start list to the end list
                updatedEndList.splice(endIndex, 0, card);
                updatedStartList.splice(startIndex, 1);
        
                // Update the player's lists and the players array
                updatedPlayer[startList] = updatedStartList;
                updatedPlayer[endList] = updatedEndList;
                updatedPlayers[playerIndex] = updatedPlayer;
        
                return updatedPlayers;
            });
        }

    };


    const addCardToPlayerHand = (type: "Hand" | "Ground", newCard: CardType) => {
        
        setPlayers(prevPlayers => {
            const playerIndex = prevPlayers.findIndex(player => player.id === activePlayerID);
            
            if (playerIndex === -1) return prevPlayers; // If the player is not found, return the original array
        
            const updatedPlayer = {...prevPlayers[playerIndex]};
            updatedPlayer[type] = [...updatedPlayer[type], newCard];
        
            const updatedPlayers = [...prevPlayers];
            updatedPlayers[playerIndex] = updatedPlayer;
        
            return updatedPlayers;
        });
        
    };


    return (
        <GameContext.Provider value={{setActivePlayerID, activePlayerID, players, addNewPlayer, moveCardList, removeCardActivePlayer, addCardToPlayerHand}}>
            {children}
        </GameContext.Provider>
    );
}
