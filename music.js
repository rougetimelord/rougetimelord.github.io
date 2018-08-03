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