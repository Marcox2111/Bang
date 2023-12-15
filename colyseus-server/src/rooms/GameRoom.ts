// GameRoom.ts
import {Room, Client} from "@colyseus/core";
import {RoomState} from "./schema/RoomState";
import {machine} from "./StateMachine"
import {interpret} from "xstate";
import {Player} from "./schema/Player";
import {CardType, PlayerType} from "../../../shared/types";
import {Card} from "./schema/Card";

interface JoinOptions {
    name: string;
}

export class GameRoom extends Room<RoomState> {
    maxClients = 7;
    gameService: any;
    currentPlayerIndex: number;
    playersAwaitingReaction: Set<string> = new Set();
    duelInfo: { initiator: string; responder: string } | null = null;

    onCreate(options: any) {
        // Initialization code
        this.initializeGameState();
        this.registerMessages();
    }

    initializeGameState() {
        this.setState(new RoomState());
        this.gameService = interpret(machine.withContext({room: this}))
            .onTransition(state => console.log('Transitioned to state:', state.value));
        this.gameService.start();
    }

    registerMessages() {
        this.onMessage("start", (client) => this.handleStartMessage(client));
        this.onMessage("*", (client, type, value) => this.handleGenericMessage(client, type, value));
    }

    onJoin(client: Client, options: JoinOptions) {
        const isFirstPlayer = this.clients.length === 1; // If this is the first client, they are the host

        const player = this.state.createPlayer(client.sessionId, options.name);
        if (isFirstPlayer) {
            player.isHost = true; // Set the host flag for the first player
        }
        console.log(client.sessionId, "joined!", isFirstPlayer ? "as host" : "");
    }

    onLeave(client: Client, consented: boolean) {
        this.state.removePlayer(client.sessionId);
        console.log(client.sessionId, "left!");
    }

    onDispose() {
        console.log("room", this.roomId, "disposing...");
    }

    handleStartMessage(client: Client) {
        const player = this.state.players.find(p => p.id === client.sessionId);

        if (!player) {
            console.log("ERROR: message coming from invalid player.")
            return;
        }
        if (!player.isHost) {
            console.log("ERROR: message coming from a nonHost player");
            return;
        }
        console.log("start")
        this.gameService.send('START_GAME')
    }

    handleGenericMessage(client: Client, type: string | number, value: any) {
        const player = this.findPlayerBySessionId(client.sessionId);
        console.log(player.id)
        console.log(type)
        if (!this.isValidPlayer(player)) return;
        console.log("valid")
        // Now that we have the player, we can handle the message
        switch (type) {
            case "discardCard":
                const cardtodiscard: CardType = value;
                this.discardCard(player, cardtodiscard)
                break;
            case "passTurn":
                this.gameService.send("PASS_TURN")
                break;
            case "playCard":
                const {card: cardtoplay, targets}: { card: CardType, targets: PlayerType[] } = value;
                this.playCard(player, cardtoplay, targets)
                break;
            case "missedReaction":
                const missedCard: CardType = value;
                this.handleMissedReaction(player, missedCard)
                break;
            case "bangReaction":
                const bangCard: CardType = value;
                this.handleBangReaction(player, bangCard);
                break;
            case "duelReaction":
                const duelCard: CardType = value;
                this.handleDuelReaction(player, duelCard)
                break;
            case "hello":
                console.log("test", type)
                break;
            // Add more cases as needed for other message types
            default:
                console.warn("Received unrecognized message type:", type);
        }
    }

    findPlayerBySessionId(sessionId: string) {
        return this.state.players.find(p => p.id === sessionId);
    }

    findPlayerByTurn() {
        return this.state.players.find(p => p.turn === true);
    }

    isValidPlayer(player: Player) {
        if (!player) {
            console.log("ERROR: message coming from invalid player.");
            return false;
        }
        return player.alive && (player.turn || this.playersAwaitingReaction.has(player.id));
    }

    assignRolesToPlayers() {
        const numPlayers = this.state.players.length;
        let roles: string[];

        switch (numPlayers) {
            case 1:
                roles = ["sceriffo"];
                break;
            case 2:
                roles = ["sceriffo", "rinnegato"];
                break;
            case 3:
                roles = ["sceriffo", "rinnegato", "fuorilegge"];
                break;
            case 4:
                roles = ["sceriffo", "rinnegato", "fuorilegge", "fuorilegge"];
                break;
            case 5:
                roles = ["sceriffo", "rinnegato", "fuorilegge", "fuorilegge", "vice"];
                break;
            case 6:
                roles = ["sceriffo", "rinnegato", "fuorilegge", "fuorilegge", "fuorilegge", "vice"];
                break;
            case 7:
                roles = [
                    "sceriffo",
                    "rinnegato",
                    "fuorilegge",
                    "fuorilegge",
                    "fuorilegge",
                    "vice",
                    "vice",
                ];
                break;
            default:
                throw new Error("Invalid number of players for role assignment");

        }

        // Shuffle roles
        for (let i = roles.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [roles[i], roles[j]] = [roles[j], roles[i]];
        }

        // Assign shuffled roles to players
        this.state.players.forEach((player, index) => {
            player.role = roles[index];
            if (roles[index] === "sceriffo") {
                player.turn = true;
                this.currentPlayerIndex = index;
            }
        });
        this.gameService.send('ROLES_ASSIGNED');
    }

