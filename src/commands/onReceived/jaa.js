const Castle = require("../../structures/Castle");

module.exports.name = "jaa";
/**
 * @param {Client} client
 * @param {number} errorCode
 * @param {Object} params
 */
module.exports.execute = function (client, errorCode, params) {
    if (params === undefined || errorCode !== 0) {
        let error = errorCode;
        if (errorCode === 106) error = "Ruin";
        client._socket[`join_area_error`] = error;
        return;
    }
    const castle = new Castle(client, params);
    client._socket[`join_area_${castle.mapobject.objectId}_data`] = castle;
}