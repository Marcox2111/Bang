import React, {useEffect, useRef} from 'react';
import {CardComponent} from "./CardComponent";
import {motion, PanInfo, useSpring} from 'framer-motion';
import {CardType} from "../../../shared/types";
import {useShowCard} from "../context/ShowCardContext";

type CarouselProps = {
    cards: CardType[];
    divHeight: number;
    divWidth: number;
};

export function Carousel({cards, divHeight, divWidth}: CarouselProps) {
    const {openCard} = useShowCard();
    const isPanning = useRef(false);


    // Constants and calculations related to the carousel layout
    const totalCards = cards.length;
    const maxCards = 44;
    const rotInc = 2 * Math.PI / maxCards;
    const CardHeight = divHeight / 1.1;
    const CardWidth = CardHeight / 1.556;
    const CarouselDiameter = 1.7 * (CardHeight + maxCards * CardWidth / (2 * Math.PI));
    const divWidthAngle = 2 * Math.asin(divWidth / CarouselDiameter) * 180 / Math.PI;
    const lastCardAngle = rotInc * Math.floor(totalCards / 2) * 180 / Math.PI;
    const maxRotation = Math.abs(divWidthAngle / 2 - lastCardAngle - 5);
    const minRotation = -Math.abs(divWidthAngle / 2 - lastCardAngle - 5);

    // State and refs
    const rotation = useSpring(0, {stiffness: 100, damping: 12});
    const rotationRef = useRef(0);

    useEffect(() => {
        rotation.set(0);
    }, [rotation]);

    const calculateTransformations = (index: number) => {
        const adjustedIndex = index - Math.floor(totalCards / 2);
        const translateX = (CarouselDiameter / 2 - CardHeight/1.9) * Math.cos(rotInc * adjustedIndex - Math.PI / 2);
        const translateY = (CarouselDiameter / 2 - CardHeight/1.9) * Math.sin(rotInc * adjustedIndex - Math.PI / 2);
        const rotationRad = rotInc * adjustedIndex;


        return {translateX, translateY, rotationRad};
    };

    const onPan = (event: PointerEvent, info: PanInfo) => {
        isPanning.current = true;
        const newRotation = rotationRef.current + info.offset.x / 10;
        const clampedRotation = newRotation < 0
            ? Math.max(newRotation, minRotation)
            : Math.min(newRotation, maxRotation);
        rotation.set(clampedRotation * 0.95);
    };

    const {
        translateX: initialX,
        translateY: initialY,
        rotationRad: initialAngle
    } = calculateTransformations((totalCards / 2));


    return (
        <div className="shrink-0 ">
            <motion.div
                className="circular"
                onPan={onPan}
                onPanEnd={() => {
                    rotationRef.current = rotation.get();
                    isPanning.current = false
                }}
                style={{
                    width: `${CarouselDiameter}px`,
                    rotate: rotation,
                    clipPath: `circle(${CarouselDiameter / 2}px at center)`
                }}
            >
                {Array.from(cards).map((card, index) => {
                    const {translateX, translateY, rotationRad} = calculateTransformations(index);
                    console.log(index)
                    return (
                        <motion.div
                            key={card.id}
                            className="card"
                            initial={{transform: `translate(${initialX}px, ${initialY}px) rotate(${initialAngle}rad)`}}
                            animate={{transform: `translate(${translateX}px, ${translateY}px) rotate(${rotationRad}rad)`}}
                            transition={{duration: 0.5}}
                            whileHover={{
                                transform: `translate(${translateX}px, ${translateY}px) rotate(${rotationRad}rad) scale(1.05)`,
                                zIndex: 100,
                                transition: {duration: 0.32},
                            }}
                            onTap={() => {
                                if (!isPanning.current && card.name !=="hidden") {
                                    openCard(card);
                                }
                            }}

                            style={{
                                width: `${CardWidth}px`,
                                height: `${CardHeight}px`,
                                transform: `translate(${translateX}px, ${translateY}px) rotate(${rotationRad}rad)`
                            }}
                        >
                            <CardComponent card={card}/>
                        </motion.div>
                    );
                })}
            </motion.div>
        </div>
    );
}

export default Carousel;
