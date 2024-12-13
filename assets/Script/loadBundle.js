
cc.Class({
    extends: cc.Component,

    properties: {
        bundleAstNameArr:{
            default:[],
            type:[cc.String]
        },
        bundleSceneName:"Scene",

        sceneAll: {
            default: [],
            type: [cc.String]
        },
        nextScene:"", 
        
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
    },

    onLoad() {
        
        this.progressID = 0;//场景加载的 个数
        this.bundleIndex = 0;//资源bundle的加载个数
        // this.loadAst();
        
        this.loadSceneBundle()
       
    },
    //第一步 先加载所有资源
    loadAst(){
       
        var self = this;
        cc.assetManager.loadBundle(this.bundleAstNameArr[this.bundleIndex], (err, bundle) => {         
          
            if(err){
                console.log("加载错误  " + err);
            }
            else 
            {
                
                console.log("资源 " + this.bundleAstNameArr[this.bundleIndex] + " 加载成功");
                this.bundleIndex++;
                if(this.bundleIndex<this.bundleAstNameArr.length)
                {
                    self.loadAst();
                }
                else 
                {
                    console.log("资源bundle加载完毕 开始加载scene资源")
                    self.loadSceneBundle();//加载secene资源
                }
            }
          
        }); //加载场景资源

    
    },
    //第二部 加载场景
    loadSceneBundle(){
        if(this.sceneAll.length <= 0)
        {
            cc.director.loadScene(this.nextScene);
            return;
        }
        var self = this;
        cc.assetManager.loadBundle(this.bundleSceneName, (err, bundle) => {         
            for(var i=0;i<this.sceneAll.length;i++)
            {
                bundle.loadScene(self.sceneAll[i], (err, scene) => {
                    self.changeScene(scene);
                    
                })
            }
          
        }); //加载场景资源
    },
    changeScene(_scene){
        this.progressID++;
        console.log(_scene.name +"=>加载成功  " +"  this.progressID  "  + this.progressID);
        if(this.progressID >= this.sceneAll.length){
  
            cc.director.loadScene(this.nextScene);
            console.log("加载完毕  跳转至 " + "   nextScene  " + this.nextScene );
        }
    },
    // update (dt) {},
});
