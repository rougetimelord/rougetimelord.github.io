var song = function () {
    if (!window.AudioContext) {
        if (!window.webkitAudioContext) {
            alert('No audiocontext found');
        }
        window.AudioContext = window.webkitAudioContext;
    }

    var context = new AudioContext();
    var audioBuffer, sourceNode, analyser, javascriptNode;
    var i = 0, songs = ["never-met", "still-high", "dark", "fuck-boy"];
    var song_buffers = [];
    var changeSong = function () {
        var temp = -1;
        while (temp !== i && temp <= 0) {
            temp = Math.floor(Math.random() * songs.length);
        }
        i = temp;
        playSound(song_buffers[i]);
    }
    // load the sound
    setupAudioNodes();

    function setupAudioNodes() {
        // create a buffer source node
        sourceNode = context.createBufferSource();
        // setup a javascript node
        javascriptNode = context.createScriptProcessor(2048, 1, 1);
        // connect to destination, else it isn't called
        javascriptNode.connect(context.destination);
        // setup analyser
        loadSounds();
        analyser = context.createAnalyser();
        analyser.smoothingTimeConstant = 0.3;
        analyser.fftSize = 1024;
        // connect stuff
        sourceNode.connect(analyser);
        // we use the javascript node to draw at a specific interval.
        analyser.connect(javascriptNode);
        // and connect to destination
        sourceNode.connect(context.destination);
        // load all songs
    }

    // load the specified sound
    function loadSounds() {
        for (var i = 0; i < songs.length; i++) {
            url = "./Content/" + songs[i] + ".mp3";
            new makeReqObj(url);
        }
    }

    function makeReqObj(url) {
        this.request = new XMLHttpRequest();
        this.request.open('GET', url, true);
        this.request.responseType = 'arraybuffer';
        // When loaded decode the data
        this.request.onload = function () {
            // decode the data
            context.decodeAudioData(request.response, function (buffer) {
                // when the audio is decoded play the sound
                song_buffers.push(buffer);
            }, onError);
        }
        this.request.send();
    }

    function playSound(buffer) {
        sourceNode.buffer = buffer;
        var duration = Math.floor(buffer.duration * 1000);
        sourceNode.start(0);
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
