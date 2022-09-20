'use strict'

const Socket = require('node:net').Socket;
const BaseManager = require('./BaseManager');
const Player = require('./../structures/Player');
const searchPlayerByIdCommand = require('./../e4kserver/commands/searchPlayerById');
const getPlayerRankingsCommand = require('./../e4kserver/commands/getPlayerRankings');
const { WaitUntil } = require('./../tools/wait');

class PlayerManager extends BaseManager {
    /**
     * @type {number}
     */
    #thisPlayerId = 0;
    /**
     * @type {Player[]}
     */
    #players = [];
    /**
     * 
     * @param {number} id 
     * @returns {Promise<Player>}
     */
    getById(id) {
        return new Promise(async (resolve, reject) => {
            try {
                let _player = await _getPlayerById(this._client._socket, id);
                resolve(_player);
            }
            catch (e) {
                reject("Player not found!");
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
                let _playerId = await _getPlayerByName(this._client._socket, name);
                if (_playerId === 0) reject("Player not found!");
                let _player = await this.getById(_playerId);
                resolve(_player);
            }
            catch (e) {
                reject("Player not found!");
            }
        })
    }
    /**
     * 
     * @param {Player} _player 
     */
    _add_or_update(_player) {
        let found = false;
        for (let j in this.#players) {
            if (this.#players[j].playerId === _player.playerId) {
                this.#players[j] = _player;
                found = true;
                break;
            }
        }
        if (!found) {
            this.#players.push(_player);
        }
    }
    /**
     * 
     * @returns {Promise<Player>}
     */
    getThisPlayer() {
        return new Promise(async (resolve, reject) => {
            try {
                let _player = await this.getById(this.#thisPlayerId);
                resolve(_player);
            }
            catch (e) {
                reject(e);
            }
        })
    }
    /**
     * 
     * @param {number} id 
     */
    _setThisPlayer(id) {
        this.#thisPlayerId = id;
        this._client._socket["___this_player_id"] = id;
    }
}

/**
 * 
 * @param {Socket} socket 
 * @param {number} id 
 * @returns {Promise<Player>}
 */
function _getPlayerById(socket, id) {
    socket[`__player_${id}_found`] = false;
    return new Promise(async (resolve, reject) => {
        try {
            searchPlayerByIdCommand.execute(socket, id);
            await WaitUntil(socket, `__player_${id}_found`, "", 2500);
            resolve(socket[`__player_${id}_data`]);
        }
        catch (e) {
            reject(e);
        }
    });
}

/**
 * 
 * @param {Socket} socket 
 * @param {number} id 
 * @returns {Promise<number>}
 */
function _getPlayerByName(socket, name) {
    name = name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    socket[`__player_${name}_found`] = false;
    socket[`__player_${name}_id`] = 0;
    return new Promise(async (resolve, reject) => {
        try {
            getPlayerRankingsCommand.execute(socket, name);
            await WaitUntil(socket, `__player_${name}_found`, "", 2500);
            resolve(socket[`__player_${name}_id`]);
        }
        catch (e) {
            reject(e);
        }
    });
}

module.exports = PlayerManager