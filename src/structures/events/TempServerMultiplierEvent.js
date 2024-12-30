const ActiveEvent = require("./ActiveEvent");

class TempServerMultiplierEvent extends ActiveEvent {
    /** @type {number} */
    minMultiplierValue;
    /** @type {number} */
    maxMultiplierValue;

    /**
     * @param client
     * @param {{EID: number, RS: number, DPMM: number, DPXM: number}} data
     */
    loadFromParamObject(client, data) {
        super.loadFromParamObject(client, data);
        this.minMultiplierValue = data.DPMM;
        this.maxMultiplierValue = data.DPXM;
    }
}

module.exports = TempServerMultiplierEvent;