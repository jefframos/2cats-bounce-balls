/*jshint undef:false */
var LoadScreen = AbstractScreen.extend({
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
        if(assetsToLoader.length > 0 && !this.isLoaded){
            this.loader = new PIXI.AssetLoader(assetsToLoader);
            this.initLoad();
        }else{
            this.onAssetsLoaded();
        }
    },
    initLoad:function(){
        var barHeight = 20;
        this.loaderContainer = new PIXI.DisplayObjectContainer();
        this.addChild(this.loaderContainer);

        this.loaderBar = new LifeBarHUD(windowWidth * 0.6, barHeight, 0, 0xa72d79, 0x0d163e);
        this.loaderContainer.addChild(this.loaderBar.getContent());
        this.loaderBar.getContent().position.x = windowWidth / 2 - this.loaderBar.getContent().width / 2;
        this.loaderBar.getContent().position.y = windowHeight - this.loaderBar.getContent().height - windowHeight * 0.1;
        this.loaderBar.updateBar(0, 100);
        this._super();

        var text = new PIXI.Text('PLAY', {font:'50px Vagron', fill:'#FFFFFF'});
        this.addChild(text);
        text.alpha = 0;
        //gambiarra pra forçar a fonte
    },
    onProgress:function(){
        this._super();
        this.loaderBar.updateBar(Math.floor(this.loadPercent * 100), 100);
    },
    onAssetsLoaded:function()
    {
        this.ready = true;
        var self = this;
        TweenLite.to(this.loaderBar.getContent(), 0.5, {delay:0.2, alpha:0, onComplete:function(){
            self.initApplication();
        }});
    },
    initApplication:function(){
        this.isLoaded = true;
        var self = this;
        this.screenManager.change('Init');
    },
    transitionIn:function()
    {
        if(!this.isLoaded){
            this.build();
            return;
        }
        this.build();
    },
    transitionOut:function(nextScreen, container)
    {
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