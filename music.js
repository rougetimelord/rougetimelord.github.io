var song=function(){function q(a){_=this;_.request=new XMLHttpRequest;_.request.open("GET",a,!0);_.request.responseType="arraybuffer";_.request.onload=function(){c.decodeAudioData(_.request.response,function(a){l&&(l=!1,new m(a));g.push(a);g.length<h.length&&(f++,f<h.length||(f=0),n(f))})};_.request.send()}function m(a){this.source=c.createBufferSource();this.source.connect(e);this.source.connect(c.destination);this.source.buffer=a;this.duration=Math.floor(1E3*a.duration);this.source.start(0);setTimeout(p,
    this.duration)}if(!window.AudioContext){if(!window.webkitAudioContext){var b=document.createElement("audio");b.src="./Content/fuck-boy.mp3";b.autoplay=!0;b.loop=!0;return document.body.appendChild(b)}window.AudioContext=window.webkitAudioContext}var c=new AudioContext,l=!0,g=[],k=0,h=["never-met","still-high","dark","fuck-boy"],p=function(){k=Math.floor(Math.random()*g.length);l?(k=Math.floor(Math.random()*h.length),n(k)):new m(g[k])},f=0,n=function(a){url="./Content/"+h[a]+".mp3";f=a;new q(url)};
    b=c.createScriptProcessor(2048,1,1);b.connect(c.destination);var e=c.createAnalyser();e.smoothingTimeConstant=.3;e.fftSize=1024;e.connect(b);p();b.onaudioprocess=function(){var a=new Uint8Array(e.frequencyBinCount);e.getByteFrequencyData(a);for(var b=0,d=a.length,c=0;c<d;c++)b+=a[c];a=b/d;b=document.getElementsByClassName("react");for(d=0;d<b.length;d++)b[d].classList.remove("light");if(70<=a)for(d=0;d<b.length;d++)b[d].classList.add("light")}};