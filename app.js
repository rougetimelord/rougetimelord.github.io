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
            alert('no audiocontext found');
        }
        window.AudioContext = window.webkitAudioContext;
    }

    var context = new AudioContext();
    var audioBuffer;
    var sourceNode;
    var i = 0, songs = ["never-met", "still-high", "dark", "fuck-boy"];
    var player = document.getElementById('player');
    var changeSong = function () {
        var temp = -1;
        while (temp !== i && temp <= 0) {
            temp = Math.floor(Math.random() * songs.length);
        }
        i = temp;
        src = "./Content/" + songs[i] + ".mp3";
        loadSound(src);
    }
    // load the sound
    setupAudioNodes();
    loadSound("wagner-short.ogg");

    function setupAudioNodes() {
        // create a buffer source node
        sourceNode = context.createBufferSource();

        // and connect to destination
        sourceNode.connect(context.destination);
    }

    // load the specified sound
    function loadSound(url) {
        var request = new XMLHttpRequest();
        request.open('GET', url, true);
        request.responseType = 'arraybuffer';

        // When loaded decode the data
        request.onload = function () {

            // decode the data
            context.decodeAudioData(request.response, function (buffer) {
                // when the audio is decoded play the sound
                dur = Math.floor(buffer.duration * 1000);
                playSound(buffer);
                setTimeout(changeSong, dur);
            }, onError);
        }
        request.send();
    }


    function playSound(buffer) {
        sourceNode.buffer = buffer;
        sourceNode.start(0);
    }

    // log if an error occurs
    function onError(e) {
        console.log(e);
    }
    changeSong();
}

document.addEventListener('DOMContentLoaded', function () {
    addXHR();
    runStar();
    song();
}
);
