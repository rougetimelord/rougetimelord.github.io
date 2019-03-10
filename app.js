var fill = str =>{
    let div = document.getElementsByClassName('main')[0];
    let frag = document.createRange().createContextualFragment(str);
    let main = frag.querySelector('.main');
    div.innerHTML = main.innerHTML;
};

var swap = res => {
    let req = new XMLHttpRequest();
    req.open('GET', res, true);
    req.timeout = 4000;
    req.onload = function () {
        if (req.status == 200 || req.status == 304) {
            fill(req.responseText);
            addXHR();
        }
    };
    req.send();
};

var addXHR = () => {
    let linkArray = document.getElementsByClassName('xhr');
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
    addXHR();
    let s = new Starfield();
    s.initialize();
    let music = new Music();
    if(window.context.state == 'suspended'){
        let f = ()=>{music.setup(); f=null};
        document.addEventListener("click", f, {once: !0});
    }
}
);
