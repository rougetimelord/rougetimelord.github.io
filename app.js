var swap=function(b){var a=new XMLHttpRequest;a.open("GET",b,!0);a.timeout=4E3;a.onload=function(){200==a.status||304==a.status?(document.getElementsByClassName("main")[0].innerHTML=a.responseText,addXHR()):console.log(a.status)};a.send()},addXHR=function(){var b=document.getElementsByClassName("xhr");if(history.pushState&&0!=b.length)for(var a=0;a<b.length;a++){var f=b[a];f.addEventListener("click",function(a){a.preventDefault();swap(f.href)},!1)}},runStar=function(){var b=document.getElementById("back"),
a=new Starfield;a.initialise(b);a.start()},song=function(){function b(a){console.log(a)}window.AudioContext||(window.webkitAudioContext||alert("No audiocontext found"),window.AudioContext=window.webkitAudioContext);var a=new AudioContext,f,e,g,k=["never-met","still-high","dark","fuck-boy"],l=[];f=a.createBufferSource();g=a.createScriptProcessor(2048,1,1);g.connect(a.destination);(function(){for(var h=0;h<k.length;h++){src="./Content/"+k[h]+".mp3";var c=new XMLHttpRequest;c.open("GET",src,!0);c.responseType=
"arraybuffer";c.onload=function(){a.decodeAudioData(c.response,function(a){l.push(a)},b)};c.send()}})();e=a.createAnalyser();e.smoothingTimeConstant=.3;e.fftSize=1024;f.connect(e);e.connect(g);f.connect(a.destination);g.onaudioprocess=function(){var a=new Uint8Array(e.frequencyBinCount);e.getByteFrequencyData(a);for(var c=0,d=a.length,b=0;b<d;b++)c+=a[b];a=c/d;c=document.getElementsByClassName("react");for(d=0;d<c.length;d++)c[d].classList.remove("light");if(50<=a)for(d=0;d<c.length;d++)c[d].classList.add("light")}};
document.addEventListener("DOMContentLoaded",function(){addXHR();runStar();song()});
