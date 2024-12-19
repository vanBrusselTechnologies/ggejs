'use strict'

const BaseManager = require('./BaseManager');
const {execute: searchAllianceById} = require('../e4kserver/commands/searchAllianceById');
const {execute: getAllianceRankings} = require('../e4kserver/commands/getAllianceRankings');
const {WaitUntil} = require('../tools/wait');
const Localize = require("../tools/Localize");

class AllianceManager extends BaseManager {
    /**
     * @param {number} id
     * @returns {Promise<Alliance | MyAlliance>}
     */
    async getById(id) {
        return await _getAllianceById(this._socket, id);
    }

    /**
     * @param {string} name
     * @returns {Promise<Alliance | MyAlliance>}
     */
    async find(name) {
        const _allianceId = await _getAllianceIdByName(this._socket, name);
        return await this.getById(_allianceId);
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
            searchAllianceById(socket, id);
            const alliance = await WaitUntil(socket, `_alliance_${id}_data`, "", 1000);
            delete socket[`_alliance_${id}_data`];
            resolve(alliance);
        } catch (e) {
            reject(Localize.text(socket.client, 'errorCode_114'));
        }
    });
}

/**
 * @param {Socket} socket
 * @param {string} name
 * @returns {Promise<number>}
 */
function _getAllianceIdByName(socket, name) {
    return new Promise(async (resolve, reject) => {
        try {
            getAllianceRankings(socket, name);
            name = name.toString().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            const hghData = await WaitUntil(socket, `hgh_11_${name}`, "", 1000);
            delete socket[`hgh_11_${name}`];
            resolve(hghData.items.find(item => item.rank === hghData.foundRank).alliance.allianceId);
        } catch (e) {
            reject(Localize.text(socket.client, 'errorCode_114'));
        }
    });
}

module.exports = AllianceManager