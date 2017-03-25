var song = function () {
    if (!window.AudioContext) {
        if (!window.webkitAudioContext) {
            alert('No audiocontext found');
        }
        window.AudioContext = window.webkitAudioContext;
    }

    var context = new AudioContext();
    var audioBuffer, sourceNode, analyser, javascriptNode;
    var i = 0, songs = ["never-met", "still-high", "dark", "fuck-boy"], loaded = [];
    var sources = [];
    var changeSong = function () {
        var temp = -1;
        while (temp !== i && temp <= 0) {
            temp = Math.floor(Math.random() * songs.length);
        }
        i = temp;
        song_name = songs[i];
        if (loaded.indexOf(song_name) == -1) {
            load(i);
        }
        else {
            i = loaded.indexOf(song_name);
            playSound(sources[i])
        }
    }
    var loadCurr;

    var load = function (i) {
        url = "./Content/" + songs[i] + ".mp3";
        loadCurr = i;
        new makeReqObj(url);
    }

    var loadNext = function () {
        loadCurr++;
        if (loadCurr < songs.length) {
            load(loadCurr);
        }
        else {
            loadCurr = 0;
            load(loadCurr);
        }
    }

    // load the sound
    setupAudioNodes();

    function setupAudioNodes() {
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
        // start loop
        changeSong();
    }

    var firstReq = true;

    function makeReqObj(url) {
        _ = this;
        _.request = new XMLHttpRequest();
        _.request.open('GET', url, true);
        _.request.responseType = 'arraybuffer';
        // When loaded decode the data
        _.request.onload = function () {
            console.log(url, _.request.response);
            // decode the data
            context.decodeAudioData(_.request.response, function (buffer) {
                // when the audio is decoded play the sound
                this.source = context.createBufferSource();
                this.source.connect(analyser);
                this.source.connect(context.destination);
                this.source.buffer = buffer;
                sources.push(this.source);
                if (firstReq) {
                    firstReq = false;
                    playSound(this.source)
                }
                if(sources.length < songs.length)
                    loadNext();
            })
        };
        _.request.send();
    }

    function playSound(source) {
        var duration = Math.floor(source.buffer.duration * 1000);
        source.start(0);
        setTimeout(changeSong, duration);
    }

    javascriptNode.onaudioprocess = function () {

        // get the average, bincount is fftsize / 2
        var array = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(array);
        var average = getAverageVolume(array)
        var display = document.getElementsByClassName('react');

        for (var i = 0; i < display.length; i++) {
            display[i].classList.remove('light');
        }

        if (average >= 70) {
            for (var i = 0; i < display.length; i++) {
                display[i].classList.add('light');
            }
        }
    }

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

    // log if an error occurs
    function onError(e) {
        console.log(e);
    }
}
