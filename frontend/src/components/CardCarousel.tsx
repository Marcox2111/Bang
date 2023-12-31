import React, {useEffect, useRef, useCallback, useState} from 'react';
import {CardComponent} from './CardComponent';
import {motion, PanInfo, useSpring} from 'framer-motion';
import {CardType} from '../../../shared/types';
import {useShowCard} from '../context/ShowCardContext';
import {useGame} from "../context/Context";

type CarouselProps = {
    cards: CardType[];
    divHeight: number;
    divWidth: number;
    reaction: string | null;
};

type Transformation = {
    translateX: number;
    translateY: number;
    rotationRad: number;
};


const useCarouselCalculations = (totalCards, divHeight, divWidth, maxCards) => {
    const rotInc = (2 * Math.PI) / maxCards;
    const CardHeight = divHeight / 1.1;
    const CardWidth = CardHeight / 1.556;
    const CarouselDiameter =
        1.7 * (CardHeight + (maxCards * CardWidth) / (2 * Math.PI));
    const divWidthAngle =
        (2 * Math.asin(divWidth / CarouselDiameter) * 180) / Math.PI;
    const lastCardAngle = (rotInc * Math.floor(totalCards / 2) * 180) / Math.PI;
    const maxRotation = Math.abs(divWidthAngle / 2 - lastCardAngle - 5);
    const minRotation = -Math.abs(divWidthAngle / 2 - lastCardAngle - 5);

    return {
        rotInc,
        CardHeight,
        CardWidth,
        CarouselDiameter,
        maxRotation,
        minRotation,
    };
};

export function CardCarousel({cards, divHeight, divWidth, reaction}: CarouselProps) {
    const {openCard} = useShowCard();
    const {isYourTurn, reactToBang, reactToIndians, reactToDuel} = useGame();
    const isPanning = useRef(false);
    const rotation = useSpring(0, {stiffness: 100, damping: 12});
    const rotationRef = useRef(0);


    const {
        rotInc,
        CardHeight,
        CardWidth,
        CarouselDiameter,
        maxRotation,
        minRotation,
    } = useCarouselCalculations(cards.length, divHeight, divWidth, 44);

    useEffect(() => {
        rotation.set(0);
    }, [rotation]);


    const calculateTransformations = useCallback(
        (index: number): Transformation => {
            const adjustedIndex = index - Math.floor(cards.length / 2);
            const translateX = (CarouselDiameter / 2 - CardHeight / 1.9) * Math.cos(rotInc * adjustedIndex - Math.PI / 2);
            const translateY = (CarouselDiameter / 2 - CardHeight / 1.9) * Math.sin(rotInc * adjustedIndex - Math.PI / 2);
            const rotationRad = rotInc * adjustedIndex;
            return {translateX, translateY, rotationRad};
        },
        [CarouselDiameter, CardHeight, rotInc, cards.length],
    );

    const onPan = useCallback(
        (event: PointerEvent, info: PanInfo) => {
            isPanning.current = true;
            const newRotation = rotationRef.current + info.offset.x / 10;
            const clampedRotation =
                newRotation < 0
                    ? Math.max(newRotation, minRotation)
                    : Math.min(newRotation, maxRotation);
            rotation.set(clampedRotation * 0.95);
        },
        [minRotation, maxRotation, rotation],
    );

    const possibleReaction = (card: CardType, reaction: string | null): boolean => {
        if (!reaction) return false; // No reaction, no grayscale
        if ((reaction === 'indiani' || reaction === 'duello') && card.name === 'bang') return false;
        if ((reaction === 'bang' || reaction === 'gatling') && card.name === 'mancato') return false;
        return true; // Apply grayscale in all other cases
    };

    // New function to handle card actions
    const handleCardAction = useCallback((card: CardType) => {
        if (!isPanning.current && card.name !== 'hidden') {

            switch (reaction) {
                case 'bang':
                case 'gatling':
                    // Action for 'bang' or 'gatling' reaction
                    if (card.name === 'mancato') {
                        reactToBang(card);
                    }
                    break;
                case 'indiani':
                    // Action for 'indiani' reaction
                    if (card.name === 'bang') {
                        reactToIndians(card);
                    }
                    break;
                case 'duello':
                    // Action for 'duello' reaction
                    if (card.name === 'bang') {
                        reactToDuel(card);
                    }
                    break;
                // Add more cases for different reactions
                default:
                    if (isYourTurn()) {
                        openCard(card);
                    }
            }
        }
    }, [isYourTurn, openCard, reaction]);


    const initialTransform: Transformation = calculateTransformations(cards.length / 2)
    const [prevTransforms, setPrevTransforms] = useState<Transformation[]>(
        Array.from({length: cards.length}, () => initialTransform)
    );

    return (
        <div className="shrink-0 ">
            <motion.div
                className="circular"
                onPan={onPan}
                onPanEnd={() => {
                    rotationRef.current = rotation.get();
                    isPanning.current = false;
                }}
                style={{
                    width: `${CarouselDiameter}px`,
                    rotate: rotation,
                    clipPath: `circle(${CarouselDiameter / 2}px at center)`,
                }}
            >
                {cards.map((card, index) => {
                    const nowTransform = calculateTransformations(index);
                    const prevTransform = prevTransforms[index] || {translateX: 0, translateY: 0, rotationRad: 0};
                    const grayscale = possibleReaction(card, reaction);

                    return (
                        <motion.div
                            key={card.id}
                            className="card"
                            onTap={() => handleCardAction(card)}
                            initial={{transform: `translate(${prevTransform.translateX}px, ${prevTransform.translateY}px) rotate(${prevTransform.rotationRad}rad)`}}
                            animate={{transform: `translate(${nowTransform.translateX}px, ${nowTransform.translateY}px) rotate(${nowTransform.rotationRad}rad)`}}
                            transition={{duration: 0.32}}
                            onAnimationComplete={() => {
                                setPrevTransforms(prev => {
                                    // Create a copy of the previous array
                                    const updatedTransforms = [...prev];

                                    // Update the specific index with nowTransform
                                    updatedTransforms[index] = nowTransform;

                                    // Return the updated array
                                    return updatedTransforms;
                                });
                            }}
                            style={{
                                width: `${CardWidth}px`,
                                height: `${CardHeight}px`,
                                filter: grayscale ? 'grayscale(100%)' : 'none'
                            }}
                            whileHover={{
                                transform: `translate(${nowTransform.translateX}px, ${nowTransform.translateY}px) rotate(${nowTransform.rotationRad}rad) scale(1.05)`,
                                zIndex: 100
                            }}
                        >
                            <CardComponent key={card.id} cardName={card.name}/>
                        </motion.div>
                    );
                })}
            </motion.div>
        </div>
    );
}

export default CardCarousel;
