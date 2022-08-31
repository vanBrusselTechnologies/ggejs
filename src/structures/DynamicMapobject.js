const BasicMapobject = require("./BasicMapobject");

class DynamicMapobject extends BasicMapobject {
    constructor(client, data) {
        super(client, data);
    }
}

module.exports = DynamicMapobject;