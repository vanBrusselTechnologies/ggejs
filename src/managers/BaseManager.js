const {EventEmitter} = require('node:events');

class BaseManager extends EventEmitter{
    /** @param {Client} client */
    constructor(client){
        super();
        this._client = client;
    }

    get _socket(){
        return this._client._socket;
    }
}

module.exports = BaseManager;