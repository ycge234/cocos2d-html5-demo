/****************************************************************************
--------------------by ycg
 ****************************************************************************/

var battlelayer;

var toastLayer;

var teamlayer;

var jsonData;

var gameModle;

var selectFriend = 0;

var bestScore = 0;

var showBossNum = 3;

var shareContent = "守护梦想，保卫偶像！中国梦之声，偶像需要你来保护！";

var shareTitle = "保卫偶像";

var shareImg = "http://api.51wala.com/h5/wala/img/icon.png";

var shareUrl = "http://api.51wala.com/h5/wala/bwox.html";

var hanhList = ["哦，嗓音不错哦！", "哈哈，谢谢！", "么么哒！", "是吗，哈哈哈！", "真的吗，哈哈！"];
var renxqList = ["谢谢你的支持啦！", "是吗，你也可以！", "那是当然咯！", "你这么说我很开心！"];
var hateList = ["小伙子药不能停啊。", "小伙子药不能停啊。", "小伙子别放弃治疗！"];
var goodList = ["老师你一直是我的偶像！", "老师，我爱你，么么哒！", "老师你是我的指路明灯！", "我听你的歌长大的！", "你的歌我百听不厌！"];
var badList = ["我双脚它说也要握！", "要握左手还是右手？", "我就是住你隔壁的老王？", "签名、拥抱、合唱我都要。", "(⊙o⊙)…，你是谁？"];

//统计分享量
var countShare = function(){
    var xhr = cc.loader.getXMLHttpRequest();
    xhr.open("GET", "http://api.51wala.com/guardIdol/share.json?src=wala");
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status <= 207)) {

        }
    };
    xhr.send();
};

//BOSS
var bossPeople = cc.Sprite.extend({
    state:1,//0 charging, 1 walking, 2 attacking 3 dieing, 4 dead
    animation_hate:null,
    animation_like:null,
    animation_wait:null,
    animation_fly:null,
    labelDialogue:null,
    sprDialogue:null,
    ctor:function(target){
        this._super("img/boss_wait_1.png");
        this.attr({
            anchorX:0.5,
            anchorY:0.5,
            target:target
        });

        this.addAnimation();
    },

    showDialogue:function(index){

    },

    hideDialogue:function(){

    },

    addAnimation:function(){
        this.animation_hate = new cc.Animation();
        var str = "img/boss_hate_1.png";
        this.animation_hate.addSpriteFrameWithFile(str);
        this.animation_hate.setDelayPerUnit(0.1);
        this.animation_hate.setRestoreOriginalFrame(false);

        this.animation_fly = new cc.Animation();
        str = "img/boss_fly_1.png";
        this.animation_fly.addSpriteFrameWithFile(str);
        this.animation_fly.setDelayPerUnit(0.1);
        this.animation_fly.setRestoreOriginalFrame(false);
    },

    like:function(){

        //var action = cc.animate(this.animation_like);
        //this.runAction(action);
    },

    hate:function(){
        var action = cc.animate(this.animation_hate);
        this.runAction(action);
    },
    wait:function(){
        var action = cc.animate(this.animation_wait);
        this.runAction(action);
    },
    hand:function(){
        var action = cc.animate(this.animation_hate);
        this.runAction(action);
    },
    fly:function(){
        var action = cc.animate(this.animation_fly);

        var action1 = cc.spawn(action, cc.rotateTo(1, 1080), cc.scaleTo(1, 0.5));
        return action1;
    },
    playAction:function(index){
        if(1 == index){
            this.like();
        }
        else if(0 == index){
            this.hate();
        }
        else if(2 == index){
            this.wait();
        }
    },
    isBoss:function(){
        return true;
    }
});

bossPeople.getFromPool= function(){

    var d = new bossPeople();
    return d;
};

//李勇啦
var liyPeople = cc.Sprite.extend({
    state:1,//0 charging, 1 walking, 2 attacking 3 dieing, 4 dead
    animation_liy_hate:null,
    animation_liy_like:null,
    ctor:function(target){
        this._super("#liy_wait_2.png");
        this.attr({
            anchorX:0.5,
            anchorY:0.5,
            target:target
        });
        this.addAnimation();
    },

    addAnimation:function(){
        this.animation_liy_hate = new cc.Animation();

        for (i = 2; i < 6; i++) {
            str = "img/liy_hate_" + i+ ".png";
            this.animation_liy_hate.addSpriteFrameWithFile(str);
        }
        this.animation_liy_hate.setDelayPerUnit(0.05);
        this.animation_liy_hate.setRestoreOriginalFrame(true);

        var animFrames = [];
        for (i = 1; i < 5; i++) {
            str = "liy_like_" + i+ ".png";
            var frame = cc.spriteFrameCache.getSpriteFrame(str);
            animFrames.push(frame);
        }
        this.animation_liy_like = new cc.Animation(animFrames, 0.03);
        this.animation_liy_like.setRestoreOriginalFrame(true);
    },

    like:function(){
        var action = cc.animate(this.animation_liy_like);
        this.runAction(action);
    },

    hate:function(){
        var action = cc.animate(this.animation_liy_hate);
        this.runAction(action);
    },
    playAction:function(index){
        if(1 == index ||  2 == index){
            this.like();
        }
        else if(0 == index){
            this.hate();
        }
    }
});

liyPeople.getFromPool= function(){

    var d = new liyPeople();
    return d;
};

//郭敬明啦
var guojmPeople = cc.Sprite.extend({
    state:1,//0 charging, 1 walking, 2 attacking 3 dieing, 4 dead
    animation_hate:null,
    animation_like:null,
    animation_wait:null,
    labelDialogue:null,
    sprDialogue:null,
    expDialogue:null,
    imgDialogue:null,
    ctor:function(target){
        this._super("#guojm_hate_1.png");
        this.attr({
            anchorX:0.5,
            anchorY:0.5,
            target:target
        });
        this.addAnimation();

        //对话
        this.sprDialogue = cc.Sprite.create("img/dialogue_1.png");
        this.sprDialogue.setAnchorPoint(0, 1);
        this.sprDialogue.setPosition(30, this.getContentSize().height + 80);
        this.addChild(this.sprDialogue);

        this.labelDialogue = cc.LabelTTF.create("", "Arial", 24);
        this.labelDialogue.setPosition(this.sprDialogue.getContentSize().width /2, this.sprDialogue.getContentSize().height /2 + 15)
        this.sprDialogue.addChild(this.labelDialogue);
        this.sprDialogue.setVisible(false);

        this.expDialogue = cc.Sprite.create("img/dialogue_5.png");
        this.expDialogue.setAnchorPoint(0, 1);
        this.expDialogue.setPosition(30, this.getContentSize().height + 80);
        this.addChild(this.expDialogue);

        this.imgDialogue = cc.Sprite.create("img/expression_1.png");
        this.imgDialogue.setPosition(this.expDialogue.getContentSize().width /2, this.expDialogue.getContentSize().height /2 + 15)
        this.expDialogue.addChild(this.imgDialogue);
        this.expDialogue.setVisible(false);
    },

    showDialogue:function(index){
        var random = parseInt(2*Math.random());
        if(0 == random){
            if(1 == index){
                this.labelDialogue.setString(renxqList[parseInt(4*Math.random())]);
                this.sprDialogue.setVisible(true);
            }
            else{
                this.labelDialogue.setString(hateList[parseInt(3*Math.random())]);
                this.sprDialogue.setVisible(true);
            }
        }
        else{
            var num = parseInt(20*Math.random()) + 1;
            this.imgDialogue.setTexture("img/expression_" + num + ".png");
            this.expDialogue.setVisible(true);
        }
    },

    hideDialogue:function(){
        this.sprDialogue.setVisible(false);
        this.expDialogue.setVisible(false);
    },

    addAnimation:function(){
        this.animation_hate = new cc.Animation();
        this.animation_like = new cc.Animation();

        var animFrames = [];
        for (i = 2; i < 4; i++) {
            str = "guojm_hate_" + i+ ".png";
            //this.animation_hate.addSpriteFrameWithFile(str);
            var frame = cc.spriteFrameCache.getSpriteFrame(str);
            animFrames.push(frame);
        }

        this.animation_hate = new cc.Animation(animFrames, 0.1);
        this.animation_hate.setRestoreOriginalFrame(false);

        var animFrames2 = [];
        for (i = 2; i > 0; i--) {
            str = "guojm_like_" + i+ ".png";
            var frame = cc.spriteFrameCache.getSpriteFrame(str);
            animFrames2.push(frame);
        }

        this.animation_like = new cc.Animation(animFrames2, 0.1);
        this.animation_like.setRestoreOriginalFrame(false);
    },

    like:function(){

        var action = cc.animate(this.animation_like);
        this.runAction(action);
    },

    hate:function(){
        var action = cc.animate(this.animation_hate);
        this.runAction(action);
    },
    wait:function(){
        var action = cc.animate(this.animation_wait);
        this.runAction(action);
    },
    playAction:function(index){
        if(1 == index){
            this.like();
        }
        else if(0 == index){
            this.hate();
        }
        else if(5 == index){
            this.hate();
        }

    }
});

guojmPeople.getFromPool= function(){

    var d = new guojmPeople();
    return d;
};

//徐若瑄啦
var xurxPeople = cc.Sprite.extend({
    state:1,//0 charging, 1 walking, 2 attacking 3 dieing, 4 dead
    animation_hate:null,
    animation_like:null,
    animation_wait:null,
    labelDialogue:null,
    sprDialogue:null,
    expDialogue:null,
    imgDialogue:null,
    ctor:function(target){
        this._super("#xurx_hate_1.png");
        this.attr({
            anchorX:0.5,
            anchorY:0.5,
            target:target
        });
        this.addAnimation();
        this.sprDialogue = cc.Sprite.create("img/dialogue_1.png");
        this.sprDialogue.setAnchorPoint(0, 1);
        this.sprDialogue.setPosition(30, this.getContentSize().height + 80);
        this.addChild(this.sprDialogue);

        this.labelDialogue = cc.LabelTTF.create("", "Arial", 24);
        this.labelDialogue.setPosition(this.sprDialogue.getContentSize().width /2, this.sprDialogue.getContentSize().height /2 + 15)
        this.sprDialogue.addChild(this.labelDialogue);
        this.sprDialogue.setVisible(false);

        //表情
        this.expDialogue = cc.Sprite.create("img/dialogue_5.png");
        this.expDialogue.setAnchorPoint(0, 1);
        this.expDialogue.setPosition(50, this.getContentSize().height + 80);
        this.addChild(this.expDialogue);

        this.imgDialogue = cc.Sprite.create("img/expression_1.png");
        this.imgDialogue.setPosition(this.expDialogue.getContentSize().width /2, this.expDialogue.getContentSize().height /2 + 15)
        this.expDialogue.addChild(this.imgDialogue);
        this.expDialogue.setVisible(false);
    },

    showDialogue:function(index){
        var random = parseInt(2*Math.random());
        if(0 == random){
            if(1 == index){
                this.labelDialogue.setString(renxqList[parseInt(4*Math.random())]);
                this.sprDialogue.setVisible(true);
            }
            else{
                this.labelDialogue.setString(hateList[parseInt(3*Math.random())]);
                this.sprDialogue.setVisible(true);
            }
        }
        else{
            var num = parseInt(20*Math.random()) + 1;
            this.imgDialogue.setTexture("img/expression_" + num + ".png");
            this.expDialogue.setVisible(true);
        }
    },

    hideDialogue:function(){
        this.sprDialogue.setVisible(false);
        this.expDialogue.setVisible(false);
    },

    addAnimation:function(){
        this.animation_hate = new cc.Animation();
        this.animation_like = new cc.Animation();

        var animFrames = [];
        for (i = 2; i < 4; i++) {
            str = "xurx_hate_" + i+ ".png";
            //this.animation_hate.addSpriteFrameWithFile(str);
            var frame = cc.spriteFrameCache.getSpriteFrame(str);
            animFrames.push(frame);
        }

        this.animation_hate = new cc.Animation(animFrames, 0.1);
        this.animation_hate.setRestoreOriginalFrame(false);

        var animFrames2 = [];
        for (i = 1; i < 3; i++) {
            str = "xurx_like_" + i+ ".png";
            var frame = cc.spriteFrameCache.getSpriteFrame(str);
            animFrames2.push(frame);
        }

        this.animation_like = new cc.Animation(animFrames2, 0.1);
        this.animation_like.setRestoreOriginalFrame(false);
    },

    like:function(){

        var action = cc.animate(this.animation_like);
        this.runAction(action);
    },

    hate:function(){
        var action = cc.animate(this.animation_hate);
        this.runAction(action);
    },
    wait:function(){
        var action = cc.animate(this.animation_wait);
        this.runAction(action);
    },
    playAction:function(index){
        if(1 == index){
            this.like();
        }
        else if(0 == index){
            this.hate();
        }
        else if(5 == index){
            this.hate();
        }

    }
});

