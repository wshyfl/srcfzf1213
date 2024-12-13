window.AD_OPPO1 = {
    //oppo
    bannerAd:null,
    videoAd_Revive: null,
    oppoBannerID: "516799",//没用
    oppoChaPingID1: "484148",
    oppoChaPingID2: "484149",
    oppoChaPingID3: "484150",
    oppoVideoID: "484152",
    secondOnlineOppo: 0,
    
    winHeight:0,
    winWidth:0,

    showVideo() {
        if (AD_OPPO.videoAd_Revive != null)
            AD_OPPO.videoAd_Revive.destroy();
        //复活视频 初始化
        AD_OPPO.videoAd_Revive = qg.createRewardedVideoAd({
            adUnitId: AD_OPPO.oppoVideoID
        })
        AD_OPPO.videoAd_Revive.load()

        AD_OPPO.videoAd_Revive.onLoad(function () {
            console.log("复活 激励视频加载成功");
            AD_OPPO.videoAd_Revive.show();
            AD_OPPO.videoAd_Revive.offLoad();

        })


        AD_OPPO.videoAd_Revive.onVideoStart(function () {
            AD_OPPO.videoAd_Revive.offVideoStart()
            console.log("激励视频 开始播放");
        })


        AD_OPPO.videoAd_Revive.onError((err) => {
            AD_OPPO.videoAd_Revive.offError()
            qg.showToast({
                //message: '暂无广告，请稍后重试',
                title: '暂无广告，请稍后重试',
                duration: 2000
            })
            console.log('激励视频 加载错误:  ' + JSON.stringify(err))
        })


        AD_OPPO.videoAd_Revive.onClose((res) => {
            if (res.isEnded) {
                console.log('复活 激励视频广告完成，发放奖励')
                AD.reward();
                AD_OPPO.videoAd_Revive.offClose();
            } else {
                AD_OPPO.videoAd_Revive.offClose();

                
                console.log('激励视频广告取消关闭，不发放奖励')
            }
        })
    },

    saveToDesktopOppo() {
        qg.hasShortcutInstalled({
            success: function (res) {
                // 判断图标未存在时，创建图标
                if (res == false) {
                    qg.installShortcut({
                        success: function () {
                            // 执行用户创建图标奖励
                        },
                        fail: function (err) { },
                        complete: function () { }
                    })
                }
            },
            fail: function (err) { },
            complete: function () {
                // AD.rootNode.gameSecond = 0;
            }
        })
    },
    //上报数据
    initOppo() {
        var PlatformVersion = null
        console.log("进入数据上报")
        if (AD.chanelNameNow == AD.chanelNameTarget) {
            console.log("进入数据上报2")
            qg.getSystemInfo({
                success: function (res) {
                    console.log("获取成功")
                    PlatformVersion = res.platformVersion
                },
                fail: function (err) {
                    console.log("获取失败")
                },
                complete: function (res) {
                    console.log("调用结束")
                    if (PlatformVersion >= 1060) {
                        qg.reportMonitor('game_scene', 0)
                        console.log("提交成功")

                    }
                }
            })

        }
        AD_OPPO.winHeight=qg.getSystemInfoSync().screenHeight
        AD_OPPO.winWidth=qg.getSystemInfoSync().screenWidth
        
    },
    chaPing(){
        console.log("调用插屏")
        if(AD.wuDianRate <= 0) return;
        console.log("调用插屏后")
        cc.director.emit("显示插屏")
    },
    hideChaPing(){
        // AD.rootNode.chaPingOppo.scale = 0;
    },
    showBanner() {
        if (AD_OPPO.bannerAd != null) {
            AD_OPPO.bannerAd.show()
        }
        else{
            AD_OPPO.bannerAd = qg.createBannerAd({
                adUnitId: AD_OPPO.oppoBannerID,
                style: {
                    top: 300,
                    left: 0,
                    width: 700,
                    height: 300
                }
            })
            AD_OPPO.bannerAd.show()
        }
        
        console.log("进入banner")
    },

    hideBanner() {
        if (AD_OPPO.bannerAd != null) {
            AD_OPPO.bannerAd.hide()
        }
    },
    vibrateShort(){
    
        qg.vibrateShort({
            success(res) {
              
            },
            fail(res) {
              
            },
        });
    },
    vibrateLong(){
        
        qg.vibrateLong({
            success(res) {
              
            },
            fail(res) {
              
            },
        });
    }
}