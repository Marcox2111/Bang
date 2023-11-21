import React, {useState} from "react";
import {motion} from "framer-motion";
import {useGame} from "../context/Context";
import {CardType, PlayerType} from "../../../shared/types";

type TargetMapProps = {
    card: CardType;
    onCloseCard: () => void;
};

const ACTIVE_COLOR = {
    background: "rgb(59, 130, 246)",
    text: "rgb(255, 255, 255)"
};

const INACTIVE_COLOR = {
    background: "rgb(229, 231, 235)",
    text: "rgb(31, 41, 55)"
};

const DISABLED_COLOR = {
    background: "rgb(209, 213, 219)",
    text: "rgb(255, 255, 255)"
};


export function TargetMap({card, onCloseCard}: TargetMapProps) {
    const {players, clientPlayer, playCard} = useGame();
    const playerIndex = players.indexOf(clientPlayer);
    const [selectedTarget, setSelectedTarget] = useState<PlayerType | null>(null);

    const circleDiameter = 500;
    const playerDiameter = circleDiameter / 5;
    const rotInc = 2 * Math.PI / players.length;
    const isUseButtonDisabled = ['single', 'any', 'one'].includes(card.target) && !selectedTarget;

    function getPlayerClass(player: PlayerType, adjustedIndex: number): string {
        switch (card.target) {
            case 'all':
                return ACTIVE_COLOR.background;
            case 'others':
                return adjustedIndex === 0 ? INACTIVE_COLOR.background : ACTIVE_COLOR.background;
            case 'self':
                return adjustedIndex === 0 ? ACTIVE_COLOR.background : INACTIVE_COLOR.background;
            case 'single':
            case 'any':
            case 'one':
                if (adjustedIndex === 0) return INACTIVE_COLOR.background;
                return player === selectedTarget ? ACTIVE_COLOR.background : INACTIVE_COLOR.background;
            default:
                return INACTIVE_COLOR.background;
        }
    }

    function selectTarget(player: PlayerType) {
        if (['single', 'any', 'one'].includes(card.target) && player !== clientPlayer) {
            setSelectedTarget(selectedTarget === player ? null : player);
        }
    }


    function handlePlayCard() {
        let target: PlayerType[] = [];

        switch (card.target) {
            case 'self':
                target = [clientPlayer];
                break;
            case 'others':
                target = players.filter(p => p !== clientPlayer);
                break;
            case 'all':
                target = [...players]; // Copy of the players array
                break;
            case 'single':
            case 'any':
            case 'one':
                if (selectedTarget) {
                    target = [selectedTarget];
                }
                break;
            default:
                break;
        }
        playCard(card, target);
        onCloseCard();
    }


    const PlayerIcon = ({player, index}: { player: PlayerType; index: number }) => {
        const adjustedIndex = (index - playerIndex + players.length) % players.length;
        const translateX = (circleDiameter / 2 - playerDiameter / 1.9) * Math.sin(rotInc * adjustedIndex);
        const translateY = (circleDiameter / 2 - playerDiameter / 1.9) * Math.cos(rotInc * adjustedIndex);

        return (
            <motion.div
                className={`card flex justify-center items-center rounded-full`}
                key={index}
                onClick={e => {
                    e.stopPropagation();
                    selectTarget(player);
                }}
                transition={{duration: 0.32}}
                style={{
                    width: playerDiameter,
                    height: playerDiameter,
                }}
                initial={{
                    transform: `translate(${translateX}px, ${translateY}px)`,
                    backgroundColor: `${INACTIVE_COLOR.background}`
                }}
                animate={{
                    transform: `translate(${translateX}px, ${translateY}px)`,
                    backgroundColor: `${getPlayerClass(player, adjustedIndex)}`
                }}
                whileHover={{transform: `translate(${translateX}px, ${translateY}px) scale(1.10)`}}
                whileTap={{transform: `translate(${translateX}px, ${translateY}px) scale(0.95)`}}
            >
                {player.name}
            </motion.div>
        );
    };

    return (
        <motion.div
            className="circular bg-white"
            style={{
                width: circleDiameter,
                height: circleDiameter,
            }}
        >
            {players.map((player, index) => (
                <PlayerIcon player={player} index={index} key={index}/>
            ))}
            <motion.div
                className={`card flex justify-center items-center rounded-full`}
                onClick={e => {
                    e.stopPropagation();
                    if (isUseButtonDisabled) return;
                    else handlePlayCard();
                }}
                style={{
                    width: playerDiameter,
                    height: playerDiameter,
                }}
                whileHover={{scale: 1.05}}
                whileTap={{scale: 0.95}}
                animate={{backgroundColor: `${isUseButtonDisabled ? DISABLED_COLOR.background : ACTIVE_COLOR.background}`}}
                initial={{scale: 1}}
            >
                Use
            </motion.div>
        </motion.div>
    );
}