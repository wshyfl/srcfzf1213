window.Tools = {


    //获得随机整数 上下限都包括
    random(lower, upper) {
        return Math.floor(Math.random() * (upper - lower + 1)) + lower;
    },
    //角度转弧度
    angleToRadian(angle) {
        return angle * Math.PI / 180;
    },

    //弧度转角度
    radianToAngle(radian) {
        return radian * 180 / Math.PI;
    },
    //获得两点之间的距离
    getDistance(pos, pos2) {
        var distance = Math.sqrt(Math.pow(pos.x - pos2.x, 2) + Math.pow(pos.y - pos2.y, 2));
        return distance;
    },
    //获得两点之间的弧度
    getRadian(pos1, pos2) {//获得人物中心和鼠标坐标连线，与y轴正半轴之间的夹角
        var px = pos1.x;
        var py = pos1.y;
        var mx = pos2.x;
        var my = pos2.y;
        var x = Math.abs(px - mx);
        var y = Math.abs(py - my);
        var z = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
        var cos = y / z;
        var radina = Math.acos(cos);//用反三角函数求弧度
        var angle = Math.floor(180 / (Math.PI / radina));//将弧度转换成角度

        if (mx > px && my > py) {//鼠标在第四象限
            angle = 180 - angle;
        }

        if (mx == px && my > py) {//鼠标在y轴负方向上
            angle = 180;
        }

        if (mx > px && my == py) {//鼠标在x轴正方向上
            angle = 90;
        }

        if (mx < px && my > py) {//鼠标在第三象限
            angle = 180 + angle;
        }

        if (mx < px && my == py) {//鼠标在x轴负方向
            angle = 270;
        }

        if (mx < px && my < py) {//鼠标在第二象限
            angle = 360 - angle;
        }
        return this.angleToRadian(angle);//角度转弧度
        // return angle;
    },
    getAngle(pos1, pos2) {//获得人物中心和鼠标坐标连线，与y轴正半轴之间的夹角
        var px = pos1.x;
        var py = pos1.y;
        var mx = pos2.x;
        var my = pos2.y;
        var x = Math.abs(px - mx);
        var y = Math.abs(py - my);
        var z = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
        var cos = y / z;
        var radina = Math.acos(cos);//用反三角函数求弧度
        var angle = Math.floor(180 / (Math.PI / radina));//将弧度转换成角度

        if (mx > px && my > py) {//鼠标在第四象限
            angle = 180 - angle;
        }

        if (mx == px && my > py) {//鼠标在y轴负方向上
            angle = 180;
        }

        if (mx > px && my == py) {//鼠标在x轴正方向上
            angle = 90;
        }

        if (mx < px && my > py) {//鼠标在第三象限
            angle = 180 + angle;
        }

        if (mx < px && my == py) {//鼠标在x轴负方向
            angle = 270;
        }

        if (mx < px && my < py) {//鼠标在第二象限
            angle = 360 - angle;
        }
        // return this.angleToRadian(angle);//角度转弧度
        return angle;
    },
    //变化颜色
    setNodeColor(_node, _Re, _Ge, _Be) {
        var colorCode = new cc.color(_Re, _Ge, _Be, 255);
        _node.color = colorCode;
        if (_node.children.length > 0) {
            for (var i = 0; i < _node.children.length; i++) {
                _node.children[i].color = colorCode;
                if (_node.children[i].children.length > 0) {
                    for (var j = 0; j < _node.children[i].children.length; j++) {
                        _node.children[i].children[j].color = colorCode;
                    }
                }
            }
        }
    },
    getDate(timeType) {
        var testDate = new Date();

        if (timeType == "year")
            return testDate.getYear();//获取当前年份(2位)
        else if (timeType == "year2")
            return testDate.getFullYear(); //获取完整的年份(4位,1970-????)
        else if (timeType == "month")
            return testDate.getMonth(); //获取当前月份(0-11,0代表1月)
        else if (timeType == "day")
            return testDate.getDate(); //获取当前日(1-31)
        else if (timeType == "week")
            return testDate.getDay(); //获取当前星期X(0-6,0代表星期天)
        else if (timeType == "millisecond")
            return testDate.getTime(); //获取当前时间(从1970.1.1开始的毫秒数)
        else if (timeType == "hour")
            return testDate.getHours(); //获取当前小时数(0-23)

        else if (timeType == "minute")
            return testDate.getMinutes(); //获取当前分钟数(0-59)

        else if (timeType == "second")
            return testDate.getSeconds(); //获取当前秒数(0-59)

        // testDate.getMilliseconds(); //获取当前毫秒数(0-999)

        // testDate.toLocaleDateString(); //获取当前日期

        // var mytime=testDate.toLocaleTimeString();//获取当前时间

        // testDate.toLocaleString( ); //获取日期与时间
    },
    //获取屏幕大小
    getWinSize() {
        return cc.winSize
    },
    //字符串转数组
    strToArr(_str, _separator) {
        var _aar = _str.split("" + _separator);// 在每个逗号(,)处进行分解。
        return _aar;
    },

    /**从数组中随机取不重复的值
     * 
     * @param {*} arr 数组
     * @param {*} m 从数组取得个数
     */
    getRandom(arr, m) {
        var num = new Array();
        for (var i = 0; i < m; i++) {
            let r = Tools.random(0, arr.length - 1);
            num[i] = arr[r];
            arr.splice(r, 1);
        }
        return num
    },
    /**将数组随机 */
    ArrayRandom(arr) {
        for (var i = 0, len = arr.length; i < len; i++) {
            var a = parseInt(Math.random() * len);
            var temp = arr[a];
            arr[a] = arr[i];
            arr[i] = temp;
        }
        return arr;
    },
    //打字机
    typingAni(self, label, text) {
        var html = '';
        var arr = text.split('');
        var len = arr.length;
        var step = 0;
        self.func = function () {
            html += arr[step];
            label.string = html;
            if (++step == len) {
                self.unschedule(self.func, self);
            }
        }
        self.schedule(self.func, 0.05)
    },
    //将数字转换为k,m
    nFormatter(num, digits) {
        const si = [
            { value: 1, symbol: "" },
            { value: 1E3, symbol: "K" },
            { value: 1E6, symbol: "M" },
            { value: 1E9, symbol: "B" },
            { value: 1E12, symbol: "T" },
            { value: 1E15, symbol: "Q" },
            { value: 1E18, symbol: "W" },
            { value: 1E21, symbol: "a" },
            { value: 1E24, symbol: "b" },
            { value: 1E27, symbol: "c" },
            { value: 1E30, symbol: "d" },
            { value: 1E33, symbol: "e" },
        ];
        const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
        let i;
        for (i = si.length - 1; i > 0; i--) {
            if (num >= si[i].value) {
                break;
            }
        }
        return (num / si[i].value).toFixed(digits).replace(rx, "$1") + si[i].symbol;
    },
    //数字前补0
    padding(num, length) {
        //这里用slice和substr均可
        return (Array(length).join("0") + num).slice(-length);
    },
    getIndexInArray(arr, value) //元素为 object  获取数组的索引
    {
        for (var i = 0; i < arr.length; i++) {
            if (JSON.stringify(arr[i]) === JSON.stringify(value))
                return i;
        }
        return -1;
    },
    removeElementFromArr(arr, value)//
    {
        // console.log("value------------------\n "  + value);
        var index = Tools.getIndexInArray(arr, value);
        // console.log("arr0------------------\n "  + arr + "  index  " + index);
        if (index > -1) {
            arr.splice(index, 1);
        }

        // console.log("arr1*****************\n "  + arr);
        return arr;
    },
    getShowStr(_num) {
        _num = parseInt(_num)
        var _showPrice = null;
        var _ziMu = null;
        if (_num >= 1000000000000000000000) {
            _showPrice = parseFloat(parseFloat(_num) / parseFloat(1000000000000000000000)).toFixed(2);;
            _ziMu = "cc"
        }
        else if (_num >= 1000000000000000000) {
            _showPrice = parseFloat(parseFloat(_num) / parseFloat(1000000000000000000)).toFixed(2);;
            _ziMu = "bb"
        }
        else if (_num >= 1000000000000000) {
            _showPrice = parseFloat(parseFloat(_num) / parseFloat(1000000000000000)).toFixed(2);;
            _ziMu = "aa"
        }
        else if (_num >= 1000000000000) {
            _showPrice = parseFloat(parseFloat(_num) / parseFloat(1000000000000)).toFixed(2);;
            _ziMu = "T"
        }
        else if (_num >= 1000000000) {
            _showPrice = parseFloat(parseFloat(_num) / parseFloat(1000000000)).toFixed(2);;
            _ziMu = "B"
        }
        else if (_num >= 1000000) {
            _showPrice = parseFloat(parseFloat(_num) / parseFloat(1000000)).toFixed(2);;
            _ziMu = "M"
        }
        else if (_num >= 1000) {
            _showPrice = parseFloat(parseFloat(_num) / parseFloat(1000)).toFixed(2);;
            _ziMu = "K"
        }
        else {
            _showPrice = _num;
            _ziMu = ""
        }

        return "" + _showPrice + _ziMu
    },
    getNewArr(Arr, num)	//传入2个参数，一个数组，要获取数组的长度 (目的 将一个数组打乱后重新返回)
    {
        var arr = new Array();  //这个数组的目的是把传入进来的数组复制一份
        for (var i in Arr) {
            arr.push(Arr[i]);
        }  //这个for 循环用来把传入的数组复制一份  

        var return_arr = new Array();  //存储随机数用的数组
        for (var i = 0; i < num; i++) 	//获取随机数
        {
            if (arr.length > 0) {
                var nums = Math.floor(Math.random() * arr.length);  //从arr里面随机一个地址并 赋给变量nums
                return_arr[i] = arr[nums];	//将arr地址里的值 给   return_arr[i];
                arr.splice(nums, 1);	//删除 地址上的数字，防止在随机出来重复的
            }
            else {
                break;
            }
        }
        return return_arr;		//返回获取的5个值
    },


    resetDialog(_dialog, _show) {

        var _zheZhao = _dialog.getChildByName("shade");
        var _bg = _dialog.getChildByName("bg");
        if (_show) {
            if (_dialog.name != "jieSuanView") {
                AD.chaPing();
            }
            AD.showBanner();
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
    resetDialogForDestroy(_dialog, _show) {
        var _zheZhao = _dialog.getChildByName("shade");
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


    changeCloth(skeleton, slotName, targetSkinName, targetAttaName) {

        let slot = skeleton.findSlot(slotName);

        let atta;

        if (targetAttaName != null && targetAttaName != "") {

            let skeletonData = skeleton.skeletonData.getRuntimeData();

            let slotIndex = skeletonData.findSlotIndex(slotName);

            let skin = skeletonData.findSkin(targetSkinName);

            atta = skin.getAttachment(slotIndex, targetAttaName);

        }

        else

            atta = null;

        slot.setAttachment(null);

        slot.setAttachment(atta);

        // skeleton.setSkin(targetSkinName);
        // skeleton.setAttachment(slotName, targetAttaName);
    },
    couldShake: true,
    //震屏
    shakeScreen(..._rate) {

        var rate = 1;
        if (_rate[0])
            rate = _rate[0];
        var _time = 0.03 * rate; var _length = 5 * rate; var _scale = 0.02 * rate;
        var _camera = cc.find("Canvas/Main Camera").getComponent(cc.Camera);
        // cc.tween(_camera)
        // .to(_time,{zoomRatio:1-_scale})
        // .to(_time,{zoomRatio:1+_scale})
        // .start();
        var _canvas = cc.find("Canvas/Main Camera");
        // var _yuanX = _canvas.x;
        // var _yuanY = _canvas.y;
        cc.tween(_canvas)
            .by(_time, { position: cc.v2(-_length, _length) })
            .by(_time, { position: cc.v2(_length, -_length) })
            .by(_time, { position: cc.v2(_length, _length) })
            .by(_time, { position: cc.v2(-_length, -_length) })
            .call(() => {
                this.couldShake = true;
            })
            .start();
        // var _canvas = cc.find("Canvas");
        // cc.tween(_canvas)
        //     .to(_time, { position: cc.v2(_yuanX - _length, _yuanY), scale: 1 - _scale })
        //     .to(_time, { position: cc.v2(_yuanX, _yuanY + _length), scale: 1 })
        //     .to(_time, { position: cc.v2(_yuanX + _length, _yuanY), scale: 1 + _scale })
        //     .to(_time, { position: cc.v2(_yuanX, _yuanY), scale: 1 })
        //     .start();
        // cc.tween(_canvas)
        //     .to(_time, { scale: 1 - _scale })
        //     .to(_time, { scale: 1 })
        //     .to(_time, { scale: 1 + _scale })
        //     .to(_time, { scale: 1 })
        //     .start();
    },

}