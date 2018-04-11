function Starfield(){this.fps=60;this.canvas=null;this.width=this.width=0;this.minVelocity=15;this.maxVelocity=30;this.stars=100;this.intervalId=0}
Starfield.prototype.initialise=function(c){var a=this;this.containerDiv=c;a.width=window.innerWidth;a.height=window.innerHeight;window.onresize=function(b){a.width=window.innerWidth;a.height=window.innerHeight;a.canvas.width=a.width;a.canvas.height=a.height;a.draw()};var b=document.createElement("canvas");c.appendChild(b);this.canvas=b;this.canvas.width=this.width;this.canvas.height=this.height};
Starfield.prototype.start=function(){for(var c=[],a=0;a<this.stars;a++)c[a]=new Star(Math.random()*this.width,Math.random()*this.height,3*Math.random()+1,Math.random()*(this.maxVelocity-this.minVelocity)+this.minVelocity);this.stars=c;var b=this;this.intervalId=setInterval(function(){b.update();b.draw()},1E3/this.fps)};Starfield.prototype.stop=function(){clearInterval(this.intervalId)};
Starfield.prototype.update=function(){for(var c=1/this.fps,a=0;a<this.stars.length;a++){var b=this.stars[a];b.y+=c*b.velocity;b.y>this.height&&(this.stars[a]=new Star(Math.random()*this.width,0,3*Math.random()+1,Math.random()*(this.maxVelocity-this.minVelocity)+this.minVelocity))}};
Starfield.prototype.draw=function(){var c=this.canvas.getContext("2d");c.fillStyle="#000000";c.fillRect(0,0,this.width,this.height);c.fillStyle="#ffffff";for(var a=0;a<this.stars.length;a++){var b=this.stars[a];c.fillRect(b.x,b.y,b.size,b.size)}};function Star(c,a,b,d){this.x=c;this.y=a;this.size=b;this.velocity=d};