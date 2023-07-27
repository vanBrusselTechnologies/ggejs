const ActiveEvent = require("./ActiveEvent");
const {ServerType} = require("../../utils/Constants");

class AllianceBattleGroundEvent extends ActiveEvent {
    /** @type {boolean} */
    isPresetSelected;
    /** @type {Date} */
    endJoinTime;
    /** @type {number} */
    settingsId;
    /** @type {number} */
    maxAllianceSize;

    constructor(client, data) {
        super(client, data);
        this.endJoinTime = new Date(Date.now() + data["RJT"] * 1000);
        this.settingsId = data["TSID"];
        //this.rewardSetId = data["RSID"];
        //this.resetTime = new Date(Date.now() + data["RD"] * 1000);
        this.isPresetSelected = data["IPS"].toString() === "1";
        this.maxAllianceSize = data["MAS"];
    }

    get mailStarterDialogName() {
        return "AllianceBattleGroundInboxMessageDialog";
    }

    get starterDialogName() {
        return "AllianceBattleGroundStartEventDialog";
    }

    get eventStarterDescTextId() {
        return "openHelpInfo";
    }

    get serverType() {
        return ServerType.AllianceBattleGround;
    }

}

module.exports = AllianceBattleGroundEvent;