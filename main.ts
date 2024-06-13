var mousex = 0;
var mousey = 0;
var hitEnemy = false;
var mousepressed:boolean = false;
var mousetimer:number = 0;
var mouseframes:number = 0;
// put this outside the event loop..
var canvas:HTMLCanvasElement = document.getElementById("canvas2d") as HTMLCanvasElement;
var context = canvas!.getContext("2d");
const flyswatter = new Image();
flyswatter.src = 'images/cursor.png';
const fly = new Image();
fly.src = "images/fly.png";
const mario = new Image();
mario.src = "images/mario.png";

var swing = new Audio("sounds/gnatattack_swing.wav");
var hit = new Audio("sounds/gnatattack_hit.wav"); 
var flysound = new Audio("sounds/gnatattack_bugdie1.wav"); 
var flyoffscreen = new Audio("sounds/gnatattack_bugoffscreen1.wav"); 
var mariohit = new Audio("sounds/yoshi-spit.wav"); 
var mariooffscreen = new Audio("sounds/bullet.wav"); 
var level1music = new Audio("sounds/level1music.mp3");
var gameSpawn = false;
document.addEventListener('mousemove', onMouseUpdate, false);
document.addEventListener('mouseenter', onMouseUpdate, false);
document.addEventListener('mousedown', mousedown, false);
document.addEventListener('mouseup', mouseup, false);
abstract class Enemy {
    x: number
    y: number
    w: number;
    h: number;
    frame: number;
    alive: boolean;
    hitsound: HTMLAudioElement;
    deathsound: HTMLAudioElement;
    active: boolean;
    image: HTMLImageElement;
    render(): void {
        context!.drawImage(this.image,this.frame*this.w,0,this.w,this.h,this.x,this.y,this.w*2,this.h*2); // |0 in the math ensures 32bit int
    }
    abstract logic(): void
}
class Fly extends Enemy {
    image: HTMLImageElement = fly;
    w: number =15;
    h: number =8;
    timer: number = 0; //a timer from 0 to 360 that determines the fly's current circular tragectory
    xradius: number = 16; //the radius of the current circle the fly is flying in, resets every revolution
    yradius: number = 16; //the radius of the current circle the fly is flying in, resets every revolution
    hitsound: HTMLAudioElement = flysound;
    deathsound: HTMLAudioElement = flyoffscreen;
    firstRotationDone = false;
    logic(): void {
        if(!this.alive) {
            if(this.y < window.innerHeight) {
                this.y+=12;
            }
            else {
                this.active = false;
            }
        }
        else {
            console.log(this.timer);
            this.x += Math.cos(this.timer*(Math.PI/180))*this.xradius;
            this.y += Math.sin(this.timer*(Math.PI/180))*this.yradius;
            this.timer+=1;
            if((this.x <= 0) && this.firstRotationDone) {
                this.xradius = -this.xradius;
                this.x = 1;
            }
            if((this.y <= 0) && this.firstRotationDone) {
                this.yradius = -this.yradius;
                this.y = 1;
            }

            if((this.y+this.h*2 >= window.innerHeight-8) && this.firstRotationDone) {
                this.yradius = -this.yradius;
                this.y = window.innerHeight-9-this.h*2
            }
            if((this.x+this.w*2 >= window.innerWidth-8) && this.firstRotationDone) {
                this.xradius = -this.xradius;
                this.x = window.innerWidth-9-this.w*2
            }

            if(this.timer >= 90 || this.timer <= -(90)) {
                if(!this.firstRotationDone) {this.firstRotationDone = true;}
                this.timer = 0;
                do {
                    this.xradius = (1-(Math.random()*2))*2
                    this.yradius = (1-(Math.random()*2))*2
                }
                while(!(this.yradius > 1 || this.yradius < -1) && !(this.xradius > 3 || this.xradius < -3));
            }
            this.frame=(this.timer%2)|0;
        }
        
    }
    constructor(x:number, y:number) {
        super();
        this.x = x;
        this.y = y;
        this.alive = true;
        this.active = true;
        this.xradius = (1-(Math.random()*2))*16
        this.yradius = (1-(Math.random()*2))*16
}

}
class Mario extends Enemy {
    timer:number = 0;
    xvel:number = 0;
    w = 16
    h = 32
    image = mario;
    hitsound = mariohit;
    deathsound = mariooffscreen;
    logic(): void {
        if(this.alive && this.active) {
            console.log(this.x);
            if(this.x > window.innerWidth/2) {
                this.xvel = -1;
            }
            else {
                this.xvel = 0;
            }
            if(this.xvel < 0) {
                this.frame = ((this.timer)>>0)%2;
            }
            else {
                this.frame = 3;
            }
            this.x+=this.xvel;
            this.timer+=0.05;    
        }
        else {
            this.frame = 2;
            if(this.y < window.innerHeight) {
                this.y+=6;
                this.x-=2
            }
            else {
                gameSpawn = true;
                level1music.play();
                this.active = false;
            }

        }
    }
    constructor(x:number, y:number) {
        super();
        this.x = x;
        this.y = y;
        this.alive = true;
        this.active = true;
    } 

}
var enemies: Enemy[] = [new Mario(window.innerWidth+16,240)];


