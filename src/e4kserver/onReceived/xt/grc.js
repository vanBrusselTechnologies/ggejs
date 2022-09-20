const Good = require("./../../../structures/Good");

module.exports = {
    name: "grc",
    /**
     * @param {number} errorCode
     * @param {object} params
     */
    execute(socket, errorCode, params) {
        let resources = {};
        if(params === undefined) return resources;
        resources = parseResources(socket.client, params);
        return resources;
    }
}

function parseResources(client, data) {
    let resources = [];
    for (let i in data) {
        if(i !== "AID" && i !== "KID"){
            resources.push(new Good(client, [i, data[i]]))
        }
    }
    return resources;
}