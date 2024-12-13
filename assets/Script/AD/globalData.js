window.globalData = {
    firstGameStr: "firstGame_shuangRenChuFang_",
    dataStr: "data_shuangRenChuFang_",
    data: {
        lastDay: null,
        nowDay: null,
        qianDaoArray: [false, false, false, false, false, false, false,],
        qianDaoIndex: 0,

        unlockFood: ["汉堡", "可乐"],
        // unlockFood: ["汉堡", "可乐", "爆米花", "鸡腿", "鸡翅", "披萨", "薯条", "冰淇淋",],
        unLockSkin: [true, false, false, false, false, false, false,],
        putSkin1: 0,
        putSkin2: 0,
        coin: 100,
        diamond: 0,
        tempDiamond: 0,
        kitchenUp: [0, 0, 0, 0, 0, 0, 0, 0],
        day: -1,
        achieve: [
            {
                level: 0,
                num: 0,
                isGet: [false, false, false, false, false]
            },
            {
                level: 0,
                num: 1,
                isGet: [false, false, false]
            },
            {
                level: 0,
                num: 0,
                isGet: [false, false, false]
            },
            {
                level: 0,
                num: 0,
                isGet: [false, false, false]
            },
            {
                level: 0,
                num: 0,
                isGet: [false, false, false]
            },
        ],
        //对决
        fightCoin: [0, 0],
        kitchenUp_fight: [[0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0]],
        playFightNum: 1,
    },

    getDataAll() {
        // switch (AD.chanelNameTarget) {
        //     case "QQ":
        //         globalData.firstGameStr="firstGame_shuangRenChuFang_QQ"
        //         globalData.dataStr="data_shuangRenChuFang_QQ"
        //         break;
        //     case "WX":
        //         globalData.firstGameStr="firstGame_shuangRenChuFang_WX"
        //         globalData.dataStr="data_shuangRenChuFang_WX"
        //         break;
        //     case "UC":
        //         globalData.firstGameStr="firstGame_shuangRenChuFang_UC"
        //         globalData.dataStr="data_shuangRenChuFang_UC"
        //         break;
        //     case "TT":
        //         globalData.firstGameStr="firstGame_shuangRenChuFang_TT"
        //         globalData.dataStr="data_shuangRenChuFang_TT"
        //         break;
        //     case "OPPO":
        //         globalData.firstGameStr="firstGame_shuangRenChuFang_OPPO"
        //         globalData.dataStr="data_shuangRenChuFang_OPPO"
        //         break;
        //     case "VIVO":
        //         globalData.firstGameStr="firstGame_shuangRenChuFang_VIVO"
        //         globalData.dataStr="data_shuangRenChuFang_VIVO"
        //         break;
        //     case "BD":
        //         globalData.firstGameStr="firstGame_shuangRenChuFang_BD"
        //         globalData.dataStr="data_shuangRenChuFang_BD"
        //         break;
        //     case "HW":
        //         globalData.firstGameStr="firstGame_shuangRenChuFang_HW"
        //         globalData.dataStr="data_shuangRenChuFang_HW"
        //         break;
        //     case "KS":
        //         globalData.firstGameStr="firstGame_shuangRenChuFang_KS"
        //         globalData.dataStr="data_shuangRenChuFang_KS"
        //         break;
        //     case "vivoApk":
        //         globalData.firstGameStr="firstGame_shuangRenChuFang_vivoApk"
        //         globalData.dataStr="data_shuangRenChuFang_vivoApk"
        //         break;
        // }
        if (AD.chanelNameTarget == "TT") {
            globalData.firstGameStr += "1_";
            globalData.dataStr += "1_";
        }
        globalData.firstGameStr += AD.chanelNameTarget;
        globalData.dataStr += AD.chanelNameTarget;
        // globalData.clearAllData();//清除所有 

        cc.debug.setDisplayStats(false);
        if (cc.sys.localStorage.getItem(globalData.firstGameStr) != "1") {
            cc.log("首次进入游戏")
            globalData.saveData();
            globalData.data = globalData.getData();
            cc.sys.localStorage.setItem(globalData.firstGameStr, "1");
        }
        else {
            cc.log("非首次进入游戏 " + cc.sys.localStorage.getItem(globalData.firstGameStr))
            globalData.data = globalData.getData();

        }
    },
    getData() {
        var _res = cc.sys.localStorage.getItem(globalData.dataStr);
        if (_res != null)
            return JSON.parse(_res);
    },

    clearAllData() {
        cc.sys.localStorage.removeItem(globalData.firstGameStr);
        cc.sys.localStorage.removeItem(globalData.dataStr);

    },
    saveData() {
        cc.sys.localStorage.setItem(globalData.dataStr, JSON.stringify(globalData.data));

    },
    /**加金币 */
    addCoin(num) {
        // cc.tween(globalData.data)
        //     .by(1, { coin: num })
        //     .call(() => {
        //         globalData.saveData();
        //     })
        //     .start();
        globalData.data.coin += num;
        globalData.saveData();
    },
    /**加钻石 */
    addDiamond(_num) {
        globalData.data.tempDiamond += _num;
        cc.tween(globalData.data)
            .to(1, { diamond: globalData.data.tempDiamond })
            .call(() => {
                globalData.saveData();
            })
            .start();
    },
    /**加对战模式金币 */
    addFightCoin(num, index) {
        globalData.data.fightCoin[index] += num;
        globalData.saveData();
    },
}