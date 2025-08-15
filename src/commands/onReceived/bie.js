module.exports.name = "bie";
/**
 * @param {BaseClient} client
 * @param {number} errorCode
 * @param {{GE:Array}} params
 */
module.exports.execute = function (client, errorCode, params) {
    const boosts = {};
    for (const i in params["GE"]) boosts[i] = true;
    // TODO: globalEffectsRuntimeData.setActiveBoosts(boosts);
}