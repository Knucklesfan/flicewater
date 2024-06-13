// import {Howl, Howler} from './howler.min.js';

var mousex = 0;
var mousey = 0;
var textTimer = 0;
var textx = 0;
var level = 1;
var lives = 0;
var swatted = 0;
var gameStart:boolean = false;
var gamePause:boolean = false;
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
const digits = new Image();
digits.src = "images/digits.png";
const levelText = new Image();
levelText.src = "images/level.png";
const oneupSprite = new Image();
oneupSprite.src = "images/oneup.png";
const extralife = new Image();
extralife.src = "images/extralife.png";

var drawHitboxes = false;
var scale = 3;
var oneupDeath = new Howl({
    src:["sounds/1up.wav"]});
var swing = new Howl({
    src:["sounds/gnatattack_swing.wav"]});
var hit = new Howl({
    src:["sounds/gnatattack_hit.wav"]});
var flysound = new Howl({
    src:["sounds/gnatattack_bugdie1.wav"]});
var flyoffscreen = new Howl({
    src:["sounds/gnatattack_bugoffscreen1.wav"]});
var mariohit = new Howl({
    src:["sounds/yoshi-spit.wav"]});
var mariooffscreen = new Howl({
    src:["sounds/bullet.wav"]});
var level1music = new Howl({
    src:["sounds/level1music.mp3"],
    html5: true
});
var gameSpawn = false;
document.addEventListener('mousemove', onMouseUpdate, false);
document.addEventListener('mouseenter', onMouseUpdate, false);
document.addEventListener('mousedown', mousedown, false);
document.addEventListener('mouseup', mouseup, false);

