

cc.Class({
	extends: cc.Component,

	properties: {
		dialogYinSi: cc.Node,
		zhuTiCfg: {
			default: [],
			type: [cc.String],
			displayName: "主体配置(如:QQ,北京)"
		},
		btnAgree1: cc.Node,
		btnNotAgree: cc.Node,
		btnClose1: cc.Node,
		gameNameLabel: cc.Label,
		adressLabel: cc.Label,
		zhuTiLabel: cc.Label,
		emailLabel: cc.Label,
	},

	onLoad() {
		this.zhuTiName = "石家庄木偶人网络科技有限公司";
		this.gameName = "双人厨房做饭";
		this.key = this.gameName;
		window.key_yinSi = "keyYinSi" + this.key;
		window.showYinSi = false;
		this.dialogYinSi.active = false;


		//主体
		this.zhuTiCfg.forEach(element => {
			if (element.split(",")[0] == AD.chanelName1) {
				switch (element.split(",")[1]) {
					case "石家庄":
						this.zhuTiName = "石家庄木偶人网络科技有限公司";
						break;
					case "河南":
						this.zhuTiName = "河南玖神网络科技有限公司";
						break;
					case "北京":
						this.zhuTiName = "天艺互娱（北京）网络科技有限公司";
						break;
				}
			}
		});

		this.zhuTiLabel.string = "主体名称:" + this.zhuTiName;
		//公司地址
		var _adressArr = [
			"河北省石家庄市高新区长江大道9号筑业高新国际A11F",
			"河南省安阳市高新区弦歌大道西段科创大厦1楼创客空间105-12",
			"北京市密云区密云镇鼓楼南大街兴旺市场东侧商铺楼1至4层（443室）"
		];
		if (this.zhuTiName.indexOf("石家庄") > -1) {
			this.adressLabel.string = "公司地址:" + _adressArr[0];
			this.emailLabel.string = "客服邮箱:3539393844@qq.com";
		}
		else if (this.zhuTiName.indexOf("河南") > -1) {
			this.adressLabel.string = "公司地址:" + _adressArr[1];
			this.emailLabel.string = "客服邮箱:552304261@qq.com";
		}
		else if (this.zhuTiName.indexOf("北京") > -1) {
			this.adressLabel.string = "公司地址:" + _adressArr[2];
			this.emailLabel.string = "客服邮箱:496801766@qq.com";
		}

		//游戏名称
		this.gameNameLabel.string = "游戏名称:" + this.gameName;


	},

	start() {
		if (window.showYinSi) {//已经 弹过了
			this.dialogYinSi.active = false;
			this.checkPermission();
		}
		else {//还没有首次弹出过
			this.dialogYinSi.active = true;
		}
	},


	onEnable() {
		this.resetBtn();
	},
	resetBtn() {
		window.showYinSi = false;
		if (cc.sys.localStorage.getItem(window.key_yinSi) == 1)
			window.showYinSi = true;

		if (window.showYinSi) {
			this.btnClose1.active = true;
			this.btnAgree1.active = false;
			this.btnNotAgree.active = false;
		}
		else {
			this.btnClose1.active = false;
			this.btnAgree1.active = true;
			this.btnNotAgree.active = true;
		}

	},
	btnCallBack(event, type) {
		if (AD.chanel == "233") {
			if (cc.sys.os == cc.sys.OS_ANDROID) {
				jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "showYinSi", "(Ljava/lang/String;)V", "申请权限");
			}
		}
		else {
			this.dialogYinSi.active = true;

			this.resetBtn();
		}
	},

	//android 申请权限
	checkPermission() {
		// if (AD.isAndroid) 
		// {
		//     if (cc.sys.os == cc.sys.OS_ANDROID) {
		//         jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "checkPermission", "(Ljava/lang/String;)V", "申请权限");
		//     }
		// }
		switch (AD.chanelName1) {
			case "huaWei":
				AD_HuaWei.couldShowAD = true;
				break;
			case "android":
				if (cc.sys.os == cc.sys.OS_ANDROID) {
					jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "checkPermission", "(Ljava/lang/String;)V", "申请权限");
				}
				break;
		}

	},
	// update (dt) {},
});
