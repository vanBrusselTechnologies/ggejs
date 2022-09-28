module.exports = {
    name: "hgh",
    /**
     * @param {Socket} socket
     * @param {number} errorCode
     * @param {object} params
     */
    execute(socket, errorCode, params) {
        if (errorCode === 114) {
            return socket["__get_alliance_error"] = "Alliance not found!";
        }
        if (errorCode === 21) {
            return socket["__get_player_error"] = "Player not found!";
        }
        if (socket["_searching_alliance_name"] && socket["_searching_alliance_name"] !== "") {
            try {
                if (!params || !params.L) {
                    return socket["__get_alliance_error"] = "Alliance not found!";
                }
                let leaderbord = [];
                leaderbord = params.L;
                let _alliance = leaderbord.find(x => {
                    let _name = socket["_searching_alliance_name"].toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                    let _allianceName = x[2][1];
                    _allianceName = _allianceName.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                    return _allianceName === _name;
                });
                if (!_alliance) {
                    _alliance = leaderbord.find(x => x[0].toString() === socket["_searching_alliance_name"])
                }
                if (!_alliance) return socket["__get_alliance_error"] = "Alliance not found!";
                socket["__found_alliance_id"] = _alliance[2][0];
                socket["__alliance_found"] = true;
                socket["_searching_alliance_name"] = "";
            }
            catch (e) {
                return socket["__get_alliance_error"] = "Unexpected error!";
            }
        }
        try {
            if (!params || !params.L) return;
            let leaderbord = [];
            leaderbord = params.L;
            leaderbord.forEach(x => {
                let _playerName = x[2].N;
                _playerName = _playerName.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                socket[`__player_${_playerName}_found`] = true;
                socket[`__player_${_playerName}_id`] = x[2].OID;
            });
        }
        catch(e){}
    }
}