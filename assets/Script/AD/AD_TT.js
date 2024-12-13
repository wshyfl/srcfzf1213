window.AD_TT = {


    appName: "双人厨房做饭",
    bannerID_TT: 'edep45j17j67hgj5pv',//OK
    videoID_TT: '4c229ha30fh8mmi9j9',//OK
    chaPing_TT: "6hhaac5cc3f07dfafp",
    shareID_TT: "10g29jr2ju9akq1hm4",
    hadLogin: false,
    resVideoPathTouTiao: null,

    shareTitle_TT: "双人同屏厨房做饭",
    shareDESC_TT: "双人同屏厨房做饭",

    bannerIsLoaded: false,

    initTT() {
        AD_TT.isToutiao = tt.getSystemInfoSync().appName === "Toutiao";
        AD_TT.isIOS = tt.getSystemInfoSync().platform === "ios"
        AD_TT.isPPX = tt.getSystemInfoSync().appName === "PPX";
        // AD_TT.login()
    },

    showVideo() {
        if (AD.chanelNameNow != AD.chanelNameTarget) return;
        let video_retry_times = 0;
        let videoAd = tt.createRewardedVideoAd({
            adUnitId: AD_TT.videoID_TT,
        });
        videoAd.load()
            .then(() => {
                videoAd.show();
                cc.director.pause();//暂停creator
            })
            .catch(err => {
                console.log(err.errMsg);
            });
        let loadCallback = () => {
            console.log("sdk videoAd start ........")
        };
        let errorCallback = (res) => {
            console.log(JSON.stringify(res));
            if (video_retry_times >= 0 && video_retry_times < 1) {
                videoAd.load()
                    .then(() => {
                        videoAd.show()
                    })
                    .catch(err => {
                        console.log(err.errMsg)
                    });
                video_retry_times++;
            } else if (video_retry_times >= 1) {
                videoAd.offLoad(loadCallback);
                videoAd.offClose(closeCallback);
                videoAd.offError(errorCallback);

                console.log("miaoju_watch_retry_times" + video_retry_times);
                video_retry_times = -1;
            }
        };
        let closeCallback = (res) => {
            console.log(res);
            if (res.isEnded) {
                //发道具 
                AD.reward();

            } else {
                // AD.closeVideoHalfway();//视频中途关闭
            }
            cc.director.resume();//
            videoAd.offLoad(loadCallback);
            videoAd.offClose(closeCallback);
            videoAd.offError(errorCallback);
            // callBack = null;
        };
        videoAd.onLoad(loadCallback);
        videoAd.onError(errorCallback);
        videoAd.onClose(closeCallback);
    },
    chaPing() {
        if (AD.chanelNameNow != AD.chanelNameTarget) return;
        // if (AD_TT.isPPX) return

        // 插屏广告仅今日头条安卓客户端支持
        if (!AD_TT.isIOS) {
            const interstitialAd = tt.createInterstitialAd({
                adUnitId: AD_TT.chaPing_TT
            });
            interstitialAd
                .load()
                .then(() => {
                    interstitialAd.show();
                })
                .catch(err => {
                    console.log("头条插屏错误   " + err);
                });

            interstitialAd.onClose(function () {
                interstitialAd.destroy();
                console.log("头条插屏关闭  后销毁 ");

            });

        }
    },
    initBanner() {
        const {
            screenHeight,
            screenWidth,
        } = tt.getSystemInfoSync();

        AD_TT.TTBanner = tt.createBannerAd({
            adUnitId: AD_TT.bannerID_TT,
            adIntervals: 31,
            style: {
                top: screenHeight - (screenWidth * 0.8 * (88 / 208)) + 0, //根据系统约定尺寸计算出广告高度 1440 - (700 / 16 * 9)
                left: (screenWidth - screenWidth * 0.8) / 2,
                width: screenWidth * 0.3,
            },
        });

        AD_TT.TTBanner.onResize(size => {
            console.log("改变size");
            if (AD_TT.TTBanner.style.left < ((screenWidth - size.width) / 2)) {
                AD_TT.TTBanner.style.left = ((screenWidth - size.width) / 2);
            }
            AD_TT.TTBanner.style.top = screenHeight - size.height;
        });


        AD_TT.TTBanner.onLoad(function () {
            AD_TT.TTBanner.show()
                .then(() => {
                    console.log('广告显示成功');
                })
                .catch(err => {
                    console.log('banner load错误 : ', err);
                })
        });

        let errCallBack = (res) => {
            console.log(res);
        };
        AD_TT.TTBanner.onError(errCallBack);

    },
    showBanner() {
        if (AD.chanelNameNow != AD.chanelNameTarget) return;

        if (AD_TT.TTBanner) {
            AD_TT.TTBanner.show()
                .then(() => {
                    console.log('banner 广告显示成功');
                })
                .catch(err => {
                    console.log('banner 广告组件出现问题', err);
                })
        }
        else {
            AD_TT.initBanner();
        }
    },
    hideBanner() {
        if (AD.chanelNameNow != AD.chanelNameTarget) return;
        // if(AD_TT.TTBanner){
        //     if (AD_TT.isToutiao) {
        //         console.log("banner 销毁")
        //         AD_TT.TTBanner.destroy();
        //         AD_TT.TTBanner = null;
        //         AD_TT.bannerIsLoaded = false;
        //         // AD_TT.initBanner();
        //     }
        //     else
        // }
        if (AD_TT.TTBanner) {
            AD_TT.TTBanner.destroy();
            AD_TT.TTBanner = null;
        }

    },
    login() {
        tt.login({
            force: false,
            success() {
                console.log("登录成功");
                tt.getUserInfo({
                    // withCredentials: true,
                    withRealNameAuthenticationInfo: true,
                    success(res) {
                        console.log(`getUserInfo 调用成功`, res.userInfo);
                    },
                    fail(res) {
                        console.log(`getUserInfo 调用失败`, res.errMsg);
                    },
                });
                AD_TT.realNameAuth();
            },
        });

    },
    realNameAuth() {
        tt.authenticateRealName({
            success(_res) {
                console.log("用户实名认证成功");
            },
            fail(res) {
                console.log("用户实名认证失败", res.errMsg);
            },
        });
    },
    luPingOver:false,
    luPingStart() {
        if (AD.chanelNameNow != AD.chanelNameTarget) return;
        this.luPingOver = false
        console.log("luping  開始")
        AD_TT.resVideoPathTouTiao = null;
        let recorder = tt.getGameRecorderManager();
        tt.onShow((res) => {
            recorder.resume();
        });
        tt.onHide(() => {
            recorder.pause();
        })

        recorder.onStart(res => {
            console.log('录屏开始');
        });

        recorder.start({ duration: 300, })
       
    },
    luPingEnd() {
        if (AD.chanelNameNow != AD.chanelNameTarget) return;
        if(this.luPingOver) return
        this.luPingOver = true
        let recorder = tt.getGameRecorderManager();
        tt.offShow(() => {
        });
        tt.offHide(() => {
        });

        recorder.onStop(res => {
            AD_TT.resVideoPathTouTiao = res.videoPath;
            console.log('录屏结束：' + res.videoPath);


        });

        recorder.stop()
        recorder.onError((errMsg)=>{
            console.log("录屏失败:"+errMsg);
        })
    },
    luPingShare() {
        console.log("调用头条录屏分享")
        if (AD.chanelNameNow != AD.chanelNameTarget) return;
        console.log('录屏分享：' + AD_TT.resVideoPathTouTiao);
        tt.shareAppMessage({
            channel: 'video',
            query: "",
            templateId: AD_TT.shareID_TT, // 替换成通过审核的分享ID
            title: AD_TT.shareTitle_TT,
            desc: AD_TT.shareDESC_TT,


            extra: {
                videoPath: AD_TT.resVideoPathTouTiao, // 可用录屏得到的视频地址
                videoTopics: [AD_TT.appName, "抖音小游戏"],
                hashtag_list: [AD_TT.appName, AD_TT.shareDESC_TT, "抖音小游戏"],
                video_title: AD_TT.shareDESC_TT,
                withVideoId: true,
            },
            success(res) {
                console.log("分享视频成功");
                AD.Game.shareView.active = false;

            },
            fail(e) {
                if (e.errMsg && e.errMsg != "shareAppMessage:cancel") {
                    tt.showToast({
                        title: "录屏失败：录屏时长低于 3 秒",
                        icon: "none",
                        duration: 1500,
                        success(res) {
                            console.log(`${res}`);
                        },
                        fail(res) {
                            console.log(`showToast调用失败`);
                        },
                    });
                    AD_TouTiao.resVideoPathTouTiao = null;
                }
                else if (e.errNo) {
                    tt.showToast({
                        title: "录屏失败：录屏时长低于 3 秒",
                        icon: "none",
                        duration: 1500,
                        success(res) {
                            console.log(`${res}`);
                        },
                        fail(res) {
                            console.log(`showToast调用失败`);
                        },
                    });
                    AD_TouTiao.resVideoPathTouTiao = null;
                }


            }
        })
    },
    /**添加到小程序 */
    showFavoriteGuide() {
        if (AD.chanelNameNow != AD.chanelNameTarget)
            return
        switch (AD.chanelNameTarget) {
            case "TT":
                tt.showFavoriteGuide({
                    type: "bar",
                    content: "一键添加到我的小程序",
                    position: "bottom",
                    success(res) {
                        console.log("引导组件展示成功");
                    },
                    fail(res) {
                        console.log("引导组件展示失败");
                    },
                });
        }
    },
    share() {
        console.log("调用头条普通分享")
        if (AD.chanelNameNow != AD.chanelNameTarget) return;
        console.log('录屏分享：' + AD_TT.resVideoPathTouTiao);
        tt.shareAppMessage({
            channel: '',
            query: "",
            templateId: AD_TT.shareID_TT, // 替换成通过审核的分享ID
            title: AD_TT.shareTitle_TT,
            desc: AD_TT.shareDESC_TT,

            success() {

            },
            fail(e) {
                console.log(e);
                console.log('分享视频失败');
            }
        })

    },
    vibrateShort() {
        tt.vibrateShort({
            success(res) {
                console.log(`${res}`);
            },
            fail(res) {
                console.log(`vibrateShort调用失败`);
            },
        });
    },
    vibrateLong() {
        tt.vibrateLong({
            success(res) {
                console.log(`${res}`);
            },
            fail(res) {
                console.log(`vibrateShort调用失败`);
            },
        });
    },

}