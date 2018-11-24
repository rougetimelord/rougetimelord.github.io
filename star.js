/*
    Starfield lets you take a div and turn it into a starfield.

*/
//	Define the starfield class.
class Starfield {
    constructor() {
        this.containerDiv = document.getElementById('back');
        this.canvas = document.createElement('canvas');
        this.containerDiv.appendChild(this.canvas);
        //	Get the drawing context.
        this.ctx = this.canvas.getContext('2d');
        this.height = 0;
        this.width = 0;
        this.minVelocity = 15;
        this.maxVelocity = 30;
        this.stars = 100;
        this.old = 0;
        let date = new Date();
        let ddmm = String(date.getDate()) + String(date.getMonth + 1);
        this.meme = (ddmm == "204");
    }
    //	The main function - initializes the starfield.
    initialize() {
        var self = this;
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        window.onresize = () => {
            self.width = window.innerWidth;
            self.height = window.innerHeight;
            self.canvas.width = self.width;
            self.canvas.height = self.height;
        };
        //	Create the canvas.
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        //	Create the stars.
        var stars = [];
        for (var i = 0; i < this.stars; i++) {
            stars[i] = new Star(Math.random() * this.width, Math.random() * this.height, Math.floor(Math.random() * 7) + 10, (Math.random() * this.maxVelocity) + this.minVelocity);
        }
        this.stars = stars;
        if(this.meme){
            this.image = new Image();
            this.image.src = "./Content/meme.png";
        }
        //	Start the timer.
        requestAnimationFrame(this.raf.bind(this));
    }
    raf(time) {
        this.update(time);
        (this.meme) ? this.memeDraw() : this.draw();
        requestAnimationFrame(this.raf.bind(this));
    }
    update(t) {
        let dt = (t - this.old)/1000;
        dt = (dt >= 5) ? 5 : dt;
        for (var i = 0; i < this.stars.length; i++) {
            var star = this.stars[i];
            star.y += dt * star.velocity;
            //	If the star has moved from the bottom of the screen, spawn it at the top.
            if (star.y > this.height) {
                this.stars[i] = new Star(Math.random() * this.width, 0, Math.random() * 3 + 7, (Math.random() * this.maxVelocity) + this.minVelocity);
            }
        }
        this.old = t;
        return;
    }
    draw() {
        //	Draw the background.
        this.ctx.fillStyle = '#000000';
        this.ctx.fillRect(0, 0, this.width, this.height);
        //	Draw stars.
        this.ctx.fillStyle = '#ffffff';
        for (var i = 0; i < this.stars.length; i++) {
            var star = this.stars[i];
            this.ctx.font = star.size + "px 'Roboto', sans-serif";
            this.ctx.fillText("*", star.x, star.y);
        }
        return;
    }
    memeDraw(){
        //	Draw the background.
        this.ctx.fillStyle = "#000000";
        this.ctx.fillRect(0, 0, this.width, this.height);
        //	Draw memes.
        this.ctx.fillStyle = '#ffffff';
        this.stars.forEach(star => {
            this.ctx.drawImage(this.image, star.x, star.y, star.size * 4, star.size * 4)
        });
    }
}

class Star {
    constructor(x, y, size, velocity) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.velocity = velocity;
    }
}

window['Starfield'] = Starfield;
Starfield.prototype['initialize'] = Starfield.prototype.initialize;