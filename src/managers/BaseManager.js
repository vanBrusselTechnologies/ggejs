const {EventEmitter} = require('node:events');

class BaseManager extends EventEmitter {
    /** @param {BaseClient} client */
    constructor(client) {
        super();
        this._client = client;
    }
}

module.exports = BaseManager;