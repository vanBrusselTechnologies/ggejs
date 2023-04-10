import {EventEmitter} from "node:events";
import net from 'node:net';
import {
    Dungeon as RawDungeon,
    Effect as RawEffect,
    Gem as RawGem,
    Lord as RawLord,
    NetworkInstance,
    Unit as RawUnit
} from 'e4k-data'

/** Base class for a playeraccount */
class Client extends EventEmitter {
    /**
     *
     * @param name Your player account name
     * @param password Your player account password
     * @param serverInstance Your player account serverInstance
     * @example ```js
     * const networkInstances = require('e4k-data').network.instances.instance;
     * const worldNetworkInstance = networkInstances.find(i => i.instanceLocaId === "generic_country_world");
     * const client = new Client('playername', 'password', worldNetworkInstance)
     */
    public constructor(name: string, password: string, serverInstance: NetworkInstance);

    private _serverInstance: NetworkInstance;
    private _socket: Socket;

    /** Login with your credentials */
    public connect(): Promise<Client>;

    private __x__x__relogin(): Promise<void>;

    public alliances: AllianceManager;
    public equipments: EquipmentManager;
    public movements: MovementManager;
    public players: PlayerManager;
    public worldmaps: WorldmapManager;

    public sendChatMessage(message: string): void;

    public set reconnectTimeout(val: number);

    public on<K extends keyof ClientEvents>(event: K, listener: (...args: ClientEvents[K]) => void): this;

    public addListener<K extends keyof ClientEvents>(event: K, listener: (...args: ClientEvents[K]) => void): this;

    emit<K extends keyof ClientEvents>(eventName: K, ...args: ClientEvents[K]): boolean;

    ///
    ///No typings yet
    ///
    private getCastleInfo(Mapobject: Mapobject): Promise<any>;

    ///
    ///
    ///
}

private class Socket extends net.Socket {
    public client: Client;
    public debug: boolean;
}

//#region Managers
class BaseManager extends EventEmitter {
    private _client: Client;

    protected constructor(client: Client);
}

class AllianceManager extends BaseManager {
    private constructor(client: Client);

    public getById(id: number): Promise<Alliance>;

    public find(name: string): Promise<Alliance>;

    private _add_or_update(_alliance: Alliance | MyAlliance): void;

    public getMyAlliance(): Promise<MyAlliance>;
}

class EquipmentManager extends BaseManager {
    private constructor(client: Client);

    private _setCommandantsAndBarons(barons: Lord[], commandants: Lord[]): void;

    public getCommandants(): Lord[];

    /**
     * Returns Array with all idle commandants.
     */
    public getAvailableCommandants(): Lord[];

    public getBarons(): Lord[];

    public getGenerals(): [];
}

class MovementManager extends BaseManager {
    private constructor(client: Client);

    public on<K extends keyof MovementEvents>(event: K, listener: (...args: MovementEvents[K]) => void): this;

    public addListener<K extends keyof MovementEvents>(event: K, listener: (...args: MovementEvents[K]) => void): this;

    emit<K extends keyof MovementEvents>(eventName: K, ...args: MovementEvents[K]): boolean;

    /** Returns all movements */
    public get(): Movement[];

    public startAttackMovement(castleFrom: InteractiveMapobject | CapitalMapobject, castleTo: Mapobject, army: ArmyWave[], lord: Lord, horse?: Horse): void;

    public startSpyMovement(castleFrom: InteractiveMapobject | CapitalMapobject, castleTo: Mapobject, spyCount: number, spyType: number, spyEffect: number, horse?: Horse): void;

    public startMarketMovement(castleFrom: InteractiveMapobject | CapitalMapobject, castleTo: Mapobject, goods: Good[], horse?: Horse): void;

    private _add_or_update(_movements: Movement[]): void;

    private _remove(_movementId: number): void;

    public static getDistance(castle1: BasicMapobject, castle2: BasicMapobject): number;
}

class PlayerManager extends BaseManager {
    private constructor(client: Client);

    private _thisPlayerId: number;

    public getById(id: number): Promise<Player>;

    public find(name: string): Promise<Player>;

    private _add_or_update(_player: Player): void;

    public getThisPlayer(): Promise<Player>;

    private _setThisPlayer(id: number): void;
}

class WorldmapManager extends BaseManager {
    private _worldmapCaches: { date: Date, worldmap: Worldmap }[];

    public get(kingdomId: number): Promise<Worldmap>;

