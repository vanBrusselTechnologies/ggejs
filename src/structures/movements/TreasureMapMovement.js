const {tmaps, tmapnodes} = require('e4k-data').data;
const ArmyAttackMovement = require("./ArmyAttackMovement");
const SeasonEventsConstants = require("../../utils/SeasonEventsConstants");
const SeaqueenConstants = require("../../utils/SeaqueenConstants");
const {parseTreasureMapObject} = require("../../utils/MapObjectParser");
const TreasureMapsConstants = require("../../utils/TreasureMapsConstants");
const SeaqueenMapCampObject = require("../mapobjects/SeaqueenMapCampObject");
const {Constants} = require("../../utils/Constants");

class TreasureMapMovement extends ArmyAttackMovement {
    constructor(client, data) {
        super(client, data);
        this.mapId = data.MID;
        this.nodeId = data.NID;
        this.treasureMap = tmaps.find(map => map.mapID === this.mapId);
        if (this.treasureMap == null) return;
        this._targetOwnerInfo = client.worldMaps._ownerInfoData.getOwnerInfo(-703);
        this._tmapNode = tmapnodes.find(node => node.tmapnodeID === this.nodeId);
        /** @type {TreasureMapMapobject} */
        this._targetArea = parseTreasureMapObject(client, this.mapId, SeaqueenConstants.getMapObjectTypeByNode(this._tmapNode.type, SeasonEventsConstants.isSurroundingDungeon(this._tmapNode.ownerID), this.treasureMap.endNodeID === this._tmapNode.tmapnodeID));
        this._targetArea.node = this._tmapNode
        this._targetArea.ownerInfo = this._targetOwnerInfo;
        this._targetArea.type = this._tmapNode.type;
        this._targetArea.mapId = this.mapId;
        this._sourceOwnerInfo = client.worldMaps._ownerInfoData.ownInfo;
        this._movementOwnerInfo = this._sourceOwnerInfo;
        this._sourceOwnerId = this._sourceOwnerInfo.playerId;
        this._targetOwnerId = this._targetOwnerInfo.playerId;
        this._movementOwnerId = this._sourceOwnerInfo.playerId;
        if (TreasureMapsConstants.isSeasonEventMap(this.mapId)) {
            this._sourceArea = new SeaqueenMapCampObject(client, -1);
            this._sourceArea.mapId = this.mapId;
            this._sourceArea.ownerInfo = this._sourceOwnerInfo;
        } else {
            this._sourceArea = client.clientUserData._userData.castleList.castles["0"].find(c=>c.areaType === Constants.WorldMapArea.MainCastle)
        }

        this.distance = this._tmapNode.distance;
    }
}

module.exports = TreasureMapMovement;