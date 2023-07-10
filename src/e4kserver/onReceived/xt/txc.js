const { execute: startTaxCommand } = require('./../../commands/startTaxCommand');

module.exports = {
    name: "txc",
    /**
     * @param {Socket} socket
     * @param {number} _
     * @param {object} __
     */
    execute(socket, _, __) {
        startTaxCommand(socket);
    }
}