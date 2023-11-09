import {filter, Schema, type} from "@colyseus/schema";
import {v4 as uuidv4} from 'uuid';
import {Client} from "@colyseus/core";

export class Card extends Schema {
    @type("string") owner: string;
    @type("string") id: string;
    @type("boolean") discarded: boolean = false;

    @filter(function (
        this: Card, // the instance of the class `@filter` has been defined (instance of `Card`)
        client: Client, // the Room's `client` instance which this data is going to be filtered to
        value: Card['name'], // the value of the field to be filtered. (value of `number` field)
        root: Schema // the root state Schema instance
    ) {
        return this.discarded || this.owner === client.sessionId;
    })
    @type("string") name: string;

    constructor(name: string, owner: string) {
        super();
        this.id = uuidv4();
        this.name = name;
        this.owner = owner;
    }

}

