var d="function"==typeof Object.defineProperties?Object.defineProperty:function(a,b,c){a!=Array.prototype&&a!=Object.prototype&&(a[b]=c.value)},e="undefined"!=typeof window&&window===this?this:"undefined"!=typeof global&&null!=global?global:this;function f(){f=function(){};e.Symbol||(e.Symbol=h)}var h=function(){var a=0;return function(b){return"jscomp_symbol_"+(b||"")+a++}}();function k(){f();var a=e.Symbol.iterator;a||(a=e.Symbol.iterator=e.Symbol("iterator"));"function"!=typeof Array.prototype[a]&&d(Array.prototype,a,{configurable:!0,writable:!0,value:function(){return l(this)}});k=function(){}}function l(a){var b=0;return m(function(){return b<a.length?{done:!1,value:a[b++]}:{done:!0}})}function m(a){k();a={next:a};a[e.Symbol.iterator]=function(){return this};return a}function n(a){k();f();k();var b=a[Symbol.iterator];return b?b.call(a):l(a)}function p(){this.s=60;this.canvas=null;this.width=this.height=0;this.j=15;this.w=30;this.a=100;this.v=0}p.prototype.u=function(a){var b=this;b.width=window.innerWidth;b.height=window.innerHeight;window.onresize=function(){b.width=window.innerWidth;b.height=window.innerHeight;b.canvas.width=b.width;b.canvas.height=b.height;b.h()};var c=document.createElement("canvas");a.appendChild(c);this.canvas=c;this.canvas.width=this.width;this.canvas.height=this.height;a=[];for(c=0;c<this.a;c++)a[c]=new q(Math.random()*this.width,Math.random()*this.height,Math.random()*(this.w-this.j)+this.j);this.a=a;b=this;this.v=setInterval(function(){b.update();b.h()},1E3/this.s)};p.prototype.stop=function(){clearInterval(this.v)};p.prototype.update=function(){for(var a=1/this.s,b=0;b<this.a.length;b++){var c=this.a[b];c.y+=a*c.B;c.y>this.height&&(this.a[b]=new q(Math.random()*this.width,0,Math.random()*(this.w-this.j)+this.j))}};p.prototype.h=function(){var a=this.canvas.getContext("2d");a.fillStyle="#000000";a.fillRect(0,0,this.width,this.height);a.fillStyle="#ffffff";for(var b=0;b<this.a.length;b++){var c=this.a[b];a.fillRect(c.x,c.y,c.size,c.size)}};function q(a,b,c){var g=3*Math.random()+1;this.x=a;this.y=b;this.size=g;this.B=c}window.Starfield=p;p.prototype.initialise=p.prototype.u;function r(){var a=this;window.context=new AudioContext;if("running"!=window.context.state)return!1;this.b=window.context.createAnalyser();this.b.smoothingTimeConstant=.3;this.b.fftSize=1024;this.c=window.context.createGain();this.c.gain.setValueAtTime(0,window.context.currentTime);this.c.connect(window.context.destination);this.b.connect(this.c);this.h="";this.i=!0;this.g=[];this.l=0;this.m=["never-met","still-high","dark","fuck-boy"];this.f=0;document.addEventListener("visibilitychange",function(){a.c.gain.linearRampToValueAtTime(document.hidden?.03:.35,window.context.currentTime+(document.hidden?.75:.3));document.hidden&&a.c.gain.setValueAtTime(.01,window.context.currentTime+60)});this.source=this.duration=this.request="";this.A();this.o()}r.prototype.A=function(){this.h=requestAnimationFrame(this.A.bind(this));var a=new Uint8Array(this.b.frequencyBinCount);this.b.getByteFrequencyData(a);for(var b=document.getElementsByClassName("react"),c=n(b),g=c.next();!g.done;g=c.next())g.value.classList.remove("light");if(70<=function(a){return a.reduce(function(a,b){return a+b})/a.length}(a))for(a=n(b),b=a.next();!b.done;b=a.next())b.value.classList.add("light")};function t(a,b){a.source=window.context.createBufferSource();a.source.connect(a.b);a.source.buffer=b;a.duration=1E3*b.duration;a.source.start(0);setTimeout(a.o.bind(a),a.duration);a.i&&(a.c.gain.linearRampToValueAtTime(.35,window.context.currentTime+1.5),a.i=!1)}function u(a,b){a.request=new XMLHttpRequest;a.request.addEventListener("load",function(){window.context.decodeAudioData(this.response,function(b){a.i&&t(a,b);a.g.push(b);a.g.length<a.m.length&&(a.f++,a.f<a.m.length?a.load(a.f):(a.f=0,a.load(0)))})});a.request.responseType="arraybuffer";a.request.open("GET",b,!0);a.request.send()}r.prototype.load=function(a){var b="./Content/"+this.m[a]+".ogg";this.f=a;u(this,b)};r.prototype.o=function(){this.l=Math.floor(Math.random()*this.g.length);this.i?(this.l=Math.floor(Math.random()*this.m.length),this.load(this.l)):t(this,this.g[this.l])};window.Music=r;var v;function w(a){var b=new XMLHttpRequest;b.open("GET",a,!0);b.timeout=4E3;b.onload=function(){if(200==b.status||304==b.status)v.innerHTML=b.responseText,x()};b.send()}function x(){var a=document.getElementsByClassName("xhr");if(history.pushState&&0!=a.length)for(var b=0;b<a.length;b++){var c=a[b];c.addEventListener("click",function(a){a.preventDefault();w(c.href)},!1)}}document.addEventListener("DOMContentLoaded",function(){v=document.getElementsByClassName("main")[0];x();(new p).u(document.getElementById("back"));new r;"suspended"==window.context.state&&(window.context.close(),document.addEventListener("click",function(){"running"!=window.context.state&&new r}))});