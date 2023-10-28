// types.ts
export type CardType = {
    id: string;
    name: string | null;
    target:string |null;
};

export type PlayerType = {
    id:string;
    isHost: boolean;
    name: string;
    range: number;
    turn: boolean;
    cards: CardType[];
    character: string | null;
    hp: number;
    role: string | null;
}

export type RoomType = {
    id: string;
    players:PlayerType[]
};