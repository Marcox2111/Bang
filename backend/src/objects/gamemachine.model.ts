import {createMachine} from "xstate";

export const machine = createMachine(
    {
        id: "game",
        initial: "Lobby",
        states: {
            Lobby: {
                on: {
                    START_GAME: {
                        target: "AssigningRoles",
                    },
                },
            },
            AssigningRoles: {
                on: {
                    ROLES_ASSIGNED: {
                        target: "DrawingCards",
                    },
                },
            },
            DrawingCards: {
                on: {
                    CARDS_DISTRIBUTED: {
                        target: "PlayingTurn",
                    },
                },
            },
            PlayingTurn: {
                initial: "DrawingPhase",
                states: {
                    DrawingPhase: {
                        initial: "PreDrawing",
                        states: {
                            PreDrawing: {
                                on: {
                                    PRE_DRAWING_RESOLVED: {
                                        target: "Drawing",
                                    },
                                },
                            },
                            Drawing: {
                                on: {
                                    CARDS_DRAWN: {
                                        target: "#game.PlayingTurn.MainPhase.PreAction",
                                    },
                                },
                            },
                        },
                    },
                    MainPhase: {
                        initial: "PreAction",
                        states: {
                            PreAction: {
                                on: {
                                    PRE_ACTION_RESOLVED: {
                                        target: "Action",
                                    },
                                },
                            },
                            Action: {
                                initial: "PlayingCard",
                                states: {
                                    PlayingCard: {
                                        on: {
                                            CARD_PLAYED: [
                                                {
                                                    target: "Saloon",
                                                    cond: "isSaloonCard",
                                                },
                                                {
                                                    target: "BangEffect",
                                                    cond: "isBangEffect",
                                                },
                                                {
                                                    target: "Duel",
                                                    cond: "isDuelCard",
                                                },
                                                {
                                                    target: "Saloon",
                                                },
                                            ],
                                        },
                                    },
                                    Saloon: {},
                                    BangEffect: {
                                        initial: "TargetSelection",
                                        states: {
                                            "TargetSelection": {
                                                on: {
                                                    "Event 1": [
                                                        {
                                                            target: "New state 1",
                                                            cond: "isSingleTarget",
                                                        },
                                                        {
                                                            target: "New state 1",
                                                            cond: "isOtherTarget",
                                                        },
                                                    ],
                                                },
                                            },
                                            "New state 1": {},
                                        },
                                    },
                                    Duel: {
                                        initial: "ChallengedResponse",
                                        states: {
                                            ChallengedResponse: {
                                                on: {
                                                    BANG_PLAYED: {
                                                        target: "ChallengerResponse",
                                                    },
                                                    NO_BANGS: {
                                                        target: "DUEL_RESOLUTION",
                                                    },
                                                },
                                            },
                                            ChallengerResponse: {
                                                on: {
                                                    BANG_PLAYED: {
                                                        target: "ChallengedResponse",
                                                    },
                                                    NO_BANGS: {
                                                        target: "DUEL_RESOLUTION",
                                                    },
                                                },
                                            },
                                            DUEL_RESOLUTION: {
                                                on: {
                                                    DUEL_RESOLVED: {
                                                        target: "#game.PlayingTurn.MainPhase.Action.CheckGameOver",
                                                    },
                                                },
                                            },
                                        },
                                    },
                                    CheckGameOver: {
                                        invoke: {
                                            src: "checkGaveOver",
                                            id: "gameover",
                                            onDone: [
                                                {
                                                    target: "#game.PlayingTurn.GameOver",
                                                },
                                            ],
                                            onError: [
                                                {
                                                    target: "PlayingCard",
                                                },
                                            ],
                                        },
                                    },
                                },
                            },
                        },
                    },
                    GameOver: {},
                },
            },
        },
        schema: {
            events: {} as
                | { type: "START_GAME" }
                | { type: "ROLES_ASSIGNED" }
                | { type: "CARDS_DISTRIBUTED" }
                | { type: "PRE_DRAWING_RESOLVED" }
                | { type: "PRE_ACTION_RESOLVED" }
                | { type: "" }
                | { type: "CARDS_DRAWN" }
                | { type: "CARD_PLAYED" }
                | { type: "BANG_PLAYED" }
                | { type: "NO_BANGS" }
                | { type: "DUEL_RESOLVED" }
                | { type: "Event 1" },
        },
        predictableActionArguments: true,
        preserveActionOrder: true,
    },
    {
        actions: {},
        services: {
            checkGaveOver: createMachine({
                /* ... */
            }),
        },
        guards: {
            isSaloonCard: (context, event) => false,

            isBangEffect: (context, event) => false,

            isDuelCard: (context, event) => false,

            isSingleTarget: (context, event) => false,

            isOtherTarget: (context, event) => false,
        },
        delays: {},
    },
);