/*jshint undef:false */
var Ball = Entity.extend({
	init:function(vel, screen){
		this._super( true );
		this.updateable = false;
		this.deading = false;
		this.screen = screen;
		this.range = 80;
		this.width = 1;
		this.height = 1;
		this.type = 'bullet';
		this.target = 'enemy';
		this.fireType = 'physical';
		this.node = null;
		this.velocity.x = vel.x;
		this.velocity.y = vel.y;
		this.timeLive = 1000;
		this.power = 1;
		this.defaultVelocity = 1;

		this.imgSource = this.particleSource = 'bullet.png';
		// this.defaultVelocity.y = vel.y;
		//console.log(bulletSource);
	},
	startScaleTween: function(){
		TweenLite.from(this.getContent().scale, 0.3, {x:0, y:0, ease:'easeOutBack'});
	},
	build: function(){

		this.sprite = new PIXI.Sprite.fromFrame(this.imgSource);
		this.sprite.anchor.x = 0.5;
		this.sprite.anchor.y = 0.5;

		this.updateable = true;
		this.collidable = true;

		this.getContent().alpha = 0.5;
		TweenLite.to(this.getContent(), 0.3, {alpha:1});
		
		this.birdsCollided = [];

		this.particlesCounterMax = (Math.abs(this.velocity.x) + Math.abs(this.velocity.y)) / 3;
		this.particlesCounter = this.particlesCounterMax *2;

		this.collideArea = new PIXI.Rectangle(-50, -50, windowWidth + 100, windowHeight + 100);

		this.particlesCounterMax = 2;
        this.particlesCounter = 2;//this.particlesCounterMax *2;
	},
	update: function(){
		this._super();
		this.layer.collideChilds(this);
		// this.updateableParticles();
		if(this.velocity.y !== 0){
			this.updateableParticles();
		}
		if(this.timeLive <= 0 || this.getPosition() > windowWidth + 20){
			this.kill = true;
		}
		this.range = this.sprite.height / 3;
		if(this.isRotation){
			this.sprite.rotation += this.accumRot;
		}

		if(this.sinoid){
			this.velocity.y = Math.sin(this.sin) * (this.velocity.x * 5);
			this.sin += 0.2;
			this.getContent().rotation = 0;
		}

		if(!this.collideArea.contains(this.getPosition().x, this.getPosition().y)){
			this.kill = true;
		}
		// this.collideArea = new PIXI.Graphics();
		// this.collideArea.lineStyle(1,0x665544);
		// this.collideArea.drawCircle(this.centerPosition.x,this.centerPosition.y,this.range);
		// this.getContent().addChild(this.collideArea);
		// if(this.fall){
		//     this.velocity.y -= 0.1;
		// }
	},
	updateableParticles:function(){
        this.particlesCounter --;
        if(this.particlesCounter <= 0)
        {
            this.particlesCounter = this.particlesCounterMax;

            //efeito 1
            // var particle = new Particles({x: 0, y:0}, 120, this.particleSource, Math.random() * 0.05);
            // particle.maxScale = this.getContent().scale.x;
            // particle.growType = -1;
            // particle.build();
            // particle.gravity = 0.1;
            // particle.alphadecress = 0.08;
            // particle.scaledecress = -0.08;
            // particle.setPosition(this.getPosition().x - (Math.random() + this.getContent().width * 0.1) / 2,
            //     this.getPosition().y);
            // this.layer.addChild(particle);

            //efeito 2
            // var particle = new Particles({x: Math.random() * 4 - 2, y:Math.random()}, 120, this.particleSource, Math.random() * 0.05);
            // particle.maxScale = this.getContent().scale.x;
            // particle.maxInitScale = 0.4;
            // // particle.growType = -1;
            // particle.build();
            // particle.gravity = 0.1 * Math.random() + 0.2;
            // particle.alphadecress = 0.05;
            // particle.scaledecress = 0.03;
            // particle.setPosition(this.getPosition().x - (Math.random() + this.getContent().width * 0.1) / 2,
            //     this.getPosition().y);
            // this.layer.addChild(particle);


            //efeito 3
            var particle = new Particles({x: 0, y:0}, 120, this.particleSource, Math.random() * 0.05);
            particle.maxScale = this.getContent().scale.x;
            particle.maxInitScale = particle.maxScale;
            // particle.growType = -1;
            particle.build();
            particle.gravity = 0.0;
            particle.alphadecress = 0.08;
            particle.scaledecress = -0.04;
            particle.setPosition(this.getPosition().x - (Math.random() + this.getContent().width * 0.1) / 2,
                this.getPosition().y);
            this.layer.addChild(particle);
        }
    },
	collide:function(arrayCollide){
		// console.log('fireCollide', arrayCollide[0]);
		if(this.collidable){
			for (var i = arrayCollide.length - 1; i >= 0; i--) {
				if(arrayCollide[i].type === 'enemy'){
					var enemy = arrayCollide[i];
					this.velocity.y = 0;
					this.getContent().position.y = enemy.getContent().position.y;
					// enemy.kill
					enemy.preKill();
					this.screen.nextHorde();
					// arrayCollide[i].prekill();
				}
			}
		}
	},
	preKill:function(){
		if(this.invencible){
			return;
		}
		for (var i = 1; i >= 0; i--) {
			var particle = new Particles({x: Math.random() * 4, y:-(Math.random() * 2 + 1)}, 120, this.particleSource, Math.random() * 0.05);
			particle.build();
			particle.gravity = 0.1 * Math.random() + 0.2;
			particle.alphadecres = 0.1;
			particle.scaledecress = 0.02;
			particle.setPosition(this.getPosition().x - (Math.random() + this.getContent().width * 0.1) / 2,
				this.getPosition().y);
			this.layer.addChild(particle);
		}
		this.collidable = false;
		this.kill = true;
	},
});