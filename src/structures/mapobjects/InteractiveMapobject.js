const BasicMapobject = require("./BasicMapobject");
const WorldMapOwnerInfoData = require("../../utils/WorldMapOwnerInfoData");
const WorldmapOwnerInfo = require("../WorldmapOwnerInfo");
const ConstantsIsland = require("../../utils/ConstantsIslands");

class InteractiveMapobject extends BasicMapobject {
    /**
     *
     * @param {Client} client
     * @param {Array} data
     */
    constructor(client, data) {
        super(client, data);
        if (data.length <= 3) {
            this.ownerInfo = getDefaultOwnerInfo(client, this)
            return;
        }
        /** @type {number} */
        this.objectId = data[3];
        /** @type {number} */
        this.ownerId = data[4];
        this.ownerInfo = client.worldmaps._ownerInfoData.getOwnerInfo(this.ownerId)
        /** @type {number} */
        this.keepLevel = data[5];
        /** @type {number} */
        this.wallLevel = data[6];
        /** @type {number} */
        this.gateLevel = data[7];
        /** @type {number} */
        this.towerLevel = data[8];
        /** @type {number} */
        this.moatLevel = data[9];
        /** @type {string} */
        this.customName = data[10];
        if (data[11] > 0) /** @type {Date} */
        this.attackCooldownEnd = new Date(Date.now() + data[11] * 1000);
        if (data[12] > 0) /** @type {Date} */
        this.sabotageCooldownEnd = new Date(Date.now() + data[12] * 1000);
        if (data[13] > 0) {
            /** @type {Date} */
            this.lastSpyDate = new Date(Date.now() - data[13] * 1000);
        }
        /** @type {number} */
        this.outpostType = data[14];
        /** @type {number} */
        this.occupierId = data[15];
        /** @type {number} */
        this.kingdomId = data[16];
        /** @type {number} */
        this.equipmentId = data[17];
    }

    parseAreaInfoBattleLog(data) {
        super.parseAreaInfoBattleLog(data);
        this.keepLevel = data.KL;
        this.wallLevel = data.WL;
        this.gateLevel = data.GL;
        this.towerLevel = data.TL;
        this.moatLevel = data.ML;
        this.customName = data.N;
        this.equipmentId = data.EID;
        this.outpostType = data.RT;
        return this;
    }
}

/**
 * @param {Client} client
 * @param {InteractiveMapobject} mapobject
 * @return {WorldmapOwnerInfo}
 */
function getDefaultOwnerInfo(client, mapobject) {
    const areaType = mapobject.areaType;
    switch (areaType) {
        case 22:
            return client.worldmaps._ownerInfoData.getOwnerInfo(-440);
        case 4:
            return client.worldmaps._ownerInfoData.getOwnerInfo(-300);
        case 13:
            return client.worldmaps._ownerInfoData.getOwnerInfo(-500);
        case 23:
            return client.worldmaps._ownerInfoData.getOwnerInfo(-450);
        case 24:
            return client.worldmaps._ownerInfoData.getOwnerInfo(ConstantsIsland.NPC_ID_ISLAND_VILLAGE);
        case 36:
            return client.worldmaps._ownerInfoData.getOwnerInfo(-901);
        case 37:
            return client.worldmaps._ownerInfoData.getOwnerInfo(-811);
        case 38:
            return client.worldmaps._ownerInfoData.getOwnerInfo(-815);
        case 39:
            return client.worldmaps._ownerInfoData.getOwnerInfo(-821);
        case 42:
            return client.worldmaps._ownerInfoData.getOwnerInfo(-1201);
        default:
            return new WorldmapOwnerInfo(client);
    }
}

module.exports = InteractiveMapobject;