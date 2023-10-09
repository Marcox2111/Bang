import React, {useEffect, useRef, useState} from 'react';
import {Card} from "./card";
import {CardType} from "../types";
import {useDrag} from '@use-gesture/react';


type CarouselProps = {
    cards: CardType[];
    divWidth: number;
}

export function Carousel({cards,divWidth}: CarouselProps) {
    const [rotation, setRotation] = React.useState(0);
    const totalCards = cards.length;
    const rotInc = Math.PI / 22;
    const minRotation = (0.8 -Math.floor(totalCards / 2)) * rotInc;
    const maxRotation = (Math.floor(totalCards / 2) - 0.8) * rotInc;
    const CarouselWidth = divWidth/Math.sin(3/2*rotInc)
    const CardWidth = CarouselWidth/13;
    const CardHeight = CardWidth* 1.5;
    const dragOffset = useRef(0)



    const bind = useDrag(({event, offset: [x], direction: [dx]}) => {
        event.preventDefault()
        const newRotation = (x - dragOffset.current)/1000
        const clampedRotation = Math.max(minRotation, Math.min(maxRotation, newRotation));
        setRotation(clampedRotation);
    })


    return (
        <div {...bind()} className="circular" style={{width: `${CarouselWidth}px`}}>
            {cards.map((card, index) => {
                const adjustedIndex = index - Math.floor(totalCards / 2);
                const translateX = (CarouselWidth / 2 - CardWidth / 2) * Math.cos(rotInc * adjustedIndex - Math.PI / 2+rotation);
                const translateY = (CarouselWidth / 2 - CardHeight / 2) * Math.sin(rotInc * adjustedIndex - Math.PI / 2+rotation);
                const rotationRad = rotInc * adjustedIndex+rotation

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
    );
};

export default Carousel;
