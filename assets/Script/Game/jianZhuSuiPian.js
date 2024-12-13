cc.Class({
    extends: cc.Component,

    properties: {
        bigImg: [cc.SpriteFrame],
        muImgs: [cc.SpriteFrame],
        shiImgs: [cc.SpriteFrame],
    },

    onLoad() {
        this.Enabled = false;
        var r = Tools.random(0, 1)
        var allImg = [this.muImgs, this.shiImgs];
        cc.find("parent", this.node).getComponent(cc.Sprite).spriteFrame = this.bigImg[r];
        cc.find("parent/child1", this.node).getComponent(cc.Sprite).spriteFrame = allImg[r][0];
        cc.find("parent/child2", this.node).getComponent(cc.Sprite).spriteFrame = allImg[r][1];
        this.speed = 600;
        cc.find("parent", this.node).y = 420;

        
        this._y = Tools.random(20, -190)//可落区域
        cc.find("shade", this.node).y = this._y;
        var time = Math.abs(this._y - cc.find("parent", this.node).y) / this.speed;
        this.dropOutTween = cc.tween(cc.find("parent", this.node))
            .delay(2)
            .to(time, { y: this._y })
            .call(() => {
                this.node.destroy();
            })
            .start()
        cc.find("shade", this.node).scale = 0.5;
        this.shadeTween = cc.tween(cc.find("shade", this.node))
            .delay(2)
            .to(time, { scale: 1 })
            .start()
    },

    start() {
        cc.find("parent", this.node).x = Tools.random(-475, 460);
        cc.find("shade", this.node).x = cc.find("parent", this.node).x;
    },

    update(dt) {
        this.node.zIndex = -cc.find("parent", this.node).y;
        if (Math.abs(this._y - cc.find("parent", this.node).y) < 70 && Math.abs(this._y - cc.find("parent", this.node).y) > 50) {
            if (!this.Enabled) {
                this.Enabled = true;
                cc.find("parent", this.node).getComponent(cc.PolygonCollider).enabled = true;
            }
        }
        else if (Math.abs(this._y - cc.find("parent", this.node).y) <= 50) {
            cc.find("parent", this.node).getComponent(cc.PolygonCollider).enabled = false;
        }
    },
    onHitPlayer() {
        this.dropOutTween.stop();
        this.shadeTween.stop();
        cc.find("parent", this.node).getComponent(cc.Sprite).enabled = false;
        cc.find("parent/child1", this.node).active = true;
        cc.find("parent/child2", this.node).active = true;
        cc.find("parent", this.node).getComponent(cc.Animation).play();
        cc.find("shade", this.node).active = false;
        this.scheduleOnce(() => {
            this.node.destroy();
        }, 1)
    }
});