xurxPeople.getFromPool= function(){

    var d = new xurxPeople();
    return d;
};

//韩红啦
var hanhPeople = cc.Sprite.extend({
    state:1,//0 charging, 1 walking, 2 attacking 3 dieing, 4 dead
    animation_hate:null,
    animation_like:null,
    animation_wait:null,
    labelDialogue:null,
    sprDialogue:null,
    expDialogue:null,
    imgDialogue:null,
    ctor:function(target){
        this._super("#hanh_hate_1.png");
        this.attr({
            anchorX:0.5,
            anchorY:0.5,
            target:target
        });
        this.addAnimation();

        this.sprDialogue = cc.Sprite.create("img/dialogue_1.png");
        this.sprDialogue.setAnchorPoint(0, 1);
        this.sprDialogue.setPosition(60, this.getContentSize().height + 50);
        this.addChild(this.sprDialogue);

        this.labelDialogue = cc.LabelTTF.create("", "Arial", 24);
        this.labelDialogue.setPosition(this.sprDialogue.getContentSize().width /2, this.sprDialogue.getContentSize().height /2 + 15)
        this.sprDialogue.addChild(this.labelDialogue);
        this.sprDialogue.setVisible(false);

        //表情
        this.expDialogue = cc.Sprite.create("img/dialogue_5.png");
        this.expDialogue.setAnchorPoint(0, 1);
        this.expDialogue.setPosition(50, this.getContentSize().height + 80);
        this.addChild(this.expDialogue);

        this.imgDialogue = cc.Sprite.create("img/expression_1.png");
        this.imgDialogue.setPosition(this.expDialogue.getContentSize().width /2, this.expDialogue.getContentSize().height /2 + 15)
        this.expDialogue.addChild(this.imgDialogue);
        this.expDialogue.setVisible(false);
    },

    showDialogue:function(index){
        var random = parseInt(2*Math.random());
        if(0 == random){
            if(1 == index){
                this.labelDialogue.setString(renxqList[parseInt(4*Math.random())]);
                this.sprDialogue.setVisible(true);
            }
            else{
                this.labelDialogue.setString(hateList[parseInt(3*Math.random())]);
                this.sprDialogue.setVisible(true);
            }
        }
        else{
            var num = parseInt(20*Math.random()) + 1;
            this.imgDialogue.setTexture("img/expression_" + num + ".png");
            this.expDialogue.setVisible(true);
        }
    },

    hideDialogue:function(){
        this.sprDialogue.setVisible(false);
        this.expDialogue.setVisible(false);
    },

    addAnimation:function(){
        //this.animation_hate = new cc.Animation();
        //this.animation_like = new cc.Animation();

        var animFrames = [];
        for (i = 1; i < 4; i++) {
            str = "hanh_hate_" + i+ ".png";
            var frame = cc.spriteFrameCache.getSpriteFrame(str);
            animFrames.push(frame);
        }
        this.animation_hate = new cc.Animation(animFrames, 0.1);
        this.animation_hate.setRestoreOriginalFrame(false);

        var animFrames2 = [];
        for (i = 1; i < 3; i++) {
            str = "hanh_like_" + i+ ".png";
            var frame = cc.spriteFrameCache.getSpriteFrame(str);
            animFrames2.push(frame);
        }

        this.animation_like = new cc.Animation(animFrames2, 0.1);
        this.animation_like.setRestoreOriginalFrame(false);
    },

    like:function(){

        var action = cc.animate(this.animation_like);
        this.runAction(action);
    },

    hate:function(){
        var action = cc.animate(this.animation_hate);
        this.runAction(action);
    },
    wait:function(){
        var action = cc.animate(this.animation_wait);
        this.runAction(action);
    },
    playAction:function(index){
        if(1 == index){
            this.like();
        }
        else if(0 == index){
            this.hate();
        }
        else if(5 == index){
            this.hate();
        }

    }
});

hanhPeople.getFromPool= function(){

    var d = new hanhPeople();
    return d;
};

//任贤齐啦
var renxqPeople = cc.Sprite.extend({
    state:1,//0 charging, 1 walking, 2 attacking 3 dieing, 4 dead
    animation_hate:null,
    animation_like:null,
    animation_wait:null,
    labelDialogue:null,
    sprDialogue:null,
    expDialogue:null,
    imgDialogue:null,
    ctor:function(target){
        this._super("#renxq_hate_1.png");
        this.attr({
            anchorX:0.5,
            anchorY:0.5,
            target:target
        });
        this.addAnimation();
        this.sprDialogue = cc.Sprite.create("img/dialogue_1.png");
        this.sprDialogue.setAnchorPoint(0, 1);
        this.sprDialogue.setPosition(30, this.getContentSize().height + 80);
        this.addChild(this.sprDialogue);

        this.labelDialogue = cc.LabelTTF.create("", "Arial", 24);
        this.labelDialogue.setPosition(this.sprDialogue.getContentSize().width /2, this.sprDialogue.getContentSize().height /2 + 15)
        this.sprDialogue.addChild(this.labelDialogue);
        this.sprDialogue.setVisible(false);

        this.expDialogue = cc.Sprite.create("img/dialogue_5.png");
        this.expDialogue.setAnchorPoint(0, 1);
        this.expDialogue.setPosition(30, this.getContentSize().height + 80);
        this.addChild(this.expDialogue);

        this.imgDialogue = cc.Sprite.create("img/expression_1.png");
        this.imgDialogue.setPosition(this.expDialogue.getContentSize().width /2, this.expDialogue.getContentSize().height /2 + 15)
        this.expDialogue.addChild(this.imgDialogue);
        this.expDialogue.setVisible(false);
    },

    showDialogue:function(index){
        var random = parseInt(2*Math.random());
        if(0 == random){
            if(1 == index){
                this.labelDialogue.setString(renxqList[parseInt(4*Math.random())]);
                this.sprDialogue.setVisible(true);
            }
            else{
                this.labelDialogue.setString(hateList[parseInt(3*Math.random())]);
                this.sprDialogue.setVisible(true);
            }
        }
        else{
            var num = parseInt(20*Math.random()) + 1;
            this.imgDialogue.setTexture("img/expression_" + num + ".png");
            this.expDialogue.setVisible(true);
        }
    },

    hideDialogue:function(){
        this.sprDialogue.setVisible(false);
        this.expDialogue.setVisible(false);
    },

    addAnimation:function(){
        this.animation_hate = new cc.Animation();
        this.animation_like = new cc.Animation();

        var animFrames = [];
        for (i = 2; i < 4; i++) {
            str = "renxq_hate_" + i+ ".png";
            //this.animation_hate.addSpriteFrameWithFile(str);
            var frame = cc.spriteFrameCache.getSpriteFrame(str);
            animFrames.push(frame);
        }

        this.animation_hate = new cc.Animation(animFrames, 0.1);
        this.animation_hate.setRestoreOriginalFrame(false);

        var animFrames2 = [];
        for (i = 1; i < 3; i++) {
            str = "renxq_like_" + i+ ".png";
            var frame = cc.spriteFrameCache.getSpriteFrame(str);
            animFrames2.push(frame);
        }

        this.animation_like = new cc.Animation(animFrames2, 0.1);
        this.animation_like.setRestoreOriginalFrame(false);
    },

    like:function(){

        var action = cc.animate(this.animation_like);
        this.runAction(action);
    },

    hate:function(){
        var action = cc.animate(this.animation_hate);
        this.runAction(action);
    },
    wait:function(){
        var action = cc.animate(this.animation_wait);
        this.runAction(action);
    },
    playAction:function(index){
        if(1 == index){
            this.like();
        }
        else if(0 == index){
            this.hate();
        }
        else if(5 == index){
            this.hate();
        }

    }
});

renxqPeople.getFromPool= function(){

    var d = new renxqPeople();
    return d;
};

//好人啦
var goodPeople = cc.Sprite.extend({
    state:1,//0 charging, 1 walking, 2 attacking 3 dieing, 4 dead
    animation_hand:null,
    animation_fly:null,
    labelDialogue:null,
    sprDialogue:null,
    expDialogue:null,
    imgDialogue:null,
    ctor:function(target){
        this._super("#good_waiting.png");
        this.attr({
            anchorX:0.5,
            anchorY:0.5,
            target:target
        });
        this.addAnimation();

        this.sprDialogue = cc.Sprite.create("img/dialogue_2.png");
        this.sprDialogue.setAnchorPoint(0, 1);
        this.sprDialogue.setPosition(100, this.getContentSize().height + 60);
        this.addChild(this.sprDialogue);

        this.labelDialogue = cc.LabelTTF.create("", "Arial", 24);
        this.labelDialogue.setColor(0,0,0);
        this.labelDialogue.setPosition(this.sprDialogue.getContentSize().width /2, this.sprDialogue.getContentSize().height /2 + 15)
        this.sprDialogue.addChild(this.labelDialogue);
        this.sprDialogue.setVisible(false);

        this.expDialogue = cc.Sprite.create("img/dialogue_5.png");
        this.expDialogue.setAnchorPoint(0, 1);
        this.expDialogue.setPosition(100, this.getContentSize().height + 60);
        this.addChild(this.expDialogue);

        this.imgDialogue = cc.Sprite.create("img/expression_1.png");
        this.imgDialogue.setPosition(this.expDialogue.getContentSize().width /2, this.expDialogue.getContentSize().height /2 + 15)
        this.expDialogue.addChild(this.imgDialogue);
        this.expDialogue.setVisible(false);
    },

    showDialogue:function(){
        var random = parseInt(2*Math.random());
        if(0 == random){
            this.labelDialogue.setString(goodList[parseInt(5*Math.random())]);
            this.sprDialogue.setVisible(true);
        }
        else{
            var num = parseInt(20*Math.random()) + 1;
            this.imgDialogue.setTexture("img/expression_" + num + ".png");
            this.expDialogue.setVisible(true);
        }
    },

    hideDialogue:function(){
        this.sprDialogue.setVisible(false);
        this.expDialogue.setVisible(false);
    },

    addAnimation:function(){
        var animFrames = [];
        for (i = 1; i < 3; i++) {
            str = "good_hand_" + i+ ".png";
            var frame = cc.spriteFrameCache.getSpriteFrame(str);
            animFrames.push(frame);
        }
        this.animation_hand = new cc.Animation(animFrames, 0.1);
        this.animation_hand.setRestoreOriginalFrame(false);

        var str = "good_fly_1.png";
        var frame = cc.spriteFrameCache.getSpriteFrame(str);
        this.animation_fly = new cc.Animation([frame], 0.1);
        this.animation_fly.setRestoreOriginalFrame(false);

    },

    hand:function(){
        var action = cc.animate(this.animation_hand);
        this.runAction(action);
    },
    fly:function(){
        var action = cc.animate(this.animation_fly);
        return action;
    },
    isBoss:function(){
        return false;
    }
});

goodPeople.getFromPool= function(){

    var d = new goodPeople();
    return d;
};

