const ActiveEvent = require("./ActiveEvent");

class CollectorEvent extends ActiveEvent {
    /** @type {number} */
    optionId
    /** @type {Date} */
    dailyPayoutTime = new Date(0)

    loadFromParamObject(client, data) {
        super.loadFromParamObject(client, data)
        this.dailyPayoutTime = new Date(Date.now() - data["SDP"] * 1000);
        this.optionId = data["EOID"];
    }

    get mainDialogName() {
        return "CollectorDialog";
    }
}

module.exports = CollectorEvent;