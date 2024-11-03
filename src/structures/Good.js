const InventoryItem = require('./InventoryItem');
const {currencies} = require('e4k-data').data;

const goodNames = {
    W: "wood",
    S: "stone",
    F: "food",
    C1: "currency1",
    C2: "currency2",
    G: "glass",
    O: "oil",
    C: "coal",
    I: "iron",
    A: "aquamarine",
    HONEY: "honey",
    MEAD: "mead"
}

class Good extends InventoryItem {
    /**
     *
     * @param {Client} client
     * @param {[string, number]} data
     */
    constructor(client, data) {
        /** @type {string | null} */
        let _name = goodNames[data[0]];
        if (!_name) {
            for (let currency of currencies) {
                if (currency.JSONKey === data[0]) {
                    _name = currency.Name;
                    break;
                }
            }
        }
        if (!_name) _name = data[0];
        super(_name, data[1]);
    }
}

module.exports = Good;