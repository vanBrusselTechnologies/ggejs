const CapitalMapobject = require("./CapitalMapobject");

class MetropolMapobject extends CapitalMapobject {
    /**
     * @param {BaseClient} client
     * @param {Array} data
     */
    constructor(client, data) {
        super(client, data);
    }
}

module.exports = MetropolMapobject;