const {dailyactivities} = require('e4k-data').data;

module.exports.name = "dql";
/**
 * @param {BaseClient} client
 * @param {number} errorCode
 * @param {{PQL: number, RDQ:{QID:number, P:[number]}[], FDQ: number[], RS: [string,number|number[]][][]}} params
 */
module.exports.execute = async function (client, errorCode, params) {
    if (!params) return;
    try {
        for (const quest of params.RDQ) {
            const dailyActivity = dailyactivities.find(da => da.dailyQuestID === quest?.QID);
            if (dailyActivity === undefined) {
                client.logger.d('[DQL]', "Unknown Daily Activity Quest!", quest);
                continue;
            }
            try {
                switch (quest.QID) {
                    case 1: //login
                        await client.socketManager.reconnect();
                        break;
                    case 2: //spendC2
                    case 3: //collectTax
                    case 4: //resourceToPlayer
                    case 5: //spy
                    case 6: //sabotageDamage
                    case 7: //countDungeons
                    case 8: //countDungeons
                    case 9: //countDungeons
                    case 10://countDungeons
                    case 24://countDungeons tempServer
                    case 13://craftEquipment
                    case 14://writeInAllianceChat
                    case 15://collectFromCitizen
                    case 16://recruitUnits
                    case 17://produceTools
                    case 21://requestAllianceHelp
                    case 22://completeMercenaryMission
                    case 25://countBattles 10 tempServer
                    case 26://countBattles 15 tempServer
                        break;
                    default:
                        client.logger.d('[DQL]', "Unknown Daily Activity Quest!", quest);
                }
            } catch (e) {
                if (e.message === "Client disconnected!") return;
                if (e.message?.startsWith("Exceeded max time")) continue;
                client.logger.d('[DQL]', quest.QID, e);
            }
        }
    } catch (e) {
        client.logger.d('[DQL]', e);
    }
}