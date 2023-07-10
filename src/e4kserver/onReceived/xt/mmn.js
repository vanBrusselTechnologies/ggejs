const Player = require("../../../structures/Player");
const {parseWorldmapAreas} = require("./gaa");
const Good = require("../../../structures/Good");

module.exports = {
    name: "mmn",
    /**
     * @param {Socket} socket
     * @param {number} errorCode
     * @param {object} params
     */
    execute(socket, errorCode, params) {
        if (params == null) {
            socket[`mmn -> errorCode`] = errorCode;
            return;
        }
        const client = socket.client;
        const players = [];
        for(let player of params.O){
            players.push(new Player(client, {O: player}));
        }
        const areas = parseWorldmapAreas(client, params["gaa"]?.["AI"]);
        const goods = [];
        for(let good of params["R"]){
            goods.push(new Good(client, good));
        }
        socket[`mmn -> ${params.MID}`] = {
            messageId: params.MID,
            players: players,
            sourceArea: areas[0],
            targetArea: areas[1],
            goods: goods,
        };
    }
}