// import {Howl, Howler} from './howler.min.js';
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var mousex = 0;
var mousey = 0;
var deathtimer = 0;
var textTimer = 0;
var gameoverTimer = 0;
var textx = 0;
var level = 1;
var lives = 0;
var swatted = 0;
var minbugs = 4;
var gameStart = false;
var gamePause = false;
var gameOver = false;
var marioSpawned = false;
var hitEnemy = false;
var mousepressed = false;
var mousetimer = 0;
var mouseframes = 0;
var firstStart = true;
var drawHitboxes = false;
var gameSpawn = false;
// put this outside the event loop..
var fly = new Image();
var shitter = new Image();
var mario = new Image();
var luigi = new Image();
var digits = new Image();
var levelText = new Image();
var gameoverText = new Image();
var extralife = new Image();
var levelbackgrounds;
var flyswatter = new Image();
var oneupSprite = new Image();
var scale;
var oneupDeath;
var swing;
var hit;
var die;
var grow;
var checkpoint;
var flysound;
var flyoffscreen;
var mariohit;
var mariooffscreen;
var shitterhit;
var shitteroffscreen;
var littleshits;
var lifenotif;
var level1music;
var level2music;
var level3music;
var level4music;
var level5music;
var level6music;
var gameover;
var congrats;
var levelMusics;
var canvas;
var context;
function loadFlice(urls) {
    canvas = document.getElementById("canvas2d");
    context = canvas.getContext("2d");
    flyswatter.src = urls[0];
    fly.src = urls[1];
    shitter.src = urls[2];
    mario.src = urls[3];
    luigi.src = urls[4];
    levelbackgrounds = [
        urls[5], urls[6], urls[7], urls[8], urls[9], urls[10]
    ];
    digits.src = urls[11];
    levelText.src = urls[12];
    gameoverText.src = urls[13];
    oneupSprite.src = urls[14];
    extralife.src = urls[15];
    firstStart = true;
    drawHitboxes = false;
    scale = 3;
    oneupDeath = new Howl({
        src: [urls[16]]
    });
    swing = new Howl({
        src: [urls[17]]
    });
    hit = new Howl({
        src: [urls[18]]
    });
    die = new Howl({
        src: [urls[19]]
    });
    grow = new Howl({
        src: [urls[20]]
    });
    checkpoint = new Howl({
        src: [urls[21]]
    });
    flysound = new Howl({
        src: [urls[22]]
    });
    flyoffscreen = new Howl({
        src: [urls[23]]
    });
    mariohit = new Howl({
        src: [urls[24]]
    });
    mariooffscreen = new Howl({
        src: [urls[25]]
    });
    shitterhit = new Howl({
        src: [urls[26]]
    });
    shitteroffscreen = new Howl({
        src: [urls[27]]
    });
    littleshits = new Howl({
        src: [urls[28]]
    });
    lifenotif = new Howl({
        src: [urls[19]]
    });
    level1music = new Audio(urls[20]);
    level1music.addEventListener('ended', function () {
        this.currentTime = 0;
        this.play();
    }, false);
    level2music = new Audio(urls[21]);
    level2music.addEventListener('ended', function () {
        this.currentTime = 0;
        this.play();
    }, false);
    level3music = new Audio(urls[22]);
    level3music.addEventListener('ended', function () {
        this.currentTime = 0;
        this.play();
    }, false);
    level4music = new Audio(urls[23]);
    level4music.addEventListener('ended', function () {
        this.currentTime = 0;
        this.play();
    }, false);
    level5music = new Audio(urls[24]);
    level5music.addEventListener('ended', function () {
        this.currentTime = 0;
        this.play();
    }, false);
    level6music = new Audio(urls[25);
    level6music.addEventListener('ended', function () {
        this.currentTime = 0;
        this.play();
    }, false);
    levelMusics = [level1music, level2music, level3music, level4music, level5music, level6music];
    gameover = new Howl({
        src: [urls[26]],
    });
    congrats = new Howl({
        src: [urls[27]],
    });
    gameSpawn = false;
    document.addEventListener('mousemove', onMouseUpdate, false);
    document.addEventListener('mouseenter', onMouseUpdate, false);
    document.addEventListener('mousedown', mousedown, false);
    document.addEventListener('mouseup', mouseup, false);
    enemies = [new Mario(window.innerWidth + 16, 240)];
}
function easeOutBounce(x) {
    var n1 = 7.5625;
    var d1 = 2.75;
    if (x < 1 / d1) {
        return n1 * x * x;
    }
    else if (x < 2 / d1) {
        return n1 * (x -= 1.5 / d1) * x + 0.75;
    }
    else if (x < 2.5 / d1) {
        return n1 * (x -= 2.25 / d1) * x + 0.9375;
    }
    else {
        return n1 * (x -= 2.625 / d1) * x + 0.984375;
    }
}
function lerp(a, b, t) {
    if (t <= 0.5)
        return a + (b - a) * t;
    else
        return b - (b - a) * (1.0 - t);
}
var Enemy = /** @class */ (function () {
    function Enemy() {
    }
    Enemy.prototype.render = function () {
        if (drawHitboxes) {
            context.fillStyle = 'rgba(0,255,0,0.5)';
            context.fillRect(this.x, this.y, this.w * scale, this.h * scale);
            context.fillStyle = 'rgba(255,255,255,1.0)';
        }
        context.drawImage(this.image, this.frame * this.w, 0, this.w, this.h, this.x, this.y, this.w * scale, this.h * scale); // |0 in the math ensures 32bit int
    };
    return Enemy;
}());
var Fly = /** @class */ (function (_super) {
    __extends(Fly, _super);
    function Fly(x, y) {
        var _this = _super.call(this) || this;
        _this.image = fly;
        _this.w = 15;
        _this.h = 8;
        _this.kills = false;
        _this.timer = 0; //a timer from 0 to 360 that determines the fly's current circular tragectory
        _this.xradius = 16; //the radius of the current circle the fly is flying in, resets every revolution
        _this.yradius = 16; //the radius of the current circle the fly is flying in, resets every revolution
        _this.firstRotationDone = false;
        _this.x = x;
        _this.y = y;
        _this.alive = true;
        _this.active = true;
        _this.xradius = (1 - (Math.random() * 2)) * 16;
        _this.yradius = (1 - (Math.random() * 2)) * 16;
        _this.hitsound = flysound;
        _this.deathsound = flyoffscreen;
        return _this;
    }
    Fly.prototype.logic = function (delta) {
        if (!this.alive) {
            if (this.y < window.innerHeight) {
                this.y += 12 * (delta / 16);
            }
            else {
                if (gameSpawn && !gamePause) {
                    swatted++;
                }
                this.active = false;
            }
        }
        else {
            this.x += Math.cos(this.timer * (Math.PI / 180)) * this.xradius;
            this.y += Math.sin(this.timer * (Math.PI / 180)) * this.yradius;
            this.timer += (delta / 16);
            if ((this.x <= 0) && this.firstRotationDone) {
                this.xradius = -this.xradius;
                this.x = 1;
            }
            if ((this.y <= 0) && this.firstRotationDone) {
                this.yradius = -this.yradius;
                this.y = 1;
            }
            if ((this.y + this.h * 2 >= window.innerHeight - 8) && this.firstRotationDone) {
                this.yradius = -this.yradius;
                this.y = window.innerHeight - 9 - this.h * scale;
            }
            if ((this.x + this.w * 2 >= window.innerWidth - 8) && this.firstRotationDone) {
                this.xradius = -this.xradius;
                this.x = window.innerWidth - 9 - this.w * scale;
            }
            if (this.timer >= 90 || this.timer <= -(90)) {
                if (!this.firstRotationDone) {
                    this.firstRotationDone = true;
                }
                this.timer = 0;
                do {
                    this.xradius = (1 - (Math.random() * 2)) * 4;
                    this.yradius = (1 - (Math.random() * 2)) * 4;
                } while (!(this.yradius > 1 || this.yradius < -1) && !(this.xradius > 3 || this.xradius < -3));
            }
            this.frame = (((this.timer * (delta * 0.25)) >> 0) % 2);
        }
    };
    return Fly;
}(Enemy));
var oneUp = /** @class */ (function (_super) {
    __extends(oneUp, _super);
    function oneUp(x, y, override) {
        var _this = _super.call(this) || this;
        _this.alive = true;
        _this.active = true;
        _this.hitable = true;
        _this.kills = false;
        _this.lifedup = false;
        _this.lifeuptimer = 0;
        _this.showhudtimer = 0;
        _this.oldmousex = 0;
        _this.oldmousey = 0;
        _this.w = 16;
        _this.h = 16;
        _this.frame = 0;
        _this.image = oneupSprite;
        _this.override = false;
        _this.x = x;
        _this.y = y;
        _this.override = override;
        lifenotif.play();
        _this.hitsound = checkpoint;
        _this.deathsound = null;
        return _this;
    }
    oneUp.prototype.logic = function (delta) {
        if (this.y >= window.innerHeight / 2 && this.override) {
            this.y = window.innerHeight / 2;
        }
        else {
            this.y += delta / 4.0;
        }
        if (this.y > window.innerWidth) {
            this.active = false;
        }
        if (!this.alive && this.lifeuptimer <= 0 && this.hitable) {
            this.lifeuptimer = 1;
            this.hitable = false;
            this.frame = -1;
        }
        if (this.lifeuptimer >= 0) {
            this.lifeuptimer -= delta / 1000.0;
        }
        else if (this.lifeuptimer <= 0 && !this.alive && !this.lifedup) {
            this.lifeuptimer == 0;
            this.showhudtimer = 1;
            grow.play();
            this.oldmousex = mousex;
            this.oldmousey = mousey;
            this.lifedup = true;
        }
        if (this.showhudtimer >= 0) {
            this.showhudtimer -= delta / 1000.0;
        }
        if (this.showhudtimer <= 0 && !this.alive && this.lifedup) {
            this.showhudtimer = 0;
            this.active = false;
            oneupDeath.play();
            if (this.override) {
                lives = 4;
                gamePause = false;
                gameSpawn = true;
            }
            else {
                lives++;
            }
        }
    };
    oneUp.prototype.render = function () {
        _super.prototype.render.call(this);
        if (!this.alive && this.showhudtimer <= 0) {
            context.drawImage(extralife, 0, 0, 16, 16, mousex + Math.cos((this.lifeuptimer * 360) * Math.PI / 180) * this.lifeuptimer * window.innerWidth, mousey + Math.sin(this.lifeuptimer * 360 * Math.PI / 180) * this.lifeuptimer * window.innerHeight, 16 * scale, 16 * scale); // |0 in the math ensures 32bit int
            context.drawImage(extralife, 0, 0, 16, 16, mousex - Math.cos(this.lifeuptimer * 360 * Math.PI / 180) * this.lifeuptimer * window.innerWidth, mousey - Math.sin(this.lifeuptimer * 360 * Math.PI / 180) * this.lifeuptimer * window.innerHeight, 16 * scale, 16 * scale); // |0 in the math ensures 32bit int
            context.drawImage(extralife, 0, 0, 16, 16, mousex + Math.cos(this.lifeuptimer * 360 * Math.PI / 180) * this.lifeuptimer * window.innerWidth, mousey - Math.sin(this.lifeuptimer * 360 * Math.PI / 180) * this.lifeuptimer * window.innerHeight, 16 * scale, 16 * scale); // |0 in the math ensures 32bit int
            context.drawImage(extralife, 0, 0, 16, 16, mousex - Math.cos(this.lifeuptimer * 360 * Math.PI / 180) * this.lifeuptimer * window.innerWidth, mousey + Math.sin(this.lifeuptimer * 360 * Math.PI / 180) * this.lifeuptimer * window.innerHeight, 16 * scale, 16 * scale); // |0 in the math ensures 32bit int    
        }
        if (this.showhudtimer > 0) {
            var value = lives + 1;
            if (this.override) {
                value = 4;
            }
            for (var i = 0; i < value; i++) {
                context.drawImage(extralife, 0, 0, 16, 16, lerp(this.oldmousex, (window.innerWidth / 2) - ((value / 2) * 16 * scale) + (i * 16) * scale, 1 - this.showhudtimer), lerp(this.oldmousey, 64, easeOutBounce(1 - this.showhudtimer)), 16 * scale, 16 * scale); // |0 in the math ensures 32bit int
            }
        }
    };
    return oneUp;
}(Enemy));
var marioSprites = [mario, luigi];
var Mario = /** @class */ (function (_super) {
    __extends(Mario, _super);
    function Mario(x, y) {
        var _this = _super.call(this) || this;
        _this.timer = 0;
        _this.xvel = 0;
        _this.w = 16;
        _this.h = 32;
        _this.kills = false;
        _this.image = marioSprites[Math.floor(Math.random() * 2)];
        _this.x = x;
        _this.y = y;
        _this.alive = true;
        _this.active = true;
        firstStart = true;
        _this.hitsound = mariohit;
        _this.deathsound = mariooffscreen;
        return _this;
    }
    Mario.prototype.logic = function (delta) {
        if (this.alive && this.active) {
            if (this.x > window.innerWidth / 2 - 8 * scale) {
                this.xvel = -0.25;
            }
            else {
                this.xvel = 0;
            }
            if (this.xvel < 0) {
                this.frame = ((this.timer) >> 0) % 2;
            }
            else {
                this.frame = 3;
            }
            this.x += this.xvel * delta;
            this.timer += 0.2 * (delta / 16);
        }
        else {
            this.frame = 2;
            if (this.y < window.innerHeight) {
                this.y += delta;
                this.x -= 2;
            }
            else {
                gameStart = true;
                gameOver = false;
                gamePause = false;
                swatted = 0;
                level = 1;
                levelMusics[(level - 1 % levelMusics.length)].play();
                this.active = false;
            }
        }
    };
    return Mario;
}(Enemy));
var Shitter = /** @class */ (function (_super) {
    __extends(Shitter, _super);
    function Shitter(x, y) {
        var _this = _super.call(this) || this;
        _this.image = shitter;
        _this.w = 24;
        _this.h = 16;
        _this.iterations = 0; //how many times the bug has flown before after its rounds before shitting littleshits
        _this.timer = 0; //a timer from 0 to 360 that determines the fly's current circular tragectory
        _this.shittimer = 0; //a timer from 0 to however long that determines the grace period while it takes a shit
        _this.xradius = 16; //the radius of the current circle the fly is flying in, resets every revolution
        _this.firstRotationDone = false;
        _this.kills = false;
        _this.x = x;
        _this.y = y;
        _this.alive = true;
        _this.active = true;
        _this.xradius = (1 - (Math.random() * 2)) * 18;
        _this.hitsound = shitterhit;
        _this.deathsound = shitteroffscreen;
        return _this;
    }
    Shitter.prototype.logic = function (delta) {
        if (!this.alive) {
            if (this.y < window.innerHeight) {
                this.y += 12 * (delta / 16);
            }
            else {
                if (gameSpawn && !gamePause) {
                    swatted++;
                }
                this.active = false;
            }
        }
        else {
            if (this.shittimer <= 0) {
                this.x += Math.cos(this.timer * (Math.PI / 180)) * this.xradius; //y stays the same, but x does change indeed
                this.timer += (delta / 16);
                if ((this.x <= 0) && this.firstRotationDone) {
                    this.xradius = -this.xradius;
                    this.x = 1;
                }
                if ((this.x + this.w * 2 >= window.innerWidth - 8) && this.firstRotationDone) {
                    this.xradius = -this.xradius;
                    this.x = window.innerWidth - 9 - this.w * scale;
                }
                if (this.timer >= 90 || this.timer <= -(90)) {
                    if (!this.firstRotationDone) {
                        this.firstRotationDone = true;
                    }
                    this.timer = 0;
                    this.iterations++;
                    do {
                        this.xradius = (1 - (Math.random() * 2)) * 8;
                    } while (!(this.xradius > 3 || this.xradius < -3));
                }
                if (2 + Math.random() * 4 <= this.iterations) {
                    this.shittimer = 90;
                    littleshits.play();
                    this.iterations = 0;
                }
                this.frame = (((this.timer * (delta * 0.3)) >> 0) % 2);
            }
            else {
                this.timer += (delta / 16);
                this.shittimer -= (delta / 16);
                if (this.shittimer <= 0) { //produce little shits, and then go back to flying
                    littleshits.play();
                    enemies.push(new LittleShit(this.x, this.y));
                }
                this.frame = 2 + (((this.timer * (delta * 0.3)) >> 0) % 2);
            }
        }
    };
    return Shitter;
}(Enemy));
var LittleShit = /** @class */ (function (_super) {
    __extends(LittleShit, _super);
    function LittleShit(x, y) {
        var _this = _super.call(this) || this;
        _this.image = fly;
        _this.w = 7;
        _this.h = 5;
        _this.timer = 0; //a timer from 0 to 360 that determines the fly's current circular tragectory
        _this.oldmousex = 0; //the radius of the current circle the fly is flying in, resets every revolution
        _this.oldmousey = 0; //the radius of the current circle the fly is flying in, resets every revolution
        _this.angle = 0;
        _this.kills = true;
        _this.firstRotationDone = false;
        _this.x = x;
        _this.y = y;
        _this.alive = true;
        _this.active = true;
        _this.hitsound = flysound;
        _this.deathsound = flyoffscreen;
        return _this;
    }
    LittleShit.prototype.logic = function (delta) {
        if (this.timer < 90) {
            this.oldmousex = mousex + 8;
            this.oldmousey = mousey + 8;
            this.angle = Math.atan2(this.oldmousey - this.y, this.oldmousex - this.x);
        }
        this.frame = (((this.timer * (delta * 0.25)) >> 0) % 2);
        // Calculate the angle using arctangent (atan2 for better precision)
        // Update position based on angle and delta (speed)
        this.x += Math.cos(this.angle) * delta;
        this.y += Math.sin(this.angle) * delta;
        if (this.y < 0 || this.x < 0 || this.x > window.innerWidth || this.y > window.innerHeight) {
            this.active = false;
        }
        this.timer += (delta / 16);
        if (this.x < mousex + 24 * scale &&
            this.x + this.w * scale > mousex &&
            this.y < mousey - (6 * scale) + 21 * scale &&
            this.y + this.h * scale > mousey - (6 * scale)) {
            if (deathtimer <= 0 && !gameOver) {
                deathtimer = 40;
                lives--;
                if (lives <= 0) {
                    gameOver = true;
                    gameStart = false;
                    gameSpawn = false;
                    gamePause = true;
                    gameover.play();
                    enemies.forEach(function (enemy) {
                        enemy.alive = false;
                    });
                    level1music.pause();
                    level2music.pause(); //i genuinely cannot believe i have to do this
                    level3music.pause(); //why is html audio so bad
                    level4music.pause();
                    level5music.pause();
                    level6music.pause();
                }
                die.play();
            }
            enemies.splice(enemies.indexOf(this), 1);
        }
    };
    return LittleShit;
}(Enemy));
var enemies;
function renderdigit(digit, x, y, center) {
    var string = digit.toString();
    if (center) {
        for (var i = 0; i < string.length; i++) {
            context.drawImage(digits, 0 + 16 * (parseInt(string.charAt(i))), 0, 16, 16, (x - (string.length / 2) * 16 * scale) + i * 16 * scale, y, 16 * scale, 16 * scale); // |0 in the math ensures 32bit int
        }
    }
    else {
        for (var i = 0; i < string.length; i++) {
            context.drawImage(digits, 0 + 16 * (parseInt(string.charAt(i))), 0, 16, 16, x + i * 16 * scale, y, 16 * scale, 16 * scale); // |0 in the math ensures 32bit int
        }
    }
}
function mousedown(e) {
    if (e.button == 0) {
        (swing).play();
        mousetimer = 24;
        enemies.forEach(function (enemy) {
            if (enemy.x < mousex + 24 * scale &&
                enemy.x + enemy.w * scale > mousex &&
                enemy.y < mousey - (6 * scale) + 21 * scale &&
                enemy.y + enemy.h * scale > mousey - (6 * scale)) {
                mousetimer = 40;
                hitEnemy = true;
                enemy.alive = false;
                if (enemy.hitsound != null) {
                    (enemy.hitsound).play();
                }
            }
        });
        mouseframes = (mousetimer / 8) - 1;
    }
}
function mouseup(e) {
    if (e.button == 0) {
        mousepressed = false;
    }
}
function onMouseUpdate(e) {
    if (deathtimer <= 0) {
        mousex = e.pageX;
        mousey = e.pageY;
    }
}
function logic(delta) {
    enemies.forEach(function (enemy) {
        enemy.logic(delta);
        if (!enemy.active) {
            if (enemy.deathsound != null) {
                (enemy.deathsound).play();
            }
            enemies.splice(enemies.indexOf(enemy), 1);
            if (swatted > 10) {
                minbugs = 8;
            }
            if (swatted > 100) {
                minbugs = 16;
            }
            if (swatted > 200) {
                minbugs = 20;
            }
            if (swatted > 300) {
                minbugs = 24;
            }
            if (swatted > 500) {
                minbugs = 32;
            }
            if (swatted > 600) { //may regret this later
                minbugs = 36;
            }
        }
    });
    if (gameStart && !gameSpawn && !gamePause && enemies.length == 0 && !gameOver) {
        if (textTimer == 0 && textx < (window.innerWidth / 2) - (10 * scale)) {
            textx += delta;
        }
        else if (textTimer < 500) {
            textTimer += delta / 8;
        }
        else if (textx > 0 && textTimer > 500) {
            textx -= delta;
        }
        else {
            gameSpawn = true;
            if (firstStart) {
                firstStart = false;
                document.body.style.backgroundImage = "url(" + levelbackgrounds[(level - 1) % levelbackgrounds.length] + ")";
            }
            else {
                levelMusics[(level - 1) % levelMusics.length].play();
                document.body.style.backgroundImage = "url(" + levelbackgrounds[(level - 1) % levelbackgrounds.length] + ")";
            }
            textx = 0;
            textTimer = 0;
        }
    }
    if (mousetimer > 0) {
        mousetimer -= delta * 0.2;
        if (mousetimer <= 16 && hitEnemy) {
            (hit).play();
            hitEnemy = false;
        }
    }
    if (deathtimer > 0) {
        deathtimer -= delta * 0.05;
    }
    if (gameSpawn && enemies.length < minbugs) {
        var corners = [[0, 0], [window.innerWidth, 0], [0, window.innerHeight], [window.innerWidth, window.innerHeight]];
        // for(var i =0; i < Math.floor(Math.random()*8)+3; i++) {
        //     const corner = corners[Math.floor(Math.random()*4)];
        //     var side = Math.floor(Math.random() * 2);
        //     enemies.push(new Fly(corner[0]*side,corner[1]*(1-side))); //not having this in a loop because this is guaranteed every time
        // }
        enemies.push(new Fly(Math.random() * window.innerWidth, 0));
        enemies.push(new Fly(Math.random() * window.innerWidth, window.innerHeight));
        enemies.push(new Fly(window.innerWidth, Math.random() * window.innerHeight));
        enemies.push(new Fly(0, Math.random() * window.innerHeight));
        if (swatted > 25) {
            for (var i = 0; i < 4; i++) {
                var side = Math.floor(Math.random() * 2);
                enemies.push(new Shitter(window.innerWidth * side, 24 + (Math.random() * (window.innerHeight - 48)))); //not having this in a loop because this is guaranteed every time
            }
        }
        enemies;
    }
    if (swatted == 25 && gameStart && gameSpawn) {
        gameSpawn = false;
        gamePause = true;
        swatted++;
        enemies.forEach(function (enemy) {
            enemy.alive = false;
        });
        enemies.push(new oneUp(window.innerWidth / 2, 0, true));
    }
    if (swatted % 100 == 0 && gameStart && gameSpawn && swatted != 0) {
        gameSpawn = false;
        gamePause = false;
        level++;
        swatted++;
        enemies.forEach(function (enemy) {
            enemy.alive = false;
        });
        level1music.pause();
        level2music.pause(); //i genuinely cannot believe i have to do this
        level3music.pause(); //why is html audio so bad
        level4music.pause();
        level5music.pause();
        level6music.pause();
        congrats.play();
    }
    if (swatted == 25 && gameStart && gameSpawn) {
        gameSpawn = false;
        gamePause = true;
        swatted++;
        enemies.forEach(function (enemy) {
            enemy.alive = false;
        });
        enemies.push(new oneUp(window.innerWidth / 2, 0, true));
    }
    if (swatted > 25 && Math.floor(Math.random() * 2000) == 500) {
        enemies.push(new oneUp((5 + window.innerWidth - 5) * Math.random(), 0, false));
    }
    if (gameOver && gamePause) {
        gameoverTimer += delta / 16;
    }
    if (gameoverTimer >= 200) {
        gamePause = false;
        gameoverTimer = 0;
        enemies.push(new Mario(window.innerWidth + 16, 240));
    }
}
function draw() {
    context.canvas.width = window.innerWidth;
    context.canvas.height = window.innerHeight;
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "#000000";
    context.imageSmoothingEnabled = false;
    enemies.forEach(function (enemy) {
        enemy.render();
    });
    // context!.fillRect(mousex,mousey,32,32);
    if (mousetimer > 0) {
        context.drawImage(flyswatter, 0 + 32 * (mouseframes - (mousetimer / 8 >> 0)), 0, 32, 64, mousex - 16, mousey - 24, 32 * scale, 64 * scale); // |0 in the math ensures 32bit int
    }
    else if (deathtimer > 0) {
        context.drawImage(flyswatter, (5 * 32) + 32 * (2 - (deathtimer / 16 >> 0)), 0, 32, 64, mousex - 16, mousey - 24, 32 * scale, 64 * scale); // |0 in the math ensures 32bit int
    }
    else {
        context.drawImage(flyswatter, 0, 0, 32, 64, mousex - 16, mousey - 24, 32 * scale, 64 * scale); // |0 in the math ensures 32bit int
    }
    if (drawHitboxes) {
        context.fillStyle = 'rgba(255,0,0,0.5)';
        context.fillRect(mousex, mousey - (6 * scale), (21 * scale), (24 * scale));
        context.fillStyle = 'rgba(0,0,0,1.0)';
    }
    context.drawImage(levelText, textx - (40 * scale), 240, (40 * scale), (16 * scale));
    renderdigit(level, window.innerWidth - textx, 240, false);
    if (gameSpawn) {
        renderdigit(swatted, window.innerWidth / 2, 20, true);
    }
    if (gameOver) {
        context.drawImage(gameoverText, window.innerWidth / 2 - 36 * scale, 320, (72 * scale), (16 * scale));
        renderdigit(swatted, window.innerWidth / 2, 380, true);
    }
    if (lives > 0) {
        for (var i = 0; i < lives; i++) {
            context.drawImage(extralife, 0, 0, 16, 16, (window.innerWidth / 2) - ((lives / 2) * 16 * scale) + i * 16 * scale, 64, 16 * scale, 16 * scale); // |0 in the math ensures 32bit int
        }
    }
}
function loop(timestamp) {
    var progress = timestamp - lastRender;
    logic(progress);
    draw();
    lastRender = timestamp;
    window.requestAnimationFrame(loop);
}
var lastRender = 0;
function startFlice() {
    window.requestAnimationFrame(loop);
}
