import {EventEmitter} from "node:events";
import {Socket as netSocket} from 'node:net';
import {
    ConstructionItem,
    Dungeon as RawDungeon,
    Effect as RawEffect,
    Gem as RawGem,
    General as RawGeneral,
    Lord as RawLord,
    NetworkInstance,
    Unit as RawUnit
} from 'e4k-data'

export {Client, Horse, InventoryItem, MovementManager};
export const Constants: IConstants;

/** Base class for a player account */
declare class Client extends EventEmitter {
    public alliances: AllianceManager;
    public equipments: EquipmentManager;
    public movements: MovementManager;
    public players: PlayerManager;
    public worldmaps: WorldmapManager;
    private _serverInstance: NetworkInstance;
    private _socket: Socket;

    /**
     *
     * @param name Your player account name
     * @param password Your player account password
     * @param serverInstance Your player account serverInstance
     * @example ```js
     * const e4kNetworkInstances = require('e4k-data').network.instances.instance;
     * const worldNetworkInstance = e4kNetworkInstances.find(i => i.instanceLocaId === "generic_country_world");
     * const client = new Client('playername', 'password', worldNetworkInstance)
     */
    public constructor(name: string, password: string, serverInstance: NetworkInstance);

    private _language: string;

    public set language(val: string);

    public get mailMessages(): Message[];

    public set reconnectTimeout(val: number);

    /** Login with your credentials */
    public connect(): Promise<Client>;

    public sendChatMessage(message: string): void;

    public sendMailMessage(playerName: string, subject: string, message: string): void;

    public getCastleInfo(Mapobject: InteractiveMapobject): Promise<Castle>;

    public on<K extends keyof ClientEvents>(event: K, listener: (...args: ClientEvents[K]) => void): this;

    public addListener<K extends keyof ClientEvents>(event: K, listener: (...args: ClientEvents[K]) => void): this;

    public emit<K extends keyof ClientEvents>(eventName: K, ...args: ClientEvents[K]): boolean;

    private __x__x__relogin(): Promise<void>;
}

declare class Socket extends netSocket {
    public client: Client;
    public debug: boolean;
}

//#region Managers
declare class BaseManager extends EventEmitter {
    private _client: Client;
    private _socket: Socket;

    protected constructor(client: Client);
}

declare class AllianceManager extends BaseManager {
    private constructor(client: Client);

    public getById(id: number): Promise<Alliance>;

    public find(name: string): Promise<Alliance>;

    public getMyAlliance(): Promise<MyAlliance>;

    private _add_or_update(_alliance: Alliance | MyAlliance): void;
}

declare class EquipmentManager extends BaseManager {
    private constructor(client: Client);

    public set autoDeleteAtOrBelowRarity(rarity: number);

    public getCommandants(): Lord[];

    /**
     * Returns Array with all idle commandants.
     */
    public getAvailableCommandants(): Lord[];

    public getBarons(): Lord[];

    public getGenerals(): General[];

    public getEquipmentInventory(): (Equipment | RelicEquipment)[];

    public sellEquipment(equipment: Equipment | RelicEquipment): Promise<void>;

    public sellAllEquipmentsAtOrBelowRarity(rarity: number): Promise<void>;

    private _setCommandantsAndBarons(barons: Lord[], commandants: Lord[]): void;

    private _setGenerals(generals: General[]): void;

    private _setEquipmentInventory(equipments: (Equipment | RelicEquipment)[]): void;

    private _autoSellEquipment(e: Equipment | RelicEquipment): Promise<void>;
}

declare class MovementManager extends BaseManager {
    private constructor(client: Client);

    public static getDistance(castle1: Mapobject, castle2: Mapobject): number;

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
}

declare class PlayerManager extends BaseManager {
    private _thisPlayerId: number;

    private constructor(client: Client);

    public getById(id: number): Promise<Player>;

    public find(name: string): Promise<Player>;

    public getThisPlayer(): Promise<Player>;

