const BasicMovement = require("./BasicMovement");
const Good = require("./Good");

class MarketMovement extends BasicMovement {
    /**
     * 
     * @param {Client} client 
     * @param {object} data 
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
 * 
 * @param {Client} client 
 * @param {Array} data 
 * @returns {Good[]}
 */
function parseGoods(client, data) {
    if (!data) return [];
    let goods = [];
    for (let i in data) {
        goods.push(new Good(client, data[i]));
    }
    return goods;
}

module.exports = MarketMovement;