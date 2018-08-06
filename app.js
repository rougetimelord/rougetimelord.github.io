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
    if (linkArray.length != 0) {
        for (let i of linkArray) {
            i.addEventListener('click', e=>{
                e.preventDefault();
                swap(i.href);
            }, false);
        }
    }
};

document.addEventListener('DOMContentLoaded', ()=>{
    MAINDIV = document.getElementsByClassName('main')[0];
    addXHR();
    var s = new Starfield();
    s.initialise();
    let music = new Music();
    if(window.context.state == 'suspended'){
        window.context.close();
        document.addEventListener('click', ()=>{if(window.context.state!='running'){music = new Music();}});
    }
}
);