    private _add_or_update(_player: Player): void;

    private _setThisPlayer(id: number): void;
}

declare class WorldmapManager extends BaseManager {
    private _worldmapCaches: { date: Date, worldmap: Worldmap }[];

    public get(kingdomId: number, noCache = false): Promise<Worldmap>;

    getSector(kingdomId: number, positionX: number, positionY: number): Promise<WorldmapSector>;
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

declare class BasicMovement {
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

    protected constructor(client: Client, data: object);
}

declare class ArmyAttackMovement extends BasicMovement {
    public army?: CompactArmy;
    public armyState: number;
    public attackType: number;
    public guessedSize?: number;
    public isForceCancelable: boolean;
    public isShadowMovement: boolean;

    protected constructor(client: Client, data);
}

declare class ArmyTravelMovement extends BasicMovement {
    public army: InventoryItem<Unit>[];
    public goods?: Good[];

    protected constructor(client: Client, data);
}

declare class ConquerMovement extends BasicMovement {
    public army: InventoryItem<Unit>[];

    protected constructor(client: Client, data);
}

declare class MarketMovement extends BasicMovement {
    public goods: Good[];
    public carriages: number;

    protected constructor(client: Client, data);
}

declare class NpcAttackMovement extends ArmyAttackMovement {

}

declare class SpyMovement extends BasicMovement {
    public spyType: number;
    public spyCount: number;
    public spyRisk: number;
    public spyAccuracy?: number;
    public sabotageDamage?: number;

    protected constructor(client: Client, data);
}

declare class InventoryItem<T> {
    item: T;
    count: number;

    constructor(item: T, count: number);
}

declare class ArmyWave {
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

declare class Horse {
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

    constructor(client: Client, castleData, horseType: number);
}

//#endregion

//#region Alliance
/**
 *
 */
declare class Alliance {
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

    protected constructor(client: Client, data);

    public get landmarks(): Promise<(CapitalMapobject | KingstowerMapobject | MetropolMapobject | MonumentMapobject)[]>;

    private set _landmarks(value: (CapitalMapobject | MonumentMapobject | KingstowerMapobject)[]);

    private _add_or_update_landmarks(landmarks: Mapobject[]): void;
}

declare class MyAlliance extends Alliance {
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

declare class AllianceMember {
    public playerId: number;
    public playerName: string;
    public playerLevel: number;
    public paragonLevel: number;
    public alliance: Alliance;
    public allianceRank: number;
    public donations?: AllianceDonations;
    public activityStatus?: number;

    private constructor(client: Client, data, alliance: Alliance);
}

declare class AllianceStatusListItem {
    public allianceId: number;
    public allianceName: string;
    public allianceStatus: number;
    public allianceStatusConfirmed: boolean;

    private constructor(client: Client, data);
}

declare class AllianceDonations {
    public coins: number
    public rubies: number;
    public res: number;

    private constructor(client: Client, data: Array<number>);
}

declare class ChatMessage {
    public message: string;
    public sendDate: Date;
    public senderPlayerId: number;
    public senderPlayerName: string;
}

//#endregion

declare class CompactArmy {
    public left: InventoryItem<Unit>[];
    public middle: InventoryItem<Unit>[];
    public right: InventoryItem<Unit>[];
    public supportTools: InventoryItem<Tool>[];
    public armySize: number;
    public soldierCount: number;
    public toolCount: number;

    private constructor(client: Client, data: object);
}

declare class Coordinate {
    public X: number;
    public Y: number;