    getSector(kingdomId: number, sectorX: number, sectorY: number): Promise<WorldmapSector>;
}

//#endregion

//#region Movement
/**
 *
 */
type Movement =
    BasicMovement
    | ArmyAttackMovement
    | ArmyTravelMovement
    | ConquerMovement
    | MarketMovement
    | NpcAttackMovement
    | SpyMovement;

class BasicMovement {
    protected constructor(client: Client, data: object);

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
}

class ArmyAttackMovement extends BasicMovement {
    protected constructor(client: Client, data);

    public army?: CompactArmy;
    public armyState: number;
    public attackType: number;
    public guessedSize?: number;
    public isForceCancelable: boolean;
    public isShadowMovement: boolean;
}

class ArmyTravelMovement extends BasicMovement {
    protected constructor(client: Client, data);

    public army: InventoryItem<Unit>[];
    public goods?: Good[];
}

class ConquerMovement extends BasicMovement {
    protected constructor(client: Client, data);

    public army: InventoryItem<Unit>[];
}

class MarketMovement extends BasicMovement {
    protected constructor(client: Client, data);

    public goods: Good[];
    public carriages: number;
}

class NpcAttackMovement extends ArmyAttackMovement {

}

class SpyMovement extends BasicMovement {
    protected constructor(client: Client, data);

    public spyType: number;
    public spyCount: number;
    public spyRisk: number;
    public spyAccuracy?: number;
    public sabotageDamage?: number;
}

class InventoryItem<T> {
    constructor(item: T, count: number);

    item: T;
    count: number;
}

class ArmyWave {
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

class Horse {
    async constructor(client: Client, castleData, horseType: number);

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
}

//#endregion

//#region Alliance
class Alliance {
    protected constructor(client: Client, data);

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

    public get landmarks(): Promise<(CapitalMapobject | KingstowerMapobject | MetropolMapobject | MonumentMapobject)[]>;

    private set _landmarks(value: (CapitalMapobject | MonumentMapobject | KingstowerMapobject)[]);

    private _add_or_update_landmarks(landmarks: Mapobject[]): void;
}

class MyAlliance extends Alliance {
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
}

class AllianceMember {
    private constructor(client: Client, data, alliance: Alliance);

    public playerId: number;
    public playerName: string;
    public playerLevel: number;
    public paragonLevel: number;
    public alliance: Alliance;
    public allianceRank: number;
    public donations?: AllianceDonations;
    public activityStatus?: number;
}

class AllianceStatusListItem {
    private constructor(client: Client, data);

    public allianceId: number;
    public allianceName: string;
    public allianceStatus: number;
    public allianceStatusConfirmed: boolean;
}

class AllianceDonations {
    private constructor(client: Client, data: Array<number>);

    public coins: number
    public rubies: number;
    public res: number;
}

class ChatMessage {
    public message: string;
    public sendDate: Date;
    public senderPlayerId: number;
    public senderPlayerName: string;
}

//#endregion

class BasicBuilding {
    private constructor(client: Client, data);

    public wodId: number;
    public objectId: number;
    public position: Coordinate;
    public isoRotation: number;
    public objectConstructionStartTime?: Date;
    public buildingState: number;
    public hitpoints: number;
    public productionBoostAtStart: number;
    public efficiency: number;
    public damageType: number;
    //public decoPoints: number;
    //public fusionXP: number;
    public productionSpeed: number;
    public isInDistrict: boolean;
    public districtSlotId: number;
}

class CompactArmy {
    private constructor(client: Client, data: object);

    public left: InventoryItem<Unit>[];
    public middle: InventoryItem<Unit>[];
    public right: InventoryItem<Unit>[];
    public supportTools: InventoryItem<Tool>[];
    public armySize: number;
    public soldierCount: number;
    public toolCount: number;
}

class Coordinate {
    private constructor(client: Client, data);

