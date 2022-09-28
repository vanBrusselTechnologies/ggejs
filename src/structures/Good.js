const currencies = require('./../data/ingame_data/currencies.json');

const goodNames = {
    W:"wood",
    S:"stone",
    F:"food",
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

class Good {
    /**
     * 
     * @param {Client} client 
     * @param {Array} data 
     */
    constructor(client, data) {
        let _name = goodNames[data[0]];
        if(!_name) {
            for(let i in currencies){
                if(currencies[i].JSONKey === data[0]){
                    _name = currencies[i].Name;
                    break;
                }
            }
        }
        if(!_name) _name = data[0];
        /** @type {string} */
        this.name = _name;
        /** @type {number} */
        this.count = data[1];
    }
}

module.exports = Good;