module.exports.name = "tle";
/**
 *
 * @param {Socket} socket
 * @param {number} errorCode
 * @param {object} params
 */
module.exports.execute = async function (socket, errorCode, params) {
    if (socket.debug) console.log(errorCode + " => " + (errorCode === 145 ? "EventNotStarted" : "SuccessOrAnotherFailure"))
    console.log(params);
    try {
        console.log(socket["serverLoginTokenServerInfo"].token.length)
        const client2 = new (require('./../../../Client'))("matthijs990_NL1", socket["serverLoginTokenServerInfo"].token, socket["serverLoginTokenServerInfo"], true);
        client2._socket.ultraDebug = true;
        client2.language = 'nl';
        await client2.connect()
    } catch (e) {
        console.log(e);
    }
    if (errorCode === 145) return; //event isn't started
    console.log('No 145 errorCode')
    console.log(params);
}