    distributeCardsToPlayer() {
        this.state.players.forEach((player) => {
            const nCards = player.hp + (player.role === "sceriffo" ? 1 : 0);
            this.drawCards(player, nCards);
        });
        this.broadcast('gameStarted')
        this.gameService.send('CARDS_DISTRIBUTED');
    }

    drawCards(player: Player, nCards: number) {
        const cards = this.state.deck.deal(nCards);
        cards.forEach((card) => card.owner = player.id)
        player.addCards(cards);
    }

    discardCard(player: Player, card: CardType) {
        const discardedCard: Card = player.removeCard(card.id)
        discardedCard.owner = "discardDeck"
        discardedCard.discarded = true
    }

    turnDraw() {
        this.drawCards(this.state.players[this.currentPlayerIndex], 2)
        this.gameService.send('RESOLVE_FIRST_DRAW')
    }

    canPlayerPassTurn(): boolean {
        // check if it has more Card than HP
        return this.state.players[this.currentPlayerIndex].cards.length <= this.state.players[this.currentPlayerIndex].hp
    }

    playCard(player: Player, card: CardType, targets: PlayerType[]) {
        switch (card.name) {
            case 'bang':
            case 'gatling':
                // Pass the player and the card to handleBangEffect
                this.handleBangEffect(player, targets, card);
                break;
            case 'birra':
            case 'saloon':
                // Assuming similar changes for other effect handlers if needed
                this.handleBeerEffect(targets);
                break;
            case 'indiani':
                // Assuming similar changes for other effect handlers if needed
                this.handleIndianiEffect(player, targets, card);
                break;
            case 'duello':
                // Assuming similar changes for other effect handlers if needed
                this.handleDuelloEffect(player, targets, card);
                break;
            //... other card types
            default:
                console.warn("Unknown card type:", card.name);
        }

        switch (card.name) {
            case 'bang':
                this.BroadCastToAll("Log", `${player.name} played ${card.name} on ${targets.map(t => t.name).join(", ")}`);
                break;
            case 'duello':
                this.BroadCastToAll("Log", `${player.name} played ${card.name} on ${targets.map(t => t.name).join(", ")}`);
                break;
            case 'birra':
            case 'indiani':
            case 'saloon':
            case 'gatling':
                this.BroadCastToAll("Log", `${player.name} played ${card.name}`);
                break;
        }

        //DISCARD CARD AFTER PLAYING IT
        this.discardCard(player, card);
    }


// Modify sendToPlayer to include the additional data in the message
    sendToPlayer(playerId: string, messageType: string, data: any = null) {
        const client = this.clients.find(c => c.sessionId === playerId);
        if (client) {
            client.send(messageType, data);
        } else {
            console.warn("Client not found for player ID:", playerId);
        }
    }

    BroadCastToAll(messageType: string, data: any = null) {
        this.clients.forEach((client) => {
            client.send(messageType, data);
        });
    }

    startReactionTimer(targetPlayer: Player) {
        // You can use setTimeout to set a timer
        // When the timer expires, you can send a message to the room to indicate that the timer expired
        // The room will then transition to the next state
        setTimeout(() => {
            if (this.playersAwaitingReaction.has(targetPlayer.id))
                this.handleMissedReaction(targetPlayer, null);
        }, 10000);
    }

    reactionMessageSenders(actorPlayer: Player, card: CardType, targets: PlayerType[]) {
        // Send message to all targets
        targets.forEach((target) => {
            const targetPlayer = this.state.players.find((p) => p.id === target.id);
            if (targetPlayer) {
                this.playersAwaitingReaction.add(targetPlayer.id);
                this.sendToPlayer(targetPlayer.id, "reactToCard", {actorName: actorPlayer.name, cardName: card.name});
                // this.startReactionTimer(targetPlayer)
            }
        });
    }

    handleDuelloEffect(actorPlayer: Player, targets: PlayerType[], card: CardType) {
        this.duelInfo = { initiator: actorPlayer.id, responder: targets[0].id };


        this.reactionMessageSenders(actorPlayer, card, targets)

        // Start WaitForReaction state if there are players who need to react
        if (this.playersAwaitingReaction.size > 0) {
            this.gameService.send('DUELLO_PLAYED');
        }
    }

