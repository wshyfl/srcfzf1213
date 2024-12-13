cc.Class({
    extends: cc.Component,

    properties: {
        levelImg1: [cc.SpriteFrame],
        levelImg2: [cc.SpriteFrame],
        levelImg3: [cc.SpriteFrame],
        levelImg4: [cc.SpriteFrame],
        levelImg5: [cc.SpriteFrame],
        levelImg6: [cc.SpriteFrame],
        shuXingImg: [cc.SpriteFrame],
        coinBtnImg: cc.SpriteFrame,
    },

    onLoad() {
        this.Player1 = cc.find("bg/Player1", this.node);
        this.Player2 = cc.find("bg/Player2", this.node);
        this.levelImg = [this.levelImg1, this.levelImg2, this.levelImg3, this.levelImg4, this.levelImg5, this.levelImg6];
        //                   移速              成本              装饰           时间           眩晕                 光明
        this.cost = [[100, 400, 1200], [150, 200, 300,], [100, 400, 1200], [100, 400, 1200], [100, 400, 1200], [150, 450, 1250]];
        this.maxLevel = [3, 3, 3, 3, 3, 3];
        this.Player = [this.Player1, this.Player2];
        this.Player1.active = true;
        this.Player2.active = true;
    },
    onEnable() {
        this.onAllLevelMax();
        var arr = [0, 2, 3, 4, 5,];
        this.nowUp1 = new Array();
        for (var a = 0; a < 3; a++) {
            let r = Tools.random(0, arr.length - 1);
            this.nowUp1[a] = arr[r];
            arr.splice(r, 1);
        }
        var arr2 = [0, 2, 3, 4, 5,];
        this.nowUp2 = new Array();
        for (var j = 0; j < 3; j++) {
            let r = Tools.random(0, arr2.length - 1);
            this.nowUp2[j] = arr2[j];
            arr2.splice(r, 1);
        }
       
        this.nowUp = [this.nowUp1, this.nowUp2]
        for (var i = 0; i < 3; i++) {
            
            cc.find("parent", this.Player1).children[i].getComponent(cc.Sprite).spriteFrame = this.shuXingImg[this.nowUp[0][i]];
            cc.find("parent", this.Player2).children[i].getComponent(cc.Sprite).spriteFrame = this.shuXingImg[this.nowUp[1][i]]
            cc.find("parent", this.Player1).children[i].getChildByName("level").getComponent(cc.Sprite).spriteFrame = this.levelImg[this.nowUp1[i]][globalData.data.kitchenUp_fight[0][this.nowUp1[i]]];
            cc.find("parent", this.Player2).children[i].getChildByName("level").getComponent(cc.Sprite).spriteFrame = this.levelImg[this.nowUp2[i]][globalData.data.kitchenUp_fight[1][this.nowUp2[i]]];
            if (globalData.data.kitchenUp_fight[0][this.nowUp1[i]] < this.maxLevel[this.nowUp1[i]]) {
                if (globalData.data.fightCoin[0] < this.cost[this.nowUp[0][i]][globalData.data.kitchenUp_fight[0][this.nowUp[0][i]]]) {
                    cc.find("parent", this.Player1).children[i].getChildByName("videoBtn").active = true;
                    cc.find("parent", this.Player1).children[i].getChildByName("coinBtn").active = false;
                }
                else {
                    cc.find("parent", this.Player1).children[i].getChildByName("videoBtn").active = false;
                    cc.find("parent", this.Player1).children[i].getChildByName("coinBtn").active = true;
                    cc.find("parent", this.Player1).children[i].getChildByName("coinBtn").getChildByName("text").getComponent(cc.Label).string
                        = this.cost[this.nowUp1[i]][globalData.data.kitchenUp_fight[0][this.nowUp1[i]]];
                }
            }
            else {
                cc.find("parent", this.Player1).children[i].getChildByName("videoBtn").active = false;
                cc.find("parent", this.Player1).children[i].getChildByName("coinBtn").active = true;
                cc.find("parent", this.Player1).children[i].getChildByName("coinBtn").getChildByName("text").active = false;
                cc.find("parent", this.Player1).children[i].getChildByName("coinBtn").getComponent(cc.Sprite).spriteFrame = this.coinBtnImg;
                cc.find("parent", this.Player1).children[i].getChildByName("coinBtn").getComponent(cc.Button).interactable = false;
            }
            if (globalData.data.kitchenUp_fight[1][this.nowUp2[i]] < this.maxLevel[this.nowUp2[i]]) {
                if (globalData.data.fightCoin[1] < this.cost[this.nowUp[1][i]][globalData.data.kitchenUp_fight[1][this.nowUp[1][i]]]) {
                    cc.find("parent", this.Player2).children[i].getChildByName("videoBtn").active = true;
                    cc.find("parent", this.Player2).children[i].getChildByName("coinBtn").active = false;
                }
                else {
                    cc.find("parent", this.Player2).children[i].getChildByName("videoBtn").active = false;
                    cc.find("parent", this.Player2).children[i].getChildByName("coinBtn").active = true;
                    cc.find("parent", this.Player2).children[i].getChildByName("coinBtn").getChildByName("text").getComponent(cc.Label).string
                        = this.cost[this.nowUp2[i]][globalData.data.kitchenUp_fight[0][this.nowUp2[i]]];
                }
            }
            else {
                cc.find("parent", this.Player2).children[i].getChildByName("videoBtn").active = false;
                cc.find("parent", this.Player2).children[i].getChildByName("coinBtn").active = true;
                cc.find("parent", this.Player2).children[i].getChildByName("coinBtn").getChildByName("text").active = false;
                cc.find("parent", this.Player2).children[i].getChildByName("coinBtn").getComponent(cc.Sprite).spriteFrame = this.coinBtnImg;
                cc.find("parent", this.Player2).children[i].getChildByName("coinBtn").getComponent(cc.Button).interactable = false;
            }
        }
    },
    start() {

    },
    onDestroy(){

    },
    update(dt) {
        cc.find("coinBox/text", this.Player1).getComponent(cc.Label).string = Math.round(globalData.data.fightCoin[0]);
        cc.find("coinBox/text", this.Player2).getComponent(cc.Label).string = Math.round(globalData.data.fightCoin[1]);
    },
    onBtnCallBack(e, t) {
        AD.sound.playSfx("按钮");
        switch (t) {
            case "升级":
                var index = e.target.parent.getSiblingIndex();
                var indexParent = e.target.parent.parent.parent.getSiblingIndex();
                this.index = index;
                this.indexParent = indexParent;
                console.log()
                if (globalData.data.fightCoin[indexParent] < this.cost[this.nowUp[indexParent][index]][globalData.data.kitchenUp_fight[indexParent][this.nowUp[indexParent][index]]]) {
                    AD.showAD(this.videoCallBack, this);
                    return
                }
                AD.sound.playSfx("升级");
                e.target.parent.getChildByName("effect").getComponent(sp.Skeleton).setAnimation(0, "animation", false);
                globalData.addFightCoin(-this.cost[this.nowUp[indexParent][index]][globalData.data.kitchenUp_fight[indexParent][this.nowUp[indexParent][index]]], indexParent);
                globalData.data.kitchenUp_fight[indexParent][this.nowUp[indexParent][index]]++;
                globalData.saveData();
                cc.find("parent", this.Player[indexParent]).children[index].getChildByName("level").getComponent(cc.Sprite).spriteFrame
                    = this.levelImg[this.nowUp[indexParent][index]][globalData.data.kitchenUp_fight[indexParent][this.nowUp[indexParent][index]]];


                if (globalData.data.kitchenUp_fight[indexParent][this.nowUp[indexParent][index]] < this.maxLevel[this.nowUp[indexParent][index]]) {
                    for (var i = 0; i < 3; i++) {
                        if (globalData.data.fightCoin[indexParent] < this.cost[this.nowUp[indexParent][i]][globalData.data.kitchenUp_fight[indexParent][this.nowUp[indexParent][i]]]) {
                            cc.find("parent", this.Player[indexParent]).children[i].getChildByName("videoBtn").active = true;
                            cc.find("parent", this.Player[indexParent]).children[i].getChildByName("coinBtn").active = false;
                        }
                        else {
                            cc.find("parent", this.Player[indexParent]).children[i].getChildByName("videoBtn").active = false;
                            cc.find("parent", this.Player[indexParent]).children[i].getChildByName("coinBtn").active = true;
                            cc.find("parent", this.Player[indexParent]).children[i].getChildByName("coinBtn").getChildByName("text").getComponent(cc.Label).string
                                = this.cost[this.nowUp[indexParent][i]][globalData.data.kitchenUp_fight[indexParent][this.nowUp[indexParent][i]]];
                        }
                    }

                }
                else {
                    cc.find("parent", this.Player[indexParent]).children[index].getChildByName("videoBtn").active = false;
                    cc.find("parent", this.Player[indexParent]).children[index].getChildByName("coinBtn").active = true;
                    cc.find("parent", this.Player[indexParent]).children[index].getChildByName("coinBtn").getChildByName("text").active = false;
                    cc.find("parent", this.Player[indexParent]).children[index].getChildByName("coinBtn").getComponent(cc.Sprite).spriteFrame = this.coinBtnImg;
                    cc.find("parent", this.Player[indexParent]).children[index].getChildByName("coinBtn").getComponent(cc.Button).interactable = false;
                }
                globalData.data.achieve[0].num++;
                AD.Game.onInitGame();
                break
            case "关闭":
                var index = e.target.parent.getSiblingIndex();
                this.Player[index].active = false;
                if (!this.Player1.active && !this.Player2.active) {
                    Tools.resetDialog(this.node);
                    cc.director.emit("关闭升级界面");
                }
                break
        }
    },
    videoCallBack() {
        AD.sound.playSfx("升级");
        cc.find("parent", this.Player[this.indexParent]).children[this.index].getChildByName("effect").getComponent(sp.Skeleton).setAnimation(0, "animation", false);
        globalData.data.kitchenUp_fight[this.indexParent][this.nowUp[this.indexParent][this.index]]++;
        cc.find("parent", this.Player[this.indexParent]).children[this.index].getChildByName("level").getComponent(cc.Sprite).spriteFrame
            = this.levelImg[this.nowUp[this.indexParent][this.index]][globalData.data.kitchenUp_fight[this.indexParent][this.nowUp[this.indexParent][this.index]]];
        if (globalData.data.kitchenUp_fight[this.indexParent][this.nowUp[this.indexParent][this.index]] < this.maxLevel[this.nowUp[this.indexParent][this.index]]) {
            cc.find("parent", this.Player[this.indexParent]).children[this.index].getChildByName("videoBtn").active = true;
            cc.find("parent", this.Player[this.indexParent]).children[this.index].getChildByName("coinBtn").active = false;
        }
        else {
            cc.find("parent", this.Player[this.indexParent]).children[this.index].getChildByName("videoBtn").active = false;
            cc.find("parent", this.Player[this.indexParent]).children[this.index].getChildByName("coinBtn").active = true;
            cc.find("parent", this.Player[this.indexParent]).children[this.index].getChildByName("coinBtn").getChildByName("text").active = false;
            cc.find("parent", this.Player[this.indexParent]).children[this.index].getChildByName("coinBtn").getComponent(cc.Sprite).spriteFrame = this.coinBtnImg;
            cc.find("parent", this.Player[this.indexParent]).children[this.index].getChildByName("coinBtn").getComponent(cc.Button).interactable = false;
        }
        globalData.data.achieve[0].num++;
        AD.Game.onInitGame();
        globalData.saveData();
    },
    onAllLevelMax() {

    }
});
