cc.Class({
    extends: cc.Component,

    properties: {
        Music: {
            default: [],
            type: [cc.AudioClip]
        },
        audio: {
            default: [],
            type: [cc.AudioClip]
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        AD.sound = this;
        cc.game.addPersistRootNode(this.node);
        this.Block = cc.find("Block", this.node);
    },

    start() {

    },
    playSfx(_name) {
        switch (_name) {
            case "BGM":
                cc.audioEngine.playMusic(this.Music[0], true);
                cc.audioEngine.setMusicVolume(0.5);
                break
            case "机关Bgm":
                cc.audioEngine.playMusic(this.Music[1], true);
                cc.audioEngine.setMusicVolume(1);
                break
            case "按钮":
                cc.audioEngine.play(this.audio[0], false);
                break
            case "被砸晕":
                cc.audioEngine.play(this.audio[1], false);
                break
            case "地震1":
                this.diZhenAudio = cc.audioEngine.play(this.audio[2], true);
                break
            case "停止地震1":
                if (!this.diZhenAudio) return
                cc.audioEngine.stop(this.diZhenAudio);
                break
            case "升级":
                cc.audioEngine.play(this.audio[3], false);
                break
            case "掉落石头":
                cc.audioEngine.play(this.audio[4], false);
                break
            case "断电":
                cc.audioEngine.play(this.audio[5], false);
                break
            case "对决倒计时":
                cc.audioEngine.play(this.audio[6], false);
                break
            case "对决结算":
                cc.audioEngine.play(this.audio[7], false);
                break
            case "奖励钱":
                cc.audioEngine.play(this.audio[8], false);
                break
            case "正确"://接到薯条,放对汉堡
                cc.audioEngine.play(this.audio[9], false);
                break
            case "接水1":
                this.jieShui = cc.audioEngine.play(this.audio[10], false);
                break
            case "关闭接水1":
                if (!this.jieShui) return
                cc.audioEngine.stop(this.jieShui);
                break

            case "烤牛排1":
                this.kaoNiuPai = cc.audioEngine.play(this.audio[11], true);
                break
            case "关闭烤牛排1":
                if (!this.kaoNiuPai) return
                cc.audioEngine.stop(this.kaoNiuPai)
                break
            case "牛排点击正确":
                cc.audioEngine.play(this.audio[12], false);
                break
            case "饮料冒泡1":
                this.maoPao = cc.audioEngine.play(this.audio[13], true);
                break
            case "关闭饮料冒泡1":
                if (!this.maoPao) return
                cc.audioEngine.stop(this.maoPao);
                break
            case "拿到食物":
                cc.audioEngine.play(this.audio[14], false, 0.3);
                break
            case "碰撞":
                cc.audioEngine.play(this.audio[15], false);
                break
            case "上菜":
                cc.audioEngine.play(this.audio[16], false);
                break
            case "无法升级":
                cc.audioEngine.play(this.audio[17], false);
                break
            case "着火":
                cc.audioEngine.play(this.audio[18], false);
                break
            case "制作食物1":
                this.zhiZuo1 = cc.audioEngine.play(this.audio[19], true);

                break
            case "关闭制作食物1":
                if (!this.zhiZuo1) return
                cc.audioEngine.stop(this.zhiZuo1);

                break

            case "倒计时":
                cc.audioEngine.play(this.audio[20], false);
                break
            case "开始":
                cc.audioEngine.play(this.audio[21], false);
                break
            case "制作食物2":
                this.zhiZuo2 = cc.audioEngine.play(this.audio[22], true);

                break
            case "关闭制作食物2":
                if (!this.zhiZuo2) return
                cc.audioEngine.stop(this.zhiZuo2);

                break
            case "接水2":
                this.jieShui1 = cc.audioEngine.play(this.audio[23], false);
                break
            case "关闭接水2":
                if (!this.jieShui1) return
                cc.audioEngine.stop(this.jieShui1);
                break
            case "饮料冒泡2":
                this.maoPao1 = cc.audioEngine.play(this.audio[24], true);
                break
            case "关闭饮料冒泡2":
                if (!this.maoPao1) return
                cc.audioEngine.stop(this.maoPao1);
                break
            case "烤牛排2":
                this.kaoNiuPai1 = cc.audioEngine.play(this.audio[25], true);
                break
            case "关闭烤牛排2":
                if (!this.kaoNiuPai1) return
                cc.audioEngine.stop(this.kaoNiuPai1)
                break
            case "地震2":
                this.diZhenAudio1 = cc.audioEngine.play(this.audio[26], true);
                break
            case "停止地震2":
                if (!this.diZhenAudio1) return
                cc.audioEngine.stop(this.diZhenAudio1);
                break
            case "时钟":
                cc.audioEngine.play(this.audio[27], false);
                break
            case "天亮鸡叫":
                cc.audioEngine.play(this.audio[28], false);
                break
            case "未完成":
                cc.audioEngine.play(this.audio[29], false);
                break
            case "砸地上":
                cc.audioEngine.play(this.audio[30], false);
                break
            case "欢呼":
                cc.audioEngine.play(this.audio[31], false);
                break
        }
    },
    // update (dt) {},
});
