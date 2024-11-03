'use strict'

const BaseManager = require('./BaseManager');
const {execute: searchAllianceByIdCommand} = require('../e4kserver/commands/searchAllianceById');
const {execute: getAllianceRankingsCommand} = require('../e4kserver/commands/getAllianceRankings');
const {WaitUntil} = require('../tools/wait');
const Localize = require("../tools/Localize");

class AllianceManager extends BaseManager {

    /**
     *
     * @param {number} id
     * @returns {Promise<Alliance | MyAlliance>}
     */
    async getById(id) {
        return await _getAllianceById(this._socket, id);
    }

    /**
     *
     * @param {string} name
     * @returns {Promise<Alliance | MyAlliance>}
     */
    find(name) {
        return new Promise(async (resolve, reject) => {
            try {
                let _allianceId = await _getAllianceIdByName(this._socket, name);
                if (_allianceId === 0) reject(Localize.text(this._client, 'errorCode_114'));
                let _alliance = await this.getById(_allianceId);
                 */

                resolve(_alliance);
            } catch (e) {
                reject(Localize.text(this._client, 'errorCode_114'));
            }
        })
    }

    /** @returns {Promise<MyAlliance>} */
    getMyAlliance() {
        return new Promise(async (resolve, reject) => {
            try {
                const allianceId = this._client.clientUserData.allianceId;
                if (allianceId === -1) reject("You are not in an alliance!");
                let alliance = this.getById(allianceId);
                resolve(alliance);
            } catch (e) {
                reject(Localize.text(this._client, 'errorCode_114'));
            }
        })
    }
}

/**
 *
 * @param {Socket} socket
 * @param {number} id
 * @returns {Promise<Alliance | MyAlliance>}
 */
function _getAllianceById(socket, id) {
    return new Promise(async (resolve, reject) => {
        try {
            if (id == null) {
                reject('Missing alliance id!');
                return;
            }
            searchAllianceByIdCommand(socket, id);
            const alliance = await WaitUntil(socket, `_alliance_${id}_data`, "", 1000);
            delete socket[`_alliance_${id}_data`];
            resolve(alliance);
        } catch (e) {
            reject(Localize.text(socket.client, 'errorCode_114'));
        }
    });
}

/**
 *
 * @param {Socket} socket
 * @param {string} name
 * @returns {Promise<number>}
 */
function _getAllianceIdByName(socket, name) {
    return new Promise(async (resolve, reject) => {
        try {
            getAllianceRankingsCommand(socket, name);
            name = name.toString().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            const id = await WaitUntil(socket, `__alliance_${name}_id`, "", 1000);
            delete socket[`__alliance_${name}_id`];
            resolve(id);
        } catch (e) {
            reject(Localize.text(socket.client, 'errorCode_114'));
        }
    });
}

module.exports = AllianceManager