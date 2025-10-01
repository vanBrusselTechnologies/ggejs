import {EventEmitter} from 'node:events';
import {WebSocket} from 'ws';
import {
    ConstructionItem,
    Dungeon as RawDungeon,
    Effect as RawEffect,
    Gem as RawGem,
    General as RawGeneral,
    Lord as RawLord,
    NetworkInstance,
    Quest as RawQuest,
    Title,
    Unit as RawUnit
} from 'e4k-data'

export const Constants: IConstants;

/** Base class for a player account */
export class BaseClient extends EventEmitter {
    public socketManager: SocketManager;

    public alliances: AllianceManager;
    public clientUserData: ClientUserDataManager;
    public equipments: EquipmentManager;
    public movements: MovementManager;
    public players: PlayerManager;
    public worldMaps: WorldMapManager;

    public bannedUntil: Date = new Date(0);
    public uniqueAccountId: string;
    public logger: Logger;

    private _id: UUID;
    private _networkId: number;

    /**
     * @param serverInstance Your player account serverInstance
     * @example ```js
     *     const e4kNetworkInstances = require('e4k-data').network.instances.instance;
     *     const worldNetworkInstance = e4kNetworkInstances.find(i => i.instanceLocaId === "generic_country_world");
     *     const client = new E4KClient(worldNetworkInstance);
     *     client.connect(playername, password)
     * ```
     */
    public constructor(serverInstance: NetworkInstance);

    private _language: string;

    public set language(val: string);

    private _mailMessages: MailMessage[];

    public get mailMessages(): MailMessage[];

    public set reconnectTimeout(val: number);

    private get _socket(): WebSocket;

    public async sendChatMessage(message: string): Promise<void>;

    public async sendMailMessage(playerName: string, subject: string, message: string): Promise<void>;

    public async getCastleInfo(Mapobject: InteractiveMapobject): Promise<Castle>;

    public on<K extends keyof ClientEvents>(event: K, listener: (...args: ClientEvents[K]) => void): this;

    public addListener<K extends keyof ClientEvents>(event: K, listener: (...args: ClientEvents[K]) => void): this;

    public emit<K extends keyof ClientEvents>(eventName: K, ...args: ClientEvents[K]): boolean;

    private _sendPingPong(): Promise<void>;

    private abstract _reconnect();
}

export class E4KClient extends BaseClient {
    private _externalClient: ExternalClient;

    /**
     * Login with your credentials
     * @param name Your player account name
     * @param password Your player account password
     */
    public connect(name: string, password: string): Promise<E4KClient>;

    public getExternalClient(serverType: IConstants.ServerType.TempServer | IConstants.ServerType.AllianceBattleGround): Promise<ExternalClient>;

    private _generateExternalServerLoginToken(serverType: IConstants.ServerType.TempServer | IConstants.ServerType.AllianceBattleGround): Promise<{
        token: string,
        ip: string,
        port: string,
        zone: string,
        zoneId: string,
        instanceId: string,
        isCrossPlay: boolean
    }>;

    private _login(name: string, password: string): Promise<void>;

    private _reconnect(): Promise<E4KClient>;

    private _verifyLoginData(name: string, password: string): Promise<{ M: string, P: string }>;
}

export class ExternalClient extends BaseClient {
    public connect(loginToken: string): Promise<ExternalClient>;

    private _loginWithToken(loginToken: string): Promise<void>;

    private _reconnect(): Promise<ExternalClient>;
}

export class EmpireClient extends BaseClient {
    private _externalClient: ExternalClient;

    /**
     * Login with your credentials
     * @param name Your player account name
     * @param password Your player account password
     */
    public connect(name: string, password: string): Promise<E4KClient>;

    public getExternalClient(serverType: IConstants.ServerType.TempServer | IConstants.ServerType.AllianceBattleGround): Promise<ExternalClient>;

    private _generateExternalServerLoginToken(serverType: IConstants.ServerType.TempServer | IConstants.ServerType.AllianceBattleGround): Promise<{
        token: string,
        ip: string,
        port: string,
        zone: string,
        zoneId: string,
        instanceId: string,
        isCrossPlay: boolean
    }>;

    private _login(name: string, password: string): Promise<void>;

    private _reconnect(): Promise<E4KClient>;
}

export private type CommandCallback<T> = {
    id: UUID,
    clientId: UUID,
    match: (params: Object) => boolean,
    resolve: (value: T) => void,
    reject: (errorCode?: number) => void
}

export class EmpireError extends Error {
    errorCode: number | string;
}

export class Logger {
    verbosity: number;

    e(...message: any[]): void;

    w(...message: any[]): void;

    i(...message: any[]): void;

    d(...message: any[]): void;

    t(...message: any[]): void;
}

//#region ClientEvents
/** */
interface ClientEvents {
    serverShutdown: [];
    serverShutdownEnd: [];
    connected: [];
    chatMessage: [message: ChatMessage];
    mailMessageAdd: [messages: MailMessage[]];
    mailMessageRemove: [message: MailMessage];
    primeTime: [primeTime: PrimeTime];
    externalClientReady: [externalClient: ExternalClient];
}

interface MovementEvents {
    movementAdd: [movement: Movement];
    movementUpdate: [oldMovement: Movement, newMovement: Movement];
    movementCancelled: [movement: Movement];
}

interface ConstantsEvents {
    /** Equivalent of MOVEMENT_ADD */
    MOVEMENT_NEW: "movementAdd";
    MOVEMENT_ADD: "movementAdd";
    MOVEMENT_UPDATE: "movementUpdate";
    MOVEMENT_CANCEL: "movementCancelled";
    SERVER_SHUTDOWN: "serverShutdown";
    SERVER_SHUTDOWN_END: "serverShutdownEnd";
    CONNECTED: "connected";
    CHAT_MESSAGE: "chatMessage";
    MAIL_MESSAGE_NEW: "mailMessageAdd";
    MAIL_MESSAGE_ADD: "mailMessageAdd";
    MAIL_MESSAGE_REMOVE: "mailMessageRemove";
    PRIME_TIME: "primeTime";
    EXTERNAL_CLIENT_READY: "externalClientReady";
}

//#endregion

//#region Managers

export class SocketManager {
    reconnectTimeout: number = 300;
    serverType: number = 1;

    constructor(client: BaseClient, serverInstance: NetworkInstance);

    get connectionStatus(): number;
    private set connectionStatus(connectionStatus: number);

    async connect(): Promise<void>;

    async reconnect(): Promise<void>;

    async disconnect(): Promise<void>;

    sendCommand(commandId: string, paramObject: Object): boolean;

    setConnected(): void;

    private writeToSocket(msg: string): boolean;
}

export class BaseManager extends EventEmitter {
    protected _client: BaseClient;

    protected constructor(client: BaseClient);
}

export class AllianceManager extends BaseManager {
    private constructor(client: BaseClient);

    public async getById(id: number): Promise<Alliance>;

    public async find(name: string): Promise<Alliance>;

    public async getMyAlliance(): Promise<MyAlliance>;

    public async getRankings(nameOrRanking: string | number, rankingType: AllianceHighScoreRankingTypes = "might", leagueId: number = 1): Promise<HighScore<AllianceHighScoreItem>>
}

export class ClientUserDataManager {
    public boostData: PremiumBoostData;
    public questData: QuestData;

    private constructor(client: BaseClient);

    public get isXPDataInitialized(): boolean;
    private set isXPDataInitialized(val: number);

    public get userXp(): number;
    private set userXp(val: number);

    public get userXpCurrentLevel(): number;
    private set userXpCurrentLevel(val: number);

    public get userXPtoNextLevel(): number;
    private set userXPtoNextLevel(val: number);

    public get displayXP(): number;
    private set displayXP(val: number);

    public get hasPremiumFlag(): boolean;
    private set hasPremiumFlag(val: boolean);

    public get userRanking(): number;
    private set userRanking(val: number);

    public get mightpoints(): number;
    private set mightpoints(val: number);

    public get highestAchievedMight(): number;
    private set highestAchievedMight(val: number);

    public get paymentDoublerCount(): number;
    private set paymentDoublerCount(val: number);

    public get isPayUser(): boolean;
    private set isPayUser(val: boolean);

    public get userId(): number;
    private set userId(val: number);

    public get playerId(): number;
    private set playerId(val: number);

    public get userName(): string;
    private set userName(val: string);

    public get email(): string;
    private set email(val: string);

    public get pendingEmailChange(): string | null;
    private set pendingEmailChange(val: string | null);