//坏人啦
var badPeople = cc.Sprite.extend({
    state:1,//0 charging, 1 walking, 2 attacking 3 dieing, 4 dead
    animation_hand:null,
    animation_fly:null,
    labelDialogue:null,
    sprDialogue:null,
    expDialogue:null,
    imgDialogue:null,
    ctor:function(target){
        this._super("#bad_hand_1.png");
        this.attr({
            anchorX:0.5,
            anchorY:0.5,
            target:target
        });
        this.addAnimation();

        this.sprDialogue = cc.Sprite.create("img/dialogue_2.png");
        this.sprDialogue.setAnchorPoint(0, 1);
        this.sprDialogue.setPosition(50, this.getContentSize().height + 40);
        this.addChild(this.sprDialogue);

        this.labelDialogue = cc.LabelTTF.create("", "Arial", 24);
        this.labelDialogue.setColor(0,0,0);
        this.labelDialogue.setPosition(this.sprDialogue.getContentSize().width /2, this.sprDialogue.getContentSize().height /2 + 15)
        this.sprDialogue.addChild(this.labelDialogue);
        this.sprDialogue.setVisible(false);

        this.expDialogue = cc.Sprite.create("img/dialogue_5.png");
        this.expDialogue.setAnchorPoint(0, 1);
        this.expDialogue.setPosition(50, this.getContentSize().height + 40);
        this.addChild(this.expDialogue);

        this.imgDialogue = cc.Sprite.create("img/expression_1.png");
        this.imgDialogue.setPosition(this.expDialogue.getContentSize().width /2, this.expDialogue.getContentSize().height /2 + 15)
        this.expDialogue.addChild(this.imgDialogue);
        this.expDialogue.setVisible(false);
    },

    showDialogue:function(){
        var random = parseInt(2*Math.random());
        if(0 == random){
            this.labelDialogue.setString(goodList[parseInt(5*Math.random())]);
            this.sprDialogue.setVisible(true);
        }
        else{
            var num = parseInt(20*Math.random()) + 1;
            this.imgDialogue.setTexture("img/expression_" + num + ".png");
            this.expDialogue.setVisible(true);
        }
    },

    hideDialogue:function(){
        this.sprDialogue.setVisible(false);
        this.expDialogue.setVisible(false);
    },

    addAnimation:function(){
        var animFrames = [];
        for (i = 2; i < 4; i++) {
            str = "bad_hand_" + i+ ".png";
            var frame = cc.spriteFrameCache.getSpriteFrame(str);
            animFrames.push(frame);
        }
        this.animation_hand = new cc.Animation(animFrames, 0.1);
        this.animation_hand.setRestoreOriginalFrame(false);

        var str = "bad_fly_1.png";
        var frame = cc.spriteFrameCache.getSpriteFrame(str);
        this.animation_fly = new cc.Animation([frame], 0.1);
        this.animation_fly.setRestoreOriginalFrame(false);
    },

    hand:function(){

        var action = cc.animate(this.animation_hand);

        this.runAction(action);
    },
    fly:function(){

        var action = cc.animate(this.animation_fly);

        return action;
    },
    isBoss:function(){
        return false;
    }
});

badPeople.getFromPool= function(){

    var d = new badPeople();
    return d;
};

//开始场景
var HelloLayer = cc.Layer.extend({

    init:function () {
        //////////////////////////////
        // 1. super init first
        this._super();
        //cc.audioEngine.playMusic("img/win.mp3", true);
        // ask director the window size

        var size = cc.director.getWinSize();

        var sprBackgroud = cc.Sprite.create("img/backgroud.png");
        sprBackgroud.setPosition(size.width/2, size.height/2);
        this.addChild(sprBackgroud, 0);

        var sprPeople1 = cc.Sprite.create("img/people_all.png");
        sprPeople1.setAnchorPoint(0.5, 0);
        sprPeople1.setPosition(size.width/2, 0);
        this.addChild(sprPeople1, 0);

//        var sprPeople1 = cc.Sprite.create("img/people_1.png");
//        sprPeople1.setPosition(size.width/2 + 100, size.height/2 - 50);
//        this.addChild(sprPeople1, 0);
//
//        var sprPeople2 = cc.Sprite.create("img/people_2.png");
//        sprPeople2.setPosition(size.width - 80, size.height/2 + 30);
//        this.addChild(sprPeople2, 1);
//
//        var sprPeople3 = cc.Sprite.create("img/people_3.png");
//        sprPeople3.setPosition(size.width/2 - 100, size.height/2 - 50);
//        this.addChild(sprPeople3, 0);
//
//        var sprPeople4 = cc.Sprite.create("img/people_4.png");
//        sprPeople4.setPosition(80, size.height/2 + 30);
//        this.addChild(sprPeople4, 0);

        //先关闭组队
//        var itemBegin = cc.MenuItemImage.create("img/buttonsingle.png", "img/buttonsingle.png", this.onMenuCallbackBegin, this);
//        itemBegin.setPosition(size.width/2, 280);
//
//        var itemBeginTeam = cc.MenuItemImage.create("img/buttonteam.png", "img/buttonteam.png", this.onMenuCallbackTeam, this);
//        itemBeginTeam.setPosition(size.width/2, 130);
//
//        var pMenu = cc.Menu.create(itemBegin, itemBeginTeam);
//        pMenu.setPosition(0, 0);

        var itemBegin = cc.MenuItemImage.create("img/buttonsingle.png", "img/buttonsingle.png", this.onMenuCallbackBegin, this);
        itemBegin.setPosition(size.width/2, 300);

        var itemBeginTeam = cc.MenuItemImage.create("img/buttonteam.png", "img/buttonteam.png", this.onMenuCallbackTeam, this);
        itemBeginTeam.setPosition(size.width/2, 150);

        var itemHelp = cc.MenuItemImage.create("img/buttonHelp.png", "img/buttonHelp.png", this.onMenuCallbackHelp, this);
        itemHelp.setPosition(size.width - 120, 50);

        var pMenu = cc.Menu.create(itemBegin, itemHelp, itemBeginTeam);

        this.addChild(pMenu, 5);
        pMenu.setPosition(0, 0);

    },

    sendGetRequest: function() {
        var that = this;
        var size = cc.director.getWinSize();
        var xhr = cc.loader.getXMLHttpRequest();
        xhr.open("GET", "http://api.51wala.com/guardIdol/group.json");
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status <= 207)) {
                jsonData = JSON.parse(xhr.responseText);

                that.removeFromParent(true);
                var scene = cc.director.getRunningScene();
                teamlayer = new teamLayer();
                teamlayer.init();
                scene.addChild(teamlayer);
            }
        };
        xhr.send();
    },



    onMenuCallbackBegin:function(){
        gameModle = 0;
        this.removeFromParent(true);
        var scene = cc.director.getRunningScene();
        battlelayer = new battleLayer();
        battlelayer.init();
        scene.addChild(battlelayer);

    },

    onMenuCallbackHelp:function(){
        var layer = new helpLayer();
        layer.init();
        this.addChild(layer, 5);
    },

    onMenuCallbackTeam:function(){
        gameModle = 1;
        this.sendGetRequest();
    }
});

