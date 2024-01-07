'use strict'

const BaseManager = require('./BaseManager');
const {execute: searchPlayerByIdCommand} = require('./../e4kserver/commands/searchPlayerById');
const {execute: getPlayerRankingsCommand} = require('./../e4kserver/commands/getPlayerRankings');
const {WaitUntil} = require('./../tools/wait');
const Localize = require("../tools/Localize");

class PlayerManager extends BaseManager {
    /**
     *
     * @param {number} id
     * @returns {Promise<Player>}
     */
    getById(id) {
        return new Promise(async (resolve, reject) => {
            try {
                let _player = await _getPlayerById(this._socket, id);
                resolve(_player);
            } catch (e) {
                reject(Localize.text(this._client, 'errorCode_21'));
            }
        })
    }

    /**
     *
     * @param {string} name
     * @returns {Promise<Player>}
     */
    find(name) {
        return new Promise(async (resolve, reject) => {
            try {
                let _playerId = await _getPlayerIdByName(this._socket, name);
                if (_playerId === 0) reject("Player not found!");
                let _player = await this.getById(_playerId);
                resolve(_player);
            } catch (e) {
                reject(Localize.text(this._client, 'errorCode_21'));
            }
        })
    }

    /**
     * @returns {Promise<Player>}
     */
    getThisPlayer() {
        return this.getById(this._client.clientUserData.playerId);
    }
}

/**
 *
 * @param {Socket} socket
 * @param {number} id
 * @returns {Promise<Player>}
 */
function _getPlayerById(socket, id) {
    return new Promise(async (resolve, reject) => {
        try {
            if (id == null) {
                reject('Missing player id!');
                return;
            }
            searchPlayerByIdCommand(socket, id);
            const player = await WaitUntil(socket, `__player_${id}_data`, "", 1000);
            delete socket[`__player_${id}_data`];
            resolve(player);
        } catch (e) {
            if(e.toString() === "Exceeded max time!"){
                try{
                    const player = await _getPlayerById(socket, id);
                    resolve(player);
                    return;
                }
                catch (e){
                }
            }
            reject(Localize.text(socket.client, 'errorCode_21'));
        }
    });
}

/**
 *
 * @param {Socket} socket
 * @param {string} name
 * @returns {Promise<number>}
 */
function _getPlayerIdByName(socket, name) {
    return new Promise(async (resolve, reject) => {
        try {
            getPlayerRankingsCommand(socket, name);
            name = name.toString().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            const id = await WaitUntil(socket, `__player_${name}_id`, "", 1000);
            delete socket[`__player_${name}_id`];
            resolve(id);
        } catch (e) {
            reject(Localize.text(socket.client, 'errorCode_21'));
        }
    });
}

module.exports = PlayerManager