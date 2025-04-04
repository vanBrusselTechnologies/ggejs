const {dungeons} = require('e4k-data').data;
const InteractiveMapobject = require("./InteractiveMapobject");
const Unit = require("../Unit");
const Lord = require("../Lord");
const DungeonConst = require("../../utils/DungeonConst");
const CombatConst = require("../../utils/CombatConst");

class DungeonMapobject extends InteractiveMapobject {
    #client;
    /** @type {Dungeon} */
    _rawData = null;

    /**
     * @param {Client} client
     * @param {Array} data
     */
    constructor(client, data) {
        super(client, data.slice(0, 3));
        this.#client = client;
        if (data[3] > 0)
            /** @type {Date} */
            this.lastSpyDate = new Date(Date.now() - data[3] * 1000);
        /** @type {number} */
        this.attackCount = data[4];
        if (data[5] > 0)
            /** @type {Date} */
            this.attackCooldownEnd = new Date(Date.now() + data[5] * 1000);
        /** @type {number} */
        this.kingdomId = data[6];
        this.ownerInfo = parseOwnerInfo(client.worldMaps._ownerInfoData, this.kingdomId);

        /** @type {number} */
        this.level = DungeonConst.getLevel(this.attackCount, this.kingdomId)
        /** @type {number} */
        this.resources = DungeonConst.getResources(this.level);
        /** @type {number} */
        this.coins = DungeonConst.getC1(this.level);
        /** @type {number} */
        this.rubies = DungeonConst.getC2(this.level);
        /** @type {number} */
        this.rubyProbability = DungeonConst.getC2Probability(this.level);
        /** @type {number} */
        this.wallWodId = DungeonConst.getWallWOD(this.level);
        /** @type {number} */
        this.gateWodId = DungeonConst.getGateWOD(this.level);
        /** @type {number} */
        this.guards = DungeonConst.getGuards(this.attackCount, this.kingdomId);
        /** @type {number} */
        this.xp = CombatConst.getXpForAttackingDungeon(this.level)
    }

    /**
     * @returns {{ troops: { left: InventoryItem<Unit>[], middle: InventoryItem<Unit>[], right: InventoryItem<Unit>[], center: InventoryItem<Unit>[] }, tools: { left: InventoryItem<Tool>[], middle: InventoryItem<Tool>[], right: InventoryItem<Tool>[] } }}
     */
    get defence() {
        if (this._defence) return this._defence;
        if (this._rawData === null) {
            for (const _dungeon of dungeons) {
                if (_dungeon.countVictories === this.attackCount && _dungeon.kID === this.kingdomId) {
                    this._rawData = _dungeon;
                }
            }
        }
        /** @type {{ troops: { left: InventoryItem<Unit>[], middle: InventoryItem<Unit>[], right: InventoryItem<Unit>[], center: InventoryItem<Unit>[] }, tools: { left: InventoryItem<Tool>[], middle: InventoryItem<Tool>[], right: InventoryItem<Tool>[] } }} */
        this._defence = {
            troops: {
                left: parseUnits(this.#client, this._rawData.unitsL),
                middle: parseUnits(this.#client, this._rawData.unitsM),
                right: parseUnits(this.#client, this._rawData.unitsR),
                center: parseUnits(this.#client, this._rawData.unitsK),
            }, tools: {
                left: parseUnits(this.#client, this._rawData.toolL),
                middle: parseUnits(this.#client, this._rawData.toolM),
                right: parseUnits(this.#client, this._rawData.toolR)
            }
        }
        return this._defence;
    }

    /** @returns {Lord} */
    get lord() {
        if (this._lord) return this._lord;
        if (this._rawData === null) {
            for (let k in dungeons) {
                let _dungeon = dungeons[k];
                if (_dungeon.countVictories === this.attackCount && _dungeon.kID === this.kingdomId) {
                    this._rawData = _dungeon;
                }
            }
        }
        /** @type {Lord} */
        this._lord = new Lord(this.#client, {DLID: this._rawData.lordID});
        return this._lord;
    }

    parseAreaInfoBattleLog(data) {
        super.parseAreaInfoBattleLog(data);
        this.level = data["DL"];
        return this;
    }
}

/**
 * @param {Client} client
 * @param {string} _data
 * @returns {InventoryItem<Unit>[]}
 */
function parseUnits(client, _data) {
    /** @type {InventoryItem<Unit>[]} */
    let units = [];
    if (!_data) return units;
    let data = _data.split("#");
    for (let _ of data) {
        let wodId_count = _.split("+");
        units.push({
            item: new Unit(client, parseInt(wodId_count[0])), count: parseInt(wodId_count[1])
        })
    }
    return units;
}

/**
 * @param {WorldMapOwnerInfoData} ownerInfoData
 * @param {number} kingdomId
 * @return {WorldMapOwnerInfo}
 */
function parseOwnerInfo(ownerInfoData, kingdomId){
    switch (kingdomId) {
        case undefined: return null;
        case 0:
            return ownerInfoData.getOwnerInfo(-202 - Math.floor(Math.random() * 13));
        default:
            return ownerInfoData.getKingdomDungeonOwnerByKingdomId(kingdomId);
    }
}

module.exports = DungeonMapobject;