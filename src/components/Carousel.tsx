import React, {useEffect} from 'react';
import {Card} from "./card";
import {CardType} from "../types";
import {motion, PanInfo, useSpring} from 'framer-motion';


type CarouselProps = {
    cards: CardType[];
    divHeight: number;
}

export function Carousel({cards, divHeight}: CarouselProps) {
    const totalCards = cards.length;
    const maxCards = 44;
    const rotInc = 2*Math.PI / maxCards;
    const minRotation = (0.8 - Math.floor(totalCards / 2)) * rotInc * 180 / Math.PI;
    const maxRotation = (Math.floor(totalCards / 2) - 0.8) * rotInc * 180 / Math.PI;
    const CardHeight = divHeight/1.1;
    const CardWidth = CardHeight/1.556;
    const CarouselDiameter = 1.7*(CardHeight + maxCards*CardWidth/(2*Math.PI));
    const rotation = useSpring(0, { stiffness: 100, damping: 12 });

    useEffect(() => {
        rotation.set(0); // Set initial value
    }, []); // Empty dependency array means this useEffect runs once on mount


    function calculateTransformations (index: number) {
        const adjustedIndex = index - Math.floor(totalCards / 2);
        const translateX = (CarouselDiameter / 2 - CardWidth / 1.9) * Math.cos(rotInc * adjustedIndex - Math.PI / 2);
        const translateY = (CarouselDiameter / 2 - CardHeight / 1.9) * Math.sin(rotInc * adjustedIndex - Math.PI / 2);
        const rotationRad = rotInc * adjustedIndex;

        return {
            translateX,
            translateY,
            rotationRad,
        };
    }

    const {
        translateX: initialX,
        translateY: initialY,
        rotationRad: initialAngle
    } = calculateTransformations(Math.floor(totalCards / 2));


    const onPan = (event: PointerEvent, info: PanInfo) => {
        const newRotation = info.offset.x / 10; // Adjust this calculation
        const clampedRotation = Math.max(minRotation, Math.min(maxRotation, newRotation));
        rotation.set(clampedRotation); // Use rotation.set() to update the rotation value
    };


    return (
        <motion.div
            className="circular"
            onPan={onPan}
            style={{
                width: `${CarouselDiameter}px`,
                rotate: rotation
            }}>
            {cards.map((card, index) => {
                const {translateX, translateY, rotationRad} = calculateTransformations(index);
                return (
                    <motion.div
                        key={card.id}
                        className="card"
                        initial={{transform: `translate(${initialX}px, ${initialY}px) rotate(${initialAngle}rad)`}}
                        animate={{transform: `translate(${translateX}px, ${translateY}px) rotate(${rotationRad}rad)`}}
                        transition={{duration: 0.5}}
                        whileHover={{
                            transform: `translate(${translateX}px, ${translateY}px) rotate(${rotationRad}rad) scale(1.05)`,
                            transition: {duration: 0.32},
                        }}
                        style={{
                            width: `${CardWidth}px`,
                            height: `${CardHeight}px`,
                            transform: `translate(${translateX}px, ${translateY}px) rotate(${rotationRad}rad)`
                        }}
                    >
                        <Card id={card.id} cardName={card.title}/>
                    </motion.div>
                );
            })}
        </motion.div>
    );
}

export default Carousel;
