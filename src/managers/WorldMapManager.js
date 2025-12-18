'use strict'

const {collectorEventOptions, kingdoms, landmarks} = require('e4k-data').data;
const BaseManager = require('./BaseManager');
const {getArea} = require("../commands/gaa");
const Coordinate = require("../structures/Coordinate");
const Crest = require("../structures/Crest");
const WorldMap = require('../structures/WorldMap');
const WorldMapOwnerInfo = require("../structures/WorldMapOwnerInfo");
const WorldMapSector = require('../structures/WorldMapSector');
const EmpireError = require("../tools/EmpireError");
const Localize = require("../tools/Localize");
const {ConnectionStatus} = require("../utils/Constants");
const ConstantsCrest = require("../utils/ConstantsCrest");
const ConstantsGeneral = require("../utils/ConstantsGeneral");
const ConstantsColors = require("../utils/ConstantsColors");
const ConstantsIsland = require("../utils/ConstantsIslands");
const ConstantsThornKing = require("../utils/ConstantsThornKing");
const ConstantsUnderworld = require("../utils/ConstantsUnderworld");
const DungeonConst = require("../utils/DungeonConst");
const FactionConstClient = require("../utils/FactionConstClient");
const OutpostConst = require("../utils/OutpostConst");
const SeaqueenConstants = require("../utils/SeaqueenConstants");
const VillageConst = require("../utils/VillageConst");
const WorldMapOwnerInfoData = require("../utils/WorldMapOwnerInfoData");

class WorldMapManager extends BaseManager {
    _ownerInfoData = new WorldMapOwnerInfoData(this._client);

    /** @param {BaseClient} client */
    constructor(client) {
        super(client);
        loadNPCOwnerInfo(this._client, this._ownerInfoData);
        this._ownerInfoData.isInitialized = true;
    }

    /**
     * Returns the complete worldMap, use {@link getSector} if only part of it is needed
     * @param {number} kingdomId Only kingdoms you have a castle in are valid
     */
    async get(kingdomId) {
        try {
            return await _getWorldMapById(this._client, new WorldMap(this._client, kingdomId), kingdomId);
        } catch (errorCode) {
            throw new EmpireError(this._client, errorCode)
        }
    };

    /**
     * Returns a 100x100 area of a certain worldMap with center centerX/centerY
     * @param {number} kingdomId Only kingdoms you have a castle in are valid
     * @param {number} centerX X coordinate that will be the center of sector
     * @param {number} centerY Y coordinate that will be the center of sector
     */
    async getSector(kingdomId, centerX, centerY) {
        try {
            return await _getWorldMapSector(this._client, kingdomId, centerX, centerY);
        } catch (errorCode) {
            throw new EmpireError(this._client, errorCode)
        }
    }
}

/**
 * @param {BaseClient} client
 * @param {WorldMap} _worldMap
 * @param {number} kingdomId
 */
async function _getWorldMapById(client, _worldMap, kingdomId) {
    if (!_worldMap) throw "Missing worldMap";
    _worldMap._clear();
    const worldMapSize = 15;
    for (let i = 0; i < worldMapSize * worldMapSize; i++) {
        if (client.socketManager.connectionStatus !== ConnectionStatus.Connected) break;
        const col = Math.floor(i / worldMapSize) * 100 + 50;
        const row = i % worldMapSize * 100 + 50;
        _worldMap._addAreaMapObjects((await _getWorldMapSector(client, kingdomId, col, row)).mapObjects);
    }
    return _worldMap;
}

/**
 * Returns a 100x100 worldMapSector
 * @param {BaseClient} client
 * @param {number} kingdomId
 * @param {number} x
 * @param {number} y
 */
async function _getWorldMapSector(client, kingdomId, x, y) {
    const data = await _getWorldMapSectorData(client, kingdomId, x, y);
    return new WorldMapSector(client, kingdomId, data);
}

