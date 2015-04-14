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

        var assetsToLoader = ['dist/img/atlas.json'];
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
        this.container.addChild(this.bg.getContent());
        scaleConverter(this.bg.getContent().width, windowWidth, 1.2, this.bg);
        this.bg.getContent().position.x = windowWidth / 2 - this.bg.getContent().width / 2;
        this.bg.getContent().position.y = windowHeight / 2 - this.bg.getContent().height / 2;

        this.textScreen = new PIXI.Text('CHOICE SCREEN', {font:'50px Vagron', fill:'#FFFFFF'});
        scaleConverter(this.textScreen.width, windowWidth, 0.5, this.textScreen);
        this.textScreen.position.x = windowWidth / 2 - this.textScreen.width / 2;
        this.textScreen.position.y = windowHeight / 2 - this.textScreen.height / 2;
        this.container.addChild(this.textScreen);

        this.moreGames = new DefaultButton('UI_button_default_2.png', 'UI_button_default_2.png');
        this.moreGames.build();
        this.moreGames.addLabel(new PIXI.Text('BACK', {font:'18px Vagron', fill:'#FFFFFF'}), 52, 12);
        scaleConverter(this.moreGames.getContent().width, windowWidth, 0.35, this.moreGames);
        this.moreGames.setPosition(windowWidth / 2 - this.moreGames.getContent().width/2,
            windowHeight - this.moreGames.getContent().height *1.4);
        this.addChild(this.moreGames);
      
        this.moreGames.clickCallback = function(){
            self.updateable = false;
            self.toTween(function(){
                self.screenManager.change('Init');
            });
        };


        this.playButton = new DefaultButton('UI_button_default_1.png', 'UI_button_default_1.png');
        this.playButton.build();
        this.playButton.addLabel(new PIXI.Text('PLAY', {font:'50px Vagron', fill:'#FFFFFF'}), 45,2);
        scaleConverter(this.playButton.getContent().width, windowWidth, 0.4, this.playButton);
        this.playButton.setPosition(windowWidth / 2 - this.playButton.getContent().width/2,
            windowHeight - this.playButton.getContent().height * 2.5);
        this.addChild(this.playButton);
      
        this.playButton.clickCallback = function(){
            self.updateable = false;
            self.toTween(function(){
                self.screenManager.change('Game');
            });
        };


        if(possibleFullscreen() && !isfull){
            this.fullscreenButton = new DefaultButton('fullscreen.png', 'fullscreen.png');
            this.fullscreenButton.build();
            scaleConverter(this.fullscreenButton.getContent().width, windowWidth, 0.1, this.fullscreenButton);
            this.fullscreenButton.setPosition(windowWidth - this.fullscreenButton.getContent().width - 20,
                windowHeight - this.fullscreenButton.getContent().height - 20);
            this.addChild(this.fullscreenButton);
          
            this.fullscreenButton.clickCallback = function(){
                fullscreen();
                self.fullscreenButton.getContent().alpha = 0;
            };
        }

        this.setAudioButtons();

        
        this.fromTween();
    },
    toTween:function(callback){
        TweenLite.to(this.bg.getContent(), 0.5, {alpha:0, ease:'easeOutCubic'});
        TweenLite.to(this.textScreen, 0.5, {delay:0.1, alpha:0});
       
        if(this.audioOn){
            TweenLite.to(this.audioOn.getContent(), 0.5, {delay:0.1,y:-this.audioOn.getContent().height, ease:'easeOutBack'});
        }
        if(this.audioOff){
            TweenLite.to(this.audioOff.getContent(), 0.5, {delay:0.1,y:-this.audioOn.getContent().height, ease:'easeOutBack'});
        }

        if(this.fullscreenButton){
            TweenLite.to(this.fullscreenButton.getContent(), 0.5, {delay:0.3, y:windowHeight, ease:'easeOutBack'});
        }
        TweenLite.to(this.moreGames.getContent(), 0.5, {delay:0.4, y:windowHeight, ease:'easeOutBack'});
        TweenLite.to(this.playButton.getContent(), 0.5, {delay:0.5, y:windowHeight, ease:'easeOutBack', onComplete:function(){
            if(callback){
                callback();
            }
        }});
    },
    fromTween:function(callback){
        console.log('from');
        TweenLite.from(this.bg.getContent(), 0.5, {alpha:0, ease:'easeOutCubic'});
        TweenLite.from(this.textScreen, 0.5, {delay:0.1, alpha:0});
       
        if(this.audioOn){
            TweenLite.from(this.audioOn.getContent(), 0.5, {delay:0.1,y:-this.audioOn.getContent().height, ease:'easeOutBack'});
        }
        if(this.audioOff){
            TweenLite.from(this.audioOff.getContent(), 0.5, {delay:0.1,y:-this.audioOn.getContent().height, ease:'easeOutBack'});
        }
        if(this.fullscreenButton){
            TweenLite.from(this.fullscreenButton.getContent(), 0.5, {delay:0.3, y:windowHeight, ease:'easeOutBack'});
        }
        TweenLite.from(this.playButton.getContent(), 0.5, {delay:0.4, y:windowHeight, ease:'easeOutBack'});
        TweenLite.from(this.moreGames.getContent(), 0.5, {delay:0.5, y:windowHeight, ease:'easeOutBack', onComplete:function(){
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