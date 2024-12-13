cc.Class({
    extends: cc.Component,

    properties: {
        player: {
            default: null,
            type: cc.Node
        },
        joyNode: cc.Node,
        maxSpeed: 0,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        AD.joyStick = this;
        this.node.width = AD.width / 2;
        if (this.node.name == "joystickPanel1") {
            this.node.x = -AD.width / 4;
        }
        else {
            this.node.x = AD.width / 4;
        }
        this.rot = 0;
        this.playerScript = this.player.getComponent("Player_fight");
        // get joyStickBtn
        this.joyStickBtn = this.joyNode.children[0];
        // Player's move direction
        this.dir = cc.v2(0, 0);
    },
    start() {
        this.node.on('touchstart', this.onTouchStart, this);
        this.node.on('touchmove', this.onTouchMove, this);
        this.node.on('touchend', this.onTouchEnd, this);
        this.node.on('touchcancel', this.onTouchCancel, this);
        cc.director.on("升级速度", this.onChangeSpeed, this);
    },
    onDestroy() {
        // touch event
        this.node.off('touchstart', this.onTouchStart, this);
        this.node.off('touchmove', this.onTouchMove, this);
        this.node.off('touchend', this.onTouchEnd, this);
        this.node.off('touchcancel', this.onTouchCancel, this);
    },

    onTouchStart(event) {
        let pos = cc.v2(event.getLocation().x - AD.width / 2, event.getLocation().y - AD.height / 2)
        this.joyNode.setPosition(pos);
        this.dir = this.joyStickBtn.position.normalize();
    },

    onTouchMove(event) {

        // constantly change joyStickBtn's position
        let posDelta = event.getDelta();
        this.joyStickBtn.setPosition(this.joyStickBtn.position.add(posDelta));

        // get direction
        this.dir = this.joyStickBtn.position.normalize();
        this.rot = Tools.radianToAngle(Tools.getRadian(cc.v2(0, 0), this.dir)) + 180;
        this.playerScript.isMove = true;
        if (this.playerScript.State != AD.playerState.移动 && this.playerScript.State != AD.playerState.摔倒 && this.playerScript.State != AD.playerState.眩晕) {
            this.playerScript.State = AD.playerState.移动;
            this.playerScript.setSpine("移动");
        }

    },

    onTouchEnd(event) {
        // reset
        if (AD.Game.pauseGame) return
        if (AD.Game.GameOver) return
        this.joyStickBtn.setPosition(cc.v2(0, 0));
        this.playerScript.isMove = false;
        if (this.playerScript.State == AD.playerState.移动) {
            this.playerScript.State = AD.playerState.待机;
            this.playerScript.setSpine("待机");
        }

    },

    onTouchCancel(event) {
        // reset
        // this.node.active=false

        this.joyStickBtn.setPosition(cc.v2(0, 0));
        this.playerScript.isMove = false;
        if (this.playerScript.State == AD.playerState.移动) {
            this.playerScript.State = AD.playerState.待机;
            this.playerScript.setSpine("待机");
        }
    },

    update(dt) {
        if (AD.Game.pauseGame) return
        if (AD.Game.GameOver) return
        // get ratio
        let len = this.joyStickBtn.position.mag();
        let maxLen = this.joyNode.width / 4;
        let ratio = len / maxLen;

        // restrict joyStickBtn inside the joyStickPanel
        if (ratio > 1) {
            this.joyStickBtn.setPosition(this.joyStickBtn.position.div(ratio));
        }
        if (ratio > 0)
            ratio = 1
        // move Player

        let dis = this.dir.mul(this.maxSpeed * ratio);
        if (this.playerScript.State != AD.playerState.摔倒 && this.playerScript.State != AD.playerState.眩晕) {
            if (dis.y < 0) {
                if (this.playerScript.changeSpine != "正向") {
                    this.playerScript.changeSpine = "正向";
                    this.playerScript.setSpineData(this.playerScript.changeSpine)
                }
            }
            else if (dis.y > 0) {
                if (this.playerScript.changeSpine != "背向") {
                    this.playerScript.changeSpine = "背向";
                    this.playerScript.setSpineData(this.playerScript.changeSpine)
                }
            }
            this.player.setPosition(this.player.position.add(dis));
            if (dis.x > 0) {
                this.player.getChildByName("img").scaleX = 1;
                this.player.getChildByName("img2").scaleX = 1;

            }
            else if (dis.x < 0) {
                this.player.getChildByName("img").scaleX = -1;
                this.player.getChildByName("img2").scaleX = -1;

            }
        } //摔倒状态




    },
    //速度变化
    onChangeSpeed() {
        if (this.player.name == "Player1")
            this.maxSpeed = 4 + 0.3 * globalData.data.kitchenUp_fight[0][0];
        else
            this.maxSpeed = 4 + 0.3 * globalData.data.kitchenUp_fight[1][0];
    },
    joyCatDie() {
        this.joyStickBtn.setPosition(cc.v2(0, 0));
        this.node.active = false;
    }
});
