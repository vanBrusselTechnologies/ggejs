const MessageConst = require('./MessageConst');

exports.ConnectionStatus = {
    Disconnected: 0, Connecting: 1, Connected: 2, Disconnecting: 3,
}

exports.LogVerbosity = {
    Error: 0,
    Warning: 1,
    Info: 2,
    Debug: 3,
    Trace: 4
}
exports.LogPublicity = {
    Public: 0, Connecting: 1, Connected: 2, Disconnecting: 3,
}

exports.Events = {
    MOVEMENT_NEW: "movementAdd",
    MOVEMENT_ADD: "movementAdd",
    MOVEMENT_UPDATE: "movementUpdate",
    MOVEMENT_CANCEL: "movementCancelled",
    SERVER_SHUTDOWN: "serverShutdown",
    SERVER_SHUTDOWN_END: "serverShutdownEnd",
    CONNECTED: "connected",
    CHAT_MESSAGE: "chatMessage",
    MAIL_MESSAGE_NEW: "mailMessageAdd",
    MAIL_MESSAGE_ADD: "mailMessageAdd",
    MAIL_MESSAGE_REMOVE: "mailMessageRemove",
    PRIME_TIME: "primeTime",
    EXTERNAL_CLIENT_READY: "externalClientReady"
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

exports.WorldMapArea = {
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

exports.AttackAdvisorType = {
    Nomad: {id: 1, name: 'nomad'}
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
    System: MessageConst.MESSAGE_TYPE_SYSTEM,
    UserIn: MessageConst.MESSAGE_TYPE_USER_IN,
    UserOut: MessageConst.MESSAGE_TYPE_USER_OUT,
    SpyPlayer: MessageConst.MESSAGE_TYPE_SPY_PLAYER,
    SpyNPC: MessageConst.MESSAGE_TYPE_SPY_PLAYER,
    ConquerableArea: MessageConst.MESSAGE_TYPE_CONQUERABLE_AREA,
    BattleLog: MessageConst.MESSAGE_TYPE_BATTLE_LOG,
    AllianceRequest: MessageConst.MESSAGE_TYPE_ALLIANCE_REQUEST,
    AllianceWar: MessageConst.MESSAGE_TYPE_ALLIANCE_WAR,
    AllianceNewsletter: MessageConst.MESSAGE_TYPE_ALLIANCE_NEWSLETTER,
    AllianceBookmark: MessageConst.MESSAGE_TYPE_ALLIANCE_BOOKMARK,
    FriendInvite: MessageConst.MESSAGE_TYPE_FRIEND_INVITE,
    FriendInviteTeaser: MessageConst.MESSAGE_TYPE_FRIEND_INVITE_TEASER,
    FriendJoinTheGame: MessageConst.MESSAGE_TYPE_FRIEND_JOIN_THE_GAME,
    FindAFriend: MessageConst.MESSAGE_TYPE_FIND_A_FRIEND,
    FriendReachedALevel: MessageConst.MESSAGE_TYPE_FRIEND_REACHED_A_LEVEL,
    FriendBoughtRubies: MessageConst.MESSAGE_TYPE_FRIEND_BOUGHT_RUBIES,
    XFriendsBoughtRubies: MessageConst.MESSAGE_TYPE_X_FRIENDS_BOUGHT_RUBIES,
    NewFriendship: MessageConst.MESSAGE_TYPE_NEW_FRIENDSHIP,
    LowlevelUnderworld: MessageConst.MESSAGE_TYPE_LOWLEVEL_UNDERWORLD,
    UserSurvey: MessageConst.MESSAGE_TYPE_USER_SURVEY,
    AttackCancelled: MessageConst.MESSAGE_TYPE_ATTACK_CANCELLED,
    SpyCancelled: MessageConst.MESSAGE_TYPE_SPY_CANCELLED,
    StarveInfo: MessageConst.MESSAGE_TYPE_STARVE_INFO,
    BuildingDisabled: MessageConst.MESSAGE_TYPE_BUILDING_DISABLED,
    MarketCarriageArrived: MessageConst.MESSAGE_TYPE_MARKET_CARRIAGE_ARRIVED,
    Abo: MessageConst.MESSAGE_TYPE_ABO,
    PaymentDoppler: MessageConst.MESSAGE_TYPE_PAYMENT_DOPPLER,
    Rebuy: MessageConst.MESSAGE_TYPE_REBUY,
    SpecialEvent: MessageConst.MESSAGE_TYPE_SPECIAL_EVENT,
    StarveVillageLost: MessageConst.MESSAGE_TYPE_STARVE_VILLAGE_LOST,
    TournamentOver: MessageConst.MESSAGE_TYPE_TOURNAMENT_OVER,
    IslandKingdomTitle: MessageConst.MESSAGE_TYPE_ISLAND_KINGDOM_TITLE,
    IslandKingdomReward: MessageConst.MESSAGE_TYPE_ISLAND_KINGDOM_REWARD,
    StarveIsleResourceLost: MessageConst.MESSAGE_TYPE_STARVE_ISLE_RESOURCE_LOST,
    RuinInfo: MessageConst.MESSAGE_RUIN_INFO,
    PlayerGift: MessageConst.MESSAGE_TYPE_PLAYER_GIFT,
    Subscription: MessageConst.MESSAGE_TYPE_SUBSCRIPTION,
    ThankyYouPackage: MessageConst.MESSAGE_TYPE_THANKY_YOU_PACKAGE,
    DowntimeStatus: MessageConst.MESSAGE_TYPE_DOWNTIME_STATUS,
    HighscoreBonus: MessageConst.MESSAGE_TYPE_HIGHSCORE_BONUS,
    EventAnnouncement: MessageConst.MESSAGE_TYPE_EVENT_ANNOUNCEMENT,
    Popup: MessageConst.MESSAGE_TYPE_POPUP,
    PatchNotes: MessageConst.MESSAGE_TYPE_PATCH_NOTES,
    PrivateOffer: MessageConst.MESSAGE_TYPE_PRIVATE_OFFER,
    TextId: MessageConst.MESSAGE_TYPE_TEXT_ID
}

exports.MessageSubType = {
    SpyPlayer: {
        Sabotage: MessageConst.SUBTYPE_SPY_SABOTAGE,
        Defence: MessageConst.SUBTYPE_SPY_DEFENCE,
        Economic: MessageConst.SUBTYPE_SPY_ECO
    }, ConquerableArea: {
        SiegeCancelled: MessageConst.SUBTYPE_SIEGE_CANCELED,
        NewSiege: MessageConst.SUBTYPE_NEW_SIEGE,
        AreaConquered: MessageConst.SUBTYPE_CONQUERABLE_AREA_CONQUERED,
        AreaLost: MessageConst.SUBTYPE_CONQUERABLE_AREA_LOST
    }, BattleLog: {
        NormalAttack: MessageConst.SUBTYPE_ATTACK_NORMAL,
        Conquer: MessageConst.SUBTYPE_ATTACK_CONQUER,
        NPCAttack: MessageConst.SUBTYPE_ATTACK_NPC,
        Occupy: MessageConst.SUBTYPE_ATTACK_OCCUPY,
        ShadowAttack: MessageConst.SUBTYPE_ATTACK_SHADOW
    }, AllianceWar: {
        EnemyAttack: MessageConst.SUBTYPE_ALLIANCE_ENEMY_ATTACK_WAR,
        EnemyDeclaration: MessageConst.SUBTYPE_ALLIANCE_ENEMY_DECLARED_WAR,
        OwnDeclaration: MessageConst.SUBTYPE_ALLIANCE_OUR_DECLARED_WAR,
        OwnAttack: MessageConst.SUBTYPE_ALLIANCE_OUR_ATTACK_WAR,
        OwnSabotage: MessageConst.SUBTYPE_ALLIANCE_OUR_SABOTAGE_WAR,
        EnemyEnd: MessageConst.SUBTYPE_ALLIANCE_ENEMY_END_WAR,
        EnemySabotage: MessageConst.SUBTYPE_ALLIANCE_ENEMY_SABOTAGE_WAR
    }, AttackCancelled: {
        Aborted: MessageConst.SUBTYPE_ATTACK_ABORTED,
        AutoRetreat: MessageConst.SUBTYPE_ATTACK_AUTO_RETREAT,
        AutoRetreatEnemy: MessageConst.SUBTYPE_ATTACK_AUTO_RETREAT_ENEMY
    }, SpyCancelled: {
        Aborted: MessageConst.SUBTYPE_SPY_ABORTED
    }, SpecialEvent: {
        Start: MessageConst.SPECIAL_ID_SPECIAL_EVENT_START,
        End: MessageConst.SPECIAL_ID_SPECIAL_EVENT_END,
        VIPInfo: MessageConst.SPECIAL_ID_VIP_INFORMATION,
        HospitalCapacityExceeded: MessageConst.SPECIAL_ID_HOSPITAL_CAPACITY_EXCEEDED,
        Update: MessageConst.SPECIAL_ID_SPECIAL_EVENT_UPDATE,
        MonumentReset: MessageConst.SPECIAL_ID_MONUMENT
    }, PrivateOffer: {
        Tipp: MessageConst.PRIVATE_OFFER_TIPPMAIL,
        DungeonChest: MessageConst.PRIVATE_OFFER_DUNGEON_TREASURE_CHEST,
        WhaleChest: MessageConst.PRIVATE_OFFER_WHALE_CHEST,
        TimeChallenge: MessageConst.PRIVATE_OFFER_TIME_CHALLENGE,
        BestsellerShop: MessageConst.PRIVATE_OFFER_BESTSELLER_SHOP
    }, Popup: {
        RegistrationGift: MessageConst.SUBTYPE_POPUP_REGISTRATION_GIFT,
        FacebookConnection: MessageConst.SUBTYPE_POPUP_FACEBOOK_CONNECTION,
        LoginBonus: MessageConst.SUBTYPE_POPUP_LOGIN_BONUS
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

exports.HighScore = {}

exports.EventType = {}