

cc.Class({
    extends: cc.Component,

    properties: {

        panel1: cc.Node,
        panelYinSi: cc.Node,
        panelXieYi: cc.Node,
    },

    // onLoAD () {},
    onEnable() {

        this.resetDialog(this.node, true);


        this.panel1.active = true;
        this.panelYinSi.active = false;
        this.panelXieYi.active = false;



    },

    btnCallBack(event, type) {
        switch (type) {
            case "同意":
                this.resetDialog(this.node, false);
                if (window.showYinSi) {

                }
                else {
                    cc.sys.localStorage.setItem(window.key_yinSi, 1);
                    this.node.parent.getComponent("yinSiPanel").checkPermission(); //android 申请权限
                }
                break;
            case "不同意":
                cc.game.end();
                if (AD.chanelName == "vivo")
                    qg.exitApplication()
                else if (AD.chanelName == "oppo") {
                    qg.exitApplication({
                        success: function () { },
                        fail: function (err) { },
                        complete: function () { }
                    })
                }
                else if (AD.chanelName == "QQ") {
                    qq.exitMiniProgram({});
                }
                break;
            case "关闭1":
                this.resetDialog(this.node, false);
                break;
            case "关闭隐私":
                this.panelYinSi.active = false;
                this.panel1.active = true;
                break;
            case "关闭用户协议":
                this.panelXieYi.active = false;
                this.panel1.active = true;
                break;
            case "隐私政策":
                this.panel1.active = false;
                this.panelYinSi.active = true;
                break;
            case "用户协议":
                this.panel1.active = false;
                this.panelXieYi.active = true;
                break;
        }
    },


    resetDialog(_dialog, _show) {
        var _zheZhao = _dialog.getChildByName("zheZhao");
        var _bg = _dialog.getChildByName("bg");
        if (_show) {
            _dialog.active = true;
            _zheZhao.opacity = 0;
            _bg.scale = 0;

            cc.tween(_zheZhao)
                .to(0.2, { opacity: 180 })
                .start();

            cc.tween(_bg)
                .to(0.2, { scale: 1 })
                .start();

        }
        else {
            cc.tween(_zheZhao)
                .to(0.2, { opacity: 0 })
                .start();

            cc.tween(_bg)
                .to(0.2, { scale: 0 })
                .call(() => {
                    _dialog.active = false;
                })
                .start();
        }
    },
    resetDialog2(_dialog, _show) {
        var _zheZhao = _dialog.getChildByName("zheZhao");
        var _bg = _dialog.getChildByName("bg");
        if (_show) {
            _dialog.active = true;
            _zheZhao.opacity = 0;
            _bg.scale = 0;

            cc.tween(_zheZhao)
                .to(0.2, { opacity: 180 })
                .start();

            cc.tween(_bg)
                .to(0.2, { scale: 1 })
                .start();

        }
        else {
            cc.tween(_zheZhao)
                .to(0.2, { opacity: 0 })
                .start();

            cc.tween(_bg)
                .to(0.2, { scale: 0 })
                .call(() => {
                    _dialog.destroy();
                })
                .start();
        }
    },
    // update (dt) {},
});
