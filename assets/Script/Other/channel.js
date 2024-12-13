

cc.Class({
    extends: cc.Component,

    properties: {

    },

    onLoad() { },

    start() {
        
        if (AD.chanelNameTarget != "oppoApk") {
            cc.find("moreGameOppo", this.node).active = false;
        }
        if (AD.chanelNameTarget == "233Apk"||AD.chanelNameTarget == "mmyApk"||AD.chanelNameTarget == "miApk"||AD.chanelNameTarget == "TT") {
            cc.find("btn_yinsixieyi", this.node).active = false;
           
        }
        if (AD.chanelNameTarget == "TT") {
            cc.find("btn_yinsixieyi", this.node).active = false;
          
        }
    },

    // update (dt) {},
});
