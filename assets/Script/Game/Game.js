cc.Class({
    extends: cc.Component,

    properties: {
        hitPre: cc.Prefab,
        wantEatPre: cc.Prefab,
        jianZhuSuiPianPre: cc.Prefab,
        npcPre: cc.Prefab,
        viewManager: [cc.SpriteFrame],
        talkManager: [cc.SpriteFrame],
        jiangBeiImg: [cc.SpriteFrame],
        bgImg: [cc.SpriteFrame],
        guiTaiImg: cc.SpriteFrame,
    },

    onLoad() {
        AD.Game = this;
        this.wantEatParent = cc.find("wantEatParent", this.node);
        this.keRen = cc.find("keRen", this.node);
        this.keRen2 = cc.find("keRen2", this.node);
        this.Player1 = cc.find("control/Player1", this.node);
        this.Player2 = cc.find("control/Player2", this.node);
        /**服务的客人 */
        this.serveGuest = 1;
        this.serveGuest_temp = this.serveGuest;
        /**出现了的客人 */
        this.creatGuest = 0;
        /**错过的客人 */
        this.missGuest = 0;
        /**丢掉的食物 */
        this.loseFood = 0;
        /**完美服务 */
        this.projectServe = 0;
        /**制作食物时间 */
        this.makeFoodTime = 1.5;
        /**成本百分比 */
        this.cosePct = 1;
        /**客人等待时间 */
        this.guestWaitTime = 100;
        /**眩晕时间 */
        this.dizzyTime = 2;
        /**餐盘食物坐标 */
        this.canPanPos = [cc.v2(-90, 5), cc.v2(-30, 5), cc.v2(30, 5), cc.v2(90, 5),];
        /**上菜数量 */
        this.servingNum = 0;
        /**黑夜的可见 */
        this.blackOpacity = 200;
        /**暂停机关 */
        this.pauseJiGuan = false;

        this.jiGuanTime = 1;
        /**客人需求加速 */
        this.needSpeedup = false;
        /**启动机关 */
        this.startAuthority = false;
        /**没钱 */
        this.noMoney = false;
        this.GameOver = false;
        /**键盘移动 */
        this.keyBoardMove = false;
    },

    start() {
        AD.hideBanner();
        this.Player1.getChildByName("img").getComponent(sp.Skeleton).setSkin("js" + (globalData.data.putSkin1 + 1));
        this.Player2.getChildByName("img").getComponent(sp.Skeleton).setSkin("js" + (globalData.data.putSkin2 + 1));
        this.Player1.getChildByName("img2").getComponent(sp.Skeleton).setSkin("js" + (globalData.data.putSkin1 + 1));
        this.Player2.getChildByName("img2").getComponent(sp.Skeleton).setSkin("js" + (globalData.data.putSkin2 + 1));
        // this.onZhangAi();
        this.onInitGame();

        cc.director.on("完成客人需求", (e) => {
            cc.find("control/guiTaiTop/canPan", this.node).removeAllChildren();
            this.servingNum = 0;
            if (this.serveGuest_temp == 1) {
                if (e == "yidong_shengqi") {
                    if (this.wantEatParent.children.length == 1) {
                        this.onCreatWantEat();
                        this.onCreatNpc(1)
                    }
                }
            }
            else {
                this.onCreatWantEat();
                this.onCreatNpc(0)
            }
        }, this)
        cc.director.on("关闭升级界面", () => {
            globalData.data.day++;
            globalData.saveData();
            cc.find("night/biao", this.node).active = true;
            AD.sound.playSfx("时钟");
            cc.tween(cc.find("night/biao/zhiZhen", this.node))
                .by(2, { angle: -360 })
                .start()
            cc.tween(cc.find("night/biao", this.node))
                .delay(2)
                .to(0.3, { opacity: 100, scale: 0 })
                .call(() => {
                    AD.sound.playSfx("天亮鸡叫");
                    cc.tween(cc.find("night", this.node))
                        .to(0.5, { opacity: 0 })
                        .call(() => {
                            cc.find("night", this.node).active = false;
                            cc.find("night/biao", this.node).active = false;
                            cc.find("night/biao", this.node).opacity = 255;
                            cc.find("night/biao", this.node).scale = 1;
                            this.onDownTime();
                        })
                        .start()
                })
                .start()
        }, this);
        /**新手指引 */
        if (globalData.data.day != -1) {
            this.onDownTime();
        }
    },
    onDestroy() {
        cc.director.off("恢复客人等待")
        cc.director.off("完成客人需求");
        cc.director.off("下班了");
        cc.director.off("升级速度");
        cc.director.off("合作结算");
    },
    update(dt) {
        cc.find("control/guiTaiTop/shouYinJi/coinText", this.node).getComponent(cc.Label).string = Math.round(globalData.data.coin);
    },
    onBtnCallBack(e, t) {
        AD.sound.playSfx("按钮");
        switch (t) {
            case "关闭店长界面":
                this.noMoney = false;
                cc.find("shopManagerView", this.node).active = false;
                cc.find("shopManagerView/bg/btn1", this.node).active = false;
                cc.find("shopManagerView/bg/btn2", this.node).active = false;
                cc.find("shopManagerView/bg/closeBtn", this.node).active = false;
                cc.director.emit("恢复客人等待")
                this.pauseJiGuan = false;
                break
            case "店长界面视频":
                AD.showAD(this.onVideoCoinCallBack, this)
                break
            case "出现升级界面":
                cc.find("shopManagerView", this.node).active = false;
                cc.find("shopManagerView/bg/btn3", this.node).active = false;
                cc.director.emit("恢复客人等待")
                this.pauseJiGuan = false;
                this.onKitchenUpView();
                break
            case "暂停":
                AD.showBanner();
                AD.chaPing();
                cc.find("pauseView", this.node).active = true;
                this.pauseFun = () => {
                    cc.director.pause()
                }
                this.scheduleOnce(this.pauseFun, 0.1)
                break
            case "重新开始":
                if (this.pauseFun)
                    this.unschedule(this.pauseFun)
                AD.hideBanner();
                cc.director.resume();
                this.onRestartGame();
                cc.director.loadScene("Game");
                break
            case "继续游戏":
                if (this.pauseFun)
                    this.unschedule(this.pauseFun)
                AD.hideBanner();
                cc.director.resume();
                cc.find("pauseView", this.node).active = false;
                break
            case "主菜单":
                if (this.pauseFun)
                    this.unschedule(this.pauseFun)
                cc.director.resume();
                cc.director.loadScene("Menu");
                break
            case "分享录屏":
                AD.luPingShare()
                break
            case "关闭录屏界面":
                this.shareView.active = false;
                break
        }
    },
    /**倒计时开始游戏 */
    onDownTime() {
        if (globalData.data.day == 0) {
            globalData.data.kitchenUp[0] = 1
        }
        else if (globalData.data.day == 2) {
            globalData.data.kitchenUp[0] = 2
        }
        else if (globalData.data.day == 5) {
            globalData.data.kitchenUp[0] = 3
        }
        else if (globalData.data.day == 8) {
            globalData.data.kitchenUp[0] = 4
        }
        else if (globalData.data.day == 11) {
            globalData.data.kitchenUp[0] = 5
        }
        else if (globalData.data.day == 14) {
            globalData.data.kitchenUp[0] = 6
        }
        globalData.saveData();
        this.onInitGame();
        cc.find("Block", this.node).active = true;
        AD.sound.playSfx("倒计时");
        this.schedule(() => {
            AD.sound.playSfx("倒计时");
        }, 0.8, 1)
        this.scheduleOnce(() => {
            AD.sound.playSfx("开始");
        }, 2.4)
        cc.find("downTimeStart", this.node).getComponent(sp.Skeleton).setAnimation(0, "daojishi", false);
        cc.find("downTimeStart", this.node).getComponent(sp.Skeleton).setCompleteListener(() => {
            this.onStartGame();
        })
        AD.hideBanner();
    },
    luPingOver() {
        AD.lupingOver();
    },
    /**游戏开始 */
    onStartGame() {
        AD.Game.keyBoardMove = true;
        AD.luPingBegin();
        this.scheduleOnce(this.luPingOver, 20);
        this.GameOver = false;
        this.pauseJiGuan = false;
        cc.find("night", this.node).active = false;
        this.creatGuest = 0;

        this.onInitGame();
        this.onServeGuest();
        cc.find("Block", this.node).active = false;
        this.onCreatWantEat();

        this.scheduleOnce(() => {
            this.onCreatWantEat();
        }, 1)
        for (var i = 0; i < 2; i++) {
            var npc = cc.instantiate(this.npcPre);
            npc.x = 80;
            npc.y = 360;
            npc.parent = this.keRen;
            npc.getComponent("npc").state = i;
            npc.getComponent("npc").onMoveSelf();
        }
        this.schedule(this.onZhangAi, 1);

    },
    /**服务的客人数量 */
    onServeGuest() {
        if (globalData.data.day < 2) {
            this.serveGuest = 3;
        }
        else if (globalData.data.day < 4) {
            this.serveGuest = 4;
        }
        else if (globalData.data.day < 8) {
            this.serveGuest = 5;
        }
        else {
            this.serveGuest = 6;
        }
        this.serveGuest_temp = this.serveGuest;
        console.log("今天得服务 " + this.serveGuest + " 个客人,好痛苦")
    },
    /**创建客人 */
    onCreatWantEat() {
        if (this.serveGuest_temp == 0) return

        var wantEatPos = [-400, -100, 150, 450];
        var wantEat = cc.instantiate(this.wantEatPre);
        wantEat.x = 955;
        wantEat.parent = this.wantEatParent;
        cc.tween(wantEat)
            .to(0.2, { x: wantEatPos[this.wantEatParent.children.length - 1] })
            .start()


    },
    /**创建客人Npc */
    onCreatNpc(state) {
        if (this.serveGuest_temp == 0) return

        var npc = cc.instantiate(this.npcPre);
        npc.x = 80;
        npc.y = 360;
        npc.parent = this.keRen;
        npc.getComponent("npc").state = state;
        npc.getComponent("npc").onMoveSelf();
    },

    /**移动wantEat */
    onMoveWantEatParentChildren() {
        if (this.serveGuest_temp == 0) return

        var wantEatPos = [-400, -100, 150, 450];

        this.scheduleOnce(() => {
            for (var i = 0; i < this.wantEatParent.children.length; i++) {
                cc.tween(this.wantEatParent.children[i])
                    .to(0.2, { x: wantEatPos[i] })
                    .start()

            }

        }, 0.1)
    },
    /**创建金币 */
    onCreatCoin() {
        for (var i = 0; i < Tools.random(6, 10); i++) {
            var coin = cc.instantiate(AD.coinPre);
            coin.parent = cc.find("coinEffect", this.node);
            coin.getComponent("coin").init(cc.v2(160, 218))
        }
    },

    /**初始化合作 */
    onInitGame() {
        switch (globalData.data.kitchenUp[0]) {
            case 1:
                cc.find("control/guiTaiBom/shuTiao", this.node).active = true;
                globalData.data.unlockFood = ["汉堡", "可乐", "薯条"];
                break
            case 2:
                cc.find("control/guiTaiBom/shuTiao", this.node).active = true;
                cc.find("control/guiTaiBom/jiChi", this.node).active = true;
                globalData.data.unlockFood = ["汉堡", "可乐", "薯条", "鸡翅"];
                break
            case 3:
                cc.find("control/guiTaiBom/shuTiao", this.node).active = true;
                cc.find("control/guiTaiBom/jiChi", this.node).active = true;
                cc.find("control/guiTaiBom/baoMiHua", this.node).active = true;

                globalData.data.unlockFood = ["汉堡", "可乐", "薯条", "鸡翅", "爆米花"];
                break
            case 4:
                cc.find("control/guiTaiBom/shuTiao", this.node).active = true;
                cc.find("control/guiTaiBom/jiChi", this.node).active = true;
                cc.find("control/guiTaiBom/baoMiHua", this.node).active = true;
                cc.find("control/guiTaiBom/jiTui", this.node).active = true;
                globalData.data.unlockFood = ["汉堡", "可乐", "薯条", "鸡翅", "爆米花", "鸡腿"];
                break
            case 5:
                cc.find("control/guiTaiBom/shuTiao", this.node).active = true;
                cc.find("control/guiTaiBom/jiChi", this.node).active = true;
                cc.find("control/guiTaiBom/baoMiHua", this.node).active = true;
                cc.find("control/guiTaiBom/jiTui", this.node).active = true;
                cc.find("control/guiTaiTop/bingQiLin", this.node).active = true;
                globalData.data.unlockFood = ["汉堡", "可乐", "薯条", "鸡翅", "爆米花", "鸡腿", "冰淇淋"];
                break
            case 6:
                cc.find("control/guiTaiBom/shuTiao", this.node).active = true;
                cc.find("control/guiTaiBom/jiChi", this.node).active = true;
                cc.find("control/guiTaiBom/baoMiHua", this.node).active = true;
                cc.find("control/guiTaiBom/jiTui", this.node).active = true;
                cc.find("control/guiTaiTop/bingQiLin", this.node).active = true;
                cc.find("control/guiTaiBom/piSa", this.node).active = true;
                globalData.data.unlockFood = ["汉堡", "可乐", "薯条", "鸡翅", "爆米花", "鸡腿", "冰淇淋", "披萨"];
                break
        }
        cc.director.emit("升级速度");
        this.makeFoodTime = 1.5 * (1 - 0.1 * globalData.data.kitchenUp[2]);
        this.cosePct = 1 - 0.1 * globalData.data.kitchenUp[3];
        switch (globalData.data.kitchenUp[4]) {
            case 1:
                cc.find("control/guiTaiTop/jiangBei", this.node).active = true;
                cc.find("bg", this.node).getComponent(cc.Sprite).spriteFrame = this.bgImg[0];
                break
            case 2:
                cc.find("control/guiTaiTop/jiangBei", this.node).active = true;
                cc.find("control/guiTaiTop/jiangBei", this.node).getComponent(cc.Sprite).spriteFrame = this.jiangBeiImg[0];
                cc.find("bg", this.node).getComponent(cc.Sprite).spriteFrame = this.bgImg[1];
                break
            case 3:
                cc.find("control/guiTaiTop/jiangBei", this.node).active = true;
                cc.find("control/guiTaiTop/jiangBei", this.node).getComponent(cc.Sprite).spriteFrame = this.jiangBeiImg[1];
                cc.find("bg", this.node).getComponent(cc.Sprite).spriteFrame = this.bgImg[1];
                cc.find("control/mask/guiTai", this.node).getComponent(cc.Sprite).spriteFrame = this.guiTaiImg;
                cc.find("control/mask1/guiTai", this.node).getComponent(cc.Sprite).spriteFrame = this.guiTaiImg;
                break

        }
        this.guestWaitTime = (1 + 0.15 * globalData.data.kitchenUp[5]);
        this.dizzyTime = 2 * (1 - 0.1 * globalData.data.kitchenUp[6]);
        this.blackOpacity = 200 * (1 - 0.1 * globalData.data.kitchenUp[7]);
    },
    onZhangAi() {
        if (this.pauseJiGuan) return

        if (this.jiGuanTime % 50 != 0) {
            this.jiGuanTime++;
            return
        }
        AD.sound.playSfx("机关Bgm");
        this.startAuthority = true;
        this.unschedule(this.onZhangAi, this)

        this.randomNum = Tools.random(0, 3);
        globalData.data.achieve[3].num++;
        switch (this.randomNum) {
            case 0:
                //水渍
                cc.find("shoManager", this.node).getComponent(cc.Sprite).spriteFrame = this.talkManager[0];
                this.onShopManagerTalk("离地上的水渍远点");
                var shuiZi = cc.find("control/shuiZi", this.node);
                shuiZi.active = true;
                var pos = cc.v2(Tools.random(-375, 375), Tools.random(15, -95));
                shuiZi.position = pos;
                this.scheduleOnce(this.onZhangAiCallBack, 20);
                break
            case 1:
                AD.sound.playSfx("地震1");
                cc.find("shoManager", this.node).getComponent(cc.Sprite).spriteFrame = this.talkManager[0];
                this.onShopManagerTalk("楼上又在搞装修，注意躲避");
                this.zhuangXiu = function () {
                    Tools.shakeScreen();
                    var suiPian = cc.instantiate(this.jianZhuSuiPianPre);
                    suiPian.parent = cc.find("control", this.node);
                    suiPian.getComponent("jiGuan").onInitTween()
                }
                this.schedule(this.zhuangXiu, 2, 8);
                this.scheduleOnce(this.onZhangAiCallBack, 20);
                break
            case 2:
                AD.sound.playSfx("断电");
                cc.find("shoManager", this.node).getComponent(cc.Sprite).spriteFrame = this.talkManager[1];
                this.onShopManagerTalk("要断电吗？不应该啊，我交电费了啊");
                cc.find("black", this.node).active = true;
                cc.find("black", this.node).opacity = 0
                cc.tween(cc.find("black", this.node))
                    .to(0.3, { opacity: 255 })
                    .to(0.3, { opacity: 0 })
                    .to(0.3, { opacity: 255 })
                    .to(0.3, { opacity: 0 })
                    .to(0.3, { opacity: this.blackOpacity })
                    .start()
                this.scheduleOnce(this.onZhangAiCallBack, 20)

                break
            case 3:
                this.needSpeedup = true;
                this.scheduleOnce(this.onZhangAiCallBack, 20)
                break
        }
    },
    onZhangAiCallBack() {
        if (!this.startAuthority) return
        this.startAuthority = false;
        switch (this.randomNum) {
            case 0:
                cc.find("control/shuiZi", this.node).active = false;
                break
            case 1:
                this.unschedule(this.zhuangXiu, this);
                AD.sound.playSfx("停止地震1");
                break
            case 2:
                cc.tween(cc.find("black", this.node))
                    .to(0.3, { opacity: 0 })
                    .to(0.3, { opacity: 255 })
                    .to(0.3, { opacity: 0 })
                    .to(0.3, { opacity: 255 })
                    .to(0.3, { opacity: 0 })
                    .call(() => {
                        cc.find("black", this.node).active = false;
                    })
                    .start()
                break
            case 3:
                this.needSpeedup = false;
                break
        }
        this.jiGuanTime++;
        this.schedule(this.onZhangAi, 1);
        AD.sound.playSfx("BGM");
    },
    /**店长说话 */
    onShopManagerTalk(str) {
        cc.find("shoManager/text", this.node).getComponent(cc.Label).string = str;
        cc.tween(cc.find("shoManager", this.node))
            .to(0.2, { x: AD.width / 2 - cc.find("shoManager", this.node).width / 2 })
            .call(() => {
                cc.find("shoManager/box", this.node).active = true;
                cc.find("shoManager/text", this.node).active = true;
            })
            .delay(5)
            .to(0.2, { x: 1030 })
            .call(() => {
                cc.find("shoManager/box", this.node).active = false;
                cc.find("shoManager/text", this.node).active = false;
            })
            .start()
    },
    /**店长界面 */
    onShopManagerView(bool) {

        cc.find("shopManagerView/manager", this.node).x = -960;
        cc.find("shopManagerView/manager", this.node).angle = 0;
        cc.find("shopManagerView/bg", this.node).active = false;
        this.scheduleOnce(() => {
            this.pauseJiGuan = true;
            cc.director.emit("暂停客人等待");
            cc.find("shopManagerView", this.node).active = true;
            cc.tween(cc.find("shopManagerView/manager", this.node))
                .to(0.2, { x: -cc.winSize.width / 2 + 210 })
                .to(0.2, { angle: 10 })
                .to(0.2, { angle: 0 }, { easing: "backOut" })
                .call(() => {
                    cc.find("shopManagerView/bg", this.node).x = cc.find("shopManagerView/manager", this.node).x + 350;
                    cc.find("shopManagerView/bg", this.node).active = true;
                })
                .start()
        }, 1)
        if (bool == "扣钱") {
            cc.find("shopManagerView/manager", this.node).getComponent(cc.Sprite).spriteFrame = this.viewManager[0];
            cc.find("shopManagerView/bg/text", this.node).getComponent(cc.Label).string = "客人被你气走好几个了，不扣工资看来不长记性";
            cc.find("shopManagerView/bg/coin", this.node).active = true;
            cc.find("shopManagerView/bg/coin/text", this.node).getComponent(cc.Label).string = "-50";
            globalData.addCoin(-50);
            cc.find("shopManagerView/bg/btn1", this.node).active = true;
        }
        else if (bool == "奖励") {
            cc.find("shopManagerView/manager", this.node).getComponent(cc.Sprite).spriteFrame = this.viewManager[1];
            cc.find("shopManagerView/bg/text", this.node).getComponent(cc.Label).string = "干得不错，这是你的奖金继续努力";
            cc.find("shopManagerView/bg/coin", this.node).active = true;
            cc.find("shopManagerView/bg/coin/text", this.node).getComponent(cc.Label).string = "+30";
            globalData.addCoin(30);
            cc.find("shopManagerView/bg/btn1", this.node).active = true;
        }
        else if (bool == "视频") {
            cc.find("shopManagerView/manager", this.node).getComponent(cc.Sprite).spriteFrame = this.viewManager[0];
            cc.find("shopManagerView/bg/text", this.node).getComponent(cc.Label).string = "你们还能不能好好干活了，这个店都快被你们败光了";
            cc.find("shopManagerView/bg/coin", this.node).active = true;
            cc.find("shopManagerView/bg/coin/text", this.node).getComponent(cc.Label).string = "+200";
            cc.find("shopManagerView/bg/btn2", this.node).active = true;
            cc.find("shopManagerView/bg/closeBtn", this.node).active = true;
        }
        else if (bool == "提示") {
            AD.GameOver();
            cc.find("shopManagerView/manager", this.node).getComponent(cc.Sprite).spriteFrame = this.viewManager[1];
            if (globalData.data.day == -1) {
                cc.find("shopManagerView/bg/text", this.node).getComponent(cc.Label).string = "干的漂亮，现在可以升级我们的餐厅了";
            }
            else {
                var text = ["干的还不错，休息吧", "愉快的一天结束了，明天再来吧"]
                cc.find("shopManagerView/bg/text", this.node).getComponent(cc.Label).string = text[Tools.random(0, 1)];
            }
            cc.find("shopManagerView/bg/coin", this.node).active = false;
            cc.find("shopManagerView/bg/btn3", this.node).active = true;
        }
    },
    /**进入晚上 */
    onNight() {
        AD.Game.keyBoardMove = false;
        AD.lupingOver();
        if (AD.chanelNameTarget == "TT") {
            this.shareView = cc.find("shareView", this.node);
            cc.find("shareView", this.node).active = true;
            if (AD.wuDianRate == 0) {
                cc.find("shareView/bg/share2Btn", this.node).active = false;
            }
        }
        cc.director.emit("合作结算");
        if (AD.chanelNameTarget == "VIVO") {
            if (AD.wuDianRate == 0)
                AD.hideBanner();
        }
        this.GameOver = true;
        this.keRen.removeAllChildren();
        this.wantEatParent.removeAllChildren();
        cc.director.emit("下班了");
        AD.sound.playSfx("欢呼");
        cc.find("effectView", this.node).children[0].getComponent(sp.Skeleton).setAnimation(0, "caidai", false);
        cc.find("effectView", this.node).children[1].getComponent(sp.Skeleton).setAnimation(0, "caidai", false);
        cc.find("effectView", this.node).children[0].getComponent(sp.Skeleton).setCompleteListener(() => {
            cc.find("night", this.node).active = true;
            cc.tween(cc.find("night", this.node))
                .to(0.5, { opacity: 240 })
                .call(() => {
                    this.onShopManagerView("提示");
                })
                .start()
        })
        if (this.startAuthority) {
            this.onZhangAiCallBack();
        }
        this.unschedule(this.onZhangAi, this)
    },
    /**厨房升级界面 */
    onKitchenUpView() {
        Tools.resetDialog(cc.find("kitchenUpView", this.node), true);

        if (AD.chanelNameTarget == "VIVO") {
            if (AD.wuDianRate == 0)
                AD.hideBanner();
        }
        this.scheduleOnce(() => {
            this.pauseJiGuan = true;
            cc.director.emit("暂停客人等待");
        }, 1)
    },
    /**重新开始游戏 */
    onRestartGame() {
        globalData.data.unlockFood = ["汉堡", "可乐"];
        globalData.data.coin = 100;
        globalData.data.kitchenUp = [0, 0, 0, 0, 0, 0, 0, 0];
        if (globalData.data.day != -1) {
            globalData.data.day = 0;
        }
        globalData.saveData();
        AD.sound.playSfx("BGM");
    },
    /**花钱提醒 */
    onCoinEffect(_coin) {
        var coinEffect = cc.instantiate(AD.coinEffectPre);
        coinEffect.parent = cc.find("coinEffect", this.node);
        coinEffect.getChildByName("text").getComponent(cc.Label).string = "+" + parseInt(_coin);
        cc.tween(coinEffect)
            .by(1, { y: 50 })
            .by(1, { y: 50, opacity: -255 })
            .call(() => {
                coinEffect.destroy();
            })
            .start()
    },
    onTip(str) {
        cc.find("Tips", this.node).active = true;
        cc.find("Tips", this.node).y = 0;
        cc.find("Tips", this.node).opacity = 255;
        cc.find("Tips/text", this.node).getComponent(cc.Label).string = ""
        cc.find("Tips/text", this.node).getComponent(cc.Label).string = str;
        var arr = str.split('');
        var len = arr.length;
        cc.find("Tips", this.node).width = 30 * len;
        if (this.tipTween) {
            this.tipTween.stop()
        }
        this.tipTween = cc.tween(cc.find("Tips", this.node))
            .delay(2)
            .to(1, { y: 100, opacity: 200 })
            .call(() => {
                cc.find("Tips", this.node).active = false;
            })
            .start()
    },
    onLaJiTongTip(bool) {
        // if (bool) {
        //     if (cc.find("laJiTongTips", this.node).active) return
        //     cc.find("laJiTongTips", this.node).active = true;
        //     cc.find("laJiTongTips", this.node).scale = 0;
        //     cc.tween(cc.find("laJiTongTips", this.node))
        //         .to(0.2, { scale: 1 })
        //         .delay(3)
        //         .call(() => {
        //             cc.find("laJiTongTips", this.node).active = false;
        //         })
        //         .start()
        // }
        // else {
        //     if (!cc.find("laJiTongTips", this.node).active) return
        //     cc.tween(cc.find("laJiTongTips", this.node))
        //         .to(0.2, { scale: 0 })
        //         .call(() => {
        //             cc.find("laJiTongTips", this.node).active = false;
        //         })
        //         .start()
        // }
    },
    onVideoCoinCallBack() {
        this.noMoney = false;
        globalData.addCoin(200);
        cc.find("shopManagerView", this.node).active = false;
        cc.find("shopManagerView/bg/btn1", this.node).active = false;
        cc.find("shopManagerView/bg/btn2", this.node).active = false;
        cc.director.emit("恢复客人等待");
        this.pauseJiGuan = false;
    },
});