    private constructor(client: Client, data);
}

declare class Good extends InventoryItem<string> {
    private constructor(client: Client, data: [string, number]);
}

//#region Lord and Equipment
/**
 *
 */
declare class Lord {
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

declare class General {
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

declare class Equipment {
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

declare class RelicEquipment {
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

declare class Gem {
    public id: number;
    public setId?: number;
    public effects: Effect[];
    public attachedEquipment?: Equipment;
    public rawData: RawGem;
}

declare class RelicGem {
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

declare class Effect {
    public effectId: number;
    public power: number;
    public name: string;
    public capId: number;
    public uncappedPower: number;
    public rawData: RawEffect;
}

declare class RelicEffect extends Effect {
    public relicEffectId: number;
}

declare class Player {
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
    public castles: (CastleMapobject | CapitalMapobject | {
        areaType: number,
        position: Coordinate,
        objectId: number,
        kingdomId: number
    })[];
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

declare class Unit {
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

    constructor(client: Client, wodId: number);
}

declare class Tool extends Unit {

}

declare class Worldmap {
    public kingdomId: number;
    public mapobjects: Mapobject[];
    public players: Player[];

    private _addAreaMapObjects(objs: Mapobject[]): void;

    private _addPlayers(): void;

    private _sortPlayersByName(): Player[];

    private _sortPlayersById(): Player[];

    private _clear(): void;
}

declare class WorldmapSector extends Worldmap {
    public combine(...sectors: WorldmapSector[]): WorldmapSector
}

//#region Mapobject
/** */
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

declare class AlienInvasionMapobject extends BasicMapobject {
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

declare class BasicMapobject {
    public areaType: number;
    public position: Coordinate;
    public mapId?: number;
    public kingdomId?: number;

    protected constructor(client: Client, data: Array<string | number | object>);

    protected parseAreaInfoBattleLog(data): this;
}

declare class BossDungeonMapobject extends BasicMapobject {
    public lastSpyDate?: Date;
    public dungeonLevel: number;
    public attackCooldownEnd?: Date;
    public defeaterPlayerId: number;
    public kingdomId: number;
}

declare class CapitalMapobject extends BasicMapobject {
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

declare class CastleMapobject extends InteractiveMapobject {

}

declare class DungeonIsleMapobject extends BasicMapobject {
    public isleId: number;
    public lastSpyDate?: Date;
    public attackCount: number;
    public attackCooldownEnd?: Date;
    public reappearDate?: Date;
    public kingdomId: number;
    public isVisibleOnMap: boolean;
}

declare class DungeonMapobject extends BasicMapobject {
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

declare class DynamicMapobject extends BasicMapobject {

}

declare class EmptyMapobject extends BasicMapobject {

}

declare class EventDungeonMapobject extends BasicMapobject {
    public lastSpyDate?: Date;
    public dungeonLevel: number;
    public isDefeated: boolean;
}

declare class InteractiveMapobject extends BasicMapobject {
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

declare class InvasionMapObject extends BasicMapobject {
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
    public keepLevel: number;
    public wallLevel: number;
    public towerLevel: number;
    public gateLevel: number;
    public moatLevel: number;
}

declare class KingstowerMapobject extends BasicMapobject {
    public objectId: number;
    public ownerId: number;
    public customName: string;
    public lastSpyDate?: Date;
    public kingdomId: number;
}

declare class MonumentMapobject extends BasicMapobject {
    public objectId: number;
    public occupierId: number;
    public monumentType: number;
    public monumentLevel: number;
    public customName: string;
    public lastSpyDate?: Date;
    public kingdomId: number;
}

declare class MetropolMapobject extends CapitalMapobject {
}

declare class NomadInvasionMapObject extends InvasionMapObject {
}

declare class NomadKhanInvasionMapObject extends InvasionMapObject {
    public allianceCampId: number;
    public totalCooldown: number;
    public skipCost: number;
}

declare class RedAlienInvasionMapobject extends AlienInvasionMapobject {
    public eventId: number;
}

declare class ResourceIsleMapobject extends BasicMapobject {
    public objectId: number;
    public occupierId: number;
    public isleId: number;
    public customName: string;
    public lastSpyDate?: Date;
    public kingdomId: number;
    public occupationFinishedDate: Date;
}

declare class ShapeshifterMapobject extends BasicMapobject {
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

declare class VillageMapobject extends BasicMapobject {
    public objectId: number;
    public occupierId: number;
    public villageType: number;
    public customName: string;
    public lastSpyDate?: Date;
    public kingdomId: number;
    public wallLevel: number;
    public gateLevel: number;
    public keepLevel: number;
    public unitWallCount: number;
    public peasants: number;
    public guards: number;
    public productivityWoodBoost: number;
    public productivityStoneBoost: number;
    public productivityFoodBoost: number;
}

//#endregion
//#region Message
/** All types of MailMessages */
type Message =
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
    | StarveInfoMessage
    | AttackCancelledAbortedMessage
    | AttackCancelledAutoRetreatMessage
    | AttackCancelledAutoRetreatEnemyMessage
    | SpyCancelledAbortedMessage
    | ProductionDowntimeMessage
    | PlayerGiftMessage
    | UserSurveyMessage
    | RebuyMessage
    | SpecialEventStartMessage
    | SpecialEventUpdateMessage
    | SpecialEventVIPInfoMessage
    | SpecialEventMonumentResetMessage
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
    | ConquerableAreaLostMessage;

declare class BasicMessage {
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

