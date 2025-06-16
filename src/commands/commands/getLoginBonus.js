module.exports.name = "alb";
/** @param {Client} client */
module.exports.execute = function (client) {
    const C2SGetLoginBonusVO = {};
    client.socketManager.sendCommand("alb", C2SGetLoginBonusVO);
}