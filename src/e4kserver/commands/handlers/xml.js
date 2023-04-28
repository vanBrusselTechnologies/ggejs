module.exports = {
    /**
     * @param {Socket} socket
     * @param {object} header
     * @param {string} action
     * @param {number} fromRoom
     * @param {string} message
     */
    sendAction(socket, header, action, fromRoom, message) {
        _send(socket, header, action, fromRoom, message)
    }
}

/**
 * @param {Socket} socket
 * @param {object} header
 * @param {string} action
 * @param {number} fromRoom
 * @param {string} message
 */
function _send(socket, header, action, fromRoom, message) {
    let msg = makeXmlHeader(header) + (`<body action=\'${action}\' r=\'${fromRoom}\'>${message}</body></msg>`);
    require('./../../data.js').writeToSocket(socket, msg);
}

/**
 *
 * @param {object} headerObj
 */
function makeXmlHeader(headerObj) {
    let header = "<msg";
    for (let _loc2_ in headerObj) {
        header += ` ${_loc2_}=\'${headerObj[_loc2_]}\'`;
    }
    return header + ">";
}