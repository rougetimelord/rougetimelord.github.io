var song=function(){function r(a){_=this;_.request=new XMLHttpRequest;_.request.open("GET",a,!0);_.request.responseType="arraybuffer";_.request.onload=function(){console.log(a,_.request.response);b.decodeAudioData(_.request.response,function(a){l&&(l=!1,n(a));m.push(a);m.length<f.length&&(g++,g<f.length||(g=0),p(g))})};_.request.send()}function n(a){this.source=b.createBufferSource();this.source.connect(e);this.source.connect(b.destination);this.source.buffer=a;this.duration=Math.floor(1E3*this.source.duration);
source.start(0);setTimeout(q,this.duration)}window.AudioContext||(window.webkitAudioContext||alert("No audiocontext found"),window.AudioContext=window.webkitAudioContext);var b=new AudioContext,e,k,h=0,f=["never-met","still-high","dark","fuck-boy"],l=!0,m=[],q=function(){for(var a=-1;a==h||0>=a;)a=Math.floor(Math.random()*f.length);h=a;song_name=f[h];l?p(h):new n(m[h])},g=0,p=function(a){url="./Content/"+f[a]+".mp3";g=a;loaded.push(f[a]);new r(url)};k=b.createScriptProcessor(2048,1,1);k.connect(b.destination);
e=b.createAnalyser();e.smoothingTimeConstant=.3;e.fftSize=1024;e.connect(k);q();k.onaudioprocess=function(){var a=new Uint8Array(e.frequencyBinCount);e.getByteFrequencyData(a);for(var d=0,c=a.length,b=0;b<c;b++)d+=a[b];a=d/c;d=document.getElementsByClassName("react");for(c=0;c<d.length;c++)d[c].classList.remove("light");if(70<=a)for(c=0;c<d.length;c++)d[c].classList.add("light")}};
