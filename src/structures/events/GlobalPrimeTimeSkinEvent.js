const ActiveEvent = require("./ActiveEvent");

class GlobalPrimeTimeSkinEvent extends ActiveEvent {
    /** @type {string} */
    skinName;

    /**
     * @param {BaseClient} client
     * @param {{EID:number, RS: number, S: string}} data
     */
    loadFromParamObject(client, data) {
        super.loadFromParamObject(client, data);
        this.skinName = data.S;
    }
}

module.exports = GlobalPrimeTimeSkinEvent;