'use strict'

const e4kData = require('e4k-data').data
const BaseManager = require('./BaseManager');
const {execute: getWorldmap} = require('../e4kserver/commands/getWorldmap');
const {WaitUntil} = require('../tools/wait');
const Worldmap = require('../structures/Worldmap');
const WorldmapSector = require('../structures/WorldmapSector');
const Coordinate = require("../structures/Coordinate");
const Localize = require("../tools/Localize");
const WorldMapOwnerInfoData = require("../utils/WorldMapOwnerInfoData");
const WorldmapOwnerInfo = require("../structures/WorldmapOwnerInfo");
const ConstantsIsland = require("../utils/ConstantsIslands");
const DungeonConst = require("../utils/DungeonConst");
const ConstantsCrest = require("../utils/ConstantsCrest");
const VillageConst = require("../utils/VillageConst");
const OutpostConst = require("../utils/OutpostConst");
const Crest = require("../structures/Crest");
const ConstantsColors = require("../utils/ConstantsColors");
const SeaqueenConstants = require("../utils/SeaqueenConstants");
const ConstantsThornKing = require("../utils/ConstantsThornKing");
const ConstantsUnderworld = require("../utils/ConstantsUnderworld");
const FactionConstClient = require("../utils/FactionConstClient");
const ConstantsGeneral = require("../utils/ConstantsGeneral");

const kingdomIds = [0, 1, 2, 3, 4, 10]

class WorldmapManager extends BaseManager {
    _ownerInfoData = new WorldMapOwnerInfoData(this._client);

    /**
     * @param {Client} client
     */
    constructor(client) {
        super(client);
        loadNPCOwnerInfo(this._client, this._ownerInfoData)
        this._ownerInfoData.isInitialized = true
    }

    get _socket() {
        if (super._socket[`__worldmap_0_searching_sectors`] == null) {
            for (const id of kingdomIds) {
                super._socket[`__worldmap_${id}_searching_sectors`] = [];
            }
        }
        return super._socket;
    }

    /**
     * Requests the complete worldmap, use {@link getSector} if only part of it is needed
     * @param {number} kingdomId Only kingdoms you have a castle in are valid
     * @returns {Promise<Worldmap>}
     */
    get(kingdomId) {
        return new Promise(async (res, rej) => {
            try {
                res(await _getWorldmapById(this, new Worldmap(this._client, kingdomId), kingdomId));
            } catch (e) {
                rej(e.toString().startsWith('errorCode_') ? Localize.text(this._client, e.toString()) : e)
            }
        })
    };

    /**
     * Requests a 100x100 area of a certain worldmap with center centerX/centerY
     * @param {number} kingdomId Only kingdoms you have a castle in are valid
     * @param {number} centerX X coordinate that will be the center of sector
     * @param {number} centerY Y coordinate that will be the center of sector
     * @returns {Promise<WorldmapSector>} 100x100 WorldmapSector
     */
    getSector(kingdomId, centerX, centerY) {
        return new Promise(async (res, rej) => {
            try {
                res(await _getWorldmapSector(this, kingdomId, centerX, centerY));
            } catch (e) {
                rej(e.toString().startsWith('errorCode_') ? Localize.text(this._client, e.toString()) : e)
            }
        })
    }
}

/**
 *
 * @param {WorldmapManager} thisManager
 * @param {Worldmap} _worldmap
 * @param {number} kingdomId
 * @returns {Promise<Worldmap>}
 */
function _getWorldmapById(thisManager, _worldmap, kingdomId) {
    if (!_worldmap) return new Promise((resolve, reject) => reject("missing worldmap"));
    _worldmap._clear();
    return new Promise(async (resolve, reject) => {
        try {
            const worldmapSize = 15;
            for (let i = 0; i < worldmapSize * worldmapSize; i++) {
                if (!thisManager._socket["__connected"]) break;
                const col = Math.floor(i / worldmapSize) * 100 + 50;
                const row = i % worldmapSize * 100 + 50;
                _worldmap._addAreaMapObjects((await _getWorldmapSector(thisManager, kingdomId, col, row)).mapobjects);
            }
            resolve(_worldmap);
        } catch (e) {
            reject(e);
        }
    });
}

/**
 * Returns a 100x100 worldmapsector
 * @param {WorldmapManager} thisManager
 * @param {number} kingdomId
 * @param {number} x
 * @param {number} y
 * @param {number} tries
 * @returns {Promise<WorldmapSector>}
 */
