var dust = [];

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function Particle(x, y, maxLifeTime, birth, r, g, b) {
	this.x = x;
	this.y = y;
	this.t = 0;
	this.lifespan = maxLifeTime * Math.random();
	var min, max;
    max = 5;
	min = (-5);
	this.speedX = (Math.random() * (max - min + 1)) + min;
	this.speedY0 = 10 * Math.random();
	this.speedY = 0;
	this.size = 6 * Math.random();
	this.alpha = Math.random() + 0.2;
	this.birthTime = birth;
	this.r = r + getRandomInt(-20, 20);
	this.g = g + getRandomInt(-20, 20);
	this.b = b + getRandomInt(-20, 20);
}

function kaboom(x, y, particleCount, maxLifeTime, r, g, b) {
	var date, startTime, i;
    date = new Date();
	startTime = date.getTime();
			
	for (i = 0; i < particleCount; i += 1) {
		dust.push(new Particle(x, y, maxLifeTime, startTime, r, g, b));	
	}
}

var updateParticles = function(){
    var l = 0;
	for (l = 0; l < dust.length; l += 1) {
	
	  newDate = new Date();
	  now = newDate.getTime();
			
	  dust[l].t = (now - dust[l].birthTime) / 1000;
	  dust[l].speedY = dust[l].speedY0 - (dust[l].t);
				
  	dust[l].y -= dust[l].speedY;
  	dust[l].x += dust[l].speedX;
    dust[l].size += .155; 
	  if (dust[l].t >= dust[l].lifespan) {
    	dust.splice(l, 1);
	  }
	}
}

var drawParticles = function(){
    var n = 0;
for (n = 0; n < dust.length; n += 1) {
		    bg.fillRect(dust[n].x, dust[n].y, dust[n].size, dust[n].size);
	    }
}


    'use strict';
    
    var COLOR = 'rgb(120, 197, 158)';
    var paddle;
    var player;
    var ball;
    var canvas;
    var bg;
    var keysDown = {}, keysUp = {}, game = {};

    var score = 0;

    var Thing = function(x, y, w, h, sx, sy){
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.sx = sx;
        this.sy = sy;
  
        this.draw = function(c){
            c.fillRect(this.x, this.y, this.w, this.h);
        };
    };

window.addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
	delete keysUp[e.keyCode];
}, false);

window.addEventListener("keyup", function (e) {
	keysUp[e.keyCode] = true;
	delete keysDown[e.keyCode];
}, false);


// shim layer with setTimeout fallback
window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();

var init = function(){
  canvas = document.getElementById('world');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  
  bg = canvas.getContext('2d');
    
  bg.fillStyle = COLOR;
    
  paddle = new Thing(200, canvas.height - 100, 150, 50, 10, 0);
  ball = new Thing(200, 100, 20, 20, 1, 6);
}
var update = function(){
    var i = 0;

  if (keysDown.hasOwnProperty(39))
  { // Player 1 holding right
    paddle.x += paddle.sx;
	}
  if (keysDown.hasOwnProperty(37)) { // Player 1 holding right
    paddle.x -= paddle.sx;
	}
    
    if( ball.y < 0){
        ball.sy *= -1;
    }
    
    if(ball.x < 0 || ball.x + ball.w > canvas.width){
        ball.sx *= -1;
    }
    
    if (ball.y + ball.h > paddle.y && ball.y < paddle.y + paddle.h && ball.x > paddle.x && ball.x + ball.w < paddle.x + paddle.w){
        ball.sx = (ball.x - (paddle.x + paddle.w / 2)) / 20;
        
        ball.sy += 2;
        ball.sy *= -1;
        
        kaboom(ball.x, ball.y + ball.h + 10, 30, 1, 240,240,240)
        score += 1;
        document.getElementById('score').innerHTML = score;
    }
    
    if(ball.y > canvas.height){
      document.getElementById('score').innerHTML = 'Game Over :(';        
    }
    
    ball.x += ball.sx;
    ball.y += ball.sy;
    
    updateParticles();
}

var render = function(){
  var i = 0;
  bg.clearRect(0,0,canvas.width, canvas.height);
  paddle.draw(bg);
  ball.draw(bg);
    
    drawParticles();
}

var doLoop = function(){
  update();
  render();
  requestAnimFrame(doLoop);
}

window.onload = function(){
  init();
  doLoop();
};