import React, { createContext, useContext, useEffect, useState } from 'react';
import { CardType, PlayerType, RoomType } from '../../../shared/types';
import { Client, Room } from 'colyseus.js';

type GameContextType = {
    players: PlayerType[];
    clientPlayer: PlayerType;
    isYourTurn: () => boolean;
    rotationPlayer: number;
    room: Room;
    createRoom: (roomName: string, options: any) => Promise<void>;
    joinRoom: (roomId: string, options: any) => Promise<void>;
};

const defaultContext: GameContextType = {
    players: [],
    clientPlayer: null,
    isYourTurn: () => {
        return false;
    },
    room: null,
    rotationPlayer: 0,
    createRoom: async () => {},
    joinRoom: async () => {},

};

const GameContext = createContext<GameContextType>(defaultContext);

export function useGame() {
    return useContext(GameContext);
}

export function GameProvider({ children }) {
    const [client, setClient] = useState(null);
    const [room, setRoom] = useState(null);
    const [players, setPlayers] = useState<PlayerType[]>([]);
    const [clientPlayer, setClientPlayer] = useState<PlayerType>(null);
    const [rotationPlayer, setRotationPlayer] = useState(0);
    const [followPlayer, setFollowPlayer] = useState(false);


    // Initialize Colyseus client
    useEffect(() => {
        const newClient = new Client('ws://localhost:2567');
        setClient(newClient);
    }, []);

    // Function to create a room
    const createRoom = async (roomName, options) => {
        if (client) {
            try {
                const newRoom = await client.create(roomName, options);
                setRoom(newRoom);
                console.log(newRoom)
                // Handle room logic here
            } catch (error) {
                console.error("Create room error:", error);
            }
        }
    };

    // Function to join a room
    const joinRoom = async (roomId, options) => {
        if (client) {
            try {
                const newRoom = await client.joinById(roomId, options);
                setRoom(newRoom);
                console.log(newRoom)
                // Handle room logic here
            } catch (error) {
                console.error("Join room error:", error);
            }
        }
    }


    const isYourTurn = () => {
        return clientPlayer.turn;
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