//战斗场景
var battleLayer = cc.Layer.extend({
    isMouseDown:false,
    helloImg:null,
    helloLabel:null,
    circle:null,
    sprite:null,
    starttLocation:null,
    labelTitle:null,

    tableArray:null,
    sprJudges:null,
    sprBroker:null,

    spritePlayer:new Array(),
    sprPointUp:null,
    sprPointDown:null,
    isShowPointDown:false,
    isShowPointUp:false,

    //滑动方向
    MoveDirectionUp:0,
    MoveDirectionDown:1,
    MoveDirectionRight:2,
    MoveDirectionLeft:3,

    touchEnabled:true,

    MoveDirect:null,

    textureGood:null,
    textureGoodPass:null,
    textureGoodWaiting:null,

    sprCountdown:null,
    curCountdown:null,
    countdownTime:2.0,
    labelTime:null,

    strTotalNum:0,
    labelTotalNum:null,
    labelBestScore:null,

    randNum:3,
    bossNum:0,

    limitTime_1:0,
    limitTime_2:0,
    limitTime_3:0,
    limitTime_4:0,
    limitTimeAdd_1:-1000,
    limitTimeAdd_2:-1000,
    limitTimeAdd_3:-1000,
    limitTimeAdd_4:-1000,

    //疯狂模式
    energyNum:0,
    isCrazyModle:false,
    crazyTime:10,
    nextPeople:null,
    sprCrazy:null,
    sprCrazyModel:null,
    sprCrazyTime:null,

    curJudges:null,

    sprBossDialogue:null,

    init:function () {
        if (this._super()){

            var size = cc.director.getWinSize();
            var NumRand;

            this.curCountdown = this.countdownTime;
            var layer = new CountdownLayer();
            layer.init();
            this.addChild(layer, 99);

            var sprBackgroud = cc.Sprite.create("img/backgroud.png");
            sprBackgroud.setPosition(size.width/2, size.height/2);
            this.addChild(sprBackgroud, 0);

            var sprTimeBackGroud = cc.Sprite.create("img/time_1.png");
            sprTimeBackGroud.setPosition(size.width/2, 200);
            this.addChild(sprTimeBackGroud, 8);

            var sprTopBack = cc.Sprite.create("img/topBackgroud.png");
            sprTopBack.setAnchorPoint(0.5, 1)
            sprTopBack.setPosition(size.width/2, size.height);
            this.addChild(sprTopBack, 1);

//            var buttonBack = cc.MenuItemImage.create("img/advertising.png", "img/advertising.png", this.onMenuCallbackAdvertising, this);
//            buttonBack.setAnchorPoint(0.5, 0);
//            buttonBack.setPosition(size.width/2, 0);
//            var pMenu = cc.Menu.create(buttonBack);
//            pMenu.setPosition(0, 0);
//            this.addChild(pMenu, 1);

            this.labelTotalNum = new cc.LabelAtlas("0", "img/num.png", 36, 41, '.');
            this.labelTotalNum.setPosition(sprTopBack.getContentSize().width - 200, 12);
            sprTopBack.addChild(this.labelTotalNum, 1);

            this.labelBestScore = new cc.LabelAtlas("0", "img/num_blue.png", 33, 38, '0');
            this.labelBestScore.setString(bestScore);
            this.labelBestScore.setPosition(sprTopBack.getContentSize().width / 2 - 20, 65);
            sprTopBack.addChild(this.labelBestScore, 1);

            this.sprCountdown = cc.Sprite.create("img/time_2.png");
            this.sprCountdown.setAnchorPoint(0, 0)
            this.sprCountdown.setPosition(5, 5);
            sprTimeBackGroud.addChild(this.sprCountdown, 1);

            //this.labelTime = cc.LabelTTF.create(this.curCountdown + ".0", "Arial", 40);
            this.labelTime =  new cc.LabelAtlas(this.curCountdown + ".0", "img/num.png", 36, 41, '.');
            this.labelTime.setPosition(sprTimeBackGroud.getContentSize().width - 100, sprTimeBackGroud.getContentSize().height - 10);
            sprTimeBackGroud.addChild(this.labelTime, 1);

            var sprTimeBackGroud = cc.Sprite.create("img/backCrazyTime.png");
            sprTimeBackGroud.setPosition(size.width/2, 130);
            this.addChild(sprTimeBackGroud, 8);

            this.sprCrazy = cc.Sprite.create("img/crazyEnergy.png");
            this.sprCrazy.setAnchorPoint(0, 0)
            this.sprCrazy.setPosition(5, 5);
            this.sprCrazy.setScaleX(0);
            sprTimeBackGroud.addChild(this.sprCrazy, 1);

            //随机一个导师
            var NumRand = parseInt(3*Math.random());
            if(1 == NumRand){

                this.sprJudges = xurxPeople.getFromPool();
                this.curJudges = 1;
            }
            else if(0 == NumRand){
                this.sprJudges = renxqPeople.getFromPool();
                this.curJudges = 0;
            }
            else if(2 == NumRand){
                this.sprJudges = hanhPeople.getFromPool();
                this.curJudges = 2;
            }
            else if(3 == NumRand){
                this.sprJudges = guojmPeople.getFromPool();
                this.curJudges = 3;
            }

            this.sprJudges.setPosition(size.width/2 - 210, size.height/2);
            this.addChild(this.sprJudges, 5);

            this.sprBroker = liyPeople.getFromPool();
            this.sprBroker.setPosition(size.width - 150, 350);
            this.addChild(this.sprBroker, 5);

            this.sprPointUp = cc.Sprite.create("img/pointto.png");
            this.sprPointUp.setPosition(size.width/2 - 100, size.height/2 + 50);
            this.sprPointUp.setVisible(false);
            this.addChild(this.sprPointUp, 8);

            var sprFinger = cc.Sprite.create("img/finger.png");
            sprFinger.setPosition(this.sprPointUp.getContentSize().width/2 + 40, this.sprPointUp.getContentSize().height/2 - 20);
            this.sprPointUp.addChild(sprFinger, 1);
            //sprFinger.runAction(cc.sequence(cc.MoveBy.create(0.5, cc.p(30, -60)), cc.MoveBy.create(0.5, cc.p(-30, 60))).repeatForever());

            var sprDialogue = cc.Sprite.create("img/dialogue_3.png");
            sprDialogue.setPosition(this.sprPointUp.getContentSize().width + 50, this.sprPointUp.getContentSize().height / 2 + 80);
            this.sprPointUp.addChild(sprDialogue, 1);

            var labelDialogue = cc.LabelTTF.create("怀银出现，踢飞他！", "Arial", 28);
            labelDialogue.setPosition(sprDialogue.getContentSize().width / 2, sprDialogue.getContentSize().height / 2 + 15);
            sprDialogue.addChild(labelDialogue, 1);

            this.sprPointDown = cc.Sprite.create("img/pointto.png");
            this.sprPointDown.setPosition(size.width/2 - 70, size.height/2 - 140);
            this.sprPointDown.setRotation(180);
            this.sprPointDown.setVisible(false);
            this.addChild(this.sprPointDown, 8);

            var sprFinger = cc.Sprite.create("img/finger.png");
            sprFinger.setRotation(180);
            sprFinger.setPosition(20, this.sprPointUp.getContentSize().height/2 - 20);

            this.sprPointDown.addChild(sprFinger, 1);
            //sprFinger.runAction(cc.sequence(cc.MoveBy.create(0.5, cc.p(30, -60)), cc.MoveBy.create(0.5, cc.p(-30, 60))).repeatForever());

            var sprDialogue = cc.Sprite.create("img/dialogue_3.png");
            sprDialogue.setPosition(-100, 0);
            sprDialogue.setRotation(180);
            this.sprPointDown.addChild(sprDialogue, 1);

            var labelDialogue = cc.LabelTTF.create("粉丝来咯，请进", "Arial", 28);
            labelDialogue.setPosition(sprDialogue.getContentSize().width / 2, sprDialogue.getContentSize().height / 2 + 15);
            sprDialogue.addChild(labelDialogue, 1);

            for(var i = 0; i < 3; i++){
                NumRand = parseInt(2*Math.random());
                if(this.MoveDirectionUp == NumRand){

                    this.spritePlayer[i] = badPeople.getFromPool();
                }
                else if(this.MoveDirectionDown == NumRand){

                    this.spritePlayer[i] = goodPeople.getFromPool();
                }

                this.spritePlayer[i].moveDirect = NumRand;

                this.spritePlayer[i].setAnchorPoint(0.5, 0.5);
                this.spritePlayer[i].setPosition((size.width / 2 + 30) + 120*i, size.height / 2 + 80 *i);
                this.addChild(this.spritePlayer[i], (3-i), 5);
            }
            this.spritePlayer[1].setScale(0.85);
            this.spritePlayer[2].setScale(0.6);
            this.spritePlayer[0].hand();


            cc.eventManager.addListener({
                event:cc.EventListener.TOUCH_ONE_BY_ONE,
                swallowTouches:true,
                onTouchBegan:function(touch, event){
                    battlelayer.starttLocation = touch.getLocation();
                    return true;
                },
                onTouchMoved:function(touch, event)
                {
                    touch.getLocation();
                },
                onTouchEnded:function(touch, event)
                {
                    if (touch.length <= 0)
                        return;

                    var upLocation = touch.getLocation();
                    var defY = battlelayer.starttLocation.y - upLocation.y;

                    if(defY < 0){
                        battlelayer.MoveDirect = battlelayer.MoveDirectionUp;
                    }
                    else if(defY > 0){
                        battlelayer.MoveDirect = battlelayer.MoveDirectionDown;
                    }


                    battlelayer.updatePlayer(battlelayer.MoveDirect);

                }
            },this);

            return true;

        }
        return false;

    },

    onMenuCallbackAdvertising:function(){
        if (!cc.sys.isNative) {
            window.open("http://www.baidu.com", "_blank");
        }
    },

    updatePlayer:function(MoveDirect){

        var size = cc.director.getWinSize();
        var fade;
        var moveto;
        var scale;
        var actionFinal;
        var actionFly;
        if(this.touchEnabled){
            if(5 == this.spritePlayer[0].moveDirect){
                this.sprBroker.playAction(0);
            }
            else{
                this.touchEnabled = false;
                var spendTime = 2 - Math.round(this.curCountdown*10)/10;
                if(this.isCrazyModle == false){
                    if(0 < spendTime && spendTime < 0.3){
                        this.limitTime_1 = this.limitTime_1 + 1
                    }
                    else if(0.2 < spendTime && spendTime < 0.5){
                        this.limitTime_2 = this.limitTime_2 + 1
                    }
                    else if(0.4 < spendTime && spendTime < 0.9){
                        this.limitTime_3 = this.limitTime_3 + 1
                    }
                    else if(0.8 < spendTime && spendTime < 2){
                        this.limitTime_4 = this.limitTime_4 + 1
                    }
                }

                if (this.isCrazyModle == true){
                    moveto = cc.MoveTo.create(0.1, cc.p(20, 20));
                    actionFinal = cc.spawn(this.spritePlayer[0].fly(), moveto);

                    var moveto1 = cc.MoveTo.create(0.1, cc.p(size.width / 2 + 30, size.height / 2));
                    this.spritePlayer[1].runAction(moveto1);

                    var moveto2 = cc.MoveTo.create(0.1, cc.p(size.width / 2 + 30 + 120, size.height / 2 + 80));
                    this.spritePlayer[2].runAction(moveto2);
                    this.sprBroker.playAction(this.spritePlayer[0].moveDirect);
                    this.spritePlayer[0].runAction(cc.Sequence.create(actionFinal, cc.CallFunc.create(this.callBackAction, this)));
                    this.sprJudges.hideDialogue();
                    this.spritePlayer[0].hideDialogue();
                }
                else{
                    if (this.spritePlayer[0].moveDirect == MoveDirect){
                        if(this.spritePlayer[0].moveDirect == this.MoveDirectionDown)
                        {
                            moveto = cc.MoveTo.create(0.2, cc.p(20, 20));
                            actionFinal = cc.spawn(this.spritePlayer[0].fly(), moveto);
                        }

                        else if(this.spritePlayer[0].moveDirect == this.MoveDirectionUp){
                            if(this.spritePlayer[0].isBoss()){
                                this.sprBossDialogue = cc.Sprite.create("img/boss_dialogue.png");
                                this.sprBossDialogue.setPosition(size.width / 2 + 100, size.height - 150);
                                this.addChild(this.sprBossDialogue, 10);

                                moveto = cc.MoveTo.create(1, cc.p(20, size.height - 20));
                            }
                            else{
                                moveto = cc.MoveTo.create(0.2, cc.p(20, size.height - 20));
                            }
                            actionFinal = cc.spawn(this.spritePlayer[0].fly(),moveto);
                        }
                        var moveto1 = cc.MoveTo.create(0.1, cc.p(size.width / 2 + 30, size.height / 2));
                        this.spritePlayer[1].runAction(moveto1);

                        var moveto2 = cc.MoveTo.create(0.1, cc.p(size.width / 2 + 30 + 120, size.height / 2 + 80));
                        this.spritePlayer[2].runAction(moveto2);
                        this.sprBroker.playAction(this.spritePlayer[0].moveDirect);
                        this.spritePlayer[0].runAction(cc.Sequence.create(actionFinal, cc.CallFunc.create(this.callBackAction, this)));
                        this.sprJudges.hideDialogue();
                        this.spritePlayer[0].hideDialogue();
                    }
                    else {
                        this.callBackGameEnd();
                    }
                }
            }
        }
    },

    callBackGameEnd:function(){

        this.sprCountdown.setScaleX(0);
        this.labelTime.setString("0.0");
        this.touchEnabled = true;
        this.unschedule(this.callBackTime);
        if(0 == gameModle){
            var layer = new gameEndLayer();
            layer.init();
            this.addChild(layer, 99);
        }
        else{
            var layer = new teamEndLayer();
            layer.init();
            this.addChild(layer, 99);
        }
        this.sendPlayerRequest();
    },

    sendPlayerRequest: function(score) {
        var xhr = cc.loader.getXMLHttpRequest();
        var link = "http://api.51wala.com/guardIdol/play.json?src=wala";
        xhr.open("GET", link);
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status <= 207)) {

            }
        };
        xhr.send();
    },


    callBackTime:function(){
        if(this.curCountdown >= 0.1){

            this.curCountdown = this.curCountdown - 0.1;
            this.sprCountdown.setScaleX(this.curCountdown / this.countdownTime);
            this.labelTime.setString(Math.round(this.curCountdown*10)/10);

           if(1.9 == Math.round(this.curCountdown*10)/10){
                if(1 == this.spritePlayer[0].moveDirect && !this.isShowPointDown){
                    this.sprPointDown.setVisible(true);
                    this.isShowPointDown = true;
                }
                else if(1 == this.spritePlayer[0].moveDirect && this.isShowPointDown){
                    this.sprPointDown.removeFromParent(true);
                }
                else if(0 == this.spritePlayer[0].moveDirect && !this.isShowPointUp){
                    this.sprPointUp.setVisible(true);
                    this.isShowPointUp = true;
                }
                else if(0 == this.spritePlayer[0].moveDirect && this.isShowPointUp){
                    this.sprPointUp.removeFromParent(true);
                }
            }
        }
        else{
            this.sprPointUp.setVisible(false);
            this.sprPointDown.setVisible(false);
            this.callBackGameEnd();
        }
    },

    callBackAction:function(){
        var size = cc.director.getWinSize();
        this.strTotalNum = this.strTotalNum + 1;
        this.curCountdown = this.countdownTime;

        if(this.spritePlayer[0].isBoss()){
            this.sprBossDialogue.removeFromParentAndCleanup();
            this.schedule(this.callBackTime, 0.1);
        }

        if(this.isCrazyModle == false){

            if(50 == this.energyNum){
                if(this.countdownTime != 0.5){
                    this.countdownTime = this.countdownTime - 0.5;
                }
                this.sprCrazyModel = cc.Sprite.create("img/crazyModel.png");
                this.sprCrazyModel.setPosition(size.width / 2, size.height - 150);
                this.addChild(this.sprCrazyModel, 5);

                this.sprCrazyTime = new cc.LabelAtlas(this.crazyTime, "img/num.png", 36, 41, '.');
                this.sprCrazyTime.setPosition(size.width / 2 - 30, size.height - 260);
                this.addChild(this.sprCrazyTime, 10);

                this.isCrazyModle = true;
                this.labelTime.setVisible(false);
                this.sprCountdown.setScaleX(1);
                this.sprCrazy.setScaleX(1);
                this.unschedule(this.callBackTime);

                var layer = new CountdownLayer();
                layer.init(5);
                this.addChild(layer, 99);

            }
            else{
                this.energyNum = this.energyNum + 1;
                this.sprCrazy.setScaleX(this.energyNum / 50);
            }
            if((50 - 1) == this.energyNum || 50 == this.energyNum){
                this.nextPeople = this.MoveDirectionDown;
            }
            else{
                var NumRand = parseInt(2*Math.random());
                this.nextPeople = NumRand;
            }
        }
        else{
            this.nextPeople = this.MoveDirectionDown;
        }

        var size = cc.director.getWinSize();

        //var NumRand = parseInt(2*Math.random());
        this.spritePlayer[0].removeFromParent();
        this.spritePlayer[0] = null;

        if(this.MoveDirectionUp == this.nextPeople){
            this.spritePlayer[0] = badPeople.getFromPool();
        }
        else if (this.MoveDirectionDown == this.nextPeople){
            this.spritePlayer[0] = goodPeople.getFromPool();
            //this.sprJudges.showDialogue();
        }
        else if (this.MoveDirectionRight == this.nextPeople){
            //this.spritePlayer[0] = waitPeople.getFromPool()
        }
        this.spritePlayer[0].moveDirect = this.nextPeople;
        //BOSS
        if(this.limitTime_1 == (100 - 2) || this.limitTime_2 == (60 - 2) || this.limitTime_3 == (40 - 2) || this.limitTime_4 == (20 - 2)){
            this.spritePlayer[0] = bossPeople.getFromPool();
            this.spritePlayer[0].moveDirect = 5;
            if(this.limitTime_1 == (100 - 2)){
                this.limitTimeAdd_1 = this.strTotalNum;
            }
            if(this.limitTime_2 == (60 - 2)){
                this.limitTimeAdd_2 = this.strTotalNum;
            }
            if(this.limitTime_3 == (40 - 2)){
                this.limitTimeAdd_3 = this.strTotalNum;
            }
            if(this.limitTime_4 == (20 - 2)){
                this.limitTimeAdd_4 = this.strTotalNum;
            }
            this.limitTime_1 = 0;
            this.limitTime_2 = 0;
            this.limitTime_3 = 0;
            this.limitTime_4 = 0;

        }
        if(this.strTotalNum == this.limitTimeAdd_1 + 2 || this.strTotalNum == this.limitTimeAdd_2 + 2 || this.strTotalNum == this.limitTimeAdd_3 + 2 || this.strTotalNum == this.limitTimeAdd_4 + 2){
            this.limitTimeAdd_1 = -1000;
            this.limitTimeAdd_2 = -1000;
            this.limitTimeAdd_3 = -1000;
            this.limitTimeAdd_4 = -1000;
            this.bossNum = this.bossNum + 1;
            this.unschedule(this.callBackTime);
            var layer = new bossPauseLayer();
            layer.init();
            this.addChild(layer, 99);
        }

        this.addChild(this.spritePlayer[0], 1);
        this.spritePlayer[0].setOpacity(255);
        this.spritePlayer[0].setPosition(size.width / 2 + 30+ 120*2, size.height / 2 + 80*2);

        this.spritePlayer[0].setScale(0.6);
        //this.spritePlayer[0].setZOrder(1);

        this.spritePlayer[1].setScale(1);
        this.spritePlayer[1].setZOrder(3);
        this.spritePlayer[1].hand();
        this.sprJudges.playAction(this.spritePlayer[1].moveDirect);

        this.spritePlayer[2].setScale(0.85);
        this.spritePlayer[2].setZOrder(2);

        this.spritePlayer.push(this.spritePlayer.shift());

        this.touchEnabled = true;
        this.sprPointUp.setVisible(false);
        this.sprPointDown.setVisible(false);

        if(this.strTotalNum == this.randNum){
            this.randNum = this.randNum + parseInt((5 - 3 +1)*Math.random() + 3);
            this.sprJudges.showDialogue(this.spritePlayer[0].moveDirect);
            this.spritePlayer[0].showDialogue();
        }

        this.labelTotalNum.setString(this.strTotalNum);
    },

    callBackCrazyTime:function(){
        this.crazyTime = this.crazyTime - 1
        this.sprCrazy.setScaleX(this.crazyTime / 10);
        this.sprCrazyTime.setString(this.crazyTime);
        if(this.crazyTime == 0){
            this.unschedule(this.callBackCrazyTime);
            var layer = new CountdownLayer();
            layer.init(6);
            this.addChild(layer, 99);
        }
    },

    startGame:function(){

        this.schedule(this.callBackTime, 0.1);
        this.sprBroker.setTexture("img/liy_wait_1.png");
        this.sprJudges.playAction(this.spritePlayer[0].moveDirect);
        this.sprJudges.showDialogue(this.spritePlayer[0].moveDirect);
        this.spritePlayer[0].showDialogue();
    }
});