    protected constructor(client: Client, data: Array<any>);

    protected init(): Promise<void>;
}

declare class AllianceNewsMessage {
    public subject: string;
    public body: string;
}

declare class UserMessage {
    public subject: string;
    public body: string;
}

//#region BattleLogMessage
declare class BasicBattleLogMessage {
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
    public battleLog: BattleLog;
}

declare class BattleLogConquerMessage extends BasicBattleLogMessage {
}

declare class BattleLogNormalAttackMessage extends BasicBattleLogMessage {
}

declare class BattleLogNPCAttackMessage extends BasicBattleLogMessage {
}

declare class BattleLogOccupyMessage extends BasicBattleLogMessage {
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
    players: Player[],
    defWon: number,
    honor: number,
    survivalRate: number,
    ragePoints: number,
    shapeshifterPoints: number,
    shapeshifterId: number,
    rewardEquipment?: Equipment | RelicEquipment,
    rewardGemId?: Gem,
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
    isTempServerChargeAttack: boolean,
    winnerChargeRankOld: number,
    winnerChargeRankNew: number,
    winnerChargePointsOld: number,
    winnerChargePointsNew: number,
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
}

declare class BattleLogUnit<Unit> extends InventoryItem<Unit> {
    lost: number;

    constructor(item: Unit, count: number, lost: number);
}

declare class BattleLogArmyWave {
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

declare class BattleParticipant {
    public playerId: number;
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
declare class BasicSpyPlayerMessage extends BasicMessage {
    public spyLog: SpyLog;
    public isSuccessful: boolean;
}

declare class SpyPlayerSabotageSuccessfulMessage extends BasicSpyPlayerMessage {
    public areaId: number;
    public areaType: number;
    public areaName: string;
}

declare class SpyPlayerSabotageFailedMessage extends BasicSpyPlayerMessage {
    public ownerId: number;
    public areaType: number;
    public areaName: string;
    public kingdomId: number;
}

declare class SpyPlayerDefenceMessage extends BasicSpyPlayerMessage {
    public ownerId: number;
    public areaType: number;
    public areaName: string;
    public kingdomId: number;
}

declare class SpyPlayerEconomicMessage extends BasicSpyPlayerMessage {
    public ownerId: number;
    public areaType: number;
    public areaName: string;
    public kingdomId: number;
}

declare class SpyNPCMessage extends BasicMessage {
    public spyLog: SpyLog;
    public isSuccessful: boolean;
    public ownerId: number;
    public areaType: number;
    public areaName: string;
    public kingdomId: number;
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
    originOwner: Player,
    targetOwner: Player,
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
    },
    shapeshifterId?: number,
}

//#endregion
//#region MarketCarriageMessage
declare class MarketCarriageArrivedMessage extends BasicMessage {
    areaName: string;
    tradeData: TradeData;
}

interface TradeData {
    messageId: number,
    players: Player[],
    sourceArea: WorldmapArea,
    targetArea: WorldmapArea,
    goods: Good[],
}

//#endregion

declare class StarveInfoMessage extends BasicMessage {
    numberOfDesertedTroops: number;
    areaName: string;
    kingdomId: number;
    areaId: number;
    areaType: number;
    resourceName: string;
}

declare class ProductionDowntimeMessage extends BasicMessage {
    downtimeStatus: number;
    messageScope: number;
}

declare class PlayerGiftMessage extends BasicMessage {
    senderId: number;
    packageId: number;
    packageAmount: number;
}

declare class UserSurveyMessage extends BasicMessage {
    surveyId?: number;
}

declare class RebuyMessage extends BasicMessage {
    boosterId?: number;
}

//#region AttackCancelledMessage
declare class BasicAttackCancelledMessage extends BasicMessage {
    kingdomId: number;
    targetPlayerId: number;
    areaName: string;
    position: Coordinate;
    areaType: number;
    reason: number;
}

declare class AttackCancelledAbortedMessage extends BasicAttackCancelledMessage {
}

declare class AttackCancelledAutoRetreatMessage extends BasicAttackCancelledMessage {
}

declare class AttackCancelledAutoRetreatEnemyMessage extends BasicAttackCancelledMessage {
}

declare class SpyCancelledAbortedMessage extends AttackCancelledAbortedMessage {
}

//#endregion
//#region PrivateOfferMessage
declare class BasicPrivateOfferMessage extends BasicMessage {
}

declare class PrivateOfferBestsellerShopMessage extends BasicPrivateOfferMessage {
    privateOfferId: number;
    privateOfferIteration: number;
}

declare class PrivateOfferDungeonChestMessage extends BasicPrivateOfferMessage {
    privateOfferId: number;
    privateOfferIteration: number;
}

declare class PrivateOfferTimeChallengeMessage extends BasicPrivateOfferMessage {
    privateOfferId: number;
    privateOfferIteration: number;
}

declare class PrivateOfferTippMessage extends BasicPrivateOfferMessage {
    helpMailImageId: number;
    helpMailTextId: number;
}

declare class PrivateOfferWhaleChestMessage extends BasicPrivateOfferMessage {
    privateOfferId: number;
    privateOfferIteration: number;
}

//#endregion
//#region SpecialEventMessage
declare class BasicSpecialEventMessage extends BasicMessage {
}

declare class SpecialEventStartMessage extends BasicSpecialEventMessage {
    eventId: number;
}

declare class SpecialEventUpdateMessage extends BasicSpecialEventMessage {
    eventId: number;
}

declare class SpecialEventMonumentResetMessage extends BasicSpecialEventMessage {
}

declare class SpecialEventVIPInfoMessage extends BasicSpecialEventMessage {
    vipLevel: number;
}

//#endregion
//#region AllianceWarMessage
declare class BasicAllianceWarMessage extends BasicMessage {
    enemyAllianceId: number;
    enemyAllianceName: string;
}

declare class AllianceWarEnemyAttackMessage extends BasicAllianceWarMessage {
    attackedPlayerId: number;
    attackedPlayerName: string;
}

declare class AllianceWarEnemyDeclarationMessage extends BasicAllianceWarMessage {
    ownAllianceId: number;
    ownAllianceName: string;
}

declare class AllianceWarEnemyEndMessage extends BasicAllianceWarMessage {
    ownAllianceId: number;
    ownAllianceName: string;
}

declare class AllianceWarEnemySabotageMessage extends BasicAllianceWarMessage {
    sabotagedPlayerId: number;
    sabotagedPlayerName: string;
}

declare class AllianceWarOwnAttackMessage extends BasicAllianceWarMessage {
    ownAllianceId: number;
    ownAllianceName: string;
}

declare class AllianceWarOwnDeclarationMessage extends BasicAllianceWarMessage {
    ownAllianceLeaderId: number;
    ownAllianceLeaderName: string;
}

declare class AllianceWarOwnSabotageMessage extends BasicAllianceWarMessage {
    ownAllianceId: number;
    ownAllianceName: string;
}

//#endregion
//#region ConquerableMessage
declare class BasicConquerableMessage extends BasicMessage {
    areaType: number;
    ownerId: number;
    areaName: string;
    attackerPlayerId: number;
    attackerName: string;
    kingdomId: number;
}

declare class ConquerableSiegeCancelledMessage extends BasicConquerableMessage {
}

declare class ConquerableNewSiegeMessage extends BasicConquerableMessage {
}

declare class ConquerableAreaConqueredMessage extends BasicConquerableMessage {
}

declare class ConquerableAreaLostMessage extends BasicConquerableMessage {
}

//#endregion
//#endregion
//#region Events
/**
 *
 */
interface ClientEvents {
    serverShutdown: [];
    serverShutdownEnd: [];
    connected: [];
    chatMessage: [message: ChatMessage];
    mailMessageAdd: [message: Message];
    mailMessageRemove: [message: Message];
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
}

//#endregion
//#region Castle
/**
 *
 */
declare class Castle {
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
    hunterInfo: {
        foodBoost: number, woodStoneReduction: number
    };
    mapobject: Mapobject;
    owner: Player;
}

declare class CastleBuildingInfo {
    public buildings: BasicBuilding[];
    public towers: BasicBuilding[];
    public gates: BasicBuilding[];
    public castleWall: BasicBuilding;
    public moat: BasicBuilding;
    public fixedPositionBuildings: BasicBuilding[];
    public owner: Player;
    public mapobject: Mapobject;
    public buildingGround: BuildingGround[];
    public startPointX: number;
    public startPointY: number;
    public constructionList: ConstructionSlot[];
    public resourceFields: { food: number, stone: number, wood: number };
    public constructionItemsPerBuilding: { building: number, constructionItems: CastleConstructionItemBuilding[] }[];
}

declare class BasicBuilding {
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
    //public fusionXP: number;
    public productionSpeed: number;
    //public decoPoints: number;
    public isInDistrict: boolean;
    public districtSlotId: number;

