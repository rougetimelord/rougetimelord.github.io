var Music = function () {    
    this.context = new AudioContext();
    this.analyser;
    this.javascriptNode;
    this.gainNode;
    this.this.firstReq = true;
    this.buffers = [];
    this.song_ind = 0;
    this.songs = ['never-met', 'still-high', 'dark', 'fuck-boy'];
    this.loadCurr = 0;
};
    
Music.prototype.changeSong = ()=>{
    let self = this;
    this.song_ind = Math.floor(Math.random() * this.buffers.length);
    if (this.firstReq) {
        self.song_ind = Math.floor(Math.random() * self.songs.length);
        self.load(self.song_ind);
    }
    else {
        new self.playSound(self.buffers[self.song_ind]);
    }
};

Music.prototype.load = (i)=>{
    let url = './Content/' + this.songs[i] + '.mp3';
    this.loadCurr = i;
    new this.makeReqObj(url);
};

Music.prototype.loadNext = ()=>{
    let self = this;
    this.loadCurr++;
    if (this.loadCurr < this.songs.length) {
        self.load(self.loadCurr);
    }
    else {
        self.loadCurr = 0;
        self.load(self.loadCurr);
    }
};

Music.prototype.makeReqObj = (url)=>{
    var _ = this;
    _.request = new XMLHttpRequest();
    _.request.open('GET', url, true);
    _.request.responseType = 'arraybuffer';
    // When loaded decode the data
    _.request.onload = function () {
        // decode the data
        this.context.decodeAudioData(_.request.response, function (buffer) {
            // when the audio is decoded play the sound
            if (this.firstReq) {
                this.firstReq = false;
                new _.playSound(buffer);
            }
            _.buffers.push(buffer);
            if(_.buffers.length < _.songs.length)
                _.loadNext();
        });
    };
    _.request.send();
};

Music.prototype.playSound = (buffer)=>{
    this.source = this.context.createBufferSource();
    this.source.connect(this.analyser);
    this.source.connect(this.gainNode);
    this.source.buffer = buffer;
    this.duration = Math.floor(buffer.duration * 1000);
    this.source.start(0);
    setTimeout(this.changeSong, this.duration);
};

Music.prototype.getAverageVolume = (array)=>{
    var values = 0;
    var average;
    var length = array.length;
    // get all the frequency amplitudes
    for (var i = 0; i < length; i++) {
        values += array[i];
    }
    average = values / length;
    return average;
};

Music.prototype.initialise = ()=>{
    // setup a javascript node
    this.javascriptNode = this.context.createScriptProcessor(2048, 1, 1);
    // connect to destination, else it isn't called
    this.javascriptNode.connect(this.context.destination);
    this.javascriptNode.onaudioprocess = ()=>{
        // get the average, bincount is fftsize / 2
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
    // setup analyser
    this.analyser = this.context.createAnalyser();
    this.analyser.smoothingTimeConstant = 0.3;
    this.analyser.fftSize = 1024;
    // we use the javascript node to draw at a specific interval.
    this.analyser.connect(this.javascriptNode);
    this.gainNode = this.context.createGain();
    this.gainNode.gain.setValueAtTime(.35, this.context.currentTime);
    this.gainNode.connect(this.context.destination);
    document.addEventListener('visibilitychange', ()=>{
        this.gainNode.gain.linearRampToValueAtTime(document.hidden ? .03: .35, this.context.currentTime + (document.hidden ? .75: 0.3) );
    });
    // start loop
    this.changeSong();
};