module.exports.name = "qli";
/**
 * @param {Socket} socket
 * @param {number} errorCode
 * @param {{QL:{QID:number, P:number[]}[]}} params
 */
module.exports.execute = function (socket, errorCode, params) {
    const questData = socket.client.clientUserData.questData
    const questList = params.QL
    for (const questListItem of questList) {
        const quest = questData.createQuest(questListItem.QID);
        if (quest) {
            quest.fillProgress(questListItem.P);
            questData.addQuestToList(quest);
        }
    }
    questData.sort();
}