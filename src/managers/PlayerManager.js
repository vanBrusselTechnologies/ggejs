'use strict'

const BaseManager = require('./BaseManager');
const {execute: getDetailedPlayerInfo} = require('../e4kserver/commands/getDetailedPlayerInfo');
const {execute: searchPlayer} = require('../e4kserver/commands/searchPlayer');
const {WaitUntil} = require('../tools/wait');
const Localize = require("../tools/Localize");
const {execute: getPlayerRankings} = require("../e4kserver/commands/getPlayerRankings");

class PlayerManager extends BaseManager {
    get _socket() {
        if (super._socket[`__requesting_players`] === undefined) {
            super._socket[`__requesting_players`] = [];
        }
        return super._socket;
    }

    /**
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
     * @param {string} name
     * @returns {Promise<Player>}
     */
    find(name) {
        return new Promise(async (resolve, reject) => {
            const normalizedName = name.toString().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            try {
                /** @type {number} */
                let playerId;
                try { // Try to find user by rankings, otherwise use world map find
                    getPlayerRankings(this._socket, name);
                    const hghData = await WaitUntil(this._socket, `hgh_6_${normalizedName}`, "", 1000);
                    delete this._socket[`hgh_6_${normalizedName}`];
                    playerId = hghData.items.find(item => item.rank === hghData.foundRank).player.playerId;
                } catch (e) {
                    searchPlayer(this._socket, name);
                    playerId = await WaitUntil(this._socket, `__search_player_${normalizedName}`, "__search_player_error", 1000);
                    delete this._socket[`__search_player_${normalizedName}`];
                }
                resolve(await this.getById(playerId));
            } catch (e) {
                delete this._socket[`hgh_6_${normalizedName}`];
                delete this._socket[`__search_player_${normalizedName}`];
                delete this._socket["__search_player_error"];
                reject(Localize.text(this._socket.client, e));
            }
        });
    }

    /**
     * @returns {Promise<Player>}
     */
    async getThisPlayer() {
        if (this._client.clientUserData.playerId === -1) return null
        return await this.getById(this._client.clientUserData.playerId);
    }
}

module.exports = PlayerManager