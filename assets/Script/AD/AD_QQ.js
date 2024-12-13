window.AD_QQ = {


  //QQ
  shareCount: 1,//分享次数

  TTBanner: null,
  QQgameBox: null,

  hadShowQQSaveToDesk: false,
  AD_QQ_Video: "3e02ba7e6f049d9ae92fee04f11b4c3e",//视频-1
  AD_QQ_Block: "575423a8ecbeaf5f5de1a0303d79a603",//积木-1
  AD_QQ_AppBox: "3fae1ce4d8246292bad54cd8f12e386d",//盒子-1
  AD_QQ_Banner: "e8b7f49a363257b7733a2656ef865484",//banner-1
  AD_QQ_ChaPingNormal:"7d413952fb0392c04fb9fdb6ecebaae8",

  shareDESC_TT: "让我们一起来做饭吧~",
  imgUrl: 'https://tianyitop.com/gameres/image/shuangRenChuFangZuoFan.jpg',




  showVideo() {


    console.log("视频展示 ");
    if (AD.chanelNameNow != AD.chanelNameTarget) return;

    var RewardedVideoAd = qq.createRewardedVideoAd({
      adUnitId: AD_QQ.AD_QQ_Video,
    })
    RewardedVideoAd.load()
      .then(() => RewardedVideoAd.show())
      .catch(err => console.log(err))

    var closeFunc = (res) => {

      if (res.isEnded) {
        console.log('激励视频完整播放后关闭')
        AD.reward();

        RewardedVideoAd.offClose(closeFunc)
      }
    }

    RewardedVideoAd.onClose(closeFunc)
    var errFunc = (res) => {
      console.log(' res.errMsg  ' + res.errMsg + " res.errCode " + res.errCode);
    }
    RewardedVideoAd.onError(errFunc)

  },
  chaPing() {

    console.log("显示插屏");
    if (AD.chanelNameNow != AD.chanelNameTarget) return;
    if (AD.wuDianRate > 0)
      AD_QQ.gameBoxQQ();

  },
  //盒子广告
  gameBoxQQ() {
    if (AD.chanelNameNow != AD.chanelNameTarget)
      return;
    console.log("调用盒子广告")
    if (AD_QQ.QQgameBox == null) {
      AD_QQ.QQgameBox = qq.createAppBox({ adUnitId: AD_QQ.AD_QQ_AppBox });
      AD_QQ.QQgameBox.load()
        .then(() => AD.QQgameBox.show(), console.log("盒子广告加载成功"))
        .catch(
          err => {
            console.log("盒子广告加载错误 " + err)
          }
        )
    }
    else if (AD_QQ.QQgameBox != null) {
      AD_QQ.QQgameBox.show()
    }
  },
  chaPingNormal() {
    var InterstitialAd = qq.createInterstitialAd({
      adUnitId: AD_QQ.AD_QQ_ChaPingNormal
    });
    InterstitialAd.load()
    InterstitialAd.onLoad(() => {
      InterstitialAd.show();
    });
    InterstitialAd.onClose(() => {
      InterstitialAd.offClose(() => { });
      InterstitialAd.offLoad(() => { });
      InterstitialAd.offError(() => { });
      InterstitialAd.destroy();
    });
    InterstitialAd.onError((res) => {
      console.log("插屏错误 " + res.errMsg + " res.errCode " + res.errCode)
      
      InterstitialAd.offClose(() => { });
      InterstitialAd.offLoad(() => { });
      InterstitialAd.offError(() => { });
      InterstitialAd.destroy();
    })
  },
  initBanner() {
    if (AD.chanelNameNow != AD.chanelNameTarget)
      return;
    if (AD_QQ.TTBanner != null)
      AD_QQ.TTBanner.destroy();

    console.log("banner init");
    this.infoScreed = qq.getSystemInfoSync();

    var screenHeight = this.infoScreed.screenHeight;
    var screenWidth = this.infoScreed.screenWidth;


    AD_QQ.TTBanner = qq.createBannerAd({
      adUnitId: AD_QQ.AD_QQ_Banner,

      style: {
        top: screenHeight - (screenWidth * 0.6 * (88 / 208)) + 120, //根据系统约定尺寸计算出广告高度 1440 - (700 / 16 * 9)
        left: (screenWidth - screenWidth * 0.6) / 2,
        width: 300,
      },
      testDemoType: "65"
    });

    AD_QQ.TTBanner.onResize(size => {
      console.log("改变size");
      console.log("改变size");
      AD_QQ.TTBanner.style.left = ((screenWidth - size.width) / 2);
      AD_QQ.TTBanner.style.top = screenHeight - size.height;
      AD_QQ.TTBanner.style.width = 300
    });

    var loadFunc = function () {
      console.log("banner加载成功");
      AD_QQ.TTBanner.show();
    };
    AD_QQ.TTBanner.onLoad(loadFunc);


    AD_QQ.TTBanner.onError(
      function (res) {
        console.log("res.errMsg " + res.errMsg + " res.errCode " + res.errCode)
      }
    );
  },
  showBanner() {
    console.log("banner 调用");
    if (AD.chanelNameNow != AD.chanelNameTarget)
      return;
    // if (AD.TTBanner) {
    //   console.log("banner已存在  展示");
    //   AD.TTBanner.show();
    //   AD.bannerIsShowing = true;
    // }
    // else 
    {

    }

    AD_QQ.initBanner();
  },
  hideBanner() {
    if (AD.chanelNameNow != AD.chanelNameTarget) return
    if (AD_QQ.TTBanner != null)
      AD_QQ.TTBanner.destroy();
  },
  shareOver(num, adType) {//分享结束

    console.log(" =====shareOver")
    var _times = 0;
    if (AD_QQ.shareCount == 1)
      _times = 0;
    else if (AD.shareCount == 2 || AD.shareCount == 3)
      _times = 1;
    else if (AD.shareCount == 4 || AD.shareCount == 5)
      _times = 2;
    else if (AD.shareCount == 6 || AD.shareCount == 7)
      _times = 3;
    else if (AD.shareCount == 8 || AD.shareCount == 9)
      _times = 4;
    else if (AD.shareCount == 10 || AD.shareCount == 11)
      _times = 5;
    else
      _times = 6;

    if (num > (3000 + _times * 500)) {//分享成功 
      AD.shareCount++;
      console.log("============分享解锁")
      GlobalData.saveDiamondNum(20);

      //*********这里填写分享成功给与的奖励
    }
    else //分享失败
    {
      AD_QQ.shareLose(adType);
    }
  },
  shareLose(adType) {//分享失败
    // AD_QQ.rootNode.createTips("分享失败,请稍后重试!");
    qq.showToast({
      title: '分享失败,请稍后重试!',
      icon: 'none',
      duration: 2000
    })
  },
  share(adType) {
    let startShare = false;
    let startCountTime = false;
    let endTime = 0;
    let shareTime = 1;
    // let shareTime = _getShareTime();
    let startTime = Tools.getDate("millisecond");

    qq.offShow();
    qq.offHide();
    qq.onShow((res) => {
      console.log("显示:" + JSON.stringify(res) + startShare + startCountTime);

      if (startShare && startCountTime) {
        endTime = Tools.getDate("millisecond");
        let timee = endTime - startTime;
        console.log(timee + "...花费时间");
        

      }
      else if (startShare) {
        console.log("分享失败2");
        //AD.shareLose(adType);
      }
      else {
        //gameData.audioManager.playMusic();
      }
    });
    qq.onHide(() => {
      console.log("隐藏" + startShare + startCountTime);
      if (startShare && !startCountTime) {
        console.log("开始计时");
        startCountTime = true;
        endTime = 0;

      }
    });
    startShare = true;
    // qq.showShareMenu({
    //     showShareItems: ['qq', 'qzone', 'wechatFriends', 'wechatMoment']
    // })

    qq.shareAppMessage({
      title: AD_QQ.shareDESC_TT,
      imageUrl: AD_QQ.imgUrl,// 图片 URL,
    })
  },
  //积木
  blockADQQInit() {
    if (AD.chanelNameNow != AD.chanelNameTarget) return

    console.log("调用积木")
    const {
      screenHeight,
      screenWidth,
    } = qq.getSystemInfoSync();
    console.log("屏幕高度：" + screenHeight);
    console.log("屏幕宽度：" + screenWidth);
    AD_QQ.blockAd = qq.createBlockAd({
      adUnitId: AD_QQ.AD_QQ_Block,
      style: {
        top: screenHeight / 4 - 50, //根据系统约定尺寸计算出广告高度 1440 - (700 / 16 * 9)
        left: screenWidth / 2,
      },
    });
    AD_QQ.blockAd.onLoad((res) => {
      AD_QQ.blockAd.show();
      console.log("QQ游戏积木广告获取成功");
    })
    AD_QQ.blockAd.onError((err) => {
      console.log("QQ游戏积木广告获取失败");
      console.log(err);
      console.log("QQ游戏积木广告获取失败");
    })
    AD_QQ.blockAd.onResize(size => {
      console.log("改变size");

      AD_QQ.blockAd.style.left = ((screenWidth - size.width));
    });
  },
  blockResetSize() {
  },
  blockADQQShow() {
    if (AD.chanelNameNow != AD.chanelNameTarget) return
    AD_QQ.blockADQQInit();
  },
  blockADQQHide() {
    if (AD.chanelNameNow != AD.chanelNameTarget) return
    if (AD_QQ.blockAd)
      AD_QQ.blockAd.destroy();
  },

  //QQ--添加到桌面
  saveToDesktopQQ() {
    if (AD.chanelNameNow != AD.chanelNameTarget) return
    if (!AD_QQ.hadShowQQSaveToDesk) {
      AD_QQ.hadShowQQSaveToDesk = true;

      if (!AD_QQ.isIOS) {
        qq.saveAppToDesktop({
          success() {
            console.log("添加成功")
          },
          fail() {
            console.log("添加失败")
          },
          complete() {
            console.log("添加完成")
            AD_QQ.colorSignQQ();
          },
        });
      }
      else {
        AD_QQ.colorSignQQ();
      }

    }
  },
  //彩签
  colorSignQQ() {
    if (AD.chanelNameNow != AD.chanelNameTarget) return
    qq.addColorSign({
      success() {
        console.log("彩签 添加成功")
      },
      fail() {
        console.log("彩签 添加失败")
      },
      complete() {
        console.log("彩签 添加完成")
      },
    });
  },

  initQQ() {
    if (AD.chanelNameNow != AD.chanelNameTarget) return
    qq.showShareMenu({
      showShareItems: ['qq', 'qzone', 'wechatFriends', 'wechatMoment']
    })
    qq.onShareAppMessage(() => ({
      title: AD_QQ.shareDESC_TT,
      imageUrl: AD_QQ.imgUrl,// 图片 URL,
    }))
    qq.getSystemInfo({
      success(res) {
        console.log("QQ系统信息  " + res.system)
        console.log("是IOS吗" + res.system.indexOf("iOS") != -1); // true
        AD_QQ.isIOS = (res.system.indexOf("iOS") != -1)
      }
    })
  },
  luPingBegin() { },
  luPingEnd() { },

  //获取对应videoId的小视频  参数依次为：小视频的videoID；封面贴图；点赞数
  getShareRes(_videoId, _sprite, _dianZanNumLabel) { },
  changeImgUrl(_url, _sprite) {

  },
  //跳转至对应videoId的小视频
  goToVideo() {
  },

  //小震动
  shakeSmall() {
  },
  //大震动
  shakeBig() {
  },



  showTuBiao() { },
  /**获取开放数据域*/
  openDataContext: null,

  /**初次登入游戏 */
  login() {
  },
  getUserInfo() {
  },

  setRoleInfo() {


  },
  /**授权 */
  userMandate() {
  },


  /**********************************排行榜相关************************************** */
  rankingOperation(_name, ...data) {
  },

  rankingOperationRenQi(_name, ...data) {
  },
  /**********************************排行榜相关************************************** */
  vibrateShort() {

    qq.vibrateShort({
      success(res) {

      },
      fail(res) {

      },
    });
  },
  vibrateLong() {

    qq.vibrateLong({
      success(res) {

      },
      fail(res) {

      },
    });
  }

}