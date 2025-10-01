'use strict'

const BaseClient = require("./BaseClient");
const {registerGbdListener} = require("./commands/gbd");
const {registerOrLogin} = require('./commands/tle');
const EmpireError = require("./tools/EmpireError");
const {ConnectionStatus, Events} = require("./utils/Constants");

class ExternalClient extends BaseClient {
    #loginToken = ""

    async _reconnect() {
        return await this.connect(this.#loginToken);
    }

    /**
     * @param {string} loginToken
     * @return {Promise<this>}
     */
    async connect(loginToken) {
        if (this.socketManager.connectionStatus === ConnectionStatus.Connected) return this;
        await this.socketManager.connect();
        await this._loginWithToken(loginToken);
        await this._sendPingPong();
        this.emit(Events.CONNECTED);
        return this;
    }

    /** @param {string} loginToken ExternalServer _login token */
    async _loginWithToken(loginToken) {
        try {
            this.#loginToken = loginToken;
            await Promise.all([registerGbdListener(this), registerOrLogin(this, loginToken)])
        } catch (errorCode) {
            if (errorCode === 423) this.#loginToken = "";
            throw new EmpireError(this, errorCode);
        }
    }
}

module.exports = ExternalClient;