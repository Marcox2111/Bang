import React from "react";

type CardProps = {
    id: string;
    cardName: string;
};

export function Card({id, cardName}: CardProps) {
    let image;
    try {
        image = require(`../cards/bang_cards/${cardName}.png`);
    } catch (err) {
        console.error(err);
        image = require('../cards/bang_cards/barile.png'); // Fallback to a default image
    }

    return (
        <div
            className="flex justify-center items-center pointer-events-none">
            {image && <img src={image} alt="Character" className={""}/>}
        </div>
    );
}