    public get isCheater(): boolean;
    private set isCheater(val: boolean);

    public get hasEverChangedName(): boolean;
    private set hasEverChangedName(val: boolean);

    public get hasConfirmedTOC(): boolean;
    private set hasConfirmedTOC(val: boolean);

    public get isAccountSaved(): boolean;
    private set isAccountSaved(val: boolean);

    public get hasFreeCastleRename(): boolean;
    private set hasFreeCastleRename(val: boolean);

    public get lifeTimeSpent(): number
    private set lifeTimeSpent(val: number)

    public get facebookId(): string | null;
    private set facebookId(val: string | null);

    public get minUserNameLength(): number;
    private set minUserNameLength(): number;

    public get allianceId(): number;
    private set allianceId(val: number);

    public get allianceRank(): number;
    private set allianceRank(val: number);

    public get allianceCurrentFame(): number;
    private set allianceCurrentFame(val: number);

    public get isSearchingAlliance(): boolean;
    private set isSearchingAlliance(val: boolean);

    public get wasResetted(): boolean;
    private set wasResetted(val: boolean);

    public get selectedHeroId(): number;
    private set selectedHeroId(val: number);

    public get lastUserActivity(): Date;
    private set lastUserActivity(val: number);

    public get maxSpies(): number;
    private set maxSpies(val: number);

    public get availablePlagueMonks(): number;
    private set availablePlagueMonks(val: number);

    public get noobProtectionEndTime(): Date;
    private set noobProtectionEndTime(val: Date);

    public get noobProtected(): boolean;
    private set noobProtected(val: boolean);

    public get peaceProtectionStatusEndTime(): Date;
    private set peaceProtectionStatusEndTime(val: Date);

    public get peaceModeStatus(): number;
    private set peaceModeStatus(val: number);

    public get activeMovementFilters(): number[];
    private set activeMovementFilters(val: number[]);

    public get relocationCount(): number;
    private set relocationCount(val: number);

    public get relocationDurationEndTime(): Date;
    private set relocationDurationEndTime(val: Date);

    public get relocationCooldownEndTime(): Date;
    private set relocationCooldownEndTime(val: Date);

    public get relocationDestination(): Coordinate;
    private set relocationDestination(val: Coordinate);

    public get mayChangeCrest(): boolean;
    private set mayChangeCrest(val: boolean);

    public get playerCrest(): Crest;
    private set playerCrest(val: Crest);

    public get globalCurrencies(): Good[];

    public get titlePrefix(): Title

    private set titlePrefix(val: number);

    public get titleSuffix(): Title

    private set titleSuffix(val: number);

    public get level(): number;

    public get legendaryLevel(): number;

    public get honor(): number;

    public get registrationDate(): Date;

    public get showVIPFlagOption(): boolean

    private set showVIPFlagOption(val: boolean)

    public get vipPoints(): number

    private set vipPoints(points: number)

    public get maxVIPLevelReached(): number

    private set maxVIPLevelReached(level: number)

    public get usedPremiumGenerals(): number

    private set usedPremiumGenerals(val: number)

    public get vipTimeExpireDate(): Date

    public get myAlliance(): MyAlliance

    private set myAlliance(val: MyAlliance)

    private set userLevel(val: number);

    private set userParagonLevel(val: number);

    private set userHonor(val: number);

    /* todo: TitleRatingStatus
    setTitleRatingStatus(titleRatingStatus: TitleRatingStatus, titleType: number): void;
    titleRatingStatus(titleType: number): TitleRatingStatus
     */

    private set registrationTimestamp(val: number);

    private set vipTimeExpireTimestamp(val: number)

    public isLegendLevel(): boolean;

    public titlePoints(titleType: number): number

    public currentTitle(titleType: number): Title

    public highestTitlePoints(titleType: number): number

    private setGlobalCurrency(val: Good);

    private setKingdomNoobProtection(kingdomID: number, remainingNoobTimeInSeconds: number): void;

    private setTitlePoints(points: number, titleType: number): void

    private setCurrentTitle(titleType: number, title: Title): void

    private clearCurrentTitle(titleType: number): void

    private setHighestTitlePoints(points: number, titleType: number): void
}

export class EquipmentManager extends BaseManager {
    private constructor(client: BaseClient);

    public get equipmentSpaceLeft(val: number);
    private set equipmentSpaceLeft(val: number);

    public get equipmentTotalInventorySpace(val: number);
    private set equipmentTotalInventorySpace(val: number);

    public get gemSpaceLeft(val: number);
    private set gemSpaceLeft(val: number);

    public get gemTotalInventorySpace(val: number);
    private set gemTotalInventorySpace(val: number);

    public getCommandants(): Lord[];

    /** Returns Array with all idle commandants.*/
    public getAvailableCommandants(): Lord[];

    public getBarons(): Lord[];

    public getGenerals(): General[];

    public getEquipmentInventory(): Promise<(Equipment | RelicEquipment)[]>;

    public sellEquipment(equipment: Equipment | RelicEquipment): Promise<void>;

    public sellAllEquipmentsAtOrBelowRarity(rarity: number): Promise<void>;

    public getRegularGemInventory(): { gem: Gem, amount: number }[];

    public getRelicGemInventory(): RelicGem[];

    public sellGem(gem: Gem | RelicGem): Promise<void>;

    public sellAllGemsAtOrBelowLevel(level: number): Promise<void>;

    private _setCommandantsAndBarons(barons: Lord[], commandants: Lord[]): void;

    private _setGenerals(generals: General[]): void;

    private _autoSellEquipment(e: Equipment | RelicEquipment, rarity: number): Promise<void>;

    private _setRegularGemInventory(gems: { gem: Gem, amount: number }[]): void;

    private _setRelicGemInventory(gems: RelicGem[]): void;

    private _autoSellGem(gem: Gem, level: number): Promise<void>;
}

export class MovementManager extends BaseManager {
    private constructor(client: BaseClient);

    public static getDistance(castle1: Mapobject | CastlePosition, castle2: Mapobject | CastlePosition): number;

    public getDistance(castle1: Mapobject | CastlePosition, castle2: Mapobject | CastlePosition): number;

    public on<K extends keyof MovementEvents>(event: K, listener: (...args: MovementEvents[K]) => void): this;

    public addListener<K extends keyof MovementEvents>(event: K, listener: (...args: MovementEvents[K]) => void): this;

    emit<K extends keyof MovementEvents>(eventName: K, ...args: MovementEvents[K]): boolean;

    /** Returns all movements */
    public get(): Movement[];

    public startAttackMovement(castleFrom: InteractiveMapobject, castleTo: Mapobject | CastlePosition, army: ArmyWave[], lord: Lord, horse?: Horse): void;

    public startSpyMovement(castleFrom: InteractiveMapobject, castleTo: Mapobject | CastlePosition, spyCount: number, spyType: number, spyEffect: number, horse?: Horse): void;

    public startMarketMovement(castleFrom: InteractiveMapobject, castleTo: Mapobject | CastlePosition, goods: Good[], horse?: Horse): void;

    private _add_or_update(_movements: Movement[]): void;

    private _remove(_movementId: number): void;
}

export class PlayerManager extends BaseManager {
    private constructor(client: BaseClient);

    public async getById(id: number): Promise<Player>;

    public async find(name: string): Promise<Player>;

    public async getThisPlayer(): Promise<Player>;

    public async getRankings(nameOrRanking: string | number, rankingType: PlayerHighScoreRankingTypes = "might", leagueId: number = 1): Promise<LeaderboardList>
}

export class WorldMapManager extends BaseManager {
    private _ownerInfoData

    /**
     * Returns the complete worldMap, use {@link getSector} if only part of it is needed
     * @param kingdomId Only kingdoms you have a castle in are valid
     */
    public async get(kingdomId: number): Promise<WorldMap>;

    /**
     * Returns a 100x100 area of a certain worldMap with center {@link centerX}/{@link centerY}
     * @param kingdomId Only kingdoms you have a castle in are valid
     * @param centerX X coordinate that will be the center of sector
     * @param centerY Y coordinate that will be the center of sector
     * @returns 100x100 WorldMapSector
     */
    public async getSector(kingdomId: number, centerX: number, centerY: number): Promise<WorldMapSector>;
}

//#endregion

//#region Movement
/** */
type Movement =
    BasicMovement
    | ArmyAttackMovement
    | ArmyTravelMovement
    | SiegeMovement
    | MarketMovement
    | SpyMovement;

