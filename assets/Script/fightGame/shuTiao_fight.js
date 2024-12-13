cc.Class({
    extends: cc.Component,

    properties: {
        shuTiaoPre: [cc.Prefab],
        shuTiaoHeImg: [cc.SpriteFrame]
    },

    onLoad() {

    },
    onEnable() {
        cc.find("shuTiao", this.node).removeAllChildren();
        this.unschedule(this.onCreatShuTiao, this);
        this.schedule(this.onCreatShuTiao, 0.8);
        this.shuTiaoNum = 0;
        this.over = false;
        cc.find("shuTiaoHe", this.node).getComponent(cc.Sprite).spriteFrame = this.shuTiaoHeImg[0];
        cc.find("nowNum", this.node).getComponent(cc.Label).string = this.shuTiaoNum;
    },
    start() {
        this.onNodeTouchEvent();
        cc.director.on("关闭小游戏按钮", () => {
            this.unschedule(this.closeOneself, this);
        })
    },

    update(dt) {
        for (var i = 0; i < cc.find("shuTiao", this.node).children.length; i++) {
            if (cc.find("shuTiao", this.node).children[i].y < -114 && cc.find("shuTiao", this.node).children[i].y > -165) {
                if (Math.abs(cc.find("shuTiao", this.node).children[i].x - cc.find("shuTiaoHe", this.node).x) < 120) {
                    cc.find("shuTiao", this.node).children[i].destroy();
                    AD.sound.playSfx("正确");
                    this.shuTiaoNum++;
                    cc.find("nowNum", this.node).getComponent(cc.Label).string = this.shuTiaoNum;
                    if (this.shuTiaoNum == 5) {
                        cc.find("shuTiaoHe", this.node).getComponent(cc.Sprite).spriteFrame = this.shuTiaoHeImg[1];
                    }
                    else if (this.shuTiaoNum == 10) {
                        cc.find("shuTiaoHe", this.node).getComponent(cc.Sprite).spriteFrame = this.shuTiaoHeImg[2];
                    }
                    else if (this.shuTiaoNum == 15) {
                        cc.find("shuTiaoHe", this.node).getComponent(cc.Sprite).spriteFrame = this.shuTiaoHeImg[3];
                        if (!this.over) {
                            this.over = true
                            cc.find("shuTiao", this.node).removeAllChildren();
                            this.unschedule(this.onCreatShuTiao, this);
                            this.scheduleOnce(this.closeOneself, 1)
                            cc.director.emit("制作完成", this.node.parent.getSiblingIndex(), "薯条");
                        }
                    }
                    
                }
            }
        }
    },
    onCreatShuTiao() {
        this.schedule(() => {
            var shutiao = cc.instantiate(this.shuTiaoPre[Tools.random(0, 2)]);
            shutiao.parent = cc.find("shuTiao", this.node);
            if (this.node.parent.name == "Player2") {
                shutiao.x = Tools.random(-348, 200);
            }
            else {
                shutiao.x = Tools.random(-200, 348);
            }
            shutiao.y = Tools.random(508, 550);
            cc.tween(shutiao)
                .to(3, { y: -500 })
                .call(() => {
                    shutiao.destroy();
                })
                .start()
        }, 0.1, Tools.random(0, 2))

    },

    onNodeTouchEvent() {
        cc.find("shuTiaoHe", this.node).on(cc.Node.EventType.TOUCH_MOVE, (e) => {

            cc.find("shuTiaoHe", this.node).x += e.getDelta().x;
            if (this.node.parent.name == "Player2") {
                if (cc.find("shuTiaoHe", this.node).x <= -272) {
                    cc.find("shuTiaoHe", this.node).x = -272;
                }
                if (cc.find("shuTiaoHe", this.node).x >= 240) {
                    cc.find("shuTiaoHe", this.node).x = 240;
                }
            }
            else {
                if (cc.find("shuTiaoHe", this.node).x >= 272) {
                    cc.find("shuTiaoHe", this.node).x = 272;
                }
                if (cc.find("shuTiaoHe", this.node).x <= -240) {
                    cc.find("shuTiaoHe", this.node).x = -240;
                }
            }
        }, this)
    },
    closeOneself() {
        this.node.active = false;
        this.node.parent.active = false;
    }
});
