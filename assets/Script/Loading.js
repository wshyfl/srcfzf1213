cc.Class({
    extends: cc.Component,

    properties: {

    },

    onLoad() {
        globalData.getDataAll()
        AD.height = cc.winSize.height;
        AD.width = cc.winSize.width;
        cc.director.getPhysicsManager().enabled = true;
        cc.director.getCollisionManager().enabled = true;
    },

    start() {

        AD.sound.playSfx("BGM");
        this.scheduleOnce(() => {

            cc.director.loadScene("Menu");
        }, 3)
    },

    update(dt) {

    },
});
