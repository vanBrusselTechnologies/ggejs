//const AllianceBattleGroundEvent = require("../../../structures/events/AllianceBattleGroundEvent");

module.exports.name = "sei";
/**
 * @param {Socket} socket
 * @param {number} errorCode
 * @param {Object} params
 */
module.exports.execute = function (socket, errorCode, params) {
    if (socket["eventsssss"] == null) socket["eventsssss"] = []
    if (!params.E) return;
    //console.log(params.E.filter(e=>e.EID === 15))
    /** @type {Client} */
    /*todo const client = socket.client;
    let _events = [];
    for (const ev of params.E) {
        if (!ev) continue;
        //let event;
        switch (ev.EID) {
            case 84:
                break;
            case 113:
                _events.push(new AllianceBattleGroundEvent(client, ev));
                //handleEventToOfferConversion(_loc5_,eventInfo);
                break;
            default: {
                if(!socket["eventsssss"].find(e=> e === ev.EID)) {
                    socket["eventsssss"].push(ev.EID);
                    //if(socket.debug) console.log(`Current event (eventId ${ev.EID}) isn't fully supported!`);
                }
                if (socket.debug) {
                    //console.log(ev);
                }
                //_events.push(new ActiveEvent(client, ev));
            }
        }
    }*/
    //console.log(`current active events: ${socket["eventsssss"].length}`);
    //client.events._add_or_update(_events);
}
