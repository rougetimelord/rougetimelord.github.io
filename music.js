var Music = class {
    constructor(){
        window.context = new AudioContext();
        if(window.context.state!='running'){return !1;}
        //Set up javascript node, TODO: use audio worker
        this.javascriptNode = window.context.createScriptProcessor(2048, 1, 1);
        //Connect to destination, else it isn't called
        this.javascriptNode.connect(window.context.destination);
        this.javascriptNode.onaudioprocess = ()=>{
            //Get the average, bincount is fftsize / 2
            var array = new Uint8Array(this.analyser.frequencyBinCount);
            this.analyser.getByteFrequencyData(array);
            var average = this.getAverageVolume(array);
            var display = document.getElementsByClassName('react');
            for (var i = 0; i < display.length; i++) {
                display[i].classList.remove('light');
            }
            if (average >= 70) {
                for (var j = 0; j < display.length; j++) {
                    display[j].classList.add('light');
                }
            }
        };
        //Set up analyser
        this.analyser = window.context.createAnalyser();
        this.analyser.smoothingTimeConstant = 0.3;
        this.analyser.fftSize = 1024;
        this.analyser.connect(this.javascriptNode);
        //Set up gain node
        this.gainNode = window.context.createGain();
        this.gainNode.gain.setValueAtTime(0, window.context.currentTime);
        this.gainNode.connect(window.context.destination);
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
        //Start playing music
        this.changeSong();
    }
    playSound(buffer){
        this.source = window.context.createBufferSource();
        this.source.connect(this.analyser);
        this.source.connect(this.gainNode);
        this.source.buffer = buffer;
        this.duration = buffer.duration * 1E3;
        this.source.start(0);
        this.songTimeout = setTimeout(this.changeSong.bind(this), this.duration);
        if(this.firstReq){
            this.gainNode.gain.linearRampToValueAtTime(.35, window.context.currentTime + 1.5);
            this.firstReq = !1;
        }
    }
    /*async array2store(b){
        let str = [].reduce.call(new Uint8Array(b),function(p,c){window.p=p;return p+String.fromCharCode(c)},'');
        let zip = window.lzen(str);
        window.localStorage.setItem(String(this.loadCurr), zip)
    }
    async store2array(b){
        let array = Uint8Array.from(atob(b), c => c.charCodeAt(0));
        return array.buffer;
    }*/
    makeReq(url){
        let _ = this;
        this.request = new XMLHttpRequest();
        this.request.addEventListener("load", function(){
            //_.array2store(this.response, _)
            // decode the data
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
        //if(!!window.localStorage.getItem(String(i))){
            //_.playSound(_.b642array(window.localStorage.getItem(String(i))));
        //}
        //else{
            let url = './Content/' + this.songs[i] + '.mp3';
            this.loadCurr = i;
            this.makeReq(url);
        //}
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
    getAverageVolume(array){
        var values = 0;
        var average;
        var length = array.length;
        // get all the frequency amplitudes
        for (var i = 0; i < length; i++) {
            values += array[i];
        }
        average = values / length;
        return average;
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