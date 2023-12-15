import React, {createContext, useContext, useEffect, useRef, useState} from 'react';
import {CardType, ReactionsType, PlayerType} from '../../../shared/types';
import {Client, Room} from 'colyseus.js';


type GameContextType = {
    players: PlayerType[];
    clientPlayer: PlayerType | null;
    isYourTurn: () => boolean;
    waitingForReaction: boolean;
    rotationPlayer: number;
    room: Room | null;
    reactToCard: ReactionsType;
    createRoom: (roomName: string, options: any) => Promise<void>;
    joinRoom: (roomId: string, options: any) => Promise<void>;
    rotateCarouselLeft: () => void;
    rotateCarouselRight: () => void;
    discardCard: (card: CardType) => void;
    passTurn: () => void;
    playCard: (card: CardType, target: PlayerType[]) => void;
    reactToBang: (card: CardType) => void;
    reactToIndians: (card: CardType) => void;
    reactToDuel: (card: CardType) => void;
    gameLogs: string[];
};

const defaultContext: GameContextType = {
    players: [],
    clientPlayer: null,
    isYourTurn: () => false,
    waitingForReaction: false,
    rotationPlayer: 0,
    room: null,
    reactToCard: {type: null, actor: null},
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
    },
    reactToBang: () => {
    },
    reactToIndians: () => {
    },
    reactToDuel: () => {
    },
    gameLogs: [],
}

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
    const [reactToCard, setReactToCard] = useState({type: null, actor: null});
    const [waitingForReaction, setWaitingForReaction] = useState(false);
    const [gameLogs, setGameLogs] = useState<string[]>([]);


    const currentTurnIndexRef = useRef(null); // Using useRef to store the current turn index
    const playersRef = useRef(players);
    const clientPlayerRef = useRef(clientPlayer);

    //THIS IS THE CONNECTION TO THE SERVER
    useEffect(() => {
        const newClient = new Client('ws://localhost:2567');
        setClient(newClient);
    }, []);


    //THIS CREATES THE REFERENCE TO THE PLAYERS AND THE CLIENT PLAYER
    useEffect(() => {
        playersRef.current = players;
        clientPlayerRef.current = clientPlayer;
        updateRotationPlayer();
    }, [players, clientPlayer]);

    //THIS IS THE LISTENER FOR THE ROOM
    useEffect(() => {
        if (!room) return;

        // Function to handle state changes
        const handleStateChange = (state) => {
            updatePlayersState(state);
        };

        room.onMessage("reactToCard", handleReactToCard);
        room.onMessage("cardReacted", handleCardReacted);
        room.onMessage("EveryoneReacted", () => {
            setWaitingForReaction(false)
        });
        room.onMessage("Log", (log) => {
            setGameLogs(prevLogs => [...prevLogs, log]);
        });

        // Set up message listeners
        room.onStateChange(handleStateChange);
        // Cleanup function
        return () => {
            currentTurnIndexRef.current = null;
        };
    }, [room]); // Dependency array includes only 'room'


    // Function to update players state
    const updatePlayersState = (state) => {
        const allPlayers = state.players.map(createPlayerObject);
        const myPlayer = allPlayers.find(p => p.id === room.sessionId);
        setPlayers(allPlayers);
        setClientPlayer(myPlayer);
    };

    // Function to update rotation player
    const updateRotationPlayer = (follow: boolean = false) => {
        const turnPlayerIndex = playersRef.current.findIndex(p => p.turn === true);
        // Check if the turn index has changed
        if (currentTurnIndexRef.current !== turnPlayerIndex || follow) {
            setRotationPlayer(-360 * turnPlayerIndex / playersRef.current.length);
            currentTurnIndexRef.current = turnPlayerIndex;
        }
    };

    const handleReactToCard = (value) => {
        const currentPlayers = playersRef.current;
        const currentClientPlayer = clientPlayerRef.current;

        const index = currentPlayers.findIndex(p => p.id === currentClientPlayer?.id);
        if (index !== -1) {
            setRotationPlayer(-360 * index / currentPlayers.length);
        }
        //The value that comes from the server is { actorName: actorPlayer.name, cardName: card.name }
        setReactToCard({type: value.cardName, actor: value.actorName});
    };

    const handleCardReacted = () => {
        setReactToCard({type: null, actor: null})
        updateRotationPlayer(true);
    };


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

    const rotateCarouselLeft = () => {/**/
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
        if (isYourTurn())
            room.send("passTurn")
    }

    const playCard = (card: CardType, targets: PlayerType[]) => {
        setWaitingForReaction(true);
        room.send("playCard", {card, targets})
    }

    const reactToBang = (card: CardType) => {
        console.log(card)
        room.send("missedReaction", card)
    }

    const reactToIndians = (card: CardType) => {
        console.log(card)
        room.send("bangReaction", card)
    }

    const reactToDuel = (card: CardType) => {
        console.log(card)
        room.send("duelReaction", card)
    }

    return (
        <GameContext.Provider
            value={{
                players,
                clientPlayer,
                isYourTurn,
                waitingForReaction,
                rotationPlayer,
                createRoom,
                joinRoom,
                room,
                reactToCard,
                rotateCarouselLeft,
                rotateCarouselRight,
                discardCard,
                passTurn,
                playCard,
                reactToBang,
                reactToIndians,
                reactToDuel,
                gameLogs,
            }}
        >
            {children}
        </GameContext.Provider>
    );
}
