const fs = require('fs');

exports.Client = require('./Client');

//Managers
fs.readdirSync(__dirname + '/managers/').forEach(function (file) {
    exports[file.replace('.js', '')] = require('./managers/' + file);
});

//Structures
fs.readdirSync(__dirname + '/structures/').forEach(function (file) {
    exports[file.replace('.js', '')] = require('./structures/' + file);
});

//Utils
exports.Constants = require('./utils/Constants');