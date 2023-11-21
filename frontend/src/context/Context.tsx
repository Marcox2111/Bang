import React, {createContext, useContext, useEffect, useRef, useState} from 'react';
import {CardType, PlayerType} from '../../../shared/types';
import {Client, Room} from 'colyseus.js';
import {PAGES} from "./constants";

type GameContextType = {

    players: PlayerType[];
    clientPlayer: PlayerType | null;
    isYourTurn: () => boolean;
    rotationPlayer: number;
    room: Room | null;
    createRoom: (roomName: string, options: any) => Promise<void>;
    joinRoom: (roomId: string, options: any) => Promise<void>;
    rotateCarouselLeft: () => void;
    rotateCarouselRight: () => void;
    discardCard: (card: CardType) => void;
    passTurn: () => void;
    playCard: (card: CardType, target: PlayerType[]) => void;
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
        rotateCarouselLeft: () => {
        },
        rotateCarouselRight: () => {
        },
        discardCard: () => {
        },
        passTurn: () => {
        },
        playCard: () => {
        }
    }
;

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
    const currentTurnIndexRef = useRef(null); // Using useRef to store the current turn index

    useEffect(() => {
        const newClient = new Client('ws://localhost:2567');
        setClient(newClient);
    }, []);


    useEffect(() => {
        if (!room) return;

        const onStateChange = (state) => {
            const allPlayers = state.players.map(createPlayerObject);
            const myPlayer = allPlayers.find(p => p.id === room.sessionId);

            // Find the index of the player whose turn it is
            const turnplayerIndex = allPlayers.findIndex(p => p.turn === true);

            // Check if the turn index has changed
            if (currentTurnIndexRef.current !== turnplayerIndex) {
                setRotationPlayer(-360 * turnplayerIndex / allPlayers.length);
                currentTurnIndexRef.current = turnplayerIndex; // Update the current turn index
            }

            setPlayers(allPlayers);
            setClientPlayer(myPlayer);
        };

        room.onStateChange(onStateChange);

        // This effect will clean up the ref when the component unmounts
        return () => {
            currentTurnIndexRef.current = null;
        };
    }, [room]); // Dependency array only includes room


    const createPlayerObject = (playerData): PlayerType => {
        return {
            id: playerData.id,
            isHost: playerData.isHost,
            name: playerData.name,
            range: playerData.range,
            turn: playerData.turn,
            hp: playerData.hp,
            role: playerData.role || 'unknown',
            cards: playerData.cards.map(card => ({
                id: card.id,
                name: card.name || 'hidden',
                target: card.target || 'all' // Assuming 'target' is another field you have on your Card schema.
            }))
        };
    };

    const createRoom = async (roomName: string, options) => {
        if (!client) return;
        try {
            const newRoom = await client.create(roomName, options);
            setRoom(newRoom);
        } catch (error) {
            console.error("Create room error:", error);
        }
    };

    const joinRoom = async (roomId: string, options) => {
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

    const rotateCarouselLeft = () => {
        const rotateLeft = rotationPlayer + 360 / players.length
        setRotationPlayer(rotateLeft)
    }

    const rotateCarouselRight = () => {
        const rotateRight = rotationPlayer - 360 / players.length
        setRotationPlayer(rotateRight)
    }

    const discardCard = (card: CardType) => {
        room.send("discardCard", card)
    }

    const passTurn = () => {
        room.send("passTurn")
    }

    const playCard = (card: CardType, targets: PlayerType[]) => {
        room.send("playCard", {card, targets})
    }

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
                rotateCarouselLeft,
                rotateCarouselRight,
                discardCard,
                passTurn,
                playCard,
            }}
        >
            {children}
        </GameContext.Provider>
    );
}
