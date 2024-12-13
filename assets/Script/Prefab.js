

cc.Class({
    extends: cc.Component,

    properties: {
        foodPre:[cc.Prefab],
        coinPre:cc.Prefab,
        coinEffectPre:cc.Prefab,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        AD.foodPre = this.foodPre;
        AD.coinPre = this.coinPre;
        AD.coinEffectPre = this.coinEffectPre;
    },

    start () {

    },

    // update (dt) {},
});
