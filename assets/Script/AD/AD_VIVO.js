window.AD_VIVO = {

    //vivo

    vivoChaPingIdArr://原生插屏id数组
        ["a5c0cae3b2e743dea0a8c5437b2b0981", "ffac0455cfd7448899e346ae393e3a2c", "7d87faf34c874a3a91fb7f575ed5efaf"],
    vivoBannerIdArr://原生banner id数组
        ["9c99253501fb4f1cb493aad68f55c06a", "d31bef32444d4890b0f03785ff1fd153"],

    vivoChaPingNormalID: "3c59d22f4c494f8c8de110365c944d06",
    vivoBannerID: "e8ee248458724f9487527dce76d0882c",
    vivoVideoID: "e721c34c1cd74e29a3a5ee6a96359490",
    indexChaPing: 0,
    showVideo() {
        const rewardedAd = qg.createRewardedVideoAd({
            posId: AD_VIVO.vivoVideoID,
        });

        rewardedAd.onError(err => {
            console.log("激励视频广告加载失败", err);
            qg.showToast({
                message: "暂无广告"
            });
        });
        rewardedAd.onLoad(function (res) {
            console.log('激励视频广告加载完成-onload触发', JSON.stringify(res));
            rewardedAd.show().then(() => {
                console.log('激励视频广告展示完成');
                // AD_taiQiu.audioMng.stopMusic();
                cc.game.pause();
            }).catch((err) => {
                console.log('激励视频广告展示失败', JSON.stringify(err));
                qg.showToast({
                    message: "暂无广告"
                });
                switch (err.errCode) {
                    case -3:
                        console.log("激励广告加载失败---调用太频繁", JSON.stringify(err));

                        break;
                    case -4:
                        console.log("激励广告加载失败--- 一分钟内不能重复加载", JSON.stringify(err));

                        break;
                    case 30008:

                        break;
                    default:
                        // 参考 https://minigame.vivo.com.cn/documents/#/lesson/open-ability/AD_taiQiu?id=广告错误码信息 对错误码做分类处理
                        console.log("激励广告展示失败")

                        break;
                }

            })
        })
        const func = (res) => {
            cc.game.resume();
            console.log('视频广告关闭回调')
            if (res && res.isEnded) {
                console.log("正常播放结束，可以下发游戏奖励");
                AD.reward()
            }
            else {
                console.log("播放中途退出，不下发游戏奖励");
                // method1.call(caller,data[0]);
            }
            // AD_taiQiu.audioMng.playMusic();
        }
        rewardedAd.onClose(func);
    },
    canChaPing: true,
    chaPing() {
        // if(AD.wuDianRate <= 0) return;
        // if (AD.nativeVivo.resultChaPing) {
        //     console.log("插屏显示成功 ");
        //     cc.director.emit("展示插屏")
        // }
        if (AD.chanelNameNow != AD.chanelNameTarget)
            return;
        if (!AD_VIVO.canChaPing) return
        AD_VIVO.canChaPing = false;
        setTimeout(() => {
            AD_VIVO.canChaPing = true;
        }, 5000)
        AD_VIVO.indexChaPing++;

        if (qg.createCustomAd) {
            var screenHeight = qg.getSystemInfoSync().screenHeight;
            var screenWidth = qg.getSystemInfoSync().screenWidth;
            console.log("当前屏幕高度：" + screenHeight);
            const customAd = qg.createCustomAd({
                posId: AD_VIVO.vivoChaPingIdArr[AD_VIVO.indexChaPing % 3],
                style: {
                    top: (screenHeight - 630) / 2,
                    left: (screenWidth - 720) / 2,
                }
            });
            customAd.onError(err => {
                console.log("原生模板广告加载失败", err);
            });
            customAd.show().then(() => {
                AD.sound.Block.active = true;
                console.log('原生模板广告展示完成');
            }).catch((err) => {
                console.log('原生模板广告展示失败', JSON.stringify(err));
            })
            customAd.onClose(() => {
                console.log("关闭原生模板")
                AD.sound.Block.active = false;
                AD.gameJieSuan = false;
                customAd.offClose();
            })
        }
    },
    hideChaPing() {
        cc.director.emit("隐藏插屏")
    },
    showBanner() {
        // if(AD.wuDianRate <= 0) return;
        // if (AD.nativeVivo.resultChaPing) {
        //     if(AD.isBigScreen()){
        //         console.log("VIVObanner显示成功 ");
        //         cc.director.emit("展示Banner")
        //     }
        // }
        if (!AD_VIVO.bannerAd) {
            AD_VIVO.bannerAd = qg.createBannerAd({
                posId: AD_VIVO.vivoBannerID,
                adIntervals: 31
            });
            AD_VIVO.bannerAd.onError(err => {
                console.log("banner广告加载失败", err);
            });

            AD_VIVO.bannerAd.show().then(() => {
                console.log('banner广告展示完成');
            }).catch((err) => {
                console.log('banner广告展示失败', JSON.stringify(err));
            })
        }
        else {
            AD_VIVO.bannerAd.show()
        }
    },

    hideBanner() {
        if (AD_VIVO.bannerAd) {
            AD_VIVO.bannerAd.hide()
        }
    },
    boxBannerAd: null,
    showBoxBanner() {
        if (AD.chanelNameNow != AD.chanelNameTarget) return
        if (AD.chanelNameTarget != "VIVO") return
        if (qg.createBoxPortalAd) {
            AD_VIVO.boxPortalAd = qg.createBoxPortalAd({
                posId: '69ea3758645e4d34843f4c843752471d',
                image: '',
                marginTop: 200
            })
            AD_VIVO.boxPortalAd.onError(function (err) {
                console.log("盒子九宫格广告加载失败", err)
            })
            AD_VIVO.boxPortalAd.onClose(function () {
                console.log('close')
                if (AD_VIVO.boxPortalAd.isDestroyed) {
                    return
                }
                // 当九宫格关闭之后，再次展示Icon
                AD_VIVO.boxPortalAd.show()
            })
            // 广告数据加载成功后展示
            AD_VIVO.boxPortalAd.show().then(function () {
                console.log('show success')
            })
        } else {
            console.log('暂不支持互推盒子相关 API')
        }
    },
    hideBoxBanner() {
        if (AD_VIVO.boxPortalAd != null) {
            AD_VIVO.boxPortalAd.isDestroyed = true
            AD_VIVO.boxPortalAd.destroy();
            AD_VIVO.boxPortalAd = null;
        }
    },
    //创建桌面图标
    saveToDesktopVivo() {

        qg.hasShortcutInstalled({
            success: function (status) {
                if (status) {
                    console.log('已创建')
                } else {
                    console.log('未创建')
                    qg.installShortcut({
                        success: function () {
                            console.log('创建成功')
                        }
                    })
                }
            }
        })
    },
    //普通插屏 补位用
    chaPingNormal() {
        // let interstitialAd = qg.createInterstitialAd({
        //     posId: AD_VIVO.vivoChaPingNormalID,
        //     style: {}
        // });
        // let adShow = interstitialAd.show();
        // // 调用then和catch之前需要对show的结果做下判空处理，防止出错（如果没有判空，在平台版本为1052以及以下的手机上将会出现错误）
        // adShow && adShow.then(() => {
        //     console.log("插屏广告展示成功");
        // }).catch((err) => {
        //     switch (err.code) {
        //         case 30003:
        //             console.log("新用户7天内不能曝光Banner，请将手机时间调整为7天后，退出游戏重新进入")
        //             break;
        //         case 30009:
        //             console.log("10秒内调用广告次数超过1次，10秒后再调用")
        //             break;
        //         case 30002:
        //             console.log("load广告失败，重新加载广告")
        //             break;
        //         default:
        //             console.log("插屏广告展示失败")
        //             console.log(JSON.stringify(err))
        //             break;
        //     }
        // });
    },
    vibrateShort() {
        qg.vibrateShort({
            success(res) {
                console.log(`${res}`);
            },
            fail(res) {
                console.log(`vibrateShort调用失败`);
            },
        });
    },
    //大震动
    vibrateLong() {
        qg.vibrateLong({
            success(res) {
                console.log(`${res}`);
            },
            fail(res) {
                console.log(`vibrateShort调用失败`);
            },
        });
    },
}