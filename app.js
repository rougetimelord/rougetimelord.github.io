var MAINDIV;

/*window.lzen = s=>{
    var dict = {};
    var data = (s + "").split("");
    var out = [];
    var currChar;
    var phrase = data[0];
    var code = 256;
    for (var i=1; i<data.length; i++) {
        currChar=data[i];
        if (dict[phrase + currChar] != null) {
            phrase += currChar;
        }
        else {
            out.push(phrase.length > 1 ? dict[phrase] : phrase.charCodeAt(0));
            dict[phrase + currChar] = code;
            code++;
            phrase=currChar;
        }
    }
    out.push(phrase.length > 1 ? dict[phrase] : phrase.charCodeAt(0));
    for (var i=0; i<out.length; i++) {
        out[i] = String.fromCharCode(out[i]);
    }
    return out.join("");
}
window.lzde = s=>{
    var dict = {};
    var data = (s + "").split("");
    var currChar = data[0];
    var oldPhrase = currChar;
    var out = [currChar];
    var code = 256;
    var phrase;
    for (var i=1; i<data.length; i++) {
        var currCode = data[i].charCodeAt(0);
        if (currCode < 256) {
            phrase = data[i];
        }
        else {
           phrase = dict[currCode] ? dict[currCode] : (oldPhrase + currChar);
        }
        out.push(phrase);
        currChar = phrase.charAt(0);
        dict[code] = oldPhrase + currChar;
        code++;
        oldPhrase = phrase;
    }
    return out.join("");
}*/

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
    if(window.context.state == 'suspended'){
        window.context.close();
        document.addEventListener('click', ()=>{if(window.context.state!='running'){music = new Music();}});
    }
}
);