function mousedown(e) {
    if(e.button == 0) {
        (swing.cloneNode(true) as HTMLAudioElement).play();
        mousetimer = 24;
        enemies.forEach(function(enemy) {
            if(
                enemy.x < mousex + 32 &&
                enemy.x + enemy.w > mousex &&
                enemy.y < mousey-12 + 32 &&
                enemy.y + enemy.h > mousey-12
            ) {
                mousetimer=40;
                hitEnemy = true;
                enemy.alive = false;
                (enemy.hitsound.cloneNode(true) as HTMLAudioElement).play();
            }
            

        });
        mouseframes=(mousetimer/8)-1;

    }
}
function mouseup(e) {
    if(e.button == 0) {
        mousepressed = false;
    }
}
function onMouseUpdate(e) {
  mousex = e.pageX;
  mousey = e.pageY;
}
function logic() {
    enemies.forEach(function(enemy) {
        enemy.logic();
        if(!enemy.active) {
            (enemy.deathsound.cloneNode(true) as HTMLAudioElement).play();
            enemies.splice(enemies.indexOf(enemy),1);
        }
    });

    if(mousetimer > 0) {
        mousetimer--;
        if(mousetimer <= 16 && hitEnemy) {
            (hit.cloneNode(true) as HTMLAudioElement).play();
            hitEnemy = false;
        }
    }
    if(gameSpawn && enemies.length < 4) {
        enemies.push(new Fly(Math.random()*window.innerWidth,0))
        enemies.push(new Fly(Math.random()*window.innerWidth,window.innerHeight))
        enemies.push(new Fly(window.innerWidth,Math.random()*window.innerHeight))
        enemies.push(new Fly(0,Math.random()*window.innerHeight))

    }

}
function draw() {
    context!.canvas.width  = window.innerWidth;
    context!.canvas.height = window.innerHeight;
    context!.clearRect(0, 0, canvas.width, canvas.height);
    context!.fillStyle = "#000000";
    context!.imageSmoothingEnabled = false;

    enemies.forEach(function(enemy) {
        enemy.render();
    });
    // context!.fillRect(mousex,mousey,32,32);
    if(mousetimer > 0) {
        context!.drawImage(flyswatter,0+32*(mouseframes-(mousetimer/8>>0)),0,32,64,mousex-16,mousey-24,64,128); // |0 in the math ensures 32bit int
    }
    else {
        context!.drawImage(flyswatter,0,0,32,64,mousex-16,mousey-24,64,128); // |0 in the math ensures 32bit int

    }
}

function loop(timestamp) {
    var progress = timestamp - lastRender
    logic();
    draw();
  
    lastRender = timestamp
    window.requestAnimationFrame(loop)
  }
  var lastRender = 0
  window.requestAnimationFrame(loop)