export class BasicMovement {
    public movementId: number;
    public movementType: number;
    public arrivalTime: Date;
    public departureTime: Date;
    public direction: number;
    public sourceArea: Mapobject;
    public targetArea: Mapobject;
    public ownerArea: Mapobject;
    public distance: number;
    public kingdomId: number;
    public horseBoosterWodId: number;
    public endWaitTime?: Date;
    public lord?: Lord;
    public general?: General;

    protected constructor(client: BaseClient, data: object);
}

export class ArmyAttackMovement extends BasicMovement {
    public army?: CompactArmy;
    public armyState: number;
    public attackType: AttackType;
    public guessedSize?: number;
    public isForceCancelable: boolean;
    public isShadowMovement: boolean;

    protected constructor(client: BaseClient, data);
}

export class ArmyTravelMovement extends BasicMovement {
    public army: InventoryItem<Unit>[];
    public goods?: Good[];

    protected constructor(client: BaseClient, data);
}

export class SiegeMovement extends BasicMovement {
    public army: InventoryItem<Unit>[];

    protected constructor(client: BaseClient, data);
}

export class MarketMovement extends BasicMovement {
    public goods: Good[];
    public carriages: number;

    protected constructor(client: BaseClient, data);
}

export class SpyMovement extends BasicMovement {
    public spyType: number;
    public spyCount: number;
    public spyRisk: number;
    public spyAccuracy?: number;
    public sabotageDamage?: number;

    protected constructor(client: BaseClient, data);
}

export class SupportDefenceMovement extends ArmytravelMovement {
}

export class InventoryItem<T> {
    item: T;
    count: number;

    constructor(item: T, count: number);
}

export class ArmyWave {
    left: {
        units: InventoryItem<Unit>[],
        tools: InventoryItem<Tool>[],
    }
    middle: {
        units: InventoryItem<Unit>[],
        tools: InventoryItem<Tool>[],
    }
    right: {
        units: InventoryItem<Unit>[],
        tools: InventoryItem<Tool>[],
    }
}

export class Horse {
    wodId: number;
    comment1: string;
    comment2: string;
    type: number;
    unitBoost: number;
    marketBoost: number;
    spyBoost: number;
    costFactorC1: number;
    costFactorC2: number;
    isInstantSpyHorse: boolean;
    isPegasusHorse: boolean;

    constructor(castleData: Castle, horseType: number);
}

//#endregion

//#region Alliance
/** */
export class Alliance {
    public allianceId: number;
    public allianceName: string;
    public allianceDescription: string;
    public languageId: string;
    public memberLevel: number;
    public memberList: AllianceMember[];
    public allianceStatusToOwnAlliance: number;
    public allianceFamePoints: number;
    public allianceFamePointsHighestReached: number
    public canInvitedForHardPact: boolean;
    public canInvitedForSoftPact: boolean;
    public isSearchingMembers: boolean;
    public isOpenAlliance: boolean;
    public freeRenames: number;
    public might: number;

    protected constructor(client: BaseClient, data);

    public get landmarks(): (CapitalMapobject | KingstowerMapobject | MetropolMapobject | MonumentMapobject)[];

    private set _landmarks(value: (CapitalMapobject | MonumentMapobject | KingstowerMapobject)[]);

    private _add_or_update_landmarks(landmarks: Mapobject[]): void;
}

export class MyAlliance extends Alliance {
    public isAutoWarOn: boolean;
    public applicationAmount: number;
    public announcement: string;
    public aquaPoints: number;
    public cargoPointsRanking: number;
    public storage: Good[];
    public statusList: AllianceStatusListItem[];
    public capitals: CapitalMapobject[];
    public metropols: MetropolMapobject[];
    public kingstowers: KingstowerMapobject[];
    public monuments: MonumentMapobject[];
    public highestMight: number;
    public highestFamePoints: number;

    private parseStorage(client: BaseClient, data: Object): void;
}

export class AllianceMember extends WorldMapOwnerInfo {
    public alliance: Alliance;
    public donations?: AllianceDonations;
    public activityStatus?: number;

    private constructor(client: BaseClient, data, alliance: Alliance);
}

export class AllianceStatusListItem {
    public allianceId: number;
    public allianceName: string;
    public allianceStatus: number;
    public allianceStatusConfirmed: boolean;

    private constructor(client: BaseClient, data);
}

export class AllianceDonations {
    public coins: number
    public rubies: number;
    public res: number;

    private constructor(client: BaseClient, data: Array<number>);
}

export class ChatMessage {
    public message: string;
    public sendDate: Date;
    public senderPlayerId: number;
    public senderPlayerName: string;
}

//#endregion

export class CompactArmy {
    public left: InventoryItem<Unit>[];
    public middle: InventoryItem<Unit>[];
    public right: InventoryItem<Unit>[];
    public supportTools: InventoryItem<Tool>[];
    public finalWave: InventoryItem<Unit>[];
    public armySize: number;
    public soldierCount: number;
    public toolCount: number;

    private constructor(client: BaseClient, data: object);
}

export class Coordinate {
    public X: number;
    public Y: number;

    private constructor(data: number[]);
}

export class CastlePosition {
    public kingdomId: number;
    public objectId: number;
    public xPos: number;
    public yPos: number;
    public areaType: number;

    public get position(): Coordinate;
}

export class Good extends InventoryItem<string> {
    private constructor(data: [string, number]);
}

//#region Lord and Equipment
/** */
export class Lord {
    public id: number;
    public isDummy: boolean;
    public name: string;
    public wins: number;
    public defeats: number;
    public winSpree: number;
    public equipments: Equipment[] | RelicEquipment[];
    public generalId: number;
    public isRelic?: boolean;
    public gems: Gem[] | RelicGem[];
    public effects: Effect[] | RelicEffect[];
    public wearerId: number;
    public pictureId: number;
    public attachedCastleId?: number;
    public rawData: RawLord;
}

export class General {
    public generalId: number;
    public rawData: RawGeneral;
    public level: number;
    public xp: number;
    public xpBeforeBattle: number;
    public starTier: number;
    public isNew: number;
    public leveledUp: number;
    public attackAbilities: { slotId: number, abilityId: number }[];
    public defenseAbilities: { slotId: number, abilityId: number }[];
    public activatedSkillIds: number[];
    public wins: number;
    public defeats: number;
    public abilitiesPerWave: { [key: number]: { abilityId: number, waveId: number, abilityValue: number } };
}

export class Equipment {
    public id: number;
    public slotId: number;
    public wearerId: number;
    public rarityId: number;
    public pictureId: number;
    public canSlotGem: boolean;
    public enhancementLevel: number;
    public setId: number;
    public effects: Effect[];
    public attachedGem?: Gem;
    public equippedLord?: Lord;
}

export class RelicEquipment {
    public id: number;
    public slotId: number;
    public wearerId: number;
    public rarityId: number;
    public canSlotGem: boolean;
    public enhancementLevel: number;
    public relicTypeId: number;
    public relicCategoryId: number;
    public mightValue: number;
    public effects: RelicEffect[];
    public attachedGem?: RelicGem;
    public equippedLord?: Lord;
}

export class Gem {
    public id: number;
    public setId?: number;
    public effects: Effect[];
    public attachedEquipment?: Equipment;
    public rawData: RawGem;
}

export class RelicGem {
    public id: number;
    public slotId: number;
    public enhancementLevel: number;
    public relicTypeId: number;
    public relicCategoryId: number;
    public mightValue: number;
    public effects: RelicEffect[];
    public attachedEquipment?: RelicEquipment;
}

//#endregion

export class Effect {
    public effectId: number;
    public power: number;
    public name: string;
    public capId: number;
    public uncappedPower: number;
    public rawData: RawEffect;
}

export class RelicEffect extends Effect {
    public relicEffectId: number;
}

export class Player extends WorldMapOwnerInfo {
    public castles: (CastleMapobject | CapitalMapobject)[];
    public villages: {
        public: {
            village: VillageMapobject,
            units?: InventoryItem<Unit>[]
        }[],
        private: { privateVillageId: number, uniqueId: number }[]
    };
    public kingstowers: {
        kingstower: KingstowerMapobject;
        units?: InventoryItem<Unit>[];
    }[];
    public monuments: {
        monument: MonumentMapobject;
        units?: InventoryItem<Unit>[];
    }[];
}

