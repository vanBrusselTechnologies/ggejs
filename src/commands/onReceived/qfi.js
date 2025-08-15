const {execute: gxp} = require('./gxp');
const {execute: gcu} = require('./gcu');
const {execute: grc} = require('./grc');
const {execute: gpa} = require('./gpa');
const {execute: gui} = require('./gui');

module.exports.name = "qfi";
/**
 * @param {BaseClient} client
 * @param {number} errorCode
 * @param {{QID:number, GEQ: [], gxp:Object, gcu:{C1: number, C2: number}, grc:Object, gpa:Object, gui:Object}} params
 */
module.exports.execute = function (client, errorCode, params) {
    const questData = client.clientUserData.questData;
    if (params.gxp) gxp(client, 0, params.gxp)
    if (params.gcu) gcu(client, 0, params.gcu)
    if (params.grc) grc(client, 0, params.grc)
    if (params.gpa) gpa(client, 0, params.gpa)
    if (params.gui) gui(client, 0, params.gui)
    const questId = params.QID;
    /* TODO
        const quest = questData.createQuest(questId);
        const gainedEquipment = params.GEQ;
        if (gainedEquipment && gainedEquipment.length > 0) {
            quest.rewardEquipments = [];
            let size = gainedEquipment.length;
            let i = 0;
            while (i < size) {
                quest.rewardEquipments.push(equipmentJSONParser.parse(gainedEquipment.pop()[1]));
                i++;
            }
        }*/
    questData.finishQuest(questId);
}