function _getWorldmapSector(thisManager, kingdomId, x, y, tries = 0) {
    return new Promise(async (resolve, reject) => {
        const socket = thisManager._socket;
        try {
            if (!socket["__connected"]) reject('Client disconnected');
            socket[`__worldmap_${kingdomId}_searching_sectors`].push({x: x, y: y});
            if (!socket[`__worldmap_${kingdomId}_specific_sector_${x}_${y}_searching`]) {
                socket[`__worldmap_${kingdomId}_specific_sector_${x}_${y}_searching`] = true;
                const bottomLeft = new Coordinate(socket.client, [x - 50, y - 50]);
                const topRight = new Coordinate(socket.client, [x + 49, y + 49]);
                getWorldmap(socket, kingdomId, bottomLeft, topRight);
            }
            /** @type {{worldmapAreas: Mapobject[]}} */
            const data = await (async () => {
                try {
                    return await Promise.any([
                        WaitUntil(socket, `__worldmap_${kingdomId}_specific_sector_${x}_${y}_data`, `__worldmap__error`, 2500),
                        WaitUntil(socket, `__worldmap_${kingdomId}_empty`, `__worldmap__error`, 2500)
                    ])
                } catch (/** @type {AggregateError}*/e) {
                    if (e.errors[0] === "Exceeded max time!") {
                        try {
                            if (tries < 3) return resolve(await _getWorldmapSector(thisManager, kingdomId, x, y, tries + 1));
                        } catch (e) {
                            reject(e);
                        }
                    }
                    return {worldmapAreas: []}
                }
            })()
            delete socket[`__worldmap_${kingdomId}_specific_sector_${x}_${y}_searching`];
            delete socket[`__worldmap_${kingdomId}_specific_sector_${x}_${y}_data`];
            delete socket[`__worldmap_${kingdomId}_empty`];
            resolve(new WorldmapSector(socket.client, kingdomId, data));
        } catch (e) {
            delete socket[`__worldmap__error`];
            delete socket[`__worldmap_${kingdomId}_specific_sector_${x}_${y}_searching`];
            delete socket[`__worldmap_${kingdomId}_specific_sector_${x}_${y}_data`];
            delete socket[`__worldmap_${kingdomId}_empty`];
            reject(e);
        }
    });
}

/**
 * @param {Client} client
 * @param {WorldMapOwnerInfoData} ownerInfoData
 */
