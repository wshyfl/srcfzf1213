cc.Class({
    extends: cc.Component,

    properties: {
        nameImg: [cc.SpriteFrame]
    },

    onLoad() {
        this.cost = [0, 400, 400, 400, 450, 500, 600];
    },
    onEnable() {
        this.chooseSkin1 = 0;
        this.chooseSkin2 = 0;
        this.onInitSkinShop();
        this.showSkinIndex1 = 0;
        this.showSkinIndex2 = 0;
        globalData.data.putSkin1 = -1
        globalData.data.putSkin2 = -1
    },
    start() {

    },

    update(dt) {

    },
    onBtnCallBack(e, t) {
        AD.sound.playSfx("按钮");
        switch (t) {
            case "左":
                if (e.target.parent.name == "Player1") {
                    this.showSkinIndex1--;
                    if (this.showSkinIndex1 == -1) {
                        this.showSkinIndex1 = 6;
                    }
                    this.onChangeShowSkin1(this.showSkinIndex1);
                }
                else {
                    this.showSkinIndex2--;
                    if (this.showSkinIndex2 == -1) {
                        this.showSkinIndex2 = 6;
                    }
                    this.onChangeShowSkin2(this.showSkinIndex2);
                }
                break
            case "右":
                if (e.target.parent.name == "Player1") {
                    this.showSkinIndex1++;
                    if (this.showSkinIndex1 == 7) {
                        this.showSkinIndex1 = 0;
                    }
                    this.onChangeShowSkin1(this.showSkinIndex1);
                }
                else {
                    this.showSkinIndex2++;
                    if (this.showSkinIndex2 == 7) {
                        this.showSkinIndex2 = 0;
                    }
                    this.onChangeShowSkin2(this.showSkinIndex2);
                }
                break
            case "选择":
                if (e.target.parent.parent.name == "Player1") {
                    globalData.data.putSkin1 = this.showSkinIndex1;
                    this.onBtnChange("使用中", 0);
                    this.chooseSkin1++;
                }
                else {
                    globalData.data.putSkin2 = this.showSkinIndex2;
                    this.onBtnChange("使用中", 1);
                    this.chooseSkin2++;
                }
                this.onLoadScene();
                break
            case "购买":
                if (e.target.parent.parent.name == "Player1") {
                    if (globalData.data.diamond < this.cost[this.showSkinIndex1]) {
                        AD.showAD(this.onVideoCallBack1, this)
                    }
                    else {
                        globalData.addDiamond(-this.cost[this.showSkinIndex1])
                        this.onVideoCallBack1();
                    }
                }
                else {
                    if (globalData.data.diamond < this.cost[this.showSkinIndex2]) {
                        AD.showAD(this.onVideoCallBack2, this)
                    }
                    else {
                        globalData.addDiamond(-this.cost[this.showSkinIndex2]);
                        this.onVideoCallBack2();
                    }

                }
                break
            case "关闭":
                this.node.active = false;
                break
        }
    },
    onInitSkinShop() {

        cc.find("bg/Player1/img", this.node).getComponent(sp.Skeleton).setSkin("js1");
        cc.find("bg/Player1/img", this.node).getComponent(sp.Skeleton).setAnimation(0, "daiji1", true);
        cc.find("bg/Player2/img", this.node).getComponent(sp.Skeleton).setSkin("js1");
        cc.find("bg/Player2/img", this.node).getComponent(sp.Skeleton).setAnimation(0, "daiji1", true);
        cc.find("bg/Player1/name", this.node).getComponent(cc.Sprite).spriteFrame = this.nameImg[0];
        cc.find("bg/Player2/name", this.node).getComponent(cc.Sprite).spriteFrame = this.nameImg[0];
        this.onBtnChange("使用", 0);
        this.onBtnChange("使用", 1);
    },
    onChangeShowSkin1(index) {
        cc.find("bg/Player1/img", this.node).getComponent(sp.Skeleton).setSkin("js" + (index + 1));
        cc.find("bg/Player1/img", this.node).getComponent(sp.Skeleton).setAnimation(0, "daiji1", true);
        cc.find("bg/Player1/name", this.node).getComponent(cc.Sprite).spriteFrame = this.nameImg[index];
        cc.find("bg/Player1/btns/buyBtn/price", this.node).getComponent(cc.Label).string = this.cost[index];
        if (index == globalData.data.putSkin1) {
            this.onBtnChange("使用中", 0);
        }
        else {
            if (globalData.data.unLockSkin[index]) {
                this.onBtnChange("使用", 0);
            }
            else {
                this.onBtnChange("解锁", 0);

            }
        }
    },
    onChangeShowSkin2(index) {
        cc.find("bg/Player2/img", this.node).getComponent(sp.Skeleton).setSkin("js" + (index + 1));
        cc.find("bg/Player2/img", this.node).getComponent(sp.Skeleton).setAnimation(0, "daiji1", true);
        cc.find("bg/Player2/name", this.node).getComponent(cc.Sprite).spriteFrame = this.nameImg[index];
        cc.find("bg/Player2/btns/buyBtn/price", this.node).getComponent(cc.Label).string = this.cost[index];
        if (index == globalData.data.putSkin2) {
            this.onBtnChange("使用中", 1);
        }
        else {
            if (globalData.data.unLockSkin[index]) {
                this.onBtnChange("使用", 1);
            }
            else {
                this.onBtnChange("解锁", 1);

            }
        }
    },
    /**按钮变化 */
    onBtnChange(str, index) {
        var Btns = [cc.find("bg/Player1/btns", this.node).children, cc.find("bg/Player2/btns", this.node).children]
        switch (str) {
            case "使用中":
                Btns[index][0].active = false;
                Btns[index][1].active = false;
                Btns[index][2].active = true;
                break
            case "使用":
                Btns[index][0].active = true;
                Btns[index][1].active = false;
                Btns[index][2].active = false;
                break
            case "解锁":
                Btns[index][0].active = false;
                Btns[index][1].active = true;
                Btns[index][2].active = false;
                this.onChangeBuyBtn()
                break
        }
    },
    onChangeBuyBtn() {
        var Btns = [cc.find("bg/Player1/btns", this.node).children, cc.find("bg/Player2/btns", this.node).children]
        if (globalData.data.diamond >= this.cost[this.showSkinIndex1]) {
            Btns[0][1].getChildByName("video").active = false;
            Btns[0][1].getChildByName("text").x = 0;
        }
        else {
            Btns[0][1].getChildByName("video").active = true;
            Btns[0][1].getChildByName("text").x = 35;
        }

        if (globalData.data.diamond >= this.cost[this.showSkinIndex2]) {
            Btns[1][1].getChildByName("video").active = false;
            Btns[1][1].getChildByName("text").x = 0;
        }
        else {
            Btns[1][1].getChildByName("video").active = true;
            Btns[1][1].getChildByName("text").x = 35;
        }
    },
    onVideoCallBack1() {
        globalData.data.unLockSkin[this.showSkinIndex1] = true;
        this.onBtnChange("使用", 0);
        if (this.showSkinIndex1 == this.showSkinIndex2) {
            this.onBtnChange("使用", 1);
        }
        globalData.saveData();
    },
    onVideoCallBack2() {
        globalData.data.unLockSkin[this.showSkinIndex2] = true;
        this.onBtnChange("使用", 1);
        if (this.showSkinIndex1 == this.showSkinIndex2) {
            this.onBtnChange("使用", 0);
        }
        globalData.saveData();
    },
    onLoadScene() {
        if (this.chooseSkin2 > 0 && this.chooseSkin1 > 0) {
            if (AD.GameType == "双人合作") {
                cc.director.loadScene("Game")
            }
            else {
                cc.director.loadScene("fightGame")
            }
        }
    },
});
