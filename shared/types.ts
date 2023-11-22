// types.ts
export type CardType = {
    id: string;
    name: string | null;
    target: string | null;
};

export type ReactionsType = {
    type: string;
    actor: string;
};
export type PlayerType = {
    id: string;
    isHost: boolean;
    name: string;
    range: number;
    turn: boolean;
    cards: CardType[];
    hp: number;
    role: string;
};

export type RoomType = {
    id: string;
    players: PlayerType[];
};

