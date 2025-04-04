const {tmaps, TMapNode} = require('e4k-data').data;
const InteractiveMapobject = require("./InteractiveMapobject");
const Localize = require("../../tools/Localize");
const SeasonEventsConstants = require("../../utils/SeasonEventsConstants");

class TreasureMapMapobject extends InteractiveMapobject {
    #client;
    _isSurroundingDungeon = false;
    mapObjectType = -1
    kingdomId = -1;
    /** @type {TMapNode} */
    node;

    tMapPosition = -1;

    /**
     * @param {Client} client
     * @param {number} type
     * @param {number} x
     * @param {number} y
     */
    constructor(client, type, x = -1, y = -1) {
        super(client, [7, x, y]);
        this.#client = client;
        this.mapObjectType = type
        this.y = y
    }

    parseAreaInfoBattleLog(data) {
        super.parseAreaInfoBattleLog(data);
        this.nodeId = data.NID;
        return this;
    }

    /** @param {TMapNode} val */
    set node(val) {
        this.node = val;
    }

    get areaName() {
        let areaNameTextId;
        if (this.isEndNode) {
            areaNameTextId = `seasonEvent_${this.mapId}_final_dungeon`;
        } else if (this.isSurroundingDungeon) {
            areaNameTextId = `seasonEvent_${this.mapId}_resource_dungeon`;
        } else {
            areaNameTextId = `seasonEvent_${this.mapId}_normal_dungeon`;
        }
        return Localize.text(this.#client, areaNameTextId)
    }

    /** @param {boolean} value */
    set isSurroundingDungeon(value) {
        this._isSurroundingDungeon = value
    }

    /** @return {boolean} */
    get isSurroundingDungeon() {
        return !!this.node ? SeasonEventsConstants.isSurroundingDungeon(this.node.ownerID) : this._isSurroundingDungeon;
    }

    /** @param {boolean} value */
    set isEndNode(value) {
        this._isEndNode = value;
    }

    /** @returns {boolean} value */
    get isEndNode() {
        return !!this.node ? tmaps.find(map => map.endNodeID === this.node.tmapnodeID) : this._isEndNode;
    }
}

module.exports = TreasureMapMapobject;