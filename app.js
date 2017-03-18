var swap = function (res) {
    var req = new XMLHttpRequest();
    req.open("GET", res, true);
    req.timeout = 4000;
    req.onload = function () {
        if (req.status == 200 || req.status == 304) {
            document.getElementsByClassName('main')[0].innerHTML = req.responseText;
            addXHR();
        } else { console.log(req.status); }
    }
    req.send();
}

var addXHR = function () {
    var linkArray = document.getElementsByClassName('xhr');
    if (!!history.pushState && linkArray.length != 0) {
        for (var i = 0; i < linkArray.length; i++) {
            var a = linkArray[i]
            a.addEventListener("click", function (e) {
                e.preventDefault();
                swap(a.href);
            }, false);
        }
    }
}

var runStar = function () {
    var container = document.getElementById('back');
    var starfield = new Starfield();
    starfield.initialise(container);
    starfield.start();
}

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
        playSound(song_buffers[i])
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
        loadSounds();
    }

    // load the specified sound
    function loadSounds() {
        for (var i = 0; i < songs.length; i++) {
            var request = new XMLHttpRequest();
            request.open('GET', url, true);
            request.responseType = 'arraybuffer';
            src = "./Content/" + songs[i] + ".mp3";
            // When loaded decode the data
            request.onload = function () {
                // decode the data
                context.decodeAudioData(request.response, function (buffer) {
                    // Load buffer into array
                    song_buffers.append(buffer);
                }, onError);
            }
            request.send();
        }
        changeSong();
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

document.addEventListener('DOMContentLoaded', function () {
    addXHR();
    runStar();
    song();
}
);
