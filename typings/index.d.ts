import { EventEmitter } from "node:events";
import { Socket } from 'node:net';

/** Base class for an playeraccount */
export class Client extends EventEmitter {
    public constructor(name: string, password: string);
    private _socket: Socket;
    /** Login with your credentials */
    public connect(): Promise<Client>;
    public movements: MovementManager;
    public alliances: AllianceManager;
    public players: PlayerManager;
    public worldmaps: WorldmapManager;
    public sendChatMessage(message: string): void;
    public on<K extends keyof ClientEvents>(event: K, listener: (...args: ClientEvents[K]) => void): this;
    public addListener<K extends keyof ClientEvents>(event: K, listener: (...args: ClientEvents[K]) => void): this;
    emit<K extends keyof ClientEvents>(eventName: K, ...args: ClientEvents[K]): boolean;
}

//#region Managers
export class BaseManager extends EventEmitter {
    private _client: Client;
    protected constructor(client: Client);
}

export class MovementManager extends BaseManager {
    private constructor(client: Client);
    public on<K extends keyof MovementEvents>(event: K, listener: (...args: MovementEvents[K]) => void): this;
    public addListener<K extends keyof MovementEvents>(event: K, listener: (...args: MovementEvents[K]) => void): this;
    emit<K extends keyof MovementEvents>(eventName: K, ...args: MovementEvents[K]): boolean;
    /** Returns all movements */
    public get(): Movement[];
    private _add_or_update(_movements: Movement[]): void;
}

export class AllianceManager extends BaseManager {
    private constructor(client: Client);
    public getById(id: number): Promise<Alliance>;
    public find(name: string): Promise<Alliance>;
    private _add_or_update(_alliance: Alliance | MyAlliance): void;
    public getMyAlliance(): Promise<MyAlliance>;
}

export class PlayerManager extends BaseManager {
    private constructor(client: Client);
    public getById(id: number): Promise<Player>;
    public find(name: string): Promise<Player>;
    private _add_or_update(_player: Player): void;
    public getThisPlayer(): Promise<Player>;
    private _setThisPlayer(val: number): void;
}

export class WorldmapManager extends BaseManager {
    private _worldmapCaches: { date: Date, worldmap: Worldmap }[];
    public get(kingdomId: number): Promise<Worldmap>;
}
//#endregion

//#region Movement
export type Movement = BasicMovement | ArmyAttackMovement | ArmyTravelMovement | ConquerMovement | MarketMovement | SpyMovement;

