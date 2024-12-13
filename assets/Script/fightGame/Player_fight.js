const Input = {};
cc.Class({
    extends: cc.Component,

    properties: {
        foodNode: cc.Node,

    },

    onLoad() {
        this.Spine = cc.find("img", this.node).getComponent(sp.Skeleton);
        this.Spine2 = cc.find("img2", this.node).getComponent(sp.Skeleton);
        if (this.node.name == "Player1") {
            this.playerIndex = 0;
            this.node.type = 1;
        }
        else {
            this.playerIndex = 1;
            this.node.type = 2;
        }
        /**小游戏是否打开 */
        this.minigameOpen = false;
        /**玩家没钱 */
        this.noMoney = false;
       
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
        cc.director.on("制作完成", (a, b, c) => {
            AD.sound.playSfx("拿到食物");
            if (this.playerIndex == a) {
                switch (b) {
                    case "汉堡":
                        this.haveThing = true;
                        this.setSpine("待机")
                        this.onFoodChange(b);
                        break
                    case "牛排":
                        this.haveThing = true;
                        this.setSpine("待机")
                        this.onFoodChange(b);
                        break
                    case "薯条":
                        this.haveThing = true;
                        this.setSpine("待机")
                        this.onFoodChange(b);
                        break
                    case "可乐":
                        this.haveThing = true;
                        this.setSpine("待机")
                        this.foodNode.children[3].getComponent(cc.Sprite).spriteFrame = AD.Game.yinLiaoImg[c];
                        this.onFoodChange(b);
                        break
                }
            }
        }, this)
        cc.director.on("玩家看完广告", () => {
            if (this.noMoney) {
                this.minigameOpen = false;
                this.noMoney = false;
            }
        });
    },

    update(dt) {
        this.node.zIndex = this.node.y;
        this.foodNode.active = this.haveThing;
        cc.find("handFood/error", this.node).active = this.thingError;
      
    },
    onDestroy(){
        cc.director.off("关闭小游戏按钮")
    },
    onBtnCallBack(e, t) {

        switch (t) {
            case "汉堡":
                if (e.target.scale != 1.1) return

                break
            case "可乐":
                if (e.target.scale != 1.1) return


                break
            case "牛排":
                if (e.target.scale != 1.1) return

                break
            case "薯条":
                if (e.target.scale != 1.1) return

                break
            case "关闭小游戏":
                AD.sound.playSfx("按钮");
                this.minigameTemp.active = false;
                this.minigameTemp.parent.active = false;
                cc.director.emit("关闭小游戏按钮")
                break
        }
    },
    /**角色手中食物 */
    onFoodChange(str) {
        cc.find("handFood", this.node).active = true;
        switch (str) {
            case "汉堡":
                this.foodNode.children[0].active = true;
                this.thingType = "汉堡";
                cc.find("handFood", this.node).children[0].active = true;
                globalData.addFightCoin(-AD.foodCost.汉堡 * AD.Game.cosePct[this.playerIndex], this.playerIndex);
                break
            case "牛排":
                this.foodNode.children[1].active = true;
                cc.find("handFood", this.node).children[1].active = true;
                this.thingType = "牛排";
                globalData.addFightCoin(-AD.foodCost.牛排 * AD.Game.cosePct[this.playerIndex], this.playerIndex);
                break
            case "薯条":
                this.foodNode.children[2].active = true;
                this.thingType = "薯条";
                cc.find("handFood", this.node).children[2].active = true;
                globalData.addFightCoin(-AD.foodCost.薯条 * AD.Game.cosePct[this.playerIndex], this.playerIndex);
                break
            case "可乐":
                this.foodNode.children[3].active = true;
                this.thingType = "可乐";
                cc.find("handFood", this.node).children[3].active = true;
                cc.find("handFood", this.node).children[3].getComponent(cc.Sprite).spriteFrame = this.foodNode.children[3].getComponent(cc.Sprite).spriteFrame
                globalData.addFightCoin(-AD.foodCost.可乐 * AD.Game.cosePct[this.playerIndex], this.playerIndex);
                break
        }
    },
    /**隐藏动画中的食物 */
    hideSpineFood() {
        cc.find("handFood", this.node).active = false;
        switch (this.thingType) {
            case "汉堡":
                this.foodNode.children[0].active = false;
                cc.find("handFood", this.node).children[0].active = false;
                break

            case "牛排":
                this.foodNode.children[1].active = false;
                cc.find("handFood", this.node).children[1].active = false;
                break
            case "薯条":
                this.foodNode.children[2].active = false;
                cc.find("handFood", this.node).children[2].active = false;
                break
            case "可乐":
                this.foodNode.children[3].active = false;
                cc.find("handFood", this.node).children[3].active = false;
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
    /** 设置角色动画
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

                }
                break
            case "移动":
                if (this.State == AD.playerState.摔倒) return   //摔倒
                if (!this.haveThing) {
                    //移动停止制作

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

        }
    },

    onCollisionEnter(other, self) {
        //tag = 1为食物
        if (other.tag == 1) {

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
                this.setSpine("撞倒");
                this.scheduleOnce(() => {
                    this.isTreadWater = false;
                }, 4)
            }
        }
        //tag = 3为障碍中的建筑碎片
        else if (other.tag == 3 && self.tag == 3) {
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
            }, AD.Game.dizzyTime[this.playerIndex])
            // console.log(other.node.parent.getComponent("jianZhu_fight"))
            other.node.getComponent("jianZhu_fight").onHitPlayer();
        }
    },
    onCollisionStay(other, self) {
        if (this.State == AD.playerState.移动) return
        if (this.State == AD.playerState.待机) {
            if (other.tag == 1) {

                if (this.otherNode.name == "canPan" || this.otherNode.name == "laJiTong") {
                    if (!this.haveThing) return
                    if (this.otherNode.name == "canPan") {
                        var sum = 0;
                        for (var j = 0; j < AD.Game.wantEatParent[this.playerIndex].children[0].getComponent("wantEat_fight").wantEatFood.length; j++) {
                            if (this.thingType == AD.Game.wantEatParent[this.playerIndex].children[0].getComponent("wantEat_fight").wantEatFood[j]) {
                                if (!AD.Game.wantEatParent[this.playerIndex].children[0].getComponent("wantEat_fight").foodTrue[j]) {
                                    if (this.thingType == "可乐") {
                                        if (this.foodNode.children[3].getComponent(cc.Sprite).spriteFrame != AD.Game.wantEatParent[this.playerIndex].children[0].children[j + 1].getComponent(cc.Sprite).spriteFrame) {
                                            if (!this.thingError) {
                                                this.thingError = true;
                                                AD.sound.playSfx("无法升级");
                                            }
                                            continue
                                        }
                                    }
                                    AD.sound.playSfx("上菜");
                                    this.State = AD.playerState.上菜
                                    this.setSpine("上菜");
                                    AD.Game.wantEatParent[this.playerIndex].children[0].getComponent("wantEat_fight").foodTrue[j] = true;
                                    this.touWeiIndex = [0, j];
                                    AD.Game.wantEatParent[this.playerIndex].children[this.touWeiIndex[0]].getComponent("wantEat_fight").onCreatTrueNode(this.touWeiIndex[1]);
                                    this.haveThing = false;
                                    this.hideSpineFood();
                                    this.onCanPanAddFood()
                                    AD.Game.wantEatParent[this.playerIndex].children[0].getComponent("wantEat_fight").wantEatFood[j] = ""
                                    this.thingType = "";
                                    return
                                }
                                else {
                                    if (this.thingError) return
                                    this.thingError = true;
                                    AD.sound.playSfx("无法升级");
                                    // AD.Game.onLaJiTongTip(true)
                                    // AD.Game.onTip("客人不喜欢这个");
                                    continue
                                }
                            }
                            else {
                                sum++;
                                if (sum >= AD.Game.wantEatParent[this.playerIndex].children[0].getComponent("wantEat_fight").wantEatFood.length) {
                                    if (this.thingError) return
                                    this.thingError = true;
                                    AD.sound.playSfx("无法升级");
                                    // AD.Game.onLaJiTongTip(true);
                                    // AD.Game.onTip("客人不喜欢这个");
                                }
                            }
                        }
                    }
                    else {
                        this.State = AD.playerState.倒垃圾;
                        this.setSpine("倒垃圾");
                        this.haveThing = false;
                        this.hideSpineFood();
                        this.thingType = "";
                    }
                }
                else {
                    if (this.haveThing) return
                    if (this.minigameOpen) return
                    this.minigameOpen = true;
                    switch (other.node.name) {
                        case "hanBao":
                            if (!this.onJudgeEnoughMoney(this.otherNode.name)) {
                                AD.Game.onShopManagerView()
                                return
                            }
                            this.onCloseAllMinigame();
                            cc.find("Canvas/minigame").children[this.playerIndex].active = true;
                            this.minigameTemp = cc.find("Canvas/minigame").children[this.playerIndex].getChildByName("hanBao");
                            this.minigameTemp.active = true;
                            break
                        case "niuPai":
                            if (!this.onJudgeEnoughMoney(this.otherNode.name)) {
                                AD.Game.onShopManagerView()
                                return
                            }
                            this.onCloseAllMinigame();
                            cc.find("Canvas/minigame").children[this.playerIndex].active = true;
                            this.minigameTemp = cc.find("Canvas/minigame").children[this.playerIndex].getChildByName("niuPai");
                            this.minigameTemp.active = true;
                            break
                        case "shuTiao":
                            if (!this.onJudgeEnoughMoney(this.otherNode.name)) {
                                AD.Game.onShopManagerView()
                                return
                            }
                            this.onCloseAllMinigame();
                            cc.find("Canvas/minigame").children[this.playerIndex].active = true;
                            this.minigameTemp = cc.find("Canvas/minigame").children[this.playerIndex].getChildByName("shuTiao");
                            this.minigameTemp.active = true;
                            break
                        case "keLeJi":
                            if (!this.onJudgeEnoughMoney(this.otherNode.name)) {
                                AD.Game.onShopManagerView()
                                return
                            }
                            this.onCloseAllMinigame();
                            cc.find("Canvas/minigame").children[this.playerIndex].active = true;
                            this.minigameTemp = cc.find("Canvas/minigame").children[this.playerIndex].getChildByName("yinLiao");
                            this.minigameTemp.active = true;
                            break

                    }
                    // this.State = AD.playerState.制作
                    // this.setSpine("制作");
                }

            }
        }

    },
    onCollisionExit(other, self) {
        if (other.tag == 1) {
            other.node.scale = 1;
            this.thingError = false;
            this.minigameOpen = false;
            if (other.node == this.otherNode) {

            }
        }
    },
    onJudgeEnoughMoney(str) {
        switch (str) {
            case "hanBao":
                if (globalData.data.fightCoin[this.playerIndex] < AD.foodCost.汉堡 * AD.Game.cosePct[this.playerIndex]) {
                    this.noMoney = true;
                    return false
                }
                else {
                    return true
                }
            case "keLeJi":
                if (globalData.data.fightCoin[this.playerIndex] < AD.foodCost.可乐 * AD.Game.cosePct[this.playerIndex]) {
                    this.noMoney = true;
                    return false
                }
                else {
                    return true
                }


            case "niuPai":
                if (globalData.data.fightCoin[this.playerIndex] < AD.foodCost.牛排 * AD.Game.cosePct[this.playerIndex]) {
                    this.noMoney = true;
                    return false
                }
                else {
                    return true
                }
            case "shuTiao":
                if (globalData.data.fightCoin[this.playerIndex] < AD.foodCost.薯条 * AD.Game.cosePct[this.playerIndex]) {
                    this.noMoney = true;
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
            case "牛排":
                index = 1;
                break
            case "薯条":
                index = 2;
                break
            case "可乐":
                index = 3;
                break
        }
        if (index == -1) return
        var food = cc.instantiate(AD.foodPre[index])
        food.parent = cc.find("Canvas/Player" + (this.playerIndex + 1) + "Panel/control/guiTai/canPan");
        if (this.thingType == "可乐") {
            food.getComponent(cc.Sprite).spriteFrame = this.foodNode.children[3].getComponent(cc.Sprite).spriteFrame;
        }
        food.position = AD.Game.canPanPos[AD.Game.servingNum[this.playerIndex]];
        this.scheduleOnce(() => {
            var _pos = food.parent.convertToWorldSpaceAR(food.position);
            var pos = cc.v2(_pos.x - cc.winSize.width / 2, _pos.y - cc.winSize.height / 2);
            food.parent = cc.find("Canvas/coinEffect");
            food.position = pos;
            var firstPos = [-470, 150]
            cc.tween(food)
                .to(1, { position: cc.v2(firstPos[this.playerIndex], 318) }, { easing: "sineInOut" })
                .call(() => {
                    food.destroy();
                })
                .start()
        }, 0.5)
        AD.Game.servingNum[this.playerIndex]++;
    },
    onCloseAllMinigame() {
        cc.find("Canvas/minigame").children[this.playerIndex].getChildByName("hanBao").active = false;
        cc.find("Canvas/minigame").children[this.playerIndex].getChildByName("niuPai").active = false;
        cc.find("Canvas/minigame").children[this.playerIndex].getChildByName("shuTiao").active = false;
        cc.find("Canvas/minigame").children[this.playerIndex].getChildByName("yinLiao").active = false;
    },
    
});
