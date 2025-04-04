const ActiveEvent = require("./ActiveEvent");

class DonationEvent extends ActiveEvent {
    eventBuildingWodId = 2899
    /** @type {number} */
    settingsId;
    /** @type {number} */
    leaderboardRewardSetId;

    get mailStarterDialogName() {
        return "DonationEventStartDialog";
    }

    get eventStarterDescTextId() {
        return "dialog_mainDonationEvent_title";
    }

    get starterDialogName() {
        return "DonationEventStartDialog";
    }

    get mainDialogName() {
        return "DonationEventDialog";
    }

    /**
     * @param {Client} client
     * @param {{DSI: number, LRSI: number}} data
     */
    loadFromParamObject(client, data) {
        super.loadFromParamObject(client, data);
        this.settingsId = data.DSI;
        this.leaderboardRewardSetId = data.LRSI;
    }
}

module.exports = DonationEvent;