//BOSS暂停场景
var bossPauseLayer = cc.LayerColor.extend({
    sprGameEnd:null,
    init:function () {
        var size = cc.director.getWinSize();

        if (this._super(cc.color(0, 0, 0, 255))){
            cc.eventManager.addListener({
                event:cc.EventListener.TOUCH_ONE_BY_ONE,
                swallowTouches:true,
                onTouchBegan:function(t,e){
                    return true;
                },
                onTouchEnded:function(t,e){
                    e.getCurrentTarget().removeFromParent(true);
//                    var layer = new CountdownLayer();
//                    layer.init(1);
//                    battlelayer.addChild(layer, 99);

                    battlelayer.spritePlayer[0].moveDirect = 0;
                    if (battlelayer.bossNum == 1){
                        battlelayer.isShowPointUp = false;
                        battlelayer.sprPointUp = cc.Sprite.create("img/pointto.png");
                        battlelayer.sprPointUp.setPosition(size.width/2 - 70, size.height/2 - 140);
                        battlelayer.addChild(battlelayer.sprPointUp, 8);
                    }

                },
                onTouchMoved:function(){

                }
            },this);

            this.setOpacity(150);
            this.sprGameEnd = new cc.Sprite("img/backgroudbuy.png");
            this.sprGameEnd.setPosition(size.width/2, size.height/2);
            this.addChild(this.sprGameEnd, 1);

            var moveBy = cc.MoveBy.create(0.8, cc.p(0, 100));
            var action =  cc.Sequence.create(moveBy, cc.CallFunc.create(this.callBackAction, this)).repeatForever();
            this.sprGameEnd.runAction(action);

            var sprTitle = new cc.Sprite("img/boss_tip.png");
            sprTitle.setPosition(size.width/2, size.height/2 + 300);
            this.addChild(sprTitle, 2);

        }
    },
    callBackAction:function(){
        var size = cc.director.getWinSize();
        this.sprGameEnd.setPosition(size.width/2, size.height/2);
    },

    onMenuCallbackbuttonBack:function(){

    },

    onMenuCallbackbuttonShare:function(){
        this.removeFromParent(true);
        var layer = new CountdownLayer();
        layer.init(1);
        battlelayer.addChild(layer, 99);
    }

});

//组队场景
var teamLayer = cc.Layer.extend({
    itemBeginTeam:null,
    itemBegin:null,
    sprIcon_1:null,
    sprIcon_3:null,
    sprIcon_4:null,
    label_1:null,
    label_2:null,
    label_3:null,
    label_4:null,
    setFriend:false,
    backteam_1:null,
    labelMatch:null,
    init:function(){
        var that = this;
        var size = cc.director.getWinSize();

        var sprBackgroud = cc.Sprite.create("img/backgroud.png");
        sprBackgroud.setPosition(size.width/2, size.height/2);
        this.addChild(sprBackgroud, 0);

//        var sprLogo= cc.Sprite.create("img/logo.png");
//        sprLogo.setPosition(size.width/2, size.height/2 + 300);
//        this.addChild(sprLogo, 0);

        var size = cc.director.getWinSize();
        this.backteam_1 = new cc.Sprite("img/backteam.png");
        this.backteam_1.setPosition(size.width/2, size.height/2 - 200);
        this.addChild(this.backteam_1, 1);

        var backteam_2 = new cc.Sprite("img/backteam.png");
        backteam_2.setPosition(size.width/2, size.height/2 + 150);
        this.addChild(backteam_2, 1);

        var sprVS = new cc.Sprite("img/vs.png");
        sprVS.setPosition(size.width/2, size.height/2 - 20);
        this.addChild(sprVS, 1);

        var sprBackavatar_1 = new cc.Sprite("img/backavatar.png");
        sprBackavatar_1.setPosition(400, 95);
        this.backteam_1.addChild(sprBackavatar_1, 1);

        var sprBackavatar_2 = new cc.Sprite("img/backavatar.png");
        sprBackavatar_2.setPosition(100, 95);
        this.backteam_1.addChild(sprBackavatar_2, 1);

        var sprBackavatar_3 = new cc.Sprite("img/backavatar.png");
        sprBackavatar_3.setPosition(100, 95);
        backteam_2.addChild(sprBackavatar_3, 1);

        var sprBackavatar_4 = new cc.Sprite("img/backavatar.png");
        sprBackavatar_4.setPosition(400, 95);
        backteam_2.addChild(sprBackavatar_4, 1);

        this.itemBegin = cc.MenuItemImage.create("img/beginButton.png", "img/beginButton.png", this.onMenuCallbackBegin, this);
        this.itemBegin.setPosition(size.width/2, 90);

        this.itemBeginTeam = cc.MenuItemImage.create("img/buttonadd.png", "img/buttonadd.png", this.onMenuCallbackTeam, this);
        this.itemBeginTeam.setPosition(470, 300);

        var pMenu = cc.Menu.create(this.itemBegin, this.itemBeginTeam);
        pMenu.setPosition(0, 0);
        this.addChild(pMenu, 0);

        this.sprIcon_1 = new cc.Sprite("img/baseavatar.png");
        this.sprIcon_1.setPosition(100, 110);
        this.backteam_1.addChild(this.sprIcon_1, 0);

        cc.loader.loadImg(jsonData.self.avatar, {isCrossOrigin : false }, function(res,tex){
            this.sprIcon_1 = new cc.Sprite(tex);
            var scalX = 117/this.sprIcon_1.getContentSize().width;///设置x轴方向的缩放系数
            var scalY = 117/this.sprIcon_1.getContentSize().height;///设置x轴方向的缩放系数
            this.sprIcon_1.setScaleX(scalX);
            this.sprIcon_1.setScaleY(scalY);
            this.sprIcon_1.setPosition(100, 110);
            that.backteam_1.addChild(this.sprIcon_1, 0);
        });

        this.sprIcon_3 = new cc.Sprite("img/baseavatar.png");
        this.sprIcon_3.setPosition(100, 110);
        backteam_2.addChild(this.sprIcon_3, 0);

        this.sprIcon_4 = new cc.Sprite("img/baseavatar.png");
        this.sprIcon_4.setPosition(400, 110);
        backteam_2.addChild(this.sprIcon_4, 0);

        this.label_1 = cc.LabelTTF.create(jsonData.self.nickname, "Arial", 25);
        this.label_1.setPosition(100, 38);
        this.backteam_1.addChild(this.label_1, 2);

        this.label_2 = cc.LabelTTF.create("昵称", "Arial", 25);
        this.label_2.setPosition(400, 38);
        this.backteam_1.addChild(this.label_2, 2);

        this.label_3 = cc.LabelTTF.create("昵称", "Arial", 25);
        this.label_3.setPosition(100, 38);
        backteam_2.addChild(this.label_3, 2);

        this.label_4 = cc.LabelTTF.create("昵称", "Arial", 25);
        this.label_4.setPosition(400, 38);
        backteam_2.addChild(this.label_4, 2);

    },

    onMenuCallbackBegin:function(){
        var that = this;
        this.itemBegin.setVisible(false);
        this.itemBeginTeam.setVisible(false);
        this.labelMatch = cc.LabelTTF.create("匹配中·········", "Arial", 40);
        this.labelMatch.setPosition(640 / 2, 90);
        this.addChild(this.labelMatch, 1);
        this.schedule(this.callBackTime, 2);

    },

    callBackTime:function(){
        var that = this;
        this.unschedule(this.callBackTime);
        this.labelMatch.setVisible(false);

        if(false == this.setFriend){
            this.label_2.setString(jsonData.friend[0].nickname);
            cc.loader.loadImg(jsonData.friend[0].avatar,{isCrossOrigin : false }, function(res,tex){
                var sprite = new cc.Sprite(tex);
                var scalX = 117/sprite.getContentSize().width;///设置x轴方向的缩放系数
                var scalY = 117/sprite.getContentSize().height;///设置x轴方向的缩放系数
                sprite.setScaleX(scalX);
                sprite.setScaleY(scalY);
                sprite.setPosition(400, 110);
                that.backteam_1.addChild(sprite, 0);
            });
        }

        cc.loader.loadImg(jsonData.vsgroup[0].avatar,{isCrossOrigin : false }, function(res,tex){
            var sprite = new cc.Sprite(tex);
            sprite.setAnchorPoint(0, 0);
            var scalX = 117/sprite.getContentSize().width;///设置x轴方向的缩放系数
            var scalY = 117/sprite.getContentSize().height;///设置x轴方向的缩放系数
            sprite.setScaleX(scalX);
            sprite.setScaleY(scalY);
            that.sprIcon_3.addChild(sprite, 2);
        });

        cc.loader.loadImg(jsonData.vsgroup[1].avatar,{isCrossOrigin : false }, function(res,tex){
            var sprite = new cc.Sprite(tex);
            sprite.setAnchorPoint(0, 0);
            var scalX = 117/sprite.getContentSize().width;///设置x轴方向的缩放系数
            var scalY = 117/sprite.getContentSize().height;///设置x轴方向的缩放系数
            sprite.setScaleX(scalX);
            sprite.setScaleY(scalY);
            that.sprIcon_4.addChild(sprite, 2);
        });

        that.label_3.setString(jsonData.vsgroup[0].nickname);
        that.label_4.setString(jsonData.vsgroup[1].nickname);

        var layer = new CountdownLayer();
        layer.init(2);
        this.addChild(layer, 10);
    },

    onMenuCallbackTeam:function(){
        var layer = new chooseFriendLayer();
        layer.init();
        this.addChild(layer, 1);
    }

});

