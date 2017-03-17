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
    var i = 0, songs = ["never-met", "still-high"], player = document.getElementById('player');
    var changeSong = function(){
        if (i > songs.length - 1)
            i = 0;
        player.src = "./Content/" + songs[i] + ".mp3";
        player.load();
        player.addEventListener("loadeddata", function () {
            dur = Math.floor(this.duration * 1000);
            i++;
            player.play();
            setTimeout(changeSong, dur);
        });
    }
    changeSong();
}

document.addEventListener('DOMContentLoaded', function () {
    addXHR();
    runStar();
    song();
}
);