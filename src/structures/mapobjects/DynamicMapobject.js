const BasicMapobject = require("./BasicMapobject");

class DynamicMapobject extends BasicMapobject {
    /**
     * @param {Client} client
     * @param {Array} data
     */
    constructor(client, data) {
        super(client, data);
    }
}

module.exports = DynamicMapobject;