    public X: number;
    public Y: number;
}

class Good extends InventoryItem<string> {
    private constructor(client: Client, data: [string, number]);
}

//#region Lord and Equipment
class Lord {
    public id: number;
    public isDummy: boolean;
    public name: string;
    public wins: number;
    public defeats: number;
    public winSpree: number;
    public equipments: Equipment[] | RelicEquipment[];
    public isRelic?: boolean;
    public gems: Gem[] | RelicGem[];
    public effects: Effect[] | RelicEffect[];
    public wearerId: number;
    public pictureId: number;
    public attachedCastleId?: number;
    public rawData: RawLord;
}

class Equipment {
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

class RelicEquipment {
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

class Gem {
    public id: number;
    public setId?: number;
    public effects: Effect[];
    public attachedEquipment?: Equipment;
    public rawData: RawGem;
}

class RelicGem {
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

class Effect {
    public effectId: number;
    public power: number;
    public name: string;
    public capId: number;
    public uncappedPower: number;
    public rawData: RawEffect;
}

class RelicEffect extends Effect {
    public relicEffectId: number;
}

class Player {
    public playerId: number;
    public isDummy: boolean;
    public playerName: string;
    public playerLevel: number;
    public paragonLevel: number;
    public noobEndTime?: Date;
    public honor: number;
    public famePoints: number;
    public highestFamePoints: number;
    public isRuin: boolean;
    public allianceId: number;
    public allianceName: string;
    public allianceRank: number;
    public isSearchingAlliance: number;
    public peaceEndTime?: Date;
    public castles: (CastleMapobject | CapitalMapobject)[];
    public villages: {
        public: {
            village: VillageMapobject,
            units?: InventoryItem<Unit>[]
        }[],
        private: { privateVillageId: number, uniqueId: number }[]
    };
    public kingsTowers: {
        kingstower: KingstowerMapobject;
        units?: InventoryItem<Unit>[];
    }[];
    public monuments: {
        monument: MonumentMapobject;
        units?: InventoryItem<Unit>[];
    }[];
    public hasPremiumFlag: boolean;
    public might: number;
    public achievementPoints: number;
    public prefixTitleId: number;
    public suffixTitleId: number;
    public relocateDurationEndTime?: Date;
    public factionId?: number;
    public factionMainCampId?: number;
    public factionIsSpectator?: boolean;
    public factionProtectionStatus?: number;
    public factionProtectionEndTime?: Date;
    public factionNoobProtectionEndTime?: Date;
}

class Unit {
    private constructor(client: Client, wodId: number);

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
}

class Tool extends Unit {

}

class Worldmap {
    public kingdomId: number;
    public mapobjects: Mapobject[];
    public players: Player[];

    private _addAreaMapObjects(objs: Mapobject[]): void;

    private _addPlayers(): void;

    private _sortPlayersByName(): Player[];

    private _sortPlayersById(): Player[];

    private _clear(): void;
}

class WorldmapSector extends Worldmap {
    public combine(...sectors: WorldmapSector): WorldmapSector
}

//#region Mapobject
type Mapobject =
    BasicMapobject
    | AlienInvasionMapobject
    | BossDungeonMapobject
    | CapitalMapobject
    | CastleMapobject
    | DungeonMapobject
    | DungeonIsleMapobject
    | DynamicMapobject
    | EmptyMapobject
    | EventDungeonMapobject
    | InteractiveMapobject
    | KingstowerMapobject
    | MetropolMapobject
    | MonumentMapobject
    | NomadInvasionMapObject
    | NomadKhanInvasionMapObject
    | RedAlienInvasionMapobject
    | ResourceIsleMapobject
    | ShapeshifterMapobject
    | VillageMapobject;

class AlienInvasionMapobject extends BasicMapobject {
    public dungeonLevel: number;
    public hasPeaceMode: boolean;
    public wallLevel: number;
    public gateLevel: number;
    public moatLevel: number;
    public wasRerolled: boolean;
    public lastSpyDate?: Date;
    public travelDistance: number;
    public eventId: number;
}

class BasicMapobject {
    protected constructor(client: Client, data: Array<any>);

