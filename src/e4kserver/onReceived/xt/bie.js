module.exports.name = "bie";
/**
 * @param {Socket} socket
 * @param {number} errorCode
 * @param {{GE:Array}} params
 */
module.exports.execute = function (socket, errorCode, params) {
    const boosts = {};
    for(let i in params["GE"]) boosts[i] = true;
    //todo: globalEffectsRuntimeData.setActiveBoosts(boosts);
}