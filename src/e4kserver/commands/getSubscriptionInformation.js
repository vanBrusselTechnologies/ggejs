module.exports.name = "sie";
/** @param {Socket} socket */
module.exports.execute = function (socket) {
    let C2SSubscriptionsInformationVO = {
        getCmdId: "sie", params: {},
    }
    require('../data').sendCommandVO(socket, C2SSubscriptionsInformationVO);
}