export class Unit {
    public wodId: number;
    public isSoldier: boolean;
    public rangeAttack?: number;
    public meleeAttack?: number;
    public rangeBonus?: number;
    public meleeBonus?: number;
    public fightType?: number;
    public rangeDefence?: number;
    public meleeDefence?: number;
    public rawData: RawUnit;

    constructor(client: BaseClient, wodId: number);
}

export class Tool extends Unit {

}

export class WorldMap {
    public kingdomId: number;
    public mapObjects: Mapobject[];

    private _addAreaMapObjects(objs: Mapobject[]): void;

    private _clear(): void;
}

export class WorldMapSector extends WorldMap {
    public combine(...sectors: WorldMapSector[]): WorldMapSector
}

export class WorldMapOwnerInfo {
    public playerId: number;
    public playerLevel: number;
    public paragonLevel: number;
    public noobEndTime: Date;
    public highestFamePoints: number;
    public fameTopX: number;
    public peaceEndTime: Date;
    public castlePosList: CastlePosition[];
    public relocateDurationEndTime: Date;
    public factionId: number;
    public factionIsSpectator: boolean;
    public factionProtectionStatus: number;
    public factionProtectionEndTime: Date;
    public factionNoobProtectionEndTime: Date;
    public isOutpostOwner: number;
    public isNPC: boolean;
    public crest: Crest;
    public titleVO// TODO: :IsleTitleViewVO
    public staticAreaName: string;

    public get honor(): number;

    public get isRuin(): boolean;

    public get allianceId(): number;

    public get allianceRank(): number;

    public get might(): number;

    public get isRuin(): boolean;

    public get playerTotalLevel(): number;

    public get isParagon(): boolean;

    public get playerName(): string;

    public set playerName(): string;

    public get isInAlliance(): boolean;

    public get allianceName(): string;

    public get isOwnOwnerInfo(): boolean;

    public get famePoints(): number;

    public get achievementPoints(): number;

    public get factionMainCampId(): number;

    public get prefixTitleId(): number;

    public get suffixTitleId(): number;

    public get isNoobProtected(): boolean;

    public get isPeaceProtected(): boolean;

    public get isFactionNoobProtected(): boolean;

    public get isFactionProtected(): boolean;

    public getMainCastlePositionFromPosListByKingdomId(kingdomId: number): Coordinate;

    public getCastlePosListItemByPos(pos: Coordinate): CastlePosition;

    public getMainCastlePositionFromPosListForCurrentKingdom(): Coordinate;

    public getCastlePosListByKingdomId(kID: number): CastlePosition[];

    public isSearchingAlliance(): boolean;

    public hasPremiumFlag(): boolean;

    public hasVIPFlag(): boolean;

    public isRankInfoVisible(): boolean;

    public isMainCastlePosInKingdom(castlePos: CastlePosition, kingdomId: number): boolean;

    public setNamesFactory(value/*todo :KingdomSkinNamesFactory*/, nameTextId: string);

    public getCrestByKingdomId(kingdomId: number, isShadowMovement: boolean = false): Crest;

    public getFactionMainCampPosition(): Coordinate;
}

//#region Mapobject
/** */
type Mapobject =
    BasicMapobject
    | AlienInvasionMapobject
    | BossDungeonMapobject
    | CapitalMapobject
    | CastleMapobject
    | DaimyoCastleMapobject
    | DaimyoTownshipMapobject
    | DungeonMapobject
    | DungeonIsleMapobject
    | DynamicMapobject
    | EmptyMapobject
    | EventDungeonMapobject
    | FactionCampMapobject
    | FactionCapitalMapobject
    | FactionTowerMapobject
    | FactionVillageMapobject
    | KingstowerMapobject
    | MetropolMapobject
    | MonumentMapobject
    | NomadInvasionMapobject
    | NomadKhanInvasionMapobject
    | RedAlienInvasionMapobject
    | ResourceIsleMapobject
    | SamuraiInvasionMapobject
    | ShadowAreaMapobject
    | ShapeshifterMapobject
    | VillageMapobject
    | WolfKingMapobject;

export class AlienInvasionMapobject extends InteractiveMapobject {
    public dungeonLevel: number;
    public hasPeaceMode: boolean;
    public wasRerolled: boolean;
    public travelDistance: number;
    public eventId: number;
}

export class BasicMapobject {
    public areaType: number;
    public position: Coordinate;
    public mapId?: number;
    public kingdomId?: number;

    protected constructor(client: BaseClient, data: Array<string | number | object>);

    protected parseAreaInfoBattleLog(data): this;
}

export class BossDungeonMapobject extends InteractiveMapobject {
    public dungeonLevel: number;
    public defeaterPlayerId: number;
}

export class CapitalMapobject extends InteractiveMapobject {
    public depletionTimeEnd?: Date;
    public influencePoints: number;
}

export class CastleMapobject extends InteractiveMapobject {
}

export class DaimyoMapobject extends SamuraiInvasionMapobject {
    daimyoId: number;
    totalCooldown: number;
    skipCost: number;
}

export class DaimyoCastleMapobject extends DaimyoMapobject {

}

export class DaimyoTownshipMapobject extends DaimyoMapobject {

}

export class DungeonIsleMapobject extends InteractiveMapobject {
    public isleId: number;
    public attackCount: number;
    public reappearDate?: Date;
    public isVisibleOnMap: boolean;
}

export class DungeonMapobject extends InteractiveMapobject {
    public attackCount: number;
    public level: number;
    public resources: number;
    public coins: number;
    public rubies: number;
    public rubyProbability: number;
    public wallWodId: number;
    public gateWodId: number;
    public guards: number;
    public xp: number;
    private _rawData: RawDungeon;

    private _defence: {
        troops: {
            middle: InventoryItem<Unit>[],
            left: InventoryItem<Unit>[],
            center: InventoryItem<Unit>[],
            right: InventoryItem<Unit>[]
        },
        tools: { middle: InventoryItem<Unit>[], left: InventoryItem<Unit>[], right: InventoryItem<Unit>[] }
    };
    public get defence(): {
        troops: {
            left: InventoryItem<Unit>[],
            middle: InventoryItem<Unit>[],
            right: InventoryItem<Unit>[],
            center: InventoryItem<Unit>[]
        },
        tools: {
            left: InventoryItem<Tool>[],
            middle: InventoryItem<Tool>[],
            right: InventoryItem<Tool>[],
            center: InventoryItem<Tool>[]
        }
    };

    private _lord: Lord;
    public get lord(): Lord;
}

export class DynamicMapobject extends BasicMapobject {

}

export class EmptyMapobject extends BasicMapobject {

}

export class EventDungeonMapobject extends InteractiveMapobject {
    public dungeonLevel: number;
    public isDefeated: boolean;
    public skinId: number;

    get areaName(): string;
}

export class FactionCampMapobject extends FactionInteractiveMapobject {
    get areaName(): string;
}

export class FactionCapitalMapobject extends FactionInteractiveMapobject {
    travelDistance: number;
    dungeonLevel: number;

    get areaName(): string;
}

export class FactionInteractiveMapobject extends InteractiveMapobject {
    isDestroyed: boolean;
    aliveProtectorPositions: Array<Coordinate>

    get titleText(): number

    get levelText(): number

    get specialCampId(): number
}

export class FactionTowerMapobject extends FactionInteractiveMapobject {
    travelDistance: number;
    dungeonLevel: number;
    attacksLeft: number;
    wallWodId: number;
    gateWodId: number;

    get areaName(): string;
}

export class FactionVillageMapobject extends FactionInteractiveMapobject {
    travelDistance: number;
    dungeonLevel: number;

    get areaName(): string;
}

export class InteractiveMapobject extends BasicMapobject {
    public objectId: number;
    public ownerId: number;
    public ownerInfo: WorldMapOwnerInfo;
    public keepLevel: number;
    public wallLevel: number;
    public gateLevel: number;
    public towerLevel: number;
    public moatLevel: number;
    public customName: string;
    public attackCooldownEnd?: Date;
    public sabotageCooldownEnd?: Date;
    public lastSpyDate?: Date;
    public occupierId: number;
    public equipmentId: number;
    public outpostType: number;
}

export class InvasionMapobject extends InteractiveMapobject {
    public victoryCount: number;
    public difficultyCampId: number;
    public baseWallBonus: number;
    public baseGateBonus: number;
    public baseMoatBonus: number;
    public isVisibleOnMap: boolean;
    public eventId: number;
    public travelDistance: number;
}

export class KingstowerMapobject extends InteractiveMapobject {
}

