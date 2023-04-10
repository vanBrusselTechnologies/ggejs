const Lord = require("./../../../structures/Lord");

module.exports = {
    name: "gli",
    /**
     * @param {Socket} socket
     * @param {number} errorCode
     * @param {object} params
     */
    execute(socket, errorCode, params) {
        const barons = parseLords(socket.client, params.B);
        const commandants = parseLords(socket.client, params.C);
        socket.client.equipments._setCommandantsAndBarons(barons, commandants);
    }
}

function parseLords(client, data) {
    let lords = [];
    for (let i in data) {
        lords.push(new Lord(client, data[i]));
    }
    return lords;
}