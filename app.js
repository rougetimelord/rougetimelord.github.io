var c;function d(b){var a=new XMLHttpRequest;a.open("GET",b,!0);a.timeout=4E3;a.onload=function(){if(200==a.status||304==a.status)c.innerHTML=a.responseText,f()};a.send()}function f(){var b=document.getElementsByClassName("xhr");if(history.pushState&&0!=b.length)for(var a=0;a<b.length;a++){var e=b[a];e.addEventListener("click",function(a){a.preventDefault();d(e.href)},!1)}}function g(){var b=document.getElementById("back"),a=new Starfield;a.initialise(b);a.start()}document.addEventListener("DOMContentLoaded",function(){c=document.getElementsByClassName("main")[0];f();g();var b=new Music;"suspended"==b.context.state&&(b.context.close(),document.addEventListener("click",function(){"running"!=b.context.state&&(b=new Music)}))});