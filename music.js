var song=function(){function p(a){_=this;_.request=new XMLHttpRequest;_.request.open("GET",a,!0);_.request.responseType="arraybuffer";_.request.onload=function(){console.log(a,_.request.response);b.decodeAudioData(_.request.response,function(a){this.source=b.createBufferSource();this.source.connect(e);this.source.connect(b.destination);this.source.buffer=a;k.push(this.source);l(this.source)})};_.request.send()}function l(a){var d=Math.floor(1E3*a.buffer.duration);a.start(0);setTimeout(m,d)}window.AudioContext||
(window.webkitAudioContext||alert("No audiocontext found"),window.AudioContext=window.webkitAudioContext);var b=new AudioContext,e,g,f=0,h=["never-met","still-high","dark","fuck-boy"],n=[],k=[],m=function(){for(var a=-1;a!==f&&0>=a;)a=Math.floor(Math.random()*h.length);f=a;song_name=h[f];-1==n.indexOf(song_name)?(url="./Content/"+h[f]+".mp3",new p(url)):(f=n.indexOf(song_name),l(k[f]))};g=b.createScriptProcessor(2048,1,1);g.connect(b.destination);e=b.createAnalyser();e.smoothingTimeConstant=.3;e.fftSize=
1024;e.connect(g);m();g.onaudioprocess=function(){var a=new Uint8Array(e.frequencyBinCount);e.getByteFrequencyData(a);for(var d=0,c=a.length,b=0;b<c;b++)d+=a[b];a=d/c;d=document.getElementsByClassName("react");for(c=0;c<d.length;c++)d[c].classList.remove("light");if(70<=a)for(c=0;c<d.length;c++)d[c].classList.add("light")}};
