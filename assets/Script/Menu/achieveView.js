

cc.Class({
    extends: cc.Component,

    properties: {

        titleImg1: [cc.SpriteFrame],
        titleImg2: [cc.SpriteFrame],
        titleImg3: [cc.SpriteFrame],
        titleImg4: [cc.SpriteFrame],
        titleImg5: [cc.SpriteFrame],
        btnImg: [cc.SpriteFrame],
        starImg: cc.SpriteFrame,
    },

    onLoad() {
        this.allTitle = [this.titleImg1, this.titleImg2, this.titleImg3, this.titleImg4, this.titleImg5];
        this.achieve = cc.find("bg/ScrollView/view/content", this.node).children;
        this.award = [[5, 15, 30, 50, 100], [10, 30, 50], [10, 50, 100], [20, 40, 60], [20, 50, 100]];
        this.needNum = [[3, 15, 30, 50, 100], [2, 4, 7], [3, 10, 35], [1, 4, 10], [1, 3, 5]];
        this.allDesc = [["服务3名顾客", "服务15名顾客", "服务30名顾客", "服务50名顾客", "服务100名顾客"], ["拥有两名角色", "拥有4名角色", "拥有全部角色"], ["任意模式中升级3次", "任意模式中升级10次", "任意模式中升级35次"], ["经历1次机关", "经历4次机关", "经历10次机关"], ["观看1次广告", "观看3次广告", "观看5次广告"]];
    },
    onEnable() {
        var sum = 0
        for(var i = 0;i<globalData.data.unLockSkin.length;i++){
            if(globalData.data.unLockSkin[i]){
                sum++
            }
        }
        globalData.data.achieve[1].num = sum;
        globalData.saveData()
        this.onInitAchieveView();
    },
    start() {

    },

    update(dt) {
        
    },
    onBtnCallBack(e, t) {
        AD.sound.playSfx("按钮");
        switch (t) {
            case "关闭":
                Tools.resetDialog(this.node, false);
                break
            case "按钮":
                if (e.target.getComponent(cc.Sprite).spriteFrame == this.btnImg[0] || e.target.getComponent(cc.Sprite).spriteFrame == this.btnImg[2]) return
                AD.sound.playSfx("升级");
                var index = e.target.parent.getSiblingIndex();
                var _pos = e.target.parent.convertToWorldSpaceAR(e.target.parent.getChildByName("award").position);
                var pos = cc.v2(_pos.x - cc.winSize.width / 2, _pos.y - cc.winSize.height / 2);
                globalData.addDiamond(this.award[index][globalData.data.achieve[index].level])
                AD.Menu.onCreatDiamond(pos);
                globalData.data.achieve[index].isGet[globalData.data.achieve[index].level] = true;
                if (globalData.data.achieve[index].level < this.award[index].length - 1) {
                    globalData.data.achieve[index].level++;
                }
                globalData.saveData()
                this.onInitAchieveView()
                AD.Menu.onAchieveTip();
                break
        }
    },
    onInitAchieveView() {
        for (var i = 0; i < this.achieve.length; i++) {
            this.achieve[i].getChildByName("title").getComponent(cc.Sprite).spriteFrame = this.allTitle[i][globalData.data.achieve[i].level];
            this.achieve[i].getChildByName("award").getChildByName("text").getComponent(cc.Label).string = "X" + this.award[i][globalData.data.achieve[i].level];
            this.achieve[i].getChildByName("progress").getChildByName("bar").width = 416 * globalData.data.achieve[i].num / this.needNum[i][globalData.data.achieve[i].level];
            this.achieve[i].getChildByName("desc").getComponent(cc.Label).string = this.allDesc[i][globalData.data.achieve[i].level];
            if (!globalData.data.achieve[i].isGet[globalData.data.achieve[i].level]) {
                if (globalData.data.achieve[i].num >= this.needNum[i][globalData.data.achieve[i].level]) {
                    this.achieve[i].getChildByName("btn").getComponent(cc.Sprite).spriteFrame = this.btnImg[1];
                }
                else {
                    this.achieve[i].getChildByName("btn").getComponent(cc.Sprite).spriteFrame = this.btnImg[0];
                }
            }
            else {
                this.achieve[i].getChildByName("btn").getComponent(cc.Sprite).spriteFrame = this.btnImg[2];
            }
            for (var j = 0; j < this.needNum[i].length; j++) {
                if (j <= globalData.data.achieve[i].level)
                    this.achieve[i].getChildByName("stars").children[j].getComponent(cc.Sprite).spriteFrame = this.starImg;
            }
        }
    }
});
