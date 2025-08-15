const ActiveEvent = require("./ActiveEvent");

class GGSGiftEvent extends ActiveEvent {
    /** @type {number} */
    skinId;
    /** @type {boolean} */
    hasBeenCollected

    /**
     * @param {BaseClient} client
     * @param {{EID: number, RS: number, SID: number, AC: number}} data
     */
    loadFromParamObject(client, data) {
        super.loadFromParamObject(client, data);

        this.skinId = data["SID"];
        this.hasBeenCollected = data["AC"] > 0;
    }

    /** @return {boolean} */
    get isVisible() {
        return !this.hasBeenCollected;
    }

    /** @return {boolean} */
    get isShownInDropDownMenu() {
        return true;
    }
}

module.exports = GGSGiftEvent;