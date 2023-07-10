class ConstructionSlot {
    /** @type {number} */
    objectId;
    /**
     *
     * @param {Client} client
     * @param {Array<number> | number} data
     */
    constructor(client, data) {
        this.objectId = Array.isArray(data) ? data[0] : data;
        this.isFree = this.objectId === -1;
        this.isLocked = this.objectId === -2;
    }
}

module.exports = ConstructionSlot;