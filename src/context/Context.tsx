import React, {createContext, useContext, useState, ReactNode} from 'react';
import {CardType, Player} from "../types";

type GameProviderProps = {
    children: ReactNode;
};

type GameContextType = {
    activePlayerID: number;
    setActivePlayerID: React.Dispatch<React.SetStateAction<number>>;
    players: Player[];
    setPlayers: React.Dispatch<React.SetStateAction<Player[]>>;
};

const defaultContext: GameContextType = {
    activePlayerID: 0,
    setActivePlayerID: () => {}, // Placeholder function
    players: [],
    setPlayers: () => {}, // Placeholder function
};

const GameContext = createContext<GameContextType>(defaultContext);


export function useGame() {
    return useContext(GameContext);
}

export function GameProvider({children}:GameProviderProps) {
    // useState è un hook di react che mi restituisce il player e una funzione setPlayers che mi permette di modificare questi player
    //<Player[]> è un cast per dire che players è un array di Player, lo inizializzo creando solo un player per ora che non ha nessuna carta o niente
    const [players, setPlayers] = useState<Player[]>([]);
    const [activePlayerID, setActivePlayerID] = useState<number>(0);





    return (
        <GameContext.Provider
            value={{setActivePlayerID, activePlayerID, players, setPlayers}}>
            {children}
        </GameContext.Provider>
    );
}
