
cc.Class({
    extends: cc.Component,

    properties: {
        coinBtnImg: cc.SpriteFrame,
        shuXingImg: [cc.SpriteFrame],
        levelImg1: [cc.SpriteFrame],
        levelImg2: [cc.SpriteFrame],
        levelImg3: [cc.SpriteFrame],
        levelImg4: [cc.SpriteFrame],
        shiWuImg: [cc.SpriteFrame],

    },

    onLoad() {
        //                  食物                           移速             动作              成本              装饰           时间               眩晕             光明
        this.cost = [[100, 200, 200, 200, 250, 300], [100, 400, 1200], [100, 400, 1200], [150, 350, 450,], [100, 400, 1200], [100, 400, 1200], [100, 400, 1200], [150, 450, 1250]];
        this.levelImg = [this.levelImg1, this.levelImg2, this.levelImg3, this.levelImg4,];
        this.maxLevel = [6, 3, 3, 3, 3, 3, 3, 3];

    },
    onEnable() {
        cc.find("bg/day", this.node).getComponent(cc.Label).string = "第" + (globalData.data.day + 1) + "天"
        if (globalData.data.day == -1) {
            cc.find("bg/day", this.node).active = false;
            cc.find("bg/nextFood", this.node).active = false;
            this.firstUp = 0
            AD.Game.onTip("点击升级属性");
            cc.director.emit("新手指引厨房升级")
            cc.find("bg/parent", this.node).active = false;
            cc.find("bg/zhiYin", this.node).active = true;
            return
        }

        this.unlockFood();
        cc.find("bg/day", this.node).active = true;
        cc.find("bg/parent", this.node).active = true;
        cc.find("bg/zhiYin", this.node).active = false;
        this.onAllLevelMax();
        var arr = [1, 2, 4, 5, 6, 7];
        this.nowUp = new Array();
        for (var i = 0; i < 3; i++) {
            let r = Tools.random(0, arr.length - 1);
            this.nowUp[i] = arr[r];
            arr.splice(r, 1);
        }
        for (var i = 0; i < 3; i++) {
            cc.find("bg/parent", this.node).children[i].getComponent(cc.Sprite).spriteFrame = this.shuXingImg[this.nowUp[i]]
            if (this.nowUp[i] < 4) {
                cc.find("bg/parent", this.node).children[i].getChildByName("level").getComponent(cc.Sprite).spriteFrame
                    = this.levelImg[this.nowUp[i]][globalData.data.kitchenUp[this.nowUp[i]]];
            }
            else {
                cc.find("bg/parent", this.node).children[i].getChildByName("level").getComponent(cc.Sprite).spriteFrame
                    = this.levelImg[this.nowUp[i] - 4][globalData.data.kitchenUp[this.nowUp[i]]];
            }
            if (globalData.data.kitchenUp[this.nowUp[i]] < this.maxLevel[this.nowUp[i]]) {
                if (globalData.data.coin < this.cost[this.nowUp[i]][globalData.data.kitchenUp[this.nowUp[i]]]) {
                    cc.find("bg/parent", this.node).children[i].getChildByName("coinBtn").active = false;
                    cc.find("bg/parent", this.node).children[i].getChildByName("videoBtn").active = true;
                }
                else {
                    cc.find("bg/parent", this.node).children[i].getChildByName("coinBtn").active = true;
                    cc.find("bg/parent", this.node).children[i].getChildByName("videoBtn").active = false;
                    cc.find("bg/parent", this.node).children[i].getChildByName("coinBtn").getChildByName("text").getComponent(cc.Label).string
                        = this.cost[this.nowUp[i]][globalData.data.kitchenUp[this.nowUp[i]]];
                }
            }
            else {
                cc.find("bg/parent", this.node).children[i].getChildByName("videoBtn").active = false;
                cc.find("bg/parent", this.node).children[i].getChildByName("coinBtn").getChildByName("text").active = false;
                cc.find("bg/parent", this.node).children[i].getChildByName("coinBtn").getComponent(cc.Sprite).spriteFrame = this.coinBtnImg;
                cc.find("bg/parent", this.node).children[i].getChildByName("coinBtn").getComponent(cc.Button).interactable = false;
            }
        }

    },
    start() {

    },

    update(dt) {
        cc.find("bg/coinBox/text", this.node).getComponent(cc.Label).string = Math.round(globalData.data.coin);
    },
    onBtnCallBack(e, t) {
        AD.sound.playSfx("按钮");
        switch (t) {
            case "升级":
                this.index = e.target.parent.getSiblingIndex();
                var index = this.index
                if (globalData.data.coin < this.cost[this.nowUp[index]][globalData.data.kitchenUp[this.nowUp[index]]]) {
                    AD.showAD(this.onCallBack, this)
                    return
                }
                else {
                    globalData.addCoin(-this.cost[this.nowUp[index]][globalData.data.kitchenUp[this.nowUp[index]]]);
                    this.onCallBack()
                }

                break
            case "关闭":
                Tools.resetDialog(this.node);
                cc.director.emit("恢复客人等待");
                AD.Game.pauseJiGuan = false;
                cc.director.emit("关闭升级界面");
                break
            case "指引升级":
                if (globalData.data.coin < this.cost[6][globalData.data.kitchenUp[6]]) {
                    AD.showAD(this.onZhiYinCallBack, this)
                    return
                }
                else {
                    globalData.addCoin(-this.cost[6][globalData.data.kitchenUp[6]]);
                    this.onZhiYinCallBack()
                }


                break
        }
    },
    onCallBack() {
        var index = this.index
        AD.sound.playSfx("升级");
        cc.find("bg/parent", this.node).children[index].getChildByName("effect").getComponent(sp.Skeleton).setAnimation(0, "animation", false);
        globalData.data.kitchenUp[this.nowUp[index]]++;
        globalData.saveData();
        if (this.nowUp[index] < 4) {
            cc.find("bg/parent", this.node).children[index].getChildByName("level").getComponent(cc.Sprite).spriteFrame
                = this.levelImg[this.nowUp[index]][globalData.data.kitchenUp[this.nowUp[index]]];
        }
        else {
            cc.find("bg/parent", this.node).children[index].getChildByName("level").getComponent(cc.Sprite).spriteFrame
                = this.levelImg[this.nowUp[index] - 4][globalData.data.kitchenUp[this.nowUp[index]]];
        }
        for (var i = 0; i < 3; i++) {
            if (globalData.data.kitchenUp[this.nowUp[i]] < this.maxLevel[this.nowUp[i]]) {
                if (globalData.data.coin < this.cost[this.nowUp[i]][globalData.data.kitchenUp[this.nowUp[i]]]) {
                    cc.find("bg/parent", this.node).children[i].getChildByName("coinBtn").active = false;
                    cc.find("bg/parent", this.node).children[i].getChildByName("videoBtn").active = true;
                }
                else {
                    cc.find("bg/parent", this.node).children[i].getChildByName("coinBtn").active = true;
                    cc.find("bg/parent", this.node).children[i].getChildByName("videoBtn").active = false;
                    cc.find("bg/parent", this.node).children[i].getChildByName("coinBtn").getChildByName("text").getComponent(cc.Label).string
                        = this.cost[this.nowUp[i]][globalData.data.kitchenUp[this.nowUp[i]]];
                }
            }
        }

        if (globalData.data.kitchenUp[this.nowUp[index]] >= this.maxLevel[this.nowUp[index]]) {
            cc.find("bg/parent", this.node).children[index].getChildByName("videoBtn").active = false;
            cc.find("bg/parent", this.node).children[index].getChildByName("coinBtn").active = true;
            cc.find("bg/parent", this.node).children[index].getChildByName("coinBtn").getChildByName("text").active = false;
            cc.find("bg/parent", this.node).children[index].getChildByName("coinBtn").getComponent(cc.Sprite).spriteFrame = this.coinBtnImg;
            cc.find("bg/parent", this.node).children[index].getChildByName("coinBtn").getComponent(cc.Button).interactable = false;
        }
        globalData.data.achieve[0].num++;
        AD.Game.onInitGame();
    },
    onZhiYinCallBack() {
        this.firstUp++;
        if (this.firstUp == 1) {
            cc.director.emit("新手指引店长出现")
        }
        cc.find("bg/zhiYin/mask", this.node).active = false;
        cc.find("Canvas/newGuidelinesView/shouZhi1").active = false;
        AD.sound.playSfx("升级");
        globalData.data.kitchenUp[6]++;
        globalData.saveData();
        cc.find("bg/zhiYin", this.node).children[0].getChildByName("effect").getComponent(sp.Skeleton).setAnimation(0, "animation", false);
        cc.find("bg/zhiYin", this.node).children[0].getChildByName("level").getComponent(cc.Sprite).spriteFrame = this.levelImg[6 - 4][globalData.data.kitchenUp[6]];
        if (globalData.data.kitchenUp[6] < this.maxLevel[6]) {
            if (globalData.data.coin < this.cost[6][globalData.data.kitchenUp[6]]) {
                cc.find("bg/zhiYin", this.node).children[0].getChildByName("coinBtn").active = false;
                cc.find("bg/zhiYin", this.node).children[0].getChildByName("videoBtn").active = true;
            }
            else {
                cc.find("bg/zhiYin", this.node).children[0].getChildByName("coinBtn").active = true;
                cc.find("bg/zhiYin", this.node).children[0].getChildByName("videoBtn").active = false;
                cc.find("bg/zhiYin", this.node).children[0].getChildByName("coinBtn").getChildByName("text").getComponent(cc.Label).string
                    = this.cost[6][globalData.data.kitchenUp[6]];
            }
        }
        else {
            cc.find("bg/zhiYin", this.node).children[0].getChildByName("videoBtn").active = false;
            cc.find("bg/zhiYin", this.node).children[0].getChildByName("coinBtn").getChildByName("text").active = false;
            cc.find("bg/zhiYin", this.node).children[0].getChildByName("coinBtn").getComponent(cc.Sprite).spriteFrame = this.coinBtnImg;
            cc.find("bg/zhiYin", this.node).children[0].getChildByName("coinBtn").getComponent(cc.Button).interactable = false;
        }
        globalData.data.achieve[0].num++;
        AD.Game.onInitGame();
    },
    onAllLevelMax() {
        // if (globalData.data.kitchenUp[0] == 6 && globalData.data.kitchenUp[1] == 3
        //     && globalData.data.kitchenUp[2] == 3 && globalData.data.kitchenUp[3] == 3
        //     && globalData.data.kitchenUp[4] == 3 && globalData.data.kitchenUp[5] == 3
        //     && globalData.data.kitchenUp[6] == 3 && globalData.data.kitchenUp[7] == 3) {
        //     this.node.active = false;
        // }
    },
    /**解锁食物 */
    unlockFood() {
        cc.find("bg/nextFood", this.node).active = true;
        var dayArray = [2, 5, 8, 11, 14]
        if (globalData.data.day < 2) {
            cc.find("bg/nextFood/foodImg", this.node).getComponent(cc.Sprite).spriteFrame = this.shiWuImg[0]
            cc.find("bg/nextFood/dayText", this.node).getComponent(cc.Label).string = dayArray[0] - globalData.data.day;
        }
        else if (globalData.data.day < 5) {
            cc.find("bg/nextFood/foodImg", this.node).getComponent(cc.Sprite).spriteFrame = this.shiWuImg[1]
            cc.find("bg/nextFood/dayText", this.node).getComponent(cc.Label).string = dayArray[1] - globalData.data.day;
        }
        else if (globalData.data.day < 8) {
            cc.find("bg/nextFood/foodImg", this.node).getComponent(cc.Sprite).spriteFrame = this.shiWuImg[2]
            cc.find("bg/nextFood/dayText", this.node).getComponent(cc.Label).string = dayArray[2] - globalData.data.day;
        }
        else if (globalData.data.day < 11) {
            cc.find("bg/nextFood/foodImg", this.node).getComponent(cc.Sprite).spriteFrame = this.shiWuImg[3]
            cc.find("bg/nextFood/dayText", this.node).getComponent(cc.Label).string = dayArray[3] - globalData.data.day;
        }
        else if (globalData.data.day < 14) {
            cc.find("bg/nextFood/foodImg", this.node).getComponent(cc.Sprite).spriteFrame = this.shiWuImg[4]
            cc.find("bg/nextFood/dayText", this.node).getComponent(cc.Label).string = dayArray[4] - globalData.data.day;
        }
        else {
            cc.find("bg/nextFood", this.node).active = false
        }
        // else if(globalData.data.day<14){
        //     cc.find("bg/nextFood/foodImg",this.node).getComponent(cc.Sprite).spriteFrame = this.shiWuImg[5]
        //     cc.find("bg/nextFood/dayImg",this.node).getComponent(cc.Sprite).spriteFrame = this.dayImg[5]
        // }
    }
});
