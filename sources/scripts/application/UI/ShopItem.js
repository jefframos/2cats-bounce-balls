/*jshint undef:false */
var ShopItem = Class.extend({
	init:function(screen, type, arrayModels, arrayPlaced){
		this.screen = screen;
		this.type = type;
		this.arrayModels = arrayModels;
		this.arrayPlaced = arrayPlaced;
		this.container = new PIXI.DisplayObjectContainer();
	},
	build:function(model){
		this.model = model;
		// console.log(model);

        
		this.backScroll = new PIXI.Graphics();
        this.backScroll.beginFill(0x000000);
        this.backScroll.drawRect(0,0,windowWidth, 120);
        this.backScroll.alpha = 0.2;
        this.container.addChild(this.backScroll);


        this.backShopItem = new PIXI.Graphics();
        this.backShopItem.beginFill(this.model.color);
        this.backShopItem.drawRect(0,0,150, 150);
        this.backShopItem.alpha = 1;
        this.container.addChild(this.backShopItem);

		var self = this;

		// alert(this.backShopItem.height);

		this.equipped = new PIXI.Text('EQUIPPED', {align:'center',font:'50px Vagron', fill:'#FFF', wordWrap:true, wordWrapWidth:500});
		scaleConverter(this.equipped.height, this.backShopItem.height, 0.3, this.equipped);
		this.equipped.position.x = this.backScroll.width - this.equipped.width - this.backShopItem.height * 0.1;
		this.equipped.position.y = this.backShopItem.height - this.equipped.height  + this.backShopItem.position.y;
		// this.equipped.position.y = 20;

		this.equipButton = new DefaultButton('UI_button_default_1.png', 'UI_button_default_1.png');
		this.equipButton.build();
		this.equipButton.addLabel(new PIXI.Text('EQUIP', {font:'30px Vagron', fill:'#FFFFFF'}), 33,5);
		this.equipButton.setPosition(this.backScroll.width - this.equipButton.getContent().width - this.backShopItem.height * 0.1,this.backShopItem.height - this.equipButton.getContent().height + this.backShopItem.position.y);//this.backBars.getContent().height - 20 - this.continueButton.height / 2 - 10);
		this.equipButton.clickCallback = this.equipButton.mouseDownCallback = function(){
			
			APP.appModel.currentPlayerModel = self.model;
			var targetArray = self.screen.shopList;
			for (var i = targetArray.length - 1; i >= 0; i--) {
				targetArray[i].updateStats();
			}
			self.updateStats();
		};

		this.buyButton = new DefaultButton('UI_button_default_1.png', 'UI_button_default_1.png');
		this.buyButton.build();
		this.buyButton.addLabel(new PIXI.Text(this.model.value+' BUY', {font:'30px Vagron', fill:'#FFFFFF'}), 33,10);
		this.buyButton.setPosition(this.backScroll.width - this.buyButton.getContent().width - this.backShopItem.height * 0.1,this.backShopItem.height - this.buyButton.getContent().height + this.backShopItem.position.y);//this.backBars.getContent().height - 20 - this.continueButton.height / 2 - 10);
		this.buyButton.clickCallback = this.buyButton.mouseDownCallback = function(){
			// alert(self.model.value);
			if(self.model.value > APP.totalCoins){
				return;
			}
			APP.totalCoins -= self.model.value;
			self.screen.updateCoins();
			
			APP.appModel.currentPlayerModel = self.model;
			APP.appModel.currentPlayerModel.enabled = true;
			var targetArray = self.screen.shopList;
			for (var i = targetArray.length - 1; i >= 0; i--) {
				targetArray[i].updateStats();
			}
			self.updateStats();
		};

		this.updateStats();

		
	},
	updateStats:function(){
		
		
		if(this.equipped && this.equipped.parent){
			this.equipped.parent.removeChild(this.equipped);
		}
		if(this.equipButton.getContent() && this.equipButton.getContent().parent){
			this.equipButton.getContent().parent.removeChild(this.equipButton.getContent());
		}
		if(this.buyButton.getContent() && this.buyButton.getContent().parent){
			this.buyButton.getContent().parent.removeChild(this.buyButton.getContent());
		}

		var isEquiped = false;

		if(APP.appModel.currentPlayerModel.id === this.model.id){
			this.container.addChild(this.equipped);
			isEquiped = true;
		}
		
		if(!isEquiped && this.model.enabled){
			this.container.addChild(this.equipButton.getContent());
		}else if(!this.model.enabled){
			this.container.addChild(this.buyButton.getContent());
		}
		// alert('updateStats here');
	},
	getContent:function(){
		return this.container;
	}
});