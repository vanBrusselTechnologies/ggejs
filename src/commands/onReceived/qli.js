module.exports.name = "qli";
/**
 * @param {BaseClient} client
 * @param {number} errorCode
 * @param {{QL:{QID:number, P:number[]}[]}} params
 */
module.exports.execute = function (client, errorCode, params) {
    const questData = client.clientUserData.questData
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