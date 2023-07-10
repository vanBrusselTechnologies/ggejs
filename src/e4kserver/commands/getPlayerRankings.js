module.exports = {
    name: "hgh", /**
     * @param {Socket} socket
     * @param {string} searchValue
     * @param {"might" | "honor" | "loot" | "achievementPoints" | "tempServerDailyMight" | "tempServerOverallMight" | "tempServerDailyCollector" | "tempServerOverallCollector" | "tempServerDailyRankSwap" | "tempServerOverallRankSwap" | "tempServerCharge"} rankingType
     */
    execute(socket, searchValue = "1", rankingType = "might") {
        let listType = 2;
        switch (rankingType) {
            case "achievementPoints":
                listType = 1;
                break;
            case "loot":
                listType = 2;
                break;
            case "honor":
                listType = 5;
                break;
            case "might":
                listType = 6;
                break;
            case "tempServerDailyMight":
                listType = 61;
                break;
            case "tempServerOverallMight":
                listType = 62;
                break;
            case "tempServerDailyCollector":
                listType = 65;
                break;
            case "tempServerOverallCollector":
                listType = 62;
                break;
            case "tempServerDailyRankSwap":
                listType = 66;
                break;
            case "tempServerOverallRankSwap":
                listType = 62;
                break;
            case "tempServerCharge":
                listType = 73;
                break;
            default:
                break;
        }
        let C2SGetHighscoreVO = {
            params: {
                SV: searchValue, LT: listType, LID: 6 //LID = bracket based on level, starting with 1
            }, getCmdId: "hgh",
        }
        require('./../data').sendJsonVoSignal(socket, {
            "commandVO": C2SGetHighscoreVO, "lockConditionVO": "new DefaultLockConditionVO()"
        });
    }
}