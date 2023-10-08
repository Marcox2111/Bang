// types.ts
export type CardType = {
    id: string;
    title: string;
};

export type Player = {
    id: number;
    name: string;
    character: string;
    role: string;
    Hand: CardType[];
    Ground: CardType[];
};