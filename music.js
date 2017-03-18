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
            url = "./Content/" + songs[i] + ".mp3";
            new makeReqObj(url);
        }
        else {
            i = loaded.indexOf(song_name);
            playSound(sources[i])
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
                this.source = context.createBufferSource();
                this.source.connect(analyser);
                this.source.connect(context.destination);
                this.source.buffer = buffer;
                sources.push(this.source);
                playSound(this.source);
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

        if (average >= 50) {
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
