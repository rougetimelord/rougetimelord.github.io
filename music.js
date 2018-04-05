var song = function () {
    if (!window.AudioContext) {
        if (!window.webkitAudioContext) {
            var e = document.createElement('audio');
            e.src = './Content/fuck-boy.mp3';
            e.autoplay = true;
            e.loop = true;
            return document.body.appendChild(e);
        }
        window.AudioContext = window.webkitAudioContext;
    }
    
    var context = new AudioContext();
    var analyser, javascriptNode, gainNode, firstReq = true;
    var buffers = [], song_ind = 0, songs = ['never-met', 'still-high', 'dark', 'fuck-boy'];
    
    var changeSong = function () {
        song_ind = Math.floor(Math.random() * buffers.length);
        if (firstReq) {
            song_ind = Math.floor(Math.random() * songs.length);
            load(song_ind);
        }
        else {
            new playSound(buffers[song_ind]);
        }
    };

    var loadCurr = 0;

    var load = function (i) {
        var url = './Content/' + songs[i] + '.mp3';
        loadCurr = i;
        new makeReqObj(url);
    };

    var loadNext = function () {
        loadCurr++;
        if (loadCurr < songs.length) {
            load(loadCurr);
        }
        else {
            loadCurr = 0;
            load(loadCurr);
        }
    };

    function setupNode() {
        // setup a javascript node
        javascriptNode = context.createScriptProcessor(2048, 1, 1);
        // connect to destination, else it isn't called
        javascriptNode.connect(context.destination);
        // setup analyser
        analyser = context.createAnalyser();
        analyser.smoothingTimeConstant = 0.3;
        analyser.fftSize = 1024;
        // we use the javascript node to draw at a specific interval.
        analyser.connect(javascriptNode);
        gainNode = context.createGain();
        gainNode.gain.setValueAtTime(.4, context.currentTime);
        gainNode.connect(context.destination);
        // start loop
        changeSong();
    }
    setupNode();

    function makeReqObj(url) {
        var _ = this;
        _.request = new XMLHttpRequest();
        _.request.open('GET', url, true);
        _.request.responseType = 'arraybuffer';
        // When loaded decode the data
        _.request.onload = function () {
            // decode the data
            context.decodeAudioData(_.request.response, function (buffer) {
                // when the audio is decoded play the sound
                if (firstReq) {
                    firstReq = false;
                    new playSound(buffer);
                }
                buffers.push(buffer);
                if(buffers.length < songs.length)
                    loadNext();
            });
        };
        _.request.send();
    }

    function playSound(buffer) {
        this.source = context.createBufferSource();
        this.source.connect(analyser);
        this.source.connect(gainNode);
        this.source.buffer = buffer;
        this.duration = Math.floor(buffer.duration * 1000);
        this.source.start(0);
        setTimeout(changeSong, this.duration);
    }

    javascriptNode.onaudioprocess = function () {

        // get the average, bincount is fftsize / 2
        var array = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(array);
        var average = getAverageVolume(array);
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

    function getAverageVolume(array) {
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

    window.addEventListener('focus', ()=>{
        gainNode.gain.linearRampToValueAtTime(.4, context.currentTime + 0.3);
    });
    window.addEventListener('blur', ()=>{
        gainNode.gain.linearRampToValueAtTime(.05, context.currentTime + 1.2);
    });
};