    public areaType: number;
    public position: Coordinate;
}

class BossDungeonMapobject extends BasicMapobject {
    public lastSpyDate?: Date;
    public dungeonLevel: number;
    public attackCooldownEnd?: Date;
    public defeaterPlayerId: number;
    public kingdomId: number;
}

class CapitalMapobject extends BasicMapobject {
    public objectId: number;
    public ownerId: number;
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
    public kingdomId: number;
    public depletionTimeEnd?: Date;
    public influencePoints: number;
}

class CastleMapobject extends InteractiveMapobject {

}

class DungeonIsleMapobject extends BasicMapobject {
    public isleId: number;
    public lastSpyDate?: Date;
    public attackCount: number;
    public attackCooldownEnd?: Date;
    public reappearDate?: Date;
    public kingdomId: number;
    public isVisibleOnMap: boolean;
}

class DungeonMapobject extends BasicMapobject {
    private _rawData: RawDungeon;
    public lastSpyDate?: Date;
    public attackCount: number;
    public attackCooldownEnd?: Date;
    public kingdomId: number;
    public level: number;
    public resources: number;
    public coins: number;
    public rubies: number;
    public rubyProbability: number;
    public wallWodId: number;
    public gateWodId: number;
    public guards: number;
    public xp: number;
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

class DynamicMapobject extends BasicMapobject {

}

class EmptyMapobject extends BasicMapobject {

}

class EventDungeonMapobject extends BasicMapobject {
    public lastSpyDate?: Date;
    public dungeonLevel: number;
    public isDefeated: boolean;
}

class InteractiveMapobject extends BasicMapobject {
    public objectId: number;
    public ownerId: number;
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
    public kingdomId: number;
    public outpostType: number;
}

class KingstowerMapobject extends BasicMapobject {
    public objectId: number;
    public ownerId: number;
    public customName: string;
    public lastSpyDate?: Date;
    public kingdomId: number;
}

class MonumentMapobject extends BasicMapobject {
    public objectId: number;
    public occupierId: number;
    public monumentType: number;
    public monumentLevel: number;
    public customName: string;
    public lastSpyDate?: Date;
    public kingdomId: number;
}

class MetropolMapobject extends CapitalMapobject {

}

class NomadInvasionMapObject extends BasicMapobject {
    public lastSpyDate?: Date;
    public attackCooldownEnd?: Date;
    public victoryCount: number;
    public difficultyCampId: number;
    public baseWallBonus: number;
    public baseGateBonus: number;
    public baseMoatBonus: number;
    public isVisibleOnMap: boolean;
    public eventId: number;
    public travelDistance: number;
}

class NomadKhanInvasionMapObject extends BasicMapobject {
    public lastSpyDate?: Date;
    public allianceCampId: number;
    public attackCooldownEnd?: Date;
    public totalCooldown: number;
    public skipCost: number;
    public victoryCount: number;
    public difficultyCampId: number;
    public baseWallBonus: number;
    public baseGateBonus: number;
    public baseMoatBonus: number;
    public isVisibleOnMap: boolean;
    public eventId: number;
    public travelDistance: number;
}

class RedAlienInvasionMapobject extends AlienInvasionMapobject {
    public eventId: number;
}

class ResourceIsleMapobject extends BasicMapobject {
    public objectId: number;
    public occupierId: number;
    public isleId: number;
    public customName: string;
    public lastSpyDate?: Date;
    public kingdomId: number;
    public occupationFinishedDate: Date;
}

class ShapeshifterMapobject extends BasicMapobject {
    public kingdomId: number;
    public campLevel: number;
    public lastSpyDate?: Date;
    public playerAttacked: boolean;
    public shapeshifterAttacked: boolean;
    public shapeshifterId: number;
    public keepLevel: number;
    public wallLevel: number;
    public gateLevel: number;
    public towerLevel: number;
    public moatLevel: number;
    public eventId: number;
    public travelDistance: number;
}

class VillageMapobject extends BasicMapobject {
    public objectId: number;
    public occupierId: number;
    public villageType: number;
    public customName: string;
    public lastSpyDate?: Date;
    public kingdomId: number;
}

//#endregion

//#region Events
interface ClientEvents {
    serverShutdown: [];
    serverShutdownEnd: [];
    connected: [];
    chatMessage: [message: ChatMessage]
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
}

//#endregion

//#region Constants
/**
 *
 */
interface Constants {
    Events: ConstantsEvents;
    Kingdom: Kingdom;
    WorldmapArea: WorldmapArea;
    MovementType: Movements;
    AllianceMemberOnlineState: AllianceMemberOnlineState;
    AllianceRank: AllianceRank;
    HorseType: HorseType;
    ServerType: ServerType;
    SpyType: SpyType;
}

interface Kingdom {
    Classic: 0,
    Icecream: 2,
    Desert: 1,
    Volcano: 3,
    Island: 4,
    Faction: 10
}

interface WorldmapArea {
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
    Shapeshifter: 36,
}

interface Movements {
    Attack: 0,
    Travel: 2,
    Spy: 3,
    Market: 4,
    Conquer: 5,
}

interface HorseType {
    Coin: 0,
    Ruby_1: 1,
    Ruby_2: 2,
    Feather: 3,
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

//#endregion

export {Client, Constants, Horse, InventoryItem, MovementManager}