module.exports.name = "qst";
/**
 * @param {Client} client
 * @param {number} errorCode
 * @param {{QIDS:number[]}} params
 */
module.exports.execute = function (client, errorCode, params) {
    const questData = client.clientUserData.questData
    for (const questId of params.QIDS) questData.startQuest(questId);
}