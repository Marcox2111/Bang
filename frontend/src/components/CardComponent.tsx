import React from "react";
import {CardType} from "../../../shared/types";

type CardProps={
    card:CardType
}

export function CardComponent({card}: CardProps) {
    let image;
    try {
        image = require(`../cards/bang_cards/${card.name}.png`);
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

