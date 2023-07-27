const BasicMovement = require("./BasicMovement");
const Good = require("../Good");
const Unit = require("../Unit");

class ArmyTravelMovement extends BasicMovement {
    /**
     * 
     * @param {Client} client 
     * @param {*} data 
     */
    constructor(client, data) {
        super(client, data);
        /** @type {InventoryItem<Unit>[]} */
        this.army = parseArmy(client, data.A);
        /** @type {Good[]} */
        this.goods = parseGoods(client, data.G);
    }
}

/**
 * 
 * @param {Client} client 
 * @param {*} data 
 * @returns {Good[]}
 */
function parseGoods(client, data) {
    let goods = []
    for (let i in data) {
        goods.push(new Good(client, data[i]));
    }
    return goods;
}

/**
 * 
 * @param {Client} client 
 * @param {*} data 
 * @returns {InventoryItem<Unit>[]}
 */
function parseArmy(client, data) {
    let army = [];
    for (let i in data) {
        let _wodId = data[i][0];
        let _count = data[i][1];
        army.push({
            item: new Unit(client, _wodId),
            count: _count,
        })
    }
    return army;
}

module.exports = ArmyTravelMovement;