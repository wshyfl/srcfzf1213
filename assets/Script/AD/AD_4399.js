window.AD_4399 = {
    moreGame4399() {
        window.h5api.showRecommend()
    },
    getPlayTimes() {
        if (AD.chanelName == "4399") {
            let callback = (data) => {
                console.log("是否可播放广告", data.canPlayAd, "剩余次数", data.remain)
                AD_4399.playTimes = data.remain;
            };

            window.h5api.canPlayAd(callback);
        }
    },

    shiPin() {
        // if (AD_4399.playTimes <= 0){

        //     cc.director.emit("系统提示","今日广告次数已用完，明日继续")
        //     return;
        // }


        let callback = (obj) => {
            console.log('代码:' + obj.code + ',消息:' + obj.message)
            if (obj.code === 10000) {
                console.log('开始播放');
                cc.audioEngine.stopMusic();
            } else if (obj.code === 10001) {
                console.log('播放结束')
                setTimeout(()=>{
                    AD.reward();
                    cc.audioEngine.playMusic();
                },100);
            } else {
                console.log('广告异常')
                cc.audioEngine.playMusic();
            }
        };
        window.h5api.playAd(callback);
    },
    //4399上传分数
    uploading4399Rank() {
        var score = parseInt(globalData.getChengHaoEP());
        console.log("score  " + score)
        window.h5api.submitRankScore(450, score, function (res) {
            console.log('提交结果1：', res)
            console.log('提交结果1*：', JSON.stringify(res))
        })
    },

    //4399获取排行榜
    show4399Rank() {
        window.h5api.showRankList()
    },
}