    handleBangEffect(actorPlayer: Player, targets: PlayerType[], card: CardType,) {

        this.reactionMessageSenders(actorPlayer, card, targets)

        // Start WaitForReaction state if there are players who need to react
        if (this.playersAwaitingReaction.size > 0) {
            this.gameService.send('BANG_PLAYED');
        }
    }

    handleIndianiEffect(actorPlayer: Player, targets: PlayerType[], card: CardType) {

        this.reactionMessageSenders(actorPlayer, card, targets)

        // Start WaitForReaction state if there are players who need to react
        if (this.playersAwaitingReaction.size > 0) {
            this.gameService.send('INDIANI_PLAYED');
        }
    }


    handleMissedReaction(player: Player, missedCard: CardType | null) {
        // player is the player who reacted
        if (!missedCard || missedCard.name != "mancato") {
            player.hp--;
            this.BroadCastToAll("Log", `${player.name} lost 1 HP`);
        } else {
            this.discardCard(player, missedCard);
        }
        this.sendToPlayer(player.id, "cardReacted");
        // Remove player from awaiting reaction set
        this.playersAwaitingReaction.delete(player.id);

        // Check if all reactions are received
        if (this.playersAwaitingReaction.size === 0) {
            // All players have reacted, move to the next state
            const turnPlayer = this.findPlayerByTurn();
            this.sendToPlayer(turnPlayer.id, "EveryoneReacted");
            this.gameService.send('MISSED_REACTED');
        }
    }

    handleBangReaction(player: Player, bangCard: CardType | null) {
        //player is the player who reacted
        if (!bangCard || bangCard.name != "bang") {
            player.hp--;
            this.BroadCastToAll("Log", `${player.name} lost 1 HP`);
        } else {
            this.discardCard(player, bangCard);
        }
        this.sendToPlayer(player.id, "cardReacted");
        // Remove player from awaiting reaction set
        this.playersAwaitingReaction.delete(player.id);

        // Check if all reactions are received
        if (this.playersAwaitingReaction.size === 0) {
            // All players have reacted, move to the next state
            const turnPlayer = this.findPlayerByTurn();
            this.sendToPlayer(turnPlayer.id, "EveryoneReacted");
            this.gameService.send('BANG_REACTED');
        }
    }

    handleDuelReaction(player: Player, duelCard: CardType | null) {

        if (duelCard && duelCard.name === "bang") {
            this.discardCard(player, duelCard);

            // Swap the roles in the duel
            const newInitiatorId = this.duelInfo.responder;
            const newResponderId = this.duelInfo.initiator;
            this.duelInfo = { initiator: newInitiatorId, responder: newResponderId };

            // Find the new initiator (previous responder) player object
            const newInitiatorPlayer = this.state.players.find(p => p.id === newInitiatorId);

            if (newInitiatorPlayer) {
                // Prepare the new responder data (dummy player object, only id is needed)
                const newResponderPlayer: PlayerType = { id: newResponderId, name: "responder", hp: 0, cards: [], role: "", turn: false, range: 0, isHost: false };
                const dummyCard: CardType = { id: "dummy", name: "duello", target: null };
                // Send a message to the new initiator to respond to the duel
                this.reactionMessageSenders(newInitiatorPlayer, dummyCard, [newResponderPlayer]);
            }

            this.gameService.send('DUELLO_REACTED');
        } else {
            // Duel ends, handle the consequence
            player.hp--;
            this.BroadCastToAll("Log", `${player.name} lost 1 HP in a duel`);
            this.duelInfo = null; // Reset duelInfo after the duel ends
            this.gameService.send('NO_DUELLO_REACTED');
        }

        this.sendToPlayer(player.id, "cardReacted");
        // Remove player from awaiting reaction set
        this.playersAwaitingReaction.delete(player.id);

        // Check if all reactions are received
        if (this.playersAwaitingReaction.size === 0) {
            // All players have reacted, move to the next state
            const turnPlayer = this.findPlayerByTurn();
            this.sendToPlayer(turnPlayer.id, "EveryoneReacted");
        }
    }

    handleBeerEffect(targets: PlayerType[]) {
        targets.forEach((target) => {
            const targetPlayer = this.state.players.find((p) => p.id === target.id);
            if (targetPlayer) {
                targetPlayer.hp++;
            }
        });
        const turnPlayer = this.findPlayerByTurn();
        this.sendToPlayer(turnPlayer.id, "EveryoneReacted");
        this.gameService.send("BEER_PLAYED");
    }

    nextPlayer() {
        this.state.players[this.currentPlayerIndex].turn = false;
        this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.state.players.length;
        this.state.players[this.currentPlayerIndex].turn = true;
        this.gameService.send('RESOLVE_ENDPHASE')
    }


}
