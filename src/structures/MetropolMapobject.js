const CapitalMapobject = require("./CapitalMapobject");

class MetropolMapobject extends CapitalMapobject {
    /**
     * 
     * @param {Client} client 
     * @param {Array} data 
     */
    constructor(client, data) {
        super(client, data);
    }
}

module.exports = MetropolMapobject;