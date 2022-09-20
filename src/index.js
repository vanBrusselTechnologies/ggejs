exports.Client = require('./Client');

//Managers
exports.AllianceManager = require("./managers/AllianceManager");
exports.MovementManager = require("./managers/MovementManager");
exports.PlayerManager = require("./managers/PlayerManager");

//Structures
exports.AlienInvasionMapobject = require('./structures/AlienInvasionMapobject');
exports.Alliance = require('./structures/Alliance');
exports.AllianceDonations = require('./structures/AllianceDonations');
exports.AllianceMember = require('./structures/AllianceMember');
exports.ArmyAttackMovement = require('./structures/ArmyAttackMovement');
exports.BasicMapobject = require('./structures/BasicMapobject');
exports.MyAlliance = require('./structures/MyAlliance');
exports.Player = require('./structures/Player');

//Utils
exports.Constants = require('./utils/Constants');