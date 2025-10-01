'use strict'

const {NetworkInstance} = require('e4k-data');
const BaseClient = require("./BaseClient");
const ExternalClient = require("./ExternalClient");
const {login} = require('./commands/lli');
const {requestLoginData} = require("./commands/core_rld");
const {registerGbdListener} = require("./commands/gbd");
const {generateLoginToken} = require('./commands/glt');
const EmpireError = require("./tools/EmpireError");
const {ConnectionStatus, LogVerbosity, Events} = require("./utils/Constants");

class EmpireClient extends BaseClient {
    #name = ""
    #password = ""
    /** @type {ExternalClient | null} */
    _externalClient = null;

    async _reconnect() {
        const bannedSecLeft = this.bannedUntil.getTime() - Date.now();
        await new Promise(res => setTimeout(res, Math.max(bannedSecLeft, 0)));
        return await this.connect(this.#name, this.#password);
    }

    /**
     * @param {string} name
     * @param {string} password
     * @return {Promise<this>}
     */
    async connect(name, password) {
        if (this.socketManager.connectionStatus === ConnectionStatus.Connected) return this;
        await this.socketManager.connect();
        await this._login(name, password);
        await this._sendPingPong()
        this.emit(Events.CONNECTED);
        return this;
    }

    /** @param {number} serverType */
    async getExternalClient(serverType = this._externalClient?.socketManager?.serverType) {
        if (this._externalClient?.socketManager?.connectionStatus === ConnectionStatus.Connected) return this._externalClient;

        if (this._externalClient != null) {
            this._externalClient.reconnectTimeout = -1;
            await this._externalClient.socketManager.disconnect();
            this._externalClient = null
        }

        const loginToken = await this._generateExternalServerLoginToken(serverType);
        /** @type {NetworkInstance} */
        const serverInstance = {
            server: loginToken.ip,
            port: loginToken.port,
            zone: loginToken.zone,
            zoneId: loginToken.zoneId,
            value: loginToken.instanceId,
        }
        this._externalClient = new ExternalClient(serverInstance);
        this._externalClient.logger.verbosity = this.logger.verbosity;
        this._externalClient.reconnectTimeout = this.socketManager.reconnectTimeout;
        await this._externalClient.connect(loginToken.token);
        this.emit(Events.EXTERNAL_CLIENT_READY, this._externalClient);
        return this._externalClient;
    }

    /**
     * @param {string} name
     * @param {string} password
     */
    async _login(name, password) {
        try {
            await Promise.all([registerGbdListener(this), login(this, name, password)])
        } catch (errorCode) {
            const overrideTextId = (() => {
                switch (errorCode) {
                    case 21:
                        return 'generic_login_wronglogin';
                    default:
                        return '';
                }
            })();
            throw new EmpireError(this, errorCode, overrideTextId);
        }
    }

    /**
     * @param {number} serverType
     * @return {Promise<{token: string, ip: string, port: string, zone: string, zoneId: string, instanceId: string, isCrossPlay: boolean}>}
     */
    async _generateExternalServerLoginToken(serverType) {
        try {
            return await generateLoginToken(this, serverType);
        } catch (errorCode) {
            throw new EmpireError(this, errorCode);
        }
    }
}

module.exports = EmpireClient;