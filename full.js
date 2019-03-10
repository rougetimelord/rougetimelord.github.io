var fill = str =>{
    let div = document.getElementsByClassName('main')[0];
    let frag = document.createRange().createContextualFragment(str);
    let main = frag.querySelector('.main');
    div.innerHTML = main.innerHTML;
};

var swap = res => {
    let req = new XMLHttpRequest();
    req.open('GET', res, true);
    req.timeout = 4000;
    req.onload = function () {
        if (req.status == 200 || req.status == 304) {
            fill(req.responseText);
            addXHR();
        }
    };
    req.send();
};

var addXHR = () => {
    let linkArray = document.getElementsByClassName('xhr');
    if (linkArray.length != 0) {
        for (let i of linkArray) {
            i.addEventListener('click', e=>{
                e.preventDefault();
                swap(i.href);
            }, false);
        }
    }
};

document.addEventListener('DOMContentLoaded', ()=>{
    addXHR();
    let s = new Starfield();
    s.initialize();
    let music = new Music();
    if(window.context.state == 'suspended'){
        let f = ()=>{music.setup(); f=null};
        document.addEventListener("click", f, {once: !0});
    }
}
);
var Music = class {
    constructor(){
        //Initialize RAF variable
        this.draw = '';
        //Initialize audio buffer object
        this.buffers = {};
        //Set song title array
        this.songs = ['dreamy', 'afterparty', 'superstar', 'fuck-boy', 'boy'];
        //Initialize the level sample array
        this.samples = [70];
        //Initialize the sampled average
        this.sampled_avg = 0;
        
        //Initialize the two nodes used
        this.analyser = null;
        this.gainNode = null;

        //Initialize variables
        this.source = this.duration = this.request = this.songTimeout = '';

        //Test creating the audio context
        window.context = new AudioContext();
        //If it spawns in a playable state play through it
        if(window.context.state=='running'){this.setup();}
        //Otherwise load everything and cache
        else{this.load_all();return;}
    }

    setup(){
        //Set up analyser
        this.analyser = window.context.createAnalyser();
        this.analyser.smoothingTimeConstant = 0.3;
        this.analyser.fftSize = 1024;

        //Set up gain node
        this.gainNode = window.context.createGain();
        this.gainNode.gain.setValueAtTime(0.1, window.context.currentTime);

        //Connect nodes
        this.gainNode.connect(window.context.destination);
        this.analyser.connect(this.gainNode);
        
        //Add visibility listener
        document.addEventListener('visibilitychange', ()=>{
            this.gainNode.gain.cancelScheduledValues(window.context.currentTime);
            this.gainNode.gain.linearRampToValueAtTime(document.hidden ? .01: 0.1, window.context.currentTime + (document.hidden ? 0.75: 0.3) );
            if(document.hidden){
                this.gainNode.gain.setValueAtTime(0, window.context.currentTime + 60);
            }
        });
        
        //Start playing music
        this.visualize();
        if(Object.keys(this.buffers)==0){this.load_all();}
        else{
            window.context.resume();
            this.changeSong();
        }
    }

    visualize(){
        //Register draw loop
        this.draw = requestAnimationFrame(this.visualize.bind(this));

        //Set up the array
        let array = new Uint8Array(this.analyser.frequencyBinCount);
        this.analyser.getByteFrequencyData(array);

        //Easy average function
        let avg = arr => {
            let sum = arr.reduce(function(a, b) { return a + b; });
            return sum / arr.length;
        };

        //Calculate the rolling average
        this.sampled_avg = avg(this.samples);

        //Light up reactive text if the current average is above the rolling average
        let display = document.getElementsByClassName('react');
        for (let i of display) {
            i.classList.remove('light');
        }
        if (avg(array) >= this.sampled_avg) {
            for (let j of display) {
                j.classList.add('light');
            }
        }

        //Push this average to the stack
        if(this.samples.push(avg(array)) > 10){this.samples.shift();}
    }

    playSound(buffer){
        //Create an audio source and connect it to output
        this.source = window.context.createBufferSource();
        this.source.connect(this.analyser);

        //Set the buffer to be played
        this.source.buffer = buffer;

        //Setup the timeout to change songs
        this.duration = buffer.duration * 1E3;
        this.source.start(0);
        this.songTimeout = setTimeout(this.changeSong.bind(this), this.duration);
    }

    makeReq(url, id, callback){
        let _ = this;
        this.request = new XMLHttpRequest();
        this.request.addEventListener('load', function(){
            window.context.decodeAudioData(this.response, function (buffer) {
                // when the audio is decoded play the sound
                _.buffers[id] = buffer;
                if(callback){
                    callback.bind(_)(_.buffers[id]);
                }
            });
        });
        this.request.responseType = 'arraybuffer';
        this.request.open('GET', url, true);
        this.request.send();
    }

    loud_load(song_id){
        //Load a song with the play function as the callback
        let url = './Content/' + song_id + '.ogg';
        this.makeReq(url, song_id, this.playSound);
    }

    silent_load(song_id){
        let url = './Content/' + song_id + '.ogg';
        this.makeReq(url, song_id, false);
    }

    changeSong(){
        //Randomly pick a song and play it
        let keys = Object.keys(this.buffers);
        let key = keys[Math.floor(Math.random() * keys.length)];

        this.playSound(this.buffers[key]);
    }
    load_all(){
        //Pick a random song
        let r = Math.floor(Math.random() * this.songs.length);
        let song_id = this.songs.splice(r, 1)[0];

        //Load the first song
        if(window.context.state=='running'){this.loud_load(song_id)}
        else{this.silent_load(song_id);}

        //Load every other song
        this.songs.forEach(title=>{
            this.silent_load(title);
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
        this.containerDiv = document.getElementById('back');
        this.canvas = document.createElement('canvas');
        this.containerDiv.appendChild(this.canvas);
        //	Get the drawing context.
        this.ctx = this.canvas.getContext('2d');
        this.height = 0;
        this.width = 0;
        this.minVelocity = 15;
        this.maxVelocity = 30;
        this.stars = 100;
        this.old = 0;
        let date = new Date();
        let ddmm = String(date.getDate()) + String(date.getMonth + 1);
        this.meme = (ddmm == "204");
        this.image = null;
    }
    //	The main function - initializes the starfield.
    initialize() {
        var self = this;
        this.width = window.innerWidth;
        this.height = window.innerHeight;
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
            stars[i] = new Star(Math.random() * this.width, Math.random() * this.height, Math.floor(Math.random() * 7) + 10, (Math.random() * this.maxVelocity) + this.minVelocity);
        }
        this.stars = stars;
        if(this.meme){
            this.image = new Image();
            this.image.src = "./Content/meme.png";
        }
        //	Start the timer.
        requestAnimationFrame(this.raf.bind(this));
    }
    raf(time) {
        this.update(time);
        (this.meme) ? this.memeDraw() : this.draw();
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
                this.stars[i] = new Star(Math.random() * this.width, 0, Math.random() * 3 + 7, (Math.random() * this.maxVelocity) + this.minVelocity);
            }
        }
        this.old = t;
        return;
    }
    draw() {
        //	Draw the background.
        this.ctx.fillStyle = '#000000';
        this.ctx.fillRect(0, 0, this.width, this.height);
        //	Draw stars.
        this.ctx.fillStyle = '#ffffff';
        for (var i = 0; i < this.stars.length; i++) {
            var star = this.stars[i];
            this.ctx.font = star.size + "px 'Roboto', sans-serif";
            this.ctx.fillText("*", star.x, star.y);
        }
        return;
    }
    memeDraw(){
        //	Draw the background.
        this.ctx.fillStyle = "#000000";
        this.ctx.fillRect(0, 0, this.width, this.height);
        //	Draw memes.
        this.ctx.fillStyle = '#ffffff';
        this.stars.forEach(star => {
            this.ctx.drawImage(this.image, star.x, star.y, star.size * 4, star.size * 4)
        });
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
Starfield.prototype['initialize'] = Starfield.prototype.initialize;
