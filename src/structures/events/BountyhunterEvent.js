const ActiveEvent = require("./ActiveEvent");
const {parseMapObject} = require("../../utils/MapObjectParser");
const {Reward} = require('e4k-data')
const {rewards} = require('e4k-data').data

class BountyhunterEvent extends ActiveEvent {
    eventBuildingWodId = 218;

    hasWon = false;
    /** @type {Reward[]} */
    rewards = [];
    targetSkipCostC2 = 0;
    /** @type {Mapobject} */
    targetArea;

    get eventTitleTextId() {
        return "eventBuilding_Bountyhunter";
    }

    get eventStarterDescTextId() {
        return "dialog_bountyhunter_title";
    }

    get starterDialogName() {
        return "SpecialEventsBountyHunterDialogStarter";
    }

    get mainDialogName() {
        return "SpecialEventsBountyHunterDialog";
    }

    /**
     * @param {Client} client
     * @param {{OI:Object, A: [], HW: 0|1}} data
     */
    loadFromParamObject(client, data) {
        super.loadFromParamObject(client, data);
        client.worldMaps._ownerInfoData.parseOwnerInfo(data.OI);
        this.targetArea = parseMapObject(client, data.A);
        this.hasWon = data.HW === 1

        this.rewards = this.rawData.rewardIDs.split(',').map(id => rewards.find(r => r.rewardID === parseInt(id)))
        this.targetSkipCostC2 = this.rawData.targetSkipCostC2
    }

    get hasUserSolvedEvent() {
        return this.hasWon;
    }
}

module.exports = BountyhunterEvent;