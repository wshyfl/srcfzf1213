window.AD = {
    chanelNameNow: "android",
    chanelNameTarget: "android",//QQ UC TT VIVO OPPO BD WX HW  vivoApk oppoApk miApk mmyApk android
    chanelName: "android",
    chanelName1: "android",
    isAndroid: true,

    gameJieSuan: false,
    delayTime: 0,
    wuDianRate: 0,
    wuDianRateChaPing: 0,
    btnCloseBig: 0,
    showShareViewAuto: false,//自动弹出分享二级框?
    getOnlineSwitch: true,//UC false---是否连接服务器 获取开关
    btnShareActive: true,//分享按钮是否显示

    playerState: {
        待机: 0,
        移动: 1,
        制作: 2,
        上菜: 3,
        眩晕: 4,
        撞倒: 5,
        倒垃圾: 6,
        救火: 7,
    },
    foodCost: {
        汉堡: 0,
        可乐: 0,
        薯条: 0,
        鸡翅: 0,
        爆米花: 0,
        鸡腿: 0,
        冰淇淋: 0,
        披萨: 0,
        牛排: 0,
    },
    foodPrice: {
        汉堡: 20,
        可乐: 20,
        薯条: 22,
        鸡翅: 30,
        爆米花: 30,
        鸡腿: 30,
        冰淇淋: 30,
        披萨: 40,
        牛排: 40,
    },

    couldZDJ() {
        if (Tools.random(1, 100) < AD.wuDianRate)
            return true;
        return false;
    },
    couldZJDChaPing() {
        if (Tools.random(1, 100) < AD.wuDianRateChaPing)
            return true;
        return false;
    },
    intAD() {
        if (AD.chanelNameNow != AD.chanelNameTarget) return
        switch (AD.chanelNameTarget) {
            case "QQ":
                AD_QQ.initQQ();
                AD.btnCloseBig = false;
                AD.delayTime = 3;
                AD.isAndroid = false;
                break;
            case "WX":
                AD_WX.initWX();
                AD.btnCloseBig = false;
                AD.delayTime = 3;
                AD.isAndroid = false;
                break;
            case "UC":
                AD_UC.initUC();
                AD.btnCloseBig = false;
                AD.delayTime = 3;
                AD.getOnlineSwitch = false;
                AD.isAndroid = false;
                break;
            case "TT":
                AD_TT.initTT();
                AD.showShareViewAuto = true;//自动弹窗
                AD.btnCloseBig = false;
                AD.delayTime = 3;
                AD.isAndroid = false;
                break;
            case "OPPO":

                AD.btnCloseBig = true;
                AD.btnShareActive = false;
                AD.isAndroid = false;
                break;
            case "BD":
                AD_BD.initBD();
                AD.btnCloseBig = false;
                AD.delayTime = 3;
                AD.isAndroid = false;
                break;
            case "VIVO":
                AD.btnShareActive = false;
                AD.isAndroid = false;
                break;
            case "KS":
                kwaigame.readyGo()
                AD.isAndroid = false;
                break;
            case "HW":

                AD.btnShareActive = false;
                AD_HuaWei.getLaunchOptionsSync()
                AD.isAndroid = false;
                break;
        }
    },
    showAD(_caller, _call, ...data) {
        console.log("看视频")
        this.callN = _call;
        this.callerN = _caller;
        if (AD.chanelNameNow == AD.chanelNameTarget)
            AD.showVideo();
        else
            AD.reward();
    },

    reward() {
        AD.sound.playSfx("升级");
        this.callerN.call(this.callN);
    },
    showVideo() {
        switch (AD.chanelNameTarget) {
            case "QQ":
                AD_QQ.showVideo();
                break;
            case "WX":
                AD_WX.showVideo();
                break;
            case "UC":
                AD_UC.showVideo();
                break;
            case "TT":
                AD_TT.showVideo();
                break;
            case "OPPO":
                AD_oppo.shiPin();
                break;
            case "VIVO":
                AD_VIVO.showVideo();
                break;
            case "BD":
                AD_BD.showVideo();
                break;
            case "Kwai":
                AD_KS.showVideo();
                break;
            case "HW":
                AD_HuaWei.showVideo();
                break;
            case "vivoApk":
                AD_Apk.showVideo();
                break;
            case "oppoApk":
                AD_Apk.showVideo();
                break;
            case "233Apk":
                AD_Apk.showVideo();
                break;
            case "miApk":
                AD_Apk.showVideo();
                break;
            case "android":
                AD_android.shiPin();
                break;
        }
    },
    chaPing() {
        if (AD.chanelNameNow != AD.chanelNameTarget) return
        switch (AD.chanelNameTarget) {
            case "QQ":
                AD_QQ.chaPing();
                break;
            case "WX":
                AD_WX.chaPing();
                break;
            case "UC":
                AD_UC.chaPing();
                break;
            case "TT":
                AD_TT.chaPing();
                break;
            case "OPPO":
                AD_oppo.chaPing();
                break;
            case "VIVO":
                if (AD.wuDianRate > 0) {
                    AD_VIVO.chaPing();
                }
                else {
                    if (AD.gameJieSuan) {
                        AD_VIVO.chaPing();
                    }
                }
                break;
            case "HW":
                break;
            case "vivoApk":
                AD_Apk.chaPing();
                break;
            case "oppoApk":
                AD_Apk.chaPing();
                break;
            case "233Apk":
                AD_Apk.chaPing();
                break;
            case "miApk":
                AD_Apk.chaPing();
                break;
            case "mmyApk":
                AD_Apk.chaPing();
                break;
            case "android":
                AD_android.chaPing();
                break;
        }
    },
    hideChaPing() {
        switch (AD.chanelNameTarget) {
            case "OPPO":

                break;
            case "VIVO":
                AD_VIVO.hideChaPing();
                break;
        }
    },
    showBanner() {
        console.log("banner 展示")
        if (AD.chanelNameNow != AD.chanelNameTarget) return
        switch (AD.chanelNameTarget) {
            case "QQ":
                AD_QQ.showBanner();
                break;
            case "WX":
                AD_WX.showBanner();
                break;
            case "UC":
                AD_UC.showBanner();
                break;
            case "TT":
                if (AD.wuDianRate > 0)
                    AD_TT.showBanner();
                break;
            case "OPPO":
                AD_oppo.showBanner();
                break;
            case "VIVO":
                AD_VIVO.showBanner();
                break;
            case "BD":
                AD_BD.showBanner();
                break;
            case "HW":
                if (AD.wuDianRate > 0)
                    AD_HuaWei.showBanner();
                break;
            case "vivoApk":
                AD_Apk.showBanner();
                break;
            case "oppoApk":
                AD_Apk.showBanner();
                break;
            case "233Apk":
                AD_Apk.showBanner();
                break;
            case "miApk":
                AD_Apk.showBanner();
                break;
            case "mmyApk":
                AD_Apk.showBanner();
                break;
            case "android":
                AD_android.showBanner();
                break;
        }
    },
    hideBanner() {
        if (AD.chanelNameNow != AD.chanelNameTarget) return
        switch (AD.chanelNameTarget) {
            case "QQ":
                AD_QQ.hideBanner();
                break;
            case "WX":
                AD_WX.hideBanner();
                break;
            case "UC":
                AD_UC.hideBanner();
                break;
            case "TT":
                AD_TT.hideBanner();
                break;
            case "OPPO":
                AD_oppo.hideBanner();
                break;
            case "VIVO":
                AD_VIVO.hideBanner();
                break;
            case "BD":
                AD_BD.hideBanner();
                break;
            case "HW":
                AD_HuaWei.hideBanner();
                break;
            case "vivoApk":
                AD_Apk.hideBanner();
                break;
            case "oppoApk":
                AD_Apk.hideBanner();
                break;
            case "233Apk":
                AD_Apk.hideBanner();
                break;
            case "miApk":
                AD_Apk.hideBanner();
                break;
            case "mmyApk":
                AD_Apk.hideBanner();
                break;
            case "android":
                AD_android.hideBanner();
                break;
        }
    },
    overNum: 0,
    /**游戏结束(添加到桌面,安卓全屏视频) */
    GameOver() {
        AD.gameJieSuan = true;
        if (AD.chanelNameNow != AD.chanelNameTarget) return;
        AD.overNum++
        switch (AD.chanelNameTarget) {
            case "QQ":
                if (this.overNum % 5 == 0)
                    AD_QQ.saveToDesktopQQ();
                if (this.overNum % 3 == 0) {
                    if (AD.wuDianRate > 0)
                        AD.showAD(null, null);
                }
                break;
            case "UC":
                break;
            case "BD":
                if (AD.wuDianRate <= 0) return
                if (AD.overNum % 2 == 0) {
                    AD.showAD("")
                }
                break;
            case "OPPO":
                // if (this.overNum % 5 == 0)
                //     AD_oppo.addDesktop();
                break;
            case "VIVO":
                if (AD.wuDianRate == 0) return
                if (this.overNum % 5 == 0)
                    AD_VIVO.saveToDesktopVivo();
                break;
            case "HW":
                if (globalData.data.canSaveDesk) {
                    globalData.data.canSaveDesk = false
                    AD_HuaWei.addDesktop();
                }
                if (this.overNum % 2 == 0)
                    AD_HuaWei.chaPingVideo();
                break;
            case "vivoApk":
                AD_Apk.chaPingVideo();
                break;
            case "oppoApk":
                AD_Apk.chaPingVideo();
                break;
            case "233Apk":
                AD_Apk.chaPingVideo();
                break;
            case "miApk":
                AD_Apk.chaPingVideo();
                break;
            case "mmyApk":
                AD_Apk.chaPingVideo();
                break;
        }
    },
    share() {
        switch (AD.chanelNameTarget) {
            case "QQ":
                AD_QQ.share("");
                break;
            case "WX":
                AD_WX.shareAndCallback("");
                break;
            case "UC":
                AD_UC.share();
                break;
            case "TT":
                AD_TT.share();
                break;
            case "BD":
                AD_BD.share();
                break;
        }
    },
    luPingBegin() {
        switch (AD.chanelNameTarget) {
            case "TT":
                AD_TT.luPingStart();
                break;
            case "Kwai":
                AD_KS.luPingBegin();
                break;
        }
    },
    lupingOver() {//头条录屏结束
        switch (AD.chanelNameTarget) {
            case "TT":
                AD_TT.luPingEnd();
                break;
            case "Kwai":
                AD_KS.lupingOver();
                break;
        }
    },
    luPingShare() {
        switch (AD.chanelNameTarget) {
            case "Kwai":
                AD_KS.luPingShare();
                break;
            case "TT":
                console.log("调用头条录屏分享")
                AD_TT.luPingShare();
                break;
        }

    },
    //是否是长屏手机
    isBigScreen() {
        console.log("是长屏吗  " + (cc.winSize.width / cc.winSize.height))
        if (AD.height / AD.width > 1.8) {
            return true;
        }
        return false;
    },
    stopAudioAll() {
        cc.audioEngine.pauseMusic()

    },
    playAudioAll() {
        cc.audioEngine.resumeMusic()
    },
    vibrateLong() {
        if (AD.chanelNameNow != AD.chanelNameTarget) return
        switch (AD.chanelNameTarget) {
            case "VIVO":
                qg.vibrateLong({
                    success(res) {
                        console.log(res);
                    },
                    fail(res) {
                        console.log(`vibrateLong调用失败`);
                    },
                });
                break;
            case "TT":
                console.log("调用头条录屏分享")
                AD_TT.vibrateLong();
                break;
        }

    },
    vibrateShort() {
        if (AD.chanelNameNow != AD.chanelNameTarget) return
        switch (AD.chanelNameTarget) {
            case "VIVO":
                qg.vibrateShort({
                    success(res) {
                        console.log(res);
                    },
                    fail(res) {
                        console.log(`vibrateShort调用失败`);
                    },
                });
                break;
            case "TT":
                console.log("调用头条录屏分享")
                AD_TT.vibrateShort();
                break;
        }

    },
}
