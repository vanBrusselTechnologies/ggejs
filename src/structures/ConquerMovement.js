const Unit = require("./Unit");
const BasicMovement = require("./BasicMovement");
const Client = require('./../Client');

class ConquerMovement extends BasicMovement {
    /**
     * 
     * @param {Client} client 
     * @param {object} data 
     */
    constructor(client, data) {
        super(client, data);
        /** @type {{ unit: Unit, count: number }[]} */
        this.army = parse(client, data.A);
    }
}

/**
 * 
 * @param {Client} client 
 * @param {Array} obj 
 * @returns {{ unit: Unit, count: number }[]}
 */
function parse(client, obj) {
    /** @type {{ unit: Unit, count: number }[]} */
    let output = [];
    for (let i in obj) {
        output.push({
            unit: new Unit(client, obj[i][0]),
            count: obj[i][1],
        });
    }
    return output;
}

module.exports = ConquerMovement;