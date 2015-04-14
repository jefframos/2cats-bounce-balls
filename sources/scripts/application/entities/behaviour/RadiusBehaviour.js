/*jshint undef:false */
var RadiusBehaviour = Class.extend({
	init:function(props){
		this.props = props;
		this.left = Math.random() < 0.5;
		this.radius = windowWidth * 0.2 * Math.random() + windowWidth * 0.22;
		// this.position = {x: windowWidth * 0.15 + (windowWidth * 0.7 * Math.random()), y:windowHeight * 0.2 + Math.random() * windowHeight * 0.3};
		this.position = {x: windowWidth / 2, y:windowHeight * 0.2 + Math.random() * windowHeight * 0.3};
		this.centerPos = {x: windowWidth / 2, y:windowHeight / 2.2 - ((windowHeight / 1.7) - this.radius * 2 ) * Math.random()};
		this.angle = Math.random();
		this.angleSpd = Math.random() * 0.04 + 0.02;
		this.angleSpd *= APP.accelGame;
		this.side = Math.random() < 0.5 ? 1 : -1;
	},
	clone:function(){
		return new RadiusBehaviour(this.props);
	},
	update:function(entity){
		entity.getContent().position.x = Math.sin(this.angle) * this.radius + this.centerPos.x;
		entity.getContent().position.y = Math.cos(this.angle) * this.radius + this.centerPos.y;
		this.angle += (this.angleSpd * this.side);
	},
	build:function(){

	},
	destroy:function(){

	},
	serialize:function(){
		
	}
});