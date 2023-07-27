const {EventEmitter} = require('node:events');

class BaseManager extends EventEmitter{
    /**
     * @param {Client} client 
     */
    constructor(client){
        super();
        this._client = client;
    }

    /**
     * @returns {Socket}
     */
    get _socket(){
        return this._client._socket;
    }
}

module.exports = BaseManager;