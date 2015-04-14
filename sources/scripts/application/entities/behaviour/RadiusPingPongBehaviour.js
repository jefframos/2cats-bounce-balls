/*jshint undef:false */
var RadiusPingPongBehaviour = Class.extend({
	init:function(props){
		this.props = props;
		this.left = Math.random() < 0.5;
		this.radius = windowWidth * 0.2 * Math.random() + windowWidth * 0.22;
		// this.position = {x: windowWidth * 0.15 + (windowWidth * 0.7 * Math.random()), y:windowHeight * 0.2 + Math.random() * windowHeight * 0.3};
		this.position = {x: windowWidth / 2, y:windowHeight * 0.2 + Math.random() * windowHeight * 0.3};
		this.centerPos = {x: windowWidth / 2, y:windowHeight / 2 - ((windowHeight / 2) - this.radius * 2 ) * Math.random()};
		this.angle = 3.14;
		this.angleSpd = Math.random() * 0.05 + 0.045;
		this.side = Math.random() < 0.5 ? 1 : -1;
		this.angleMin = 90 * 3.14 / 180;
		this.angleMax = 270 * 3.14 / 180;
		this.invert = false;
		// var temp = this.angleMax;
		// if(Math.random() < 0.5){
		// 	// this.angleMax = this.angleMin;
		// 	// this.angleMin = temp;
		// 	this.invert = true;
		// 	this.side *= -1;
		// }

		// console.log(this.angleMin, this.angleMax);
	},
	clone:function(){
		return new RadiusPingPongBehaviour(this.props);
	},
	update:function(entity){
		entity.getContent().position.x = Math.sin(this.angle) * this.radius + this.centerPos.x;
		entity.getContent().position.y = Math.cos(this.angle) * this.radius + this.centerPos.y;
		this.angle += (this.angleSpd * this.side);

		if(!this.invert){
			if(this.angle < this.angleMin && this.side < 0){
				this.side *= -1;
			}

			if(this.angle > this.angleMax && this.side > 0){
				this.side *= -1;
			}
		}
		// else{
		// 	if(this.angle > this.angleMin && this.side < 0){
		// 		this.side *= -1;
		// 	}

		// 	if(this.angle < this.angleMax && this.side > 0){
		// 		this.side *= -1;
		// 	}
		// }
	},
	build:function(){

	},
	destroy:function(){

	},
	serialize:function(){
		
	}
});