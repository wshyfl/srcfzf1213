window.AD_Apk = {
    
    showVideo() {

        var _name="视频"
        if (cc.sys.os == cc.sys.OS_ANDROID) {
            //调用安卓方法
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "shiPin", "(Ljava/lang/String;)V", JSON.stringify(_name));
        }
        else{
            AD.reward()
        }
    },
    //VIVO
    showIcon(){
        var _name="showIcon"
        if (cc.sys.os == cc.sys.OS_ANDROID) {
            //调用安卓方法
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "showIcon", "(Ljava/lang/String;)V", JSON.stringify(_name));
        }
    },
    hideIcon(){
        var _name="hideIcon"
        if (cc.sys.os == cc.sys.OS_ANDROID) {
            //调用安卓方法
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "hideIcon", "(Ljava/lang/String;)V", JSON.stringify(_name));
        }
    },
    chaPingVideo(){
        var _name="全屏视频"
        if (cc.sys.os == cc.sys.OS_ANDROID) {
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "chaPingVideo", "(Ljava/lang/String;)V", JSON.stringify(_name));
        }
    },
    chaPing() {
        if (cc.sys.os == cc.sys.OS_ANDROID) {
            console.log("调用安卓方法banner ")
            //调用安卓方法
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "chaPing", "(Ljava/lang/String;)V", "插屏");
        }
    },
    
    showBanner() {
        console.log("banner 展示")
        if (cc.sys.os == cc.sys.OS_ANDROID) {
            console.log("调用安卓方法banner ")
            //调用安卓方法
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "showBanner", "(Ljava/lang/String;)V", "showBanner");
        }
    },
    hideBanner() {
        if (cc.sys.os == cc.sys.OS_ANDROID) {
            console.log("调用安卓方法关闭banner ")
            //调用安卓方法
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "hideBanner", "(Ljava/lang/String;)V", "hideBanner");
        }
    },
    /**同意隐私 */
    checkPermission(){
        var _name="checkPermission"
        if (cc.sys.os == cc.sys.OS_ANDROID) {
            //调用安卓方法
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "checkPermission", "(Ljava/lang/String;)V", JSON.stringify(_name));
        }
    },
    /**oppo更多游戏 */
    moreGameOppo(){
        var _name="更多游戏OPPO"
        if (cc.sys.os == cc.sys.OS_ANDROID) {
            //调用安卓方法
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "moreGameOppo", "(Ljava/lang/String;)V", JSON.stringify(_name));
        }
    },
    
}
