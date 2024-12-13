
var LabelUtils2 = require("LabelUtils2");
cc.Class({
    extends: cc.Component,

    properties: {
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        AD.onlineSwitch = this;
        cc.game.addPersistRootNode(this.node);
        AD.intAD()
        console.log("isAndroid: "+AD.isAndroid);
        if (AD.chanelNameNow == AD.chanelNameTarget && AD.getOnlineSwitch) {
            if (AD.isAndroid == true) return
            if (AD.chanelNameTarget == "UC") return
            if (AD.chanelNameTarget == "BD")
                AD.btnCloseBig = true;
            this.getSwitchKey();
            LabelUtils2.getInstance().initLabel(this.key);
            var _funcGetShare = function () {
                //关闭按钮 概率
                var _close = LabelUtils2.getInstance().getLabel(this.switch)//
                if (_close == true) {
                    AD.wuDianRate = 10;//点击关闭也是看公告的概率  概率 x%
                    AD.wuDianRateChaPing = 5;//插屏自点击概率---vivo oppo原生广告
                    AD.delayTime = 3;//按钮延时
                    AD.btnCloseBig = false;

                    if (AD.chanelNameTarget == "OPPO") {
                        // AD_OPPO.secondOnlineOppo = 60;
                        // AD_OPPO.showMoreGameOppo = true;
                        AD_oppo.switchOn();
                    }
                    this.unschedule(_funcGetShare);
                }
                console.log("开关是  " + _close)
            };
            this.schedule(_funcGetShare, 0.05, 40, 1)
            this.schedule(_funcGetShare, 5);

        }


    },

    start() {
        if (AD.chanelNameNow == AD.chanelNameTarget) {
            if (AD.chanelNameTarget == "TT") {
                this.schedule(function () {
                    AD_TT.showFavoriteGuide();
                }, 10)
            }
            
        }
        //在线奖励倒计时
        AD.onlineTime = 300;
        AD.canGetAward = false;
        this.onlineFun = function () {
            if(AD.canGetAward) return
            AD.onlineTime--;
            if (AD.onlineTime <= 0) {
                AD.onlineTime = 0;
                AD.canGetAward = true;
            }
        }
        this.schedule(this.onlineFun, 1);
        
        if(AD.chanelNameTarget == "QQ"){
            this.secondQQ = 0;
            this.schedule(function () {
                this.secondQQ++;
                if (this.secondQQ > 5) {
                    if (this.secondQQ % 15 == 7) {
                        AD_QQ.blockADQQHide();
                    }
                    else if (this.secondQQ % 15 == 9) {
                        AD_QQ.blockADQQShow();
                    }
                }
    
            }, 1)
        }
        
    },

    getSwitchKey() {
        switch (AD.chanelNameTarget) {
            case "BD":  //百度 1.0.0.0
                this.key = "srdzz_srdzzbd_100_baidu_xyx_20201209";
                this.switch = "switch";
                break;
            case "QQ":  //QQ 1.0.0
                this.key = "srcfzf_srcfzfqq_100_qq_xyx_20220322";
                this.switch = "switch";
                break;
            case "WX":  //WX 1.0.0 头脑吃鸡
                this.key = "srdtz_srdtzwx_100_weixin_xyx_20210802";
                this.switch = "switch2";
                break;
            case "VIVO":  //VIVO 1.0.0 头脑吃鸡
                this.key = "srcfzf_srcfzfvivo_100_vivo_xyx_20220316";
                this.switch = "switch2";
                break;
            case "TT":  //VIVO 1.0.0 头脑吃鸡
                this.key = "srcfzf_srcfzftt_100_tt_xyx_20220329";
                this.switch = "switch";
                break;
            case "OPPO":  //VIVO 1.0.0 头脑吃鸡
                this.key = "srcfzf_srcfzfoppo_100_oppo_xyx_20220316";
                this.switch = "switch";
                break;

        }
    },

    addFightCoin(num,index) {
        
    },
    update (dt) {
        
    },
});
