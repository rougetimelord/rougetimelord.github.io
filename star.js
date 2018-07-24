/*
    Starfield lets you take a div and turn it into a starfield.

*/
//	Define the starfield class.
class Starfield {
    constructor() {
        this.fps = 60;
        this.containerDiv = document.getElementById('back');
        var canvas = document.createElement('canvas');
        this.containerDiv.appendChild(canvas);
        this.canvas = canvas;
        this.height = 0;
        this.width = 0;
        this.minVelocity = 15;
        this.maxVelocity = 30;
        this.stars = 100;
        this.old = 0;
    }
    //	The main function - initialises the starfield.
    initialise() {
        var self = this;
        self.width = window.innerWidth;
        self.height = window.innerHeight;
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
            stars[i] = new Star(Math.random() * this.width, Math.random() * this.height, Math.random() * 3 + 1, (Math.random() * this.maxVelocity) + this.minVelocity);
        }
        this.stars = stars;
        //	Start the timer.
        requestAnimationFrame(this.raf.bind(this));
    }
    raf(time) {
        this.update(time);
        this.draw()
        requestAnimationFrame(this.raf.bind(this));
    }
    update(t) {
        console.log(t, this.old)
        let dt = (t - this.old)/1000;
        for (var i = 0; i < this.stars.length; i++) {
            var star = this.stars[i];
            star.y += dt * star.velocity;
            //	If the star has moved from the bottom of the screen, spawn it at the top.
            if (star.y > this.height) {
                this.stars[i] = new Star(Math.random() * this.width, 0, Math.random() * 3 + 1, (Math.random() * this.maxVelocity) + this.minVelocity);
            }
        }
        this.old = t;
        return;
    }
    draw() {
        //	Get the drawing context.
        var ctx = this.canvas.getContext('2d');
        //	Draw the background.
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, this.width, this.height);
        //	Draw stars.
        ctx.fillStyle = '#ffffff';
        for (var i = 0; i < this.stars.length; i++) {
            var star = this.stars[i];
            ctx.fillRect(star.x, star.y, star.size, star.size);
        }
        return;
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
Starfield.prototype['initialise'] = Starfield.prototype.initialise;