/**
 * Returns a 100x100 worldMapSector
 * @param {BaseClient} client
 * @param {number} kingdomId
 * @param {number} x
 * @param {number} y
 * @returns {Promise<Mapobject[]>}
 */
async function _getWorldMapSectorData(client, kingdomId, x, y) {
    const bottomLeft = new Coordinate([x - 50, y - 50]);
    const topRight = new Coordinate([x + 49, y + 49]);
    return await getArea(client, kingdomId, bottomLeft, topRight);
}

/**
 * @param {BaseClient} client
 * @param {WorldMapOwnerInfoData} ownerInfoData
 */
function loadNPCOwnerInfo(client, ownerInfoData) {
    for (let i = 0; i < 13; i++) {
        /*WorldMapOwnerInfoVO.setNamesFactory(kingdomSkinNamesFactory,"dungeon_playerName");*/
        ownerInfoData.addOwnerInfo(createWorldMapOwnerInfo(client, DungeonConst.getDungeonOwnerId(0, i), null, "dungeon_playerName", ConstantsCrest.ROBBER_BARON_CREST, true));
    }

    const defaultLandmarkLevel = landmarks.find(l => l.isDefault === 1).defaultLevel

    let kingdomId = 0;
    const npcCapitalOwnerInfo = createWorldMapOwnerInfo(client, OutpostConst.getCapitalDefaultOwnerFor(kingdomId), defaultLandmarkLevel, "capital", ConstantsCrest.getKingdomCrest(kingdomId), true);
    npcCapitalOwnerInfo.isOutpostOwner = true;
    //npcCapitalOwnerInfo.setNamesFactory(kingdomSkinNamesFactory, "capital");
    ownerInfoData.addOwnerInfo(npcCapitalOwnerInfo);
    kingdomId = 1;
    while (kingdomId < 4) {
        const kingdomMinLevel = kingdoms.find(k => k.kID === kingdomId).minLevel;
        const dungeonOwnerId = DungeonConst.getDungeonOwnerId(kingdomId, 0);
        const villageOwnerInfo = createWorldMapOwnerInfo(client, VillageConst.getVillageDefaultOwnerId(kingdomId), kingdomMinLevel, `kingdom_dungeon_playerName_${dungeonOwnerId}`, ConstantsCrest.getKingdomCrest(kingdomId), true);
        //villageOwnerInfo.setNamesFactory(kingdomSkinNamesFactory, `kingdom_dungeon_playerName_${dungeonOwnerId}`);
        ownerInfoData.addOwnerInfo(villageOwnerInfo);
        const npcCapitalOwnerInfo = createWorldMapOwnerInfo(client, OutpostConst.getCapitalDefaultOwnerFor(kingdomId), defaultLandmarkLevel, "capital", ConstantsCrest.getKingdomCrest(kingdomId), true);
        npcCapitalOwnerInfo.isOutpostOwner = true;
        //npcCapitalOwnerInfo.setNamesFactory(kingdomSkinNamesFactory, "capital");
        ownerInfoData.addOwnerInfo(npcCapitalOwnerInfo);
        const kingdomDungeonOwnerInfo = createWorldMapOwnerInfo(client, dungeonOwnerId, null, `kingdom_dungeon_playerName_${dungeonOwnerId}`, ConstantsCrest.getKingdomCrest(kingdomId), true);
        //kingdomDungeonOwnerInfo.setNamesFactory(kingdomSkinNamesFactory, `kingdom_dungeon_playerName_${dungeonOwnerId}`);
        ownerInfoData.addOwnerInfo(kingdomDungeonOwnerInfo);
        const bossDungeonOwnerId = DungeonConst.getBossDungeonOwnerId(kingdomId);
        const bossDungeonOwnerInfo = createWorldMapOwnerInfo(client, bossDungeonOwnerId, kingdomMinLevel, `kingdom_boss_dungeon_playerName_${bossDungeonOwnerId}`, ConstantsCrest.getKingdomCrest(kingdomId), true);
        //bossDungeonOwnerInfo.setNamesFactory(kingdomSkinNamesFactory, `kingdom_boss_dungeon_playerName_${bossDungeonOwnerId}`);
        ownerInfoData.addOwnerInfo(bossDungeonOwnerInfo);
        kingdomId++;
    }
    const outpostOwnerInfo = createWorldMapOwnerInfo(client, -300, 5, "outpost", ConstantsCrest.CLASSIC_KINGDOM_CREST, true);
    outpostOwnerInfo.isOutpostOwner = true;
    //outpostOwnerInfo.setNamesFactory(kingdomSkinNamesFactory, "outpost");
    ownerInfoData.addOwnerInfo(outpostOwnerInfo);
    const shadowCampOwnerInfo = createWorldMapOwnerInfo(client, -333, null, "shadowUnitOwner", ConstantsCrest.SHADOW_CREST, false);
    //shadowCampOwnerInfo.setNamesFactory(kingdomSkinNamesFactory, "shadowUnitOwner");
    ownerInfoData.addOwnerInfo(shadowCampOwnerInfo);
    const kingstowerOwnerInfo = createWorldMapOwnerInfo(client, -450, defaultLandmarkLevel, "kingstower", ConstantsCrest.CLASSIC_KINGDOM_CREST, true);
    //kingstowerOwnerInfo.setNamesFactory(kingdomSkinNamesFactory, "kingstower");
    ownerInfoData.addOwnerInfo(kingstowerOwnerInfo);
    const metropolisOwnerInfo = createWorldMapOwnerInfo(client, -440, defaultLandmarkLevel, "metropol", ConstantsCrest.CLASSIC_KINGDOM_CREST, true);
    metropolisOwnerInfo.isOutpostOwner = true;
    //metropolisOwnerInfo.setNamesFactory(kingdomSkinNamesFactory, "metropol");
    ownerInfoData.addOwnerInfo(metropolisOwnerInfo);

    ownerInfoData.addOwnerInfo(createWorldMapOwnerInfo(client, -223, null, "kingdom_dungeon_playerName_NPC_223", ConstantsIsland.NPC_CREST, true));
    ownerInfoData.addOwnerInfo(createWorldMapOwnerInfo(client, ConstantsIsland.NPC_ID_ISLAND_VILLAGE, null, "kingdom_dungeon_playerName_NPC_223", ConstantsIsland.NPC_CREST, true));

    let factionId = 1;
    const faction1OwnerInfo = createWorldMapOwnerInfo(client, -410 - factionId, null, "red_faction_short", FactionConstClient.getCrestByFactionId(factionId), true);
    faction1OwnerInfo.factionId = factionId;
    ownerInfoData.addOwnerInfo(faction1OwnerInfo);
    factionId = 0;
    const faction0OwnerInfo = createWorldMapOwnerInfo(client, -410 - factionId, null, "blue_faction_short", FactionConstClient.getCrestByFactionId(factionId), true);
    faction0OwnerInfo.factionId = factionId;
    ownerInfoData.addOwnerInfo(faction0OwnerInfo);

    const invasionCrest = (function (bgColor, symbolType, symbolColor) {
        const crest = new Crest(client, null);
        crest.backgroundColor1 = bgColor;
        crest.backgroundType = 0;
        crest.symbolColor1 = symbolType;
        crest.symbolPosType = 1;
        crest.symbolType1 = symbolColor;
        crest.fillClipColor();
        return crest;
    });
    ownerInfoData.addOwnerInfo(createWorldMapOwnerInfo(client, -601, -1, "nomad_playerName", invasionCrest(ConstantsColors.NOMAD_BACKGROUND, 100009, ConstantsColors.NOMAD_SYMBOL), true));
    ownerInfoData.addOwnerInfo(createWorldMapOwnerInfo(client, -801, -1, "nomad_playerName", invasionCrest(ConstantsColors.NOMAD_BACKGROUND, 100009, ConstantsColors.NOMAD_SYMBOL), true));
    ownerInfoData.addOwnerInfo(createWorldMapOwnerInfo(client, -651, -1, "samurai_playerName", invasionCrest(ConstantsColors.SAMURAI_BACKGROUND, 100010, ConstantsColors.SAMURAI_SYMBOL), true));
    ownerInfoData.addOwnerInfo(createWorldMapOwnerInfo(client, -811, -1, "daimyo_playerName", invasionCrest(ConstantsColors.SAMURAI_BACKGROUND, 100010, ConstantsColors.SAMURAI_SYMBOL), true));
    ownerInfoData.addOwnerInfo(createWorldMapOwnerInfo(client, -815, -1, "daimyo_playerName", invasionCrest(ConstantsColors.SAMURAI_BACKGROUND, 100010, ConstantsColors.SAMURAI_SYMBOL), true));
    ownerInfoData.addOwnerInfo(createWorldMapOwnerInfo(client, -1000, -1, "alienInvasion_playerName_short", invasionCrest(ConstantsColors.ALIEN_BACKGROUND, 999, ConstantsColors.ALIEN_SYMBOL), true));
    ownerInfoData.addOwnerInfo(createWorldMapOwnerInfo(client, -1001, -1, "samurai_playerName", invasionCrest(ConstantsColors.SAMURAI_BACKGROUND, 100010, ConstantsColors.SAMURAI_SYMBOL), true));
    ownerInfoData.addOwnerInfo(createWorldMapOwnerInfo(client, -1002, -1, "redAlienInvasion_playerName", invasionCrest(ConstantsColors.RED_ALIEN_BACKGROUND, 100012, ConstantsColors.RED_ALIEN_SYMBOL), true));

    ownerInfoData.addOwnerInfo(createWorldMapOwnerInfo(client, 1234, null, "dialog_treasureMap_DungeonOwner", ConstantsCrest.ROBBER_BARON_CREST, true));

    ownerInfoData.addOwnerInfo(createWorldMapOwnerInfo(client, -500, null, "dungeon_playerName_RandomDungeonEvent", ConstantsCrest.ROBBER_BARON_CREST, true));
    ownerInfoData.addOwnerInfo(createWorldMapOwnerInfo(client, -502, null, "dungeon_playerName_RandomDungeonEvent", ConstantsCrest.ROBBER_BARON_CREST, true));

    ownerInfoData.addOwnerInfo(createWorldMapOwnerInfo(client, -460, defaultLandmarkLevel, "monument", ConstantsCrest.CLASSIC_KINGDOM_CREST, true));

    ownerInfoData.addOwnerInfo(createWorldMapOwnerInfo(client, -703, null, `dialog_seasonEvent_${4}_DungeonOwner`, SeaqueenConstants.NPC_CREST, true));
    ownerInfoData.addOwnerInfo(createWorldMapOwnerInfo(client, -704, null, `dialog_seasonEvent_${4}_DungeonOwner`, SeaqueenConstants.NPC_CREST, true));
    ownerInfoData.addOwnerInfo(createWorldMapOwnerInfo(client, -702, null, `dialog_seasonEvent_${2}_DungeonOwner`, ConstantsThornKing.NPC_CREST, true));
    ownerInfoData.addOwnerInfo(createWorldMapOwnerInfo(client, -700, null, `dialog_seasonEvent_${2}_DungeonOwner`, ConstantsThornKing.NPC_CREST, true));
    ownerInfoData.addOwnerInfo(createWorldMapOwnerInfo(client, -701, null, `dialog_seasonEvent_${2}_DungeonOwner`, ConstantsThornKing.NPC_CREST, true));
    ownerInfoData.addOwnerInfo(createWorldMapOwnerInfo(client, -706, null, `dialog_seasonEvent_${64}_DungeonOwner`, ConstantsUnderworld.NPC_CREST, true));
    ownerInfoData.addOwnerInfo(createWorldMapOwnerInfo(client, -707, null, `dialog_seasonEvent_${64}_DungeonOwner`, ConstantsUnderworld.NPC_CREST, true));

    ownerInfoData.addOwnerInfo(createWorldMapOwnerInfo(client, -1201, -1, `wolfgard_playerName`, ConstantsGeneral.NPC_CREST_WOLFKING, true));

    const allianceRaidCrest = (function () {
        const crest = new Crest(client, null);
        crest.backgroundColor1 = ConstantsColors.ALLIANCE_RAID_PORTAL_BACKGROUND_1;
        crest.backgroundColor2 = ConstantsColors.ALLIANCE_RAID_PORTAL_BACKGROUND_2;
        crest.backgroundType = 3;
        crest.symbolColor1 = ConstantsColors.ALLIANCE_RAID_PORTAL_SYMBOL;
        crest.symbolPosType = 1;
        crest.symbolType1 = 101110;
        crest.fillClipColor();
        return crest;
    });
    ownerInfoData.addOwnerInfo(createWorldMapOwnerInfo(client, -1202, -1, `dialogue_are_title`, allianceRaidCrest(), true));

    for (const collectorEventOption of collectorEventOptions) {
        const collectorEventSkinName = collectorEventOption.collectorEventSkinName;
        const colors = collectorEventOption.crestColors.split(',').map(c => parseInt(c, 16));
        const crest = (function () {
            const _loc2_ = new Crest(client, null);
            _loc2_.backgroundType = 0;
            _loc2_.backgroundColor1 = colors.length > 1 ? colors[1] : 0;
            _loc2_.symbolPosType = 1;
            _loc2_.symbolType1 = collectorEventOption.crestType;
            _loc2_.symbolColor1 = colors.length > 0 ? colors[0] : 0;
            _loc2_.fillClipColor();
            return _loc2_;
        })();
        const playerNameTextId = `dialog_collector_battlelog_attackerName_0_${collectorEventSkinName}`;
        const collectorOwnerInfo = createWorldMapOwnerInfo(client, -1100 - collectorEventOption.collectorEventOptionID, -1, playerNameTextId, crest, false);
        const staticAreaNameTextId = `collector_event_camp_${collectorEventSkinName}`;
        collectorOwnerInfo.staticAreaName = Localize.text(client, staticAreaNameTextId);
        if (collectorOwnerInfo.playerName === playerNameTextId) collectorOwnerInfo.playerName = Localize.text(client, `dialog_collector_battlelog_attackerName_0_${collectorEventSkinName.toLowerCase()}`);
        if (collectorOwnerInfo.staticAreaName === staticAreaNameTextId) collectorOwnerInfo.staticAreaName = Localize.text(client, `collector_event_camp_${collectorEventSkinName.toLowerCase()}`);
        ownerInfoData.addOwnerInfo(collectorOwnerInfo);
    }
}

/**
 * @param {BaseClient} client
 * @param {number} playerId
 * @param {number|null} playerLevel
 * @param {string} playerNameTextId
 * @param {Crest} crest
 * @param {boolean} isNPC
 */
function createWorldMapOwnerInfo(client, playerId, playerLevel, playerNameTextId, crest, isNPC) {
    const wmOwnerInfo = new WorldMapOwnerInfo(client);
    wmOwnerInfo.playerId = playerId;
    if (playerLevel) wmOwnerInfo.playerLevel = playerLevel;
    wmOwnerInfo.playerName = Localize.text(client, playerNameTextId);
    wmOwnerInfo.crest = crest;
    wmOwnerInfo.isNPC = isNPC;
    return wmOwnerInfo;
}

module.exports = WorldMapManager;