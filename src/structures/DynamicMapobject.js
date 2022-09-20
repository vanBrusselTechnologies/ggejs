const BasicMapobject = require("./BasicMapobject");
const Client = require("../Client");

class DynamicMapobject extends BasicMapobject {
    /**
     * 
     * @param {Client} client 
     * @param {Array} data
     */
    constructor(client, data) {
        super(client, data);
    }
}

module.exports = DynamicMapobject;