//选择好友场景
var chooseFriendLayer = cc.LayerColor.extend({
    labelDialogue:null,
    init:function(){
        if (this._super(cc.color(0, 0, 0, 255))){
            var size = cc.director.getWinSize();
            //this.setOpacity(150);
            cc.eventManager.addListener({
                event:cc.EventListener.TOUCH_ONE_BY_ONE,
                swallowTouches:true,
                onTouchBegan:function(t,e){
                    return true;
                },
                onTouchEnded:function(t,e){

                    //e.getCurrentTarget().removeFromParent();
                },
                onTouchMoved:function(){
                    return true;
                }
            },this);

            var sprBack = cc.Sprite.create("img/backgroud.png");
            sprBack.setPosition(size.width/2, size.height/2);
            this.addChild(sprBack, 0);

            var sprBackGroud = cc.Sprite.create("img/backgroudfriend.png");
            sprBackGroud.setPosition(size.width/2, size.height/2 + 30);
            this.addChild(sprBackGroud, 0);

            var itemBack = cc.MenuItemImage.create("img/buttonback.png", "img/buttonback.png", this.onMenuCallback, this);
            itemBack.setPosition(size.width/2, 70);

            var scrollView = new ccui.ScrollView();
            scrollView.setDirection(ccui.ScrollView.DIR_VERTICAL);
            scrollView.setTouchEnabled(true);
            scrollView.setContentSize(cc.size(540, 640));
            scrollView.setInnerContainerSize(cc.size(540, 960));

            scrollView.x = 50;
            scrollView.y = 160;

            this.addChild(scrollView, 2);

            var labelTime = cc.Sprite.create("img/backavatar.png");
            var contentSize = labelTime.getContentSize();

            var num = 0;

            for(var i=0; i<jsonData.friend.length; i++) {
                var labelTime = cc.Sprite.create("img/backavatar.png");
                labelTime.setAnchorPoint(0, 1);
                labelTime.setPosition(0 + (contentSize.width + 10) * (i % 3), scrollView.getInnerContainerSize().height - (contentSize.width + 10) * (Math.ceil((i+1) / 3) - 1));
                scrollView.addChild(labelTime, 2);


                cc.loader.loadImg(jsonData.friend[i].avatar,{isCrossOrigin : false }, function(res,tex){
                    var sprite = new cc.Sprite(tex);
                    sprite.setAnchorPoint(0, 1);
                    var scalX = 117/sprite.getContentSize().width;///设置x轴方向的缩放系数
                    var scalY = 117/sprite.getContentSize().height;///设置x轴方向的缩放系数
                    sprite.setScaleX(scalX);
                    sprite.setScaleY(scalY);
                    sprite.setPosition(26 + (contentSize.width + 10) * (num % 3), scrollView.getInnerContainerSize().height - 5 - (contentSize.width + 10) * (Math.ceil((num+1) / 3) - 1));
                    scrollView.addChild(sprite, 1);
                    num = num +1 ;
                });

                var button = ccui.Button.create();
                button.loadTextures("img/back.png", "img/back.png", "");
                button.setTag(i);
                button.x = contentSize.width / 2;
                button.y = contentSize.height / 2 + 18;
                button.addTouchEventListener(this.buttonCallBack, this);
                labelTime.addChild(button, -5);

                var labelName = cc.LabelTTF.create(jsonData.friend[i].nickname, "Arial", 25);
                labelName.setPosition(contentSize.width / 2, 24);
                labelTime.addChild(labelName, 1);

            }
            var pMenu = cc.Menu.create(itemBack);
            pMenu.setPosition(0, 0);
            this.addChild(pMenu, 0);
        }
    },

    //选择好友
    buttonCallBack:function(render, type){
        var tag = render.getTag();
        selectFriend = tag;
        teamlayer.setFriend = true;
        teamlayer.itemBeginTeam.removeAllChildren(false);
        teamlayer.label_2.setString(jsonData.friend[tag].nickname);
        cc.loader.loadImg(jsonData.friend[tag].avatar,{isCrossOrigin : false }, function(res,tex){
            var sprite = new cc.Sprite(tex);
            var scalX = 117/sprite.getContentSize().width;///设置x轴方向的缩放系数
            var scalY = 117/sprite.getContentSize().height;///设置x轴方向的缩放系数
            sprite.setScaleX(scalX);
            sprite.setScaleY(scalY);
            sprite.setAnchorPoint(0.5, 0);
            sprite.setPosition(400, 53);
            teamlayer.backteam_1.addChild(sprite, 0);
        });

        this.removeFromParent(true);

    },

    onMenuCallback:function(){
        this.removeFromParent(true);

    }
});

//单人结束场景
var gameEndLayer = cc.LayerColor.extend({
    sprGameEnd:null,
    init:function () {
        var size = cc.director.getWinSize();

        if (this._super(cc.color(0, 0, 0, 255))){
            cc.eventManager.addListener({
                event:cc.EventListener.TOUCH_ONE_BY_ONE,
                swallowTouches:true,
                onTouchBegan:function(t,e){
                    return true;
                },
                onTouchEnded:function(t,e){

                    //e.getCurrentTarget().removeFromParent();
                },
                onTouchMoved:function(){
                    return true;
                }
            },this);

            var name = "";
            if(0 == battlelayer.curJudges){
                name = "小齐齐";
            }
            else if (1 == battlelayer.curJudges){
                name = "小瑄瑄";
            }
            else if (2 == battlelayer.curJudges){
                name = "小红红";
            }
            else if (3 == battlelayer.curJudges){
                name = "小明明";
            }
            var num = parseInt(2*Math.random());
            if(0 == num){
                shareContent = "我撸了" + name + "的" + battlelayer.strTotalNum + "个粉丝，我不是loser！谁是撸sir？";
            }
            else{
                shareContent = "我撸了" + name + "的" + battlelayer.strTotalNum + "个粉丝，叫我撸sir！谁是loser？";
            }

            this.setOpacity(150);
            this.sprGameEnd = new cc.Sprite();
            this.sprGameEnd.setContentSize(cc.size(623, 625));
            this.sprGameEnd.setPosition(size.width/2, size.height/2);
            this.addChild(this.sprGameEnd, 0);

            var labelNum = new cc.LabelAtlas("0", "img/num.png", 36, 41, '.');
            labelNum.setString(battlelayer.strTotalNum);
            if (battlelayer.strTotalNum > bestScore){
                bestScore = battlelayer.strTotalNum
                this.sendScoreRequest(bestScore);
            }
            labelNum.setPosition(size.width/2 + 60, size.height/2 - 100);
            this.sprGameEnd.addChild(labelNum, 0);

            var strGameEnd = cc.Sprite.create("img/str_gameend.png");
            strGameEnd.setPosition(size.width/2, size.height/2 + 50);
            this.sprGameEnd.addChild(strGameEnd, 0);

            var strPop = cc.Sprite.create("img/str_popularity.png");
            strPop.setPosition(size.width/2 - 140, size.height/2 - 80);
            this.sprGameEnd.addChild(strPop, 0);

            var buttonBack = cc.MenuItemImage.create("img/buttonAgain.png", "img/buttonAgain.png", this.onMenuCallbackbuttonBack, this);
            buttonBack.setPosition(-150, -80);

            var buttonShare = cc.MenuItemImage.create("img/buttonshare.png", "img/buttonshare.png", this.onMenuCallbackbuttonShare, this);
            buttonShare.setPosition(150, -80);

            var pMenu = cc.Menu.create(buttonBack, buttonShare);

            this.sprGameEnd.addChild(pMenu, 5);
            pMenu.setPosition(this.sprGameEnd.getContentSize().width/2, this.sprGameEnd.getContentSize().height / 2 - 80);
        }
    },

    onMenuCallbackbuttonBack:function(){

        var scene = cc.director.getRunningScene();
        scene.removeAllChildren();
        var layer = new HelloLayer();
        layer.init();
        scene.addChild(layer);
    },

    onMenuCallbackbuttonTx:function(){
        if (!cc.sys.isNative) {
            countShare();
            window.open("http://v.t.qq.com/share/share.php?title=" + shareContent + "&pic=" + shareImg + "&url=" + shareUrl, "_blank");

        }
    },

    sendScoreRequest: function(score) {
        var xhr = cc.loader.getXMLHttpRequest();
        var link = "http://api.51wala.com/guardIdol/sync.json?res=" + score;
        xhr.open("GET", link);
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status <= 207)) {

            }
        };
        xhr.send();
    },

    onMenuCallbackbuttonWeibo:function(){
        if (!cc.sys.isNative) {
            countShare();
            window.open("http://v.t.sina.com.cn/share/share.php?pic=" + shareImg + "&title=" + shareContent + "&url=" + shareUrl, "_blank");
        }
    },

    onMenuCallbackbuttonWeixinOne:function(){
        if (!cc.sys.isNative) {
            countShare();
            var text="wala://weixin.shareToFriend?link=" + encodeURIComponent(shareUrl)+ "&imgUrl=" + encodeURIComponent(shareImg) + "&title=" + encodeURIComponent(shareTitle) +"&desc=" + encodeURIComponent(shareContent)
            window.open(text, "_blank");
        }
    },

    onMenuCallbackbuttonWeixinTwo:function(){
        if (!cc.sys.isNative) {
            countShare();
            var text="wala://weixin.shareToTimeline?link=" + encodeURIComponent(shareUrl)+ "&imgUrl=" + encodeURIComponent(shareImg) + "&title=" + encodeURIComponent(shareTitle) +"&desc=" + encodeURIComponent(shareContent)
            window.open(text, "_blank");
        }
    },

    onMenuCallbackbuttonCancel:function(){

        var scene = cc.director.getRunningScene();
        scene.removeAllChildren();
        var layer = new HelloLayer();
        layer.init();
        scene.addChild(layer);
    },

    onMenuCallbackbuttonShare:function(){

        var size = cc.director.getWinSize();

        this.sprGameEnd.removeFromParent(true);

        toastLayer = new cc.Layer();
        this.addChild(toastLayer, 10);

        var sprBackGroud = cc.Sprite.create("img/backGroudShare.png");
        sprBackGroud.setAnchorPoint(0.5, 0);
        sprBackGroud.setPosition(size.width/2, 0);
        toastLayer.addChild(sprBackGroud, 1);

        var buttonCancel = cc.MenuItemImage.create("img/buttonQuitShare.png", "img/buttonQuitShare.png", this.onMenuCallbackbuttonCancel, this);
        buttonCancel.setPosition(size.width/2, 80);

        var buttonTx = cc.MenuItemImage.create("img/txweibo.png", "img/txweibo.png", this.onMenuCallbackbuttonTx, this);
        buttonTx.setPosition(550, 250);
        var labelTx = cc.LabelTTF.create("分享腾讯微博", "Arial", 24);
        labelTx.setPosition(buttonTx.getContentSize().width / 2, -20);
        buttonTx.addChild(labelTx, 1);

        var buttonWeibo = cc.MenuItemImage.create("img/weibo.png", "img/weibo.png", this.onMenuCallbackbuttonWeibo, this);
        buttonWeibo.setPosition(400, 250);
        var labelWeibo = cc.LabelTTF.create("分享新浪微博", "Arial", 24);
        labelWeibo.setPosition(buttonWeibo.getContentSize().width / 2, -20);
        buttonWeibo.addChild(labelWeibo, 1);

        var buttonWeixin = cc.MenuItemImage.create("img/weixin_1.png", "img/weixin_1.png", this.onMenuCallbackbuttonWeixinOne, this);
        buttonWeixin.setPosition(100, 250);
        var labelWeixin = cc.LabelTTF.create("分享微信朋友", "Arial", 24);
        labelWeixin.setPosition(buttonWeibo.getContentSize().width / 2, -20);
        buttonWeixin.addChild(labelWeixin, 1);

        var buttonWeixin2 = cc.MenuItemImage.create("img/weixin_2.png", "img/weixin_2.png", this.onMenuCallbackbuttonWeixinTwo, this);
        buttonWeixin2.setPosition(250, 250);
        var labelWeixin2 = cc.LabelTTF.create("分享到朋友圈", "Arial", 24);
        labelWeixin2.setPosition(buttonWeixin2.getContentSize().width / 2, -20);
        buttonWeixin2.addChild(labelWeixin2, 1);

        var pMenu = cc.Menu.create(buttonTx, buttonWeibo, buttonWeixin, buttonWeixin2, buttonCancel);
        pMenu.setPosition(0, 0);
        sprBackGroud.addChild(pMenu, 5);

    }
});

