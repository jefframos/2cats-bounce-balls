/*jshint undef:false */
var InitScreen = AbstractScreen.extend({
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

		this.logo = new SimpleSprite('logo.png');
		// this.container.addChild(this.logo.getContent());
		scaleConverter(this.logo.getContent().width, windowWidth, 0.5, this.logo);
		this.logo.getContent().position.x = windowWidth / 2 - this.logo.getContent().width / 2;
		this.logo.getContent().position.y = windowHeight / 2 - this.logo.getContent().height / 2;


		if(APP.withAPI){
			this.moreGames = new DefaultButton('UI_button_default_2.png', 'UI_button_default_2.png');
			this.moreGames.build();
			this.moreGames.addLabel(new PIXI.Text('MORE GAMES', {font:'18px Vagron', fill:'#FFFFFF'}), 17, 12);
			scaleConverter(this.moreGames.getContent().width, windowWidth, 0.35, this.moreGames);
			this.moreGames.setPosition(windowWidth / 2 - this.moreGames.getContent().width/2,
				windowHeight - this.moreGames.getContent().height *1.4);
			this.addChild(this.moreGames);
		  
			this.moreGames.clickCallback = function(){
				self.updateable = false;
				if(APP.withAPI){
					APP.buttonProperties.action();
				}
				// self.toTween(function(){
				//     self.screenManager.change('Game');
				// });
			};
		}


		this.playButton = new DefaultButton('UI_button_default_1.png', 'UI_button_default_1.png');
		this.playButton.build();
		this.playButton.addLabel(new PIXI.Text('PLAY', {font:'50px Vagron', fill:'#FFFFFF'}), 45,2);
		scaleConverter(this.playButton.getContent().width, windowWidth, 0.4, this.playButton);
		this.playButton.setPosition(windowWidth / 2 - this.playButton.getContent().width/2,
			windowHeight - this.playButton.getContent().height * 2.5);
		this.addChild(this.playButton);
	  
		this.playButton.clickCallback = function(){
			self.startGame();
			// self.updateable = false;
			// self.toTween(function(){
			// 	self.startGame();//self.screenManager.change('Choice');
			// });
		};


		if(testMobile() && possibleFullscreen() && !isfull){
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

		// this.setAudioButtons();

		
		this.fromTween();

		this.layerManager = new LayerManager();
		this.layerManager.build('Main');

		this.addChild(this.layerManager);

		//adiciona uma camada
		this.layer = new Layer();
		this.layer.build('EntityLayer');
		this.layerManager.addLayer(this.layer);




		this.hitTouch = new PIXI.Graphics();
		this.hitTouch.interactive = true;
		this.hitTouch.beginFill(0);
		this.hitTouch.drawRect(0,0,windowWidth, windowHeight);
		this.hitTouch.alpha = 0;
		this.hitTouch.hitArea = new PIXI.Rectangle(0, 0, windowWidth, windowHeight);
	   

		this.hitTouch.mouseup = function(mouseData){
			self.moveBall();
		};

		this.hitTouch.touchstart = function(touchData){
			self.moveBall();
		};



		this.behaviours = [];
		this.behaviours.push(new RadiusPingPongBehaviour({}));
		this.behaviours.push(new RadiusBehaviour({}));
		this.behaviours.push(new SiderBehaviour({}));
		this.behaviours.push(new DiagBehaviour({}));

		this.pointsLabel = new PIXI.Text('0', {align:'center',font:'50px Vagron', fill:'#FFF', wordWrap:true, wordWrapWidth:500});
		scaleConverter(this.pointsLabel.height, windowHeight, 0.06, this.pointsLabel);
		this.addChild(this.pointsLabel);
		this.pointsLabel.position.y = -50;
		
		// this.startGame();
	},
	updateLabel:function(){
		this.pointsLabel.setText(this.currentPoints);
		this.pointsLabel.position.x = windowWidth - this.pointsLabel.width - windowWidth * 0.1;
		this.pointsLabel.position.y = windowWidth * 0.1;
	},
	getBall:function(){
		this.nextHorde();
		this.currentPoints ++;
		this.updateLabel();
	},
	moveBall:function(){
		this.ball.velocity.y = -20;
	},
	nextHorde:function(){
		var self = this;
		var posDest = windowHeight - this.ball.getContent().height - windowHeight * 0.1;
		this.currentHorde ++;
		if(APP.accelGame < 3){
			APP.accelGame += this.currentHorde / 500;
		}
		console.log((APP.accelGame));

		TweenLite.to(this.ball.getContent().position, 0.3, {y:posDest, ease:'easeOutBack', onComplete:function(){
			var behaviour = self.behaviours[Math.floor(Math.random() * self.behaviours.length)].clone();
		// var behaviour = self.behaviours[3].clone();
			var tempEnemy = new EnemyBall({x:0,y:0}, behaviour);
			tempEnemy.build();
			tempEnemy.getContent().position.x = behaviour.position.x;
			tempEnemy.getContent().position.y = behaviour.position.y;
			self.layer.addChild(tempEnemy);

		}});
	},
	startGame:function(){
		this.toTween();
		this.currentPoints = 0;
		this.currentHorde = 0;
		APP.accelGame = 1;
		this.updateLabel();
		this.ball = new Ball({x:0,y:0}, this);
		this.ball.build();
		this.ball.getContent().position.y = 100;
		this.ball.getContent().position.x = 100;
		scaleConverter(this.ball.getContent().width, windowWidth, 0.15, this.ball.getContent());
		this.ball.getContent().position.x = windowWidth / 2;
		this.ball.getContent().position.y = windowHeight - this.ball.getContent().height - windowHeight * 0.1;

		
		this.layer.addChild(this.ball);
		this.nextHorde();
		// this.nextHorde();
		// this.nextHorde();
		// this.nextHorde();
		// this.nextHorde();
		// this.nextHorde();
		// this.nextHorde();
		// this.nextHorde();
		// this.nextHorde();
		// this.nextHorde();
		// this.nextHorde();
		// this.nextHorde();
		// this.nextHorde();
		// this.nextHorde();
		// this.nextHorde();
		// this.nextHorde();
		// this.nextHorde();

		this.addChild(this.hitTouch);
	},
	gameOver:function(){
		this.removeChild(this.hitTouch);
		this.pointsLabel.position.y = -50;
		for (var i = this.layer.childs.length - 1; i >= 0; i--) {
			this.layer.childs[i].preKill();
		}
		// this.layer.childs
		this.fromTween();
	},
	update:function(){
		if(!this.updateable){
			return;
		}
		this._super();
	},
	toTween:function(callback){
		// TweenLite.to(this.bg.getContent(), 0.5, {delay:0.7, alpha:0, ease:'easeOutCubic'});
		// TweenLite.to(this.logo.getContent(), 0.5, {delay:0.1, alpha:0});

	   
		// if(this.audioOn){
		// 	TweenLite.to(this.audioOn.getContent(), 0.5, {delay:0.1,y:-this.audioOn.getContent().height, ease:'easeOutBack'});
		// }
		// if(this.audioOff){
		// 	TweenLite.to(this.audioOff.getContent(), 0.5, {delay:0.1,y:-this.audioOn.getContent().height, ease:'easeOutBack'});
		// }

		// if(this.fullscreenButton){
		// 	TweenLite.to(this.fullscreenButton.getContent(), 0.5, {delay:0.3, y:windowHeight, ease:'easeOutBack'});
		// }
		// if(this.moreGames){
		// 	TweenLite.to(this.moreGames.getContent(), 0.5, {delay:0.4, y:windowHeight, ease:'easeOutBack'});
		// }
		TweenLite.to(this.playButton.getContent(), 0.2, {y:windowHeight, ease:'easeOutBack', onComplete:function(){
			if(callback){
				callback();
			}
		}});
	},
	fromTween:function(callback){

		this.playButton.setPosition(windowWidth / 2 - this.playButton.getContent().width/2,
			windowHeight - this.playButton.getContent().height * 2.5);

		// TweenLite.from(this.bg.getContent(), 0.5, {alpha:0, ease:'easeOutCubic'});
		// TweenLite.from(this.logo.getContent(), 0.5, {delay:0.1, alpha:0});
	   
		// if(this.audioOn){
		// 	TweenLite.from(this.audioOn.getContent(), 0.5, {delay:0.1,y:-this.audioOn.getContent().height, ease:'easeOutBack'});
		// }
		// if(this.audioOff){
		// 	TweenLite.from(this.audioOff.getContent(), 0.5, {delay:0.1,y:-this.audioOn.getContent().height, ease:'easeOutBack'});
		// }
		// if(this.fullscreenButton){
		// 	TweenLite.from(this.fullscreenButton.getContent(), 0.5, {delay:0.3, y:windowHeight, ease:'easeOutBack'});
		// }
		TweenLite.from(this.playButton.getContent(), 0.2, {y:windowHeight, ease:'easeOutBack', onComplete:function(){
			if(callback){
				callback();
			}
		}});
		// if(this.moreGames){
		// 	TweenLite.from(this.moreGames.getContent(), 0.5, {delay:0.5, y:windowHeight, ease:'easeOutBack'});
		// }
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
	//     console.log('out');
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