

cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    // onLoad () {},

    start () {
    
    },
    init(pos) { 
        var _targetPos = pos;//cc.v2(160,218)
        var _x = this.node.x + Tools.random(-100, 100);
        var _y = this.node.y + Tools.random(-100, 100);
        var _randomTime1 = Tools.random(-20, 20) * 0.01;
        var _randomTime2 = Tools.random(-20, 20) * 0.01;
        cc.tween(this.node)
        .to(0.5 + _randomTime1, { position: cc.v3(_x, _y) }, { easing: "sineOut" })
        .to(0.8 + _randomTime2, { x: _targetPos.x ,y:_targetPos.y, opacity: 100, scale: 0.5 }, { easing: "sineInOut" })
        .call(() => {
            this.node.destroy();
        })
        .start();
        
    }
    // update (dt) {},
});
