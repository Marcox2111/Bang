import React, {createContext, useContext, useEffect, useState} from 'react';
import {CardType, PlayerType, RoomType} from '../../../shared/types';
import {socket} from './socket';

type GameContextType = {
    players: PlayerType[];
    clientPlayer: PlayerType;
    isYourTurn: () => boolean;
    rotationPlayer: number;
    RotatePlayer: (mode: string) => void;
    followPlayingPlayer: () => void;
    drawCards: () => void;
    passTurn: () => void;
    discardCard: (arg0: CardType) => void;
};

const defaultContext: GameContextType = {
    players: [],
    clientPlayer: null,
    isYourTurn: () => {
        return false;
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
    discardCard: () => {
    }
};

const GameContext = createContext<GameContextType>(defaultContext);

export function useGame() {
    return useContext(GameContext);
}

export function GameProvider({children}) {

    useEffect(() => {

        socket.on('roomInfo', (RoomInfo: RoomType) => {
            ServerDataToClient(RoomInfo);
        });


        return () => {
            socket.off('roomInfo');
            socket.off('playerAction');
        };
    }, []);


    const drawCards = () => {
        socket.emit('startTurnDraw');
    };

    const passTurn = (): boolean => {
        if (clientPlayer.cards.length <= clientPlayer.hp) {
            socket.emit('passTurn');
            return true;
        }
        console.log("devi scartare")
        return false;
    };

    const discardCard = (card: CardType) => {
        socket.emit('discardCard', card.id)
    }

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

    //TODO: This RotatePlayer doesn't make any sense here, i will adjust it
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
                rotationPlayer,
                RotatePlayer,
                followPlayingPlayer,
                drawCards,
                passTurn,
                discardCard,
            }}
        >
            {children}
        </GameContext.Provider>
    );
}
