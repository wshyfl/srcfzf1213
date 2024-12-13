cc.Class({
    extends: cc.Component,

    properties: {
        addPre: cc.Prefab,
        truePre: cc.Prefab,
        foodPre: [cc.Prefab],
        barImg: cc.SpriteFrame,
        wantEatImg: [cc.SpriteFrame],
    },

    onLoad() {
        this.nowHaveFood = [0, 1];
        for (var i = 0; i < globalData.data.unlockFood.length; i++) {
            if (globalData.data.unlockFood[i] == "爆米花") {
                this.nowHaveFood.push(2);
            }
            if (globalData.data.unlockFood[i] == "鸡腿") {
                this.nowHaveFood.push(3);
            }
            if (globalData.data.unlockFood[i] == "鸡翅") {
                this.nowHaveFood.push(4);
            }
            if (globalData.data.unlockFood[i] == "披萨") {
                this.nowHaveFood.push(5);
            }
            if (globalData.data.unlockFood[i] == "薯条") {
                this.nowHaveFood.push(6);
            }
            if (globalData.data.unlockFood[i] == "冰淇淋") {
                this.nowHaveFood.push(7);
            }
        }
        // console.log(globalData.data.unlockFood)
        if (globalData.data.day == -1) {
            this.foodNum = 2;
        }
        else if (globalData.data.day < 4) {
            this.foodNum = Tools.random(1, 2);
        }
        else if (globalData.data.day < 8) {
            this.foodNum = Tools.random(2, 3);
        }
        else {
            this.foodNum = Tools.random(2, 4);
        }
        this.isFirst = false;//是否成为第一个
        this.wantEatFood = new Array();
        this.trueNum = 0;
        this.foodTrue = new Array();
        this.allCoin = 0;
        for (var j = 0; j < this.foodNum; j++) {
            this.foodTrue.push(false);
        }

        this.isShake = false;
        this.SiblingIndex = this.node.getSiblingIndex();
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
            if (this.node.getSiblingIndex() == 0 || AD.Game.needSpeedup) {
                this.isFirst = true;
                this.onWaitTime();
                this.tempMissFood = AD.Game.loseFood;

            }
        }
        if (AD.Game.needSpeedup) {
            if (this.isShake) return
            this.isShake = true

            cc.find("cf_ji", this.node).active = true;
            cc.tween(cc.find("cf_ji", this.node))
                .repeatForever(
                    cc.tween()
                        .to(0.2, { scale: 0.8 })
                        .to(0.2, { scale: 1.2 })
                )
                .start()
            cc.tween(cc.find("redEff", this.node))
                .repeatForever(
                    cc.tween()
                        .to(0.2, { opacity: 255 })
                        .to(0.2, { opacity: 0 })
                )
                .start()
        }
    },
    onInitFood() {
        switch (this.foodNum) {
            case 1:
                var r = Tools.random(0, this.nowHaveFood.length - 1)
                this.wantEatFood.push(AD.allFood[this.nowHaveFood[r]]);
                var food = cc.instantiate(AD.foodPre[this.nowHaveFood[r]])
                food.parent = this.node.getChildByName("wantEat");
                food.x = 0;
                break
            case 2:
                var r = [Tools.random(0, this.nowHaveFood.length - 1), Tools.random(0, this.nowHaveFood.length - 1)]
                if (globalData.data.day != -1) {
                    this.wantEatFood.push(AD.allFood[this.nowHaveFood[r[0]]]);
                    this.wantEatFood.push(AD.allFood[this.nowHaveFood[r[1]]]);
                    var food = cc.instantiate(AD.foodPre[this.nowHaveFood[r[0]]])
                    var food1 = cc.instantiate(AD.foodPre[this.nowHaveFood[r[1]]])
                }
                else {
                    this.wantEatFood.push(AD.allFood[this.nowHaveFood[0]]);
                    this.wantEatFood.push(AD.allFood[this.nowHaveFood[1]]);
                    var food = cc.instantiate(AD.foodPre[this.nowHaveFood[0]])
                    var food1 = cc.instantiate(AD.foodPre[this.nowHaveFood[1]])
                }

                food.parent = this.node.getChildByName("wantEat");
                food.x = -50;

                food1.parent = this.node.getChildByName("wantEat");
                food1.x = 50;
                break
            case 3:
                var r = [Tools.random(0, this.nowHaveFood.length - 1), Tools.random(0, this.nowHaveFood.length - 1), Tools.random(0, this.nowHaveFood.length - 1)];
                var food = new Array();
                for (var i = 0; i < 3; i++) {
                    this.wantEatFood.push(AD.allFood[this.nowHaveFood[r[i]]]);
                    food[i] = cc.instantiate(AD.foodPre[this.nowHaveFood[r[i]]])
                    food[i].parent = this.node.getChildByName("wantEat");
                }
                food[0].x = -80;
                food[1].x = 0;
                food[2].x = 80;
                break
            case 4:
                var r = [Tools.random(0, this.nowHaveFood.length - 1), Tools.random(0, this.nowHaveFood.length - 1), Tools.random(0, this.nowHaveFood.length - 1), Tools.random(0, this.nowHaveFood.length - 1)];
                var food = new Array();
                for (var i = 0; i < 4; i++) {
                    this.wantEatFood.push(AD.allFood[this.nowHaveFood[r[i]]]);

                    food[i] = cc.instantiate(AD.foodPre[this.nowHaveFood[r[i]]])
                    food[i].parent = this.node.getChildByName("wantEat");
                }
                food[0].x = -100;
                food[1].x = -32.5;
                food[2].x = 32.5;
                food[3].x = 100;

                break
        }
        // console.log(this.wantEatFood)
    },
    /**创建对勾节点 */
    onCreatTrueNode(index) {
        switch (this.foodNum) {
            case 1:
                var posArry = [0]
                break
            case 2:
                var posArry = [-50, 50]
                break
            case 3:
                var posArry = [-80, 0, 80]
                break
            case 4:
                var posArry = [-100, -32.5, 32.5, 100]
                break
        }
        var trueNode = cc.instantiate(this.truePre);
        trueNode.parent = this.node.getChildByName("wantEat");;
        trueNode.x = posArry[index];
        this.trueNum++;
        this.allCoin += AD.foodPrice[this.wantEatFood[index]]
        if (this.trueNum == this.foodNum) {
            var Multiple = [1, 1.2, 1.3, 1.4];
            globalData.addCoin(this.allCoin * Multiple[this.wantEatFood.length - 1]);
            AD.Game.onCoinEffect(this.allCoin * Multiple[this.wantEatFood.length - 1]);
            AD.Game.missGuest = 0;
            AD.Game.projectServe++;
            if (AD.Game.projectServe == 6) {
                AD.Game.projectServe = 0;
                // AD.Game.onShopManagerView("奖励");
            }
            if (this.waitTime) {
                this.waitTime.stop();
                cc.find("progress", this.node).active = false;
            }
            AD.Game.serveGuest_temp--;
            globalData.data.achieve[0].num++;
            this.scheduleOnce(() => {
                cc.director.emit("完成客人需求", "yidong_wancheng");
                this.node.destroy();
                AD.Game.onMoveWantEatParentChildren();
                AD.sound.playSfx("奖励钱");
                AD.Game.onCreatCoin();
                if (AD.Game.serveGuest_temp == 0) {
                    AD.Game.onNight();
                }
            }, 0.6)
        }
    },
    /**客人等待的时间 */
    onWaitTime() {
        if (globalData.data.day == -1) {
            cc.find("progress", this.node).active = false;
            return
        }
        cc.find("progress", this.node).active = true;
        var times = [20, 20, 25, 30]
        this.time = times[this.foodNum - 1] * AD.Game.guestWaitTime;
        this.waitTime = cc.tween(cc.find("progress/bar", this.node))
            .to(this.time / 2, { width: 112 })
            .call(() => {
                cc.find("progress/bar", this.node).getComponent(cc.Sprite).spriteFrame = this.barImg;
                this.waitTime = cc.tween(cc.find("progress/bar", this.node))
                    .to(this.time / 4, { width: 56 })
                    .call(() => {
                        if (!AD.Game.needSpeedup) {
                            this.isShake = true;
                            cc.tween(cc.find("redEff", this.node))
                                .repeatForever(
                                    cc.tween()
                                        .to(0.2, { opacity: 255 })
                                        .to(0.2, { opacity: 0 })
                                )
                                .start()
                        }
                        this.waitTime = cc.tween(cc.find("progress/bar", this.node))
                            .to(this.time / 4, { width: 0 })
                            .call(() => {
                                AD.sound.playSfx("未完成")
                                AD.Game.missGuest++;
                                if (AD.Game.missGuest == 3) {
                                    AD.Game.missGuest = 0;
                                    // AD.Game.onShopManagerView("扣钱");
                                }
                                cc.director.emit("完成客人需求", "yidong_shengqi");
                                this.node.destroy();
                                AD.Game.onMoveWantEatParentChildren();
                                AD.Game.projectServe++;
                            })
                            .start()
                    })
                    .start()
            })
            .start()
    },
});