export class MonumentMapobject extends InteractiveMapobject {
    public monumentType: number;
    public monumentLevel: number;
}

export class MetropolMapobject extends CapitalMapobject {
}

export class NomadInvasionMapobject extends InvasionMapobject {
}

export class NomadKhanInvasionMapobject extends InvasionMapobject {
    public allianceCampId: number;
    public totalCooldown: number;
    public skipCost: number;
}

export class RedAlienInvasionMapobject extends AlienInvasionMapobject {
}

export class ResourceIsleMapobject extends InteractiveMapobject {
    public isleId: number;
    public occupationFinishedDate: Date;
}

export class SamuraiInvasionMapobject extends InvasionMapobject {
}

export class ShadowAreaMapobject extends InteractiveMapobject {
}

export class ShapeshifterMapobject extends InteractiveMapobject {
    public campLevel: number;
    public playerAttacked: boolean;
    public shapeshifterAttacked: boolean;
    public shapeshifterId: number;
    public eventId: number;
    public travelDistance: number;
}

export class VillageMapobject extends InteractiveMapobject {
    public villageType: number;
    public unitWallCount: number;
    public peasants: number;
    public guards: number;
    public productivityWoodBoost: number;
    public productivityStoneBoost: number;
    public productivityFoodBoost: number;
}

export class WolfKingMapobject extends InteractiveMapobject {
    public level: number;
    public isDefeated: boolean;
    public isVisibleOnMap: boolean;
    public baseWallBonus: number;
    public baseGateBonus: number;
    public baseMoatBonus: number;
    public travelDistance: number;
}

//#endregion
//#region MailMessage
/** All types of MailMessages */
export type MailMessage =
    BasicMessage
    | BattleLogConquerMessage
    | BattleLogNormalAttackMessage
    | BattleLogNPCAttackMessage
    | BattleLogOccupyMessage
    | AllianceNewsMessage
    | UserMessage
    | SpyPlayerSabotageSuccessfulMessage
    | SpyPlayerSabotageFailedMessage
    | SpyPlayerDefenceMessage
    | SpyPlayerEconomicMessage
    | SpyNPCMessage
    | MarketCarriageArrivedMessage
    | PrivateOfferBestsellerShopMessage
    | PrivateOfferDungeonChestMessage
    | PrivateOfferTimeChallengeMessage
    | PrivateOfferTippMessage
    | PrivateOfferWhaleChestMessage
    | BreweryMissingResourcesMessage
    | DoubleRubiesMessage
    | StarveInfoMessage
    | AttackCancelledAbortedMessage
    | AttackCancelledAutoRetreatMessage
    | AttackCancelledAutoRetreatEnemyMessage
    | SpyCancelledAbortedMessage
    | ProductionDowntimeMessage
    | PlayerGiftMessage
    | UserSurveyMessage
    | RebuyMessage
    | RuinInfoMessage
    | SpecialEventStartMessage
    | SpecialEventUpdateMessage
    | SpecialEventEndMessage
    | SpecialEventVIPInfoMessage
    | SpecialEventMonumentResetMessage
    | SpecialEventHospitalCapacityExceededMessage
    | AllianceWarEnemyAttackMessage
    | AllianceWarOwnAttackMessage
    | AllianceWarEnemyDeclarationMessage
    | AllianceWarEnemyEndMessage
    | AllianceWarEnemySabotageMessage
    | AllianceWarOwnDeclarationMessage
    | AllianceWarOwnSabotageMessage
    | ConquerableSiegeCancelledMessage
    | ConquerableNewSiegeMessage
    | ConquerableAreaConqueredMessage
    | ConquerableAreaLostMessage
    | PopupFacebookConnectionMessage
    | PopupLoginBonusMessage
    | PopupRegistrationGiftMessage
    | AllianceRequestMessage
    | AttackAdvisorFailedMessage
    | AttackAdvisorSummaryMessage
    | AttackCountThresholdMessage;

export class BasicMessage {
    public messageId: number;
    public messageType: number;
    public subType: number;
    public metadata: string;
    public senderName: string;
    public subject: string;
    public playerId: number;
    public deliveryTime: Date;
    public isRead: boolean;
    public isArchived: boolean;
    public isForwarded: boolean;
    public canBeForwarded: boolean;

    protected constructor(client: BaseClient, data: Array<any>);

    public async delete(): Promise<void>;
}

export class AllianceNewsMessage {
    public subject: string;
    private _body: string;

    public async getBody(): Promise<string>;
}

export class UserMessage {
    public subject: string;
    private _body: string;

    public async getBody(): Promise<string>;
}

//#region BattleLogMessage
export class BasicBattleLogMessage {
    public areaType: number;
    public subType: number;
    public hasAttackerWon: boolean;
    public isDefenseReport: boolean;
    public treasureMapId: number;
    public treasureMapNodeType: number;
    public kingdomId: number;
    public ownerId: number;
    public areaName: string;
    public subject: string;
    private _battleLog: BattleLog | undefined;

    public async getBattleLog(): Promise<BattleLog>;
}

export class BattleLogConquerMessage extends BasicBattleLogMessage {
}

export class BattleLogNormalAttackMessage extends BasicBattleLogMessage {
}

export class BattleLogNPCAttackMessage extends BasicBattleLogMessage {
}

export class BattleLogOccupyMessage extends BasicBattleLogMessage {
}

interface BattleLog {
    battleLogId: number,
    messageId: number,
    messageType: number,
    mapobject: Mapobject,
    attacker: BattleParticipant,
    defender: BattleParticipant,
    winner: BattleParticipant,
    loser: BattleParticipant,
    defWon: boolean,
    honor: number,
    survivalRate: number,
    ragePoints: number,
    shapeshifterPoints: number,
    shapeshifterId: number,
    rewardEquipment?: Equipment | RelicEquipment,
    rewardGem?: Gem,
    rewardMinuteSkips?: {},
    attackerHomeCastleId: number,
    attackerHadHospital: boolean,
    isAttackerHospitalFull: boolean,
    defenderHomeCastleId: number,
    defenderHadHospital: boolean,
    isDefenderHospitalFull: boolean,
    attackerAllianceSubscribers: number,
    defenderAllianceSubscribers: number,
    attackerHasIndividualSubscription: boolean,
    defenderHasIndividualSubscription: boolean,
    allianceName: string,
    attackerCommandant: Lord,
    attackerGeneral?: General,
    attackerLegendSkills: number[],
    defenderBaron: Lord
    defenderGeneral?: General,
    defenderLegendSkills: number[],
    courtyardAttacker: BattleLogUnit<Unit>[],
    courtyardDefender: BattleLogUnit<Unit>[],
    wavesAttacker: BattleLogArmyWave[],
    wavesDefender: BattleLogArmyWave[],
    finalWaveAttacker: BattleLogUnit<Unit>[],
    supportToolsAttacker: BattleLogUnit<Unit>[],
    supportToolsDefender: BattleLogUnit<Unit>[],
    autoSkipCooldownType: number;
    autoSkipC2: number;
    autoSkipMinuteSkips: Good[];
    autoSkipSeconds: number;
}

export class BattleLogUnit<Unit> extends InventoryItem<Unit> {
    lost: number;

    constructor(item: Unit, count: number, lost: number);
}

export class BattleLogArmyWave {
    public left: {
        soldiers: BattleLogUnit<Unit>[],
        tools: BattleLogUnit<Tool>[],
    }
    public middle: {
        soldiers: BattleLogUnit<Unit>[],
        tools: BattleLogUnit<Tool>[],
    }
    public right: {
        soldiers: BattleLogUnit<Unit>[],
        tools: BattleLogUnit<Tool>[],
    }
}

export class BattleParticipant {
    public playerId: number;
    public ownerInfo: WorldMapOwnerInfo;
    public front: number;
    public startArmySize: number;
    public lostUnits: number;
    public lootGoods: Good[];
    public famePoints: number;
    public xp: number;
    public kingstowersEffect: number;
    public factionPoint: number;
    public attackBoost: number;
    public woundedUnits: number;
    public isEnvironment: boolean;
    public isShadowUnit: boolean;
}

//#endregion
//#region SpyMessage
export class BasicSpyPlayerMessage extends BasicMessage {
    public isSuccessful: boolean;
    private _spyLog: SpyLog | undefined;

    public async getSpyLog(): Promise<SpyLog>;
}

export class SpyPlayerSabotageSuccessfulMessage extends BasicSpyPlayerMessage {
    public areaId: number;
    public areaType: number;
    public areaName: string;
}

