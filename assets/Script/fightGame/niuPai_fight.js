cc.Class({
    extends: cc.Component,

    properties: {
        niuPaiImgs: [cc.SpriteFrame]
    },

    onLoad() {
        this.jianTou = cc.find("progress/jianTou", this.node);
        this.jianTouAnim = cc.find("progress/jianTou", this.node).getComponent(cc.Animation);
        if (this.node.parent.name == "Player1") {
            this.type = 1

        }
        else {
            this.type = 2

        }
    },

    onEnable() {
        AD.sound.playSfx("烤牛排" + this.type);
        cc.find("niuPai", this.node).getComponent(sp.Skeleton).setAnimation(0, "daiji1", true);
        this.randomBarX = this.random(-182, 182);
        cc.find("progress/tag", this.node).x = this.randomBarX;
        this.canFried = false;
        /**煎牛排次数 */
        this.friedNum = 0;
    },
    onDisable() {
        AD.sound.playSfx("关闭烤牛排" + this.type);
    },
    start() {
        this.onNodeTouchEvent();
        cc.director.on("关闭小游戏按钮", () => {
            this.unschedule(this.closeOneself, this)
        })
    },
    update(dt) {

    },
    onNodeTouchEvent() {
        this.node.on(cc.Node.EventType.TOUCH_START, () => {
            if (this.canFried) return
            this.canFried = true;
            this.jianTouAnim.pause();
            if (Math.abs(this.jianTou.x - this.randomBarX) <= 42) {
                this.friedNum++;
                AD.sound.playSfx("牛排点击正确");
                cc.find("niuPai", this.node).getComponent(sp.Skeleton).setAnimation(0, "chengshu" + this.friedNum, false);
                cc.find("niuPai", this.node).getComponent(sp.Skeleton).setCompleteListener(() => {
                    switch (cc.find("niuPai", this.node).getComponent(sp.Skeleton).animation) {
                        case "chengshu1":
                            cc.find("niuPai", this.node).getComponent(sp.Skeleton).setAnimation(0, "daiji2", true);
                            break
                        case "chengshu2":
                            cc.find("niuPai", this.node).getComponent(sp.Skeleton).setAnimation(0, "daiji3", true);
                            break
                        case "chengshu3":
                            cc.find("niuPai", this.node).getComponent(sp.Skeleton).setAnimation(0, "daiji4", true);
                            break
                    }
                })
                if (this.friedNum >= 3) {
                    this.scheduleOnce(this.closeOneself, 1)
                    cc.director.emit("制作完成", this.node.parent.getSiblingIndex(), "牛排");

                }
                this.scheduleOnce(() => {
                    this.jianTouAnim.resume();
                    this.canFried = false;
                    this.randomBarX = this.random(-182, 182);
                    cc.find("progress/tag", this.node).x = this.randomBarX;
                }, 0.8)
            }
            else {
                this.jianTouAnim.pause();
                cc.tween(this.jianTou)
                    .to(0.1, { opacity: 0 })
                    .to(0.1, { opacity: 255 })
                    .to(0.1, { opacity: 0 })
                    .to(0.1, { opacity: 255 })
                    .start()
                this.scheduleOnce(() => {
                    this.randomBarX = this.random(-182, 182);
                    cc.find("progress/tag", this.node).x = this.randomBarX;
                    this.jianTouAnim.resume();
                    this.canFried = false;
                }, 0.8)
            }
        }, this)
    },
    random(lower, upper) {
        return Math.random() * (upper - lower + 1) + lower;
    },
    closeOneself() {
        this.node.active = false;
        this.node.parent.active = false;
    }
});
