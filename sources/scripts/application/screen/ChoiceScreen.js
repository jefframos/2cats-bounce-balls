/*jshint undef:false */
var ChoiceScreen = AbstractScreen.extend({
    init: function (label) {
        this._super(label);
        this.isLoaded = false;
        // alert(this.isLoaded);
    },
    destroy: function () {
        this._super();
    },
    build: function () {
        this._super();

        var assetsToLoader = [];
        this.loader = new PIXI.AssetLoader(assetsToLoader);

        if(assetsToLoader.length > 0){
            this.initLoad();
        }else{
            this.onAssetsLoaded();
        }
        this.updateable = true;
    },
    update:function(){
        if(!this.updateable){
            return;
        }
    },
    onProgress:function(){
        this._super();
    },
    onAssetsLoaded:function()
    {
        this.initApplication();
        // APP.labelDebug.visible = false;
    },
    initApplication:function(){
        var self = this;

        this.bg = new SimpleSprite('bg1.jpg');
        // this.container.addChild(this.bg.getContent());
        scaleConverter(this.bg.getContent().width, windowWidth, 1.2, this.bg);
        this.bg.getContent().position.x = windowWidth / 2 - this.bg.getContent().width / 2;
        this.bg.getContent().position.y = windowHeight / 2 - this.bg.getContent().height / 2;

        this.scrollContainer = new PIXI.DisplayObjectContainer();
        this.addChild(this.scrollContainer);
        var tempGraphics = new PIXI.Graphics();
        var marginTopBottom = 100;
        this.shopList = [];
        for (var i = 0; i < APP.appModel.playerModels.length; i++) {
            var shopItem = new ShopItem(this);
            shopItem.build(APP.appModel.playerModels[i]);
            this.scrollContainer.addChild(shopItem.getContent());
            shopItem.getContent().position.y = i * (shopItem.getContent().height * 0.8) + marginTopBottom + 20;
            scaleConverter(shopItem.getContent().width, windowWidth, 0.6, shopItem.getContent());
            shopItem.getContent().position.x = windowWidth / 2 - shopItem.getContent().width / 2;
            this.shopList.push(shopItem);
        }
        this.back = new PIXI.Graphics();
        this.back.beginFill(0xECBC0C);
        this.back.drawRect(0,0,windowWidth,this.scrollContainer.height);
        this.back.height = this.scrollContainer.height + marginTopBottom * 2;
        this.scrollContainer.addChild(this.back);
        this.scrollContainer.setChildIndex(this.back, 0);

        this.applyScroll(this.scrollContainer);

        this.backTop = new PIXI.Graphics();
        this.backTop.beginFill(0xdb453c);
        this.backTop.drawRect(0,0,windowWidth,marginTopBottom);
        this.container.addChild(this.backTop);
        // this.scrollContainer.setChildIndex(this.backTop, 0);

        this.textScreen = new PIXI.Text('SHOP', {font:'50px Vagron', fill:'#FFFFFF'});
        scaleConverter(this.textScreen.width, windowWidth, 0.25, this.textScreen);
        this.textScreen.position.x = windowWidth / 2 - this.textScreen.width / 2;
        this.textScreen.position.y = windowWidth * 0.1;
        this.container.addChild(this.textScreen);


        this.playButton = new DefaultButton('play1.png', 'play1.png');
        this.playButton.build();
        // this.playButton.addLabel(new PIXI.Text('PLAY', {font:'50px Vagron', fill:'#FFFFFF'}), 45,2);
        scaleConverter(this.playButton.getContent().height, this.textScreen.height, 1, this.playButton);
        this.playButton.setPosition(windowWidth * 0.1 + this.playButton.getContent().width,windowWidth * 0.1);
        this.addChild(this.playButton);
        this.playButton.getContent().scale.x = -1;
      
        this.playButton.clickCallback = function(){
            self.updateable = false;
            self.toTween(function(){
                self.screenManager.change('Init');
                APP.goDirect = true;
            });
        };

        this.coinsLabel = new PIXI.Text(APP.totalCoins, {font:'50px Vagron', fill:'#FFFFFF'});
        scaleConverter(this.coinsLabel.height, this.playButton.getContent().height, 1, this.coinsLabel);
        this.coinsLabel.position.x = windowWidth - this.coinsLabel.width  - windowWidth * 0.1;
        this.coinsLabel.position.y = windowWidth * 0.1;
        this.container.addChild(this.coinsLabel);

    },
    updateCoins:function(){
        this.coinsLabel.setText(APP.totalCoins);
        this.coinsLabel.position.x = windowWidth - this.coinsLabel.width  - windowWidth * 0.1;
        this.coinsLabel.position.y = windowWidth * 0.1;
    },
    applyScroll:function(container){
        container.interactive = true;
        // container.mouseout = container.touchend = function(mouseData){
        //     container.mouseDown = false;
        // };
         
        container.mousedown  = container.touchstart = function(mouseData){
            container.mouseDown = true;
            container.initGlobalY = mouseData.global.y - container.position.y;
        };

        container.mousemove = container.touchmove  = function(mouseData){
            if(container.mouseDown){
                container.lastVelY = (mouseData.global.y - container.initGlobalY) - container.position.y;

                var posDest = verifyPos(mouseData.global.y - container.initGlobalY);
                container.position.y = posDest;

                TweenLite.killTweensOf(container.position);
            }
        };
         
        container.mouseup  = container.touchend = function(mouseData){
            container.mouseDown = false;
            var posDest = verifyPos(container.position.y + container.lastVelY * 5);
            TweenLite.to(container.position, Math.abs(container.lastVelY) / 120, {y:posDest});
        };
        function verifyPos(posReturn){
            if(posReturn > 0){
                posReturn = 0;
            }
            if(container.height > windowHeight){
                if(Math.abs(posReturn) + windowHeight > container.height){
                    posReturn = -container.height + windowHeight;
                }
            }else{
                if(posReturn + container.height > windowHeight){
                    posReturn = windowHeight - container.height;
                }
            }
            return posReturn;
        }
    },
    toTween:function(callback){
        TweenLite.to(this.bg.getContent(), 0.1, {alpha:0, ease:'easeOutCubic'});
        TweenLite.to(this.textScreen, 0.1, {delay:0.1, alpha:0});
       
        TweenLite.to(this.playButton.getContent(), 0.1, {delay:0.1, y:-this.playButton.getContent().height, ease:'easeOutBack', onComplete:function(){
            if(callback){
                callback();
            }
        }});
    },
    fromTween:function(callback){
        console.log('from');
        TweenLite.from(this.bg.getContent(), 0.1, {alpha:0, ease:'easeOutCubic'});
        TweenLite.from(this.textScreen, 0.1, {delay:0.1, alpha:0});
        TweenLite.from(this.playButton.getContent(), 0.1, {delay:0.1, y:windowHeight, ease:'easeOutBack', onComplete:function(){
            if(callback){
                callback();
            }
        }});
    },
    setAudioButtons:function(){
        var self = this;

        APP.mute = true;
        Howler.mute();

        this.audioOn = new DefaultButton('volumeButton_on.png', 'volumeButton_on_over.png');
        this.audioOn.build();
        scaleConverter(this.audioOn.width, windowWidth, 0.15, this.audioOn);
        this.audioOn.setPosition(windowWidth - this.audioOn.getContent().width - 20, 20);
        // this.audioOn.setPosition( windowWidth - this.audioOn.getContent().width  - 20, 20);

        this.audioOff = new DefaultButton('volumeButton_off.png', 'volumeButton_off_over.png');
        this.audioOff.build();
        scaleConverter(this.audioOff.width, windowWidth, 0.15, this.audioOff);
        this.audioOff.setPosition(windowWidth - this.audioOn.getContent().width - 20, 20);

        if(!APP.mute){
            this.addChild(this.audioOn);
        }else{
            this.addChild(this.audioOff);
        }

        this.audioOn.clickCallback = function(){
            APP.mute = true;
            Howler.mute();
            if(self.audioOn.getContent().parent)
            {
                self.audioOn.getContent().parent.removeChild(self.audioOn.getContent());
            }
            if(self.audioOff.getContent())
            {
                self.addChild(self.audioOff);
            }
        };
        this.audioOff.clickCallback = function(){
            APP.mute = false;
            Howler.unmute();
            if(self.audioOff.getContent().parent)
            {
                self.audioOff.getContent().parent.removeChild(self.audioOff.getContent());
            }
            if(self.audioOn.getContent())
            {
                self.addChild(self.audioOn);
            }
        };
    },
    // transitionIn:function()
    // {
    //     console.log('init');
    //     this.frontShape = new PIXI.Graphics();
    //     this.frontShape.beginFill(0x2c2359);
    //     this.frontShape.drawRect(0,0,windowWidth, windowHeight);
    //     this.addChild(this.frontShape);
    //     this.build();

    // }, 
    // transitionOut:function(nextScreen, container)
    // {
    //     // this._super();
    //     var self = this;
    //     if(this.frontShape){
    //         this.frontShape.parent.setChildIndex(this.frontShape, this.frontShape.parent.children.length - 1);
    //         TweenLite.to(this.frontShape, 0.3, {alpha:1, onComplete:function(){
    //             self.destroy();
    //             container.removeChild(self.getContent());
    //             nextScreen.transitionIn();
    //         }});
    //     }else{
    //         self.destroy();
    //         container.removeChild(self.getContent());
    //         nextScreen.transitionIn();
    //     }

        
    // },
});