module.exports.name = "core_avl";
/**
 * @param {Socket} socket
 * @param {string} name
 * @param {string} password
 */
module.exports.execute = function (socket, name, password) {
    let CoreC2SVerifyLoginDataVO = {
        getCmdId: "core_avl", params: {LN: name, P: password}
    }
    require('../data').sendCommandVO(socket, CoreC2SVerifyLoginDataVO);
}