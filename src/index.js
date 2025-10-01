const fs = require('node:fs');

// TODO: https://github.com/danadum/empire-api
exports.BaseClient = require('./BaseClient');
exports.EmpireClient = require('./EmpireClient');
exports.ExternalClient = require('./ExternalClient');
exports.E4KClient = require('./E4KClient');

//Managers
fs.readdirSync(__dirname + '/managers/').forEach(function (file) {
    exports[file.replace('.js', '')] = require('./managers/' + file);
});

//Structures
fs.readdirSync(__dirname + '/structures/').forEach(function (file) {
    if (file.endsWith('.js')) {
        exports[file.replace('.js', '')] = require('./structures/' + file);
    } else {
        try {
            const folder = file;
            fs.readdirSync(`${__dirname}/structures/${folder}/`).forEach(function (subFile) {
                if (subFile.endsWith('.js')) {
                    exports[subFile.replace('.js', '')] = require(`./structures/${folder}/${subFile}`);
                }
            });
        } catch (e) {
        }
    }
});

//Utils
exports.Constants = require('./utils/Constants');