var song=function(){function r(a){_=this;_.request=new XMLHttpRequest;_.request.open("GET",a,!0);_.request.responseType="arraybuffer";_.request.onload=function(){console.log(a,_.request.response);b.decodeAudioData(_.request.response,function(a){h&&(h=!1,new n(a));f.push(a);console.log(f.length);f.length<k.length&&(g++,g<k.length||(g=0),p(g))})};_.request.send()}function n(a){this.source=b.createBufferSource();this.source.connect(e);this.source.connect(b.destination);this.source.buffer=a;this.duration=
Math.floor(1E3*a.duration);source.start(0);setTimeout(q,this.duration)}window.AudioContext||(window.webkitAudioContext||alert("No audiocontext found"),window.AudioContext=window.webkitAudioContext);var b=new AudioContext,e,l,m=0,k=["never-met","still-high","dark","fuck-boy"],h=!0,f=[],q=function(){m=Math.floor(Math.random()*f.length);console.log(h);h?(m=Math.floor(Math.random()*k.length),p(m)):(console.log("Next song"),new n(f[m]))},g=0,p=function(a){url="./Content/"+k[a]+".mp3";g=a;new r(url)};l=
b.createScriptProcessor(2048,1,1);l.connect(b.destination);e=b.createAnalyser();e.smoothingTimeConstant=.3;e.fftSize=1024;e.connect(l);q();l.onaudioprocess=function(){var a=new Uint8Array(e.frequencyBinCount);e.getByteFrequencyData(a);for(var d=0,c=a.length,b=0;b<c;b++)d+=a[b];a=d/c;d=document.getElementsByClassName("react");for(c=0;c<d.length;c++)d[c].classList.remove("light");if(70<=a)for(c=0;c<d.length;c++)d[c].classList.add("light")}};