export class SpyPlayerSabotageFailedMessage extends BasicSpyPlayerMessage {
    public ownerId: number;
    public areaType: number;
    public areaName: string;
    public kingdomId: number;
}

export class SpyPlayerDefenceMessage extends BasicSpyPlayerMessage {
    public ownerId: number;
    public areaType: number;
    public areaName: string;
    public kingdomId: number;
}

export class SpyPlayerEconomicMessage extends BasicSpyPlayerMessage {
    public ownerId: number;
    public areaType: number;
    public areaName: string;
    public kingdomId: number;
}

export class SpyNPCMessage extends BasicMessage {
    public isSuccessful: boolean;
    public ownerId: number;
    public areaType: number;
    public areaName: string;
    public kingdomId: number;
    private _spyLog: SpyLog | undefined;

    public async getSpyLog(): Promise<SpyLog>;
}

interface SpyLog {
    messageId: number,
    castleId: number,
    castleAppearance: number,
    spyCount: number,
    guardCount: number,
    spyAccuracy: number,
    spyRisk: number,
    targetMapObject: Mapobject,
    originOwner: WorldMapOwnerInfo,
    targetOwner: WorldMapOwnerInfo,
    spyResources?: Good[],
    armyInfo?: {
        army: {
            left: InventoryItem<Unit>[],
            middle: InventoryItem<Unit>[],
            right: InventoryItem<Unit>[],
            keep: InventoryItem<Unit>[],
            unitsKeepInventory: InventoryItem<Unit>[],
            stronghold: InventoryItem<Unit>[]
        },
        spyTime: Date,
        defenderBaron: Lord,
        defenderGeneral?: General,
        defenderLegendSkills: []
    }
}

//#endregion
//#region MarketCarriageMessage
export class MarketCarriageArrivedMessage extends BasicMessage {
    public areaName: string;
    private _tradeData: TradeData | undefined;

    public async getTradeData(): Promise<TradeData>;
}

interface TradeData {
    messageId: number,
    sourceArea: Mapobject,
    targetArea: Mapobject,
    goods: Good[],
}

//#endregion

export class BreweryMissingResourcesMessage extends BasicMessage {
    resourceName: string;
    areaId: number;
    kingdomId: number;
    areaName: string;
    areaType: number;
    breweryObjectId: number;
    breweryWodId: number;
}

export class DoubleRubiesMessage extends BasicMessage {
}

export class StarveInfoMessage extends BasicMessage {
    numberOfDesertedTroops: number;
    areaName: string;
    kingdomId: number;
    areaId: number;
    areaType: number;
    resourceName: string;
}

export class ProductionDowntimeMessage extends BasicMessage {
    downtimeStatus: number;
    messageScope: number;
}

export class PlayerGiftMessage extends BasicMessage {
    senderId: number;
    packageId: number;
    packageAmount: number;
}

export class UserSurveyMessage extends BasicMessage {
    surveyId?: number;
}

export class RebuyMessage extends BasicMessage {
    boosterId: number;
    description: string
}

export class RuinInfoMessage extends BasicMessage {
    position: Coordinate;
    remainingRuinTime: Date;
}

export class AllianceRequestMessage extends BasicMessage {
    allianceId: number;
    allianceName: string;
}

export class AttackCountThresholdMessage extends BasicMessage {
}

//#region AttackCancelledMessage
export class BasicAttackCancelledMessage extends BasicMessage {
    kingdomId: number;
    targetPlayerId: number;
    areaName: string;
    position: Coordinate;
    areaType: number;
    reason: number;
}

export class AttackCancelledAbortedMessage extends BasicAttackCancelledMessage {
}

export class AttackCancelledAutoRetreatMessage extends BasicAttackCancelledMessage {
}

export class AttackCancelledAutoRetreatEnemyMessage extends BasicAttackCancelledMessage {
}

export class SpyCancelledAbortedMessage extends AttackCancelledAbortedMessage {
}

//#endregion
//#region PrivateOfferMessage
export class BasicPrivateOfferMessage extends BasicMessage {
}

export class PrivateOfferBestsellerShopMessage extends BasicPrivateOfferMessage {
    privateOfferId: number;
    privateOfferIteration: number;
}

export class PrivateOfferDungeonChestMessage extends BasicPrivateOfferMessage {
    privateOfferId: number;
    privateOfferIteration: number;
}

export class PrivateOfferTimeChallengeMessage extends BasicPrivateOfferMessage {
    privateOfferId: number;
    privateOfferIteration: number;
}

export class PrivateOfferTippMessage extends BasicPrivateOfferMessage {
    helpMailImageId: number;
    helpMailTextId: number;
}

export class PrivateOfferWhaleChestMessage extends BasicPrivateOfferMessage {
    privateOfferId: number;
    privateOfferIteration: number;
}

//#endregion
//#region SpecialEventMessage
export class BasicSpecialEventMessage extends BasicMessage {
}

export class SpecialEventStartMessage extends BasicSpecialEventMessage {
    eventId: number;
}

export class SpecialEventUpdateMessage extends BasicSpecialEventMessage {
    eventId: number;
}

export class SpecialEventEndMessage extends BasicSpecialEventMessage {
    eventId: number;
}

export class SpecialEventMonumentResetMessage extends BasicSpecialEventMessage {
}

export class SpecialEventVIPInfoMessage extends BasicSpecialEventMessage {
    vipLevel: number;
}

export class SpecialEventHospitalCapacityExceededMessage extends BasicSpecialEventMessage {
    capacity: number
}

//#endregion
//#region AllianceWarMessage
export class BasicAllianceWarMessage extends BasicMessage {
    enemyAllianceId: number;
    enemyAllianceName: string;
}

export class AllianceWarEnemyAttackMessage extends BasicAllianceWarMessage {
    attackedPlayerId: number;
    attackedPlayerName: string;
}

export class AllianceWarEnemyDeclarationMessage extends BasicAllianceWarMessage {
    ownAllianceId: number;
    ownAllianceName: string;
}

export class AllianceWarEnemyEndMessage extends BasicAllianceWarMessage {
    ownAllianceId: number;
    ownAllianceName: string;
}

export class AllianceWarEnemySabotageMessage extends BasicAllianceWarMessage {
    sabotagedPlayerId: number;
    sabotagedPlayerName: string;
}

export class AllianceWarOwnAttackMessage extends BasicAllianceWarMessage {
    ownAllianceId: number;
    ownAllianceName: string;
}

export class AllianceWarOwnDeclarationMessage extends BasicAllianceWarMessage {
    ownAllianceLeaderId: number;
    ownAllianceLeaderName: string;
}

export class AllianceWarOwnSabotageMessage extends BasicAllianceWarMessage {
    ownAllianceId: number;
    ownAllianceName: string;
}

//#endregion
//#region ConquerableMessage
export class BasicConquerableMessage extends BasicMessage {
    areaType: number;
    ownerId: number;
    areaName: string;
    attackerPlayerId: number;
    attackerName: string;
    kingdomId: number;
}

export class ConquerableSiegeCancelledMessage extends BasicConquerableMessage {
}

export class ConquerableNewSiegeMessage extends BasicConquerableMessage {
}

export class ConquerableAreaConqueredMessage extends BasicConquerableMessage {
}

export class ConquerableAreaLostMessage extends BasicConquerableMessage {
}

//#endregion
//#region PopupMessage
export class BasicPopupMessage extends BasicMessage {
}

export class PopupFacebookConnectionMessage extends BasicPopupMessage {
}

export class PopupLoginBonusMessage extends BasicPopupMessage {
}

export class PopupRegistrationGiftMessage extends BasicPopupMessage {
    isCollectable: boolean
    nextCollectableDayReward: number
}

//#endregion
//#region AttackAdvisorMessage
export class BasicAttackAdvisorMessage extends BasicMessage {
    advisorType: { id: number, name: string };
}

export class AttackAdvisorFailedMessage extends BasicAttackAdvisorMessage {
    lordId: number;
    reasonId: number;
}

export class AttackAdvisorSummaryMessage extends BasicAttackAdvisorMessage {
    private _advisorOverviewInfo: AdvisorOverviewInfo | undefined;

    public async getAdvisorOverviewInfo(): Promise<AdvisorOverviewInfo>;
}

export interface AdvisorOverviewInfo {
    commandersAmount: number,
    lootGoods: Good[],
    costsGoods: Good[],
    lostUnitsAmount: number,
    lostToolsAmount: number,
    attacksAmountWin: number,
    attacksAmountDefeat: number,
    attacksAmountPending: number,
}

