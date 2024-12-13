cc.Class({
    extends: cc.Component,

    properties: {

    },
    onLoad() {
        this.isTalk = false;
        this.step = 1;
        this.newGuidelinesView = cc.find("newGuidelinesView", this.node);
        this.shouZhi1 = cc.find("shouZhi1", this.newGuidelinesView);
        this.shouZhi2 = cc.find("shouZhi2", this.newGuidelinesView);
        if (globalData.data.day != -1) return
        AD.luPingBegin();
        this.onNewGuidelinesView("你两是新来的员工吗？看起来还不错，我来教你们一些基本操作");
        
    },

    start() {
        var num = 0
        cc.director.on("新手指引拿到食物", (food) => {
            AD.Game.onTip("将食物放到餐盘上");

            if (food == "汉堡") {
                this.shouZhi1.setPosition(-150, 175);
            }
            else {
                this.shouZhi2.setPosition(-20, 175);
            }
            num++;
            if (num == 2) {
                this.shouZhi1.active = false;
                this.shouZhi2.active = false;
            }
        }, this)
        cc.director.on("新手指引厨房升级", () => {
            this.shouZhi1.active = true;
            this.shouZhi1.setPosition(0, -150);
        }, this)
        cc.director.on("新手指引店长出现", () => {
            this.onNewGuidelinesView("不同的属性有不同的效果，根据自己需求合理利用金币")
        }, this)
    },

    // update (dt) {},
    onBtnCallBack(e, t) {
        switch (t) {
            case "继续游戏":
                switch (this.step) {
                    case 1:

                        cc.find("shopManagerView/bg/text", this.newGuidelinesView).getComponent(cc.Label).string = "";
                        this.typingAni(cc.find("shopManagerView/bg/text", this.newGuidelinesView).getComponent(cc.Label), "合作模式需要两人合作一起完成客人的需求");
                        this.step++;
                        break
                    case 2:
                        AD.Game.keyBoardMove = true;
                        cc.find("shopManagerView", this.newGuidelinesView).active = false;
                        cc.find("shopManagerView/bg/text", this.newGuidelinesView).getComponent(cc.Label).string = "";
                        AD.Game.onCreatWantEat();
                        AD.Game.onCreatNpc(1)
                        this.step++;
                        AD.Game.onTip("移动角色到食物前，拿取食物");
                        this.shouZhi1.active = true;
                        this.shouZhi2.active = true;
                        this.shouZhi1.setPosition(-594, -51);
                        this.shouZhi2.setPosition(453, 157);
                        break
                    case 3:
                        
                        this.typingAni(cc.find("shopManagerView/bg/text", this.newGuidelinesView).getComponent(cc.Label), "你们已经是一名合格的员工了，开始工作吧");
                        this.step++;
                        break
                    case 4:
                        cc.find("shopManagerView", this.newGuidelinesView).active = false;
                        cc.find("shopManagerView/bg/text", this.newGuidelinesView).getComponent(cc.Label).string = "";
                        this.step++;
                        break
                }
                break
        }
    },
    onNewGuidelinesView(text) {
        cc.find("shopManagerView/manager", this.newGuidelinesView).x = -960;
        cc.find("shopManagerView/manager", this.newGuidelinesView).angle = 0;
        cc.find("shopManagerView/bg", this.newGuidelinesView).active = false;
        this.scheduleOnce(() => {

            cc.find("shopManagerView", this.newGuidelinesView).active = true;
            cc.tween(cc.find("shopManagerView/manager", this.newGuidelinesView))
                .to(0.2, { x: -cc.winSize.width / 2 + 210 })
                .to(0.2, { angle: 10 })
                .to(0.2, { angle: 0 }, { easing: "backOut" })
                .call(() => {
                    cc.find("shopManagerView/bg", this.newGuidelinesView).x = cc.find("shopManagerView/manager", this.newGuidelinesView).x + 350;
                    cc.find("shopManagerView/bg", this.newGuidelinesView).active = true;
                    this.typingAni(cc.find("shopManagerView/bg/text", this.newGuidelinesView).getComponent(cc.Label), text);
                })
                .start()
        }, 0.5)

    },
    typingAni(label, text) {
        cc.find("shopManagerView/bg/btn1", this.newGuidelinesView).active = false;
        var html = '';
        var arr = text.split('');
        var len = arr.length;
        var step = 0;
        this.func = function () {
            html += arr[step];
            label.string = html;
            if (++step == len) {
                this.isTalk = false;
                this.unschedule(this.func, this);
                cc.find("shopManagerView/bg/btn1", this.newGuidelinesView).active = true;
            }
        }
        this.schedule(this.func, 0.05)
    },
});
