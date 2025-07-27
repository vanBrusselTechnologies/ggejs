const NAME = "pin";
/** @type {CommandCallback<void>[]}*/
const callbacks = [];

module.exports.name = NAME;

/**
 * @param {Client} client
 * @param {number} errorCode
 * @param {Object} params
 */
module.exports.execute = function (client, errorCode, params) {
    parsePIN(client, params);
    require('.').baseExecuteCommand(undefined, errorCode, params, callbacks);
}

/**
 * @param {Client} client
 * @return {Promise<void>}
 */
module.exports.pingpong = function (client) {
    const PingPongVO = {};
    return require('.').baseSendCommand(client, "pinpon", PingPongVO, callbacks, (_) => true);
}

module.exports.pin = parsePIN;

/**
 * @param {Client} client
 * @param {{NP: number}} params
 */
function parsePIN(client, params) {
    const nextPingTimeout = (params?.NP ?? 15) * 1000;
    setTimeout(async function () {
        try {
            await module.exports.pingpong(client);
        } catch (e) {
        }
    }, nextPingTimeout);
}