var MAINDIV;

var swap = function (res) {
    var req = new XMLHttpRequest();
    req.open('GET', res, true);
    req.timeout = 4000;
    req.onload = function () {
        if (req.status == 200 || req.status == 304) {
            MAINDIV.innerHTML = req.responseText;
            addXHR();
        }
    };
    req.send();
};

var addXHR = function () {
    var linkArray = document.getElementsByClassName('xhr');
    if (linkArray.length != 0) {
        for (let i of linkArray) {
            i.addEventListener('click', e=>{
                e.preventDefault();
                swap(a.href);
            }, false);
        }
    }
};

document.addEventListener('DOMContentLoaded', ()=>{
    MAINDIV = document.getElementsByClassName('main')[0];
    addXHR();
    var s = new Starfield();
    s.initialise();
    let music = new Music();
    if(window.context.state == 'suspended'){
        window.context.close();
        document.addEventListener('click', ()=>{if(window.context.state!='running'){music = new Music();}});
    }
}
);
var Music = class {
    constructor(){
        window.context = new AudioContext();
        if(window.context.state!='running'){return !1;}
        //Set up analyser
        this.analyser = window.context.createAnalyser();
        this.analyser.smoothingTimeConstant = 0.3;
        this.analyser.fftSize = 1024;
        //Set up gain node
        this.gainNode = window.context.createGain();
        this.gainNode.gain.setValueAtTime(0, window.context.currentTime);
        //Connect nodes
        this.gainNode.connect(window.context.destination);
        this.analyser.connect(this.gainNode);
        //Run visualizer
        this.draw = '';
        //Set up variables
        this.firstReq = true;
        this.buffers = {};
        this.song_id = this.loadCurr = '';
        this.songs = ['never-met', 'still-high', 'dark', 'fuck-boy'];
        //Add visibility listener
        document.addEventListener('visibilitychange', ()=>{
            this.gainNode.gain.linearRampToValueAtTime(document.hidden ? .03: .35, window.context.currentTime + (document.hidden ? .75: 0.3) );
            if(document.hidden){
                this.gainNode.gain.setValueAtTime(.01, window.context.currentTime + 60);
            }
        });
        this.source = this.duration = this.request = this.songTimeout = '';
        //Start playing music
        this.visualize();
        this.load_all();
    }
    visualize(){
        this.draw = requestAnimationFrame(this.visualize.bind(this));
        let array = new Uint8Array(this.analyser.frequencyBinCount);
        this.analyser.getByteFrequencyData(array);
        let avg = arr => {
            let sum = arr.reduce(function(a, b) { return a + b; });
            return sum / arr.length;
        };
        let display = document.getElementsByClassName('react');
        for (let i of display) {
            i.classList.remove('light');
        }
        if (avg(array) >= 70) {
            for (let j of display) {
                j.classList.add('light');
            }
        }
    }
    playSound(buffer){
        this.source = window.context.createBufferSource();
        this.source.connect(this.analyser);
        this.source.buffer = buffer;
        this.duration = buffer.duration * 1E3;
        this.source.start(0);
        this.songTimeout = setTimeout(this.changeSong.bind(this), this.duration);
        if(this.firstReq){
            this.gainNode.gain.linearRampToValueAtTime(.35, window.context.currentTime + 1.5);
            this.firstReq = !1;
        }
    }
    makeReq(url, id, callback){
        let _ = this;
        this.request = new XMLHttpRequest();
        this.request.addEventListener("load", function(){
            window.context.decodeAudioData(this.response, function (buffer) {
                // when the audio is decoded play the sound
                _.buffers[id] = buffer;
                if(callback){
                    callback.bind(_)(_.buffers[id]);
                };
            });
        })
        this.request.responseType = 'arraybuffer';
        this.request.open('GET', url, true);
        this.request.send();
    }
    loud_load(){
        let url = './Content/' + this.song_id + '.ogg';
        this.makeReq(url, this.song_id, this.playSound);
    }
    silent_load(){
        let url = './Content/' + this.loadCurr + '.ogg';
        this.makeReq(url, this.loadCurr);
    }
    changeSong(){
        let keys = Object.keys(this.buffers);
        let key= keys[Math.floor(Math.random() * keys.length)]
        this.playSound(this.buffers[key]);
    }
    load_all(){
        let self = this;
        let r = Math.floor(Math.random() * this.songs.length);
        this.song_id = this.songs[r];
        this.songs.splice(r, 1);
        this.loud_load();
        this.songs.forEach(title=>{
            this.loadCurr = title;
            this.silent_load();
        });
    }
};

window['Music'] = Music;
/*
    Starfield lets you take a div and turn it into a starfield.

*/
//	Define the starfield class.
class Starfield {
    constructor() {
        this.fps = 60;
        this.containerDiv = document.getElementById('back');
        var canvas = document.createElement('canvas');
        this.containerDiv.appendChild(canvas);
        this.canvas = canvas;
        this.height = 0;
        this.width = 0;
        this.minVelocity = 15;
        this.maxVelocity = 30;
        this.stars = 100;
        this.old = 0;
    }
    //	The main function - initialises the starfield.
    initialise() {
        var self = this;
        self.width = window.innerWidth;
        self.height = window.innerHeight;
        window.onresize = () => {
            self.width = window.innerWidth;
            self.height = window.innerHeight;
            self.canvas.width = self.width;
            self.canvas.height = self.height;
        };
        //	Create the canvas.
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        //	Create the stars.
        var stars = [];
        for (var i = 0; i < this.stars; i++) {
            stars[i] = new Star(Math.random() * this.width, Math.random() * this.height, Math.random() * 3 + 1, (Math.random() * this.maxVelocity) + this.minVelocity);
        }
        this.stars = stars;
        //	Start the timer.
        requestAnimationFrame(this.raf.bind(this));
    }
    raf(time) {
        this.update(time);
        this.draw()
        requestAnimationFrame(this.raf.bind(this));
    }
    update(t) {
        let dt = (t - this.old)/1000;
        dt = (dt >= 5) ? 5 : dt;
        for (var i = 0; i < this.stars.length; i++) {
            var star = this.stars[i];
            star.y += dt * star.velocity;
            //	If the star has moved from the bottom of the screen, spawn it at the top.
            if (star.y > this.height) {
                this.stars[i] = new Star(Math.random() * this.width, 0, Math.random() * 3 + 1, (Math.random() * this.maxVelocity) + this.minVelocity);
            }
        }
        this.old = t;
        return;
    }
    draw() {
        //	Get the drawing context.
        var ctx = this.canvas.getContext('2d');
        //	Draw the background.
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, this.width, this.height);
        //	Draw stars.
        ctx.fillStyle = '#ffffff';
        for (var i = 0; i < this.stars.length; i++) {
            var star = this.stars[i];
            ctx.fillRect(star.x, star.y, star.size, star.size);
        }
        return;
    }
}

class Star {
    constructor(x, y, size, velocity) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.velocity = velocity;
    }
}

window['Starfield'] = Starfield;
Starfield.prototype['initialise'] = Starfield.prototype.initialise;