function easeOutBounce(x: number): number {
    const n1 = 7.5625;
    const d1 = 2.75;
    
    if (x < 1 / d1) {
        return n1 * x * x;
    } else if (x < 2 / d1) {
        return n1 * (x -= 1.5 / d1) * x + 0.75;
    } else if (x < 2.5 / d1) {
        return n1 * (x -= 2.25 / d1) * x + 0.9375;
    } else {
        return n1 * (x -= 2.625 / d1) * x + 0.984375;
    }
    
}
function lerp(a:number, b:number, t:number)    {
    if (t <= 0.5)
        return a+(b-a)*t;
    else
        return b-(b-a)*(1.0-t);
}
abstract class Enemy {
    x: number
    y: number
    w: number;
    h: number;
    frame: number;
    alive: boolean;
    hitsound: Howl;
    deathsound: Howl;
    active: boolean;
    image: HTMLImageElement;
    render(): void {
        if(drawHitboxes) {
            context.fillStyle = 'rgba(0,255,0,0.5)';
            context.fillRect(this.x,this.y,this.w*scale,this.h*scale);
            context.fillStyle = 'rgba(255,255,255,1.0)';
        }
        context!.drawImage(this.image,this.frame*this.w,0,this.w,this.h,this.x,this.y,this.w*scale,this.h*scale); // |0 in the math ensures 32bit int
    }
    abstract logic(delta): void
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
    logic(delta): void {
        if(!this.alive) {
            if(this.y < window.innerHeight) {
                this.y+=12*(delta/16);
            }
            else {
                if(gameSpawn && !gamePause) {
                    swatted++;
                }
                this.active = false;
            }
        }
        else {
            console.log(delta);
            this.x += Math.cos(this.timer*(Math.PI/180))*this.xradius;
            this.y += Math.sin(this.timer*(Math.PI/180))*this.yradius;
            this.timer+=(delta/16);
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
                this.y = window.innerHeight-9-this.h*scale
            }
            if((this.x+this.w*2 >= window.innerWidth-8) && this.firstRotationDone) {
                this.xradius = -this.xradius;
                this.x = window.innerWidth-9-this.w*scale
            }

            if(this.timer >= 90 || this.timer <= -(90)) {
                if(!this.firstRotationDone) {this.firstRotationDone = true;}
                this.timer = 0;
                do {
                    this.xradius = (1-(Math.random()*2))*4
                    this.yradius = (1-(Math.random()*2))*4
                }
                while(!(this.yradius > 1 || this.yradius < -1) && !(this.xradius > 3 || this.xradius < -3));
            }
            this.frame = (((this.timer*(delta*0.25))>>0)%2)
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
class oneUp extends Enemy {
    alive = true;
    active = true;
    hitable = true;
    lifedup = false;
    lifeuptimer = 0;
    showhudtimer = 0;
    oldmousex = 0;
    oldmousey = 0;
    logic(delta: any): void {
        if(this.y >= window.innerHeight/2) {
            this.y = window.innerHeight/2
        }
        else {
            this.y+=delta/4.0;
        }
        if(!this.alive && this.lifeuptimer <= 0 && this.hitable) {
            this.lifeuptimer = 1;
            this.hitable = false;
            this.frame = -1;
        }
        

        if(this.lifeuptimer >= 0) {

            this.lifeuptimer -= delta/1000.0

        }
        else if(this.lifeuptimer <= 0 && !this.alive && !this.lifedup) {
            this.lifeuptimer == 0;
            this.showhudtimer = 1;
            this.oldmousex = mousex;
            this.oldmousey = mousey;
            this.lifedup = true;
        }
        if(this.showhudtimer >= 0) {
            this.showhudtimer -= delta/1000.0;
        }
        if(this.showhudtimer <= 0 && !this.alive && this.lifedup) {
            this.showhudtimer = 0;
            gamePause = false;
            gameSpawn = true;
            this.active = false;
            lives = 4;
        }

    }
    w = 16;
    h = 16;
    frame = 0;
    hitsound = hit;
    deathsound = oneupDeath
    image = oneupSprite;
    render() {
        super.render();
        if(!this.alive && this.showhudtimer <= 0) {
            context!.drawImage(extralife,0,0,16,16,mousex+Math.cos((this.lifeuptimer*360)*Math.PI/180)*this.lifeuptimer*window.innerWidth,mousey+Math.sin(this.lifeuptimer*360*Math.PI/180)*this.lifeuptimer*window.innerHeight,16*scale,16*scale); // |0 in the math ensures 32bit int
            context!.drawImage(extralife,0,0,16,16,mousex-Math.cos(this.lifeuptimer*360*Math.PI/180)*this.lifeuptimer*window.innerWidth,mousey-Math.sin(this.lifeuptimer*360*Math.PI/180)*this.lifeuptimer*window.innerHeight,16*scale,16*scale); // |0 in the math ensures 32bit int
            context!.drawImage(extralife,0,0,16,16,mousex+Math.cos(this.lifeuptimer*360*Math.PI/180)*this.lifeuptimer*window.innerWidth,mousey-Math.sin(this.lifeuptimer*360*Math.PI/180)*this.lifeuptimer*window.innerHeight,16*scale,16*scale); // |0 in the math ensures 32bit int
            context!.drawImage(extralife,0,0,16,16,mousex-Math.cos(this.lifeuptimer*360*Math.PI/180)*this.lifeuptimer*window.innerWidth,mousey+Math.sin(this.lifeuptimer*360*Math.PI/180)*this.lifeuptimer*window.innerHeight,16*scale,16*scale); // |0 in the math ensures 32bit int    
        }
        if(this.showhudtimer > 0) {
            
            context!.drawImage(extralife,0,0,16,16,lerp(this.oldmousex,(window.innerWidth/2)-(4/2)*16*scale+ 0*scale,1-this.showhudtimer),lerp(this.oldmousey,64,easeOutBounce(1-this.showhudtimer)),16*scale,16*scale); // |0 in the math ensures 32bit int
            context!.drawImage(extralife,0,0,16,16,lerp(this.oldmousex,(window.innerWidth/2)-(4/2)*16*scale+16*scale,1-this.showhudtimer),lerp(this.oldmousey,64,easeOutBounce(1-this.showhudtimer)),16*scale,16*scale); // |0 in the math ensures 32bit int
            context!.drawImage(extralife,0,0,16,16,lerp(this.oldmousex,(window.innerWidth/2)-(4/2)*16*scale+32*scale,1-this.showhudtimer),lerp(this.oldmousey,64,easeOutBounce(1-this.showhudtimer)),16*scale,16*scale); // |0 in the math ensures 32bit int
            context!.drawImage(extralife,0,0,16,16,lerp(this.oldmousex,(window.innerWidth/2)-(4/2)*16*scale+48*scale,1-this.showhudtimer),lerp(this.oldmousey,64,easeOutBounce(1-this.showhudtimer)),16*scale,16*scale); // |0 in the math ensures 32bit int

        }

    }
    constructor(x:number,y:number) {
        super();
        this.x=x;
        this.y=y;
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
    logic(delta): void {
        if(this.alive && this.active) {
            console.log(this.x);
            if(this.x > window.innerWidth/2) {
                this.xvel = -0.25;
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
            this.x+=this.xvel*delta;
            this.timer+=0.05*(delta/16);    
        }
        else {
            this.frame = 2;
            if(this.y < window.innerHeight) {
                this.y+=delta;
                this.x-=2
            }
            else {
                gameStart = true;
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

function renderdigit(digit:number,x:number,y:number,center:boolean) {
    let string = digit.toString();

    if(center) {
        for(var i = 0; i < string.length; i++) {
            context!.drawImage(digits,0+16*(parseInt(string.charAt(i))),0,16,16,(x-(string.length/2)*16*scale)+i*16*scale,y,16*scale,16*scale); // |0 in the math ensures 32bit int
        }
    }
    else {
        for(var i = 0; i < string.length; i++) {
            context!.drawImage(digits,0+16*(parseInt(string.charAt(i))),0,16,16,x+i*16*scale,y,16*scale,16*scale); // |0 in the math ensures 32bit int
        }
    
    }
}

function mousedown(e) {
    if(e.button == 0) {
        (swing).play();
        mousetimer = 24;

        enemies.forEach(function(enemy) {
            if(
                enemy.x < mousex + 24*scale &&
                enemy.x + enemy.w*scale > mousex &&
                enemy.y < mousey-(6*scale) + 21*scale &&
                enemy.y + enemy.h*scale > mousey-(6*scale)
            ) {
                mousetimer=40;
                hitEnemy = true;
                enemy.alive = false;
                (enemy.hitsound).play();
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
function logic(delta) {
    enemies.forEach(function(enemy) {
        enemy.logic(delta);
        if(!enemy.active) {
            (enemy.deathsound).play();
            enemies.splice(enemies.indexOf(enemy),1);
        }
    });
    if(gameStart && !gameSpawn && !gamePause && enemies.length == 0) {
        if(textTimer == 0 && textx < (window.innerWidth/2)-(10*scale)) {
            textx += delta
        }
        else if(textTimer < 500){
            textTimer+=delta/8;
        }
        else if(textx > 0 && textTimer > 500) {
            textx -= delta;
        }
        else {
            gameSpawn = true;
            textx = 0;
            textTimer = 0;

        }
    }
    if(mousetimer > 0) {
        mousetimer-=delta*0.2;
        if(mousetimer <= 16 && hitEnemy) {
            (hit).play();
            hitEnemy = false;
        }
    }
    if(gameSpawn && enemies.length < 4) {
        const corners = [[0,0],[window.innerWidth,0],[0,window.innerHeight],[window.innerWidth,window.innerHeight]]
        for(var i =0; i < Math.floor(Math.random()*4)+1; i++) {
            const corner = corners[Math.floor(Math.random()*4)];
            var side = Math.floor(Math.random() * 2);
            enemies.push(new Fly(corner[0]*side,corner[1]*(1-side))); //not having this in a loop because this is guaranteed every time

        }

        if(swatted > 25) {
            for(var i =0; i < 4; i++) {
                const corner = corners[Math.floor(Math.random()*4)];
                var side = Math.floor(Math.random() * 2);
                enemies.push(new Fly(corner[0]*side,corner[1]*(1-side))); //not having this in a loop because this is guaranteed every time
    
            }
        }


    }
    if(swatted == 25 && gameStart && gameSpawn) {
        gameSpawn = false;
        swatted++;
        enemies.forEach(function(enemy) {
            enemy.alive = false;
            gamePause = true;
        });   
        enemies.push(new oneUp(window.innerWidth/2,0));
 
    }
    if(!gameSpawn && gamePause) {

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
        context!.drawImage(flyswatter,0+32*(mouseframes-(mousetimer/8>>0)),0,32,64,mousex-16,mousey-24,32*scale,64*scale); // |0 in the math ensures 32bit int
    }
    else {
        context!.drawImage(flyswatter,0,0,32,64,mousex-16,mousey-24,32*scale,64*scale); // |0 in the math ensures 32bit int

    }
    if(drawHitboxes) {
        context.fillStyle = 'rgba(255,0,0,0.5)';
        context.fillRect(mousex,mousey-(6*scale),(21*scale),(24*scale));
        context.fillStyle = 'rgba(0,0,0,1.0)';
    }
    context!.drawImage(levelText,textx-(40*scale),240,(40*scale),(16*scale));
    renderdigit(level,window.innerWidth-textx,240,false)
    if(gameSpawn) {
        renderdigit(swatted,window.innerWidth/2,20,true);
    }
    if(lives > 0) {
        for(var i = 0; i < lives; i++) {
            context!.drawImage(extralife,0,0,16,16,(window.innerWidth/2)-((lives/2)*16*scale) + i*16*scale,64,16*scale,16*scale); // |0 in the math ensures 32bit int
        }

    }
}

function loop(timestamp) {
    var progress = timestamp - lastRender
    logic(progress);
    draw();
  
    lastRender = timestamp
    window.requestAnimationFrame(loop)
  }
  var lastRender = 0
  window.requestAnimationFrame(loop)