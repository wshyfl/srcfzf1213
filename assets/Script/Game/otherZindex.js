
cc.Class({
    extends: cc.Component,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        if (cc.director.getScene().name == "Game") {
            this.node.zIndex = -this.node.y;
        }
        else {
            this.node.zIndex = this.node.y - 130;
        }
        if (this.node.name == "shuiZi") {
            this.type = "水渍";
        }
    },

    // update (dt) {},
});
