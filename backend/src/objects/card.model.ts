import { Player } from "./player.model";
import { v4 as uuidv4 } from 'uuid';

type TargetConfig = 'self' | 'single' | 'any' | 'one' | 'others' | 'all';

const cardConfigs = {
    "bang": { effect: bangEffect, target: 'single' },
    "birra": { effect: beerEffect, target: 'self' },
    "saloon": { effect: beerEffect, target: 'all' },
    "gatling": { effect: bangEffect, target: 'others' },
    "panico": { effect: stealEffect, target: 'one' }
};

export class Card {
    id: string;
    name: string;
    effect: (player: Player, targetConfig: TargetConfig, target?: Player | Player[]) => void;
    target: TargetConfig;

    constructor(name: string) {
        this.id = uuidv4();
        this.name = name;
        this.effect = cardConfigs[name].effect;
        this.target = cardConfigs[name].target;
    }

    play(player: Player, target?: Player | Player[]) {
        this.effect(player, this.target, target);
    }
}

function bangEffect(player: Player, targetConfig: TargetConfig, target: Player | Player[]) {
    switch (targetConfig) {
        case 'single':
            if (target instanceof Player) {
                target.takeDamage(1);
            }
            break;
        case 'others':
            if (Array.isArray(target)) {
                target.forEach(t => t.takeDamage(1));
            }
            break;
        default:
            console.log("Invalid target configuration for bangEffect!");
            break;
    }
}

function beerEffect(player: Player, targetConfig: TargetConfig, target: Player | Player[]) {
    switch (targetConfig) {
        case 'self':
            player.takeHeal(1);
            break;
        case 'all':
            if (Array.isArray(target)) {
                target.forEach(t => t.takeHeal(1));
            }
            break;
        default:
            console.log("Invalid target configuration for beerEffect!");
            break;
    }
}

function stealEffect(player: Player, targetConfig: TargetConfig, target: Player | Player[]) {
    // Implement your steal effect logic here
    console.log("stealEffect is called.");
}
