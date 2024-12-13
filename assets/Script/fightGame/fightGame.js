cc.Class({
    extends: cc.Component,

    properties: {
        yinLiaoImg: [cc.SpriteFrame],
        bgImg: [cc.SpriteFrame],
        guiTaiImg: [cc.SpriteFrame],
        wantEatPre: cc.Prefab,
        jianZhuSuiPianPre: cc.Prefab,
        jieSuanSpine: [sp.SkeletonData]
    },

    onLoad() {
        AD.Game = this;
        this.wantEatParent = [cc.find("Player1Panel/wantEatParent", this.node), cc.find("Player2Panel/wantEatParent", this.node)];
        this.minigame = cc.find("minigame", this.node).children;
        this.Player1 = cc.find("Player1Panel/control/Player1", this.node);
        this.Player2 = cc.find("Player2Panel/control/Player2", this.node);
        /**成本百分比 */
        this.cosePct = [1, 1];
        /**眩晕时间 */
        this.dizzyTime = [2, 2];
        /**餐盘食物坐标 */
        this.canPanPos = [cc.v2(0, 0), cc.v2(0, 0), cc.v2(-0, -0), cc.v2(0, -0),];
        /**上菜数量 */
        this.servingNum = [0, 0];
        /**客人等待时间 */
        this.guestWaitTime = [1, 1];
        /**黑夜的可见 */
        this.blackOpacity = [200, 200];
        /**比分 */
        this.score = [0, 0];

        this.GameOver = false;
        this.pauseGame = false;
        /**键盘移动 */
        this.keyBoardMove = false;
    },

    start() {
        AD.firstFightGame++;
        this.onInitGame();
        this.Player1.getChildByName("img").getComponent(sp.Skeleton).setSkin("js" + (globalData.data.putSkin1 + 1));
        this.Player2.getChildByName("img").getComponent(sp.Skeleton).setSkin("js" + (globalData.data.putSkin2 + 1));
        this.Player1.getChildByName("img2").getComponent(sp.Skeleton).setSkin("js" + (globalData.data.putSkin1 + 1));
        this.Player2.getChildByName("img2").getComponent(sp.Skeleton).setSkin("js" + (globalData.data.putSkin2 + 1));
        cc.find("Block", this.node).active = true;


        cc.director.on("关闭升级界面", () => {
            AD.hideBanner();
            this.onInitGame();
            AD.sound.playSfx("倒计时");
            this.schedule(() => {
                AD.sound.playSfx("倒计时");
            }, 0.8, 1)
            this.scheduleOnce(() => {
                AD.sound.playSfx("开始");
            }, 2.4)
            cc.find("downTimeStart", this.node).getComponent(sp.Skeleton).setAnimation(0, "daojishi", false);
            cc.find("downTimeStart", this.node).getComponent(sp.Skeleton).setCompleteListener(() => {
                this.onInitGame();
                cc.find("Block", this.node).active = false;
                this.onStartGame();
                this.schedule(() => {
                    this.onZhangAi(0)
                }, 40);
                this.schedule(() => { this.onZhangAi(1) }, 40);
            })
        }, this)
        if (AD.firstFightGame == 1) {
            cc.director.emit("关闭升级界面")
        }
        else {
            Tools.resetDialog(cc.find("kitchenUpView", this.node), true);
        }
    },

    update(dt) {
        cc.find("Player1Panel/control/guiTai/shouYinJi/coin", this.node).getComponent(cc.Label).string = Math.round(globalData.data.fightCoin[0]);
        cc.find("Player2Panel/control/guiTai/shouYinJi/coin", this.node).getComponent(cc.Label).string = Math.round(globalData.data.fightCoin[1]);
        cc.find("Player1Panel/score/text", this.node).getComponent(cc.Label).string = this.score[0];
        cc.find("Player2Panel/score/text", this.node).getComponent(cc.Label).string = this.score[1];
    },
    onDestroy() {
        cc.director.off("暂停客人等待");
        cc.director.off("恢复客人等待");
        cc.director.off("完成客人需求");
        cc.director.off("关闭升级界面");
        cc.director.off("玩家看完广告");
        cc.director.off("升级速度");
    },
    onBtnCallBack(e, t) {
        AD.sound.playSfx("按钮");
        switch (t) {
            case "关闭店长界面":
                cc.find("shoManagerView", this.node).active = false;
                cc.find("shoManagerView/btn1", this.node).active = false;
                cc.find("shoManagerView/btn2", this.node).active = false;
                cc.director.emit("恢复客人等待")
                break
            case "店长界面视频":
                AD.showAD(this.onVideoCoinCallBack, this)
                break
            case "暂停":
                AD.chaPing()
                cc.find("pauseView", this.node).active = true;
                this.pauseFun = () => {
                    cc.director.pause()
                }
                this.scheduleOnce(this.pauseFun, 0.1)
                break
            case "继续游戏":
                if (this.pauseFun)
                    this.unschedule(this.pauseFun)
                cc.director.resume();
                cc.find("pauseView", this.node).active = false;
                break
            case "主菜单":
                if (this.pauseFun)
                    this.unschedule(this.pauseFun)
                cc.director.resume();
                cc.director.loadScene("Menu");
                break
            case "重新开始":
                if (this.pauseFun)
                    this.unschedule(this.pauseFun)
                cc.director.resume();
                this.onRestartGame()
                cc.director.loadScene("fightGame");
                break
            case "结算继续游戏":
                // e.target.active = false;
                // e.target.parent.getChildByName("menuBtn").active = false;
                // e.target.parent.getChildByName("readyBtn").active = true;
                cc.director.loadScene("fightGame");
                // if (cc.find("jieSuanView/bg/Player1/readyBtn", this.node).active && cc.find("jieSuanView/bg/Player2/readyBtn", this.node).active) {
                // }
                break
        }
    },
    onStartGame() {
        /**键盘移动 */
        this.keyBoardMove = true;
        this.onCreatWantEat(0);
        this.onCreatWantEat(1);
        this.scheduleOnce(() => {
            this.onCreatWantEat(0);
            this.onCreatWantEat(1);
        }, 1)
        cc.director.on("完成客人需求", (type) => {
            // cc.find("control/guiTaiTop/canPan", this.node).removeAllChildren();
            this.servingNum[type] = 0;
            this.onCreatWantEat(type);
        }, this)
        var time = 120;
        var fun = () => {
            if (this.pauseGame) return
            time--;
            cc.find("zhongBiao/text", this.node).getComponent(cc.Label).string = time;
            if (time == 20) {
                Tools.setNodeColor(cc.find("zhongBiao/text", this.node), 255, 0, 0)
                AD.sound.playSfx("对决倒计时");
            }
            else if (time < 20) {
                AD.sound.playSfx("对决倒计时");
            }
            if (time <= 0) {
                this.onJieSuanView();
                this.unschedule(fun, this)
            }
        }
        this.schedule(fun, 1);
    },
    /**初始化对抗 */
    onInitGame() {
        cc.director.emit("升级速度");
        this.cosePct[0] = 1 - 0.1 * globalData.data.kitchenUp_fight[0][1];
        this.cosePct[1] = 1 - 0.1 * globalData.data.kitchenUp_fight[1][1];
        switch (globalData.data.kitchenUp_fight[0][2]) {
            case 1:
                cc.find("Player1Panel/bg", this.node).getComponent(cc.Sprite).spriteFrame = this.bgImg[1];
                break
            case 2:
                cc.find("Player1Panel/bg", this.node).getComponent(cc.Sprite).spriteFrame = this.bgImg[2];
                break
            case 3:
                cc.find("Player1Panel/bg", this.node).getComponent(cc.Sprite).spriteFrame = this.bgImg[2];
                cc.find("Player1Panel/control/guiTai", this.node).getComponent(cc.Sprite).spriteFrame = this.guiTaiImg[0];
                break
        }
        switch (globalData.data.kitchenUp_fight[1][2]) {
            case 1:
                cc.find("Player2Panel/bg", this.node).getComponent(cc.Sprite).spriteFrame = this.bgImg[4];
                break
            case 2:
                cc.find("Player2Panel/bg", this.node).getComponent(cc.Sprite).spriteFrame = this.bgImg[5];
                break
            case 3:
                cc.find("Player2Panel/bg", this.node).getComponent(cc.Sprite).spriteFrame = this.bgImg[5];
                cc.find("Player2Panel/control/guiTai", this.node).getComponent(cc.Sprite).spriteFrame = this.guiTaiImg[1];
                break
        }
        this.guestWaitTime[0] = (1 + 0.15 * globalData.data.kitchenUp_fight[0][3]);
        this.guestWaitTime[1] = (1 + 0.15 * globalData.data.kitchenUp_fight[1][3]);
        this.dizzyTime[0] = 2 * (1 - 0.1 * globalData.data.kitchenUp_fight[0][4]);
        this.dizzyTime[1] = 2 * (1 - 0.1 * globalData.data.kitchenUp_fight[1][4]);
        this.blackOpacity[0] = 220 * (1 - 0.1 * globalData.data.kitchenUp_fight[0][5]);
        this.blackOpacity[1] = 220 * (1 - 0.1 * globalData.data.kitchenUp_fight[1][5]);
    },
    /**创建客人 */
    onCreatWantEat(num) {
        var wantEatPos = [-140, 30, -150, 150];
        var wantEat = cc.instantiate(this.wantEatPre);
        wantEat.x = 455;
        wantEat.type = num
        wantEat.parent = this.wantEatParent[num];
        console.log(this.wantEatParent[num].children.length - 1)
        cc.tween(wantEat)
            .to(0.2, { x: wantEatPos[this.wantEatParent[num].children.length - 1] })
            .start()
    },
    /**移动wantEat */
    onMoveWantEatParentChildren(num) {
        var wantEatPos = [-140, 30, -150, 150];
        this.scheduleOnce(() => {
            for (var i = 0; i < this.wantEatParent[num].children.length; i++) {
                cc.tween(this.wantEatParent[num].children[i])
                    .to(0.2, { x: wantEatPos[i] })
                    .start()
            }
        }, 0.1)

    },
    onZhangAi(index) {

        if (this.GameOver) return
        var randomNum = Tools.random(0, 1);
        globalData.data.achieve[3].num++;
        AD.sound.playSfx("机关Bgm");
        switch (randomNum) {
            case 0:
                AD.sound.playSfx("地震" + (index + 1));
                // cc.find("shoManager", this.node).getComponent(cc.Sprite).spriteFrame = this.talkManager[0];
                // this.onShopManagerTalk("楼上又在搞装修，注意躲避");
                var fun = function () {
                    if (this.GameOver) return
                    Tools.shakeScreen();
                    var suiPian = cc.instantiate(this.jianZhuSuiPianPre);
                    suiPian.parent = cc.find("Player" + (index + 1) + "Panel/control", this.node);
                    suiPian.type = index;
                    suiPian.getComponent("jianZhu_fight").onInitTween();
                }
                this.schedule(fun, 2, 6);
                this.scheduleOnce(() => {
                    AD.sound.playSfx("停止地震" + (index + 1));

                    AD.sound.playSfx("BGM");
                }, 15)
                break
            case 1:
                AD.sound.playSfx("断电");
                // cc.find("shoManager", this.node).getComponent(cc.Sprite).spriteFrame = this.talkManager[1];
                // this.onShopManagerTalk("要断电吗？不应该啊，我交电费了啊");
                cc.find("Player" + (index + 1) + "Panel/black", this.node).active = true;
                cc.find("Player" + (index + 1) + "Panel/black", this.node).opacity = 0
                cc.tween(cc.find("Player" + (index + 1) + "Panel/black", this.node))
                    .to(0.3, { opacity: 255 })
                    .to(0.3, { opacity: 0 })
                    .to(0.3, { opacity: 255 })
                    .to(0.3, { opacity: 0 })
                    .to(0.3, { opacity: this.blackOpacity[index] })
                    .start()
                this.scheduleOnce(() => {
                    cc.tween(cc.find("Player" + (index + 1) + "Panel/black", this.node))
                        .to(0.3, { opacity: 0 })
                        .to(0.3, { opacity: 255 })
                        .to(0.3, { opacity: 0 })
                        .to(0.3, { opacity: 255 })
                        .to(0.3, { opacity: 0 })
                        .call(() => {
                            cc.find("Player" + (index + 1) + "Panel/black", this.node).active = false;
                        })
                        .start()

                    AD.sound.playSfx("BGM");
                }, 15)
                break
        }
    },
    /**创建金币 */
    onCreatCoin(index) {
        var posArray = [cc.v2(-600, 198), cc.v2(516, 198)];
        var firstPos = [-450, 150]
        for (var i = 0; i < Tools.random(6, 10); i++) {
            var coin = cc.instantiate(AD.coinPre);
            coin.parent = cc.find("coinEffect", this.node);
            coin.x = firstPos[index]
            coin.getComponent("coin").init(posArray[index])
        }
    },
    onJieSuanView() {
        this.scheduleOnce(() => {
            AD.GameOver();
        }, 0.3)
        AD.sound.playSfx("对决结算");
        cc.director.off("暂停客人等待");
        this.GameOver = true;
        this.pauseGame = true;
        if (cc.audioEngine.getMusicVolume() == 1) {
            AD.sound.playSfx("BGM");
            AD.sound.playSfx("停止地震1");
            AD.sound.playSfx("停止地震2");
        }
        globalData.data.playFightNum++;
        var jieSuanView = cc.find("jieSuanView", this.node);
        AD.chaPing();
        Tools.resetDialog(jieSuanView, true);
        this.GameOver = true;
        cc.find("Player1Panel/black", this.node).active = false;
        cc.find("Player2Panel/black", this.node).active = false;
        if (this.score[0] > this.score[1]) {
            cc.find("effectView", this.node).children[0].getComponent(sp.Skeleton).setAnimation(0, "caidai", false);
            cc.find("bg/Player1/Spine", jieSuanView).getComponent(sp.Skeleton).skeletonData = this.jieSuanSpine[0];
            cc.find("bg/Player2/Spine", jieSuanView).getComponent(sp.Skeleton).skeletonData = this.jieSuanSpine[1];
            cc.find("bg/Player1/Spine", jieSuanView).getComponent(sp.Skeleton).setAnimation(0, "chuxian", false);
            cc.find("bg/Player2/Spine", jieSuanView).getComponent(sp.Skeleton).setAnimation(0, "kaishi", false);
            cc.find("bg/Player2/coin", jieSuanView).active = false;
            globalData.addFightCoin(40, 0)
        }
        else if (this.score[0] < this.score[1]) {
            cc.find("effectView", this.node).children[1].getComponent(sp.Skeleton).setAnimation(0, "caidai", false);
            cc.find("bg/Player1/Spine", jieSuanView).getComponent(sp.Skeleton).skeletonData = this.jieSuanSpine[1];
            cc.find("bg/Player2/Spine", jieSuanView).getComponent(sp.Skeleton).skeletonData = this.jieSuanSpine[0];
            cc.find("bg/Player1/Spine", jieSuanView).getComponent(sp.Skeleton).setAnimation(0, "kaishi", false);
            cc.find("bg/Player2/Spine", jieSuanView).getComponent(sp.Skeleton).setAnimation(0, "chuxian", false);
            cc.find("bg/Player1/coin", jieSuanView).active = false;
            globalData.addFightCoin(40, 1)
        }
        else {
            cc.find("effectView", this.node).children[0].getComponent(sp.Skeleton).setAnimation(0, "caidai", false);
            cc.find("effectView", this.node).children[1].getComponent(sp.Skeleton).setAnimation(0, "caidai", false);
            cc.find("bg/Player1/Spine", jieSuanView).getComponent(sp.Skeleton).skeletonData = this.jieSuanSpine[0];
            cc.find("bg/Player2/Spine", jieSuanView).getComponent(sp.Skeleton).skeletonData = this.jieSuanSpine[0];
            cc.find("bg/Player1/Spine", jieSuanView).getComponent(sp.Skeleton).setAnimation(0, "chuxian", false);
            cc.find("bg/Player2/Spine", jieSuanView).getComponent(sp.Skeleton).setAnimation(0, "chuxian", false);
            cc.find("bg/Player1/coin", jieSuanView).active = false;
            cc.find("bg/Player2/coin", jieSuanView).active = false;
        }
        cc.find("bg/Player1/Spine", jieSuanView).getComponent(sp.Skeleton).setCompleteListener(() => {
            switch (cc.find("bg/Player1/Spine", jieSuanView).getComponent(sp.Skeleton).animation) {
                case "chuxian":
                    cc.find("bg/Player1/Spine", jieSuanView).getComponent(sp.Skeleton).setAnimation(0, "daiji", false);
                    break
                case "kaishi":
                    cc.find("bg/Player1/Spine", jieSuanView).getComponent(sp.Skeleton).setAnimation(0, "daiji", false);
                    break
            }
        })
        cc.find("bg/Player2/Spine", jieSuanView).getComponent(sp.Skeleton).setCompleteListener(() => {
            switch (cc.find("bg/Player2/Spine", jieSuanView).getComponent(sp.Skeleton).animation) {
                case "chuxian":
                    cc.find("bg/Player2/Spine", jieSuanView).getComponent(sp.Skeleton).setAnimation(0, "daiji", false);
                    break
                case "kaishi":
                    cc.find("bg/Player2/Spine", jieSuanView).getComponent(sp.Skeleton).setAnimation(0, "daiji", false);
                    break
            }
        })
    },
    /**重新开始游戏 */
    onRestartGame() {
        globalData.data.fightCoin = [0, 0];
        globalData.data.kitchenUp_fight = [[0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0]];
        globalData.data.playFightNum = 1;
        globalData.saveData();
        AD.sound.playSfx("BGM");
        AD.firstFightGame = 0;
    },
    /**花钱提醒 */
    onCoinEffect(_coin, index) {
        var _x = [-580, 515]
        var coinEffect = cc.instantiate(AD.coinEffectPre);
        coinEffect.parent = cc.find("coinEffect", this.node);
        coinEffect.getChildByName("text").getComponent(cc.Label).string = "+" + parseInt(_coin);
        coinEffect.setPosition(_x[index], 195)
        cc.tween(coinEffect)
            .by(1, { y: 50 })
            .by(1, { y: 50, opacity: -255 })
            .call(() => {
                coinEffect.destroy();
            })
            .start()
    },
    /**看广告给钱 */
    onShopManagerView() {
        // cc.find("shoManagerView", this.node).active = true;
        // this.pauseGame = true;
        // cc.director.emit("暂停客人等待");
        // cc.find("shoManagerView/text", this.node).getComponent(cc.Label).string = "你们还能不能好好干活了，这个店都快被你们败光了";
        // cc.find("shoManagerView/coin/text", this.node).getComponent(cc.Label).string = "+200";
        // cc.find("shoManagerView/btn2", this.node).active = true;

    },
    onVideoCoinCallBack() {
        globalData.addFightCoin(200, 0);
        globalData.addFightCoin(200, 1);
        cc.find("shoManagerView", this.node).active = false;
        cc.director.emit("恢复客人等待");
        this.pauseGame = false;
        cc.director.emit("玩家看完广告");

    }
});
