const ActiveEvent = require("./ActiveEvent");
const {ServerType} = require("../../utils/Constants");

class TempServerEvent extends ActiveEvent {
    /** @type {Date} */
    rankResetTime;
    /** @type {boolean} */
    isPresetSelected;
    /** @type {number} */
    settingsId;
    /** @type {boolean} */
    isCrossPlay;

    /**
     * @param client
     * @param {{EID: number, RS: number, RD: number, TSID: number, RSID: number, IPS: number, ICSE: boolean}} data
     */
    loadFromParamObject(client, data) {
        super.loadFromParamObject(client, data);
        this.rankResetTime = new Date(Date.now() + data.RD * 1000);
        this.settingsId = data.TSID;
        this.isPresetSelected = data.IPS === 1;
        this.isCrossPlay = data.ICSE;
    }

    get mainDialogName() {
        return "TempServerHubDialog";
    }

    get starterDialogName() {
        return "AllianceBattleGroundStartEventDialog";
    }

    get mailStarterDialogName() {
        return "AllianceBattleGroundInboxMessageDialog";
    }

    get mailStarterMarkEventAsRead() {
        return true;
    }

    get eventStarterDescTextId() {
        return "openHelpInfo";
    }

    get serverType() {
        return ServerType.TempServer;
    }
}

module.exports = TempServerEvent;