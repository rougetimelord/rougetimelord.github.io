var song=function(){function t(a){_=this;_.request=new XMLHttpRequest;_.request.open("GET",a,!0);_.request.responseType="arraybuffer";_.request.onload=function(){console.log(a,_.request.response);b.decodeAudioData(_.request.response,function(a){m&&(m=!1,n(a));l.push(a);l.length<f.length&&(g++,g<f.length||(g=0),p(g))})};_.request.send()}function n(a){this.source=b.createBufferSource();this.source.connect(e);this.source.connect(b.destination);this.source.buffer=a;this.duration=Math.floor(1E3*this.source.duration);
source.start(0);setTimeout(q,this.duration)}window.AudioContext||(window.webkitAudioContext||alert("No audiocontext found"),window.AudioContext=window.webkitAudioContext);var b=new AudioContext,e,h,k=0,f=["never-met","still-high","dark","fuck-boy"],r=[],l=[],q=function(){for(var a=-1;a==k||0>=a;)a=Math.floor(Math.random()*f.length);k=a;song_name=f[k];-1==r.indexOf(song_name)?p(k):(a=r.indexOf(song_name),new n(l[a]))},g=0,p=function(a){url="./Content/"+f[a]+".mp3";g=a;new t(url)};h=b.createScriptProcessor(2048,
1,1);h.connect(b.destination);e=b.createAnalyser();e.smoothingTimeConstant=.3;e.fftSize=1024;e.connect(h);q();var m=!0;h.onaudioprocess=function(){var a=new Uint8Array(e.frequencyBinCount);e.getByteFrequencyData(a);for(var d=0,c=a.length,b=0;b<c;b++)d+=a[b];a=d/c;d=document.getElementsByClassName("react");for(c=0;c<d.length;c++)d[c].classList.remove("light");if(70<=a)for(c=0;c<d.length;c++)d[c].classList.add("light")}};
