var swap = function (b) { var a = new XMLHttpRequest; a.open("GET", b, !0); a.timeout = 4E3; a.onload = function () { 200 == a.status || 304 == a.status ? (document.getElementsByClassName("main")[0].innerHTML = a.responseText, addXHR()) : console.log(a.status) }; a.send() }, addXHR = function () { var b = document.getElementsByClassName("xhr"); if (history.pushState && 0 != b.length) for (var a = 0; a < b.length; a++) { var c = b[a]; c.addEventListener("click", function (a) { a.preventDefault(); swap(c.href) }, !1) } }, runStar = function () {
    var b = document.getElementById("back"),
    a = new Starfield; a.initialise(b); a.start()
}; document.addEventListener("DOMContentLoaded", function () { addXHR(); runStar(); song() });