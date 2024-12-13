cc.Class({
    extends: cc.Component,

    properties: {
        truePre: cc.Prefab,
        barImg: cc.SpriteFrame,
    },

    onLoad() {
        this.nowHaveFood = [0, 1, 2, 3];
        this.allFood = ["汉堡", "牛排", "薯条", "可乐",];
        /**饮料类型 */
        this.yinLiaoType = null;
        if (globalData.data.playFightNum < 3) {
            this.foodNum = 1;
        }
        else {
            this.foodNum = 2;
        }
        this.isFirst = false;//是否成为第一个
        this.wantEatFood = new Array();
        this.trueNum = 0;
        this.foodTrue = new Array();
        this.allCoin = 0;
        for (var j = 0; j < this.foodNum; j++) {
            this.foodTrue.push(false);
        }
        console.log(this.foodTrue);
    },

    start() {
        this.onInitFood();
        cc.director.on("暂停客人等待", () => {
            if (this.isFirst) {
                this.waitTime.stop();
            }
        }, this)
        cc.director.on("恢复客人等待", () => {
            if (this.isFirst)
                this.waitTime.start()
        }, this)
    },

    update(dt) {
        if (!this.isFirst) {
            if (this.node.getSiblingIndex() == 0) {
                this.isFirst = true;
                this.onWaitTime();
                // this.tempMissFood = AD.Game.loseFood;
            }
        }
    },
    onInitFood() {
        switch (this.foodNum) {
            case 1:
                var r = Tools.random(0, this.nowHaveFood.length - 1);
                this.wantEatFood.push(this.allFood[this.nowHaveFood[r]]);
                var food = cc.instantiate(AD.foodPre[this.nowHaveFood[r]]);
                food.parent = this.node;
                food.x = 0;
                if (this.allFood[this.nowHaveFood[r]] == "可乐") {
                    this.yinLiaoType = Tools.random(0, 3);
                    food.getComponent(cc.Sprite).spriteFrame = AD.Game.yinLiaoImg[this.yinLiaoType];
                }
                break
            case 2:
                var r = [Tools.random(0, this.nowHaveFood.length - 1), Tools.random(0, this.nowHaveFood.length - 1)]
                this.wantEatFood.push(this.allFood[this.nowHaveFood[r[0]]]);
                this.wantEatFood.push(this.allFood[this.nowHaveFood[r[1]]]);
                var food = cc.instantiate(AD.foodPre[this.nowHaveFood[r[0]]])
                food.parent = this.node;
                food.x = -35;
                if (this.allFood[this.nowHaveFood[r[0]]] == "可乐") {
                    this.yinLiaoType = Tools.random(0, 3);
                    food.getComponent(cc.Sprite).spriteFrame = AD.Game.yinLiaoImg[Tools.random(0, 3)];
                }
                var food1 = cc.instantiate(AD.foodPre[this.nowHaveFood[r[1]]])
                food1.parent = this.node;
                food1.x = 35;
                if (this.allFood[this.nowHaveFood[r[1]]] == "可乐") {
                    this.yinLiaoType = Tools.random(0, 3);
                    food1.getComponent(cc.Sprite).spriteFrame = AD.Game.yinLiaoImg[Tools.random(0, 3)];
                }
                break

        }
        console.log(this.wantEatFood)
    },
    /**创建对勾节点 */
    onCreatTrueNode(index) {
        switch (this.foodNum) {
            case 1:
                var posArry = [0]
                break
            case 2:
                var posArry = [-35, 35]
                break

        }
        var trueNode = cc.instantiate(this.truePre);
        trueNode.parent = this.node;
        trueNode.x = posArry[index];
        this.trueNum++;
        this.allCoin += AD.foodPrice[this.wantEatFood[index]]

        if (this.trueNum == this.foodNum) {
            var Multiple = [1, 1.2, 1.3, 1.4]
            globalData.addFightCoin(this.allCoin * Multiple[this.wantEatFood.length - 1], this.node.type)
            AD.Game.onCoinEffect(this.allCoin * Multiple[this.wantEatFood.length - 1], this.node.type)
            if (this.waitTime) {
                this.waitTime.stop();
                cc.find("progress", this.node).active = false;
            }
            AD.Game.score[this.node.type]++;
            this.scheduleOnce(() => {
                cc.director.emit("完成客人需求", this.node.type);
                this.node.destroy();
                AD.Game.onMoveWantEatParentChildren(this.node.type);
                AD.Game.onCreatCoin(this.node.type)
                AD.sound.playSfx("奖励钱");
            }, 1.6)

            globalData.data.achieve[0].num++;
        }
    },
    /**客人等待的时间 */
    onWaitTime() {
        cc.find("progress", this.node).active = true;
        var times = [25, 35, 24, 28];
        var time = times[this.foodNum - 1] * AD.Game.guestWaitTime[this.node.type];
        this.waitTime = cc.tween(cc.find("progress/bar", this.node))
            .to(time / 2, { width: 59 })
            .call(() => {
                cc.find("progress/bar", this.node).getComponent(cc.Sprite).spriteFrame = this.barImg;
                this.waitTime = cc.tween(cc.find("progress/bar", this.node))
                    .to(time / 2, { width: 0 })
                    .call(() => {
                        this.node.destroy();
                        AD.Game.onMoveWantEatParentChildren(this.node.type);
                        cc.director.emit("完成客人需求", this.node.type);
                    })
                    .start()
            })
            .start()

    },
});
