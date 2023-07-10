module.exports = {
    name: "tle",
    /**
     *
     * @param {Socket} socket
     * @param {number} errorCode
     * @param {object} params
     */
    async execute(socket, errorCode, params) {
        if(socket.debug) console.log(errorCode + " => " + errorCode === 145 ? "EventNotStarted" : "SuccessOrAnotherFailure")
        if(errorCode === 145) return; //event isn't started
        console.log(params);

        //const sector = await socket.client.worldmaps.getSector(0, 5, 6);
        //console.log(sector);
        //require('./../../commands/getPlayerRankings').execute(socket, "1", "tempServerDailyMight");

        let C2SGetPlayerHighscoreVO = {
            params: {},
            getCmdId: 'tsh',
        }
        require('../../data').sendJsonVoSignal(socket, {"commandVO": C2SGetPlayerHighscoreVO, "lockConditionVO": null});

        const serverInstance = socket.client._serverInstance2;
        console.log(serverInstance);
        serverInstance['server'] = serverInstance['ip'];
        const client = new (require('./../../../Client'))("matthijs990_NL1", "Weesp02_NL1", 300, true, serverInstance);
        console.log(client._serverInstance);
        //await client.connect();
        //const tmp_ = socket.client._serverInstance;
        //socket.client._serverInstance.zone = socket.client._serverInstance2.zone;
        //const sector_test = await socket.client.alliances.find('Zavin');
        //socket.client._serverInstance = tmp_;
        //console.log(sector_test);
    }
}