module.exports.name = "ccq";
/**
 * @param {Client} client
 * @param {number} errorCode
 * @param {{QIDS:number[]}} params
 */
module.exports.execute = function (client, errorCode, params) {
    if (!params) return;
    const questData = client.clientUserData.questData;
    for (const questId of params.QIDS) {
        questData.markQuestCompleted(questId);
    }
}