import React, {useRef} from 'react';
import {Card} from "./card";
import {CardType} from "../types";
import {motion, PanInfo} from 'framer-motion';


type CarouselProps = {
    cards: CardType[];
    divWidth: number;
}

export function Carousel({cards, divWidth}: CarouselProps) {
    const [rotation, setRotation] = React.useState(0);
    const totalCards = cards.length;
    const rotInc = Math.PI / 22;
    const minRotation = (0.8 - Math.floor(totalCards / 2)) * rotInc;
    const maxRotation = (Math.floor(totalCards / 2) - 0.8) * rotInc;
    const CarouselWidth = divWidth / Math.sin(3 / 2 * rotInc)
    const CardWidth = CarouselWidth / 13;
    const CardHeight = CardWidth * 1.57;
    const rotationRef = useRef(0);
    const calculateTransformations = (index: number) => {
        const adjustedIndex = index - Math.floor(totalCards / 2);
        const translateX = (CarouselWidth / 2 - CardWidth / 1.9) * Math.cos(rotInc * adjustedIndex - Math.PI / 2 + rotation);
        const translateY = (CarouselWidth / 2 - CardHeight / 1.9) * Math.sin(rotInc * adjustedIndex - Math.PI / 2 + rotation);
        const rotationRad = rotInc * adjustedIndex + rotation;

        return {
            translateX,
            translateY,
            rotationRad,
        };
    };


    function onPan(event: PointerEvent, info: PanInfo) {
        const newRotation = Math.atan(info.offset.x / 1000) + rotationRef.current;
        setRotation(newRotation); // Add the new rotation to the current rotation
    }

    return (
        <motion.div
            className="circular"
            onPan={onPan}
            onPanEnd={(event, info) => rotationRef.current = rotation}
            style={{
                width: `${CarouselWidth}px`,
            }}>
            {cards.map((card, index) => {
                const {
                    translateX: initialX,
                    translateY: initialY,
                    rotationRad: initialAngle
                } = calculateTransformations(Math.floor(totalCards / 2));
                const {translateX, translateY, rotationRad} = calculateTransformations(index);
                return (
                    <motion.div
                        key={card.id}
                        className="card"
                        initial={{transform: `translate(${initialX}px, ${initialY}px) rotate(${initialAngle}rad)`}}
                        animate={{transform: `translate(${translateX}px, ${translateY}px) rotate(${rotationRad}rad)`}}
                        transition={{duration: 0.5}}
                        // whileHover={{
                        //     transform: `translate(${translateX}px, ${translateY}px) rotate(${rotationRad}rad) scale(1.05)`,
                        //     transition: {duration: 0.32},
                        // }}
                        style={{
                            width: `${CardWidth}px`,
                            height: `${CardHeight}px`,
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
