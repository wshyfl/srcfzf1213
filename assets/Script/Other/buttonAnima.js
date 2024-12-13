
var LoginType={
    scale:0,
    rotat:1
}
cc.Class({
    extends: cc.Component,

    properties: {
        state : {
            default : LoginType.rotat,
            type : cc.Enum(LoginType)
        },

        time:0.2,
        scaleSmall:0.95,
        scaleBig:1.05,
        timeTemp:0.3,
        angle:30,
        delayTimeN:3,
    },

    // onLoad () {},

    start () {
        if(this.node.name == "dk_icon"){
            this.state = LoginType.rotat
        }
        if(this.state==LoginType.scale){
            cc.tween(this.node)
            .repeatForever(
                cc.tween()
                .to(this.time,{scale:this.scaleBig})
                .to(this.time,{scale:this.scaleSmall})
                )
            .start()
        }
        else{
            cc.tween(this.node)
            .repeatForever(
                cc.tween()
                .to(this.timeTemp,{angle:this.angle})
                .to(this.timeTemp,{angle:-this.angle})
                .to(this.timeTemp,{angle:this.angle})
                .to(this.timeTemp,{angle:-this.angle})
                .to(this.timeTemp,{angle:0})
                .delay(this.delayTimeN)
            )
            .start()
        }
    },

    // update (dt) {},
});
