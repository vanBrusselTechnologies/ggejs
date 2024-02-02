let firstTime = true;

module.exports.name = "nch";
/**
 * @param {Socket} socket
 * @param {number} errorCode
 * @param {object} params
 */
module.exports.execute = function (socket, errorCode, params) {
    if(firstTime){
        if(socket.debug) console.log(`Received NCH (NEW_CASH_HASH), but no file found in source code`)
    }
    firstTime = false
}