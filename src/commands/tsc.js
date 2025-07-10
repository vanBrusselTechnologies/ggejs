const NAME = "tsc"
/** @type {CommandCallback<void>[]}*/
const callbacks = []

module.exports.name = NAME;

/**
 * @param {Client} client
 * @param {number} errorCode
 * @param {Object} params
 */
module.exports.execute = function (client, errorCode, params) {
    parseTSC(client, params);
    require('.').baseExecuteCommand(undefined, errorCode, params, callbacks);
}

/**
 * @param {Client} client
 * @param {number} serverType
 * @param {number} campTypeId
 * @param {boolean} onlyUseC2
 * @param {boolean} payWithRubies
 * @return {Promise<void>}
 */
module.exports.tempServerSelectCamp = function (client, serverType, campTypeId, onlyUseC2, payWithRubies) {
    const C2STempServerSelectCampVO = {
        SID: 0, ID: campTypeId, GST: serverType, OC2: onlyUseC2 ? 1 : 0, PWR: payWithRubies ? 1 : 0, D: -1
    }
    return require('.').baseSendCommand(client, NAME, C2STempServerSelectCampVO, callbacks, (_) => true);
}

module.exports.tsc = parseTSC;

/**
 * @param {Client} client
 * @param {{}} params
 */
function parseTSC(client, params) {
}