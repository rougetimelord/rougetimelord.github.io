var song=function(){function r(a){var b=this;b.request=new XMLHttpRequest;b.request.open("GET",a,!0);b.request.responseType="arraybuffer";b.request.onload=function(){c.decodeAudioData(b.request.response,function(a){m&&(m=!1,new n(a));g.push(a);g.length<h.length&&(f++,f<h.length||(f=0),p(f))})};b.request.send()}function n(a){this.source=c.createBufferSource();this.source.connect(e);this.source.connect(k);this.source.buffer=a;this.duration=Math.floor(1E3*a.duration);this.source.start(0);setTimeout(q,this.duration)}if(!window.AudioContext){if(!window.webkitAudioContext){var d=document.createElement("audio");d.src="./Content/fuck-boy.mp3";d.autoplay=!0;d.loop=!0;return document.body.appendChild(d)}window.AudioContext=window.webkitAudioContext}var c=new AudioContext,m=!0,g=[],l=0,h=["never-met","still-high","dark","fuck-boy"],q=function(){l=Math.floor(Math.random()*g.length);m?(l=Math.floor(Math.random()*h.length),p(l)):new n(g[l])},f=0,p=function(a){var b="./Content/"+h[a]+".mp3";f=a;new r(b)};d=c.createScriptProcessor(2048,1,1);d.connect(c.destination);var e=c.createAnalyser();e.smoothingTimeConstant=.3;e.fftSize=1024;e.connect(d);var k=c.createGain();k.gain.setValueAtTime(.35,c.currentTime);k.connect(c.destination);q();d.onaudioprocess=function(){var a=new Uint8Array(e.frequencyBinCount);e.getByteFrequencyData(a);var b=0;for(var c=a.length,d=0;d<c;d++)b+=a[d];b/=c;a=document.getElementsByClassName("react");for(c=0;c<a.length;c++)a[c].classList.remove("light");if(70<=b)for(b=0;b<a.length;b++)a[b].classList.add("light")};document.addEventListener("visibilitychange",function(){k.gain.linearRampToValueAtTime(document.hidden?.03:.35,c.currentTime+(document.hidden?.75:.3))})};