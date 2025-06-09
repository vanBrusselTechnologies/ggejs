module.exports.name = "tle";
/**
 * @param {Socket} socket
 * @param {number} errorCode
 * @param {[]} params
 */
module.exports.execute = async function (socket, errorCode, params) {
    if (errorCode === 10005) return await socket.client.socketManager.onLogin();
    console.log('tle', errorCode, params);
}