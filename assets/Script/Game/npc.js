cc.Class({
    extends: cc.Component,

    properties: {
        spineData: [sp.SkeletonData]
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.npcY = [265, 165, 350, 450];
        this.rang = Tools.random(0, 1);
        this.state = 0;
        this.node.getComponent(sp.Skeleton).skeletonData = this.spineData[this.rang];
        this.Spine = this.node.getComponent(sp.Skeleton);
        if (this.rang == 0) {
            this.Spine.setSkin("npc" + Tools.random(1, 2));
        }
        else {
            this.Spine.setSkin("npc" + Tools.random(3, 5));
        }
        this.setAnimation("yidong");
        this.index = this.node.getSiblingIndex();
        var _n = this.node
        var self = this
        cc.director.on("完成客人需求", (index) => {
            this.state++;
            if (this.state == 2) {
                // this.node.destroy()
                this.node.parent = AD.Game.keRen2;
                this.node.scaleX = -1;
                this.setAnimation(index);
                console.log(index)
                cc.tween(this.node)
                    .to(5, { x: 800 })
                    .call(() => {
                        this.node.destroy()
                    })
                    .start()
            }
            else  if (this.state == 1) {
               this.onMoveSelf()
            }
        });
    },

    start() {
        
    },
    onMoveSelf(){
        this.setAnimation("yidong");
        cc.tween(this.node)
        .to(1, { y: this.npcY[this.state] })
        .call(() => {
            this.setAnimation("daiji")
        })
        .start()
    },
    update(dt) {
        this.node.zIndex = -this.node.y
    },
    /**设置npc动画
     * @param {*} type daiji，shengqi，yidong
     */
    setAnimation(type) {
        this.Spine.setAnimation(0, type, true);
    }
});
