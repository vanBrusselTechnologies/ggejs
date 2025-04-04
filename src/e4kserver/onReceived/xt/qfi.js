const {execute: gxp} = require('./gxp');
const {execute: gcu} = require('./gcu');
const {execute: grc} = require('./grc');
const {execute: gpa} = require('./gpa');
const {execute: gui} = require('./gui');

module.exports.name = "qfi";
/**
 * @param {Socket} socket
 * @param {number} errorCode
 * @param {{QID:number, GEQ: [], gxp:Object, gcu:{C1: number, C2: number}, grc:Object, gpa:Object, gui:Object}} params
 */
module.exports.execute = function (socket, errorCode, params) {
    const questData = socket.client.clientUserData.questData
    if (params.gxp) gxp(socket, 0, params.gxp)
    if (params.gcu) gcu(socket, 0, params.gcu)
    if (params.grc) grc(socket, 0, params.grc)
    if (params.gpa) gpa(socket, 0, params.gpa)
    if (params.gui) gui(socket, 0, params.gui)
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