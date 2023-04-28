const General = require("../../../structures/General");
module.exports = {
    name: "gie",
    /**
     * @param {Socket} socket
     * @param {number} errorCode
     * @param {object} params
     */
    execute(socket, errorCode, params) {
        const generals = [];
        for(let g of params["G"]){
            generals.push(new General(socket.client, g));
        }
        socket.client.equipments._setGenerals(generals);
    }
}