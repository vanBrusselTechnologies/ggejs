module.exports.name = "qst";
/**
 *
 * @param {Socket} socket
 * @param {number} errorCode
 * @param {{QIDS:number[]}} params
 */
module.exports.execute = function (socket, errorCode, params) {
    const questData = socket.client.clientUserData.questData
    for(let questId of params.QIDS){
        questData.startQuest(questId);
    }
}