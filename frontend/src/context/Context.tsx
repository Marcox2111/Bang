import React, {createContext, useContext, useEffect, useState} from 'react';
import {PlayerType, RoomType} from '../../../shared/types';
import {socket} from './socket';

type GameContextType = {
    players: PlayerType[];
    clientPlayer: PlayerType;
    isYourTurn: () => boolean;
    updateRoomInfo: () => void;
    rotationPlayer: number;
    RotatePlayer: (mode: string) => void;
    followPlayingPlayer: () => void;
    drawCards: () => void;
    passTurn: () => void;
};

const defaultContext: GameContextType = {
    players: [],
    clientPlayer: null,
    isYourTurn: () => {
        return false;
    },
    updateRoomInfo: () => {
    },
    rotationPlayer: 0,
    RotatePlayer: () => {
    },
    followPlayingPlayer: () => {
    },
    drawCards: () => {
    },
    passTurn: () => {
    },
};

const GameContext = createContext<GameContextType>(defaultContext);

export function useGame() {
    return useContext(GameContext);
}

export function GameProvider({children}) {
    useEffect(() => {
        socket.on('playerAction', () => {
            socket.emit('requestRoomInfo');
        });

        socket.on('roomInfo', (Players) => {
            ServerDataToClient(Players);
        });

        return () => {
            socket.off('roomInfo');
            socket.off('playerAction');
        };
    }, []);

    const updateRoomInfo = () => {
        socket.emit('requestRoomInfo');
    };

    const drawCards = () => {
        socket.emit('startTurnDraw');
    };

    const passTurn = () => {
        socket.emit('passTurn');
    };

    const [players, setPlayers] = useState<PlayerType[]>([]);
    const [clientPlayer, setClientPlayer] = useState<PlayerType>(null);
    const [rotationPlayer, setRotationPlayer] = useState(0);
    const [followPlayer, setFollowPlayer] = useState(false);

    const ServerDataToClient = (serverData: RoomType) => {
        setPlayers(serverData.players);
        setClientPlayer(
            serverData.players.find(
                (player) => player.name === socket.data.playerName,
            ),
        );
    };

    const RotatePlayer = (mode: string) => {
        setFollowPlayer(false);
        if (mode === 'left')
            setRotationPlayer(rotationPlayer + 360 / players.length);
        else if (mode === 'right')
            setRotationPlayer(rotationPlayer - 360 / players.length);
        else if (mode === 'home')
            setRotationPlayer(360 - (360 / players.length) * players.findIndex((player) => player.name === socket.data.playerName));
    };

    useEffect(() => {
        if (followPlayer) {
            const playerTurnIndex = players.findIndex(
                (player) => player.turn === true,
            );
            const rotation = 360 - (360 / players.length) * playerTurnIndex;
            setRotationPlayer(rotation);
        }
    }, [players, followPlayer]);

    const followPlayingPlayer = () => {
        setFollowPlayer(true);
    };

    const isYourTurn = () => {
        return clientPlayer.turn;
    };

    return (
        <GameContext.Provider
            value={{
                players,
                clientPlayer,
                isYourTurn,
                updateRoomInfo,
                rotationPlayer,
                RotatePlayer,
                followPlayingPlayer,
                drawCards,
                passTurn,
            }}
        >
            {children}
        </GameContext.Provider>
    );
}
