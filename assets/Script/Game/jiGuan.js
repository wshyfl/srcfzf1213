cc.Class({
    extends: cc.Component,

    properties: {
        skeletonData: [sp.SkeletonData],
        shade: cc.Prefab,
    },

    onLoad() {
        this.Enabled = false;
        this.node.getComponent(sp.Skeleton).skeletonData = this.skeletonData[Tools.random(0, 1)];
        this.Spine = this.node.getComponent(sp.Skeleton);
        this.Spine.setAnimation(0, "daiji", true);
        this.speed = 600;
        this.node.y = 420;


    },
    onInitTween() {
        this.node.x = Tools.random(-475, 460);
        this._shade = cc.instantiate(this.shade);
        this._shade.parent = this.node.parent;
        this._y = Tools.random(20, -190)//可落区域
        this._shade.y = this._y;
        this._shade.x = this.node.x;
        this._shade.zIndex = -this._y;
        var time = Math.abs(this._y - this.node.y) / this.speed;
        this.dropOutTween = cc.tween(this.node)
            .delay(2)
            .to(time, { y: this._y })
            .call(() => {
                AD.sound.playSfx("砸地上")
                this.Spine.setAnimation(0, "liekai", false)
            })
            .delay(1)
            .call(() => {
                this.node.destroy();
            })
            .start()
        this._shade.scale = 0.5;
        this.shadeTween = cc.tween(this._shade)
            .delay(2)
            .to(time, { scale: 1 })
            .call(() => {
                this._shade.destroy()
            })
            .start()
    },
    start() {

    },

    update(dt) {
        this.node.zIndex = -this.node.y + 50;
        if (Math.abs(this._y - this.node.y) < 70 && Math.abs(this._y - this.node.y) > 50) {
            if (!this.Enabled) {
                this.Enabled = true;
                this.node.getComponent(cc.PolygonCollider).enabled = true;
            }
        }
        else if (Math.abs(this._y - this.node.y) <= 50) {
            this.node.getComponent(cc.PolygonCollider).enabled = false;
        }
    },
    onHitPlayer() {
        this.dropOutTween.stop();
        this.shadeTween.stop();
        this.Spine.setAnimation(0, "liekai", false)
        this._shade.destroy()
        this.scheduleOnce(() => {
            this.node.destroy();
        }, 1)
    }
});