//#endregion
//#endregion
//#region Events
// TODO: Add all ActiveEvents

//#endregion
//#region Castle
/** */
export class Castle {
    kingdomId: number;
    areaType: number;
    slumLevel: number;
    buildingInfo: CastleBuildingInfo;
    /** Only available at own castles */
    unitInventory: CastleUnitInventory;
    /** Only available at own castles */
    resourceStorage: CastleResourceStorage;
    /** Only available at own castles */
    productionData: CastleProductionData;
    /** Only available at own castles */
    buildingStorage: CastleBuildingStorage;
    /** Only available at own castles */
    builderDiscount: number;
    /** Only available at own castles */
    hunterInfo: { foodBoost: number, woodStoneReduction: number };
    mapobject: Mapobject;
}

export class CastleBuildingInfo {
    public buildings: BasicBuilding[];
    public towers: BasicBuilding[];
    public gates: BasicBuilding[];
    public castleWall: BasicBuilding;
    public moat: BasicBuilding;
    public fixedPositionBuildings: BasicBuilding[];
    public mapobject: Mapobject;
    public buildingGround: BuildingGround[];
    public startPointX: number;
    public startPointY: number;
    public constructionList: ConstructionSlot[];
    public resourceFields: { food: number, stone: number, wood: number };
    public constructionItemsPerBuilding: { building: number, constructionItems: CastleConstructionItemBuilding[] }[];
}

export class BasicBuilding {
    public wodId: number;
    public objectId: number;
    public position: Coordinate;
    public isoRotation: number;
    public objectConstructionStartDate?: Date;
    public buildingState: number;
    public hitpoints: number;
    public productionBoostAtStart: number;
    public efficiency: number;
    public damageType: number;
    //public fusionXP: number;
    public productionSpeed: number;
    //public decoPoints: number;
    public isInDistrict: boolean;
    public districtSlotId: number;

    private constructor(client: BaseClient, data);
}

export class BuildingGround {
    public wodId: number;
    public objectId: number;
    public position: Coordinate;
    public isoRotation: number;
}

export class ConstructionSlot {
    public objectId: number;
    public isFree: boolean;
    public isLocked: boolean;
}

export class CastleConstructionItemBuilding {
    constructionItem: ConstructionItem;
    constructionItemId: number;
    slotIndex: number;
    slotTypeId: number;
    remainingTime?: Date;
}

export class CastleUnitInventory {
    public units: InventoryItem<Unit>[];
    public unitsTraveling: InventoryItem<Unit>[];
    public unitsInHospital: InventoryItem<Unit>[];
    public unitsInStronghold: InventoryItem<Unit>[];
    public totalShadowUnits: number;
    public travellingShadowUnits: number;
    public shadowUnits: InventoryItem<Unit>[];
}

export class CastleResourceStorage {
    public wood: Good;
    public stone: Good;
    public food: Good;
    public coal: Good;
    public oil: Good;
    public glass: Good;
    public aquamarine: Good;
    public iron: Good;
    public honey: Good;
    public mead: Good;
}

export class CastleProductionData {
    public production: Good[];
    public consumption: Good[];
    public consumptionReduction: Good[];
    public maxCapacity: Good[];
    public safeStorage: Good[];
    public productionBoost: Good[];
    public buildingProductionSpeed: {
        barracks: number, workshop: number, defenceWorkshop: number, hospital: number,
    };
    public population: number;
    public neutralDecoPoints: number;
    public riot: number;
    public sickness: number;
    public buildDurationBoost: number;
    public metropolisBoost: number;
    public guardCount: number;
    public unitStorage: number;
    public redFactionRatio?: number;
    public morality: number;
    public maxAuxiliaryCap?: number;
}

export class CastleBuildingStorage {
    globalStorage: {
        regularBuildings: InventoryItem<BasicBuilding> [],
        customBuildings: InventoryItem<BasicBuilding> [],
        uniqueBuildings: InventoryItem<BasicBuilding> [],
    }
    areaStorage: {
        regularBuildings: InventoryItem<BasicBuilding> []
    }
}

//#endregion

export class PrimeTime {
    type: number;
    premiumBonus: number;
    standardBonus: number;
    endTime: Date;
    isTimeless: boolean;
    isGlobal: boolean;

    get isActive(): boolean;
}

export class Crest {
    public backgroundType: number;
    public backgroundColor1: number;
    public backgroundColor2: number;
    public symbolPosType: number;
    public symbolType1: number;
    public symbolType2: number;
    public symbolColor1: number;
    public symbolColor2: number;
    public colors: number[];
    public colorsTwo: number[];
}

//#region Boosters
/** All types of Boosters */
type Booster =
    CastleInstructorPremiumShop |
    CastleMarauderPremiumShop |
    CastlePersonalGloryBoostShop |
    CastlePrimeDayBoostFoodPremiumShop |
    CastlePrimeDayBoostGoldPremiumShop |
    CastlePrimeDayBoostStonePremiumShop |
    CastlePrimeDayBoostWoodPremiumShop |
    CastleTaxCollectorPremiumShop |
    GallantryPointsBooster |
    KhanMedalBoosterShop |
    KhanTabletBoosterShop |
    LongTermPointEventBooster |
    RagePointBoosterShop |
    ResourceOverseerBoosterShop |
    SamuraiTokenBoosterShop |
    XPBooster;

/** */
export class PremiumBoostData {
    public boughtBuildingSlots: number
    public boughtUnitSlots: number
    public boughtToolSlots: number
    public feast: RunningFeast
    public feastCostReduction: number
    private _boosterDict: { [key: number]: Booster };
    private _activeBoosterDict: { [key: number]: Booster };
    private _resourceOverseerBoosterMap: { [key: number]: ResourceOverseerBoosterShop };

    private constructor(client: BaseClient): this

    public getBoosterById(id: number): HeroBoosterShop
}

export class RunningFeast {
    festivalType: number
    endDate: Date

    constructor(): this

    get isActive(): boolean

    get remainingTimeInSeconds(): number

    /** @param {{T: number, RT: number}} params */
    setData(params: { T: number, RT: number }): void
}

export class CastlePremiumMarketShop {
    public shopTypes = []
    public continuousPurchaseCount = 0;

    protected constructor(client: BaseClient, titleId: string, shortInfoTextId: string, buyQuestionTextId: string, costs: Good, minLevel: number): this;

    get title(): string;

    get shortInfoText(): string;

    get buyQuestionText(): string;

    get isVisible(): boolean;

    get isActive(): boolean;

    get bonus(): string;

    get listSortPriority(): number;

    get iconMcClass(): string;

    get effectIconId(): string;

    renewText(): string;
}

export class HeroBoosterShop extends CastlePremiumMarketShop {
    public endTime: Date;
    public level: number;
    public bonusValue: number;

    protected constructor(client: BaseClient, titleId: string, shortInfoTextId: string, buyQuestionTextId: string, costs: Good, heroName: string, boosterId: number, minLevel: number): this;

    public static get rebuyBonusFactor(): number;

    public get durationInSeconds(): number;

    public get remainingTimeInSeconds(): number;

    public get id(): number;

    public parseDuration(time: number): Date;
}

export class CastleInstructorPremiumShop extends HeroBoosterShop {
    protected constructor(client: BaseClient): this
}

export class CastleMarauderPremiumShop extends HeroBoosterShop {
    constructor(client: BaseClient): this;
}

export class CastlePersonalGloryBoostShop extends HeroBoosterShop {
    constructor(client: BaseClient): this;
}

export class CastlePrimeDayBoostFoodPremiumShop extends HeroBoosterShop {
    constructor(client: BaseClient): this;
}

export class CastlePrimeDayBoostGoldPremiumShop extends HeroBoosterShop {
    constructor(client: BaseClient): this;
}

export class CastlePrimeDayBoostStonePremiumShop extends HeroBoosterShop {
    constructor(client: BaseClient): this;
}

export class CastlePrimeDayBoostWoodPremiumShop extends HeroBoosterShop {
    constructor(client: BaseClient): this;
}

export class CastleTaxCollectorPremiumShop extends HeroBoosterShop {
    constructor(client: BaseClient): this;
}

export class GallantryPointsBooster extends HeroBoosterShop {
    constructor(client: BaseClient): this;
}

export class KhanMedalBoosterShop extends HeroBoosterShop {
    constructor(client: BaseClient): this;
}

