import React from "react";

type CardProps={
    cardName:string
}

export function CardComponent({cardName}: CardProps) {
    let image;
    try {
        image = require(`../cards/bang_cards/${cardName}.png`);
    } catch (err) {
        console.error(err);
        image = require('../cards/bang_cards/barile.png'); // Fallback to a default image
    }

    return (
        <div className="flex justify-center items-center h-full">
            {image && <img src={image} alt="Character" className="max-h-full w-auto object-contain" />}
        </div>
    );

}

