cc.Class({
    extends: cc.Component,

    properties: {

    },

    onLoad() { },

    start() {
        cc.tween(this.node.children[0])
            .repeatForever(
                cc.tween()
                    .to(10, { x: 1600 })
                    .call(() => {
                        this.node.children[0].x = -1600;
                    })
                    .to(10, { x: 0 })
            )
            .start()
        cc.tween(this.node.children[1])
            .repeatForever(
                cc.tween()
                    .to(20, { x: 1600 })
                    .call(() => {
                        this.node.children[1].x = -1600
                    })
            )
            .start()
    },

    update(dt) { },
});
