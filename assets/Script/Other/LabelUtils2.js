var LabelUtils2 = cc.Class({
    extends: cc.Component,

    properties: {
        _ISDEBUG: false,
        _RELEASE_BASE_URL: "https://label.tianyitop.com/label2",
        _DEBUG_BASE_URL: "http://192.168.0.242:19800/label2",
        _labelName: "",
        location: "",
        labels: null,
        _retryTime: 0,
        isSpecial: false,
        _retryTimeLocationList: 0,
        locationList: [],
        initLabelSuccess: false,
        initIsSpecial: false,
    },
    getBaseUrl: function () {
        if (this._ISDEBUG) {
            return this._DEBUG_BASE_URL;
        }
        return this._RELEASE_BASE_URL;
    },

    statics: {
        instance: null
    },
    onLoad: function () {
        this.canRefresh = false;
    },
    /**
     * 在没有获取到标签配置之前统一返回false
     * 在没有获取到是否是特殊省份时统一返回false
     *
     *
     * @param key
     * @returns {boolean}
     */
    getLabel: function (key) {
        // console.log("getLabel:::" + key);
        if (!key || !this.initLabelSuccess || !this.initIsSpecial) {
            return false;
        }
        // console.log("getLabel2>>>>:::" + key);

        if (this.isSpecial) {
            if (this.labels.special.length > 0) {
                for (let i = 0, t = this.labels.special.length; i < t; i++) {
                    let val = this.labels.special[i];
                    // console.log(val.switchname + ">>>" + val.switchvalue + ">>>>key::" + key);
                    if (val.switchname == key) {
                        let b = val.switchvalue == 1;
                        console.log(key + "::" + b);
                        return b;
                    }
                }
                return false;


            } else {
                return false;
            }
        } else {
            if (this.labels.common.length > 0) {
                for (let i = 0, t = this.labels.common.length; i < t; i++) {
                    let val = this.labels.common[i];
                    //   console.log(val.switchname + ">>>" + val.switchvalue + ">>>>key::" + key);

                    if (val.switchname == key) {
                        let b = val.switchvalue == 1;
                        console.log(key + "::" + b);
                        return b;
                    }
                }
                return false;
            } else {
                return false;
            }
        }


    },
    /**
     * 初始化步骤：
     *  1、异步执行ip定位，获取服务器标签配置，获取服务器上省份列表
     *  2、之后会判断当前省份是否是在屏蔽列表中，判断完成之后真正初始化完成
     *  3、
     * @param labelName
     */
    initLabel: function (labelName) {
        console.log("initLabel:" + labelName)

        if (!!labelName && labelName.length > 0) {
            this._labelName = labelName;
        }
        console.log("initLabel:  start")

        this._getMyLocation();
        this._fetchLabel();
        this._fetchLocationList();

    },
    /**
     * 重新刷新标签配置  从服务器重新获取标签配置
     */
    refreshLabelConfig: function () {
        if (this.canRefresh) {
            this._fetchLabel();

        }
    }

    ,

    /**
     * 初始化是否是特殊省份
     * @private
     */
    _initIsSpecial: function () {

        this.isSpecial = false;
        let tmpId = 0;
        if (this.location && this.initLabelSuccess && this.locationList) {
            for (let i = 0; i < this.locationList.length; i++) {
                if (this.location == this.locationList[i].name) {
                    tmpId = this.locationList[i].id;
                    // console.log(this.location + "...." + this.locationList[i].name)
                    break;
                }
            }
            if (this.labels.blocked) {
                let split = this.labels.blocked.split(",");
                if (split) {
                    for (let i = 0; i < split.length; i++) {
                        if (tmpId == split[i]) {
                            this.isSpecial = true;
                            break
                        }

                    }
                }

            }
        }
        this.initIsSpecial = true;
        console.log("isSpecial:" + this.isSpecial)
    },
    _fetchLocationList: function () {

        console.log("get Province List");
        let self = this;
        self._httpGets(this.getBaseUrl() + "/config.json", false, function (res) {
            //console.log("_fetchLocationList Resp:>>" + res)
            self._retryTimeLocationList++;

            if (res) {
                let parse = JSON.parse(res);
                if (parse.code == 1000) {
                    self.locationList = parse.data;
                    console.log("_fetchLocationList Success");
                    self._initIsSpecial();
                } else {
                    //  if (self._retryTime < 15) {
                    self.scheduleOnce(function () {
                        self._fetchLocationList()
                    }, self._retryTimeLocationList)
                    //}

                }
            } else {
                self.scheduleOnce(function () {
                    self._fetchLocationList()
                }, self._retryTimeLocationList)
            }

        })

    }
    ,
    _fetchLabel: function () {
        console.log("start   _fetchLabel")
        let self = this;
        self._retryTime++;

        self._httpGets(this.getBaseUrl() + "/" + this._labelName + ".json?t=" + new Date().getTime(), false, function (res) {

            //console.log("_fetchLabel Resp:>>" + res);
            if (res != -1) {

                let parse = JSON.parse(res);
                if (!!parse && parse.code == 1000) {
                    self.labels = parse.data;
                    self.initLabelSuccess = true;
                    console.log("initLabel Success")
                    self._initIsSpecial();
                    self.canRefresh = true;
                } else {
                    //  if (self._retryTime < 15) {
                    self.scheduleOnce(function () {
                        self._fetchLabel()
                    }, self._retryTime)
                    //}

                }


            } else {
                self.scheduleOnce(function () {
                    self._fetchLabel()
                }, 1)


            }

        })

    },
    
    sendPostRequest(gameName,IPValue) {
        // var str="game=" +gameName+"&ip="+IPValue
        // var ServerLink="http://app.tianyitop.com/api/index/intoIp/";
        // var xhr = new XMLHttpRequest();
        // xhr.onreadystatechange = function () {
        //     if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status <= 400)) {
        //         console.log("IP地址 连接成功");
        //         var response = xhr.responseText;
        //         console.log(response);
        //     }
        // };
        // xhr.open("POST", ServerLink);
        // xhr.send(str);
    },

    _getMyLocation: function () {
        console.log("label:getLocation")
        let self = this;
        this._httpGetsLocation("https://pv.sohu.com/cityjson?ie=utf-8", function (res) {
           

            if (res != -1) {
                let s2 = res.toString();
                let s3 = s2.substring(s2.indexOf("{"), s2.lastIndexOf("}") + 1);
                // console.log(s3)
                console.log("yfl==  " + s3);
                let parse = JSON.parse(s3);
                self.sendPostRequest("热血枪王TT",parse.cip);
                if (parse && parse.cname) {
                    let s = parse.cname;
                    // console.log(s)
                    if (s.indexOf("省") != -1) {
                        s = s.substring(0, s.indexOf("省"));
                    } else if (s.indexOf("市") != -1) {
                        s = s.substring(0, s.indexOf("市"));
                    } else {
                        s = s.substring(0, 2);
                    }
                    console.log(s)
                    self.location = s;
                    self._initIsSpecial()
                } else {
                    self.scheduleOnce(function () {
                        self._getMyLocation();
                    }, 2)
                }


            } else {

                self.scheduleOnce(function () {
                    self._getMyLocation();
                }, 2)
            }


        });
        console.log("label:getLocation  End")


    },

    _httpGetsLocation: function (url, callback) {
        console.log("label:_httpGetsLocation 1111 ")
        let self = this;
        var xhr = cc.loader.getXMLHttpRequest();

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                console.log(xhr.status + ".......");
                if (xhr.status >= 200 && xhr.status <= 304) {
                    var respone = xhr.responseText;
                    callback(respone);
                } else {
                    callback(-1)

                }

            }
        };
        xhr.open("GET", url, true);


        if (cc.sys.isNative) {
            xhr.setRequestHeader("Accept-Encoding", "gzip,deflate");
        }

        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.setRequestHeader("Host", "pv.sohu.com");
        xhr.setRequestHeader("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.103 Safari/537.36");
        xhr.setRequestHeader("Accept", "*/*");
        xhr.setRequestHeader("Connection", "keep-alive");
        xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");


        // note: In Internet Explorer, the timeout property may be set only after calling the open()
        // method and before calling the send() method.
        //  xhr.timeout = 5000; // 5 seconds for timeout
        xhr.timeout = 4000;
        let isCallback = false;
        xhr.ontimeout = function () {
            console.log("xmlhttprequest location timeout");
            if (!isCallback) {
                isCallback = true;
                callback(-1);
            }
        };
        xhr.onerror = function (e) {
            console.log(e + "xmlhttprequest location onerror")
            if (!isCallback) {
                isCallback = true;
                callback(-1);

            }
        };
        xhr.send();
    },

    _httpGets: function (url, needHeader, callback) {
        console.log("label:HttpGets  ");

        let xhr = cc.loader.getXMLHttpRequest();

        xhr.onreadystatechange = function () {
            cc.log(" label location XML_HTTP_REQUEST onreadystatechange ");
            if (xhr.readyState === 4) {
                console.log("httpGetsCode:" + xhr.status)
                if (xhr.status >= 200 && xhr.status <= 304) {
                    var respone = xhr.responseText;
                    // var respone = JSON.parse(xhr.responseText);
                    callback(respone);
                } else {
                    callback(-1);
                }

            }
        };

        xhr.open("GET", url, true);
        if (cc.sys.isNative) {
            xhr.setRequestHeader("Accept-Encoding", "gzip,deflate");
        }
        xhr.setRequestHeader("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.103 Safari/537.36");
        xhr.setRequestHeader("Accept", "*/*");
        xhr.setRequestHeader("Connection", "keep-alive");
        /*
                xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
        */

        xhr.timeout = 3000;
        let isCallback = false;
        xhr.ontimeout = function () {
            console.log("xmlhttprequest timeout");
            if (!isCallback) {
                isCallback = true;
                callback(-1);
            }
        };
        xhr.onerror = function (e) {
            console.log(e + "xmlhttprequest onerror")
            if (!isCallback) {
                isCallback = true;
                callback(-1);

            }
        };
        xhr.send();
    }

});

LabelUtils2.getInstance = function () {
    if (LabelUtils2.instance == null) {
        LabelUtils2.instance = new LabelUtils2();
    }
    return LabelUtils2.instance;
};
module.exports = LabelUtils2;
