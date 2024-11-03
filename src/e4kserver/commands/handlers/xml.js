/**
 * @param {Socket} socket
 * @param {Object} header
 * @param {string} action
 * @param {number} fromRoom
 * @param {string} message
 */
module.exports.sendAction = function (socket, header, action, fromRoom, message) {
    let msg = makeXmlHeader(header) + (`<body action=\'${action}\' r=\'${fromRoom}\'>${message}</body></msg>`);
    require('../../data.js').writeToSocket(socket, msg);
}

/**
 * @param {Object} headerObj
 * @returns {string}
 */
function makeXmlHeader(headerObj) {
    let header = "<msg";
    for (let attribute in headerObj) {
        header += ` ${attribute}=\'${headerObj[attribute]}\'`;
    }
    return header + ">";
}