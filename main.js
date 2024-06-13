// import {Howl, Howler} from 'howler';
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
var textTimer = 0;
var textx = 0;
var level = 1;
var swatted = 0;
var gameStart = false;
var gamePause = false;
var hitEnemy = false;
var mousepressed = false;
var mousetimer = 0;
var mouseframes = 0;
// put this outside the event loop..
var canvas = document.getElementById("canvas2d");
var context = canvas.getContext("2d");
var flyswatter = new Image();
flyswatter.src = 'images/cursor.png';
var fly = new Image();
fly.src = "images/fly.png";
var mario = new Image();
mario.src = "images/mario.png";
var digits = new Image();
digits.src = "images/digits.png";
var levelText = new Image();
levelText.src = "images/level.png";
var oneupSprite = new Image();
oneupSprite.src = "images/oneup.png";
var drawHitboxes = false;
var scale = 3;
var oneupDeath = new Howl({
    src: ["sounds/1up.wav"]
});
var swing = new Howl({
    src: ["sounds/gnatattack_swing.wav"]
});
var hit = new Howl({
    src: ["sounds/gnatattack_hit.wav"]
});
var flysound = new Howl({
    src: ["sounds/gnatattack_bugdie1.wav"]
});
var flyoffscreen = new Howl({
    src: ["sounds/gnatattack_bugoffscreen1.wav"]
});
var mariohit = new Howl({
    src: ["sounds/yoshi-spit.wav"]
});
var mariooffscreen = new Howl({
    src: ["sounds/bullet.wav"]
});
var level1music = new Howl({
    src: ["sounds/level1music.mp3"],
    html5: true
});
var gameSpawn = false;
document.addEventListener('mousemove', onMouseUpdate, false);
document.addEventListener('mouseenter', onMouseUpdate, false);
document.addEventListener('mousedown', mousedown, false);
document.addEventListener('mouseup', mouseup, false);
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
        _this.timer = 0; //a timer from 0 to 360 that determines the fly's current circular tragectory
        _this.xradius = 16; //the radius of the current circle the fly is flying in, resets every revolution
        _this.yradius = 16; //the radius of the current circle the fly is flying in, resets every revolution
        _this.hitsound = flysound;
        _this.deathsound = flyoffscreen;
        _this.firstRotationDone = false;
        _this.x = x;
        _this.y = y;
        _this.alive = true;
        _this.active = true;
        _this.xradius = (1 - (Math.random() * 2)) * 16;
        _this.yradius = (1 - (Math.random() * 2)) * 16;
        return _this;
    }
    Fly.prototype.logic = function (delta) {
        if (!this.alive) {
            if (this.y < window.innerHeight) {
                this.y += 12 * (delta / 16);
            }
            else {
                if (gameSpawn) {
                    swatted++;
                }
                this.active = false;
            }
        }
        else {
            console.log(delta);
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
    function oneUp() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.w = 16;
        _this.h = 16;
        _this.hitsound = hit;
        _this.deathsound = oneupDeath;
        _this.image = oneupSprite;
        return _this;
    }
    oneUp.prototype.logic = function (delta) {
        if (this.y <= window.innerHeight / 2) {
            this.y = window.innerHeight;
        }
        else {
            this.y -= delta / 32.0;
        }
        if (!this.alive) {
            this.active = false;
            gameSpawn = true;
        }
    };
    return oneUp;
}(Enemy));
var Mario = /** @class */ (function (_super) {
    __extends(Mario, _super);
    function Mario(x, y) {
        var _this = _super.call(this) || this;
        _this.timer = 0;
        _this.xvel = 0;
        _this.w = 16;
        _this.h = 32;
        _this.image = mario;
        _this.hitsound = mariohit;
        _this.deathsound = mariooffscreen;
        _this.x = x;
        _this.y = y;
        _this.alive = true;
        _this.active = true;
        return _this;
    }
    Mario.prototype.logic = function (delta) {
        if (this.alive && this.active) {
            console.log(this.x);
            if (this.x > window.innerWidth / 2) {
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
            this.timer += 0.05 * (delta / 16);
        }
        else {
            this.frame = 2;
            if (this.y < window.innerHeight) {
                this.y += delta;
                this.x -= 2;
            }
            else {
                gameStart = true;
                level1music.play();
                this.active = false;
            }
        }
    };
    return Mario;
}(Enemy));
var enemies = [new Mario(window.innerWidth + 16, 240)];
function renderdigit(digit, x, y, center) {
    var string = digit.toString();
    if (center) {
        for (var i = 0; i < string.length; i++) {
            context.drawImage(digits, 0 + 16 * (parseInt(string.charAt(i))), 0, 16, 16, (x - (string.length / 2) * scale) + i * 16 * scale, y, 16 * scale, 16 * scale); // |0 in the math ensures 32bit int
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
                (enemy.hitsound).play();
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
    mousex = e.pageX;
    mousey = e.pageY;
}
function logic(delta) {
    enemies.forEach(function (enemy) {
        enemy.logic(delta);
        if (!enemy.active) {
            (enemy.deathsound).play();
            enemies.splice(enemies.indexOf(enemy), 1);
        }
    });
    if (gameStart && !gameSpawn && !gamePause && enemies.length == 0) {
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
    if (gameSpawn && enemies.length < 4) {
        enemies.push(new Fly(Math.random() * window.innerWidth, 0));
        enemies.push(new Fly(Math.random() * window.innerWidth, window.innerHeight));
        enemies.push(new Fly(window.innerWidth, Math.random() * window.innerHeight));
        enemies.push(new Fly(0, Math.random() * window.innerHeight));
    }
    if (swatted % 50 == 0 && gameStart) {
        gameSpawn = false;
        swatted++;
        level++;
        enemies.forEach(function (enemy) {
            enemy.alive = false;
            // gamePause = true;
        });
    }
    if (!gameSpawn && gamePause) {
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
        renderdigit(swatted, window.innerWidth / 2, 100, true);
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
window.requestAnimationFrame(loop);
