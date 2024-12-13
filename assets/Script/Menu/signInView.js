cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    onLoad () {

    },

    start () {

    },
    onEnable(){
        if (globalData.data.nowDay == null) {
            globalData.data.nowDay = Tools.getDate("month") + Tools.getDate("day") / 100;

        }
        else {
            if (globalData.data.nowDay != Tools.getDate("month") + Tools.getDate("day") / 100) {
                globalData.data.nowDay = Tools.getDate("month") + Tools.getDate("day") / 100;
                if (globalData.data.qianDaoArray[globalData.data.qianDaoIndex%7]) {
                    
                    globalData.data.qianDaoIndex++;
                }
                else{
                    
                }
                if (globalData.data.qianDaoIndex > 6) {
                    
                    // this.onInitLastWeek()
                    if (globalData.data.qianDaoIndex % 7==0) {
                        globalData.data.qianDaoArray = [false, false, false, false, false, false, false,];
                    }
                }
            }
            else {
                
            }
        }
        this.beiNum = 1;
        var qianDaoIndex = globalData.data.qianDaoIndex;
        if (globalData.data.qianDaoArray[qianDaoIndex%7]) {
            cc.find("bg/days", this.node).children[globalData.data.qianDaoIndex%7].getChildByName("xuanZhong").active = false;
        }
        else{
            cc.find("bg/days", this.node).children[globalData.data.qianDaoIndex%7].getChildByName("xuanZhong").active = true;
        }
        for (var i = 0; i < 7; i++) {
            cc.find("bg/days",this.node).children[i].getChildByName("yiLingQu").active = globalData.data.qianDaoArray[i];
        }
        
        
    },
    update (dt) {

    },
    onBtnCallBack(e, t) {
        AD.sound.playSfx("按钮");
        switch (t) {
            case "关闭签到":
                Tools.resetDialog(this.node, false)
                break
           
            case "单倍领取":
                AD.sound.playSfx("升级");
                this.beiNum = 1;
                this.onAwardCallBack()
                cc.find("Canvas/signInBtn/zjm_btn_Gth").active = false;
                break
            case "双倍领取":
               
                this.beiNum = 2;
                AD.showAD(this.onAwardCallBack,this);
                break
        }

    },
    onAwardCallBack() {
        globalData.data.lastDay = globalData.data.nowDay;
        globalData.data.qianDaoArray[globalData.data.qianDaoIndex%7] = true;
        cc.find("bg/days",this.node).children[globalData.data.qianDaoIndex%7].getChildByName("yiLingQu").active = true;
        switch (globalData.data.qianDaoIndex%7) {
            case 0:
                globalData.addDiamond(50 * this.beiNum);
                AD.Menu.onCreatDiamond(cc.v2(-278,35))
                break
            case 1:
                globalData.data.unLockSkin[1] = true;
                break
            case 2:
                globalData.addDiamond(200 * this.beiNum)
                AD.Menu.onCreatDiamond(cc.v2(105,35))
                break
            case 3:
                globalData.data.unLockSkin[2] = true;
                break
            case 4:
                globalData.addDiamond(200 * this.beiNum)
                AD.Menu.onCreatDiamond(cc.v2(-86,135));
                break
            case 5:
                // if(globalData.data.qianDaoIndex>6){
                //     globalData.addTiShi(4 * this.beiNum)
                // }
                // else{
                //     globalData.addCoin(1200 * this.beiNum)
                // }
                globalData.data.unLockSkin[3] = true;
                break
            case 6:
                
                globalData.data.unLockSkin[4] = true;
                break
        }
        globalData.saveData();
        if (globalData.data.qianDaoArray[globalData.data.qianDaoIndex%7]) {
            cc.find("bg/days", this.node).children[globalData.data.qianDaoIndex%7].getChildByName("xuanZhong").active = false;
        }
        else{
            cc.find("bg/days", this.node).children[globalData.data.qianDaoIndex%7].getChildByName("xuanZhong").active = true;
        }
        // cc.find("bg/danBeiBtn",this.node).active = false;
        // cc.find("bg/doubleBtn",this.node).active = false;
        // cc.find("bg/singleBtn",this.node).active = false;
        // cc.find("bg/yiLingQu",this.node).active = true;
    },
    onInitLastWeek(){
        var kuangs = cc.find("bg/kuang",this.node).children;
        kuangs[2].getComponent(cc.Sprite).spriteFrame = this.kuangImg;
        kuangs[2].y = 195;
        kuangs[5].getComponent(cc.Sprite).spriteFrame = this.kuangImg;
        kuangs[5].x = 171.32;
        kuangs[5].y = 25;
        cc.find("bg/days",this.node).children[5].getChildByName("icon").position = cc.v2(344,170);
        cc.find("bg/days",this.node).children[5].getChildByName("label").position = cc.v2(346,114);
        kuangs[6].position = cc.v2(0,-145);
        cc.find("bg/xuanZhongView",this.node).children[6].x = 0
    }
});
