cc.Class({
    extends: cc.Component,

    properties: {
        diamPre: cc.Prefab,
    },

    onLoad() {
        AD.Menu = this;
        AD.allFood = ["汉堡", "可乐", "爆米花", "鸡腿", "鸡翅", "披萨", "薯条", "冰淇淋",];
        globalData.data.putSkin1 = -1;
        globalData.data.putSkin2 = -1;
        this.awardView = cc.find("awardView", this.node);
        AD.GameType = "";
        AD.firstFightGame = 0;
    },

    start() {
        AD.showBanner();
        if (AD.chanelNameTarget == "QQ" || AD.chanelNameTarget == "WX") {
            cc.find("shareBtn", this.node).active = true;
        }
        if (cc.audioEngine.getMusicVolume() == 1) {
            AD.sound.playSfx("BGM");
            AD.sound.playSfx("停止地震1");
            AD.sound.playSfx("停止地震2");
        }
        var qianDaoIndex = globalData.data.qianDaoIndex;
        if (globalData.data.qianDaoArray[qianDaoIndex % 7]) {
            console.log("已签到")
            cc.find("signInBtn/zjm_btn_Gth", this.node).active = false;
        }
        else {
            console.log("可以签到")
            cc.find("signInBtn/zjm_btn_Gth", this.node).active = true;
        }
        this.onAchieveTip()
        this.schedule(this.onAchieveTip, 1);
    },

    update(dt) {
        cc.find("onlineView/bg/downTime/text", this.node).getComponent(cc.Label).string = Tools.padding(Math.floor(AD.onlineTime / 60), 2) + ":" + Tools.padding(AD.onlineTime % 60, 2);
        cc.find("diamond/text", this.node).getComponent(cc.Label).string = parseInt(globalData.data.diamond);
        cc.find("onlineView/bg/getBtn", this.node).active = AD.canGetAward;
        cc.find("onlineBtn/zjm_btn_Gth", this.node).active = AD.canGetAward;
    },
    onBtnCallBack(e, t) {
        AD.sound.playSfx("按钮");
        switch (t) {
            case "双人合作":
                AD.showBanner();
                AD.chaPing();
                cc.find("skinShopView", this.node).active = true;
                AD.GameType = "双人合作";
                break
            case "双人对决":
                AD.chaPing();
                AD.showBanner();
                cc.find("skinShopView", this.node).active = true;
                AD.GameType = "双人对决";
                break
            case "打开在线奖励":
                this.onOnlineView();
                break
            case "获得在线奖励":
                AD.sound.playSfx("升级");
                AD.Menu.onCreatDiamond(cc.v2(-100, -15));
                globalData.addDiamond(100);
                cc.find("onlineView/bg/getBtn", this.node).getComponent(cc.Button).interactable = false;
                AD.onlineTime = 300;
                AD.canGetAward = false;
                break
            case "关闭在线奖励":
                Tools.resetDialog(cc.find("onlineView", this.node), false);
                break
            case "打开成就":
                Tools.resetDialog(cc.find("achieveView", this.node), true);
                break
            case "打开签到":
                Tools.resetDialog(cc.find("signInView", this.node), true);
                break
            case "打开视频奖励界面":
                Tools.resetDialog(this.awardView, true);
                break
            case "关闭视频奖励界面":
                Tools.resetDialog(this.awardView, false);
                break
            case "领取视频奖励钻石":
                AD.showAD(this.addDiamondVideoCallBack, this)
                break
            case "打开隐私":
                cc.find("yinSiView", this.node).active = true
                break
            case "oppo更多游戏":
                AD_Apk.moreGameOppo();
                break
            case "分享":
                AD.share();
                break
        }
    },
    //在线奖励界面
    onOnlineView() {

        Tools.resetDialog(cc.find("onlineView", this.node), true);
        cc.find("onlineView/bg/getBtn", this.node).active = false;
        if (AD.onlineTime == 0) {
            cc.find("onlineView/bg/getBtn", this.node).active = true;
        }
    },
    /**成就感叹号 */
    onAchieveTip() {
        this.needNum = [[3, 15, 30, 50, 100], [2, 4, 7], [3, 10, 35], [1, 4, 10], [1, 3, 5]];
        this.achieve = cc.find("achieveView/bg/ScrollView/view/content", this.node).children;
        for (var i = 0; i < this.achieve.length; i++) {
            if (!globalData.data.achieve[i].isGet[globalData.data.achieve[i].level]) {
                if (globalData.data.achieve[i].num >= this.needNum[i][globalData.data.achieve[i].level]) {
                    //可领取
                    cc.find("achievementBtn/zjm_btn_Gth", this.node).active = true;
                }
                else {
                    //未完成
                    cc.find("achievementBtn/zjm_btn_Gth", this.node).active = false;
                }
            }
            else {
                //领完
                cc.find("achievementBtn/zjm_btn_Gth", this.node).active = false;
            }

        }
    },
    /**创建钻石 */
    onCreatDiamond(pos) {
        for (var i = 0; i < Tools.random(6, 10); i++) {
            var diam = cc.instantiate(this.diamPre);
            diam.position = pos;
            diam.parent = this.node;
            diam.getComponent("coin").init(cc.v2(-446, 300))
        }
    },
    addDiamondVideoCallBack() {
        AD.Menu.onCreatDiamond(cc.v2(-85, -22));
        globalData.addDiamond(200);
        //成就
        globalData.data.achieve[4].num++;
        globalData.saveData();
        Tools.resetDialog(this.awardView, false);
    }
});
