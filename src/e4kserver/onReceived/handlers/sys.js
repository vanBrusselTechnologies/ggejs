const path = require('node:path');
const fs = require('fs');

const commands = [];
const commandPath = path.join(__dirname, '../sys');
const commandFiles = fs.readdirSync(commandPath).filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const filePath = path.join(commandPath, file);
    const command = require(filePath);
    commands[command.name] = command.execute;
}

/**
 * @param {Socket} socket
 * @param {Object} event
 */
module.exports.onResponse = function (socket, event) {
    let action = event.body["$"].action;
    let handler = commands[action];
    if (handler != null) {
        handler.apply(this, [socket, event]);
    } else {
        if (socket.debug) console.warn(`[RECEIVED UNKNOWN EVENT] ${JSON.stringify(event)}`);
    }
}