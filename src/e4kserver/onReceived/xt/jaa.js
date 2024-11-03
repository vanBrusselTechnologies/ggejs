const Castle = require("../../../structures/Castle");

module.exports.name = "jaa";
/**
 * @param {Socket} socket
 * @param {number} errorCode
 * @param {Object} params
 */
module.exports.execute = function (socket, errorCode, params) {
    if (params === undefined || errorCode !== 0) {
        let error = errorCode;
        if (errorCode === 106) error = "Ruin";
        socket[`join_area_error`] = error;
        return;
    }
    const castle = new Castle(socket.client, params);
    socket[`join_area_${castle.mapobject.objectId}_data`] = castle;
    socket[`join_area_${castle.mapobject.objectId}_finished`] = true;
}