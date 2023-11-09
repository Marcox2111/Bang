import React, {createContext, useContext, useEffect, useState} from 'react';
import {PlayerType} from '../../../shared/types';
import {Client, Room} from 'colyseus.js';

type GameContextType = {
    players: PlayerType[];
    clientPlayer: PlayerType | null;
    isYourTurn: () => boolean;
    rotationPlayer: number;
    room: Room | null;
    createRoom: (roomName: string, options: any) => Promise<void>;
    joinRoom: (roomId: string, options: any) => Promise<void>;
};

const defaultContext: GameContextType = {
    players: [],
    clientPlayer: null,
    isYourTurn: () => false,
    rotationPlayer: 0,
    room: null,
    createRoom: async () => {
    },
    joinRoom: async () => {
    },
};

const GameContext = createContext<GameContextType>(defaultContext);

export function useGame() {
    return useContext(GameContext);
}

export function GameProvider({children}) {
    const [client, setClient] = useState<Client | null>(null);
    const [room, setRoom] = useState<Room | null>(null);
    const [players, setPlayers] = useState<PlayerType[]>([]);
    const [clientPlayer, setClientPlayer] = useState<PlayerType | null>(null);
    const [rotationPlayer, setRotationPlayer] = useState(0);

    useEffect(() => {
        const newClient = new Client('ws://localhost:2567');
        setClient(newClient);
    }, []);

    useEffect(() => {
        if (!room) return;

        const onStateChange = (state) => {
            const allPlayers = state.players.map(createPlayerObject);
            const myPlayer = allPlayers.find(p => p.id === room.sessionId);

            setPlayers(allPlayers);
            setClientPlayer(myPlayer || null);
        };

        room.onStateChange(onStateChange);

    }, [room]);

    const createPlayerObject = (playerData) => {
        return {
            id: playerData.id,
            isHost: playerData.isHost,
            name: playerData.name,
            range: playerData.range,
            turn: playerData.turn,
            hp: playerData.hp,
            role: playerData.role || 'unknown',
        };
    };

    const createRoom = async (roomName, options) => {
        if (!client) return;
        try {
            const newRoom = await client.create(roomName, options);
            setRoom(newRoom);
        } catch (error) {
            console.error("Create room error:", error);
        }
    };

    const joinRoom = async (roomId, options) => {
        if (!client) {
            console.log("Client is not initialized, cannot join room.");
            return;
        }
        try {
            const newRoom = await client.joinById(roomId, options);
            setRoom(newRoom);
        } catch (error) {
            console.error("Join room error:", error);
        }
    };

    const isYourTurn = () => {
        return clientPlayer?.turn || false;
    };

    return (
        <GameContext.Provider
            value={{
                players,
                clientPlayer,
                isYourTurn,
                rotationPlayer,
                createRoom,
                joinRoom,
                room,
            }}
        >
            {children}
        </GameContext.Provider>
    );
}