    private constructor(client: Client, data);
}

declare class BuildingGround {
    public wodId: number;
    public objectId: number;
    public position: Coordinate;
    public isoRotation: number;
}

declare class ConstructionSlot {
    public objectId: number;
    public isFree: boolean;
    public isLocked: boolean;
}

declare class CastleConstructionItemBuilding {
    constructionItem: ConstructionItem;
    constructionItemId: number;
    slotIndex: number;
    slotTypeId: number;
    remainingTime?: Date;
}

declare class CastleUnitInventory {
    public units: InventoryItem<Unit>[];
    public unitsTraveling: InventoryItem<Unit>[];
    public unitsInHospital: InventoryItem<Unit>[];
    public unitsInStronghold: InventoryItem<Unit>[];
    public totalShadowUnits: number;
    public travellingShadowUnits: number;
    public shadowUnits: InventoryItem<Unit>[];
}

declare class CastleResourceStorage {
    public wood: number;
    public stone: number;
    public food: number;
    public coal: number;
    public oil: number;
    public glass: number;
    public aquamarine: number;
    public iron: number;
    public honey: number;
    public mead: number;
}

declare class CastleProductionData {
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

declare class CastleBuildingStorage {
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

//#region Constants
/**
 *
 */
interface IConstants {
    Events: ConstantsEvents;
    Kingdom: Kingdom;
    WorldmapArea: WorldmapArea;
    MovementType: Movements;
    AllianceMemberOnlineState: AllianceMemberOnlineState;
    AllianceRank: AllianceRank;
    HorseType: HorseType;
    ServerType: ServerType;
    SpyType: SpyType;
    MessageType: MessageType;
    EquipmentRarity: EquipmentRarity;
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

//#endregion