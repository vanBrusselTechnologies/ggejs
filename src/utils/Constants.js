exports.Events = {
    MOVEMENT_NEW: "movementAdd",
    MOVEMENT_ADD: "movementAdd",
    MOVEMENT_UPDATE: "movementUpdate",
    MOVEMENT_CANCEL: "movementCancelled",
    SERVER_SHUTDOWN: "serverShutdown",
    SERVER_SHUTDOWN_OVER: "serverShutdownOver",
    CONNECTED: "connected",
    CHAT_MESSAGE: "chatMessage",
    MAIL_MESSAGE_NEW: "mailMessageAdd",
    MAIL_MESSAGE_ADD: "mailMessageAdd",
    MAIL_MESSAGE_REMOVE: "mailMessageRemove"
}

exports.Kingdom = {
    Classic: 0, Icecream: 2, Desert: 1, Volcano: 3, Island: 4, Faction: 10
}

exports.MovementType = {
    Attack: 0, Travel: 2, Spy: 3, Market: 4, Conquer: 5,
}

exports.WorldmapArea = {
    Empty: 0,
    MainCastle: 1,
    Dungeon: 2,
    Capital: 3,
    Outpost: 4,
    Village: 10,
    BossDungeon: 11,
    KingdomCastle: 12,
    EventDungeon: 13,
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

exports.AllianceMemberOnlineState = {
    Online: 0,
    InLast12Hour: 1,
    InLast48Hour: 2,
    InLast7Days: 3,
    LongAgo: 4,
    Green: 0,
    Yellow: 1,
    Orange: 2,
    Red: 3,
    Black: 4,
}

exports.AllianceRank = {
    Leader: 0,
    Coleader: 1,
    Marshal: 2,
    Treasurer: 3,
    Diplomat: 4,
    Recruiter: 5,
    General: 6,
    Sergeant: 7,
    Member: 8,
    Applicant: 9,
}

exports.HorseType = {
    Coin: 0, Ruby_1: 1, Ruby_2: 2, Feather: 3,
}

exports.SpyType = {
    Military: 0, Eco: 1, Sabotage: 2,
}

exports.ServerType = {
    NormalServer: 1, TempServer: 2, AllianceBattleGround: 3
}

exports.MessageType = {
    System: 0,
    UserIn: 1,
    UserOut: 2,
    SpyPlayer: 3,
    SpyNPC: 4,
    ConquerableArea: 5,
    BattleLog: 6,
    AllianceRequest: 20,
    AllianceWar: 21,
    AllianceNewsletter: 22,
    AllianceBookmark: 23,
    FriendInviteTeaser: 30,
    FriendJoinTheGame: 31,
    FindAFriend: 32,
    FriendReachedALevel: 33,
    FriendBoughtRubies: 34,
    XFriendsBoughtRubies: 35,
    FriendInvite: 36,
    NewFriendship: 37,
    LowlevelUnderworld: 40,
    UserSurvey: 50,
    AttackCancelled: 67,
    SpyCancelled: 68,
    StarveInfo: 70,
    BuildingDisabled: 71,
    MarketCarriageArrived: 75,
    Abo: 80,
    PaymentDoppler: 81,
    Rebuy: 90,
    SpecialEvent: 95,
    StarveVillageLost: 96,
    TournamentOver: 97,
    IslandKingdomTitle: 98,
    IslandKingdomReward: 99,
    StarveIsleResourceLost: 100,
    RuinInfo: 102,
    PlayerGift: 103,
    Subscription: 104,
    ThankyYouPackage: 117,
    DowntimeStatus: 118,
    HighscoreBonus: 122,
    EventAnnouncement: 123,
    Popup: 124,
    PatchNotes: 125,
    PrivateOffer: 126,
    TextId: 127
}

exports.EquipmentRarity = {
    Unique: 0,
    Red: 0,
    Common: 1,
    Gray: 1,
    Rare: 2,
    Green: 2,
    Epic: 3,
    Purple: 3,
    Legendary: 4,
    Orange: 4,
    Relic: 5,
    Blue: 5,
}
