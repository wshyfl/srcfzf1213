
cc.Class({
    extends: cc.Component,

    properties: {
        title: cc.Label,
        desc: cc.Label,
        iconY: cc.Node,
        logo: cc.Sprite,

    },
    onLoad() {

        this.node.active=false;
        // cc.game.addPersistRootNode(this.node);
        // this.node.x = cc.winSize.width/2;
        // this.node.y = cc.winSize.height/2

        // this.result = null;
        // this.nativeAd = null;
        // this.node.scale = 0;
       
        // var self = this;
        // cc.director.on("oppo数据加载成功",  ()=> {
        //     if(this.node.scale == 1){
        //         console.log("数据加载成功*****并且上报数据");
        //         this.showChaping();//更新广告显示内容
        //     }

        // }, this);
      
        
        // cc.director.on("显示插屏",  ()=> {
        //     console.log("插屏显示成功 ");
        //     this.node.scale = 1;
        //     this.showChaping();//更新广告显示内容
        // }, this);
        // if(this.node.name == "IconOppo"){
        //     if(AD.wuDianRate>0){
        //         this.node.scale = 1;
        //         this.showChaping();//更新广告显示内容
        //     }
        // }
       
    },
    onDestroy() {

    },
    start() {
        // this.load()
    },


    onEnable() {
        // this.showChaping();
    },
    showChaping() {
        this.result = AD.chaPingOppo.result;
        this.reportAdShow();
        console.log("展示数据1")
        if (this.result != null) {
            if(this.node.name == "IconOppo"){
                this.node.scale = 1;
            }
            console.log("展示数据2")
            console.log("原生父节点" + this.node.parent.name);
            this.title.string = this.result.title
            this.desc.string = this.result.desc

            //显示icon
            var remoteUrl = this.result.icon;
            var sprite = this.iconY.getComponent(cc.Sprite);
            if (remoteUrl != "") {
                cc.loader.load(remoteUrl, (err, texture) => {
                    if (err) {
                        // console.log("原生插屏 icon加载错误  " + err);
                        return
                    }
                    var spriteFrame = new cc.SpriteFrame(texture);
                    sprite.spriteFrame = spriteFrame;
                });
            }
            else {
                // console.log("原生插屏 icon地址为null  ");
            }

            //显示logo
            var imgUrl = this.result.imgUrlList[0];
            var imgspr = this.logo;

            // var urlString = imgUrl.split("?");
            // console.log(urlString)
            // cc.loader.load(urlString[0], (err, texture1) => {
            //     if (err) {
            //         console.log(err);
            //         return
            //     }
            //     var spriteFramelogo = new cc.SpriteFrame(texture1);
            //     imgspr.spriteFrame = spriteFramelogo;
            // })
            {
                var pngStr = ".png";
                var pngBoo = imgUrl.indexOf(pngStr) >= 0;
                var jpgStr = ".jpg";
                var jpbBoo = imgUrl.indexOf(jpgStr) >= 0;
                if (pngBoo || jpbBoo) {
                    var urlString = imgUrl.split("?");
                    cc.assetManager.loadRemote(urlString[0], function (err, texture) {
                        if (err) {
                            console.log(err);
                            return
                        }
                        var spriteFramelogo = new cc.SpriteFrame(texture);
                        imgspr.spriteFrame = spriteFramelogo;
                    });
                }
                else {
                    cc.assetManager.loadRemote(imgUrl, { ext: '.png' }, function (err, texture) {
                        if (err) {
                            console.log(err);
                            // return
                        } else {
                            var spriteFramelogo = new cc.SpriteFrame(texture);
                            imgspr.spriteFrame = spriteFramelogo;
                        }
                    });
                }
            }

        }
        else {
            console.log("数据为空 ")
            this.node.scale = 0;
        }
    },
    reportAdClick() {

        var self = this
        AD.chaPingTime = 0;
        self.nativeAd = AD.chaPingOppo.nativeAd
        if (self.result != null) {
            self.nativeAd.reportAdClick({
                adId: self.result.adId.toString()
            });
        }
    },
    reportAdShow() {
        if (!AD.chaPingOppo.couldReport) {
            console.log("********数据已经上报过了 不再上报");
            return;
        }

        if (this.node.scale <= 0) return;
        var self = this
        self.nativeAd = AD.chaPingOppo.nativeAd
        if (self.result != null) {
            AD.chaPingOppo.couldReport = false;
            self.nativeAd.reportAdShow({
                adId: self.result.adId.toString()
            });
            
            console.log("数据上报成功 " + self.result.adId.toString())
        }
    },

    btn_down() {


        //点击下载
        if (AD.chanelNameTarget != "OPPO") return;
        this.reportAdClick();

        this.node.scale = 0;

    },
    btn_close() {

        this.node.scale = 0;
        if (AD.couldZJDChaPing()) {
            this.reportAdClick();
        }
    },


});
