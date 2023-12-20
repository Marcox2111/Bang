import {filter, Schema, type} from "@colyseus/schema";
import {v4 as uuidv4} from 'uuid';
import {Client} from "@colyseus/core";

export class Card extends Schema {
    owner: string;
    @type("string") id: string;
    discarded: boolean = false;

    @filter(function (
        this: Card,
        client: Client,
        value: Card['name'],
        root: Schema
    ) {
    return this.discarded || this.owner === client.sessionId || this.owner === "Emporio";
    })
    @type("string") name: string;

    @filter(function (
        this: Card,
        client: Client,
        value: Card['target'],
        root: Schema
    ) {
        // Implement your filtering logic for the target here.
        // For example, you may only want to reveal the target to the owner of the card.
        return this.discarded || this.owner === client.sessionId || this.owner === "Emporio";
    })
    @type("string") target: string;

    constructor(name: string, owner: string) {
        super();
        this.id = uuidv4();
        this.name = name;
        this.owner = owner;
        this.determineTarget(name); // Set the target based on the name
    }

    determineTarget(name: string) {
        // Define logic to set the target based on the card name
        switch (name) {
            case 'bang':
                this.target = 'single'; // Target is one and has to be in range
                break;
            case 'catbalou':
            case 'duello':
                this.target = 'any'; // Target is any single player at any range
                break;
            case 'saloon':
            case 'emporio':
                this.target = 'all'; // Target is all players
                break;
            case 'gatling':
            case 'indiani':
                this.target = 'others'; // Target is all other players
                break;
            case 'panico':
                this.target = 'one'; // Target is single and the distance is always one
                break;
            case 'birra':
            case 'diligenza':
            case 'wellsfargo':
                this.target = 'self'; // Target is the player who played the card
                break;
            default:
                this.target = 'unknown'; // Default or unknown card name
                break;
        }
    }
}
