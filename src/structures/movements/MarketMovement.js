const BasicMovement = require("./BasicMovement");
const Good = require("../Good");

class MarketMovement extends BasicMovement {
    /**
     * @param {BaseClient} client
     * @param {Object} data
     */
    constructor(client, data) {
        super(client, data);
        if (data.MM) {
            /** @type {Good[]} */
            this.goods = parseGoods(client, data.MM.G);
            /** @type {number} */
            this.carriages = data.MM.C;
        }
    }
}

/**
 * @param {BaseClient} client
 * @param {Array} data
 */
function parseGoods(client, data) {
    if (!data) return [];
    return data.map(d => new Good(d));
}

module.exports = MarketMovement;