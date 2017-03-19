var song = function () {
    if (!window.AudioContext) {
        if (!window.webkitAudioContext) {
            alert('No audiocontext found');
        }
        window.AudioContext = window.webkitAudioContext;
    }

    var context = new AudioContext();
    var audioBuffer, sourceNode, analyser, javascriptNode;
    var song_ind = 0, songs = ["never-met", "still-high", "dark", "fuck-boy"], loaded = [];
    var buffers = [];
    var changeSong = function () {
        var temp = -1;
        while (temp !== song_ind && temp <= 0) {
            temp = Math.floor(Math.random() * songs.length);
        }
        song_ind = temp;
        song_name = songs[song_ind];
        if (loaded.indexOf(song_name) == -1) {
            loaded.push(song_name);
            url = "./Content/" + song_name + ".mp3";
            new makeReqObj(url);
        }
        else {
            var i = loaded.indexOf(song_name);
            new playSound(sources[i])
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
                sources.push(buffer);
                playSound(buffer);
            })
        };
        _.request.send();
    }

    function playSound(buffer) {
        this.duration = Math.floor(buffer.duration * 1000);
        this.source = context.createBufferSource();
        this.source.connect(analyser);
        this.source.connect(context.destination);
        this.source.buffer = buffer;
        source.start(0);
        setTimeout(changeSong, this.duration);
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
