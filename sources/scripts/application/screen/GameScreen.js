/*jshint undef:false */
var GameScreen = AbstractScreen.extend({
    init: function (label) {
        this._super(label);
        this.isLoaded = false;
        this.pinDefaultVelocity = 3;
    },
    destroy: function () {
        this._super();
    },
    build: function () {
        this._super();
        var assetsToLoader = [];
        // var assetsToLoader = ['dist/img/atlas.json'];
        // this.loader = new PIXI.AssetLoader(assetsToLoader);
        if(assetsToLoader !== undefined && assetsToLoader.length > 0 && !this.isLoaded){
            this.initLoad();
        }else{
            this.onAssetsLoaded();
        }
        this.pinVel = {x:0, y:0};
        console.log('buid');
    },
    onProgress:function(){
        this._super();
    },
    onAssetsLoaded:function()
    {
        this.initApplication();
    },
    initApplication:function(){
        var self = this;
        this.bg = new SimpleSprite('bg1.jpg');
        this.addChild(this.bg.getContent());
        scaleConverter(this.bg.getContent().width, windowWidth, 1.2, this.bg);
        this.bg.getContent().position.x = windowWidth / 2 - this.bg.getContent().width / 2;
        this.bg.getContent().position.y = windowHeight / 2 - this.bg.getContent().height / 2;

        





        



        this.renderLevel();

        this.hitTouch = new PIXI.Graphics();
        this.hitTouch.interactive = true;
        this.hitTouch.beginFill(0);
        this.hitTouch.drawRect(0,0,windowWidth, windowHeight);
        this.addChild(this.hitTouch);
        this.hitTouch.alpha = 0;
        this.hitTouch.hitArea = new PIXI.Rectangle(0, 0, windowWidth, windowHeight);
        this.hornPos = {x:windowWidth / 2, y:windowHeight/1.2};
        function updateVel(touchData){
            var angle = Math.atan2(touchData.global.y - self.hornPos.y, touchData.global.x - self.hornPos.x);
            
            // angle = angle * 180 / Math.PI;
            // angle += 90;
            // angle = angle / 180 * Math.PI;

            self.shoot(angle);
        }
        // this.hitTouch.touchmove = function(touchData){
        //     updateVel(touchData);
        // };

        this.hitTouch.mouseup = function(mouseData){
            updateVel(mouseData);
        };

        this.hitTouch.touchstart = function(touchData){
            updateVel(touchData);
        };
        // this.hitTouch.touchend = function(touchData){
        //     updateVel(touchData);
        // };

        this.updateable = true;



        this.pauseButton = new DefaultButton('UI_button_pause_1.png', 'UI_button_pause_1_over.png', 'UI_button_pause_1_over.png');
        this.pauseButton.build();
        scaleConverter(this.pauseButton.getContent().width, windowWidth, 0.1, this.pauseButton);
        this.pauseButton.setPosition(20,20);
        this.addChild(this.pauseButton);
      
        this.pauseButton.clickCallback = function(){
            self.pauseModal.show();
        };

        this.backButton = new DefaultButton('UI_button_default_1.png', 'UI_button_default_1.png');
        this.backButton.build();
        this.backButton.addLabel(new PIXI.Text('BACK', {font:'50px Vagron', fill:'#FFFFFF'}), 40);
        scaleConverter(this.backButton.getContent().width, windowWidth, 0.4, this.backButton);
        this.backButton.setPosition(windowWidth / 2 - this.backButton.getContent().width/2,
            windowHeight - this.backButton.getContent().height * 2.5);
        this.addChild(this.backButton);
      
        this.backButton.clickCallback = function(){
            self.updateable = false;
            self.toTween(function(){
                self.screenManager.change('Init');
            });
        };

        this.setAudioButtons();
        
        this.fromTween();

        //MODAIS
        this.pauseModal = new PauseModal(this);
        this.endModal = new EndModal(this);

        if(APP.withAPI){
            GameAPI.GameBreak.request(function(){
                self.pauseModal.show();
            }, function(){
                self.pauseModal.hide();
            });
        }

        this.layerManager = new LayerManager();
        this.layerManager.build('Main');

        this.addChild(this.layerManager);

        //adiciona uma camada
        this.layer = new Layer();
        this.layer.build('EntityLayer');
        this.layerManager.addLayer(this.layer);

        
    },
    shoot:function(angle) {
        if(this.blockPause){
            return;
        }
        var timeLive = 100;

        var vel = 10;

        var bullet = new Bullet({x:Math.cos(angle) * vel,
            y:Math.sin(angle) * vel},
            timeLive, 5, null, true);
        bullet.build();
        scaleConverter(bullet.getContent().height,windowHeight, 0.06, bullet);
        bullet.startScaleTween();
        //UTILIZAR O ANGULO PARA CALCULAR A POSIÇÃO CORRETA DO TIRO
        bullet.setPosition(this.hornPos.x, this.hornPos.y);
        this.layer.addChild(bullet);
    },
    reset:function(){
        this.destroy();
        this.build();
    },
    update:function(){
        if(!this.updateable){
            return;
        }
        this._super();
    },
    renderLevel:function(whereInit){

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
    toTween:function(callback){
        TweenLite.to(this.bg.getContent(), 0.5, {alpha:0});

        TweenLite.to(this.pauseButton.getContent(), 0.5, {delay:0.3,y:-this.pauseButton.getContent().height, ease:'easeOutBack'});
        TweenLite.to(this.backButton.getContent(), 0.5, {delay:0.1,y:windowHeight, ease:'easeOutBack', onComplete:function(){
            if(callback){
                callback();
            }
        }});
       
        if(this.audioOn){
            TweenLite.to(this.audioOn.getContent(), 0.5, {delay:0.4,y:-this.audioOn.getContent().height, ease:'easeOutBack'});
        }
        if(this.audioOff){
            TweenLite.to(this.audioOff.getContent(), 0.5, {delay:0.4,y:-this.audioOn.getContent().height, ease:'easeOutBack'});
        }
    },
    fromTween:function(callback){
        TweenLite.from(this.bg.getContent(), 0.5, {alpha:0});

        TweenLite.from(this.pauseButton.getContent(), 0.5, {delay:0.1,y:-this.audioOn.getContent().height, ease:'easeOutBack'});

        TweenLite.from(this.backButton.getContent(), 0.5, {delay:0.4,y:windowHeight, ease:'easeOutBack', onComplete:function(){
            if(callback){
                callback();
            }
        }});
       
        if(this.audioOn){
            TweenLite.from(this.audioOn.getContent(), 0.5, {delay:0.3,y:-this.audioOn.getContent().height, ease:'easeOutBack'});
        }
        if(this.audioOff){
            TweenLite.from(this.audioOff.getContent(), 0.5, {delay:0.3,y:-this.audioOn.getContent().height, ease:'easeOutBack'});
        }
    },
    transitionIn:function()
    {
        // this.frontShape = new PIXI.Graphics();
        // this.frontShape.beginFill(0xfc95dd);
        // this.frontShape.drawRect(0,0,windowWidth, windowHeight);
        // this.addChild(this.frontShape);
        this.build();
        // if(this.frontShape){
        //     this.frontShape.parent.setChildIndex(this.frontShape, this.frontShape.parent.children.length - 1);
        //     TweenLite.to(this.frontShape, 0.8, {alpha:0});
        // }
    },
    transitionOut:function(nextScreen, container)
    {
        // this._super();
        console.log('out');
        var self = this;
        if(this.frontShape){
            this.frontShape.parent.setChildIndex(this.frontShape, this.frontShape.parent.children.length - 1);
            TweenLite.to(this.frontShape, 0.3, {alpha:1, onComplete:function(){
                self.destroy();
                container.removeChild(self.getContent());
                nextScreen.transitionIn();
            }});
        }else{
            self.destroy();
            container.removeChild(self.getContent());
            nextScreen.transitionIn();
        }

        
    },
});