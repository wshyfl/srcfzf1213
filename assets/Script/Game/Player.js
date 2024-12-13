const Input = {};
cc.Class({
    extends: cc.Component,

    properties: {
        foodNode: cc.Node,
        spineData: [sp.SkeletonData],
    },

    onLoad() {
        this.Spine = cc.find("img", this.node).getComponent(sp.Skeleton);
        this.Spine2 = cc.find("img2", this.node).getComponent(sp.Skeleton);
        if (this.node.name == "Player1") {
            this.node.type = 1;
        }
        else {
            this.node.type = 2;
        }
       
    },

    start() {
        this.State = AD.playerState.待机;
        this.isTreadWater = false; //踩水
        this.haveThing = false; //手里是否有食物
        this.thingType = "";
        this.isMove = false;
        this.changeSpine = "";
        this.touWeiIndex = [0, 0]; //第0个wantEat的第0个食物
        /**食物错误 */
        this.thingError = false;
        this.onSpinePlayOverCallBack();
        this.otherNode = null;
        this.progressTween = cc.tween(cc.find("progress/bar", this.node))
            .to(AD.Game.makeFoodTime, { width: 108 })
            .call(() => {
                AD.sound.playSfx("关闭制作食物" + this.node.type);
                AD.sound.playSfx("拿到食物");
                cc.find("progress", this.node).active = false;
                this.State = AD.playerState.待机;
                this.haveThing = true;
                this.setSpine("待机");
                this.onFoodChange(this.otherNode.name);
                if (globalData.data.day == -1) {
                    cc.director.emit("新手指引拿到食物", this.thingType)
                }
            })
        cc.director.on("下班了", () => {
            this.hideSpineFood();
            this.thingType = "";
            this.haveThing = false;
            this.setSpine("待机");
            AD.sound.playSfx("关闭制作食物" + this.node.type);
            cc.find("progress/bar", this.node).width = 0;
            this.progressTween.stop();
            cc.find("progress", this.node).active = false;
        })
    },

    update(dt) {
        this.node.zIndex = -this.node.y;
        this.foodNode.active = this.haveThing;
        cc.find("handFood/error", this.node).active = this.thingError;
        
    },
    onDestroy() {
        cc.director.off("下班了");
        cc.director.off("新手指引拿到食物")
    },
    /**角色手中食物 */
    onFoodChange(str) {
        cc.find("handFood", this.node).active = true;
        switch (str) {
            case "hanBao":
                this.foodNode.children[0].active = true;
                cc.find("handFood", this.node).children[0].active = true;
                this.thingType = "汉堡";
                globalData.addCoin(-AD.foodCost.汉堡 * AD.Game.cosePct);
                break
            case "keLeJi":
                this.foodNode.children[1].active = true;
                cc.find("handFood", this.node).children[1].active = true;
                this.thingType = "可乐";
                globalData.addCoin(-AD.foodCost.可乐 * AD.Game.cosePct);
                break
            case "baoMiHua":
                this.foodNode.children[2].active = true;
                cc.find("handFood", this.node).children[2].active = true;
                this.thingType = "爆米花";
                globalData.addCoin(-AD.foodCost.爆米花 * AD.Game.cosePct);
                break
            case "jiTui":
                this.foodNode.children[3].active = true;
                cc.find("handFood", this.node).children[3].active = true;
                this.thingType = "鸡腿";
                globalData.addCoin(-AD.foodCost.鸡腿 * AD.Game.cosePct);
                break
            case "jiChi":
                this.foodNode.children[4].active = true;
                cc.find("handFood", this.node).children[4].active = true;
                this.thingType = "鸡翅";
                globalData.addCoin(-AD.foodCost.鸡翅 * AD.Game.cosePct);
                break
            case "piSa":
                this.foodNode.children[5].active = true;
                cc.find("handFood", this.node).children[5].active = true;
                this.thingType = "披萨";
                globalData.addCoin(-AD.foodCost.披萨 * AD.Game.cosePct);
                break
            case "shuTiao":
                this.foodNode.children[6].active = true;
                cc.find("handFood", this.node).children[6].active = true;
                this.thingType = "薯条";
                globalData.addCoin(-AD.foodCost.薯条 * AD.Game.cosePct);
                break
            case "bingQiLin":
                this.foodNode.children[7].active = true;
                cc.find("handFood", this.node).children[7].active = true;
                this.thingType = "冰淇淋";
                globalData.addCoin(-AD.foodCost.冰淇淋 * AD.Game.cosePct);
                break
        }
    },
    /**隐藏动画中的食物 */
    hideSpineFood() {
        console.log(cc.director.getScene().name);
        cc.find("handFood", this.node).active = false;
        switch (this.thingType) {
            case "汉堡":
                this.foodNode.children[0].active = false;
                cc.find("handFood", this.node).children[0].active = false;
                break
            case "可乐":
                this.foodNode.children[1].active = false;
                cc.find("handFood", this.node).children[1].active = false;
                break
            case "爆米花":
                this.foodNode.children[2].active = false;
                cc.find("handFood", this.node).children[2].active = false;
                break
            case "鸡腿":
                this.foodNode.children[3].active = false;
                cc.find("handFood", this.node).children[3].active = false;
                break
            case "鸡翅":
                this.foodNode.children[4].active = false;
                cc.find("handFood", this.node).children[4].active = false;
                break
            case "披萨":
                this.foodNode.children[5].active = false;
                cc.find("handFood", this.node).children[5].active = false;
                break
            case "薯条":
                this.foodNode.children[6].active = false;
                cc.find("handFood", this.node).children[6].active = false;
                break
            case "冰淇淋":
                this.foodNode.children[7].active = false;
                cc.find("handFood", this.node).children[7].active = false;
                break
        }
    },
    /**正面背面的调换 */
    setSpineData(str) {
        if (str == "正向") {
            cc.find("img", this.node).opacity = 255;
            cc.find("img2", this.node).opacity = 0;

        }
        else if (str == "背向") {
            cc.find("img", this.node).opacity = 0;
            cc.find("img2", this.node).opacity = 255;

        }
    },
    /**设置角色动画
     * @param {*} _name 待机,倒垃圾,救火,上菜,眩晕,移动,制作,撞倒
     */
    setSpine(_name) {

        switch (_name) {
            case "待机":
                if (this.State == AD.playerState.摔倒) return  //摔倒
                if (!this.haveThing) {
                    this.Spine.setAnimation(0, "daiji1", true);
                    this.Spine2.setAnimation(0, "daiji1", true);
                }
                else {
                    this.Spine.setAnimation(0, "daiji2", true);
                    this.Spine2.setAnimation(0, "daiji2", true);
                }
                break
            case "倒垃圾":
                if (this.State == AD.playerState.摔倒) return   //摔倒
                this.Spine.setAnimation(0, "daolaji", false);
                this.Spine2.setAnimation(0, "daolaji", false);
                break
            case "救火":
                if (this.State == AD.playerState.摔倒) return   //摔倒
                this.Spine.setAnimation(0, "jiuhuo", false);
                this.Spine2.setAnimation(0, "jiuhuo", false);
                break
            case "上菜":
                if (this.State == AD.playerState.摔倒) return   //摔倒
                this.Spine.setAnimation(0, "shangcai", false);
                this.Spine2.setAnimation(0, "shangcai", false);
                break
            case "眩晕":
                if (this.State == AD.playerState.摔倒) return   //摔倒
                AD.sound.playSfx("被砸晕");
                if (!this.haveThing) {
                    this.Spine.setAnimation(0, "xuanyun1", true);
                    this.Spine2.setAnimation(0, "xuanyun1", true);
                }
                else {
                    this.Spine.setAnimation(0, "xuanyun2", true);
                    this.Spine2.setAnimation(0, "xuanyun2", true);
                    this.haveThing = false;
                    this.hideSpineFood();
                    this.thingType = "";
                    cc.find("progress/bar", this.node).width = 0;
                    AD.sound.playSfx("关闭制作食物" + this.node.type);
                    this.progressTween.stop();
                    cc.find("progress", this.node).active = false;
                }
                break
            case "移动":
                if (this.State == AD.playerState.摔倒) return   //摔倒
                if (!this.haveThing) {
                    //移动停止制作
                    AD.sound.playSfx("关闭制作食物" + this.node.type);
                    this.progressTween.stop();
                    cc.find("progress", this.node).active = false;
                    this.Spine.setAnimation(0, "yidong1", true);
                    this.Spine2.setAnimation(0, "yidong1", true);
                }
                else {
                    this.Spine.setAnimation(0, "yidong2", true);
                    this.Spine2.setAnimation(0, "yidong2", true);
                }
                break
            case "制作":
                if (this.State == AD.playerState.摔倒) return   //摔倒
                this.Spine.setAnimation(0, "zhizuo", true);
                this.Spine2.setAnimation(0, "zhizuo", true);
                break
            case "撞倒":
                this.State = AD.playerState.摔倒
                if (!this.haveThing) {
                    this.Spine.setAnimation(0, "zhuangdao1", false);
                    this.Spine2.setAnimation(0, "zhuangdao1", false);
                }
                else {
                    this.Spine.setAnimation(0, "zhuangdao2", false);
                    this.Spine2.setAnimation(0, "zhuangdao2", false);
                    this.haveThing = false;
                    this.hideSpineFood();
                    this.thingType = "";
                    cc.find("progress/bar", this.node).width = 0;
                    AD.sound.playSfx("关闭制作食物" + this.node.type);
                    this.progressTween.stop();
                    cc.find("progress", this.node).active = false;
                }
                break
        }
    },
    /**spine动画播放完毕后回调 */
    onSpinePlayOverCallBack() {
        this.Spine.setCompleteListener(() => {
            switch (this.Spine.animation) {
                case "daiji1":  //待机
                    break
                case "daiji2":  //待机
                    break
                case "daolaji":  //倒垃圾
                    this.State = AD.playerState.待机;
                    this.setSpine("待机");
                    break
                case "jiuhuo":  //救火
                    break
                case "shangcai":  //上菜
                    this.State = AD.playerState.待机;
                    this.setSpine("待机");
                    break
                case "xuanyun1":  //眩晕
                    // if (this.isMove) {
                    //     this.State = AD.playerState.移动
                    //     this.setSpine("移动");
                    // }
                    // else {
                    //     this.State = AD.playerState.待机
                    //     this.setSpine("待机");
                    // }
                    break
                case "xuanyun2":  //眩晕
                    // if (this.isMove) {
                    //     this.State = AD.playerState.移动
                    //     this.setSpine("移动");
                    // }
                    // else {
                    //     this.State = AD.playerState.待机
                    //     this.setSpine("待机");
                    // }
                    break
                case "yidong1":  //移动
                    break
                case "yidong2":  //移动
                    break
                case "zhizuo":  //制作
                    break
                case "zhuangdao1":  //撞倒
                    if (this.isMove) {
                        this.State = AD.playerState.移动
                        this.setSpine("移动");
                    }
                    else {
                        this.State = AD.playerState.待机
                        this.setSpine("待机");
                    }
                    break
                case "zhuangdao2":  //撞倒
                    if (this.isMove) {
                        this.State = AD.playerState.移动
                        this.setSpine("移动");
                    }
                    else {
                        this.State = AD.playerState.待机
                        this.setSpine("待机");
                    }
                    break
            }
        })
        this.Spine2.setCompleteListener(() => {
            switch (this.Spine2.animation) {
                case "daiji1":  //待机
                    break
                case "daiji2":  //待机
                    break
                case "daolaji":  //倒垃圾
                    this.State = AD.playerState.待机;
                    this.setSpine("待机");
                    break
                case "jiuhuo":  //救火
                    break
                case "shangcai":  //上菜
                    this.State = AD.playerState.待机;
                    this.setSpine("待机");
                    break
                case "xuanyun1":  //眩晕
                    // if (this.isMove) {
                    //     this.State = AD.playerState.移动
                    //     this.setSpine("移动");
                    // }
                    // else {
                    //     this.State = AD.playerState.待机
                    //     this.setSpine("待机");
                    // }
                    break
                case "xuanyun2":  //眩晕
                    // if (this.isMove) {
                    //     this.State = AD.playerState.移动
                    //     this.setSpine("移动");
                    // }
                    // else {
                    //     this.State = AD.playerState.待机
                    //     this.setSpine("待机");
                    // }
                    break
                case "yidong1":  //移动
                    break
                case "yidong2":  //移动
                    break
                case "zhizuo":  //制作
                    break
                case "zhuangdao1":  //撞倒
                    if (this.isMove) {
                        this.State = AD.playerState.移动
                        this.setSpine("移动");
                    }
                    else {
                        this.State = AD.playerState.待机
                        this.setSpine("待机");
                    }
                    break
                case "zhuangdao2":  //撞倒
                    if (this.isMove) {
                        this.State = AD.playerState.移动
                        this.setSpine("移动");
                    }
                    else {
                        this.State = AD.playerState.待机
                        this.setSpine("待机");
                    }
                    break
            }
        })
    },
    onBeginContact(contact, selfCollider, otherCollider) {
        if (otherCollider.tag == 0) {
            var temp = otherCollider.node.getChildByName("img").scaleX * this.node.getChildByName("img").scaleX
            if (Math.abs(otherCollider.node.y - this.node.y) < 20 && temp == -1) {
                if (this.State == AD.playerState.眩晕) return
                AD.sound.playSfx("碰撞");
                this.setSpine("撞倒");
                if (this.node.name == "Player1") {
                    var worldManifold = contact.getWorldManifold();
                    var points = worldManifold.points;
                    var normal = worldManifold.normal;
                    var hit = cc.instantiate(AD.Game.hitPre);
                    hit.scale = 0.5;
                    hit.parent = this.node;
                    var pos = this.node.convertToNodeSpaceAR(points[0]);
                    hit.position = pos;
                }
            }
        }
    },

    onCollisionEnter(other, self) {
        //tag = 1为食物
        if (other.tag == 1) {
            AD.sound.playSfx("关闭制作食物" + this.node.type);
            this.progressTween.stop();
            cc.find("progress/bar", this.node).width = 0;
            if (this.otherNode == null) {
                this.otherNode = other.node;
            }
            else {
                if (this.otherNode != other.node) {
                    this.otherNode.scale = 1;
                    this.otherNode = other.node;
                }
            }
            this.otherNode.scale = 1.1;
        }
        //tag = 2为障碍中的水渍
        else if (other.tag == 2 && self.tag == 2) {
            if (!this.isTreadWater) {
                this.isTreadWater = true;
                AD.sound.playSfx("碰撞");
                this.setSpine("撞倒");
                if (cc.find("img", this.node).scaleX == 1) {
                    cc.tween(this.node)
                        .by(0.2, { x: 60 })
                        .start()
                }
                else {
                    cc.tween(this.node)
                        .by(0.2, { x: -60 })
                        .start()
                }
                this.scheduleOnce(() => {
                    this.isTreadWater = false;
                }, 4)
            }
        }
        //tag = 3为障碍中的建筑碎片
        else if (other.tag == 3 && self.tag == 3) {
            if (this.State == AD.playerState.摔倒) return
            other.enabled = false;
            this.State = AD.playerState.眩晕;
            this.setSpine("眩晕");
            this.scheduleOnce(() => {
                if (this.isMove) {
                    this.State = AD.playerState.移动;
                    this.setSpine("移动");
                }
                else {
                    this.State = AD.playerState.待机;
                    this.setSpine("待机");
                }
            }, AD.Game.dizzyTime)
            other.node.getComponent("jiGuan").onHitPlayer();
        }
    },
    onCollisionStay(other, self) {
        if (AD.Game.GameOver) return
        if (this.State == AD.playerState.移动) return
        if (this.State == AD.playerState.待机) {
            if (other.tag == 1) {
                if (this.otherNode.name == "canPan" || this.otherNode.name == "laJiTong") {
                    if (!this.haveThing) return
                    if (this.otherNode.name == "canPan") {
                        if (AD.Game.wantEatParent.children.length == 0) return
                        var sum = 0;
                        var sum2 = 0;
                        for (var j = 0; j < AD.Game.wantEatParent.children[0].getComponent("wantEat").wantEatFood.length; j++) {

                            if (this.thingType == AD.Game.wantEatParent.children[0].getComponent("wantEat").wantEatFood[j]) {
                                if (!AD.Game.wantEatParent.children[0].getComponent("wantEat").foodTrue[j]) {
                                    sum2++
                                    AD.sound.playSfx("上菜");
                                    this.State = AD.playerState.上菜;
                                    this.setSpine("上菜");
                                    AD.Game.wantEatParent.children[0].getComponent("wantEat").foodTrue[j] = true;
                                    this.touWeiIndex = [0, j];
                                    AD.Game.wantEatParent.children[this.touWeiIndex[0]].getComponent("wantEat").onCreatTrueNode(this.touWeiIndex[1]);
                                    this.haveThing = false;
                                    this.hideSpineFood();
                                    this.onCanPanAddFood()
                                    AD.Game.wantEatParent.children[0].getComponent("wantEat").wantEatFood[j] = ""
                                    this.thingType = "";

                                    return
                                }
                                else {
                                    if (this.thingError) return
                                    this.thingError = true;
                                    AD.sound.playSfx("无法升级");
                                    AD.Game.onLaJiTongTip(true)
                                    AD.Game.onTip("客人不喜欢这个");
                                    continue
                                }
                            }
                            else {
                                sum++;
                                if (sum >= AD.Game.wantEatParent.children[0].getComponent("wantEat").wantEatFood.length) {
                                    if (this.thingError) return
                                    this.thingError = true;
                                    AD.Game.onLaJiTongTip(true)
                                    AD.sound.playSfx("无法升级");
                                    AD.Game.onTip("客人不喜欢这个");
                                }

                            }
                        }
                        // for (var i = 0; i < AD.Game.wantEatParent.children.length; i++) {
                        //     for (var j = 0; j < AD.Game.wantEatParent.children[i].getComponent("wantEat").wantEatFood.length; j++) {
                        //         if (this.thingType == AD.Game.wantEatParent.children[i].getComponent("wantEat").wantEatFood[j]) {
                        //             if (!AD.Game.wantEatParent.children[i].getComponent("wantEat").foodTrue[j]) {
                        //                 this.State = AD.playerState.上菜
                        //                 this.setSpine("上菜");
                        //                 AD.Game.wantEatParent.children[i].getComponent("wantEat").foodTrue[j] = true;
                        //                 this.touWeiIndex = [i, j];
                        //                 AD.Game.wantEatParent.children[this.touWeiIndex[0]].getComponent("wantEat").onCreatTrueNode(this.touWeiIndex[1]);
                        //                 this.haveThing = false;
                        //                 this.hideSpineFood();
                        //                 this.thingType = "";
                        //                 return
                        //             }
                        //         }
                        //     }

                        // }
                    }
                    else {
                        this.State = AD.playerState.倒垃圾
                        AD.Game.onLaJiTongTip(false)
                        this.setSpine("倒垃圾");
                        this.haveThing = false;
                        this.hideSpineFood();
                        this.thingType = "";
                        AD.Game.loseFood++;
                        AD.Game.projectServe = 0;
                        if (AD.Game.loseFood % 3 == 0) {
                            cc.find("Canvas/shoManager").getComponent(cc.Sprite).spriteFrame = AD.Game.talkManager[2];
                            AD.Game.onShopManagerTalk("你家大米不要钱吗？能不能小心点")
                        }
                    }
                }
                else {
                    if (this.haveThing) return
                    if (!this.onJudgeEnoughMoney(this.otherNode.name)) {
                        if (AD.Game.noMoney) return
                        AD.Game.noMoney = true
                        // AD.Game.onShopManagerView("视频")
                        return
                    }
                    AD.sound.playSfx("制作食物" + this.node.type);
                    this.State = AD.playerState.制作
                    this.setSpine("制作");
                    cc.find("progress", this.node).active = true;
                    this.progressTween.start()
                }
            }
        }

    },
    onCollisionExit(other, self) {
        if (other.tag == 1) {
            other.node.scale = 1;
            this.thingError = false;
            if (other.node == this.otherNode) {
                AD.sound.playSfx("关闭制作食物" + this.node.type);
                this.progressTween.stop();
                cc.find("progress", this.node).active = false;
                cc.find("progress/bar", this.node).width = 0;
            }
        }
    },
    onJudgeEnoughMoney(str) {
        switch (str) {
            case "hanBao":
                if (globalData.data.coin < AD.foodCost.汉堡 * AD.Game.cosePct) {
                    return false
                }
                else {
                    return true
                }
            case "keLeJi":
                if (globalData.data.coin < AD.foodCost.可乐 * AD.Game.cosePct) {
                    return false
                }
                else {
                    return true
                }
            case "baoMiHua":
                if (globalData.data.coin < AD.foodCost.爆米花 * AD.Game.cosePct) {
                    return false
                }
                else {
                    return true
                }

            case "jiTui":
                if (globalData.data.coin < AD.foodCost.鸡腿 * AD.Game.cosePct) {
                    return false
                }
                else {
                    return true
                }

            case "jiChi":
                if (globalData.data.coin < AD.foodCost.鸡翅 * AD.Game.cosePct) {
                    return false
                }
                else {
                    return true
                }

            case "piSa":
                if (globalData.data.coin < AD.foodCost.披萨 * AD.Game.cosePct) {
                    return false
                }
                else {
                    return true
                }

            case "shuTiao":
                if (globalData.data.coin < AD.foodCost.薯条 * AD.Game.cosePct) {
                    return false
                }
                else {
                    return true
                }

            case "bingQiLin":
                if (globalData.data.coin < AD.foodCost.冰淇淋 * AD.Game.cosePct) {
                    return false
                }
                else {
                    return true
                }

        }
    },
    /**餐盘中添加食物 */
    onCanPanAddFood() {
        var index = -1;
        switch (this.thingType) {
            case "汉堡":
                index = 0;
                break
            case "可乐":
                index = 1;
                break
            case "爆米花":
                index = 2;
                break
            case "鸡腿":
                index = 3;
                break
            case "鸡翅":
                index = 4;
                break
            case "披萨":
                index = 5;
                break
            case "薯条":
                index = 6;
                break
            case "冰淇淋":
                index = 7;
                break
        }
        if (index == -1) return
        var food = cc.instantiate(AD.foodPre[index])
        food.parent = cc.find("Canvas/control/guiTaiTop/canPan");
        food.position = AD.Game.canPanPos[AD.Game.servingNum];
        AD.Game.servingNum++;
    },
    
});
