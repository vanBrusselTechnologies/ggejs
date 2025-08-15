'use strict'

const {NetworkInstance} = require('e4k-data');
const BaseClient = require("./BaseClient");
const ExternalClient = require("./ExternalClient");
const {login} = require('./commands/core_lga');
const {requestLoginData} = require("./commands/core_rld");
const {registerGbdListener} = require("./commands/gbd");
const {generateLoginToken} = require('./commands/glt');
const EmpireError = require("./tools/EmpireError");
const {ConnectionStatus, LogVerbosity, Events} = require("./utils/Constants");

class MainClient extends BaseClient {
    #name = ""
    #password = ""
    /** @type {ExternalClient | null} */
    _externalClient = null;

    /**
     * @param {string} mail
     * @param {string} password
     * @param {NetworkInstance} serverInstance
     */
    static async registerNewAccount(mail, password, serverInstance) {
        const client = new MainClient(serverInstance);
        client.logger.verbosity = LogVerbosity.Trace
        await client.socketManager.connect();
        const loginData = await requestLoginData(client);
        await client._login(loginData.M, loginData.P);
        // await changeAccountMail(client, mail);
        return {client, loginData};
    }

    async _reconnect() {
        const bannedSecLeft = this.client.bannedUntil.getTime() - Date.now();
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
        const loginData = await this._verifyLoginData(name, password);
        await this._login(loginData.M, loginData.P);
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
        const gbdListener = registerGbdListener(this);
        this.#name = name;
        this.#password = password;
        const e = await login(this, name, password);
        if (e.error !== "") {
            this.bannedUntil = e.args.length === 0 ? new Date(0) : e.args[0];
            throw new EmpireError(this, e.errorCode, e.error, ...e.args);
        }
        this.bannedUntil = new Date(0);
        await gbdListener;
    }

    /**
     * @param {string} name
     * @param {string} password
     */
    async _verifyLoginData(name, password) {
        try {
            return await require('./commands/core_avl').verifyLoginData(this, name, password);
        } catch (errorCode) {
            const overrideTextId = (() => {
                switch (errorCode) {
                    case -1:
                        return 'generic_alert_connection_lost_copy';
                    case 10011:
                    case 10012:
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

module.exports = MainClient;