export class KhanTabletBoosterShop extends HeroBoosterShop {
    constructor(client: BaseClient): this;
}

export class LongTermPointEventBooster extends HeroBoosterShop {
    constructor(client: BaseClient): this;
}

export class RagePointBoosterShop extends HeroBoosterShop {
    constructor(client: BaseClient): this;
}

export class ResourceOverseerBoosterShop extends HeroBoosterShop {
    assetType: string; // todo: type must be GameAssetType
    boostValue: number;
    restrictedFeature: string | null;

    constructor(client: BaseClient, assetType: string/* todo: type must be GameAssetType */, boostId: number, listSortPriority: number, restrictedFeature: string | null, boostValue: number, boostCostValue: number): this

    get iconBoosterClass(): string;
}

export class SamuraiTokenBoosterShop extends HeroBoosterShop {
    constructor(client: BaseClient): this;
}

export class XPBooster extends HeroBoosterShop {
    constructor(client: BaseClient): this;
}

//#endregion

//#region HighScore
/** */
export interface HighScore<Item> {
    listType: number;
    leagueId: number;
    lastRow: number;
    searchValue: string | number;
    foundRank: number;
    items: Item[];
}

export interface AllianceHighScoreItem {
    alliance: {
        allianceId: number;
        allianceName: string;
        memberAmount: number;
        allianceCurrentFame: number;
    };
    rank: number;
    points: number;
    isKingAlliance?: boolean;
    seasonRankId?: number;
    seasonMedalsData?: [number, number][];
    amountVisible?: boolean;
    highScoreTypeId: number;
}

export interface PlayerHighScoreItem {
    player?: WorldMapOwnerInfo;
    rank: number;
    points?: number;
    playerName?: string;
    playerId?: number;
    seasonRankId?: number;
    seasonMedalsData?: [number, number][];
    rawValues?: [];
    highScoreTypeId: number;
}

export type AllianceHighScoreRankingTypes =
    "honor"
    | "might"
    | "landMarks"
    | "aqua"
    | "tournamentFame"
    | "alienInvasion"
    | "nomadInvasion"
    | "samuraiInvasion"
    | "redAlienInvasion"
    | "kingdomsLeagueSeason"
    | "kingdomsLeagueSeasonEvent"
    | "daimyo"
    | "allianceBattleGroundCollector"
    | "allianceBattleGroundTower"
    | "allianceBattleGroundPreviousRun";
export type PlayerHighScoreRankingTypes =
    "achievementPoints"
    | "loot"
    | "honor"
    | "might"
    | "legendLevel"
    | "factionTournament"
    | "pointEvent"
    | "luckyWheel"
    | "alienInvasion"
    | "nomadInvasion"
    | "colossus"
    | "samuraiInvasion"
    | "longTermPointEvent"
    | "redAlienInvasion"
    | "tempServerDailyMight"
    | "tempServerGlobal"
    | "kingdomsLeagueSeason"
    | "kingdomsLeagueSeasonEvent"
    | "tempServerDailyCollector"
    | "tempServerDailyRankSwap"
    | "allianceBattleGroundCollector"
    | "SaleDaysLuckyWheel"
    | "allianceBattleGroundTower"
    | "tempServerPreviousRun"
    | "allianceBattleGroundPreviousRun"
    | "donationEvent"
    | "decoGachaEvent"
    | "christmasGachaEvent"
    | "easterGachaEvent"
    | "summerGachaEvent";

export interface LeaderboardList {
    listType: number,
    scoreId?: string,
    numScores: number,
    leagueType: number,
    items: LeaderboardListItem[]
}

export interface LeaderboardListItem {
    listType: number;
    playerName: string;
    allianceName: string;
    instanceId: number;
    points: number;
    rank: number;
    scoreId: string;
    playerId: number;
}

export interface LeaderboardSearchList {
    listType: number,
    items: LeaderboardSearchListItem[]
}

export interface LeaderboardSearchListItem {
    leagueType: number;
    scoreId: string;
}

export interface PlayerLeaderboard {
    /** Leaderboard list ID */
    listType: number,
    /** Total entries in the leaderboard */
    numScores: number,
    /** Bracket ID based on level, starting with 1 */
    leagueType: number,
    /** Requested entries */
    items: PlayerLeaderboardItem[]
}

export interface PlayerLeaderboardItem {
    playerName: string;
    /** The alliance the player is in, only set in global leaderboards */
    allianceName?: string;
    /** ID of the server the player is playing on */
    instanceId: number;
    points: number;
    rank: number;
    playerId: number;
    seasonRankId?: number;
    seasonMedalsData?: [number, number][];
}

//#endregion

//#region Quests
/** */
export class QuestData {
    private _activeQuests: Array<Quest>
    private _completedQuests: { [id: number]: Quest }

    constructor(client: BaseClient): this

    createQuest(questId: number): Quest | null

    addQuestToList(quest: Quest): void

    sort(): void

    startQuest(questId: number): void

    finishQuest(questId: number): void

    removeQuest(questId: number): void

    markQuestCompleted(questId: number): void

    getActiveQuests(): Quest[]
}

export class Quest {
    private _rawData: RawQuest;

    constructor(client: BaseClient, data: RawQuest): this

    fillProgress(data: number[]): void
}

//#endregion

//#region Constants
/** */
interface IConstants {
    ConnectionStatus: ConnectionStatus;
    LogVerbosity: LogVerbosity;
    Events: ConstantsEvents;
    Kingdom: Kingdom;
    WorldMapArea: WorldMapArea;
    MovementType: Movements;
    AllianceMemberOnlineState: AllianceMemberOnlineState;
    AllianceRank: AllianceRank;
    HorseType: HorseType;
    ServerType: ServerType;
    AttackType: AttackType;
    SpyType: SpyType;
    MessageType: MessageType;
    MessageSubType: MessageSubType;
    EquipmentRarity: EquipmentRarity;
    TitleType: TitleType;
}

interface ConnectionStatus {
    Disconnected: 0,
    Connecting: 1,
    Connected: 2,
    Disconnecting: 3,
}

interface LogVerbosity {
    Off: -1,
    Error: 0,
    Warning: 1,
    Info: 2,
    Debug: 3,
    Trace: 4
}

interface Kingdom {
    Classic: 0,
    Icecream: 2,
    Desert: 1,
    Volcano: 3,
    Island: 4,
    Faction: 10
}

interface WorldMapArea {
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

interface Movements {
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

interface HorseType {
    Coin: 0,
    Ruby_1: 1,
    Ruby_2: 2,
    Feather: 3,
}

interface AttackType {
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

interface SpyType {
    Military: 0,
    Eco: 1,
    Sabotage: 2,
}

interface AllianceMemberOnlineState {
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

interface AllianceRank {
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

interface ServerType {
    NormalServer: 1,
    TempServer: 2,
    AllianceBattleGround: 3
}

interface MessageType {
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

interface MessageSubType {
    SpyPlayer: {
        Sabotage: 0,
        Defence: 1,
        Economic: 2
    },
    ConquerableArea: {
        SiegeCancelled: 0,
        NewSiege: 1,
        AreaConquered: 2,
        AreaLost: 3
    },
    BattleLog: {
        NormalAttack: 0,
        Conquer: 1,
        NPCAttack: 2,
        Occupy: 3,
        ShadowAttack: 4
    },
    AllianceWar: {
        EnemyAttack: 0,
        EnemyDeclaration: 1,
        OwnDeclaration: 2,
        OwnAttack: 3,
        OwnSabotage: 4,
        EnemyEnd: 5,
        EnemySabotage: 6
    },
    AttackCancelled: {
        Aborted: 0,
        AutoRetreat: 1,
        AutoRetreatEnemy: 2
    },
    SpyCancelled: {
        Aborted: 0
    },
    SpecialEvent: {
        Start: 12,
        End: 13,
        VIPInfo: 16,
        HospitalCapacityExceeded: 20,
        Update: 32,
        MonumentReset: 66
    },
    PrivateOffer: {
        Tipp: 1,
        DungeonChest: 5,
        WhaleChest: 6,
        TimeChallenge: 12,
        BestsellerShop: 14
    },
    Popup: {
        RegistrationGift: 0, FacebookConnection: 1, LoginBonus: 2
    }
}

interface EquipmentRarity {
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

interface TitleType {
    UNKNOWN: 0,
    FAME: 1,
    ISLE: 2,
    FACTION: 3
}

//#endregion