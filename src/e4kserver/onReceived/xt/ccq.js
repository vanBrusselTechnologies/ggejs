module.exports.name = "ccq";
/**
 *
 * @param {Socket} socket
 * @param {number} errorCode
 * @param {{QIDS:number[]}} params
 */
module.exports.execute = function (socket, errorCode, params) {
    if(!params) return;
    const questData = socket.client.clientUserData.questData
    for(let questId of params.QIDS){
        questData.markQuestCompleted(questId);
    }
}