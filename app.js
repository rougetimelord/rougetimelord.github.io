var MAINDIV;
var swap = function (res) {
    var req = new XMLHttpRequest();
    req.open('GET', res, true);
    req.timeout = 4000;
    req.onload = function () {
        if (req.status == 200 || req.status == 304) {
            MAINDIV.innerHTML = req.responseText;
            addXHR();
        }
    };
    req.send();
};

var addXHR = function () {
    var linkArray = document.getElementsByClassName('xhr');
    if (!!history.pushState && linkArray.length != 0) {
        for (var i = 0; i < linkArray.length; i++) {
            var a = linkArray[i];
            a.addEventListener('click', function (e) {
                e.preventDefault();
                swap(a.href);
            }, false);
        }
    }
};

var runStar = function () {
    var container = document.getElementById('back');
    var starfield = new Starfield();
    starfield.initialise(container);
    starfield.start();
};
document.addEventListener('DOMContentLoaded', ()=>{
    MAINDIV = document.getElementsByClassName('main')[0];
    addXHR();
    runStar();
    let music = new Music();
    if(music.context.state == 'suspended'){
        music.context.close();
        document.addEventListener('click', ()=>{if(music.context.state!='running'){music = new Music();}});
    }
}
);
