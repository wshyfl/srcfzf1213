cc.Class({
    extends: cc.Component,

    properties: {
        yinLiaoImg: [cc.SpriteFrame]
    },

    onLoad() {
        this.beiZi = cc.find("beiZi", this.node);

    },
    onEnable() {
        this.yinLiaoArray = [true, false, false, false];
        this.canMove = true;
        for (var i = 0; i < 4; i++) {
            cc.find("shuiZhus", this.node).children[i].children[0].y = 143;
            cc.find("shuiZhus", this.node).children[i].children[1].y = 48;
            cc.find("qiPao", this.node).children[i].active = false;
            cc.find("btns", this.node).children[i].getComponent(cc.Button).interactable = true;
        }
        if (this.node.parent.name == "Player1") {
            this.type = 1
            this.beiZi.x = -106;
        }
        else {
            this.type = 2
            this.beiZi.x = -252;
        }
        cc.find("mask/yinLiao", this.beiZi).y = -50;
        cc.find("progress/mask", this.node).width = 0;
    },
    start() {
        this.onNodeTouchEvent();
        cc.director.on("关闭小游戏按钮", () => {
            this.unschedule(this.closeOneself, this)
        })
    },
    onDisable() {
        AD.sound.playSfx("关闭饮料冒泡" + this.type);
        if (this.dongHua1) {
            this.dongHua2.stop();
            this.dongHua1.stop();
            this.maskTween.stop();
            this.yinLiaoTween.stop(); 
        }
        AD.sound.playSfx("关闭接水" + this.type);
    },
    update(dt) {

    },
    onBtnCallBack(e, t) {
        AD.sound.playSfx("按钮");
        var index = e.target.getSiblingIndex();
        if (!this.yinLiaoArray[index]) return
        this.canMove = false;
        e.target.getComponent(cc.Button).interactable = false;
        AD.sound.playSfx("接水" + this.type);
        AD.sound.playSfx("饮料冒泡" + this.type);
        cc.find("qiPao", this.node).children[index].active = true;
        cc.find("qiPao", this.node).children[index].getComponent(sp.Skeleton).setAnimation(0, "yinshuiji", true);
        cc.find("mask/yinLiao", this.beiZi).getComponent(cc.Sprite).spriteFrame = this.yinLiaoImg[index];

        this.maskTween = cc.tween(cc.find("progress/mask", this.node))
            .to(3, { width: 308 })
            .start()

        this.yinLiaoTween = cc.tween(cc.find("mask/yinLiao", this.beiZi))
            .to(3, { y: -2 })
            .call(() => {
                
                AD.sound.playSfx("关闭饮料冒泡" + this.type);
                cc.find("qiPao", this.node).children[index].active = true;
                this.dongHua1.stop();
                this.dongHua2.stop();
                cc.find("shuiZhus", this.node).children[index].children[0].y = 143;
                cc.find("shuiZhus", this.node).children[index].children[1].y = 48;
                this.scheduleOnce(this.closeOneself, 1)
                cc.director.emit("制作完成", this.node.parent.getSiblingIndex(), "可乐", index);
            })
            .start()
        this.dongHua1 = cc.tween(cc.find("shuiZhus", this.node).children[index].children[1])
            .repeatForever(
                cc.tween()
                    .to(1, { y: -142 })
                    .call(() => {
                        cc.find("shuiZhus", this.node).children[index].children[1].y = 48
                    })
            )
            .start()
        this.dongHua2 = cc.tween(cc.find("shuiZhus", this.node).children[index].children[0])
            .to(0.5, { y: 48 })
            .repeatForever(
                cc.tween()
                    .to(1, { y: -142 })
                    .call(() => {
                        cc.find("shuiZhus", this.node).children[index].children[0].y = 48
                    })
            )
            .start()

    },
    onNodeTouchEvent() {
        this.beiZi.on(cc.Node.EventType.TOUCH_MOVE, (e) => {
            if (!this.canMove) return
            this.beiZi.x += e.getDelta().x;
            if (this.node.parent.name == "Player1") {
                if (this.beiZi.x >= 290) {
                    this.beiZi.x = 290;
                }
                if (this.beiZi.x <= -130) {
                    this.beiZi.x = -130;
                }
            }
            else {
                if (this.beiZi.x >= 143) {
                    this.beiZi.x = 143;
                }
                if (this.beiZi.x <= -283) {
                    this.beiZi.x = -283;
                }
            }

        }, this)
        this.beiZi.on(cc.Node.EventType.TOUCH_END, (e) => {
            if (this.node.parent.name == "Player1") {
                if (this.beiZi.x >= -130 && this.beiZi.x < -45) {
                    this.beiZi.x = -106;
                    this.yinLiaoArray = [true, false, false, false];
                }
                else if (this.beiZi.x >= -45 && this.beiZi.x < 78) {
                    this.beiZi.x = 17;
                    this.yinLiaoArray = [false, true, false, false];
                }
                else if (this.beiZi.x >= 78 && this.beiZi.x < 203) {
                    this.beiZi.x = 143;
                    this.yinLiaoArray = [false, false, true, false];
                }
                else if (this.beiZi.x >= 203 && this.beiZi.x <= 290) {
                    this.beiZi.x = 266;
                    this.yinLiaoArray = [false, false, false, true];
                }
            }
            else {
                if (this.beiZi.x >= -283 && this.beiZi.x < -192) {
                    this.beiZi.x = -252;
                    this.yinLiaoArray = [true, false, false, false];
                }
                else if (this.beiZi.x >= -192 && this.beiZi.x < -70) {
                    this.beiZi.x = -130;
                    this.yinLiaoArray = [false, true, false, false];
                }
                else if (this.beiZi.x >= -70 && this.beiZi.x < 56) {
                    this.beiZi.x = -4;
                    this.yinLiaoArray = [false, false, true, false];
                }
                else if (this.beiZi.x >= 56 && this.beiZi.x <= 143) {
                    this.beiZi.x = 120;
                    this.yinLiaoArray = [false, false, false, true];
                }
            }

        }, this)
        this.beiZi.on(cc.Node.EventType.TOUCH_CANCEL, (e) => {
            if (this.node.parent.name == "Player1") {
                if (this.beiZi.x >= -130 && this.beiZi.x < -45) {
                    this.beiZi.x = -106;
                    this.yinLiaoArray = [true, false, false, false];
                }
                else if (this.beiZi.x >= -45 && this.beiZi.x < 78) {
                    this.beiZi.x = 17;
                    this.yinLiaoArray = [false, true, false, false];
                }
                else if (this.beiZi.x >= 78 && this.beiZi.x < 203) {
                    this.beiZi.x = 143;
                    this.yinLiaoArray = [false, false, true, false];
                }
                else if (this.beiZi.x >= 203 && this.beiZi.x <= 290) {
                    this.beiZi.x = 266;
                    this.yinLiaoArray = [false, false, false, true];
                }
            }
            else {
                if (this.beiZi.x >= -283 && this.beiZi.x < -192) {
                    this.beiZi.x = -252;
                    this.yinLiaoArray = [true, false, false, false];
                }
                else if (this.beiZi.x >= -192 && this.beiZi.x < -70) {
                    this.beiZi.x = -130;
                    this.yinLiaoArray = [false, true, false, false];
                }
                else if (this.beiZi.x >= -70 && this.beiZi.x < 56) {
                    this.beiZi.x = -4;
                    this.yinLiaoArray = [false, false, true, false];
                }
                else if (this.beiZi.x >= 56 && this.beiZi.x <= 143) {
                    this.beiZi.x = 120;
                    this.yinLiaoArray = [false, false, false, true];
                }
            }
        }, this)
    },
    closeOneself() {
        this.node.active = false;
        this.node.parent.active = false;
    }
});
