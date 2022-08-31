exports.Events = {
    MOVEMENT_NEW: "movementAdd",
    MOVEMENT_ADD: "movementAdd",
    MOVEMENT_UPDATE: "movementUpdate",
    MOVEMENT_CANCEL: "movementCancelled",
    SERVER_SHUTDOWN: "serverShutdown",
    CONNECTED: "connnected",
    CHAT_MESSAGE: "chatMessage",
}

exports.Kingdom = {
    Classic: 0,
    Icecream: 2,
    Dessert: 1,
    Volcano: 3,
    Island: 4,
    Faction: 10
}

exports.Movement = {
    Attack: 0,
    Travel: 2,
    Spy: 3,
    Market: 4,
    Conquer: 5,
}

exports.WorldmapArea = {
    Empty: 0,
    MainCastle: 1,
    Dungeon: 2,
    Capital: 3,
    Outpost: 4,
    VillageMapobject: 10,
    BossDungeon: 11,
    KingdomCastle: 12,
    AlienInvasion: 21,
    Metropol: 22,
    Kingstower: 23,
    ResourceIsle: 24,
    DungeonIsle: 25,
    Monument: 26,
    NomadInvasion: 27,
    Dynamic: 31,
    NomadKhanInvasion: 35,
}