cc.Class({
    extends: cc.Component,

    properties: {

    },

    onLoad() {
        this.hanBao = [false, false, false, false];
        this.mianBaoDi = cc.find("mianBaoDi", this.node);
        this.xiHongShi = cc.find("xiHongShi", this.node);
        this.rou = cc.find("rou", this.node);
        this.mianBao = cc.find("mianBao", this.node);
        this.firstPosXiHongShi = this.xiHongShi.position;
        this.firstPosRou = this.rou.position;
        this.firstPosMianBao = this.mianBao.position;
        this.firstPosMianBaoDi = this.mianBaoDi.position;
    },

    start() {
        this.onNodeTouchEvent();
        if (this.node.parent.name == "Player1") {
            this.hanBaoX = 60;
        }
        else {
            this.hanBaoX = -35;
        }
        cc.director.on("关闭小游戏按钮",()=>{
            this.unschedule(this.closeOneself,this)
        })
    },
    onEnable() {
        this.hanBao = [false, false, false, false];
        this.xiHongShi.position = this.firstPosXiHongShi;
        this.rou.position = this.firstPosRou;
        this.mianBao.position = this.firstPosMianBao;
        this.mianBaoDi.position = this.firstPosMianBaoDi;
    },
    update(dt) {

    },
    onNodeTouchEvent() {
        //-------------------------
        this.mianBaoDi.on(cc.Node.EventType.TOUCH_MOVE, (e) => {
            if (this.hanBao[0]) return
            this.mianBaoDi.x += e.getDelta().x;
            this.mianBaoDi.y += e.getDelta().y;
        }, this)
        this.mianBaoDi.on(cc.Node.EventType.TOUCH_END, (e) => {
            if (this.hanBao[0]) return
            if (Tools.getDistance(this.mianBaoDi, cc.v2(this.hanBaoX, -213)) < 80) {
                AD.sound.playSfx("正确");
                this.hanBao[0] = true;
                this.mianBaoDi.position = cc.v2(this.hanBaoX, -213);
            }
            else {
                this.mianBaoDi.position = this.firstPosMianBaoDi;
            }
        }, this)
        //-------------------------
        this.rou.on(cc.Node.EventType.TOUCH_MOVE, (e) => {
            if (this.hanBao[1]) return
            this.rou.x += e.getDelta().x;
            this.rou.y += e.getDelta().y;
        }, this)
        this.rou.on(cc.Node.EventType.TOUCH_END, (e) => {
            if (!this.hanBao[0]) {
                cc.tween(this.rou)
                    .to(0.2, { position: this.firstPosRou })
                    .start()
                return
            }
            if (this.hanBao[1]) return
            if (Tools.getDistance(this.rou, cc.v2(this.hanBaoX, -198)) < 80) {
                AD.sound.playSfx("正确");
                this.hanBao[1] = true;
                this.rou.position = cc.v2(this.hanBaoX, -198);
            }
            else {
                this.rou.position = this.firstPosRou;
            }
        }, this)
        //-------------------------西红柿
        this.xiHongShi.on(cc.Node.EventType.TOUCH_MOVE, (e) => {
            if (this.hanBao[2]) return
            this.xiHongShi.x += e.getDelta().x;
            this.xiHongShi.y += e.getDelta().y;
        }, this)
        this.xiHongShi.on(cc.Node.EventType.TOUCH_END, (e) => {
            if (!this.hanBao[0] || !this.hanBao[1]) {
                cc.tween(this.xiHongShi)
                    .to(0.2, { position: this.firstPosXiHongShi })
                    .start()
                return
            }
            if (this.hanBao[2]) return
            if (Tools.getDistance(this.xiHongShi, cc.v2(this.hanBaoX, -181)) < 80) {
                AD.sound.playSfx("正确");
                this.hanBao[2] = true;
                this.xiHongShi.position = cc.v2(this.hanBaoX, -181);
            }
            else {
                this.xiHongShi.position = this.firstPosXiHongShi;
            }
        }, this)

        //-------------------------面包上层
        this.mianBao.on(cc.Node.EventType.TOUCH_MOVE, (e) => {
            if (this.hanBao[3]) return
            this.mianBao.x += e.getDelta().x;
            this.mianBao.y += e.getDelta().y;
        }, this)
        this.mianBao.on(cc.Node.EventType.TOUCH_END, (e) => {
            if (!this.hanBao[0] || !this.hanBao[1] || !this.hanBao[2]) {
                cc.tween(this.mianBao)
                    .to(0.2, { position: this.firstPosMianBao })
                    .start()
                return
            }
            if (this.hanBao[3]) return
            if (Tools.getDistance(this.mianBao, cc.v2(this.hanBaoX, -148)) < 80) {
                AD.sound.playSfx("正确");
                this.hanBao[3] = true;
                this.mianBao.position = cc.v2(this.hanBaoX, -148);
                this.scheduleOnce(this.closeOneself,1)
                cc.director.emit("制作完成", this.node.parent.getSiblingIndex(), "汉堡");
            }
            else {
                this.mianBao.position = this.firstPosMianBao;
            }
        }, this)
    },
    closeOneself(){
        this.node.active = false;
        this.node.parent.active = false;
    }
});