function loadNPCOwnerInfo(client, ownerInfoData) {
    for (let i = 0; i < 13; i++) {
        /*WorldMapOwnerInfoVO.setNamesFactory(kingdomSkinNamesFactory,"dungeon_playerName");*/
        ownerInfoData.addOwnerInfo(createWorldMapOwnerInfo(client, DungeonConst.getDungeonOwnerId(0, i), null, "dungeon_playerName", ConstantsCrest.ROBBER_BARON_CREST, true))
    }

    const defaultLandmarkLevel = e4kData.landmarks.find(l => l.isDefault === 1).defaultLevel

    let kingdomId = 0;
    const npcCapitalOwnerInfo = createWorldMapOwnerInfo(client, OutpostConst.getCapitalDefaultOwnerFor(kingdomId), defaultLandmarkLevel, "capital", ConstantsCrest.getKingdomCrest(kingdomId), true)
    npcCapitalOwnerInfo.isOutpostOwner = true;
    //npcCapitalOwnerInfo.setNamesFactory(kingdomSkinNamesFactory, "capital");
    ownerInfoData.addOwnerInfo(npcCapitalOwnerInfo)
    kingdomId = 1;
    while (kingdomId < 4) {
        const kingdomMinLevel = e4kData.kingdoms.find(k => k.kID === kingdomId).minLevel
        const dungeonOwnerId = DungeonConst.getDungeonOwnerId(kingdomId, 0)
        const villageOwnerInfo = createWorldMapOwnerInfo(client, VillageConst.getVillageDefaultOwnerId(kingdomId), kingdomMinLevel, `kingdom_dungeon_playerName_${dungeonOwnerId}`, ConstantsCrest.getKingdomCrest(kingdomId), true)
        //villageOwnerInfo.setNamesFactory(kingdomSkinNamesFactory, `kingdom_dungeon_playerName_${dungeonOwnerId}`);
        ownerInfoData.addOwnerInfo(villageOwnerInfo)
        const npcCapitalOwnerInfo = createWorldMapOwnerInfo(client, OutpostConst.getCapitalDefaultOwnerFor(kingdomId), defaultLandmarkLevel, "capital", ConstantsCrest.getKingdomCrest(kingdomId), true)
        npcCapitalOwnerInfo.isOutpostOwner = true;
        //npcCapitalOwnerInfo.setNamesFactory(kingdomSkinNamesFactory, "capital");
        ownerInfoData.addOwnerInfo(npcCapitalOwnerInfo)
        const kingdomDungeonOwnerInfo = createWorldMapOwnerInfo(client, dungeonOwnerId, null, `kingdom_dungeon_playerName_${dungeonOwnerId}`, ConstantsCrest.getKingdomCrest(kingdomId), true)
        //kingdomDungeonOwnerInfo.setNamesFactory(kingdomSkinNamesFactory, `kingdom_dungeon_playerName_${dungeonOwnerId}`);
        ownerInfoData.addOwnerInfo(kingdomDungeonOwnerInfo)
        const bossDungeonOwnerId = DungeonConst.getBossDungeonOwnerId(kingdomId)
        const bossDungeonOwnerInfo = createWorldMapOwnerInfo(client, bossDungeonOwnerId, kingdomMinLevel, `kingdom_boss_dungeon_playerName_${bossDungeonOwnerId}`, ConstantsCrest.getKingdomCrest(kingdomId), true)
        //bossDungeonOwnerInfo.setNamesFactory(kingdomSkinNamesFactory, `kingdom_boss_dungeon_playerName_${bossDungeonOwnerId}`);
        ownerInfoData.addOwnerInfo(bossDungeonOwnerInfo)
        kingdomId++;
    }
    const outpostOwnerInfo = createWorldMapOwnerInfo(client, -300, 5, "outpost", ConstantsCrest.CLASSIC_KINGDOM_CREST, true)
    outpostOwnerInfo.isOutpostOwner = true;
    //outpostOwnerInfo.setNamesFactory(kingdomSkinNamesFactory, "outpost");
    ownerInfoData.addOwnerInfo(outpostOwnerInfo)
    const shadowCampOwnerInfo = createWorldMapOwnerInfo(client, -333, null, "shadowUnitOwner", ConstantsCrest.SHADOW_CREST, false)
    //shadowCampOwnerInfo.setNamesFactory(kingdomSkinNamesFactory, "shadowUnitOwner");
    ownerInfoData.addOwnerInfo(shadowCampOwnerInfo)
    const kingstowerOwnerInfo = createWorldMapOwnerInfo(client, -450, defaultLandmarkLevel, "kingstower", ConstantsCrest.CLASSIC_KINGDOM_CREST, true)
    //kingstowerOwnerInfo.setNamesFactory(kingdomSkinNamesFactory, "kingstower");
    ownerInfoData.addOwnerInfo(kingstowerOwnerInfo)
    const metropolisOwnerInfo = createWorldMapOwnerInfo(client, -440, defaultLandmarkLevel, "metropol", ConstantsCrest.CLASSIC_KINGDOM_CREST, true)
    metropolisOwnerInfo.isOutpostOwner = true;
    //metropolisOwnerInfo.setNamesFactory(kingdomSkinNamesFactory, "metropol");
    ownerInfoData.addOwnerInfo(metropolisOwnerInfo)

    ownerInfoData.addOwnerInfo(createWorldMapOwnerInfo(client, -223, null, "kingdom_dungeon_playerName_NPC_223", ConstantsIsland.NPC_CREST, true))
    ownerInfoData.addOwnerInfo(createWorldMapOwnerInfo(client, ConstantsIsland.NPC_ID_ISLAND_VILLAGE, null, "kingdom_dungeon_playerName_NPC_223", ConstantsIsland.NPC_CREST, true))

    let factionId = 1
    const faction1OwnerInfo = createWorldMapOwnerInfo(client, -410 - factionId, null, "red_faction_short", FactionConstClient.getCrestByFactionId(factionId), true)
    faction1OwnerInfo.factionId = factionId
    ownerInfoData.addOwnerInfo(faction1OwnerInfo)
    factionId = 0
    const faction0OwnerInfo = createWorldMapOwnerInfo(client, -410 - factionId, null, "blue_faction_short", FactionConstClient.getCrestByFactionId(factionId), true)
    faction0OwnerInfo.factionId = factionId
    ownerInfoData.addOwnerInfo(faction0OwnerInfo)

    const invasionCrest = (function (bgColor, symbolType, symbolColor) {
        const crest = new Crest(client, null);
        crest.backgroundColor1 = bgColor;
        crest.backgroundType = 0;
        crest.symbolColor1 = symbolType;
        crest.symbolPosType = 1;
        crest.symbolType1 = symbolColor;
        crest.fillClipColor();
        return crest;
    })
    ownerInfoData.addOwnerInfo(createWorldMapOwnerInfo(client, -601, -1, "nomad_playerName", invasionCrest(ConstantsColors.NOMAD_BACKGROUND, 100009, ConstantsColors.NOMAD_SYMBOL), true))
    ownerInfoData.addOwnerInfo(createWorldMapOwnerInfo(client, -801, -1, "nomad_playerName", invasionCrest(ConstantsColors.NOMAD_BACKGROUND, 100009, ConstantsColors.NOMAD_SYMBOL), true))
    ownerInfoData.addOwnerInfo(createWorldMapOwnerInfo(client, -651, -1, "samurai_playerName", invasionCrest(ConstantsColors.SAMURAI_BACKGROUND, 100010, ConstantsColors.SAMURAI_SYMBOL), true))
    ownerInfoData.addOwnerInfo(createWorldMapOwnerInfo(client, -811, -1, "daimyo_playerName", invasionCrest(ConstantsColors.SAMURAI_BACKGROUND, 100010, ConstantsColors.SAMURAI_SYMBOL), true))
    ownerInfoData.addOwnerInfo(createWorldMapOwnerInfo(client, -815, -1, "daimyo_playerName", invasionCrest(ConstantsColors.SAMURAI_BACKGROUND, 100010, ConstantsColors.SAMURAI_SYMBOL), true))
    ownerInfoData.addOwnerInfo(createWorldMapOwnerInfo(client, -1000, -1, "alienInvasion_playerName_short", invasionCrest(ConstantsColors.ALIEN_BACKGROUND, 999, ConstantsColors.ALIEN_SYMBOL), true))
    ownerInfoData.addOwnerInfo(createWorldMapOwnerInfo(client, -1001, -1, "samurai_playerName", invasionCrest(ConstantsColors.SAMURAI_BACKGROUND, 100010, ConstantsColors.SAMURAI_SYMBOL), true))
    ownerInfoData.addOwnerInfo(createWorldMapOwnerInfo(client, -1002, -1, "redAlienInvasion_playerName", invasionCrest(ConstantsColors.RED_ALIEN_BACKGROUND, 100012, ConstantsColors.RED_ALIEN_SYMBOL), true))

    ownerInfoData.addOwnerInfo(createWorldMapOwnerInfo(client, 1234, null, "dialog_treasureMap_DungeonOwner", ConstantsCrest.ROBBER_BARON_CREST, true))

    ownerInfoData.addOwnerInfo(createWorldMapOwnerInfo(client, -500, null, "dungeon_playerName_RandomDungeonEvent", ConstantsCrest.ROBBER_BARON_CREST, true))
    ownerInfoData.addOwnerInfo(createWorldMapOwnerInfo(client, -502, null, "dungeon_playerName_RandomDungeonEvent", ConstantsCrest.ROBBER_BARON_CREST, true))

    ownerInfoData.addOwnerInfo(createWorldMapOwnerInfo(client, -460, defaultLandmarkLevel, "monument", ConstantsCrest.CLASSIC_KINGDOM_CREST, true))

    ownerInfoData.addOwnerInfo(createWorldMapOwnerInfo(client, -703, null, `dialog_seasonEvent_${4}_DungeonOwner`, SeaqueenConstants.NPC_CREST, true));
    ownerInfoData.addOwnerInfo(createWorldMapOwnerInfo(client, -704, null, `dialog_seasonEvent_${4}_DungeonOwner`, SeaqueenConstants.NPC_CREST, true));
    ownerInfoData.addOwnerInfo(createWorldMapOwnerInfo(client, -702, null, `dialog_seasonEvent_${2}_DungeonOwner`, ConstantsThornKing.NPC_CREST, true));
    ownerInfoData.addOwnerInfo(createWorldMapOwnerInfo(client, -700, null, `dialog_seasonEvent_${2}_DungeonOwner`, ConstantsThornKing.NPC_CREST, true));
    ownerInfoData.addOwnerInfo(createWorldMapOwnerInfo(client, -701, null, `dialog_seasonEvent_${2}_DungeonOwner`, ConstantsThornKing.NPC_CREST, true));
    ownerInfoData.addOwnerInfo(createWorldMapOwnerInfo(client, -706, null, `dialog_seasonEvent_${64}_DungeonOwner`, ConstantsUnderworld.NPC_CREST, true));
    ownerInfoData.addOwnerInfo(createWorldMapOwnerInfo(client, -707, null, `dialog_seasonEvent_${64}_DungeonOwner`, ConstantsUnderworld.NPC_CREST, true));

    ownerInfoData.addOwnerInfo(createWorldMapOwnerInfo(client, -1201, -1, `wolfgard_playerName`, ConstantsGeneral.NPC_CREST_WOLFKING, true));
}

/**
 *
 * @param {Client} client
 * @param {number} playerId
 * @param {number|null} playerLevel
 * @param {string} playerNameTextId
 * @param {Crest} crest
 * @param {boolean} isNPC
 * @return {WorldmapOwnerInfo}
 */
function createWorldMapOwnerInfo(client, playerId, playerLevel, playerNameTextId, crest, isNPC) {
    const wmOwnerInfo = new WorldmapOwnerInfo(client)
    wmOwnerInfo.playerId = playerId;
    if (playerLevel) wmOwnerInfo.playerLevel = playerLevel;
    wmOwnerInfo.playerName = Localize.text(client, playerNameTextId);
    wmOwnerInfo.crest = crest;
    wmOwnerInfo.isNPC = isNPC;
    return wmOwnerInfo
}

module.exports = WorldmapManager