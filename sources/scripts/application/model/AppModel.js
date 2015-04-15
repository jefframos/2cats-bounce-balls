/*jshint undef:false */
var AppModel = Class.extend({
	init:function(){
		

		// source,
		// energy coast, 1 / 3
		// bullet coast,
		// vel, 1 / 3
		// bullet vel,
		// bullet force 1 / 3
		// APP.cookieManager = new CookieManager();
		// console.log(cookieManager.getCookie('totalPoints'));
		// APP.cookieManager.setCookie('totalPoints', 0, 500);
		console.log(APP);
		var coins = APP.cookieManager.getSafeCookie('coins');
		var high = APP.cookieManager.getSafeCookie('highScore');
		var plays = APP.cookieManager.getSafeCookie('plays');
		APP.totalCoins = coins?coins:0;
		APP.highScore = high?high:0;
		APP.plays = plays?plays:0;
		APP.currentPoints = 0;
		// var points = parseInt(APP.cookieManager.getCookie('totalPoints'));
		// var high = parseInt(APP.cookieManager.getCookie('highScore'));

		// this.highScore = high?high:0;
		// this.totalPoints = points?points:0;
		// this.currentPoints = 0;

		
		this.playerModels = [];
		this.playerModels.push({
			value:0,
			color: 0xad76f7,
			id: this.playerModels.length,
			enabled: true
		});
		this.playerModels.push({
			value:1,
			color: 0x00FF00,
			id: this.playerModels.length,
			enabled: false
		});
		this.playerModels.push({
			value:20,
			color: 0x0000FF,
			id: this.playerModels.length,
			enabled: false
		});
		this.playerModels.push({
			value:20,
			color: 0xad76f7,
			id: this.playerModels.length,
			enabled: false
		});
		this.playerModels.push({
			value:20,
			color: 0x00FF00,
			id: this.playerModels.length,
			enabled: false
		});
		this.playerModels.push({
			value:20,
			color: 0x0000FF,
			id: this.playerModels.length,
			enabled: false
		});
		this.playerModels.push({
			value:20,
			color: 0xad76f7,
			id: this.playerModels.length,
			enabled: false
		});
		this.playerModels.push({
			value:20,
			color: 0x00FF00,
			id: this.playerModels.length,
			enabled: false
		});
		this.playerModels.push({
			value:20,
			color: 0x0000FF,
			id: this.playerModels.length,
			enabled: false
		});
		console.log(APP.cookieManager.getSafeCookie('enableds'));
		var enableds = APP.cookieManager.getSafeCookie('enableds');
		
		// console.log(enableds.split(','));
		var j = 0;
		if(!enableds){
			console.log('whata');
			enableds = '1';
			for (j = 0; j < this.playerModels.length - 1; j++) {
				enableds+=',0';
			}
			APP.cookieManager.setSafeCookie('enableds', enableds);
		}else{
			enableds = enableds.split(',');
			for (j = 0; j < this.playerModels.length - 1; j++) {
				console.log(enableds[j]);
				if(enableds[j] === '1'){
					this.playerModels[j].enabled = true;
				}
			}
		}


		this.currentPlayerModel = this.playerModels[0];

		// this.setModel(0);

		this.totalPlayers = 0;
		for (var i = this.playerModels.length - 1; i >= 0; i--) {
			if(this.playerModels[i].toAble <= this.totalPoints){
				this.playerModels[i].able = true;
				this.totalPlayers ++;
			}
		}

		this.currentHorde = 0;
	},
	saveScore:function(){
		APP.cookieManager.setSafeCookie('coins', APP.totalCoins);
		APP.cookieManager.setSafeCookie('highScore', APP.highScore);
		APP.cookieManager.setSafeCookie('plays', APP.plays);
		var enableds = '1';
		for (var i = 1; i < this.playerModels.length; i++) {
			if(this.playerModels[i].enabled){
				enableds+=',1';
			}else{
				enableds+=',0';
			}
		}
		console.log(enableds);
		APP.cookieManager.setSafeCookie('enableds', enableds);

		console.log(APP.cookieManager.getSafeCookie('enableds'));
	},
	setModel:function(id){
		this.currentID = id;
		this.currentPlayerModel = this.playerModels[id];
	},
	zerarTudo:function(){
		this.currentHorde = 0;
		this.totalPoints = 0;
		this.totalBirds = 1;
		this.totalPlayers = 1;
		APP.cookieManager.setCookie('totalPoints', 0, 500);
		APP.cookieManager.setCookie('totalBirds', 1, 500);

		for (var i = this.playerModels.length - 1; i >= 0; i--) {
			if(this.playerModels[i].toAble <= this.totalPoints){
				this.playerModels[i].able = true;
			}else{
				this.playerModels[i].able = false;
			}
		}
	},
	maxPoints:function(){
		this.currentHorde = 0;
		this.totalPoints = 999999;
		this.totalBirds = 8;
		APP.cookieManager.setCookie('totalPoints', this.totalPoints, 500);
		APP.cookieManager.setCookie('totalBirds', this.totalBirds, 500);


		for (var i = this.playerModels.length - 1; i >= 0; i--) {
			if(this.playerModels[i].toAble <= this.totalPoints){
				this.playerModels[i].able = true;
			}else{
				this.playerModels[i].able = false;
			}
		}
	},
	getNewObstacle:function(screen){
		var id = Math.floor(this.obstacleModels.length * Math.random());
		var obs = new Obstacle(this.obstacleModels[id], screen);
		return obs;
	},
	getNewEnemy:function(player, screen){
		this.currentHorde ++;
		var max = this.birdProbs.length;

		if(this.currentHorde < max){
			max = this.currentHorde;
		}

		var id = 99999;
		while(id > (this.totalBirds - 1)){
			id = this.birdProbs[Math.floor(max * Math.random())];
		}
		this.birdModels[id].target = player;
		var bird = new Bird(this.birdModels[id], screen);
		bird.id = id;
		console.log(bird.id);
		this.lastID = id;
		return bird;
	},
	ableNewBird:function(birdModel){

		if(!birdModel || this.totalBirds >= this.birdModels.length){
			return;
		}
		this.totalBirds = 0;
		for (var i = 0; i < this.birdModels.length; i++) {
			this.totalBirds ++;
			if(this.birdModels[i].label === birdModel.label){
				console.log(this.birdModels[i].label, birdModel.label);
				break;
			}
		}
		console.log(this.totalBirds);
		APP.cookieManager.setCookie('totalBirds', this.totalBirds, 500);
	},
	add100Points:function(){
		this.totalPoints += 100;
		APP.cookieManager.setCookie('totalPoints', 100, 500);
		this.totalPlayers = 0;
		for (var i = this.playerModels.length - 1; i >= 0; i--) {
			if(this.playerModels[i].toAble <= this.totalPoints && !this.playerModels[i].able){
				this.playerModels[i].able = true;
			}
			if(this.playerModels[i].able){
				this.totalPlayers ++;
			}
		}
	},
	addPoints:function(){
		this.currentHorde = 0;
		this.totalPoints += this.currentPoints;
		if(this.highScore < this.currentPoints)
		{
			this.highScore = this.currentPoints;
			APP.cookieManager.setCookie('highScore', this.highScore, 500);
			APP.dataManager.saveScore();
		}
		APP.cookieManager.setCookie('totalPoints', this.totalPoints, 500);
		if(this.maxPoints < this.currentPoints){
			this.maxPoints = this.currentPoints;
		}
		var tempReturn = [];
		this.totalPlayers = 0;
		for (var i = this.playerModels.length - 1; i >= 0; i--) {
			if(this.playerModels[i].toAble <= this.totalPoints && !this.playerModels[i].able){
				this.playerModels[i].able = true;
				tempReturn.push(this.playerModels[i]);
			}
			if(this.playerModels[i].able){
				this.totalPlayers ++;
			}
		}
		return tempReturn;
	},
	build:function(){

	},
	destroy:function(){

	},
	serialize:function(){
		
	}
});