import React from 'react';
import {Card} from "./card";
import {CardType} from "../types";

type CarouselProps = {
    cards: CardType[];
}

const Carousel = ({cards}: CarouselProps) => {
    const totalCards = cards.length;
    const rotInc = Math.PI / 14;
    const CarouselWidth = 2000;
    const CardHeight = 350;
    const CardWidth = 200;

    return (
        <div className="">
            <div className="circular"
                 style={{
                     width: `${CarouselWidth}px`
                 }}>
                {cards.map((card, index) => {
                    // Calculate the adjusted index for positioning
                    const adjustedIndex = index - Math.floor(totalCards / 2);

                    // Calculate the X and Y translation values
                    const translateX = (CarouselWidth / 2 - CardWidth / 2) * Math.cos(rotInc * adjustedIndex - Math.PI / 2);
                    const translateY = (CarouselWidth / 2 - CardHeight / 2) * Math.sin(rotInc * adjustedIndex - Math.PI / 2);

                    // Calculate the rotation value for radial alignment
                    const rotationRad = rotInc * adjustedIndex;

                    return (
                        <div
                            key={card.id}
                            className="card"
                            style={{
                                width: `${CardWidth}px`,
                                height: `${CardHeight}px`,
                                transform: `translate(${translateX}px, ${translateY}px) rotate(${rotationRad}rad)`
                            }}
                        >
                            <Card id={card.id} cardName={card.title}/>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Carousel;
