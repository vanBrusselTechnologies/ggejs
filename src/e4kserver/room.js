const {sendAction} = require("./commands/handlers/xml");

let roomList = [];

/**
 * @param {Object} u
 * @param {number} id
 * @param {number} roomId
 */
module.exports.addUserToRoom = function (u, id, roomId) {
    console.log("addUserToRoom", u, id, roomId);
    roomList[roomId].userList[id] = u;
    if (roomList[roomId].game && u.isSpectator()) {
        roomList[roomId].specCount++;
    } else {
        roomList[roomId].userCount++;
    }
}

/**
 * @param {number} index
 * @param {Object} room
 */
module.exports.setRoomListIndex = function (index, room) {
    roomList[index] = room;
}

/** @return {boolean} */
function _checkRoomList() {
    return roomList !== null;
}

module.exports.checkRoomList = _checkRoomList

/** @param {Socket} socket */
module.exports.autoJoinRoom = function (socket) {
    if (!_checkRoomList()) return;
    let headers = {"t": "sys"};
    sendAction(socket, headers, "autoJoin", !!socket["_activeRoomId"] ? socket["_activeRoomId"] : -1, "");
}

/**
 * @param {Array} data
 */
module.exports.setRoomList = function (data) {
    let rooms = getAllRooms();
    let index = data[1];
    let userCount = decompressInt(data[2]);
    let maxUsers = decompressInt(data[3]);
    let _loc3_ = decompressInt(data[4]);
    while (rooms.length <= index) (rooms.push({}));
    rooms[index] = {
        id: index,
        name: data[5],
        maxSpectators: 0,
        maxUsers: maxUsers,
        temp: (_loc3_ >> 1 & 1) === true,
        game: (_loc3_ >> 2 & 1) === true,
        priv: (_loc3_ >> 0 & 1) === true,
        limbo: (_loc3_ >> 3 & 1) === true,
        userCount: userCount,
        specCount: 0,
        userList: [],
        variables: [],
    };
}

/** @return {Object[]}*/
function getAllRooms() {
    return roomList;
}

/**
 * @param {number} index
 */
module.exports.getRoom = function (index) {
    if (!_checkRoomList()) return null;
    return roomList[index];
}

/**
 * @param {string} input
 */
function decompressInt(input) {
    let _loc3_ = 0;
    let _loc6_ = "A".charCodeAt(0);
    let _loc5_ = "z".charCodeAt(0);
    let _loc4_ = _loc5_ - _loc6_ + 1;
    let _loc2_ = 0;
    if (input && input.length > 0) {
        _loc3_ = input.length - 1;
        while (_loc3_ >= 0) {
            if (input.charCodeAt(_loc3_) < _loc6_ || input.charCodeAt(_loc3_) > _loc5_) {
                return -1;
            }
            _loc2_ = _loc2_ * _loc4_ + input.charCodeAt(_loc3_) - _loc6_;
            _loc3_--;
        }
    }
    return _loc2_;
}

/**
 * @param {Socket} socket
 * @param {Object} event
 */
module.exports.onJoinRoom = function (socket, event) {
    let room = event.params["room"];
    socket["_activeRoomId"] = room.id;

    //todo: move and make available to public: register account
    // const { execute: requestLoginData} = require('./commands/requestLoginData')
    // requestLoginData(socket)

    socket.client._verifyLoginData();
}