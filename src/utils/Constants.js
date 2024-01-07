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
    MAIL_MESSAGE_REMOVE: "mailMessageRemove",
    PRIME_TIME: "primeTime"
}

exports.Kingdom = {
    Classic: 0, Icecream: 2, Desert: 1, Volcano: 3, Island: 4, Faction: 10
}

exports.MovementType = {
    Attack: 0,
    Defence: 1,
    Travel: 2,
    Spy: 3,
    Market: 4,
    Conquer: 5,
    TreasureHunt: 6,
    ShadowAttack: 7,
    ShadowTravel: 8,
    KingdomGoodTransfer: 9,
    KingdomUnitTransfer: 10,
    NPCAttack: 11,
    SeasonGoodsTravel: 12,
    UnitTravel: 13,
    PlagueMonk: 14,
    ConquerFaction: 15,
    AlienAttack: 17,
    FactionAttack: 18,
    AllianceCampTauntAttack: 20,
    AllianceCampAttack: 21,
    ShapeshifterCampAttack: 22,
    CollectorAttack: 23,
    TempServerCollectorAttack: 24,
    TempServerRankswapAttack: 25,
    DaimyoTownshipDefence: 26,
    DaimyoTauntAttack: 27,
    DaimyoCastleAttack: 28,
    AllianceBattleGroundCollectorAttack: 29,
    ChargeCampAttack: 30,
    TempServerChargeAttack: 31,
    AllianceBattleGroundAllianceTowerDefence: 32,
    AllianceBattleGroundAllianceTowerAttack: 33,
    GeneralsWolfkingTaunt: 34
}

exports.WorldmapArea = {
    Empty: 0,
    MainCastle: 1,
    Dungeon: 2,
    Capital: 3,
    Outpost: 4,
    TreasureDungeon: 7,
    TreasureCamp: 8,
    ShadowArea: 9,
    Village: 10,
    BossDungeon: 11,
    KingdomCastle: 12,
    EventDungeon: 13,
    NoLandmark: 14,
    FactionCamp: 15,
    FactionVillage: 16,
    FactionTower: 17,
    FactionCapital: 18,
    PlagueArea: 19,
    TroopHostel: 20,
    AlienInvasion: 21,
    Metropol: 22,
    Kingstower: 23,
    ResourceIsle: 24,
    DungeonIsle: 25,
    Monument: 26,
    NomadInvasion: 27,
    Laboratory: 28,
    SamuraiCamp: 29,
    FactionInvasionCamp: 30,
    Dynamic: 31,
    SamuraiAlienCamp: 33,
    RedAlienCamp: 34,
    NomadKhanInvasion: 35,
    Shapeshifter: 36,
    DaimyoCastle: 37,
    DaimyoTownship: 38,
    TempServerChargeCamp: 39,
    AllianceBattleGroundResourceTower: 40,
    AllianceBattleGroundTower: 41,
    Wolfking: 42,
    NoOutpost: 99
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

exports.AttackType = {
    Attack: 0,
    OutpostConquer: 1,
    VillageConquer: 2,
    CapitalConquer: 3,
    MetropolConquer: 5,
    KingstowerConquer: 6,
    Conquer: 7,
    MonumentConquer: 8,
    LaboratoryConquer: 9,
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

exports.MessageSubType = {
    SpyPlayer: {
        Sabotage: 0, Defence: 1, Economic: 2
    }, ConquerableArea: {
        SiegeCancelled: 0, NewSiege: 1, AreaConquered: 2, AreaLost: 3
    }, BattleLog: {
        NormalAttack: 0, Conquer: 1, NPCAttack: 2, Occupy: 3, ShadowAttack: 4
    }, AllianceWar: {
        EnemyAttack: 0,
        EnemyDeclaration: 1,
        OwnDeclaration: 2,
        OwnAttack: 3,
        OwnSabotage: 4,
        EnemyEnd: 5,
        EnemySabotage: 6
    }, AttackCancelled: {
        Aborted: 0, AutoRetreat: 1, AutoRetreatEnemy: 2
    }, SpyCancelled: {
        Aborted: 0
    }, SpecialEvent: {
        Start: 12, End: 13, VIPInfo: 16, Update: 32, MonumentReset: 66
    }, PrivateOffer: {
        Tipp: 1, DungeonChest: 5, WhaleChest: 6, TimeChallenge: 12, BestsellerShop: 14
    }
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

exports.TitleType = {
    UNKNOWN: 0, FAME: 1, ISLE: 2, FACTION: 3
}