export class BasicMovement {
    protected constructor(client: Client, data);
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

export class ArmyAttackMovement extends BasicMovement {
    private constructor(client: Client, data);
    public army: CompactArmy;
    public armyState: number;
    public attackType: number;
    public guessedSize: number;
    public isForceCancelable: boolean;
    public isShadowMovement: boolean;
}

export class ArmyTravelMovement extends BasicMovement {
    private constructor(client: Client, data);
    public army: { unit: Unit, count: number }[];
    public goods?: Good[];
}

export class ConquerMovement extends BasicMovement {
    private constructor(client: Client, data);
    public army: { unit: Unit, count: number }[];
}

export class MarketMovement extends BasicMovement {
    private constructor(client: Client, data);
    public goods: Good[];
    public carriages: number;
}

export class SpyMovement extends BasicMovement {
    private constructor(client: Client, data);
    public spyType: number;
    public spyCount: number;
    public spyRisk: number;
    public spyAccuracy?: number;
    public sabotageDamage?: number;
}
//#endregion

//#region Alliance
export class Alliance {
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
    private _add_or_update_landmarks(landmarks: Mapobject[]): void;
}

export class MyAlliance extends Alliance {
    private constructor(client: Client, data);
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
}

export class AllianceMember {
    private constructor(client: Client, data);
    public playerId: number;
    public playerName: string;
    public playerLevel: number;
    public paragonLevel: number;
    public alliance: Alliance;
    public allianceRank: number;
    public donations?: AllianceDonations;
    public activityStatus?: number;
}

export class AllianceStatusListItem {
    private constructor(client: Client, data);
    public allianceId: number;
    public allianceName: string;
    public allianceStatus: number;
    public allianceStatusConfirmed: boolean;
}

export class AllianceDonations {
    private constructor(client: Client, data);
    public coins: number
    public rubies: number;
    public res: number;
}

export class ChatMessage {
    public message: string;
    public sendDate: Date;
    public senderPlayerId: number;
    public senderPlayerName: string;
}
//#endregion

export class CompactArmy {
    private constructor(client: Client, data);
    public left: { unit: Unit, count: number }[];
    public middle: { unit: Unit, count: number }[];
    public right: { unit: Unit, count: number }[];
    public supportTools: { unit: Unit, count: number }[];
    public armySize: number;
    public soldierCount: number;
    public toolCount: number;
}

export class Good {
    public name: string;
    public count: number;
}

//#region Lord and Equipment
export class Lord {
    public id: number;
    public name: string;
    public wins: number;
    public defeats: number;
    public winSpree: number;
    public equipments: Equipment[] | RelicEquipment[];
    public isRelic?: boolean;
    public gems: Gem[] | RelicGem[];
    public effects: Effect[];
    public wearerId: number;
    public pictureId: number;
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
}

export class RelicEffect extends Effect {
    public relicEffectId: number;
    public power: number;
}

export class Player {
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
    public castles: CastleMapobject[] | CapitalMapobject[];
    public villages: {
        public: {
            village: VillageMapobject,
            units?: { unit: Unit, count: number }[]
        }[]
        private: { privateVillageId: number, uniqueId: number }[]
    };
    public kingstowers: {
        kingstower: KingstowerMapobject;
        units?: { unit: Unit, count: number }[];
    }[];
    public monuments: {
        monument: MonumentMapobject;
        units?: { unit: Unit, count: number }[];
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

export class Unit {
    private constructor(client: Client, wodId: number);
    public wodId: number;
    public isSoldier: boolean;
}

export class Worldmap {
    public kingdomId: number;
    public mapobjects: Mapobject[];
    private _addAreaMapObjects(objs: Mapobject[]): void;
    private _clear(): void;
}

//#region Mapobject
export type Mapobject = BasicMapobject | AlienInvasionMapobject | BossDungeonMapobject | CapitalMapobject | CastleMapobject | DungeonMapobject | DungeonIsleMapobject | DynamicMapobject | EmptyMapobject | InteractiveMapobject | KingstowerMapobject | MetropolMapobject | MonumentMapobject | NomadInvasionMapObject | NomadKhanInvasionMapObject | ResourceIsleMapobject | VillageMapobject;

export class AlienInvasionMapobject extends BasicMapobject {
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

export class BasicMapobject {
    public areaType: number;
    public position: { X: number, Y: number };
}

export class BossDungeonMapobject extends BasicMapobject {
    public lastSpyDate?: Date;
    public dungeonLevel: number;
    public attackCooldownEnd?: Date;
    public defeaterPlayerId: number;
    public kingdomId: number;
}

export class CapitalMapobject extends BasicMapobject {
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

export class CastleMapobject extends InteractiveMapobject {

}

export class DungeonMapobject extends BasicMapobject {
    public lastSpyDate?: Date;
    public attackCount: number;
    public attackCooldownEnd?: Date;
    public kingdomId: number;
}

export class DungeonIsleMapobject extends BasicMapobject {
    public isleId: number;
    public lastSpyDate?: Date;
    public attackCount: number;
    public attackCooldownEnd?: Date;
    public reappearDate?: Date;
    public kingdomId: number;
    public isVisibleOnMap: boolean;
}

export class DynamicMapobject extends BasicMapobject {

}

export class EmptyMapobject extends BasicMapobject {

}

export class InteractiveMapobject extends BasicMapobject {
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

export class KingstowerMapobject extends BasicMapobject {
    public objectId: number;
    public ownerId: number;
    public customName: string;
    public lastSpyDate?: Date;
    public kingdomId: number;
}

export class MonumentMapobject extends BasicMapobject {
    public objectId: number;
    public occupierId: number;
    public monumentType: number;
    public monumentLevel: number;
    public customName: string;
    public lastSpyDate?: Date;
    public kingdomId: number;
}

export class MetropolMapobject extends CapitalMapobject {

}

export class NomadInvasionMapObject extends BasicMapobject {
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

export class NomadKhanInvasionMapObject extends BasicMapobject {
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

export class ResourceIsleMapobject extends BasicMapobject {
    public objectId: number;
    public occupierId: number;
    public isleId: number;
    public customName: string;
    public lastSpyDate?: Date;
    public kingdomId: number;
    public occupationFinishedDate: Date;
}

export class VillageMapobject extends BasicMapobject {
    public objectId: number;
    public occupierId: number;
    public villageType: number;
    public customName: string;
    public lastSpyDate?: Date;
    public kingdomId: number;
}
//#endregion


//#region Events
export interface ClientEvents {
    serverShutdown: [];
    connected: [];
    chatMessage: [message: ChatMessage]
}

export interface MovementEvents {
    movementAdd: [movement: Movement];
    movementUpdate: [oldMovement: Movement, newMovement: Movement];
    movementCancelled: [movement: Movement];
}

export interface ConstantsEvents {
    /** Equivalent of MOVEMENT_ADD */
    MOVEMENT_NEW: "movementAdd";
    MOVEMENT_ADD: "movementAdd";
    MOVEMENT_UPDATE: "movementUpdate";
    MOVEMENT_CANCEL: "movementCancelled";
    SERVER_SHUTDOWN: "serverShutdown";
    CONNECTED: "connnected";
    CHAT_MESSAGE: "chatMessage";
}
//#endregion

export const Constants: {
    Events: ConstantsEvents;
    Kingdom: Kingdom;
    WorldmapArea: WorldmapArea;
    Movement: Movement;
}

export interface Kingdom {
    Classic: 0,
    Icecream: 2,
    Dessert: 1,
    Volcano: 3,
    Island: 4,
    Faction: 10
}

export interface WorldmapArea {
    Empty: 0;
    MainCastle: 1;
    Dungeon: 2;
    Capital: 3;
    Outpost: 4;
    VillageMapobject: 10;
    BossDungeon: 11;
    KingdomCastle: 12;
    AlienInvasion: 21;
    Metropol: 22;
    Kingstower: 23;
    ResourceIsle: 24;
    DungeonIsle: 25;
    Monument: 26;
    NomadInvasion: 27;
    Dynamic: 31;
    NomadKhanInvasion: 35;
}

export interface Movement {
    Attack: 0;
    Travel: 2;
    Spy: 3;
    Market: 4;
    Conquer: 5;
}