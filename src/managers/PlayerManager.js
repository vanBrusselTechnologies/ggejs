'use strict'

const BaseManager = require('./BaseManager');
const {execute: getDetailedPlayerInfo} = require('../e4kserver/commands/getDetailedPlayerInfo');
const {execute: searchPlayer} = require('../e4kserver/commands/searchPlayer');
const {WaitUntil} = require('../tools/wait');
const Localize = require("../tools/Localize");

class PlayerManager extends BaseManager {
    get _socket() {
        if (super._socket[`__requesting_players`] === undefined) {
            super._socket[`__requesting_players`] = [];
        }
        return super._socket;
    }

    /**
     *
     * @param {number} id
     * @returns {Promise<Player>}
     */
    getById(id) {
        return new Promise(async (resolve, reject) => {
            /** @type {Array} */
            const reqPlayers = this._socket[`__requesting_players`]
            try {
                if (!reqPlayers.includes(id)) getDetailedPlayerInfo(this._socket, id);
                reqPlayers.push(id);
                const player = await WaitUntil(this._socket, `__get_player_${id}`, "__get_player_error");
                reqPlayers.splice(reqPlayers.indexOf(id), 1);
                if (!reqPlayers.includes(id)) delete this._socket[`__get_player_${id}`];
                resolve(player);
            } catch (e) {
                reqPlayers.splice(reqPlayers.indexOf(id), 1);
                delete this._socket["__get_player_error"];
                reject(Localize.text(this._socket.client, e));
            }
        });
    }

    /**
     *
     * @param {string} name
     * @returns {Promise<Player>}
     */
    find(name) {
        return new Promise(async (resolve, reject) => {
            try {
                searchPlayer(this._socket, name);
                name = name.toString().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                /** @type {number} */
                const playerId = await WaitUntil(this._socket, `__search_player_${name}`, "__search_player_error", 1000);
                delete this._socket[`__search_player_${name}`];
                resolve(await this.getById(playerId));
            } catch (e) {
                delete this._socket[`__search_player_${name}`];
                delete this._socket["__search_player_error"];
                reject(Localize.text(this._socket.client, e));
            }
        });
    }

    /**
     * @returns {Promise<Player>}
     */
    getThisPlayer() {
        if(this._client.clientUserData.playerId === -1) return new Promise(resolve => {resolve(null)})
        return this.getById(this._client.clientUserData.playerId);
    }
}

module.exports = PlayerManager