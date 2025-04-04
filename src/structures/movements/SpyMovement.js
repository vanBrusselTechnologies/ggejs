const BasicMovement = require("./BasicMovement");

class SpyMovement extends BasicMovement {
    /**
     * @param {Client} client
     * @param {Object} data
     */
    constructor(client, data) {
        super(client, data);
        /** @type {number} */
        this.spyType = data.S.ST;
        /** @type {number} */
        this.spyCount = data.S.SC;
        /** @type {number} */
        this.spyRisk = data.S.SR;
        if (this.spyType)
            /** @type {number} */
            this.sabotageDamage = data.S.SA;
        else
            /** @type {number} */
            this.spyAccuracy = data.S.SA;
    }
}

module.exports = SpyMovement;