//组队结算界面
var teamEndLayer = cc.LayerColor.extend({
    sprGameEnd:null,
    backteam_1:null,
    sprIcon_1:null,
    label_1:null,
    label_2:null,
    label_3:null,
    label_4:null,
    labelTotolNum_1:null,
    labelTotolNum_2:null,
    curTime:0,
    totolNum_1:0,
    totolNum_2:0,
    numAdd_1:0,
    numAdd_2:0,
    buttonBack:null,
    buttonShare:null,
    init:function () {
        var size = cc.director.getWinSize();
        var that = this;
        if (this._super(cc.color(0, 0, 0, 255))){
            cc.eventManager.addListener({
                event:cc.EventListener.TOUCH_ONE_BY_ONE,
                swallowTouches:true,
                onTouchBegan:function(t,e){
                    return true;
                },
                onTouchEnded:function(t,e){

                    //e.getCurrentTarget().removeFromParent();
                },
                onTouchMoved:function(){
                    return true;
                }
            },this);

            var name = "";
            if(0 == battlelayer.curJudges){
                name = "小齐齐";
            }
            else if (1 == battlelayer.curJudges){
                name = "小瑄瑄";
            }
            else if (2 == battlelayer.curJudges){
                name = "小红红";
            }
            else if (3 == battlelayer.curJudges){
                name = "小明明";
            }
            var num = parseInt(2*Math.random());
            if(0 == num){
                shareContent = "我撸了" + name + "的" + battlelayer.strTotalNum + "个粉丝，我不是loser！谁是撸sir？";
            }
            else{
                shareContent = "我撸了" + name + "的" + battlelayer.strTotalNum + "个粉丝，叫我撸sir！谁是loser？";
            }

            this.setOpacity(150);
            this.sprGameEnd = new cc.Sprite();
            this.sprGameEnd.setContentSize(cc.size(623, 625));
            this.sprGameEnd.setPosition(size.width/2, size.height/2);
            this.addChild(this.sprGameEnd, 0);

            this.backteam_1 = new cc.Sprite("img/backteam.png");
            this.backteam_1.setPosition(size.width/2, size.height/2 - 100);
            this.addChild(this.backteam_1, 1);

            var backteam_2 = new cc.Sprite("img/backteam.png");
            backteam_2.setPosition(size.width/2, size.height/2 + 250);
            this.addChild(backteam_2, 1);

            var sprBackavatar_1 = new cc.Sprite("img/backavatar.png");
            sprBackavatar_1.setPosition(400, 95);
            this.backteam_1.addChild(sprBackavatar_1, 1);

            var sprBackavatar_2 = new cc.Sprite("img/backavatar.png");
            sprBackavatar_2.setPosition(100, 95);
            this.backteam_1.addChild(sprBackavatar_2, 1);

            var sprBackavatar_3 = new cc.Sprite("img/backavatar.png");
            sprBackavatar_3.setPosition(100, 95);
            backteam_2.addChild(sprBackavatar_3, 1);

            var sprBackavatar_4 = new cc.Sprite("img/backavatar.png");
            sprBackavatar_4.setPosition(400, 95);
            backteam_2.addChild(sprBackavatar_4, 1);

            cc.loader.loadImg(jsonData.self.avatar, {isCrossOrigin : false }, function(res,tex){
                this.sprIcon_1 = new cc.Sprite(tex);
                var scalX = 117/this.sprIcon_1.getContentSize().width;///设置x轴方向的缩放系数
                var scalY = 117/this.sprIcon_1.getContentSize().height;///设置x轴方向的缩放系数
                this.sprIcon_1.setScaleX(scalX);
                this.sprIcon_1.setScaleY(scalY);
                this.sprIcon_1.setPosition(100, 110);
                that.backteam_1.addChild(this.sprIcon_1, 0);
            });

            cc.loader.loadImg(jsonData.friend[selectFriend].avatar,{isCrossOrigin : false }, function(res,tex){
                var sprite = new cc.Sprite(tex);
                var scalX = 117/sprite.getContentSize().width;///设置x轴方向的缩放系数
                var scalY = 117/sprite.getContentSize().height;///设置x轴方向的缩放系数
                sprite.setScaleX(scalX);
                sprite.setScaleY(scalY);
                sprite.setPosition(400, 110);
                that.backteam_1.addChild(sprite, 0);
            });

            cc.loader.loadImg(jsonData.vsgroup[0].avatar,{isCrossOrigin : false }, function(res,tex){
                var sprite = new cc.Sprite(tex);
                var scalX = 117/sprite.getContentSize().width;///设置x轴方向的缩放系数
                var scalY = 117/sprite.getContentSize().height;///设置x轴方向的缩放系数
                sprite.setScaleX(scalX);
                sprite.setScaleY(scalY);
                sprite.setPosition(100, 110);
                backteam_2.addChild(sprite, 2);
            });

            cc.loader.loadImg(jsonData.vsgroup[1].avatar,{isCrossOrigin : false }, function(res,tex){
                var sprite = new cc.Sprite(tex);
                var scalX = 117/sprite.getContentSize().width;///设置x轴方向的缩放系数
                var scalY = 117/sprite.getContentSize().height;///设置x轴方向的缩放系数
                sprite.setScaleX(scalX);
                sprite.setScaleY(scalY);
                sprite.setPosition(400, 110);
                backteam_2.addChild(sprite, 2);
            });

            this.label_1 = cc.LabelTTF.create(jsonData.self.nickname, "Arial", 25);
            this.label_1.setPosition(100, 38);
            this.backteam_1.addChild(this.label_1, 2);

            this.label_2 = cc.LabelTTF.create(jsonData.friend[selectFriend].nickname, "Arial", 25);
            this.label_2.setPosition(400, 38);
            this.backteam_1.addChild(this.label_2, 2);

            this.label_3 = cc.LabelTTF.create(jsonData.vsgroup[0].nickname, "Arial", 25);
            this.label_3.setPosition(100, 38);
            backteam_2.addChild(this.label_3, 2);

            this.label_4 = cc.LabelTTF.create(jsonData.vsgroup[1].nickname, "Arial", 25);
            this.label_4.setPosition(400, 38);
            backteam_2.addChild(this.label_4, 2);

            var labelNum_1 = cc.LabelTTF.create("人气值： " + battlelayer.strTotalNum, "Arial", 32);
            //labelNum_1.setColor(cc.color.RED);
            labelNum_1.setPosition(100, -20);
            this.backteam_1.addChild(labelNum_1, 2);

            if(0 == jsonData.friend[selectFriend].gameScore){
                jsonData.friend[selectFriend].gameScore = battlelayer.strTotalNum + Math.floor(((20 + 20) + 1) * Math.random() - 20);
                if(0 > jsonData.friend[selectFriend].gameScore){
                    jsonData.friend[selectFriend].gameScore = 0;
                }
            }
            else{
                jsonData.friend[selectFriend].gameScore = Math.abs(jsonData.friend[selectFriend].gameScore + Math.floor(((30 + 30) + 1) * Math.random() - 30));
            }
            var labelNum_2 = cc.LabelTTF.create("人气值： " + jsonData.friend[selectFriend].gameScore, "Arial", 32);
            //labelNum_2.setColor(cc.color.RED);
            labelNum_2.setPosition(400, -20);
            this.backteam_1.addChild(labelNum_2, 2);

            if(0 == jsonData.vsgroup[0].gameScore){
                jsonData.vsgroup[0].gameScore = battlelayer.strTotalNum + Math.floor(((20 + 20) + 1) * Math.random() - 20);
                if(0 > jsonData.vsgroup[0].gameScore){
                    jsonData.vsgroup[0].gameScore = 0;
                }
            }
            else{
                jsonData.vsgroup[0].gameScore = Math.abs(jsonData.vsgroup[0].gameScore + Math.floor(((30 + 30) + 1) * Math.random() - 30));
            }

            var labelNum_3 = cc.LabelTTF.create("人气值： " + jsonData.vsgroup[0].gameScore, "Arial", 32);
            //labelNum_3.setColor(cc.color.RED);
            labelNum_3.setPosition(100, -20);
            backteam_2.addChild(labelNum_3, 2);

            if(0 == jsonData.vsgroup[1].gameScore){
                jsonData.vsgroup[1].gameScore = battlelayer.strTotalNum + Math.floor(((20 + 20) + 1) * Math.random() - 20);
                if(0 > jsonData.vsgroup[1].gameScore){
                    jsonData.vsgroup[1].gameScore = 0;
                }
            }
            else{
                jsonData.vsgroup[1].gameScore = Math.abs(jsonData.vsgroup[1].gameScore + Math.floor(((30 + 30) + 1) * Math.random() - 30));
            }
            var labelNum_4 = cc.LabelTTF.create("人气值： " + jsonData.vsgroup[1].gameScore, "Arial", 32);
            //labelNum_4.setColor(cc.color.RED);
            labelNum_4.setPosition(400, -20);
            backteam_2.addChild(labelNum_4, 2);

            var labelNum_5 = new cc.Sprite("img/label_popularity.png");
            labelNum_5.setPosition(250, 140);
            this.backteam_1.addChild(labelNum_5, 2);

            this.labelTotolNum_1 = new cc.LabelAtlas("0", "img/num.png", 36, 41, '.');
            this.labelTotolNum_1.setAnchorPoint(0.5, 0.5);
            this.labelTotolNum_1.setPosition(250, 60);
            this.backteam_1.addChild(this.labelTotolNum_1, 2);

            var labelNum_6 = new cc.Sprite("img/label_popularity.png");
            labelNum_6.setPosition(250, 140);
            backteam_2.addChild(labelNum_6, 2);

            this.labelTotolNum_2 = new cc.LabelAtlas("0", "img/num.png", 36, 41, '.');
            this.labelTotolNum_2.setAnchorPoint(0.5, 0.5);
            this.labelTotolNum_2.setPosition(250, 60);
            backteam_2.addChild(this.labelTotolNum_2, 2);

            this.buttonBack = cc.MenuItemImage.create("img/buttonAgain.png", "img/buttonAgain.png", this.onMenuCallbackbuttonBack, this);
            this.buttonBack.setPosition(-150, -250);
            this.buttonBack.setVisible(false);

            this.buttonShare = cc.MenuItemImage.create("img/buttonshare.png", "img/buttonshare.png", this.onMenuCallbackbuttonShare, this);
            this.buttonShare.setPosition(150, -250);
            this.buttonShare.setVisible(false);

            var pMenu = cc.Menu.create(this.buttonBack, this.buttonShare);

            this.sprGameEnd.addChild(pMenu, 5);
            pMenu.setPosition(this.sprGameEnd.getContentSize().width/2, this.sprGameEnd.getContentSize().height / 2 - 80);

            this.numAdd_1 = Math.floor((battlelayer.strTotalNum + jsonData.friend[selectFriend].gameScore) / 8);
            if(this.numAdd_1 < 1){
                this.numAdd_1 = 1;
            }

            this.numAdd_2 = Math.floor((jsonData.vsgroup[1].gameScore + jsonData.vsgroup[0].gameScore) / 8);
            if(this.numAdd_2 < 1){
                this.numAdd_2 = 1;
            }

            this.schedule(this.callBackTime, 0.1);
        }
    },

    callBackTime:function(){
        var size = cc.director.getWinSize();
        this.curTime = this.curTime + 0.1;
        if(0.5 > Math.round(this.curTime*10)/10){

        }
        else{
            var myScore = battlelayer.strTotalNum + jsonData.friend[selectFriend].gameScore;
            var vsScore = jsonData.vsgroup[1].gameScore + jsonData.vsgroup[0].gameScore;
            var spriteEnd = null;

            if(this.totolNum_1 < myScore){
                this.totolNum_1 = this.totolNum_1 + this.numAdd_1;
            }
            this.labelTotolNum_1.setString(this.totolNum_1);


            if(this.totolNum_2 < vsScore){
                this.totolNum_2 = this.totolNum_2 + this.numAdd_2;
            }
            this.labelTotolNum_2.setString(this.totolNum_2);

            if(0.8 == Math.round(this.curTime*10)/10){
                this.labelTotolNum_1.setString(myScore);
                this.labelTotolNum_2.setString(vsScore);
                this.unschedule(this.callBackTime);
                if(myScore >= vsScore){
                    spriteEnd = new cc.Sprite("img/label_win.png");
                }
                else{
                    spriteEnd = new cc.Sprite("img/label_lose.png");
                }

                spriteEnd.setPosition(size.width /2, size.height /2 + 50);
                var action = cc.ScaleTo.create(0.8, 1.3);
                spriteEnd.runAction(cc.Sequence.create(action, cc.CallFunc.create(this.callBackAction, this)));
                this.addChild(spriteEnd, 5);
            }
        }

    },

    callBackAction:function(){
        this.buttonBack.setVisible(true);
        this.buttonShare.setVisible(true);
    },

    sendScoreRequest: function(score) {
        var xhr = cc.loader.getXMLHttpRequest();
        var link = "http://api.51wala.com/guardIdol/sync.json?res=" + score;
        xhr.open("GET", link);
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status <= 207)) {

            }
        };
        xhr.send();
    },



    onMenuCallbackbuttonBack:function(){

        var scene = cc.director.getRunningScene();
        scene.removeAllChildren();
        var layer = new HelloLayer();
        layer.init();
        scene.addChild(layer);
    },

    onMenuCallbackbuttonTx:function(){
        if (!cc.sys.isNative) {
            countShare();
            window.open("http://v.t.qq.com/share/share.php?title=" + shareContent + "&pic=" + shareImg + "&url=" + shareUrl, "_blank");

        }
    },

    onMenuCallbackbuttonWeibo:function(){
        if (!cc.sys.isNative) {
            countShare();
            window.open("http://v.t.sina.com.cn/share/share.php?pic=" + shareImg + "&title=" + shareContent + "&url=" + shareUrl, "_blank");
        }
    },

    onMenuCallbackbuttonWeixinOne:function(){
        if (!cc.sys.isNative) {
            countShare();
            var text="wala://weixin.shareToFriend?link=" + encodeURIComponent(shareUrl)+ "&imgUrl=" + encodeURIComponent(shareImg) + "&title=" + encodeURIComponent(shareTitle) +"&desc=" + encodeURIComponent(shareContent)
            window.open(text, "_blank");
        }
    },

    onMenuCallbackbuttonWeixinTwo:function(){
        if (!cc.sys.isNative) {
            countShare();
            var text="wala://weixin.shareToTimeline?link=" + encodeURIComponent(shareUrl)+ "&imgUrl=" + encodeURIComponent(shareImg) + "&title=" + encodeURIComponent(shareTitle) +"&desc=" + encodeURIComponent(shareContent)
            window.open(text, "_blank");
        }
    },

    onMenuCallbackbuttonCancel:function(){

        var scene = cc.director.getRunningScene();
        scene.removeAllChildren();
        var layer = new HelloLayer();
        layer.init();
        scene.addChild(layer);
    },

    onMenuCallbackbuttonShare:function(){

        var size = cc.director.getWinSize();

        this.sprGameEnd.removeFromParent(true);

        toastLayer = new cc.Layer();
        this.addChild(toastLayer, 10);

        var sprBackGroud = cc.Sprite.create("img/backGroudShare.png");
        sprBackGroud.setAnchorPoint(0.5, 0);
        sprBackGroud.setPosition(size.width/2, 0);
        toastLayer.addChild(sprBackGroud, 1);

        var buttonCancel = cc.MenuItemImage.create("img/buttonQuitShare.png", "img/buttonQuitShare.png", this.onMenuCallbackbuttonCancel, this);
        buttonCancel.setPosition(size.width/2, 80);

        var buttonTx = cc.MenuItemImage.create("img/txweibo.png", "img/txweibo.png", this.onMenuCallbackbuttonTx, this);
        buttonTx.setPosition(550, 250);
        var labelTx = cc.LabelTTF.create("分享腾讯微博", "Arial", 24);
        labelTx.setPosition(buttonTx.getContentSize().width / 2, -20);
        buttonTx.addChild(labelTx, 1);

        var buttonWeibo = cc.MenuItemImage.create("img/weibo.png", "img/weibo.png", this.onMenuCallbackbuttonWeibo, this);
        buttonWeibo.setPosition(400, 250);
        var labelWeibo = cc.LabelTTF.create("分享新浪微博", "Arial", 24);
        labelWeibo.setPosition(buttonWeibo.getContentSize().width / 2, -20);
        buttonWeibo.addChild(labelWeibo, 1);

        var buttonWeixin = cc.MenuItemImage.create("img/weixin_1.png", "img/weixin_1.png", this.onMenuCallbackbuttonWeixinOne, this);
        buttonWeixin.setPosition(100, 250);
        var labelWeixin = cc.LabelTTF.create("分享微信朋友", "Arial", 24);
        labelWeixin.setPosition(buttonWeibo.getContentSize().width / 2, -20);
        buttonWeixin.addChild(labelWeixin, 1);

        var buttonWeixin2 = cc.MenuItemImage.create("img/weixin_2.png", "img/weixin_2.png", this.onMenuCallbackbuttonWeixinTwo, this);
        buttonWeixin2.setPosition(250, 250);
        var labelWeixin2 = cc.LabelTTF.create("分享到朋友圈", "Arial", 24);
        labelWeixin2.setPosition(buttonWeixin2.getContentSize().width / 2, -20);
        buttonWeixin2.addChild(labelWeixin2, 1);

        var pMenu = cc.Menu.create(buttonTx, buttonWeibo, buttonWeixin, buttonWeixin2, buttonCancel);
        pMenu.setPosition(0, 0);
        sprBackGroud.addChild(pMenu, 5);

    }
});


