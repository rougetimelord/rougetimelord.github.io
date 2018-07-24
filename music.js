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
        this.buffers = [];
        this.song_ind = 0;
        this.songs = ['never-met', 'still-high', 'dark', 'fuck-boy'];
        this.loadCurr = 0;
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
        this.changeSong();
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
    makeReq(url){
        let _ = this;
        this.request = new XMLHttpRequest();
        this.request.addEventListener("load", function(){
            window.context.decodeAudioData(this.response, function (buffer) {
                // when the audio is decoded play the sound
                if (_.firstReq) {
                    _.playSound(buffer);
                }
                _.buffers.push(buffer)
                if(_.buffers.length < _.songs.length)
                    _.loadNext();
            });
        })
        this.request.responseType = 'arraybuffer';
        this.request.open('GET', url, true);
        this.request.send();
    }
    load(i){
        let url = './Content/' + this.songs[i] + '.ogg';
        this.loadCurr = i;
        this.makeReq(url);
    }
    loadNext(){
        let self = this;
        this.loadCurr++;
        if (this.loadCurr < this.songs.length) {
            self.load(self.loadCurr);
        }
        else {
            self.loadCurr = 0;
            self.load(0);
        }
    }
    changeSong(){
        let self = this;
        this.song_ind = Math.floor(Math.random() * self.buffers.length);
        if (this.firstReq) {
            self.song_ind = Math.floor(Math.random() * self.songs.length);
            self.load(self.song_ind);
        }
        else {
            self.playSound(self.buffers[self.song_ind]);
        }
    }
};

window['Music'] = Music;