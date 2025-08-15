const BasicMapobject = require("./BasicMapobject");

class EmptyMapobject extends BasicMapobject {
    /**
     * @param {BaseClient} client
     * @param {Array} data
     */
    constructor(client, data) {
        super(client, data);
    }
}

module.exports = EmptyMapobject;