//倒计时场景
var CountdownLayer = cc.Layer.extend({

    labelTime:null,
    strTime:4,
    index:null,
    init:function (index) {
        this.index = index;
        var size = cc.director.getWinSize();

        if (this._super()){
            cc.eventManager.addListener({
                event:cc.EventListener.TOUCH_ONE_BY_ONE,
                swallowTouches:true,
                onTouchBegan:function(t,e){
                    return true;
                },
                onTouchEnded:function(t,e){

                },
                onTouchMoved:function(){
                    return true;
                }
            },this);

            if(5 == this.index || 6 == this.index){
                this.strTime =2;
                this.labelTime = cc.Sprite.create("img/go.png");
            }
            else{
                this.labelTime = cc.Sprite.create("img/num_3.png");
            }
            this.labelTime.setPosition(size.width  / 2, size.height / 2);
            this.addChild(this.labelTime, 1);

            this.schedule(this.callBackCountTime, 1);
        }
    },

    callBackCountTime:function(){
        this.strTime = this.strTime - 1;
        var size = cc.director.getWinSize();

        if(0 == this.strTime){
            if(1 == this.index){

                this.unschedule(this.callBackCountTime);
                this.removeFromParent(true);

                battlelayer.schedule(battlelayer.callBackTime, 0.1);
                battlelayer.spritePlayer[0].moveDirect = 0;
                if (showBossNum == battlelayer.strTotalNum){
                    battlelayer.isShowPointUp = false;
                    battlelayer.sprPointUp = cc.Sprite.create("img/pointto.png");
                    battlelayer.sprPointUp.setPosition(size.width/2 - 70, size.height/2 - 140);
                    battlelayer.addChild(battlelayer.sprPointUp, 8);
                }
                //battlelayer.updatePlayer(0);
            }
            else if(2 == this.index){
                var scene = cc.director.getRunningScene();
                scene.removeAllChildren();
                battlelayer = new battleLayer();
                battlelayer.init();
                scene.addChild(battlelayer);
            }
            else if(5 == this.index){
                this.unschedule(this.callBackCountTime);
                this.removeFromParent(true);
                battlelayer.schedule(battlelayer.callBackCrazyTime, 1);
            }
            else if(6 == this.index){
                this.unschedule(this.callBackCountTime);
                this.removeFromParent(true);
                battlelayer.isCrazyModle = false;
                battlelayer.sprCrazyTime.removeFromParentAndCleanup();
                battlelayer.sprCrazyModel.removeFromParentAndCleanup();
                battlelayer.schedule(battlelayer.callBackTime, 0.1);
                battlelayer.crazyTime = 10;
                battlelayer.energyNum = 0;
                battlelayer.labelTime.setVisible(true);
            }
            else {
                this.unschedule(this.callBackCountTime);
                this.removeFromParent(true);
                battlelayer.startGame();
            }

        }
        else if(1 == this.strTime){
            this.labelTime.setTexture("img/go.png");
            this.labelTime.runAction(cc.spawn(cc.FadeOut.create(0.7), cc.scaleTo(0.7, 1.5)));
        }
        else if(2 == this.strTime){
            this.labelTime.setTexture("img/num_1.png");
        }
        else if(3 == this.strTime){
            this.labelTime.setTexture("img/num_2.png");
        }
    }
});

//帮助界面
var helpLayer = cc.Layer.extend({

    init:function () {

        var size = cc.director.getWinSize();

        if (this._super()){
            cc.eventManager.addListener({
                event:cc.EventListener.TOUCH_ONE_BY_ONE,
                swallowTouches:true,
                onTouchBegan:function(t,e){
                    return true;
                },
                onTouchEnded:function(t,e){
                    e.getCurrentTarget().removeFromParentAndCleanup();
                },
                onTouchMoved:function(){
                    return true;
                }
            },this);

            var sprBack = cc.Sprite.create("img/help_wala.png");
            sprBack.setPosition(size.width/2, size.height/2);
            this.addChild(sprBack, 8);
        }
    }
});

//mainScene
var HelloWorldScene = cc.Scene.extend({
    onEnter:function (index) {
        this._super();

        cc.spriteFrameCache.addSpriteFrames("img/badpeople.plist");
        cc.spriteFrameCache.addSpriteFrames("img/hanhpeople.plist");
        cc.spriteFrameCache.addSpriteFrames("img/liypeople.plist");
        cc.spriteFrameCache.addSpriteFrames("img/guojmpeople.plist");
        var layer = new HelloLayer();
        layer.init();
        this.addChild(layer);
    }
});
