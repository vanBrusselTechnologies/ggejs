const InventoryItem = require('./InventoryItem');
const {currencies} = require('e4k-data').data;

const goodNames = {
    W: "wood",
    S: "stone",
    F: "food",
    C1: "coin",
    C2: "ruby",
    G: "glass",
    O: "oil",
    C: "coal",
    I: "iron",
    A: "aquamarine",
    HONEY: "honey",
    MEAD: "mead",
    PTT: "pegasus_travel_tickets"
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