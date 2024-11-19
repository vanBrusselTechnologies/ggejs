const ActiveEvent = require("./ActiveEvent");

class CollectorShopEvent extends ActiveEvent {
    /** @type {number} */
    optionId

    /**
     * @param {Client} client
     * @param {{EID: number, RS: number, PIDS: string, EOID: number}} data
     */
    loadFromParamObject(client, data) {
        super.loadFromParamObject(client, data);
        this.optionId = data.EOID;
    }

    get mainDialogName() {
        return "CollectorDialog";
    }
}

module.exports = CollectorShopEvent;