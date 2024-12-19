const ActiveEvent = require("./ActiveEvent");
const {parseMapObject} = require("../../utils/MapObjectParser");

class RandomDungeonEvent extends ActiveEvent {
    eventBuildingWodId = 219

    /** @type {Reward[]} */
    rewards = []
    /** @type {EventDungeonMapobject} */
    targetArea;
    hasWon = false

    get eventTitleTextId() {
        return "eventBuilding_RandomDungeon";
    }

    get eventStarterDescTextId() {
        return "dialog_eventdungeon_" + this.targetArea.skinId + "_title";
    }

    get starterDialogName() {
        return "SpecialEventDungeonStarter";
    }

    get mainDialogName() {
        return "SpecialEventsDungeonDialog";
    }

    /**
     * @param {Client} client
     * @param {{D: [], SID: number}} data
     */
    loadFromParamObject(client, data) {
        super.loadFromParamObject(client, data);

        this.targetArea = parseMapObject(client, data.D);
        this.targetArea.skinId = data.SID;
        this.rewards = []//TODO: eventDungeonRewardHelper.parse(data);
        this.hasWon = this.targetArea.isDefeated;
    }
}

module.exports = RandomDungeonEvent;