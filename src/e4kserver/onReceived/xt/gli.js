const Lord = require("./../../../structures/Lord");

module.exports = {
    name: "gli",
    /**
     * @param {Socket} socket
     * @param {number} errorCode
     * @param {object} params
     */
    execute(socket, errorCode, params) {
        socket["barons"] = parseLords(socket.client, params.B);
        socket["generals"] = parseLords(socket.client, params.G);
    }
}

function parseLords(client, data) {
    let lords = [];
    for (let i in data) {
        lords.push(new Lord(client, data[i]));
    }
    return lords;
}