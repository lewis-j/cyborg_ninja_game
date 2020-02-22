(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
/*global Phaser*/
"use strict";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _statesBootJs = require("./states/Boot.js");

var _statesBootJs2 = _interopRequireDefault(_statesBootJs);

var _statesPreloadJs = require("./states/Preload.js");

var _statesPreloadJs2 = _interopRequireDefault(_statesPreloadJs);

var _statesMenuJs = require("./states/Menu.js");

var _statesMenuJs2 = _interopRequireDefault(_statesMenuJs);

var _statesLevel1Js = require("./states/Level1.js");

var _statesLevel1Js2 = _interopRequireDefault(_statesLevel1Js);

var _statesLevel2Js = require("./states/Level2.js");

var _statesLevel2Js2 = _interopRequireDefault(_statesLevel2Js);

var _statesGameOverJs = require("./states/GameOver.js");

var _statesGameOverJs2 = _interopRequireDefault(_statesGameOverJs);

var game;

window.onload = function () {
    game = new Phaser.Game(1200, 800);
    game.state.add('boot', _statesBootJs2["default"]);
    game.state.add('preload', _statesPreloadJs2["default"]);
    game.state.add('menu', _statesMenuJs2["default"]);
    game.state.add('level1', _statesLevel1Js2["default"]);
    game.state.add('level2', _statesLevel2Js2["default"]);
    game.state.add('game_over', _statesGameOverJs2["default"]);
    game.state.start('boot');
};

},{"./states/Boot.js":5,"./states/GameOver.js":6,"./states/Level1.js":7,"./states/Level2.js":8,"./states/Menu.js":9,"./states/Preload.js":10}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Enemy = (function (_Phaser$Sprite) {
    _inherits(Enemy, _Phaser$Sprite);

    function Enemy(game, x, y, bullets, player, layer) {
        _classCallCheck(this, Enemy);

        _get(Object.getPrototypeOf(Enemy.prototype), 'constructor', this).call(this, game, x, y, 'enemy_shoot', 0);

        this.player = player;
        this.bullets = bullets;
        this.game.physics.enable(this, Phaser.Physics.ARCADE);
        this.body.gravity.y = 700;
        this.body.immovable = true;
        this.isWalking = false;
        this.enemy_nextShot = 0;
        this.leftBoundery = x - 100;
        this.rightBoundery = x + 100;

        this.line = new Phaser.Line();
        this.tilesHit = [];
        this.layer = layer;
        this.enemyUpdate = false;
        this.destroyEnemy = false;
        this.detectDistance = 600;
        this.shotsPerSecond = 1;

        this.arm = this.addChild(new Phaser.Sprite(game, 0, 0, 'arm'));
        this.torso = this.addChild(new Phaser.Sprite(game, 0, 0, 'body'));
        this.robotRun = this.addChild(new Phaser.Sprite(game, 0, 0, 'robot_run'));

        this.anchor.setTo(.5, .5);
        this.arm.anchor.setTo(0, .5);
        this.torso.anchor.setTo(.5, .5);
        this.robotRun.anchor.setTo(.5, .5);
        this.arm.visible = false;
        this.torso.visible = false;
        this.scale.x = -1;

        this.robotRun.animations.add('run', [0, 1, 2, 3, 4, 5, 6], 5, true);
        this.robotRun.play('run');

        this.enemyHealth = { current: 3, max: 3 };
    }

    _createClass(Enemy, [{
        key: 'update',
        value: function update() {

            if (this.enemyUpdate) {

                if (Phaser.Math.distance(this.player.x, this.player.y, this.x, this.y) < this.detectDistance && (this.scale.x < 0 && this.x - this.player.x > 0 || this.scale.x > 0 && this.x - this.player.x < 0)) {

                    this.line.start.set(this.player.x, this.player.y);
                    this.line.end.set(this.x, this.y);
                    this.tilesHit = this.layer.getRayCastTiles(this.line, 4, false, true);

                    if (this.tilesHit.length == 0) {
                        if (this.isWalking) {
                            this.body.velocity.x = 0;
                            this.children[2].visible = false;
                            this.children[0].visible = true;
                            this.children[1].visible = true;
                            this.isWalking = false;
                        }

                        this.enemyShoots();
                    } else {
                        this.walk();
                    }
                } else {
                    this.walk();
                }
            } else {
                //                this.idleAnim.play();
                this.body.velocity.x = 0;
                this.isWalking = false;
            }
        }
    }, {
        key: 'walk',
        value: function walk() {

            if (!this.isWalking) {
                this.children[2].visible = true;
                this.children[0].visible = false;
                this.children[1].visible = false;
                this.isWalking = true;

                if (this.player.x > this.x) {
                    this.body.velocity.x = 100;
                    this.scale.x = 1;
                } else {
                    this.body.velocity.x = -100;
                    this.scale.x = -1;
                }
            }

            if (this.x < this.leftBoundery) {
                this.body.velocity.x = 50;
                this.scale.x = 1;
            } else if (this.x > this.rightBoundery) {
                this.body.velocity.x = -50;
                this.scale.x = -1;
            }
        }
    }, {
        key: 'enemyShoots',
        value: function enemyShoots() {

            var dir = this.scale.x > 0 ? 1 : -1;
            this.children[0].rotation = dir * Math.atan((this.y - this.player.y) / (this.x - this.player.x));
            var p = new Phaser.Point(this.x, this.y);
            p.rotate(p.x, p.y, (this.children[0].rotation - .05) * dir, false, this.scale.x > 0 ? 25 : -50);

            if (this.game.time.now > this.enemy_nextShot) {
                this.enemy_nextShot = this.game.time.now + Phaser.Timer.SECOND * (1 / this.shotsPerSecond);

                var bullet = this.bullets.getFirstDead();
                if (bullet) {
                    bullet.x = p.x;
                    bullet.y = p.y;
                    bullet.revive();
                } else {
                    bullet = this.bullets.create(p.x, p.y, 'enemy_bullet');
                    this.game.physics.arcade.enable(bullet);
                    bullet.outOfBoundsKill = true;
                    bullet.checkWorldBounds = true;
                }
                bullet.angle = this.children[0].angle * dir;
                this.game.physics.arcade.velocityFromRotation(this.children[0].rotation * dir, 700 * dir, bullet.body.velocity);
            }
        }
    }]);

    return Enemy;
})(Phaser.Sprite);

exports['default'] = Enemy;
module.exports = exports['default'];

},{}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var HealthBar = (function (_Phaser$Group) {
    _inherits(HealthBar, _Phaser$Group);

    function HealthBar(game, xpos, ypos, barGraphic, holderGraphic) {
        _classCallCheck(this, HealthBar);

        _get(Object.getPrototypeOf(HealthBar.prototype), "constructor", this).call(this, game);
        this.x = xpos;
        this.y = ypos;

        this.bar = this.create(0, 0, barGraphic);
        this.holder = this.create(0, 0, holderGraphic);
    }

    _createClass(HealthBar, [{
        key: "setValue",
        value: function setValue(val) {

            if (this.tween) this.tween.stop();
            this.tween = this.game.add.tween(this.bar.scale);
            this.tween.to({ x: val }, 350);
            this.tween.start();
        }
    }]);

    return HealthBar;
})(Phaser.Group);

exports["default"] = HealthBar;
module.exports = exports["default"];

},{}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Player = (function (_Phaser$Sprite) {
    _inherits(Player, _Phaser$Sprite);

    function Player(game, x, y, bullets, rockets, fuelUI, healthUI, lifeUI) {
        _classCallCheck(this, Player);

        _get(Object.getPrototypeOf(Player.prototype), 'constructor', this).call(this, game, x, y, 'ninja', 0);
        this.jetpackSpeed = 50;
        this.heroflying = false;
        this.firstAnimation = true;
        this.flightSequenceInit = false;
        this.noShotAnim = true;
        this.shotSpeed = 1500;
        this.bullets = bullets;
        this.rockets = rockets;
        this.fuelUI = fuelUI;
        this.healthUI = healthUI;
        this.shotInterval = .5;
        this.isDead = false;
        this.jetUsed = false;
        this.startingX = x;
        this.startingY = y;

        this.health = { max: 10, current: 10 };
        this.fuel = { current: 10, max: 10 };
        this.lives = 3;

        this.flightDelay = 0;
        this.charecterspeed = 400;
        this.nextShot = 0;

        //intitail flight boost variables

        this.flightWarmUpTime = 2;
        this.jetSpeed = 400;

        this.flightWarmUp = 0;
        this.seqCount = 0;
        this.jetBoost = 0;
        this.loopDelay = 0;
        this.loopRate = .1;
        this.rotationOffset = .15;
        this.rateOverTime = this.flightWarmUpTime / this.loopRate;
        this.rotationOverTime = .36 / this.rateOverTime;
        this.jetAccelleration = this.jetSpeed / this.rateOverTime;
        this.angleOverTime = 19 / this.rateOverTime;
        this.rotationSeq = 0;
        this.fuelUseInterval = 0;

        this.game.physics.arcade.enable(this, Phaser.Physics.ARCADE);

        this.body.gravity.y = 600;
        this.anchor.setTo(.5, .5);
        this.body.setSize(60, 90, 0, -7);

        this.animations.add('attack', [0, 1, 2, 3, 4, 5], 10, true);
        this.die = this.animations.add('die', [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17], 5, false);
        this.animations.add('dizzy', [18, 19, 20, 21], 10, true);
        this.idle = this.animations.add('idle', [22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33], 10, true);
        this.animations.add('jetpack', [34, 35, 36, 37, 38, 39, 40, 41], 10, true);
        this.animations.add('jump', [42, 43, 44, 45, 46, 47], 10, false);
        this.animations.add('roll', [48, 49, 50, 51, 52, 53, 54, 55], 10, true);
        this.animations.add('run', [56, 57, 58, 59, 60, 61, 62, 63, 64, 65], 10, false);
        this.runShot = this.animations.add('run_with_gun', [66, 67, 68, 69, 70, 71, 72, 73, 74, 75], 10, false);
        this.idleShot = this.animations.add('shot', [76, 77, 78, 79, 80], 10, false);
        this.runShotStop = this.animations.add('shotStop', [79, 80], 8, false);
        this.animations.add('sliding', [81, 82, 83, 84, 85, 86], 10, true);
        this.animations.add('throwing', [87, 88, 89, 90, 91, 92], 10, true);
        this.animations.add('jetpack_fire', [93, 94, 95, 96, 97], 10, false);
        this.animations.add('jump_fire', [98, 99, 100, 101, 102], 10, false);
        this.die.onComplete.add(this.dead, this);

        //Player flashes when hit
        this.flashEffect = this.game.add.tween(this).to({ alpha: 0 }, 50, Phaser.Easing.Bounce.Out).to({ alpha: .8 }, 50, Phaser.Easing.Bounce.Out).to({ alpha: 1 }, 150, Phaser.Easing.Circular.Out);

        //registered inputs
        this.moveLeft = this.game.input.keyboard.addKey("A".charCodeAt(0));
        this.moveRight = this.game.input.keyboard.addKey("D".charCodeAt(0));
        this.jump = this.game.input.keyboard.addKey("W".charCodeAt(0));
        this.moveDown = this.game.input.keyboard.addKey("S".charCodeAt(0));
        this.cursor = this.game.input.keyboard.createCursorKeys();
        this.jetmode = this.game.input.keyboard.addKey(16);
        this.shoot = this.game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
        this.testshot = this.game.input.keyboard.addKey(13);
    }

    _createClass(Player, [{
        key: 'update',
        value: function update() {
            if (!this.isDead) {
                if (this.body.onFloor()) {
                    this.firstAnimation = true;
                    if (this.heroflying) {
                        this.resetFlight();
                    }
                    if (this.jetUsed) {
                        this.fuelUI.setValue(1);
                        this.fuel.current = this.fuel.max;
                        this.jetUsed = false;
                    }

                    this.groundControls();
                } else {

                    if (!this.heroflying) {

                        this.jumpControls();
                    } else {

                        this.flightControls();
                    }
                }
            }
        }
    }, {
        key: 'groundControls',
        value: function groundControls() {

            if (this.shoot.isDown) {
                this.shotFired();
            }
            this.noShotAnim = !(this.runShot.isPlaying || this.idleShot.isPlaying);

            if (this.moveRight.isDown) {

                if (this.idleShot.isPlaying) {
                    this.idleShot.stop();
                    this.runShot.play();
                } else if (!this.runShot.isPlaying) {
                    this.play('run');
                }
                this.body.velocity.x = this.charecterspeed;
                this.scale.x = 1;
            } else if (this.moveLeft.isDown) {
                if (this.idleShot.isPlaying) {
                    this.idleShot.stop();
                    this.runShot.play();
                } else if (!this.runShot.isPlaying) {
                    this.play('run');
                }
                this.body.velocity.x = -this.charecterspeed;
                this.scale.x = -1;
            } else {

                this.body.velocity.x = 0;
                if (this.noShotAnim && !this.runShotStop.isPlaying) {
                    this.play('idle');
                } else {
                    if (this.runShot.isPlaying) {
                        this.runShot.stop();
                        this.runShotStop.play();
                    }
                }
            }
            if (this.jump.isDown) {
                this.body.velocity.y = -500;
            }
            if (this.jetmode.isDown) {
                this.body.y = this.body.y - 10;

                this.angle -= this.scale.x > 0 ? 72 : -72;
                //                  this.game.time.events.add(Phaser.Timer.SECOND * .1, this.startFlight, this);
                this.startFlight();
                this.flightDelay = this.game.time.now + 600;
                this.jetUsed = true;
            }
        }
    }, {
        key: 'jumpControls',
        value: function jumpControls() {
            if (this.firstAnimation) {
                this.play('jump');
                this.firstAnimation = false;
            }

            if (this.moveRight.isDown) {
                this.body.velocity.x = this.charecterspeed;

                this.scale.x = 1;
            } else if (this.moveLeft.isDown) {
                this.body.velocity.x = -this.charecterspeed;

                this.scale.x = -1;
            } else {

                this.body.velocity.x = 0;
            }
            if (this.jetmode.isDown) {
                if (this.game.time.now > this.flightDelay) {

                    this.startFlight();
                    this.jetUsed = true;
                }
            }

            if (this.shoot.isDown) {
                this.shotFired();
            }
        }
    }, {
        key: 'flightControls',
        value: function flightControls() {

            if (this.shoot.isDown) {
                this.airShot();
            }

            var dir = this.scale.x > 0 ? 1 : -1;
            if (this.jump.isDown) {
                this.angle -= 2 * dir;
            }
            if (this.moveDown.isDown) {
                this.angle += 2 * dir;
            }
            if (!this.flightSequenceInit) {
                this.flightSequence(dir);
            }

            this.game.physics.arcade.velocityFromRotation(this.rotation + this.rotationSeq, (this.jetpackSpeed + this.jetBoost) * dir, this.body.velocity);

            if (this.jetmode.isDown) {

                if (this.game.time.now > this.flightDelay) {
                    this.play('jump');
                    this.resetFlight();
                    this.flightDelay = this.game.time.now + 600;

                    //                          this.jetAudio.stop();
                }
            }

            if (this.game.time.now > this.fuelUseInterval) {

                this.fuelUseInterval = this.game.time.now + Phaser.Timer.SECOND * .5;
                this.fuel.current--;
                this.fuelUI.setValue(this.fuel.current / this.fuel.max);
                if (this.fuel.current <= 0) {
                    this.play('jump');
                    this.resetFlight();
                }
            }
        }
    }, {
        key: 'resetFlight',
        value: function resetFlight() {
            //                  this.jetAudio.stop();
            this.heroflying = false;
            this.angle = 0;
            this.seqCount = 0;
            this.flightSequenceInit = false;
            this.rotationSeq = 0;
            this.jetBoost = 0;
            this.game.physics.arcade.velocityFromRotation(this.rotation, 0, this.body.velocity);
        }
    }, {
        key: 'shotFired',
        value: function shotFired() {

            if (this.game.time.now > this.nextShot) {
                this.nextShot = this.game.time.now + Phaser.Timer.SECOND * this.shotInterval;

                var dir = this.scale.x > 0 ? 1 : -1;
                var bullet = this.bullets.getFirstDead();
                if (bullet) {
                    bullet.x = this.x + dir * 25;
                    bullet.y = this.y;
                    bullet.angle = 0;
                    this.game.physics.arcade.velocityFromRotation(this.rotation, 0, bullet.body.velocity);
                    bullet.revive();
                } else {
                    bullet = this.bullets.create(this.x + dir * 25, this.y, 'bullet');
                    this.game.physics.enable(bullet, Phaser.Physics.ARCADE);
                    bullet.outOfBoundsKill = true;
                    bullet.checkWorldBounds = true;
                }
                bullet.body.velocity.x = dir * this.shotSpeed;

                //animations for shots
                if (this.body.onFloor()) {
                    if (this.body.velocity.x === 0) {
                        this.idleShot.play();
                    } else {
                        this.runShot.play();
                    }
                } else {
                    this.play('jump_fire');
                }
            }
        }
    }, {
        key: 'airShot',
        value: function airShot() {

            if (this.game.time.now > this.nextShot) {
                this.nextShot = this.game.time.now + Phaser.Timer.SECOND * this.shotInterval;
                this.play('jetpack_fire');
                this.animations.currentAnim.onComplete.add(function () {
                    this.play('jetpack');
                }, this);

                var dir = this.scale.x > 0 ? 1 : -1;
                var p = new Phaser.Point(this.x, this.y);
                p.rotate(p.x, p.y, this.rotation, false, 40 * dir);
                var rocket = this.rockets.getFirstDead();
                if (rocket) {
                    rocket.x = p.x;
                    rocket.y = p.y;
                    rocket.revive();
                } else {
                    rocket = this.rockets.create(p.x, p.y, 'rocket');
                    rocket.animations.add('soar');
                    this.game.physics.arcade.enable(rocket);
                    rocket.outOfBoundsKill = true;
                    rocket.checkWorldBounds = true;
                }
                rocket.scale.x = dir;
                rocket.angle = this.angle + -18 * dir;
                this.game.physics.arcade.velocityFromRotation(this.rotation + this.rotationSeq, this.shotSpeed * dir, rocket.body.velocity);
                rocket.play('soar');
            }
        }
    }, {
        key: 'flightSequence',
        value: function flightSequence(dir) {
            if (this.game.time.now > this.loopDelay) {
                this.loopDelay = this.game.time.now + Phaser.Timer.SECOND * this.loopRate;;
                this.seqCount++;
                this.angle += this.angleOverTime * dir;
                this.rotationSeq -= this.rotationOverTime * dir;
                this.jetBoost += this.jetAccelleration;
                if (this.seqCount == this.rateOverTime) {
                    this.flightSequenceInit = true;
                }
            }
        }
    }, {
        key: 'startFlight',
        value: function startFlight() {
            this.play('jetpack');
            this.heroflying = true;
            this.flightDelay = this.game.time.now + 600;
            //                    this.jetAudio.play('',0,1,true);  
        }
    }, {
        key: 'died',
        value: function died() {
            this.isDead = true;
            this.body.velocity.x = 0;
            this.play('die');
        }
    }, {
        key: 'dead',
        value: function dead() {
            this.lives--;

            if (this.lives > 0) {
                this.healthUI.setValue(1);
                this.lifeUI.text = "x " + this.lives;
                this.x = this.startingX;
                this.y = this.startingY;
                this.isDead = false;
                this.health.current = this.health.max;
            } else {
                this.game.state.start('game_over', true, false);
            }
        }
    }, {
        key: 'flash',
        value: function flash() {
            if (!this.flashEffect.isRunning) {
                this.flashEffect.start();
            }
        }
    }]);

    return Player;
})(Phaser.Sprite);

exports['default'] = Player;
module.exports = exports['default'];

},{}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Boot = (function () {
    function Boot() {
        _classCallCheck(this, Boot);
    }

    _createClass(Boot, [{
        key: 'preload',
        value: function preload() {
            this.load.image('preloader', 'assets/img/loading_bar.png');
        }
    }, {
        key: 'create',
        value: function create() {
            this.game.input.maxPointer = 1;
            this.game.state.start('preload');
        }
    }]);

    return Boot;
})();

exports['default'] = Boot;
module.exports = exports['default'];

},{}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var GameOver = (function (_Phaser$State) {
    _inherits(GameOver, _Phaser$State);

    function GameOver() {
        _classCallCheck(this, GameOver);

        _get(Object.getPrototypeOf(GameOver.prototype), 'constructor', this).apply(this, arguments);
    }

    _createClass(GameOver, [{
        key: 'preload',
        value: function preload() {

            this.load.image('menu_background', 'assets/img/menu_background.jpg');
        }
    }, {
        key: 'create',
        value: function create() {

            var style = {
                font: "60px Arial",
                fill: '#ffffff',
                align: "center",
                stroke: '#000000',
                strokeThickness: 2
            };

            this.startGame = this.game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
            this.add.sprite(0, 0, 'menu_background');

            var title = this.addText(this.game.width / 2, 100, 60, "GAME OVER", style);
            title.anchor.setTo(.5, 0);
            var textAlign = this.game.width / 2 - title.width / 2;

            var sprite = this.game.add.sprite(this.game.width / 2, this.game.height / 2, 'ninja');
            sprite.scale.setTo(2);
            sprite.animations.add('dizzy', [18, 19, 20, 21], 10, true);
            sprite.play('dizzy');
        }
    }, {
        key: 'update',
        value: function update() {

            if (this.startGame.isDown) {

                this.game.state.start('menu');
            }
        }
    }, {
        key: 'addText',
        value: function addText(x, y, textSize, message, style) {

            var text = this.game.add.text(x, y, message, style);
            text.setShadow(5, 5, 'rgba(0,0,0,0.5)', 5);
            var grd = text.context.createLinearGradient(0, 0, 0, 74);
            grd.addColorStop(0, '#8ED6FF');
            grd.addColorStop(1, '#004CB3');
            text.fill = grd;
            text.fontSize = textSize;

            return text;
        }
    }]);

    return GameOver;
})(Phaser.State);

exports['default'] = GameOver;
module.exports = exports['default'];

},{}],7:[function(require,module,exports){
/* global Phaser */

"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _prefabsPlayerJs = require("../prefabs/Player.js");

var _prefabsPlayerJs2 = _interopRequireDefault(_prefabsPlayerJs);

var _prefabsEnemyJs = require("../prefabs/Enemy.js");

var _prefabsEnemyJs2 = _interopRequireDefault(_prefabsEnemyJs);

var _prefabsHealthBarJs = require("../prefabs/HealthBar.js");

var _prefabsHealthBarJs2 = _interopRequireDefault(_prefabsHealthBarJs);

var Level1 = (function (_Phaser$State) {
    _inherits(Level1, _Phaser$State);

    function Level1() {
        _classCallCheck(this, Level1);

        _get(Object.getPrototypeOf(Level1.prototype), "constructor", this).call(this);
    }

    _createClass(Level1, [{
        key: "preload",
        value: function preload() {
            this.load.image('tileset', 'assets/img/sci_fi_tiles.png');
            this.load.tilemap('mytilemap', 'assets/tiles/level1.json', null, Phaser.Tilemap.TILED_JSON);
        }
    }, {
        key: "create",
        value: function create() {

            this.game.physics.startSystem(Phaser.Physics.ARCADE);
            this.game.stage.backgroundColor = "#918a87";

            this.doorIsClosed = true;
            this.score = 0;
            this.enemyCount = { current: 0, total: 0 };
            this.deathDelay = 0;

            //create tileset
            this.myTiles = this.game.add.tilemap('mytilemap');
            this.myTiles.addTilesetImage('sci_fi_tiles', 'tileset');
            this.myTiles.setCollisionBetween(0, 500);
            this.mytilebackground = this.myTiles.createLayer('Background');
            this.mytileslayer = this.myTiles.createLayer('World');
            this.mytileslayer.resizeWorld();

            this.quadTree = new Phaser.QuadTree(0, 0, this.game.world.width, this.game.world.height, 4, 4, 0);

            this.playerBullets = this.add.group();
            this.playerBullets.enableBody = true;
            this.playerBullets.physicsBodyType = Phaser.Physics.ARCADE;

            this.playerRockets = this.add.group();
            this.playerRockets.enableBody = true;
            this.playerRockets.physicsBodyType = Phaser.Physics.ARCADE;

            this.enemyBullets = this.add.group();
            this.enemyBullets.enableBody = true;
            this.enemyBullets.physicsBodyType = Phaser.Physics.ARCADE;

            //create door    
            this.myTiles.createFromObjects('Door', 618, 'door', 0, true, false);
            this.door = this.world.getTop();
            this.game.physics.arcade.enable(this.door);
            this.door.animations.add('open', [0, 1, 2, 3, 4], 10, false);

            this.setupUI();

            //create main Charecter   
            //    this.mainCharecter = new Player(this.game, 400, 50, this.playerBullets, this.playerRockets, this.fuelBar, this.healthBar);
            //    this.game.add.existing(this.mainCharecter);

            this.myTiles.createFromObjects('Player', 519, 'null', 'null', true, false, this.world, _prefabsPlayerJs2["default"]);
            this.mainCharecter = this.world.getTop();

            this.mainCharecter.bullets = this.playerBullets;
            this.mainCharecter.rockets = this.playerRockets;
            this.mainCharecter.fuelUI = this.fuelBar;
            this.mainCharecter.healthUI = this.healthBar;
            this.mainCharecter.lifeUI = this.lifeText;
            this.lifeText.text = "x " + this.mainCharecter.lives;

            this.game.camera.follow(this.mainCharecter);

            //place enemies
            this.enemies = this.add.group();
            this.myTiles.createFromObjects('Enemies', 623, 'null', 'null', true, false, this.enemies, _prefabsEnemyJs2["default"]);
            this.enemies.setAll('player', this.mainCharecter);
            this.enemies.setAll('bullets', this.enemyBullets);
            this.enemies.setAll('layer', this.mytileslayer);
            this.enemyCount.current = this.enemyCount.total = this.enemies.length;

            this.collectSound = this.add.audio('collect');
            this.jetAudio = this.add.audio('jets');

            this.coins = this.add.group();
            this.coins.enableBody = true;
            this.myTiles.createFromObjects('gems', 681, 'coins', 0, true, false, this.coins);

            //  Add animations to all of the coin sprites

            this.coins.callAll('animations.add', 'animations', 'spin', [0, 1, 2, 3, 4, 5], 10, true);
            this.coins.callAll('animations.play', 'animations', 'spin');

            this.shocks = this.add.group();
            this.shocks.enableBody = true;
            this.myTiles.createFromObjects('Shocks', 712, 'shock', 0, true, false, this.shocks);
            this.shocks.setAll('body.immovable', true);
            this.shocks.callAll('body.setSize', 'body', 128, 10, 0, 59);
            this.shocks.callAll('animations.add', 'animations', 'wiggle', [0, 1, 2, 3], 10, true);
            this.shocks.callAll('animations.play', 'animations', 'wiggle');

            this.vertShocks = this.add.group();
            this.vertShocks.enableBody = true;
            this.myTiles.createFromObjects('Shocks', 705, 'shock', 0, true, false, this.vertShocks);
            this.vertShocks.setAll('body.immovable', true);
            this.vertShocks.callAll('body.setSize', 'body', 10, 128, 59, 0);
            this.vertShocks.callAll('animations.add', 'animations', 'vert_wiggle', [8, 9, 10, 11], 10, true);
            this.vertShocks.callAll('animations.play', 'animations', 'vert_wiggle');

            this.healthPacks = this.add.group();
            this.healthPacks.enableBody = true;
            this.myTiles.createFromObjects('Health', 727, 'health_pack', 0, true, false, this.healthPacks);
            this.healthPacks.setAll('body.immovable', true);
            //        this.healthPacks.callAll('body.setSize', 'body' , 10, 128, 59, 0);

            this.explosions = this.add.group();
        }
    }, {
        key: "update",
        value: function update() {
            this.quadTree.clear();

            for (var i = 0; i < this.enemies.length; i++) {
                this.enemies.getAt(i).enemyUpdate = false;

                this.quadTree.insert(this.enemies.getAt(i));
            }
            //                   
            this.found = this.quadTree.retrieve(this.mainCharecter);
            //       
            for (var i = 0; i < this.found.length; i++) {

                this.found[i].enemyUpdate = true;

                if (this.found[i].destroyEnemy) {
                    this.found[i].destroy();
                }
            }

            this.physics.arcade.overlap(this.mainCharecter, this.healthPacks, this.collectHealth, null, this);
            this.physics.arcade.overlap(this.mainCharecter, this.shocks, this.electrocute, null, this);
            this.physics.arcade.overlap(this.mainCharecter, this.vertShocks, this.electrocute, null, this);
            this.physics.arcade.collide(this.mainCharecter, this.mytileslayer);
            this.physics.arcade.collide(this.enemies, this.mytileslayer);
            this.physics.arcade.overlap(this.mainCharecter, this.coins, this.collect, null, this);

            this.physics.arcade.collide(this.found, this.playerBullets, this.enemyShot, null, this);

            this.physics.arcade.collide(this.mainCharecter, this.enemyBullets, this.playerShot, null, this);
            this.physics.arcade.collide(this.mytileslayer, this.enemyBullets, this.bulletSpark, null, this);
            this.physics.arcade.collide(this.mytileslayer, this.playerBullets, this.playerBulletSpark, null, this);
            this.physics.arcade.collide(this.enemies, this.playerRockets, this.rocketKill, null, this);
            this.physics.arcade.collide(this.mytileslayer, this.playerRockets, this.rocketExplode, null, this);

            this.physics.arcade.overlap(this.mainCharecter, this.door, this.openDoor, null, this);
        }
    }, {
        key: "render",
        value: function render() {

            //        this.game.debug.spriteInfo(this.coinUI, 20, 32);
        }
    }, {
        key: "setupUI",
        value: function setupUI() {

            this.styleUI = {
                font: "40px Arial",
                fill: "#ffffff",
                align: "center",
                stroke: '#000000',
                strokeThickness: 1

            };

            this.UILayer = this.add.group();

            this.healthBar = new _prefabsHealthBarJs2["default"](this.game, 0, 0, "health_bar", "empty_bar");
            this.healthBar.fixedToCamera = true;
            this.healthBar.cameraOffset.setTo(100, 15);
            this.fuelBar = new _prefabsHealthBarJs2["default"](this.game, 0, 0, "jetFuel_bar", "empty_bar");
            this.fuelBar.fixedToCamera = true;
            this.fuelBar.cameraOffset.setTo(100, 35);

            this.playerLifeUI = this.game.add.sprite(0, 0, 'ninja_head');
            this.playerLifeUI.fixedToCamera = true;
            this.playerLifeUI.cameraOffset.setTo(3, 15);
            this.lifeText = this.add.text(0, 0, "x", this.styleUI);
            this.lifeText.fixedToCamera = true;
            this.lifeText.cameraOffset.setTo(55, 30);
            this.lifeText.fontSize = 25;

            this.coinUI = this.game.add.sprite(0, 0, 'coins', 0);
            this.coinUI.scale.setTo(.75);
            this.coinUI.fixedToCamera = true;
            this.coinUI.cameraOffset.setTo(this.game.width - 200, 15);
            this.coinText = this.game.add.text(0, 0, "0", this.styleUI);

            this.coinText.fixedToCamera = true;
            this.coinText.cameraOffset.setTo(this.game.width - 150, 15);

            this.enemyUI = this.game.add.sprite(0, 0, 'enemyUI');
            this.enemyUI.fixedToCamera = true;
            this.enemyUI.cameraOffset.setTo(this.game.width - 205, 55);
            this.enemyText = this.game.add.text(0, 0, "0%", this.styleUI);

            this.enemyText.fixedToCamera = true;
            this.enemyText.cameraOffset.setTo(this.game.width - 150, 55);

            this.UILayer.add(this.enemyUI);
            this.UILayer.add(this.coinUI);
            this.UILayer.add(this.enemyUI);
            this.UILayer.add(this.healthBar);
            this.UILayer.add(this.fuelBar);
        }
    }, {
        key: "enemyShot",
        value: function enemyShot(enemy, bullet) {

            bullet.kill();
            enemy.enemyHealth.current--;

            if (enemy.enemyHealth.current === 0) {

                this.enemyCount.current--;
                this.enemyText.text = ((1 - this.enemyCount.current / this.enemyCount.total) * 100).toFixed(1) + "%";

                var explosion = this.explosions.getFirstDead();
                if (explosion) {
                    explosion.x = enemy.x;
                    explosion.y = enemy.y;
                    explosion.revive();
                } else {
                    explosion = this.game.add.sprite(enemy.x, enemy.y, 'explosion');
                    explosion.anchor.setTo(.5, .5);
                    var exanim = explosion.animations.add('explode', [0, 1, 2, 3, 4, 5, 6], 10, false);
                    exanim.killOnComplete = true;
                }
                exanim.play();
                enemy.destroyEnemy = true;
            } else {

                var emitter = this.game.add.emitter(enemy.x, enemy.y, 100);
                emitter.makeParticles('red_flame');
                emitter.minParticleSpeed.setTo(-100, -100);
                emitter.maxParticleSpeed.setTo(100, 100);
                emitter.gravity = 20;
                emitter.start(true, 500, null, 100);
            }
        }
    }, {
        key: "playerShot",
        value: function playerShot(player, bullet) {

            var emitter = this.game.add.emitter(player.x, player.y, 100);
            emitter.makeParticles('blue_flame');
            emitter.minParticleSpeed.setTo(-100, -100);
            emitter.maxParticleSpeed.setTo(100, 100);
            emitter.gravity = 20;
            emitter.start(true, 500, null, 100);

            bullet.kill();
            this.playerDamaged(player, 1);
        }
    }, {
        key: "collect",
        value: function collect(player, coin) {
            coin.kill();
            this.score++;
            this.coinText.text = this.score;
            this.collectSound.play();
        }
    }, {
        key: "collectHealth",
        value: function collectHealth(player, health) {

            health.kill();

            player.health.current += player.health.max / 2;
            if (player.health.current > player.health.max) {
                player.health.current = player.health.max;
            }
            this.healthBar.setValue(player.health.current / player.health.max);
        }
    }, {
        key: "openDoor",
        value: function openDoor(player, door) {
            if (this.doorIsClosed) {
                door.play('open');
                this.doorIsClosed = false;
            } else if (this.mainCharecter.jump.isDown) {
                player.body.velocity.y = 0;
                if (this.enemyCount.current <= this.enemyCount.total * .75) {
                    this.game.state.start('level2', true, false, this.score);
                } else {
                    this.enemyText.addColor('#FF0000', 0);
                }
            }
        }
    }, {
        key: "electrocute",
        value: function electrocute(player, shocks) {
            if (this.deathDelay < this.game.time.now) {
                this.deathDelay = this.game.time.now + Phaser.Timer.SECOND * .5;

                this.playerDamaged(player, 2);
            }
        }
    }, {
        key: "playerDamaged",
        value: function playerDamaged(player, damage) {
            if (player.health.current > 0) {
                console.log(player.health.current);
                player.health.current -= damage;
                console.log(player.health.current);
                player.flash();
                this.healthBar.setValue(player.health.current / player.health.max);
            } else {
                player.died();
            }
        }
    }, {
        key: "bulletSpark",
        value: function bulletSpark(bullet, layer) {
            var emitter = this.game.add.emitter(bullet.x, bullet.y, 100);
            emitter.makeParticles('blue_flame');
            emitter.minParticleSpeed.setTo(-100, -100);
            emitter.maxParticleSpeed.setTo(100, 100);
            emitter.gravity = 20;
            emitter.start(true, 500, null, 100);

            bullet.kill();
        }
    }, {
        key: "playerBulletSpark",
        value: function playerBulletSpark(bullet, layer) {

            var emitter = this.game.add.emitter(bullet.x, bullet.y, 100);
            emitter.makeParticles('red_flame');
            emitter.minParticleSpeed.setTo(-100, -100);
            emitter.maxParticleSpeed.setTo(100, 100);
            emitter.gravity = 20;
            emitter.start(true, 500, null, 100);

            bullet.kill();
        }
    }, {
        key: "rocketKill",
        value: function rocketKill(enemy, bullet) {

            bullet.kill();
            enemy.enemyHealth.current--;

            this.enemyCount.current--;
            this.enemyText.text = ((1 - this.enemyCount.current / this.enemyCount.total) * 100).toFixed(1) + "%";

            var explosion = this.explosions.getFirstDead();
            if (explosion) {
                explosion.x = enemy.x;
                explosion.y = enemy.y;
                explosion.revive();
            } else {
                explosion = this.game.add.sprite(enemy.x, enemy.y, 'explosion');
                explosion.anchor.setTo(.5, .5);
                var exanim = explosion.animations.add('explode', [0, 1, 2, 3, 4, 5, 6], 10, false);
                exanim.killOnComplete = true;
            }
            exanim.play();
            enemy.destroyEnemy = true;
        }
    }, {
        key: "rocketExplode",
        value: function rocketExplode(rocket, layer) {

            rocket.kill();

            var explosion = this.explosions.getFirstDead();
            if (explosion) {
                explosion.x = rocket.x;
                explosion.y = rocket.y;
                explosion.revive();
            } else {
                explosion = this.game.add.sprite(rocket.x, rocket.y, 'explosion');
                explosion.anchor.setTo(.5, .5);
                var exanim = explosion.animations.add('explode', [0, 1, 2, 3, 4, 5, 6], 10, false);
                exanim.killOnComplete = true;
            }
            exanim.play();
        }
    }]);

    return Level1;
})(Phaser.State);

exports["default"] = Level1;
module.exports = exports["default"];

},{"../prefabs/Enemy.js":2,"../prefabs/HealthBar.js":3,"../prefabs/Player.js":4}],8:[function(require,module,exports){
/* global Phaser */

"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _prefabsPlayerJs = require("../prefabs/Player.js");

var _prefabsPlayerJs2 = _interopRequireDefault(_prefabsPlayerJs);

var _prefabsEnemyJs = require("../prefabs/Enemy.js");

var _prefabsEnemyJs2 = _interopRequireDefault(_prefabsEnemyJs);

var _prefabsHealthBarJs = require("../prefabs/HealthBar.js");

var _prefabsHealthBarJs2 = _interopRequireDefault(_prefabsHealthBarJs);

var Level2 = (function (_Phaser$State) {
    _inherits(Level2, _Phaser$State);

    _createClass(Level2, [{
        key: "init",
        value: function init(score) {

            this.score = score;
        }
    }]);

    function Level2() {
        _classCallCheck(this, Level2);

        _get(Object.getPrototypeOf(Level2.prototype), "constructor", this).call(this);
    }

    _createClass(Level2, [{
        key: "preload",
        value: function preload() {
            this.load.image('tileset', 'assets/img/sci_fi_tiles.png');
            this.load.tilemap('mytilemap', 'assets/tiles/level2.json', null, Phaser.Tilemap.TILED_JSON);
        }
    }, {
        key: "create",
        value: function create() {

            this.game.physics.startSystem(Phaser.Physics.ARCADE);
            this.game.stage.backgroundColor = "#918a87";

            this.doorIsClosed = true;
            this.enemyCount = { current: 0, total: 0 };
            this.deathDelay = 0;

            //create tileset
            this.myTiles = this.game.add.tilemap('mytilemap');
            this.myTiles.addTilesetImage('sci_fi_tiles', 'tileset');
            this.myTiles.setCollisionBetween(0, 500);
            this.mytilebackground = this.myTiles.createLayer('Background');
            this.mytileslayer = this.myTiles.createLayer('World');
            this.mytileslayer.resizeWorld();

            this.quadTree = new Phaser.QuadTree(0, 0, this.game.world.width, this.game.world.height, 4, 4, 0);

            this.playerBullets = this.add.group();
            this.playerBullets.enableBody = true;
            this.playerBullets.physicsBodyType = Phaser.Physics.ARCADE;

            this.playerRockets = this.add.group();
            this.playerRockets.enableBody = true;
            this.playerRockets.physicsBodyType = Phaser.Physics.ARCADE;

            this.enemyBullets = this.add.group();
            this.enemyBullets.enableBody = true;
            this.enemyBullets.physicsBodyType = Phaser.Physics.ARCADE;

            this.setupUI();

            //create door    
            this.myTiles.createFromObjects('Door', 618, 'door', 0, true, false);
            this.door = this.world.getTop();
            this.game.physics.arcade.enable(this.door);
            this.door.animations.add('open', [0, 1, 2, 3, 4], 10, false);

            //create main Charecter   
            //    this.mainCharecter = new Player(this.game, 400, 50, this.playerBullets, this.playerRockets, this.fuelBar, this.healthBar);
            //    this.game.add.existing(this.mainCharecter);

            this.myTiles.createFromObjects('Player', 519, 'null', 'null', true, false, this.world, _prefabsPlayerJs2["default"]);
            this.mainCharecter = this.world.getTop();

            this.mainCharecter.bullets = this.playerBullets;
            this.mainCharecter.rockets = this.playerRockets;
            this.mainCharecter.fuelUI = this.fuelBar;
            this.mainCharecter.healthUI = this.healthBar;
            this.mainCharecter.lifeUI = this.lifeText;
            this.lifeText.text = "x " + this.mainCharecter.lives;

            this.game.camera.follow(this.mainCharecter);

            //place enemies
            this.enemies = this.add.group();
            this.myTiles.createFromObjects('Enemies', 623, 'null', 'null', true, false, this.enemies, _prefabsEnemyJs2["default"]);
            this.enemies.setAll('player', this.mainCharecter);
            this.enemies.setAll('bullets', this.enemyBullets);
            this.enemies.setAll('layer', this.mytileslayer);
            this.enemies.setAll('detectDistance', 900);
            this.enemies.setAll('shotsPerSecond', 1.5);
            this.enemyCount.current = this.enemyCount.total = this.enemies.length;

            console.log(this.enemies);

            this.collectSound = this.add.audio('collect');
            this.jetAudio = this.add.audio('jets');

            this.coins = this.add.group();
            this.coins.enableBody = true;
            this.myTiles.createFromObjects('gems', 681, 'coins', 0, true, false, this.coins);

            //  Add animations to all of the coin sprites

            this.coins.callAll('animations.add', 'animations', 'spin', [0, 1, 2, 3, 4, 5], 10, true);
            this.coins.callAll('animations.play', 'animations', 'spin');

            this.shocks = this.add.group();
            this.shocks.enableBody = true;
            this.myTiles.createFromObjects('Shocks', 712, 'shock', 0, true, false, this.shocks);
            this.shocks.setAll('body.immovable', true);
            this.shocks.callAll('body.setSize', 'body', 128, 10, 0, 59);
            this.shocks.callAll('animations.add', 'animations', 'wiggle', [0, 1, 2, 3], 10, true);
            this.shocks.callAll('animations.play', 'animations', 'wiggle');

            this.vertShocks = this.add.group();
            this.vertShocks.enableBody = true;
            this.myTiles.createFromObjects('Shocks', 705, 'shock', 0, true, false, this.vertShocks);
            this.vertShocks.setAll('body.immovable', true);
            this.vertShocks.callAll('body.setSize', 'body', 10, 128, 59, 0);
            this.vertShocks.callAll('animations.add', 'animations', 'vert_wiggle', [8, 9, 10, 11], 10, true);
            this.vertShocks.callAll('animations.play', 'animations', 'vert_wiggle');

            this.healthPacks = this.add.group();
            this.healthPacks.enableBody = true;
            this.myTiles.createFromObjects('Health', 727, 'health_pack', 0, true, false, this.healthPacks);
            this.healthPacks.setAll('body.immovable', true);
            //        this.healthPacks.callAll('body.setSize', 'body' , 10, 128, 59, 0);

            this.explosions = this.add.group();
        }
    }, {
        key: "update",
        value: function update() {
            this.quadTree.clear();

            for (var i = 0; i < this.enemies.length; i++) {
                this.enemies.getAt(i).enemyUpdate = false;

                this.quadTree.insert(this.enemies.getAt(i));
            }
            //                   
            this.found = this.quadTree.retrieve(this.mainCharecter);
            //       
            for (var i = 0; i < this.found.length; i++) {

                this.found[i].enemyUpdate = true;

                if (this.found[i].destroyEnemy) {
                    this.found[i].destroy();
                }
            }

            this.physics.arcade.overlap(this.mainCharecter, this.healthPacks, this.collectHealth, null, this);
            this.physics.arcade.overlap(this.mainCharecter, this.shocks, this.electrocute, null, this);
            this.physics.arcade.overlap(this.mainCharecter, this.vertShocks, this.electrocute, null, this);
            this.physics.arcade.collide(this.mainCharecter, this.mytileslayer);
            this.physics.arcade.collide(this.enemies, this.mytileslayer);
            this.physics.arcade.overlap(this.mainCharecter, this.coins, this.collect, null, this);

            this.physics.arcade.collide(this.found, this.playerBullets, this.enemyShot, null, this);

            this.physics.arcade.collide(this.mainCharecter, this.enemyBullets, this.playerShot, null, this);
            this.physics.arcade.collide(this.mytileslayer, this.enemyBullets, this.bulletSpark, null, this);
            this.physics.arcade.collide(this.mytileslayer, this.playerBullets, this.playerBulletSpark, null, this);
            this.physics.arcade.collide(this.enemies, this.playerRockets, this.rocketKill, null, this);
            this.physics.arcade.collide(this.mytileslayer, this.playerRockets, this.rocketExplode, null, this);

            this.physics.arcade.overlap(this.mainCharecter, this.door, this.openDoor, null, this);
        }
    }, {
        key: "render",
        value: function render() {

            //        this.game.debug.spriteInfo(this.coinUI, 20, 32);
        }
    }, {
        key: "setupUI",
        value: function setupUI() {

            this.styleUI = {
                font: "40px Arial",
                fill: "#ffffff",
                align: "center",
                stroke: '#000000',
                strokeThickness: 1

            };

            this.UILayer = this.add.group();

            this.healthBar = new _prefabsHealthBarJs2["default"](this.game, 0, 0, "health_bar", "empty_bar");
            this.healthBar.fixedToCamera = true;
            this.healthBar.cameraOffset.setTo(100, 15);
            this.fuelBar = new _prefabsHealthBarJs2["default"](this.game, 0, 0, "jetFuel_bar", "empty_bar");
            this.fuelBar.fixedToCamera = true;
            this.fuelBar.cameraOffset.setTo(100, 35);

            this.playerLifeUI = this.game.add.sprite(0, 0, 'ninja_head');
            this.playerLifeUI.fixedToCamera = true;
            this.playerLifeUI.cameraOffset.setTo(3, 15);
            this.lifeText = this.add.text(0, 0, "x", this.styleUI);
            this.lifeText.fixedToCamera = true;
            this.lifeText.cameraOffset.setTo(55, 30);
            this.lifeText.fontSize = 25;

            this.coinUI = this.game.add.sprite(0, 0, 'coins', 0);
            this.coinUI.scale.setTo(.75);
            this.coinUI.fixedToCamera = true;
            this.coinUI.cameraOffset.setTo(this.game.width - 200, 15);
            this.coinText = this.game.add.text(0, 0, "0", this.styleUI);

            this.coinText.fixedToCamera = true;
            this.coinText.cameraOffset.setTo(this.game.width - 150, 15);
            this.coinText.text = this.score;

            this.enemyUI = this.game.add.sprite(0, 0, 'enemyUI');
            this.enemyUI.fixedToCamera = true;
            this.enemyUI.cameraOffset.setTo(this.game.width - 205, 55);
            this.enemyText = this.game.add.text(0, 0, "0%", this.styleUI);

            this.enemyText.fixedToCamera = true;
            this.enemyText.cameraOffset.setTo(this.game.width - 150, 55);

            this.UILayer.add(this.enemyUI);
            this.UILayer.add(this.coinUI);
            this.UILayer.add(this.enemyUI);
            this.UILayer.add(this.healthBar);
            this.UILayer.add(this.fuelBar);
        }
    }, {
        key: "enemyShot",
        value: function enemyShot(enemy, bullet) {

            bullet.kill();
            enemy.enemyHealth.current--;

            if (enemy.enemyHealth.current === 0) {

                this.enemyCount.current--;
                this.enemyText.text = ((1 - this.enemyCount.current / this.enemyCount.total) * 100).toFixed(1) + "%";

                var explosion = this.explosions.getFirstDead();
                if (explosion) {
                    explosion.x = enemy.x;
                    explosion.y = enemy.y;
                    explosion.revive();
                } else {
                    explosion = this.game.add.sprite(enemy.x, enemy.y, 'explosion');
                    explosion.anchor.setTo(.5, .5);
                    var exanim = explosion.animations.add('explode', [0, 1, 2, 3, 4, 5, 6], 10, false);
                    exanim.killOnComplete = true;
                }
                exanim.play();
                enemy.destroyEnemy = true;
            } else {

                var emitter = this.game.add.emitter(enemy.x, enemy.y, 100);
                emitter.makeParticles('red_flame');
                emitter.minParticleSpeed.setTo(-100, -100);
                emitter.maxParticleSpeed.setTo(100, 100);
                emitter.gravity = 20;
                emitter.start(true, 500, null, 100);
            }
        }
    }, {
        key: "playerShot",
        value: function playerShot(player, bullet) {

            var emitter = this.game.add.emitter(player.x, player.y, 100);
            emitter.makeParticles('blue_flame');
            emitter.minParticleSpeed.setTo(-100, -100);
            emitter.maxParticleSpeed.setTo(100, 100);
            emitter.gravity = 20;
            emitter.start(true, 500, null, 100);

            bullet.kill();
            this.playerDamaged(player, 1);
        }
    }, {
        key: "collect",
        value: function collect(player, coin) {
            coin.kill();
            this.score++;
            this.coinText.text = this.score;
            this.collectSound.play();
        }
    }, {
        key: "collectHealth",
        value: function collectHealth(player, health) {

            health.kill();

            player.health.current += player.health.max / 2;
            if (player.health.current > player.health.max) {
                player.health.current = player.health.max;
            }
            this.healthBar.setValue(player.health.current / player.health.max);
        }
    }, {
        key: "openDoor",
        value: function openDoor(player, door) {
            if (this.doorIsClosed) {
                door.play('open');
                this.doorIsClosed = false;
            } else if (this.mainCharecter.jump.isDown) {
                player.body.velocity.y = 0;
                if (this.enemyCount.current <= this.enemyCount.total * .75) {
                    this.game.state.start('menu', true, false);
                } else {
                    this.enemyText.addColor('#FF0000', 0);
                }
            }
        }
    }, {
        key: "electrocute",
        value: function electrocute(player, shocks) {
            if (this.deathDelay < this.game.time.now) {
                this.deathDelay = this.game.time.now + Phaser.Timer.SECOND * .5;

                this.playerDamaged(player, 3);
            }
        }
    }, {
        key: "playerDamaged",
        value: function playerDamaged(player, damage) {
            if (player.health.current > 0) {
                player.health.current -= damage;
                player.flash();
                this.healthBar.setValue(player.health.current / player.health.max);
            } else {
                player.died();
            }
        }
    }, {
        key: "bulletSpark",
        value: function bulletSpark(bullet, layer) {
            var emitter = this.game.add.emitter(bullet.x, bullet.y, 100);
            emitter.makeParticles('blue_flame');
            emitter.minParticleSpeed.setTo(-100, -100);
            emitter.maxParticleSpeed.setTo(100, 100);
            emitter.gravity = 20;
            emitter.start(true, 500, null, 100);

            bullet.kill();
        }
    }, {
        key: "playerBulletSpark",
        value: function playerBulletSpark(bullet, layer) {

            var emitter = this.game.add.emitter(bullet.x, bullet.y, 100);
            emitter.makeParticles('red_flame');
            emitter.minParticleSpeed.setTo(-100, -100);
            emitter.maxParticleSpeed.setTo(100, 100);
            emitter.gravity = 20;
            emitter.start(true, 500, null, 100);

            bullet.kill();
        }
    }, {
        key: "rocketKill",
        value: function rocketKill(enemy, bullet) {

            bullet.kill();
            enemy.enemyHealth.current--;

            enemy.destroy();
            this.enemyCount.current--;
            this.enemyText.text = ((1 - this.enemyCount.current / this.enemyCount.total) * 100).toFixed(1) + "%";

            var explosion = this.explosions.getFirstDead();
            if (explosion) {
                explosion.x = enemy.x;
                explosion.y = enemy.y;
                explosion.revive();
            } else {
                explosion = this.game.add.sprite(enemy.x, enemy.y, 'explosion');
                explosion.anchor.setTo(.5, .5);
                var exanim = explosion.animations.add('explode', [0, 1, 2, 3, 4, 5, 6], 10, false);
                exanim.killOnComplete = true;
            }
            exanim.play();
        }
    }, {
        key: "rocketExplode",
        value: function rocketExplode(rocket, layer) {

            rocket.kill();

            var explosion = this.explosions.getFirstDead();
            if (explosion) {
                explosion.x = rocket.x;
                explosion.y = rocket.y;
                explosion.revive();
            } else {
                explosion = this.game.add.sprite(rocket.x, rocket.y, 'explosion');
                explosion.anchor.setTo(.5, .5);
                var exanim = explosion.animations.add('explode', [0, 1, 2, 3, 4, 5, 6], 10, false);
                exanim.killOnComplete = true;
            }
            exanim.play();
        }
    }]);

    return Level2;
})(Phaser.State);

exports["default"] = Level2;
module.exports = exports["default"];

},{"../prefabs/Enemy.js":2,"../prefabs/HealthBar.js":3,"../prefabs/Player.js":4}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Menu = (function (_Phaser$State) {
    _inherits(Menu, _Phaser$State);

    function Menu() {
        _classCallCheck(this, Menu);

        _get(Object.getPrototypeOf(Menu.prototype), 'constructor', this).apply(this, arguments);
    }

    _createClass(Menu, [{
        key: 'preload',
        value: function preload() {

            this.load.image('menu_background', 'assets/img/menu_background.jpg');
        }
    }, {
        key: 'create',
        value: function create() {

            var controls = ['LEFT: ', 'RIGHT: ', 'JUMP": ', 'SHOOT: ', 'JETPACK: ', 'FLY UP: ', 'FLY DOWN: '];
            var keyboard = ['A', 'D', 'W', 'ENTER', 'SHIFT', 'W', 'S'];

            var yCoord = 200;
            var textSpacing = 50;

            var style = {
                font: "60px Arial",
                fill: '#ffffff',
                align: "center",
                stroke: '#000000',
                strokeThickness: 2
            };

            this.startGame = this.game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
            this.add.sprite(0, 0, 'menu_background');

            var title = this.addText(this.game.width / 2, 100, 60, "Cyborg Ninja", style);
            title.anchor.setTo(.5, 0);
            var textAlign = this.game.width / 2 - title.width / 2;
            var subtitle = this.addText(textAlign, 200, 40, "Controls", style);

            var ySpacing = subtitle.y + 50;

            yCoord += 25;

            for (var i = 0; i < controls.length; i++) {

                this.addText(textAlign, ySpacing, 20, controls[i], style);
                this.addText(textAlign + 200, ySpacing, 20, keyboard[i], style);
                ySpacing += 30;
            }

            this.addText(textAlign, this.game.height - 200, 40, "Press Enter to Play!", style);

            var sprite = this.game.add.sprite(this.game.width - 300, this.game.height - 300, 'ninja');
            sprite.scale.setTo(2);
            sprite.animations.add('run', [56, 57, 58, 59, 60, 61, 62, 63, 64, 65], 15, true);
            sprite.play('run');
        }
    }, {
        key: 'update',
        value: function update() {

            if (this.startGame.isDown) {

                this.game.state.start('level1', true, false, 20);
            }
        }
    }, {
        key: 'addText',
        value: function addText(x, y, textSize, message, style) {

            var text = this.game.add.text(x, y, message, style);
            text.setShadow(5, 5, 'rgba(0,0,0,0.5)', 5);
            var grd = text.context.createLinearGradient(0, 0, 0, 74);
            grd.addColorStop(0, '#8ED6FF');
            grd.addColorStop(1, '#004CB3');
            text.fill = grd;
            text.fontSize = textSize;

            return text;
        }
    }]);

    return Menu;
})(Phaser.State);

exports['default'] = Menu;
module.exports = exports['default'];

},{}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Preload = (function () {
    function Preload() {
        _classCallCheck(this, Preload);

        this.asset = null;
        this.ready = false;
    }

    _createClass(Preload, [{
        key: 'preload',
        value: function preload() {
            this.load.image('loading_bg', 'assets/img/loading_bg.jpg');
        }
    }, {
        key: 'create',
        value: function create() {
            this.add.sprite(0, 0, "loading_bg");
            this.asset = this.add.sprite(this.game.width / 2, this.game.height / 2, "preloader");
            this.asset.anchor.setTo(0.5, 0.5);
            this.load.onLoadStart.add(this.onLoadStart, this);
            this.load.onLoadComplete.add(this.onLoadComplete, this);
            this.load.setPreloadSprite(this.asset);

            this.load.start();
        }
    }, {
        key: 'update',
        value: function update() {

            if (this.ready) {

                this.game.state.start('menu');
            }
        }
    }, {
        key: 'onLoadStart',
        value: function onLoadStart() {
            //load your assets here
            this.load.spritesheet('ninja', 'assets/img/ninja2.png', 90, 90);
            this.load.image('ninja_head', 'assets/img/ninja_head.png');
            this.load.spritesheet('coins', 'assets/img/coins.png', 40, 39);
            this.load.spritesheet('robot_run', 'assets/img/robot_run.png', 92, 90);
            this.load.spritesheet('door', 'assets/img/door.png', 100, 100);
            this.load.spritesheet('rocket', 'assets/img/rocket.png', 30, 12);
            this.load.spritesheet('shock', 'assets/img/shock.png', 128, 128);
            this.load.spritesheet('explosion', 'assets/img/explosion.png', 100, 105);
            this.load.image('bullet', 'assets/img/Bullet01.png');
            this.load.image('health_pack', 'assets/img/health_potion.png');
            this.load.image('blue_flame', 'assets/img/blue_flame.png');
            this.load.image('red_flame', 'assets/img/red_flame.png');
            this.load.image('enemy_bullet', 'assets/img/enemy_bullet.png');
            this.load.image('enemy_shoot', 'assets/img/robot_place.png');
            this.load.image('body', 'assets/img/robot_body.png');
            this.load.image('arm', 'assets/img/robot_arm.png');
            this.load.image('empty_bar', 'assets/img/EmptyBar.png');
            this.load.image('health_bar', 'assets/img/RedBar.png');
            this.load.image('jetFuel_bar', 'assets/img/GreenBar.png');
            this.load.image('enemyUI', 'assets/img/EnemyHead.png');
            this.load.audio('collect', 'assets/audio/UI_Electric_08.mp3');
            this.load.audio('jets', 'assets/audio/jet_sound.mp3');
        }
    }, {
        key: 'onLoadComplete',
        value: function onLoadComplete() {
            this.ready = true;
        }
    }]);

    return Preload;
})();

exports['default'] = Preload;
module.exports = exports['default'];

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvaG9tZS91YnVudHUvd29ya3NwYWNlL0N5Ym9yZ05pbmphLXZlcjEuMy9zcmMvYXBwLmpzIiwiL2hvbWUvdWJ1bnR1L3dvcmtzcGFjZS9DeWJvcmdOaW5qYS12ZXIxLjMvc3JjL3ByZWZhYnMvRW5lbXkuanMiLCIvaG9tZS91YnVudHUvd29ya3NwYWNlL0N5Ym9yZ05pbmphLXZlcjEuMy9zcmMvcHJlZmFicy9IZWFsdGhCYXIuanMiLCIvaG9tZS91YnVudHUvd29ya3NwYWNlL0N5Ym9yZ05pbmphLXZlcjEuMy9zcmMvcHJlZmFicy9QbGF5ZXIuanMiLCIvaG9tZS91YnVudHUvd29ya3NwYWNlL0N5Ym9yZ05pbmphLXZlcjEuMy9zcmMvc3RhdGVzL0Jvb3QuanMiLCIvaG9tZS91YnVudHUvd29ya3NwYWNlL0N5Ym9yZ05pbmphLXZlcjEuMy9zcmMvc3RhdGVzL0dhbWVPdmVyLmpzIiwiL2hvbWUvdWJ1bnR1L3dvcmtzcGFjZS9DeWJvcmdOaW5qYS12ZXIxLjMvc3JjL3N0YXRlcy9MZXZlbDEuanMiLCIvaG9tZS91YnVudHUvd29ya3NwYWNlL0N5Ym9yZ05pbmphLXZlcjEuMy9zcmMvc3RhdGVzL0xldmVsMi5qcyIsIi9ob21lL3VidW50dS93b3Jrc3BhY2UvQ3lib3JnTmluamEtdmVyMS4zL3NyYy9zdGF0ZXMvTWVudS5qcyIsIi9ob21lL3VidW50dS93b3Jrc3BhY2UvQ3lib3JnTmluamEtdmVyMS4zL3NyYy9zdGF0ZXMvUHJlbG9hZC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7OzRCQ0dpQixrQkFBa0I7Ozs7K0JBQ2YscUJBQXFCOzs7OzRCQUN4QixrQkFBa0I7Ozs7OEJBQ2hCLG9CQUFvQjs7Ozs4QkFDcEIsb0JBQW9COzs7O2dDQUNsQixzQkFBc0I7Ozs7QUFQM0MsSUFBSSxJQUFJLENBQUM7O0FBU1QsTUFBTSxDQUFDLE1BQU0sR0FBRyxZQUFZO0FBQ3hC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SSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0FBQzFCLFlBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsRUFBQyxFQUFFLEVBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7O0FBRWpDLFlBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQzNELFlBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUM7QUFDN0YsWUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQ3hELFlBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDbkcsWUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsU0FBUyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FBQztBQUMxRSxZQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFDLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztBQUNoRSxZQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQ3ZFLFlBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFDLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztBQUMvRSxZQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLGNBQWMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFDLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztBQUN2RyxZQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBQyxFQUFFLEVBQUMsRUFBRSxFQUFDLEVBQUUsRUFBQyxFQUFFLENBQUMsRUFBQyxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7QUFDeEUsWUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxVQUFVLEVBQUUsQ0FBQyxFQUFFLEVBQUMsRUFBRSxDQUFDLEVBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDO0FBQ3JFLFlBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLFNBQVMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQ2xFLFlBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLFVBQVUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQ25FLFlBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLGNBQWMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBQyxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7QUFDcEUsWUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsV0FBVyxFQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxFQUFDLEVBQUUsRUFBQyxLQUFLLENBQUMsQ0FBQztBQUNsRSxZQUFJLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQzs7O0FBR3pDLFlBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUM5QyxFQUFFLENBQUUsRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLE1BQU0sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUMvQyxFQUFFLENBQUUsRUFBRSxLQUFLLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLE1BQU0sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUNoRCxFQUFFLENBQUUsRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFFLEVBQUUsR0FBRyxFQUFFLE1BQU0sQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDOzs7QUFHakQsWUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNuRSxZQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3BFLFlBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDL0QsWUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNuRSxZQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO0FBQzFELFlBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUNu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QUMsU0FBUyxFQUFDLDBCQUEwQixDQUFDLENBQUM7QUFDdEQsZ0JBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsRUFBQyxpQ0FBaUMsQ0FBQyxDQUFDO0FBQzdELGdCQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUMsNEJBQTRCLENBQUMsQ0FBQztTQUM1RDs7O2VBRWEsMEJBQUc7QUFDYixnQkFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7U0FDckI7OztXQTFEZ0IsT0FBTzs7O3FCQUFQLE9BQU8iLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCIvKmdsb2JhbCBQaGFzZXIqL1xudmFyIGdhbWU7XG5cbmltcG9ydCBCb290IGZyb20gXCIuL3N0YXRlcy9Cb290LmpzXCI7XG5pbXBvcnQgUHJlbG9hZCBmcm9tIFwiLi9zdGF0ZXMvUHJlbG9hZC5qc1wiO1xuaW1wb3J0IE1lbnUgZnJvbSBcIi4vc3RhdGVzL01lbnUuanNcIjtcbmltcG9ydCBMZXZlbDEgZnJvbSBcIi4vc3RhdGVzL0xldmVsMS5qc1wiO1xuaW1wb3J0IExldmVsMiBmcm9tIFwiLi9zdGF0ZXMvTGV2ZWwyLmpzXCI7XG5pbXBvcnQgR2FtZU92ZXIgZnJvbSBcIi4vc3RhdGVzL0dhbWVPdmVyLmpzXCI7XG5cbndpbmRvdy5vbmxvYWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgZ2FtZSA9IG5ldyBQaGFzZXIuR2FtZSgxMjAwLCA4MDApO1xuICAgIGdhbWUuc3RhdGUuYWRkKCdib290JywgQm9vdCk7XG4gICAgZ2FtZS5zdGF0ZS5hZGQoJ3ByZWxvYWQnLCBQcmVsb2FkKTtcbiAgICBnYW1lLnN0YXRlLmFkZCgnbWVudScsIE1lbnUpO1xuICAgIGdhbWUuc3RhdGUuYWRkKCdsZXZlbDEnLCBMZXZlbDEpO1xuICAgIGdhbWUuc3RhdGUuYWRkKCdsZXZlbDInLCBMZXZlbDIpO1xuICAgIGdhbWUuc3RhdGUuYWRkKCdnYW1lX292ZXInLCBHYW1lT3Zlcik7XG4gICAgZ2FtZS5zdGF0ZS5zdGFydCgnYm9vdCcpO1xuICAgIFxufTsiLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBFbmVteSBleHRlbmRzIFBoYXNlci5TcHJpdGUge1xyXG4gICAgXHJcbiAgICBjb25zdHJ1Y3RvcihnYW1lLCB4LCB5LCBidWxsZXRzLCBwbGF5ZXIsIGxheWVyKSB7XHJcbiAgICAgICAgc3VwZXIoZ2FtZSwgeCwgeSwgJ2VuZW15X3Nob290JywgMCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5wbGF5ZXIgPSBwbGF5ZXI7IFxyXG4gICAgICAgIHRoaXMuYnVsbGV0cyA9IGJ1bGxldHM7XHJcbiAgICAgICAgdGhpcy5nYW1lLnBoeXNpY3MuZW5hYmxlKHRoaXMsIFBoYXNlci5QaHlzaWNzLkFSQ0FERSk7XHJcbiAgICAgICAgdGhpcy5ib2R5LmdyYXZpdHkueSA9IDcwMDtcclxuICAgICAgICB0aGlzLmJvZHkuaW1tb3ZhYmxlID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLmlzV2Fsa2luZyA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuZW5lbXlfbmV4dFNob3QgPSAwO1xyXG4gICAgICAgIHRoaXMubGVmdEJvdW5kZXJ5ID0geCAtIDEwMDtcclxuICAgICAgICB0aGlzLnJpZ2h0Qm91bmRlcnkgPSB4ICsgMTAwO1xyXG4gICAgICAgIFxyXG4gICAgICAgIFxyXG4gICAgICAgICAgdGhpcy5saW5lID0gbmV3IFBoYXNlci5MaW5lKCk7XHJcbiAgICAgICAgICB0aGlzLnRpbGVzSGl0ID0gW107XHJcbiAgICAgICAgICB0aGlzLmxheWVyID0gbGF5ZXI7XHJcbiAgICAgICAgdGhpcy5lbmVteVVwZGF0ZSA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuZGVzdHJveUVuZW15ID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5kZXRlY3REaXN0YW5jZSA9IDYwMDtcclxuICAgICAgICB0aGlzLnNob3RzUGVyU2Vjb25kID0gMTtcclxuICAgICAgICBcclxuICAgICBcclxuICAgICAgICBcclxuICAgICAgICAgIHRoaXMuYXJtID0gdGhpcy5hZGRDaGlsZChuZXcgUGhhc2VyLlNwcml0ZShnYW1lLCAwLDAsJ2FybScpKTtcclxuICAgICAgICAgIHRoaXMudG9yc28gPSB0aGlzLmFkZENoaWxkKG5ldyBQaGFzZXIuU3ByaXRlKGdhbWUsIDAsMCwnYm9keScpKTtcclxuICAgICAgICAgIHRoaXMucm9ib3RSdW4gPSB0aGlzLmFkZENoaWxkKG5ldyBQaGFzZXIuU3ByaXRlKGdhbWUsIDAsMCwncm9ib3RfcnVuJykpO1xyXG4gICAgICAgIFxyXG4gICAgICAgICAgdGhpcy5hbmNob3Iuc2V0VG8oLjUsLjUpO1xyXG4gICAgICAgICAgdGhpcy5hcm0uYW5jaG9yLnNldFRvKDAsLjUpO1xyXG4gICAgICAgICAgdGhpcy50b3Jzby5hbmNob3Iuc2V0VG8oLjUsLjUpO1xyXG4gICAgICAgICAgdGhpcy5yb2JvdFJ1bi5hbmNob3Iuc2V0VG8oLjUsLjUpO1xyXG4gICAgICAgICAgdGhpcy5hcm0udmlzaWJsZSA9IGZhbHNlO1xyXG4gICAgICAgICAgdGhpcy50b3Jzby52aXNpYmxlID0gZmFsc2U7XHJcbiAgICAgICAgICB0aGlzLnNjYWxlLnggPSAtMTtcclxuICAgICAgICBcclxuICAgICAgICAgXHJcbiAgICAgICAgdGhpcy5yb2JvdFJ1bi5hbmltYXRpb25zLmFkZCgncnVuJyxbMCwxLDIsMyw0LDUsNl0sIDUsIHRydWUpO1xyXG4gICAgICAgIHRoaXMucm9ib3RSdW4ucGxheSgncnVuJyk7XHJcblxyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMuZW5lbXlIZWFsdGggPSB7Y3VycmVudDogMywgbWF4OiAzIH07XHJcbiAgICAgIFxyXG4gICAgICAgIFxyXG4gICAgfVxyXG4gICAgXHJcbiAgICBcclxuICAgIFxyXG4gdXBkYXRlKCl7XHJcbiAgICAgXHJcbiAgICAgXHJcblxyXG4gICAgICAgICAgICBpZih0aGlzLmVuZW15VXBkYXRlKXtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICBpZigoUGhhc2VyLk1hdGguZGlzdGFuY2UodGhpcy5wbGF5ZXIueCx0aGlzLnBsYXllci55LHRoaXMueCx0aGlzLnkpIDwgdGhpcy5kZXRlY3REaXN0YW5jZSkgICYmICAoKCh0aGlzLnNjYWxlLnggIDwgIDApICAmJiAgKCh0aGlzLnggLSB0aGlzLnBsYXllci54KT4wKSApIHx8ICgodGhpcy5zY2FsZS54ICA+ICAwKSAgJiYgICgodGhpcy54IC0gdGhpcy5wbGF5ZXIueCkgPCAwKSApICkpe1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgdGhpcy5saW5lLnN0YXJ0LnNldCh0aGlzLnBsYXllci54LCB0aGlzLnBsYXllci55KTtcclxuICAgICAgICAgICB0aGlzLmxpbmUuZW5kLnNldCh0aGlzLngsIHRoaXMueSk7XHJcbiAgICAgICAgICAgdGhpcy50aWxlc0hpdCA9IHRoaXMubGF5ZXIuZ2V0UmF5Q2FzdFRpbGVzKHRoaXMubGluZSwgNCwgZmFsc2UsIHRydWUpO1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICBpZih0aGlzLnRpbGVzSGl0Lmxlbmd0aCA9PSAwKXtcclxuICAgICAgICAgICAgICAgICAgICBpZih0aGlzLmlzV2Fsa2luZyl7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmJvZHkudmVsb2NpdHkueCA9IDA7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNoaWxkcmVuWzJdLnZpc2libGUgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIHRoaXMuY2hpbGRyZW5bMF0udmlzaWJsZSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNoaWxkcmVuWzFdLnZpc2libGUgPSB0cnVlOyBcclxuICAgICAgICAgICAgICAgIHRoaXMuaXNXYWxraW5nID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIHRoaXMuZW5lbXlTaG9vdHMoKTtcclxuICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAgICAgdGhpcy53YWxrKCk7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgICAgICAgICAgdGhpcy53YWxrKCk7IFxyXG4gICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIH1lbHNle1xyXG4vLyAgICAgICAgICAgICAgICB0aGlzLmlkbGVBbmltLnBsYXkoKTtcclxuICAgICAgICAgICAgICAgdGhpcy5ib2R5LnZlbG9jaXR5LnggPSAwO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5pc1dhbGtpbmcgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgXHJcbiAgICAgXHJcbiAgICAgXHJcbiAgICAgXHJcbiBcclxuIH1cclxuICAgIFxyXG4gICAgd2Fsaygpe1xyXG4gICAgICAgIFxyXG4gICAgICAgICAgICBpZighdGhpcy5pc1dhbGtpbmcpe1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jaGlsZHJlblsyXS52aXNpYmxlID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIHRoaXMuY2hpbGRyZW5bMF0udmlzaWJsZSA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jaGlsZHJlblsxXS52aXNpYmxlID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pc1dhbGtpbmcgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIGlmKHRoaXMucGxheWVyLnggPiB0aGlzLngpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgdGhpcy5ib2R5LnZlbG9jaXR5LnggPSAxMDA7IFxyXG4gICAgICAgICAgICAgICAgICAgICAgdGhpcy5zY2FsZS54ID0gMTsgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmJvZHkudmVsb2NpdHkueCA9IC0xMDA7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2NhbGUueCA9IC0xO1xyXG4gICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgaWYodGhpcy54IDwgdGhpcy5sZWZ0Qm91bmRlcnkpe1xyXG4gICAgICAgICAgICAgICAgICAgdGhpcy5ib2R5LnZlbG9jaXR5LnggPSA1MDsgXHJcbiAgICAgICAgICAgICAgICAgICB0aGlzLnNjYWxlLnggPSAxOyAgICBcclxuICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICB9ZWxzZSBpZiggdGhpcy54ID4gdGhpcy5yaWdodEJvdW5kZXJ5KXtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmJvZHkudmVsb2NpdHkueCA9IC01MDtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNjYWxlLnggPSAtMTtcclxuICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgXHJcbiAgICBlbmVteVNob290cygpe1xyXG4gICAgICAgIFxyXG4gICAgICAgICBcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgdmFyIGRpciA9ICh0aGlzLnNjYWxlLnggPiAwKSA/IDEgOiAtMTtcclxuICAgICAgICAgICAgICAgICAgIHRoaXMuY2hpbGRyZW5bMF0ucm90YXRpb24gPSAgZGlyICogKE1hdGguYXRhbigodGhpcy55IC0gdGhpcy5wbGF5ZXIueSkvKHRoaXMueCAtIHRoaXMucGxheWVyLngpKSk7XHJcbiAgICAgICAgICAgICAgICAgICB2YXIgcCA9IG5ldyBQaGFzZXIuUG9pbnQodGhpcy54LCB0aGlzLnkpOyBcclxuICAgICAgICAgICAgICAgICAgIHAucm90YXRlKHAueCwgcC55LCAodGhpcy5jaGlsZHJlblswXS5yb3RhdGlvbiAtIC4wNSkqIGRpciwgZmFsc2UsICh0aGlzLnNjYWxlLnggPiAwKSA/IDI1IDogLTUwKTtcclxuICAgICAgICBcclxuICAgICAgICAgICAgICAgIGlmKHRoaXMuZ2FtZS50aW1lLm5vdyA+IHRoaXMuZW5lbXlfbmV4dFNob3Qpe1xyXG4gICAgICAgICAgICAgICAgdGhpcy5lbmVteV9uZXh0U2hvdCA9IHRoaXMuZ2FtZS50aW1lLm5vdyArIChQaGFzZXIuVGltZXIuU0VDT05EICogKDEvIHRoaXMuc2hvdHNQZXJTZWNvbmQpKTtcclxuICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIHZhciBidWxsZXQgPSB0aGlzLmJ1bGxldHMuZ2V0Rmlyc3REZWFkKCk7XHJcbiAgICAgICAgICAgICAgICAgaWYoYnVsbGV0KXtcclxuICAgICAgICAgICAgICAgICAgYnVsbGV0LnggPSBwLng7XHJcbiAgICAgICAgICAgICAgICAgIGJ1bGxldC55ID0gcC55O1xyXG4gICAgICAgICAgICAgICAgICBidWxsZXQucmV2aXZlKCk7XHJcbiAgICAgICAgICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgICAgICBidWxsZXQgPSB0aGlzLmJ1bGxldHMuY3JlYXRlKHAueCxwLnksJ2VuZW15X2J1bGxldCcpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5nYW1lLnBoeXNpY3MuYXJjYWRlLmVuYWJsZShidWxsZXQpOyAgIFxyXG4gICAgICAgICAgICAgICAgYnVsbGV0Lm91dE9mQm91bmRzS2lsbCA9IHRydWU7XHJcblx0ICAgIFx0XHRidWxsZXQuY2hlY2tXb3JsZEJvdW5kcyA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgYnVsbGV0LmFuZ2xlID0gdGhpcy5jaGlsZHJlblswXS5hbmdsZSAqIGRpcjtcclxuICAgICAgICAgICAgICAgIHRoaXMuZ2FtZS5waHlzaWNzLmFyY2FkZS52ZWxvY2l0eUZyb21Sb3RhdGlvbigodGhpcy5jaGlsZHJlblswXS5yb3RhdGlvbiAqIGRpciksICg3MDAgKiBkaXIpLCBidWxsZXQuYm9keS52ZWxvY2l0eSk7XHJcbiAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICB9XHJcblxyXG59IiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgSGVhbHRoQmFyIGV4dGVuZHMgUGhhc2VyLkdyb3VwIHtcclxuICAgIFxyXG4gICAgY29uc3RydWN0b3IoZ2FtZSwgeHBvcywgeXBvcywgYmFyR3JhcGhpYywgaG9sZGVyR3JhcGhpYyApe1xyXG4gICAgICAgIHN1cGVyKGdhbWUpO1xyXG4gICAgICAgIHRoaXMueD0geHBvcztcclxuICAgICAgICB0aGlzLnkgPSB5cG9zO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMuYmFyID0gdGhpcy5jcmVhdGUoMCwwLCBiYXJHcmFwaGljKTtcclxuICAgICAgICB0aGlzLmhvbGRlciA9IHRoaXMuY3JlYXRlKDAsMCwgaG9sZGVyR3JhcGhpYyk7XHJcbiAgICAgICAgXHJcbiAgICB9XHJcbiAgICBcclxuICAgIHNldFZhbHVlKCB2YWwgKXtcclxuIFxyXG4gICAgICAgIGlmKHRoaXMudHdlZW4pIHRoaXMudHdlZW4uc3RvcCgpO1xyXG4gICAgICAgIHRoaXMudHdlZW4gPSB0aGlzLmdhbWUuYWRkLnR3ZWVuKCB0aGlzLmJhci5zY2FsZSk7XHJcbiAgICAgICAgdGhpcy50d2Vlbi50byh7IHg6IHZhbCB9LCAzNTApO1xyXG4gICAgICAgIHRoaXMudHdlZW4uc3RhcnQoKTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgXHJcbn0iLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBQbGF5ZXIgZXh0ZW5kcyBQaGFzZXIuU3ByaXRlIHtcclxuICAgIFxyXG4gICAgY29uc3RydWN0b3IoZ2FtZSwgeCwgeSwgYnVsbGV0cywgcm9ja2V0cywgZnVlbFVJLCBoZWFsdGhVSSwgbGlmZVVJICkge1xyXG4gICAgICAgIHN1cGVyKGdhbWUsIHgsIHksICduaW5qYScsIDApO1xyXG4gICAgICAgIHRoaXMuamV0cGFja1NwZWVkID0gNTA7XHJcbiAgICAgICAgdGhpcy5oZXJvZmx5aW5nID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5maXJzdEFuaW1hdGlvbiA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5mbGlnaHRTZXF1ZW5jZUluaXQgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLm5vU2hvdEFuaW0gPSB0cnVlO1xyXG4gICAgICAgIHRoaXMuc2hvdFNwZWVkID0gMTUwMDtcclxuICAgICAgICB0aGlzLmJ1bGxldHMgPSBidWxsZXRzO1xyXG4gICAgICAgIHRoaXMucm9ja2V0cyA9IHJvY2tldHM7XHJcbiAgICAgICAgdGhpcy5mdWVsVUkgPSBmdWVsVUk7XHJcbiAgICAgICAgdGhpcy5oZWFsdGhVSSA9IGhlYWx0aFVJO1xyXG4gICAgICAgIHRoaXMuc2hvdEludGVydmFsID0gLjU7XHJcbiAgICAgICAgdGhpcy5pc0RlYWQgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLmpldFVzZWQgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLnN0YXJ0aW5nWCA9IHg7XHJcbiAgICAgICAgdGhpcy5zdGFydGluZ1kgPSB5O1xyXG4gICAgICBcclxuICAgICAgICBcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLmhlYWx0aCA9IHsgbWF4OiAxMCwgY3VycmVudDogMTB9O1xyXG4gICAgICAgIHRoaXMuZnVlbCA9IHsgY3VycmVudDogMTAsIG1heDogMTB9O1xyXG4gICAgICAgIHRoaXMubGl2ZXMgPSAzO1xyXG5cclxuICAgICAgICBcclxuICAgICAgICB0aGlzLmZsaWdodERlbGF5ID0gMDtcclxuICAgICAgICB0aGlzLmNoYXJlY3RlcnNwZWVkID0gNDAwO1xyXG4gICAgICAgIHRoaXMubmV4dFNob3QgPSAwO1xyXG4gICAgICAgXHJcbiAgICAgICAgLy9pbnRpdGFpbCBmbGlnaHQgYm9vc3QgdmFyaWFibGVzXHJcbiAgICAgICBcclxuICAgICAgICB0aGlzLmZsaWdodFdhcm1VcFRpbWUgPSAyO1xyXG4gICAgICAgIHRoaXMuamV0U3BlZWQgPSA0MDA7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5mbGlnaHRXYXJtVXAgPSAwO1xyXG4gICAgICAgIHRoaXMuc2VxQ291bnQgPSAwO1xyXG4gICAgICAgIHRoaXMuamV0Qm9vc3QgPSAwO1xyXG4gICAgICAgIHRoaXMubG9vcERlbGF5ID0gMDtcclxuICAgICAgICB0aGlzLmxvb3BSYXRlID0gLjE7XHJcbiAgICAgICAgdGhpcy5yb3RhdGlvbk9mZnNldCA9IC4xNVxyXG4gICAgICAgIHRoaXMucmF0ZU92ZXJUaW1lID0gdGhpcy5mbGlnaHRXYXJtVXBUaW1lL3RoaXMubG9vcFJhdGU7XHJcbiAgICAgICAgdGhpcy5yb3RhdGlvbk92ZXJUaW1lID0gKC4zNikvdGhpcy5yYXRlT3ZlclRpbWU7XHJcbiAgICAgICAgdGhpcy5qZXRBY2NlbGxlcmF0aW9uID0gdGhpcy5qZXRTcGVlZC90aGlzLnJhdGVPdmVyVGltZTtcclxuICAgICAgICB0aGlzLmFuZ2xlT3ZlclRpbWUgPSAxOS8gdGhpcy5yYXRlT3ZlclRpbWU7XHJcbiAgICAgICAgdGhpcy5yb3RhdGlvblNlcSA9IDA7XHJcbiAgICAgICAgdGhpcy5mdWVsVXNlSW50ZXJ2YWwgPSAwO1xyXG4gICAgICAgIFxyXG4gICAgICAgIFxyXG4gICAgICAgICB0aGlzLmdhbWUucGh5c2ljcy5hcmNhZGUuZW5hYmxlKHRoaXMsIFBoYXNlci5QaHlzaWNzLkFSQ0FERSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgICAgICAgdGhpcy5ib2R5LmdyYXZpdHkueSA9IDYwMDtcclxuICAgICAgICAgICAgICB0aGlzLmFuY2hvci5zZXRUbyguNSwgLjUpO1xyXG4gICAgICAgICAgICAgIHRoaXMuYm9keS5zZXRTaXplKDYwLDkwLDAsIC03KTtcclxuICAgICAgICAgIFxyXG4gICAgICAgICAgICB0aGlzLmFuaW1hdGlvbnMuYWRkKCdhdHRhY2snLCBbMCwgMSwgMiwgMywgNCwgNV0sMTAsIHRydWUpO1xyXG4gICAgICAgICAgICB0aGlzLmRpZSA9IHRoaXMuYW5pbWF0aW9ucy5hZGQoJ2RpZScsIFs2LCA3LCA4LCA5LCAxMCwgMTEsIDEyLCAxMywgMTQsIDE1LCAxNiwgMTddLDUsIGZhbHNlKTtcclxuICAgICAgICAgICAgdGhpcy5hbmltYXRpb25zLmFkZCgnZGl6enknLCBbMTgsIDE5LCAyMCwgMjFdLDEwLCB0cnVlKTtcclxuICAgICAgICAgICAgdGhpcy5pZGxlID0gdGhpcy5hbmltYXRpb25zLmFkZCgnaWRsZScsIFsyMiwgMjMsIDI0LCAyNSwgMjYsIDI3LCAyOCwgMjksIDMwLCAzMSwgMzIsIDMzXSwxMCwgdHJ1ZSk7XHJcbiAgICAgICAgICAgIHRoaXMuYW5pbWF0aW9ucy5hZGQoJ2pldHBhY2snLCBbMzQsIDM1LCAzNiwgMzcsIDM4LCAzOSwgNDAsIDQxXSwxMCwgdHJ1ZSk7XHJcbiAgICAgICAgICAgIHRoaXMuYW5pbWF0aW9ucy5hZGQoJ2p1bXAnLCBbNDIsIDQzLCA0NCwgNDUsIDQ2LCA0N10sMTAsIGZhbHNlKTtcclxuICAgICAgICAgICAgdGhpcy5hbmltYXRpb25zLmFkZCgncm9sbCcsIFs0OCwgNDksIDUwLCA1MSwgNTIsIDUzLCA1NCwgNTVdLDEwLCB0cnVlKTtcclxuICAgICAgICAgICAgdGhpcy5hbmltYXRpb25zLmFkZCgncnVuJywgWzU2LCA1NywgNTgsIDU5LCA2MCwgNjEsIDYyLCA2MywgNjQsIDY1XSwxMCwgZmFsc2UpO1xyXG4gICAgICAgICAgICB0aGlzLnJ1blNob3QgPSB0aGlzLmFuaW1hdGlvbnMuYWRkKCdydW5fd2l0aF9ndW4nLCBbNjYsIDY3LCA2OCwgNjksIDcwLCA3MSwgNzIsIDczLCA3NCwgNzVdLDEwLCBmYWxzZSk7XHJcbiAgICAgICAgICAgIHRoaXMuaWRsZVNob3QgPSB0aGlzLmFuaW1hdGlvbnMuYWRkKCdzaG90JywgWzc2LDc3LDc4LDc5LDgwXSwxMCwgZmFsc2UpO1xyXG4gICAgICAgICAgICB0aGlzLnJ1blNob3RTdG9wID0gdGhpcy5hbmltYXRpb25zLmFkZCgnc2hvdFN0b3AnLCBbNzksODBdLDgsIGZhbHNlKTtcclxuICAgICAgICAgICAgdGhpcy5hbmltYXRpb25zLmFkZCgnc2xpZGluZycsIFs4MSwgODIsIDgzLCA4NCwgODUsIDg2XSwxMCwgdHJ1ZSk7XHJcbiAgICAgICAgICAgIHRoaXMuYW5pbWF0aW9ucy5hZGQoJ3Rocm93aW5nJywgWzg3LCA4OCwgODksIDkwLCA5MSwgOTJdLDEwLCB0cnVlKTtcclxuICAgICAgICAgICAgdGhpcy5hbmltYXRpb25zLmFkZCgnamV0cGFja19maXJlJywgWzkzLCA5NCwgOTUsIDk2LCA5N10sMTAsIGZhbHNlKTtcclxuICAgICAgICAgICAgdGhpcy5hbmltYXRpb25zLmFkZCgnanVtcF9maXJlJyxbOTgsIDk5LCAxMDAsIDEwMSwgMTAyXSwxMCxmYWxzZSk7XHJcbiAgICAgICAgICAgIHRoaXMuZGllLm9uQ29tcGxldGUuYWRkKHRoaXMuZGVhZCwgdGhpcyk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgICAgIC8vUGxheWVyIGZsYXNoZXMgd2hlbiBoaXRcclxuICAgICAgICAgICAgdGhpcy5mbGFzaEVmZmVjdCA9IHRoaXMuZ2FtZS5hZGQudHdlZW4odGhpcylcclxuXHRcdFx0XHRcdFx0XHRcdFx0LnRvKCB7IGFscGhhOiAwIH0sIDUwLCBQaGFzZXIuRWFzaW5nLkJvdW5jZS5PdXQpXHJcblx0XHRcdFx0XHRcdFx0XHRcdC50byggeyBhbHBoYTogLjggfSwgNTAsIFBoYXNlci5FYXNpbmcuQm91bmNlLk91dClcclxuXHRcdFx0XHRcdFx0XHRcdFx0LnRvKCB7IGFscGhhOiAxIH0sIDE1MCwgUGhhc2VyLkVhc2luZy5DaXJjdWxhci5PdXQpO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgLy9yZWdpc3RlcmVkIGlucHV0c1xyXG4gICAgICAgICAgICB0aGlzLm1vdmVMZWZ0ID0gdGhpcy5nYW1lLmlucHV0LmtleWJvYXJkLmFkZEtleShcIkFcIi5jaGFyQ29kZUF0KDApKTtcclxuICAgICAgICAgICAgdGhpcy5tb3ZlUmlnaHQgPSB0aGlzLmdhbWUuaW5wdXQua2V5Ym9hcmQuYWRkS2V5KFwiRFwiLmNoYXJDb2RlQXQoMCkpO1xyXG4gICAgICAgICAgICB0aGlzLmp1bXAgPSB0aGlzLmdhbWUuaW5wdXQua2V5Ym9hcmQuYWRkS2V5KFwiV1wiLmNoYXJDb2RlQXQoMCkpO1xyXG4gICAgICAgICAgICB0aGlzLm1vdmVEb3duID0gdGhpcy5nYW1lLmlucHV0LmtleWJvYXJkLmFkZEtleShcIlNcIi5jaGFyQ29kZUF0KDApKTtcclxuICAgICAgICAgICAgdGhpcy5jdXJzb3IgPSB0aGlzLmdhbWUuaW5wdXQua2V5Ym9hcmQuY3JlYXRlQ3Vyc29yS2V5cygpO1xyXG4gICAgICAgICAgICB0aGlzLmpldG1vZGUgPSB0aGlzLmdhbWUuaW5wdXQua2V5Ym9hcmQuYWRkS2V5KDE2KTtcclxuICAgICAgICAgICAgdGhpcy5zaG9vdCA9IHRoaXMuZ2FtZS5pbnB1dC5rZXlib2FyZC5hZGRLZXkoUGhhc2VyLktleWJvYXJkLkVOVEVSKTtcclxuICAgICAgICAgICAgdGhpcy50ZXN0c2hvdCA9IHRoaXMuZ2FtZS5pbnB1dC5rZXlib2FyZC5hZGRLZXkoMTMpO1xyXG4gICAgICAgIFxyXG4gICAgfVxyXG4gICAgXHJcbiAgICB1cGRhdGUoKXtcclxuICAgIGlmKCF0aGlzLmlzRGVhZCl7XHJcbiAgICAgICAgICAgaWYodGhpcy5ib2R5Lm9uRmxvb3IoKSl7XHJcbiAgICAgICAgICAgICAgIHRoaXMuZmlyc3RBbmltYXRpb24gPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgaWYodGhpcy5oZXJvZmx5aW5nKVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICB0aGlzLnJlc2V0RmxpZ2h0KCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmKHRoaXMuamV0VXNlZCl7XHJcbiAgICAgICAgdGhpcy5mdWVsVUkuc2V0VmFsdWUoMSk7XHJcbiAgICAgICAgdGhpcy5mdWVsLmN1cnJlbnQgPSB0aGlzLmZ1ZWwubWF4O1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuamV0VXNlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICB0aGlzLmdyb3VuZENvbnRyb2xzKCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgaWYoIXRoaXMuaGVyb2ZseWluZyl7XHJcbiAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICB0aGlzLmp1bXBDb250cm9scygpOyBcclxuICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgdGhpcy5mbGlnaHRDb250cm9scygpO1xyXG4gICAgICAgICAgICAgICAgIFxyXG4gICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIFxyXG4gICAgICAgIFxyXG4gICAgfSAgXHJcbiBcclxuICAgICAgICBcclxuICAgIH1cclxuICAgIFxyXG4gICAgZ3JvdW5kQ29udHJvbHMoKXtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGlmKHRoaXMuc2hvb3QuaXNEb3duKXtcclxuICAgICAgICAgICAgICAgICAgICAgdGhpcy5zaG90RmlyZWQoKTtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICB0aGlzLm5vU2hvdEFuaW0gPSAhKHRoaXMucnVuU2hvdC5pc1BsYXlpbmcgfHwgdGhpcy5pZGxlU2hvdC5pc1BsYXlpbmcgKTsgXHJcbiAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBpZih0aGlzLm1vdmVSaWdodC5pc0Rvd24pe1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIGlmKHRoaXMuaWRsZVNob3QuaXNQbGF5aW5nKXtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmlkbGVTaG90LnN0b3AoKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnJ1blNob3QucGxheSgpO1xyXG4gICAgICAgICAgICAgICAgfWVsc2UgaWYoIXRoaXMucnVuU2hvdC5pc1BsYXlpbmcpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBsYXkoJ3J1bicpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRoaXMuYm9keS52ZWxvY2l0eS54ID0gdGhpcy5jaGFyZWN0ZXJzcGVlZDtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2NhbGUueCA9IDE7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgfWVsc2UgaWYodGhpcy5tb3ZlTGVmdC5pc0Rvd24pe1xyXG4gICAgICAgICAgICBpZih0aGlzLmlkbGVTaG90LmlzUGxheWluZyl7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pZGxlU2hvdC5zdG9wKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ydW5TaG90LnBsYXkoKTtcclxuICAgICAgICAgICAgICAgIH1lbHNlIGlmKCF0aGlzLnJ1blNob3QuaXNQbGF5aW5nKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wbGF5KCdydW4nKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ib2R5LnZlbG9jaXR5LnggPSAtdGhpcy5jaGFyZWN0ZXJzcGVlZDsgIFxyXG4gICAgICAgICAgICAgICAgdGhpcy5zY2FsZS54ID0gLTE7XHJcbiAgICAgICAgICAgICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5ib2R5LnZlbG9jaXR5LnggPSAwO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKHRoaXMubm9TaG90QW5pbSAmJiAoIXRoaXMucnVuU2hvdFN0b3AuaXNQbGF5aW5nKSl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGxheSgnaWRsZScpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1lbHNleyBpZih0aGlzLnJ1blNob3QuaXNQbGF5aW5nKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucnVuU2hvdC5zdG9wKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnJ1blNob3RTdG9wLnBsYXkoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSBcclxuICAgICAgICAgICAgICAgIGlmKHRoaXMuanVtcC5pc0Rvd24pe1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYm9keS52ZWxvY2l0eS55ID0gLTUwMDtcclxuICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICBpZiAodGhpcy5qZXRtb2RlLmlzRG93bikgeyBcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmJvZHkueSA9IHRoaXMuYm9keS55IC0gMTA7XHJcbiAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgICB0aGlzLmFuZ2xlIC09ICh0aGlzLnNjYWxlLnggPiAwICkgPyA3MjogLTcyO1xyXG4vLyAgICAgICAgICAgICAgICAgIHRoaXMuZ2FtZS50aW1lLmV2ZW50cy5hZGQoUGhhc2VyLlRpbWVyLlNFQ09ORCAqIC4xLCB0aGlzLnN0YXJ0RmxpZ2h0LCB0aGlzKTtcclxuICAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGFydEZsaWdodCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICB0aGlzLmZsaWdodERlbGF5ID0gdGhpcy5nYW1lLnRpbWUubm93ICsgNjAwO1xyXG4gICAgICAgICAgICAgICAgICAgICB0aGlzLmpldFVzZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgIH1cclxuICAgIH1cclxuICAgIFxyXG4gICAganVtcENvbnRyb2xzKCl7XHJcbiAgICAgICAgICAgICAgICBpZih0aGlzLmZpcnN0QW5pbWF0aW9uKXtcclxuICAgICAgICAgICAgICAgdGhpcy5wbGF5KCdqdW1wJyk7ICBcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmZpcnN0QW5pbWF0aW9uID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB9ICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBpZih0aGlzLm1vdmVSaWdodC5pc0Rvd24pe1xyXG4gICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYm9keS52ZWxvY2l0eS54ID0gdGhpcy5jaGFyZWN0ZXJzcGVlZDtcclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLnNjYWxlLnggPSAxO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSBpZih0aGlzLm1vdmVMZWZ0LmlzRG93bil7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5ib2R5LnZlbG9jaXR5LnggPSAtdGhpcy5jaGFyZWN0ZXJzcGVlZDtcclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLnNjYWxlLnggPSAtMTtcclxuICAgICAgICAgICAgICAgIH1lbHNle1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMuYm9keS52ZWxvY2l0eS54ID0gMDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmpldG1vZGUuaXNEb3duKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYodGhpcy5nYW1lLnRpbWUubm93ID4gdGhpcy5mbGlnaHREZWxheSl7XHJcbiAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhcnRGbGlnaHQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5qZXRVc2VkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0gXHJcbiAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgIGlmKHRoaXMuc2hvb3QuaXNEb3duKXtcclxuICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNob3RGaXJlZCgpO1xyXG4gICAgICAgICAgICAgICAgICB9IFxyXG4gICAgfVxyXG4gICAgXHJcbiAgICBmbGlnaHRDb250cm9scygpe1xyXG4gICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgIGlmKHRoaXMuc2hvb3QuaXNEb3duKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5haXJTaG90KCk7XHJcbiAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgIHZhciBkaXIgPSAodGhpcy5zY2FsZS54ID4gMCkgPyAxIDogLTE7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgaWYodGhpcy5qdW1wLmlzRG93bil7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5hbmdsZS09MiooZGlyKTtcclxuICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgIGlmKHRoaXMubW92ZURvd24uaXNEb3duKXtcclxuICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmFuZ2xlKz0yKihkaXIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgaWYoIXRoaXMuZmxpZ2h0U2VxdWVuY2VJbml0KXtcclxuICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmZsaWdodFNlcXVlbmNlKGRpcik7XHJcbiAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgICB0aGlzLmdhbWUucGh5c2ljcy5hcmNhZGUudmVsb2NpdHlGcm9tUm90YXRpb24odGhpcy5yb3RhdGlvbiArIHRoaXMucm90YXRpb25TZXEsICh0aGlzLmpldHBhY2tTcGVlZCArIHRoaXMuamV0Qm9vc3QpICogKGRpciksIHRoaXMuYm9keS52ZWxvY2l0eSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuamV0bW9kZS5pc0Rvd24pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKHRoaXMuZ2FtZS50aW1lLm5vdyA+IHRoaXMuZmxpZ2h0RGVsYXkpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wbGF5KCdqdW1wJyk7ICBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucmVzZXRGbGlnaHQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZmxpZ2h0RGVsYXkgPSB0aGlzLmdhbWUudGltZS5ub3cgKyA2MDA7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcclxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuamV0QXVkaW8uc3RvcCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgIGlmKHRoaXMuZ2FtZS50aW1lLm5vdyA+IHRoaXMuZnVlbFVzZUludGVydmFsICl7XHJcbiAgICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZnVlbFVzZUludGVydmFsID0gdGhpcy5nYW1lLnRpbWUubm93ICsgUGhhc2VyLlRpbWVyLlNFQ09ORCAqIC41O1xyXG4gICAgICAgICAgICAgICAgICAgICAgdGhpcy5mdWVsLmN1cnJlbnQtLTtcclxuICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZnVlbFVJLnNldFZhbHVlKHRoaXMuZnVlbC5jdXJyZW50L3RoaXMuZnVlbC5tYXgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgaWYodGhpcy5mdWVsLmN1cnJlbnQgPD0gMCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGxheSgnanVtcCcpOyBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnJlc2V0RmxpZ2h0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICBcclxuXHJcbiAgICAgICAgXHJcbiAgICAgICAgXHJcbiAgICB9XHJcbiAgICBcclxuICAgIHJlc2V0RmxpZ2h0KCl7XHJcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICB0aGlzLmpldEF1ZGlvLnN0b3AoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaGVyb2ZseWluZyA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5hbmdsZSA9IDA7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNlcUNvdW50ID0gMDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZmxpZ2h0U2VxdWVuY2VJbml0ID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnJvdGF0aW9uU2VxID0gMDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuamV0Qm9vc3QgPSAwOyAgIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5nYW1lLnBoeXNpY3MuYXJjYWRlLnZlbG9jaXR5RnJvbVJvdGF0aW9uKHRoaXMucm90YXRpb24sIDAsIHRoaXMuYm9keS52ZWxvY2l0eSk7ICAgIFxyXG4gICAgfVxyXG4gICAgXHJcbiAgICBzaG90RmlyZWQoKXtcclxuICAgIFxyXG4gICAgICAgICAgICBpZih0aGlzLmdhbWUudGltZS5ub3cgPiB0aGlzLm5leHRTaG90ICl7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm5leHRTaG90ID0gdGhpcy5nYW1lLnRpbWUubm93ICsgUGhhc2VyLlRpbWVyLlNFQ09ORCAqIHRoaXMuc2hvdEludGVydmFsO1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICB2YXIgZGlyID0gKHRoaXMuc2NhbGUueCA+IDApID8gMSA6IC0xO1xyXG4gICAgICAgICAgICAgICAgdmFyIGJ1bGxldCA9IHRoaXMuYnVsbGV0cy5nZXRGaXJzdERlYWQoKTtcclxuICAgICAgICAgICAgICAgIGlmKGJ1bGxldCl7XHJcbiAgICAgICAgICAgICAgICAgICAgYnVsbGV0LnggPSAgdGhpcy54ICsgKGRpciAqIDI1KTtcclxuICAgICAgICAgICAgICAgICAgICBidWxsZXQueSA9IHRoaXMueTtcclxuICAgICAgICAgICAgICAgICAgICBidWxsZXQuYW5nbGUgPSAwO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZ2FtZS5waHlzaWNzLmFyY2FkZS52ZWxvY2l0eUZyb21Sb3RhdGlvbih0aGlzLnJvdGF0aW9uLCAwLCBidWxsZXQuYm9keS52ZWxvY2l0eSk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnVsbGV0LnJldml2ZSgpOyAgICBcclxuICAgICAgICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAgICAgYnVsbGV0ID0gdGhpcy5idWxsZXRzLmNyZWF0ZSh0aGlzLnggKyAoZGlyICogMjUpLHRoaXMueSwnYnVsbGV0Jyk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmdhbWUucGh5c2ljcy5lbmFibGUoYnVsbGV0LCBQaGFzZXIuUGh5c2ljcy5BUkNBREUpO1xyXG5cdFx0XHRcdGJ1bGxldC5vdXRPZkJvdW5kc0tpbGwgPSB0cnVlO1xyXG5cdCAgICBcdFx0YnVsbGV0LmNoZWNrV29ybGRCb3VuZHMgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgYnVsbGV0LmJvZHkudmVsb2NpdHkueCA9IGRpciAqIHRoaXMuc2hvdFNwZWVkOyAgXHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIC8vYW5pbWF0aW9ucyBmb3Igc2hvdHNcclxuICAgICAgICAgICAgICAgIGlmKHRoaXMuYm9keS5vbkZsb29yKCkpe1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKHRoaXMuYm9keS52ZWxvY2l0eS54ID09PSAwKXtcclxuICAgICAgICAgICAgICAgICAgIHRoaXMuaWRsZVNob3QucGxheSgpOyBcclxuICAgICAgICAgICAgICAgIH1lbHNlIHtcclxuICAgICAgICAgICAgICAgICAgIHRoaXMucnVuU2hvdC5wbGF5KCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnBsYXkoJ2p1bXBfZmlyZScpOyBcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgIGFpclNob3QoKXtcclxuICAgICAgICBcclxuICAgICAgICBpZih0aGlzLmdhbWUudGltZS5ub3cgPiB0aGlzLm5leHRTaG90KXtcclxuICAgICAgICAgICAgdGhpcy5uZXh0U2hvdCA9IHRoaXMuZ2FtZS50aW1lLm5vdyArIFBoYXNlci5UaW1lci5TRUNPTkQgKiB0aGlzLnNob3RJbnRlcnZhbDtcclxuICAgICAgICAgICAgIHRoaXMucGxheSgnamV0cGFja19maXJlJyk7IFxyXG4gICAgICAgICAgICAgdGhpcy5hbmltYXRpb25zLmN1cnJlbnRBbmltLm9uQ29tcGxldGUuYWRkKGZ1bmN0aW9uICgpIHtcdHRoaXMucGxheSgnamV0cGFjaycpOyB9LCB0aGlzKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICB2YXIgZGlyID0gKHRoaXMuc2NhbGUueCA+IDApID8gMSA6IC0xO1xyXG4gICAgICAgICAgICB2YXIgcCA9IG5ldyBQaGFzZXIuUG9pbnQodGhpcy54LCB0aGlzLnkpOyBcclxuICAgICAgICAgIHAucm90YXRlKHAueCwgcC55LCB0aGlzLnJvdGF0aW9uLCBmYWxzZSwgKDQwKmRpcikpO1xyXG4gICAgICAgICAgdmFyIHJvY2tldCA9IHRoaXMucm9ja2V0cy5nZXRGaXJzdERlYWQoKTtcclxuICAgICAgICAgICAgaWYocm9ja2V0KXtcclxuICAgICAgICAgICAgICAgIHJvY2tldC54ID0gcC54O1xyXG4gICAgICAgICAgICAgICAgcm9ja2V0LnkgPSBwLnk7XHJcbiAgICAgICAgICAgICAgICByb2NrZXQucmV2aXZlKCk7XHJcbiAgICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAgICAgcm9ja2V0ID0gdGhpcy5yb2NrZXRzLmNyZWF0ZShwLngscC55LCdyb2NrZXQnKTtcclxuICAgICAgICAgICAgICAgIHJvY2tldC5hbmltYXRpb25zLmFkZCgnc29hcicpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5nYW1lLnBoeXNpY3MuYXJjYWRlLmVuYWJsZShyb2NrZXQpO1xyXG4gICAgICAgICAgICAgICAgIHJvY2tldC5vdXRPZkJvdW5kc0tpbGwgPSB0cnVlO1xyXG5cdCAgICBcdFx0IHJvY2tldC5jaGVja1dvcmxkQm91bmRzID0gdHJ1ZTtcclxuICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJvY2tldC5zY2FsZS54ID0gZGlyO1xyXG4gICAgICAgICAgICAgICAgcm9ja2V0LmFuZ2xlID0gdGhpcy5hbmdsZSArICgoLTE4KSpkaXIpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5nYW1lLnBoeXNpY3MuYXJjYWRlLnZlbG9jaXR5RnJvbVJvdGF0aW9uKHRoaXMucm90YXRpb24gKyB0aGlzLnJvdGF0aW9uU2VxLCB0aGlzLnNob3RTcGVlZCAqIGRpciwgcm9ja2V0LmJvZHkudmVsb2NpdHkpO1xyXG4gICAgICAgICAgICAgICAgcm9ja2V0LnBsYXkoJ3NvYXInKTtcclxuICAgICAgICAgICB9XHJcbiAgICAgICAgfSAgXHJcbiAgICBcclxuICAgIGZsaWdodFNlcXVlbmNlKGRpcil7XHJcbiAgICAgICAgIGlmKHRoaXMuZ2FtZS50aW1lLm5vdyA+IHRoaXMubG9vcERlbGF5KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmxvb3BEZWxheSA9IHRoaXMuZ2FtZS50aW1lLm5vdyArIFBoYXNlci5UaW1lci5TRUNPTkQgKiB0aGlzLmxvb3BSYXRlOztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2VxQ291bnQrKztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYW5nbGUrPSB0aGlzLmFuZ2xlT3ZlclRpbWUgKihkaXIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5yb3RhdGlvblNlcSAtPSAodGhpcy5yb3RhdGlvbk92ZXJUaW1lKihkaXIpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuamV0Qm9vc3QgKz0gdGhpcy5qZXRBY2NlbGxlcmF0aW9uO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYodGhpcy5zZXFDb3VudCA9PSB0aGlzLnJhdGVPdmVyVGltZSl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmZsaWdodFNlcXVlbmNlSW5pdCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgIFxyXG4gICAgfVxyXG4gICAgXHJcbiAgICBzdGFydEZsaWdodCgpe1xyXG4gICAgICAgICAgICAgICAgICAgdGhpcy5wbGF5KCdqZXRwYWNrJyk7XHJcbiAgICAgICAgICAgICAgICAgICB0aGlzLmhlcm9mbHlpbmcgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgdGhpcy5mbGlnaHREZWxheSA9IHRoaXMuZ2FtZS50aW1lLm5vdyArIDYwMDtcclxuLy8gICAgICAgICAgICAgICAgICAgIHRoaXMuamV0QXVkaW8ucGxheSgnJywwLDEsdHJ1ZSk7ICAgIFxyXG4gICAgICAgIFxyXG4gICAgfVxyXG4gICAgXHJcbiAgICBkaWVkKCl7XHJcbiAgICB0aGlzLmlzRGVhZCA9IHRydWU7IFxyXG4gICAgdGhpcy5ib2R5LnZlbG9jaXR5LnggPSAwOyAgICBcclxuICAgIHRoaXMucGxheSgnZGllJyk7ICBcclxuICAgICAgICAgICAgXHJcbiAgICB9XHJcbiAgICBcclxuICAgIGRlYWQoKXsgXHJcbiAgICAgICAgdGhpcy5saXZlcy0tO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGlmKHRoaXMubGl2ZXMgPiAwKXtcclxuICAgICAgICAgICAgdGhpcy5oZWFsdGhVSS5zZXRWYWx1ZSgxKTtcclxuICAgICAgICAgICAgdGhpcy5saWZlVUkudGV4dCA9IFwieCBcIisgdGhpcy5saXZlcztcclxuICAgICAgICB0aGlzLnggPSB0aGlzLnN0YXJ0aW5nWDtcclxuICAgICAgICB0aGlzLnkgPSB0aGlzLnN0YXJ0aW5nWTtcclxuICAgICAgICB0aGlzLmlzRGVhZCA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuaGVhbHRoLmN1cnJlbnQgPSB0aGlzLmhlYWx0aC5tYXg7XHJcbiAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgdGhpcy5nYW1lLnN0YXRlLnN0YXJ0KCdnYW1lX292ZXInLCB0cnVlLCBmYWxzZSk7IFxyXG4gICAgICAgIH1cclxuICAgIFxyXG4gICAgXHJcbiAgICB9XHJcbiAgICBcclxuICAgIGZsYXNoKCkge1xyXG5cdFx0aWYoIXRoaXMuZmxhc2hFZmZlY3QuaXNSdW5uaW5nKSB7XHJcblx0XHRcdHRoaXMuZmxhc2hFZmZlY3Quc3RhcnQoKTtcclxuXHRcdH1cclxuXHR9XHJcbiAgICBcclxuICAgIFxyXG4gICAgXHJcbn1cclxuIiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgQm9vdCB7XG4gICAgXG4gICAgcHJlbG9hZCgpIHtcbiAgICAgICAgdGhpcy5sb2FkLmltYWdlKCdwcmVsb2FkZXInLCAnYXNzZXRzL2ltZy9sb2FkaW5nX2Jhci5wbmcnKTtcbiAgICB9XG4gICAgXG4gICAgY3JlYXRlKCkge1xuICAgICAgICB0aGlzLmdhbWUuaW5wdXQubWF4UG9pbnRlciA9IDE7XG4gICAgICAgIHRoaXMuZ2FtZS5zdGF0ZS5zdGFydCgncHJlbG9hZCcpO1xuICAgIH1cbiAgICBcbiAgICBcbn0iLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBHYW1lT3ZlciBleHRlbmRzIFBoYXNlci5TdGF0ZSB7XHJcbiAgICBcclxuICAgIFxyXG4gICAgcHJlbG9hZCgpe1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMubG9hZC5pbWFnZSgnbWVudV9iYWNrZ3JvdW5kJywnYXNzZXRzL2ltZy9tZW51X2JhY2tncm91bmQuanBnJyk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGNyZWF0ZSgpIHtcclxuICAgICAgICBcclxuICAgICAgIFxyXG4gICAgICAgIHZhciBzdHlsZSA9ICB7XHJcbiAgICAgICAgZm9udDogXCI2MHB4IEFyaWFsXCIsXHJcbiAgICAgICAgZmlsbDogJyNmZmZmZmYnLFxyXG4gICAgICAgIGFsaWduOiBcImNlbnRlclwiLFxyXG4gICAgICAgIHN0cm9rZTogJyMwMDAwMDAnLFxyXG4gICAgICAgIHN0cm9rZVRoaWNrbmVzczogMixcclxuICAgICAgICB9O1xyXG4gICAgICBcclxuICAgICAgICAgdGhpcy5zdGFydEdhbWUgPSB0aGlzLmdhbWUuaW5wdXQua2V5Ym9hcmQuYWRkS2V5KFBoYXNlci5LZXlib2FyZC5FTlRFUik7XHJcbiAgICAgICAgIHRoaXMuYWRkLnNwcml0ZSgwLDAsJ21lbnVfYmFja2dyb3VuZCcpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHZhciB0aXRsZSA9IHRoaXMuYWRkVGV4dCh0aGlzLmdhbWUud2lkdGgvMiwgMTAwLCA2MCwgXCJHQU1FIE9WRVJcIiwgc3R5bGUpO1xyXG4gICAgICAgIHRpdGxlLmFuY2hvci5zZXRUbyguNSwgMCk7XHJcbiAgICAgICAgdmFyIHRleHRBbGlnbiA9ICh0aGlzLmdhbWUud2lkdGgvMikgLSAodGl0bGUud2lkdGgvMik7XHJcbiAgICAgICAgXHJcbiAgICAgICAgXHJcbiAgICAgICAgdmFyIHNwcml0ZSA9IHRoaXMuZ2FtZS5hZGQuc3ByaXRlKHRoaXMuZ2FtZS53aWR0aC8yLCB0aGlzLmdhbWUuaGVpZ2h0LzIsICduaW5qYScpO1xyXG4gICAgICAgIHNwcml0ZS5zY2FsZS5zZXRUbygyKTtcclxuICAgICAgIHNwcml0ZS5hbmltYXRpb25zLmFkZCgnZGl6enknLCBbMTgsIDE5LCAyMCwgMjFdLDEwLCB0cnVlKTtcclxuICAgICAgICBzcHJpdGUucGxheSgnZGl6enknKTtcclxuICAgICAgICBcclxuICAgICAgICB9XHJcbiAgICBcclxuICAgIFxyXG4gICAgXHJcbiAgICB1cGRhdGUoKSB7XHJcblxyXG4gICAgXHJcbiAgICAgICAgICBpZih0aGlzLnN0YXJ0R2FtZS5pc0Rvd24pe1xyXG4gICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgIHRoaXMuZ2FtZS5zdGF0ZS5zdGFydCgnbWVudScpO1xyXG4gICAgICAgICAgfVxyXG4gICAgXHJcbiAgICB9XHJcbiAgICBcclxuICAgIGFkZFRleHQoeCx5LCB0ZXh0U2l6ZSwgbWVzc2FnZSwgc3R5bGUpe1xyXG4gICAgICAgIFxyXG4gICAgICAgICAgICAgdmFyIHRleHQgPSB0aGlzLmdhbWUuYWRkLnRleHQoeCx5LCBtZXNzYWdlLCAgc3R5bGUpO1xyXG4gICAgICAgICAgICAgdGV4dC5zZXRTaGFkb3coNSwgNSwgJ3JnYmEoMCwwLDAsMC41KScsIDUpO1xyXG4gICAgICAgICAgICB2YXIgZ3JkID0gdGV4dC5jb250ZXh0LmNyZWF0ZUxpbmVhckdyYWRpZW50KDAsIDAsIDAsIDc0KTtcclxuICAgICAgICAgICAgZ3JkLmFkZENvbG9yU3RvcCgwLCAnIzhFRDZGRicpOyAgIFxyXG4gICAgICAgICAgICBncmQuYWRkQ29sb3JTdG9wKDEsICcjMDA0Q0IzJyk7XHJcbiAgICAgICAgICAgIHRleHQuZmlsbCA9IGdyZDtcclxuICAgICAgICAgICAgdGV4dC5mb250U2l6ZSA9IHRleHRTaXplO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHJldHVybiB0ZXh0O1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBcclxuICAgIFxyXG4gICAgXHJcbiAgICBcclxuICAgIFxyXG59IiwiLyogZ2xvYmFsIFBoYXNlciAqL1xuXG5pbXBvcnQgUGxheWVyIGZyb20gXCIuLi9wcmVmYWJzL1BsYXllci5qc1wiO1xuaW1wb3J0IEVuZW15IGZyb20gIFwiLi4vcHJlZmFicy9FbmVteS5qc1wiO1xuaW1wb3J0IEhlYWx0aEJhciBmcm9tIFwiLi4vcHJlZmFicy9IZWFsdGhCYXIuanNcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTGV2ZWwxIGV4dGVuZHMgUGhhc2VyLlN0YXRlIHtcbiAgICBcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoKTtcblxuICAgIH1cbiAgICBwcmVsb2FkKCl7XG4gICAgICAgICAgICAgICAgdGhpcy5sb2FkLmltYWdlKCd0aWxlc2V0JywnYXNzZXRzL2ltZy9zY2lfZmlfdGlsZXMucG5nJyk7XG4gICAgICAgICAgICB0aGlzLmxvYWQudGlsZW1hcCgnbXl0aWxlbWFwJywnYXNzZXRzL3RpbGVzL2xldmVsMS5qc29uJywgbnVsbCwgUGhhc2VyLlRpbGVtYXAuVElMRURfSlNPTik7ICAgIFxuICAgICAgICBcbiAgICB9XG4gICAgXG4gICAgY3JlYXRlKCkge1xuICAgICAgICBcbiAgICAgICAgdGhpcy5nYW1lLnBoeXNpY3Muc3RhcnRTeXN0ZW0oUGhhc2VyLlBoeXNpY3MuQVJDQURFKTtcbiAgICAgICAgdGhpcy5nYW1lLnN0YWdlLmJhY2tncm91bmRDb2xvciA9IFwiIzkxOGE4N1wiO1xuICAgICAgICBcbiAgICAgICAgXG4gICAgICAgICAgICB0aGlzLmRvb3JJc0Nsb3NlZCA9IHRydWU7XG4gICAgICAgICAgICB0aGlzLnNjb3JlID0gMDtcbiAgICAgICAgICAgIHRoaXMuZW5lbXlDb3VudCA9IHtjdXJyZW50OiAwLCB0b3RhbDogMH07XG4gICAgICAgICAgICB0aGlzLmRlYXRoRGVsYXkgPSAwO1xuICAgICAgICBcbiAgICAgICAgLy9jcmVhdGUgdGlsZXNldFxuICAgICAgICAgICAgdGhpcy5teVRpbGVzID0gdGhpcy5nYW1lLmFkZC50aWxlbWFwKCdteXRpbGVtYXAnKTtcbiAgICAgICAgICAgIHRoaXMubXlUaWxlcy5hZGRUaWxlc2V0SW1hZ2UoJ3NjaV9maV90aWxlcycsICd0aWxlc2V0Jyk7XG4gICAgICAgICAgICB0aGlzLm15VGlsZXMuc2V0Q29sbGlzaW9uQmV0d2VlbigwLDUwMCk7XG4gICAgICAgICAgICB0aGlzLm15dGlsZWJhY2tncm91bmQgPSB0aGlzLm15VGlsZXMuY3JlYXRlTGF5ZXIoJ0JhY2tncm91bmQnKTtcbiAgICAgICAgICAgIHRoaXMubXl0aWxlc2xheWVyID0gdGhpcy5teVRpbGVzLmNyZWF0ZUxheWVyKCdXb3JsZCcpO1xuICAgICAgICAgICAgdGhpcy5teXRpbGVzbGF5ZXIucmVzaXplV29ybGQoKTsgXG4gICAgICAgXG4gICAgICAgICAgdGhpcy5xdWFkVHJlZSA9IG5ldyBQaGFzZXIuUXVhZFRyZWUoMCwgMCwgdGhpcy5nYW1lLndvcmxkLndpZHRoLCB0aGlzLmdhbWUud29ybGQuaGVpZ2h0LCA0LCA0LCAwKTtcbiAgICAgICAgICBcbiAgICAgICAgXG4gICAgdGhpcy5wbGF5ZXJCdWxsZXRzID0gdGhpcy5hZGQuZ3JvdXAoKTtcbiAgICB0aGlzLnBsYXllckJ1bGxldHMuZW5hYmxlQm9keSA9IHRydWU7XG4gICAgdGhpcy5wbGF5ZXJCdWxsZXRzLnBoeXNpY3NCb2R5VHlwZSA9IFBoYXNlci5QaHlzaWNzLkFSQ0FERTtcbiAgICAgICAgXG4gICAgIHRoaXMucGxheWVyUm9ja2V0cyA9IHRoaXMuYWRkLmdyb3VwKCk7XG4gICAgdGhpcy5wbGF5ZXJSb2NrZXRzLmVuYWJsZUJvZHkgPSB0cnVlO1xuICAgIHRoaXMucGxheWVyUm9ja2V0cy5waHlzaWNzQm9keVR5cGUgPSBQaGFzZXIuUGh5c2ljcy5BUkNBREU7ICAgIFxuICAgICAgICBcbiAgICAgdGhpcy5lbmVteUJ1bGxldHMgPSB0aGlzLmFkZC5ncm91cCgpO1xuICAgIHRoaXMuZW5lbXlCdWxsZXRzLmVuYWJsZUJvZHkgPSB0cnVlO1xuICAgIHRoaXMuZW5lbXlCdWxsZXRzLnBoeXNpY3NCb2R5VHlwZSA9IFBoYXNlci5QaHlzaWNzLkFSQ0FERTsgXG4gICAgICAgIFxuICAgICAgICBcbiAgIFxuICAgICAgICBcbiAgIC8vY3JlYXRlIGRvb3IgICAgIFxuICAgdGhpcy5teVRpbGVzLmNyZWF0ZUZyb21PYmplY3RzKCdEb29yJyw2MTgsJ2Rvb3InLDAsdHJ1ZSwgZmFsc2UpOyAgICBcbiAgIHRoaXMuZG9vciA9IHRoaXMud29ybGQuZ2V0VG9wKCk7XG4gICB0aGlzLmdhbWUucGh5c2ljcy5hcmNhZGUuZW5hYmxlKHRoaXMuZG9vcik7XG4gICB0aGlzLmRvb3IuYW5pbWF0aW9ucy5hZGQoJ29wZW4nLFswLDEsMiwzLDRdLCAxMCwgZmFsc2UpO1xuICAgICAgICBcbiAgICAgICAgdGhpcy5zZXR1cFVJKCk7XG4gICAgICAgIFxuICAgIFxuICAgIFxuICAgIC8vY3JlYXRlIG1haW4gQ2hhcmVjdGVyICAgIFxuLy8gICAgdGhpcy5tYWluQ2hhcmVjdGVyID0gbmV3IFBsYXllcih0aGlzLmdhbWUsIDQwMCwgNTAsIHRoaXMucGxheWVyQnVsbGV0cywgdGhpcy5wbGF5ZXJSb2NrZXRzLCB0aGlzLmZ1ZWxCYXIsIHRoaXMuaGVhbHRoQmFyKTtcbi8vICAgIHRoaXMuZ2FtZS5hZGQuZXhpc3RpbmcodGhpcy5tYWluQ2hhcmVjdGVyKTtcbiAgICAgICAgXG4gICAgdGhpcy5teVRpbGVzLmNyZWF0ZUZyb21PYmplY3RzKCdQbGF5ZXInLDUxOSwnbnVsbCcsJ251bGwnLHRydWUsIGZhbHNlLCB0aGlzLndvcmxkLCBQbGF5ZXIpO1xuICAgIHRoaXMubWFpbkNoYXJlY3RlciA9IHRoaXMud29ybGQuZ2V0VG9wKCk7XG4gICAgICAgIFxuICAgICAgICB0aGlzLm1haW5DaGFyZWN0ZXIuYnVsbGV0cyA9IHRoaXMucGxheWVyQnVsbGV0cztcbiAgICAgICAgdGhpcy5tYWluQ2hhcmVjdGVyLnJvY2tldHMgPSB0aGlzLnBsYXllclJvY2tldHM7XG4gICAgICAgIHRoaXMubWFpbkNoYXJlY3Rlci5mdWVsVUkgPSB0aGlzLmZ1ZWxCYXI7XG4gICAgICAgIHRoaXMubWFpbkNoYXJlY3Rlci5oZWFsdGhVSSA9IHRoaXMuaGVhbHRoQmFyO1xuICAgICAgICB0aGlzLm1haW5DaGFyZWN0ZXIubGlmZVVJID0gdGhpcy5saWZlVGV4dDtcbiAgICAgICAgdGhpcy5saWZlVGV4dC50ZXh0ID0gXCJ4IFwiICsgdGhpcy5tYWluQ2hhcmVjdGVyLmxpdmVzO1xuICAgICAgICBcbiAgICB0aGlzLmdhbWUuY2FtZXJhLmZvbGxvdyh0aGlzLm1haW5DaGFyZWN0ZXIpO1xuICAgICAgIFxuICAgICAgIFxuICAgICAgICAgICAgICBcbiAgICAgICAgLy9wbGFjZSBlbmVtaWVzXG4gICAgICAgIHRoaXMuZW5lbWllcyA9IHRoaXMuYWRkLmdyb3VwKCk7XG4gICAgICAgIHRoaXMubXlUaWxlcy5jcmVhdGVGcm9tT2JqZWN0cygnRW5lbWllcycsIDYyMywgJ251bGwnLCAnbnVsbCcsIHRydWUsIGZhbHNlLCB0aGlzLmVuZW1pZXMsIEVuZW15KTtcbiAgICAgICAgdGhpcy5lbmVtaWVzLnNldEFsbCgncGxheWVyJywgdGhpcy5tYWluQ2hhcmVjdGVyKTtcbiAgICAgICAgdGhpcy5lbmVtaWVzLnNldEFsbCgnYnVsbGV0cycsIHRoaXMuZW5lbXlCdWxsZXRzKTtcbiAgICAgICAgdGhpcy5lbmVtaWVzLnNldEFsbCgnbGF5ZXInLCB0aGlzLm15dGlsZXNsYXllcik7XG4gICAgICAgIHRoaXMuZW5lbXlDb3VudC5jdXJyZW50ID0gdGhpcy5lbmVteUNvdW50LnRvdGFsID0gdGhpcy5lbmVtaWVzLmxlbmd0aDtcbiAgICAgICAgXG4gICAgICAgIFxuICAgICAgICBcbiAgICAgICAgICAgIHRoaXMuY29sbGVjdFNvdW5kID0gdGhpcy5hZGQuYXVkaW8oJ2NvbGxlY3QnKTtcbiAgICAgICAgICAgIHRoaXMuamV0QXVkaW8gPSB0aGlzLmFkZC5hdWRpbygnamV0cycpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBcbiAgICAgICAgXG4gICAgICAgICAgIFxuICAgICAgICAgICAgXG4gICAgICAgXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHRoaXMuY29pbnMgPSB0aGlzLmFkZC5ncm91cCgpO1xuICAgICAgICAgICAgdGhpcy5jb2lucy5lbmFibGVCb2R5ID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMubXlUaWxlcy5jcmVhdGVGcm9tT2JqZWN0cygnZ2VtcycsIDY4MSwgJ2NvaW5zJywgMCwgdHJ1ZSwgZmFsc2UsIHRoaXMuY29pbnMpO1xuXG4gIC8vICBBZGQgYW5pbWF0aW9ucyB0byBhbGwgb2YgdGhlIGNvaW4gc3ByaXRlc1xuICAgICBcbiAgICB0aGlzLmNvaW5zLmNhbGxBbGwoJ2FuaW1hdGlvbnMuYWRkJywgJ2FuaW1hdGlvbnMnLCAnc3BpbicsIFswLCAxLCAyLCAzLCA0LCA1XSwgMTAsIHRydWUpO1xuICAgIHRoaXMuY29pbnMuY2FsbEFsbCgnYW5pbWF0aW9ucy5wbGF5JywgJ2FuaW1hdGlvbnMnLCAnc3BpbicpO1xuICAgICAgICBcbiAgICAgICAgdGhpcy5zaG9ja3MgPSB0aGlzLmFkZC5ncm91cCgpO1xuICAgICAgICB0aGlzLnNob2Nrcy5lbmFibGVCb2R5ID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5teVRpbGVzLmNyZWF0ZUZyb21PYmplY3RzKCdTaG9ja3MnLCA3MTIsICdzaG9jaycsIDAsIHRydWUsIGZhbHNlLCB0aGlzLnNob2Nrcyk7XG4gICAgICAgIHRoaXMuc2hvY2tzLnNldEFsbCgnYm9keS5pbW1vdmFibGUnLCB0cnVlKTtcbiAgICAgICAgdGhpcy5zaG9ja3MuY2FsbEFsbCgnYm9keS5zZXRTaXplJywgJ2JvZHknICwgMTI4LCAxMCwgMCwgNTkpO1xuICAgICAgICB0aGlzLnNob2Nrcy5jYWxsQWxsKCdhbmltYXRpb25zLmFkZCcsICdhbmltYXRpb25zJywgJ3dpZ2dsZScsIFswLCAxLCAyLCAzXSwgMTAsIHRydWUpO1xuICAgICAgICB0aGlzLnNob2Nrcy5jYWxsQWxsKCdhbmltYXRpb25zLnBsYXknLCAnYW5pbWF0aW9ucycsICd3aWdnbGUnKTtcbiAgICAgICAgXG4gICAgICAgICB0aGlzLnZlcnRTaG9ja3MgPSB0aGlzLmFkZC5ncm91cCgpO1xuICAgICAgICB0aGlzLnZlcnRTaG9ja3MuZW5hYmxlQm9keSA9IHRydWU7XG4gICAgICAgIHRoaXMubXlUaWxlcy5jcmVhdGVGcm9tT2JqZWN0cygnU2hvY2tzJywgNzA1LCAnc2hvY2snLCAwLCB0cnVlLCBmYWxzZSwgdGhpcy52ZXJ0U2hvY2tzKTtcbiAgICAgICAgdGhpcy52ZXJ0U2hvY2tzLnNldEFsbCgnYm9keS5pbW1vdmFibGUnLCB0cnVlKTtcbiAgICAgICAgdGhpcy52ZXJ0U2hvY2tzLmNhbGxBbGwoJ2JvZHkuc2V0U2l6ZScsICdib2R5JyAsIDEwLCAxMjgsIDU5LCAwKTtcbiAgICAgICAgdGhpcy52ZXJ0U2hvY2tzLmNhbGxBbGwoJ2FuaW1hdGlvbnMuYWRkJywgJ2FuaW1hdGlvbnMnLCAndmVydF93aWdnbGUnLCBbOCwgOSwgMTAsIDExXSwgMTAsIHRydWUpO1xuICAgICAgICB0aGlzLnZlcnRTaG9ja3MuY2FsbEFsbCgnYW5pbWF0aW9ucy5wbGF5JywgJ2FuaW1hdGlvbnMnLCAndmVydF93aWdnbGUnKTtcbiAgICAgICAgXG4gICAgICAgICAgdGhpcy5oZWFsdGhQYWNrcyA9IHRoaXMuYWRkLmdyb3VwKCk7XG4gICAgICAgIHRoaXMuaGVhbHRoUGFja3MuZW5hYmxlQm9keSA9IHRydWU7XG4gICAgICAgIHRoaXMubXlUaWxlcy5jcmVhdGVGcm9tT2JqZWN0cygnSGVhbHRoJywgNzI3LCAnaGVhbHRoX3BhY2snLCAwLCB0cnVlLCBmYWxzZSwgdGhpcy5oZWFsdGhQYWNrcyk7XG4gICAgICAgIHRoaXMuaGVhbHRoUGFja3Muc2V0QWxsKCdib2R5LmltbW92YWJsZScsIHRydWUpO1xuLy8gICAgICAgIHRoaXMuaGVhbHRoUGFja3MuY2FsbEFsbCgnYm9keS5zZXRTaXplJywgJ2JvZHknICwgMTAsIDEyOCwgNTksIDApO1xuICAgICBcbiAgICAgICAgXG4gICAgXG4gICAgICAgIHRoaXMuZXhwbG9zaW9ucyA9IHRoaXMuYWRkLmdyb3VwKCk7IFxuICAgICAgICAgICAgXG4gICAgICAgICAgICBcbiAgICAgICAgICAgXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIFxuICAgXG4gICAgICAgIFxuICAgICAgICAgICAgXG4gIFxuICAgICAgICAgICAgXG4gICAgICAgXG4gICAgfVxuICAgIFxuICAgIHVwZGF0ZSgpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5xdWFkVHJlZS5jbGVhcigpO1xuICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgZm9yKHZhciBpID0gMDsgaTwgdGhpcy5lbmVtaWVzLmxlbmd0aDsgaSsrKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZW5lbWllcy5nZXRBdChpKS5lbmVteVVwZGF0ZSA9IGZhbHNlO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnF1YWRUcmVlLmluc2VydCh0aGlzLmVuZW1pZXMuZ2V0QXQoaSkpO1xuICAgICAgICAgICAgICAgICAgICB9XG4vLyAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZm91bmQgPSB0aGlzLnF1YWRUcmVlLnJldHJpZXZlKHRoaXMubWFpbkNoYXJlY3Rlcik7XG4vLyAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIGZvcih2YXIgaSA9IDA7IGkgPCB0aGlzLmZvdW5kLmxlbmd0aDsgaSsrICl7XG4gICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZm91bmRbaV0uZW5lbXlVcGRhdGUgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICBpZih0aGlzLmZvdW5kW2ldLmRlc3Ryb3lFbmVteSl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5mb3VuZFtpXS5kZXN0cm95KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIFxuICAgICAgICAgICAgdGhpcy5waHlzaWNzLmFyY2FkZS5vdmVybGFwKHRoaXMubWFpbkNoYXJlY3RlciwgdGhpcy5oZWFsdGhQYWNrcywgdGhpcy5jb2xsZWN0SGVhbHRoLCBudWxsLCB0aGlzKTtcbiAgICAgICAgICAgIHRoaXMucGh5c2ljcy5hcmNhZGUub3ZlcmxhcCh0aGlzLm1haW5DaGFyZWN0ZXIsIHRoaXMuc2hvY2tzLCB0aGlzLmVsZWN0cm9jdXRlLCBudWxsLCB0aGlzKTtcbiAgICAgICAgICAgIHRoaXMucGh5c2ljcy5hcmNhZGUub3ZlcmxhcCh0aGlzLm1haW5DaGFyZWN0ZXIsIHRoaXMudmVydFNob2NrcywgdGhpcy5lbGVjdHJvY3V0ZSwgbnVsbCwgdGhpcyk7XG4gICAgICAgICAgICB0aGlzLnBoeXNpY3MuYXJjYWRlLmNvbGxpZGUodGhpcy5tYWluQ2hhcmVjdGVyLCB0aGlzLm15dGlsZXNsYXllcik7XG4gICAgICAgICAgICB0aGlzLnBoeXNpY3MuYXJjYWRlLmNvbGxpZGUodGhpcy5lbmVtaWVzLCB0aGlzLm15dGlsZXNsYXllcik7XG4gICAgICAgICAgICB0aGlzLnBoeXNpY3MuYXJjYWRlLm92ZXJsYXAodGhpcy5tYWluQ2hhcmVjdGVyLCB0aGlzLmNvaW5zLCB0aGlzLmNvbGxlY3QgLCBudWxsLCB0aGlzKTtcbiAgICAgICAgXG4gICAgICAgICAgICB0aGlzLnBoeXNpY3MuYXJjYWRlLmNvbGxpZGUodGhpcy5mb3VuZCwgdGhpcy5wbGF5ZXJCdWxsZXRzLCB0aGlzLmVuZW15U2hvdCwgbnVsbCwgdGhpcyk7XG4gICAgICAgIFxuICAgICAgICAgICAgdGhpcy5waHlzaWNzLmFyY2FkZS5jb2xsaWRlKHRoaXMubWFpbkNoYXJlY3RlciwgdGhpcy5lbmVteUJ1bGxldHMsIHRoaXMucGxheWVyU2hvdCwgbnVsbCwgdGhpcyk7XG4gICAgICAgICAgICB0aGlzLnBoeXNpY3MuYXJjYWRlLmNvbGxpZGUodGhpcy5teXRpbGVzbGF5ZXIsIHRoaXMuZW5lbXlCdWxsZXRzLCB0aGlzLmJ1bGxldFNwYXJrLCBudWxsLCB0aGlzKTtcbiAgICAgICAgICAgIHRoaXMucGh5c2ljcy5hcmNhZGUuY29sbGlkZSh0aGlzLm15dGlsZXNsYXllciwgdGhpcy5wbGF5ZXJCdWxsZXRzLCB0aGlzLnBsYXllckJ1bGxldFNwYXJrLCBudWxsLCB0aGlzKTtcbiAgICAgICAgICAgIHRoaXMucGh5c2ljcy5hcmNhZGUuY29sbGlkZSh0aGlzLmVuZW1pZXMsIHRoaXMucGxheWVyUm9ja2V0cywgdGhpcy5yb2NrZXRLaWxsLCBudWxsLCB0aGlzKTtcbiAgICAgICAgICAgIHRoaXMucGh5c2ljcy5hcmNhZGUuY29sbGlkZSh0aGlzLm15dGlsZXNsYXllciwgdGhpcy5wbGF5ZXJSb2NrZXRzLCB0aGlzLnJvY2tldEV4cGxvZGUsIG51bGwsIHRoaXMpO1xuICAgICAgICAgICAgXG4gICAgICAgIFxuICAgICAgICAgICAgXG4gICAgICAgIFxuICAgICAgICAgICAgdGhpcy5waHlzaWNzLmFyY2FkZS5vdmVybGFwKHRoaXMubWFpbkNoYXJlY3RlciwgdGhpcy5kb29yLCB0aGlzLm9wZW5Eb29yLCBudWxsLCB0aGlzKTtcbiAgICAgICAgICAgXG4gICAgfVxuICAgIFxuICAgIHJlbmRlcigpe1xuICAgICAgICBcbi8vICAgICAgICB0aGlzLmdhbWUuZGVidWcuc3ByaXRlSW5mbyh0aGlzLmNvaW5VSSwgMjAsIDMyKTtcbiAgICB9XG4gICAgXG4gICAgc2V0dXBVSSgpIHtcbiAgICAgICAgXG4gICAgICAgIHRoaXMuc3R5bGVVSSA9IHtcbiAgICAgICAgZm9udDogXCI0MHB4IEFyaWFsXCIsXG4gICAgICAgIGZpbGw6IFwiI2ZmZmZmZlwiLFxuICAgICAgICBhbGlnbjogXCJjZW50ZXJcIixcbiAgICAgICAgc3Ryb2tlOiAnIzAwMDAwMCcsXG4gICAgICAgIHN0cm9rZVRoaWNrbmVzczogMSxcbiAgICAgICAgIFxuICAgIH07XG4gICAgICAgIFxuICAgICAgICB0aGlzLlVJTGF5ZXIgPSB0aGlzLmFkZC5ncm91cCgpO1xuICAgICAgICBcbiAgICAgICAgdGhpcy5oZWFsdGhCYXIgPSBuZXcgSGVhbHRoQmFyKHRoaXMuZ2FtZSwgMCwwLCBcImhlYWx0aF9iYXJcIiwgXCJlbXB0eV9iYXJcIik7XG4gICAgICAgIHRoaXMuaGVhbHRoQmFyLmZpeGVkVG9DYW1lcmEgPSB0cnVlO1xuICAgICAgICB0aGlzLmhlYWx0aEJhci5jYW1lcmFPZmZzZXQuc2V0VG8oMTAwLCAxNSk7XG4gICAgICAgIHRoaXMuZnVlbEJhciA9IG5ldyBIZWFsdGhCYXIodGhpcy5nYW1lLCAwLDAsIFwiamV0RnVlbF9iYXJcIiwgXCJlbXB0eV9iYXJcIik7XG4gICAgICAgIHRoaXMuZnVlbEJhci5maXhlZFRvQ2FtZXJhID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5mdWVsQmFyLmNhbWVyYU9mZnNldC5zZXRUbygxMDAsIDM1KTtcbiAgICAgICAgXG4gICAgICAgIHRoaXMucGxheWVyTGlmZVVJID0gdGhpcy5nYW1lLmFkZC5zcHJpdGUoMCwwLCAnbmluamFfaGVhZCcpO1xuICAgICAgICB0aGlzLnBsYXllckxpZmVVSS5maXhlZFRvQ2FtZXJhID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5wbGF5ZXJMaWZlVUkuY2FtZXJhT2Zmc2V0LnNldFRvKDMgLDE1KTtcbiAgICAgICAgdGhpcy5saWZlVGV4dCA9IHRoaXMuYWRkLnRleHQoMCwwLFwieFwiLCB0aGlzLnN0eWxlVUkpO1xuICAgICAgICB0aGlzLmxpZmVUZXh0LmZpeGVkVG9DYW1lcmEgPXRydWU7XG4gICAgICAgIHRoaXMubGlmZVRleHQuY2FtZXJhT2Zmc2V0LnNldFRvKDU1LCAzMCk7XG4gICAgICAgIHRoaXMubGlmZVRleHQuZm9udFNpemUgPSAyNTtcbiAgICAgICAgXG4gICAgICAgIFxuICAgICAgICB0aGlzLmNvaW5VSSA9IHRoaXMuZ2FtZS5hZGQuc3ByaXRlKDAsMCwgJ2NvaW5zJywwLCk7XG4gICAgICAgIHRoaXMuY29pblVJLnNjYWxlLnNldFRvKC43NSk7XG4gICAgICAgIHRoaXMuY29pblVJLmZpeGVkVG9DYW1lcmEgPSB0cnVlO1xuICAgICAgICB0aGlzLmNvaW5VSS5jYW1lcmFPZmZzZXQuc2V0VG8odGhpcy5nYW1lLndpZHRoIC0gMjAwLDE1KTtcbiAgICAgICAgdGhpcy5jb2luVGV4dCA9IHRoaXMuZ2FtZS5hZGQudGV4dCgwLDAsIFwiMFwiLCAgdGhpcy5zdHlsZVVJICk7XG5cbiAgICAgICAgIHRoaXMuY29pblRleHQuZml4ZWRUb0NhbWVyYSA9IHRydWU7XG4gICAgICAgIHRoaXMuY29pblRleHQuY2FtZXJhT2Zmc2V0LnNldFRvKHRoaXMuZ2FtZS53aWR0aCAtIDE1MCwxNSk7XG4gICAgICAgIFxuICAgICAgICB0aGlzLmVuZW15VUkgPSB0aGlzLmdhbWUuYWRkLnNwcml0ZSgwLDAsJ2VuZW15VUknKTtcbiAgICAgICAgdGhpcy5lbmVteVVJLmZpeGVkVG9DYW1lcmEgPSB0cnVlO1xuICAgICAgICB0aGlzLmVuZW15VUkuY2FtZXJhT2Zmc2V0LnNldFRvKHRoaXMuZ2FtZS53aWR0aCAtIDIwNSw1NSk7XG4gICAgICAgICAgICAgICAgdGhpcy5lbmVteVRleHQgPSB0aGlzLmdhbWUuYWRkLnRleHQoMCwwLCBcIjAlXCIsICB0aGlzLnN0eWxlVUkpO1xuICAgICAgICBcbiAgICAgICAgdGhpcy5lbmVteVRleHQuZml4ZWRUb0NhbWVyYSA9IHRydWU7XG4gICAgICAgIHRoaXMuZW5lbXlUZXh0LmNhbWVyYU9mZnNldC5zZXRUbyh0aGlzLmdhbWUud2lkdGggLSAxNTAsNTUpO1xuICAgICAgICBcbiAgICAgICAgXG4gICAgICAgICB0aGlzLlVJTGF5ZXIuYWRkKHRoaXMuZW5lbXlVSSk7XG4gICAgICAgIHRoaXMuVUlMYXllci5hZGQodGhpcy5jb2luVUkpO1xuICAgICAgICB0aGlzLlVJTGF5ZXIuYWRkKHRoaXMuZW5lbXlVSSk7XG4gICAgICAgIHRoaXMuVUlMYXllci5hZGQodGhpcy5oZWFsdGhCYXIpO1xuICAgICAgICB0aGlzLlVJTGF5ZXIuYWRkKHRoaXMuZnVlbEJhcik7XG5cbiAgICAgICAgXG4gICAgICAgIFxuICAgIH1cbiAgICBcbiAgICBlbmVteVNob3QoZW5lbXksIGJ1bGxldCl7XG4gICAgIFxuICAgICAgICBidWxsZXQua2lsbCgpO1xuICAgICAgICBlbmVteS5lbmVteUhlYWx0aC5jdXJyZW50LS07XG5cbiAgICAgICAgIFxuICAgICAgIGlmKGVuZW15LmVuZW15SGVhbHRoLmN1cnJlbnQgPT09IDApe1xuICAgICAgICAgICBcbiAgICAgICAgICAgdGhpcy5lbmVteUNvdW50LmN1cnJlbnQtLTtcbiAgICAgICAgICAgdGhpcy5lbmVteVRleHQudGV4dCA9ICAoKDEgLSAodGhpcy5lbmVteUNvdW50LmN1cnJlbnQvdGhpcy5lbmVteUNvdW50LnRvdGFsKSkgKiAxMDApLnRvRml4ZWQoMSkgKyBcIiVcIjsgXG4gICAgICAgICAgIFxuICAgICAgICAgICAgICAgIHZhciBleHBsb3Npb24gPSB0aGlzLmV4cGxvc2lvbnMuZ2V0Rmlyc3REZWFkKCk7XG4gICAgICAgIGlmKGV4cGxvc2lvbil7XG4gICAgICAgICAgICBleHBsb3Npb24ueCA9IGVuZW15Lng7XG4gICAgICAgICAgICBleHBsb3Npb24ueSA9IGVuZW15Lnk7XG4gICAgICAgICAgICBleHBsb3Npb24ucmV2aXZlKCk7XG4gICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICBleHBsb3Npb24gPSB0aGlzLmdhbWUuYWRkLnNwcml0ZShlbmVteS54LCBlbmVteS55LCAnZXhwbG9zaW9uJyk7XG4gICAgICAgICAgIGV4cGxvc2lvbi5hbmNob3Iuc2V0VG8oLjUsLjUpO1xuICAgICAgICAgICB2YXIgZXhhbmltID0gZXhwbG9zaW9uLmFuaW1hdGlvbnMuYWRkKCdleHBsb2RlJyxbMCwxLDIsMyw0LDUsNl0sMTAsIGZhbHNlKTtcbiAgICAgICAgICAgZXhhbmltLmtpbGxPbkNvbXBsZXRlID0gdHJ1ZTsgICAgICAgXG4gICAgICAgICAgIH1cbiAgICAgICAgZXhhbmltLnBsYXkoKTsgICBcbiAgICAgICBlbmVteS5kZXN0cm95RW5lbXkgPSB0cnVlO1xuICAgICAgICAgICBcbiAgICAgICB9ZWxzZXtcblxuICAgICAgICB2YXIgZW1pdHRlciA9IHRoaXMuZ2FtZS5hZGQuZW1pdHRlcihlbmVteS54LCBlbmVteS55LCAxMDApO1xuICAgICAgICAgICAgZW1pdHRlci5tYWtlUGFydGljbGVzKCdyZWRfZmxhbWUnKTtcbiAgICAgICAgICAgIGVtaXR0ZXIubWluUGFydGljbGVTcGVlZC5zZXRUbygtMTAwLCAtMTAwKTtcbiAgICAgICAgICAgIGVtaXR0ZXIubWF4UGFydGljbGVTcGVlZC5zZXRUbygxMDAsIDEwMCk7XG4gICAgICAgICAgICBlbWl0dGVyLmdyYXZpdHkgPSAyMDtcbiAgICAgICAgICAgIGVtaXR0ZXIuc3RhcnQodHJ1ZSwgNTAwLCBudWxsLCAxMDApO1xuICAgICAgIFxuICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIFxuICAgICAgICBcbiAgICB9XG5cbiAgICBcbiAgICBwbGF5ZXJTaG90KHBsYXllciwgYnVsbGV0KXtcblxuICAgICAgICBcbiAgICAgICAgICB2YXIgZW1pdHRlciA9IHRoaXMuZ2FtZS5hZGQuZW1pdHRlcihwbGF5ZXIueCwgcGxheWVyLnksIDEwMCk7XG4gICAgICAgICAgICBlbWl0dGVyLm1ha2VQYXJ0aWNsZXMoJ2JsdWVfZmxhbWUnKTtcbiAgICAgICAgICAgIGVtaXR0ZXIubWluUGFydGljbGVTcGVlZC5zZXRUbygtMTAwLCAtMTAwKTtcbiAgICAgICAgICAgIGVtaXR0ZXIubWF4UGFydGljbGVTcGVlZC5zZXRUbygxMDAsIDEwMCk7XG4gICAgICAgICAgICBlbWl0dGVyLmdyYXZpdHkgPSAyMDtcbiAgICAgICAgICAgIGVtaXR0ZXIuc3RhcnQodHJ1ZSwgNTAwLCBudWxsLCAxMDApO1xuXG4gICAgICAgIGJ1bGxldC5raWxsKCk7XG4gICAgICAgdGhpcy5wbGF5ZXJEYW1hZ2VkKHBsYXllciwxKTtcbiAgICAgICAgfVxuICAgICAgICBcblxuXG4gICAgXG5jb2xsZWN0KHBsYXllcixjb2luKXtcbiAgICAgICAgICAgIGNvaW4ua2lsbCgpO1xuICAgICAgICAgICAgdGhpcy5zY29yZSsrO1xuICAgICAgICAgICAgdGhpcy5jb2luVGV4dC50ZXh0ID0gdGhpcy5zY29yZTtcbiAgICAgICAgICAgIHRoaXMuY29sbGVjdFNvdW5kLnBsYXkoKTtcbiAgICAgICAgfVxuICAgIFxuY29sbGVjdEhlYWx0aChwbGF5ZXIsIGhlYWx0aCl7XG4gXG4gICAgaGVhbHRoLmtpbGwoKTtcbiBcbiAgICBwbGF5ZXIuaGVhbHRoLmN1cnJlbnQgKz0gcGxheWVyLmhlYWx0aC5tYXgvMjtcbiAgICBpZihwbGF5ZXIuaGVhbHRoLmN1cnJlbnQgPiBwbGF5ZXIuaGVhbHRoLm1heCl7XG4gICAgICAgIHBsYXllci5oZWFsdGguY3VycmVudCA9IHBsYXllci5oZWFsdGgubWF4O1xuICAgIH1cbiAgICB0aGlzLmhlYWx0aEJhci5zZXRWYWx1ZShwbGF5ZXIuaGVhbHRoLmN1cnJlbnQvIHBsYXllci5oZWFsdGgubWF4KTtcblxufSAgICBcbm9wZW5Eb29yKHBsYXllciwgZG9vcil7XG4gICAgaWYodGhpcy5kb29ySXNDbG9zZWQpe1xuICAgICAgICBkb29yLnBsYXkoJ29wZW4nKTtcbiAgICAgICAgdGhpcy5kb29ySXNDbG9zZWQgPSBmYWxzZTtcbiAgICB9ZWxzZSBpZih0aGlzLm1haW5DaGFyZWN0ZXIuanVtcC5pc0Rvd24pe1xuICAgICAgICAgICAgcGxheWVyLmJvZHkudmVsb2NpdHkueSA9IDA7XG4gICAgICAgIGlmKHRoaXMuZW5lbXlDb3VudC5jdXJyZW50IDw9IHRoaXMuZW5lbXlDb3VudC50b3RhbCAqIC43NSl7XG4gICAgICAgICAgICB0aGlzLmdhbWUuc3RhdGUuc3RhcnQoJ2xldmVsMicsIHRydWUsIGZhbHNlLCB0aGlzLnNjb3JlICk7XG4gICAgICAgIH1lbHNle1xuICAgICAgICAgICAgdGhpcy5lbmVteVRleHQuYWRkQ29sb3IoJyNGRjAwMDAnLCAwKSA7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgfVxuICAgIFxuICAgIFxufSAgXG4gICAgXG4gICAgZWxlY3Ryb2N1dGUocGxheWVyLCBzaG9ja3Mpe1xuICAgIGlmKHRoaXMuZGVhdGhEZWxheSA8IHRoaXMuZ2FtZS50aW1lLm5vdyl7XG4gICAgICAgIHRoaXMuZGVhdGhEZWxheSA9IHRoaXMuZ2FtZS50aW1lLm5vdyArIFBoYXNlci5UaW1lci5TRUNPTkQgKiAuNTtcbiAgICAgICAgXG4gICAgICB0aGlzLnBsYXllckRhbWFnZWQocGxheWVyLDIpO1xuICAgICAgICBcbiAgICAgICAgXG4gICAgfSBcbiAgICB9XG4gICAgICAgXG4gICAgcGxheWVyRGFtYWdlZChwbGF5ZXIsIGRhbWFnZSl7XG4gICAgICAgICAgIGlmKHBsYXllci5oZWFsdGguY3VycmVudCA+IDApe1xuICAgICAgICAgICAgICAgY29uc29sZS5sb2cocGxheWVyLmhlYWx0aC5jdXJyZW50KTtcbiAgICAgICAgICAgIHBsYXllci5oZWFsdGguY3VycmVudC09ZGFtYWdlO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHBsYXllci5oZWFsdGguY3VycmVudCk7XG4gICAgICAgICAgICAgcGxheWVyLmZsYXNoKCk7XG4gICAgICAgIHRoaXMuaGVhbHRoQmFyLnNldFZhbHVlKHBsYXllci5oZWFsdGguY3VycmVudC8gcGxheWVyLmhlYWx0aC5tYXgpO1xuICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgIHBsYXllci5kaWVkKCk7ICAgXG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgICAgIFxuICAgICAgICBcbiAgICB9XG4gICAgXG4gICAgYnVsbGV0U3BhcmsoYnVsbGV0LCBsYXllcil7XG4gICAgICAgIHZhciBlbWl0dGVyID0gdGhpcy5nYW1lLmFkZC5lbWl0dGVyKGJ1bGxldC54LCBidWxsZXQueSwgMTAwKTtcbiAgICAgICAgICAgIGVtaXR0ZXIubWFrZVBhcnRpY2xlcygnYmx1ZV9mbGFtZScpO1xuICAgICAgICAgICAgZW1pdHRlci5taW5QYXJ0aWNsZVNwZWVkLnNldFRvKC0xMDAsIC0xMDApO1xuICAgICAgICAgICAgZW1pdHRlci5tYXhQYXJ0aWNsZVNwZWVkLnNldFRvKDEwMCwgMTAwKTtcbiAgICAgICAgICAgIGVtaXR0ZXIuZ3Jhdml0eSA9IDIwO1xuICAgICAgICAgICAgZW1pdHRlci5zdGFydCh0cnVlLCA1MDAsIG51bGwsIDEwMCk7XG4gICAgICAgIFxuICAgICAgICBcbiAgICAgICAgXG4gICAgICAgIGJ1bGxldC5raWxsKCk7XG4gICAgICAgIFxuICAgICAgICBcbiAgICAgICAgXG4gICAgfVxuICAgIFxuICAgIHBsYXllckJ1bGxldFNwYXJrKGJ1bGxldCwgbGF5ZXIpe1xuICAgICAgICBcbiAgICAgICAgICB2YXIgZW1pdHRlciA9IHRoaXMuZ2FtZS5hZGQuZW1pdHRlcihidWxsZXQueCwgYnVsbGV0LnksIDEwMCk7XG4gICAgICAgICAgICBlbWl0dGVyLm1ha2VQYXJ0aWNsZXMoJ3JlZF9mbGFtZScpO1xuICAgICAgICAgICAgZW1pdHRlci5taW5QYXJ0aWNsZVNwZWVkLnNldFRvKC0xMDAsIC0xMDApO1xuICAgICAgICAgICAgZW1pdHRlci5tYXhQYXJ0aWNsZVNwZWVkLnNldFRvKDEwMCwgMTAwKTtcbiAgICAgICAgICAgIGVtaXR0ZXIuZ3Jhdml0eSA9IDIwO1xuICAgICAgICAgICAgZW1pdHRlci5zdGFydCh0cnVlLCA1MDAsIG51bGwsIDEwMCk7XG4gICAgICAgIFxuICAgICAgICBidWxsZXQua2lsbCgpO1xuICAgIH1cbiAgICBcbiAgICByb2NrZXRLaWxsKGVuZW15LCBidWxsZXQpe1xuICAgICAgICBcbiAgICAgICAgYnVsbGV0LmtpbGwoKTtcbiAgICAgICAgZW5lbXkuZW5lbXlIZWFsdGguY3VycmVudC0tO1xuXG4gICAgICAgICBcbiAgICAgICAgICBcbiAgICAgICAgICAgdGhpcy5lbmVteUNvdW50LmN1cnJlbnQtLTtcbiAgICAgICAgICAgdGhpcy5lbmVteVRleHQudGV4dCA9ICAoKDEgLSAodGhpcy5lbmVteUNvdW50LmN1cnJlbnQvdGhpcy5lbmVteUNvdW50LnRvdGFsKSkgKiAxMDApLnRvRml4ZWQoMSkgKyBcIiVcIjsgXG4gICAgICAgICAgIFxuICAgICAgICAgICAgICAgIHZhciBleHBsb3Npb24gPSB0aGlzLmV4cGxvc2lvbnMuZ2V0Rmlyc3REZWFkKCk7XG4gICAgICAgIGlmKGV4cGxvc2lvbil7XG4gICAgICAgICAgICBleHBsb3Npb24ueCA9IGVuZW15Lng7XG4gICAgICAgICAgICBleHBsb3Npb24ueSA9IGVuZW15Lnk7XG4gICAgICAgICAgICBleHBsb3Npb24ucmV2aXZlKCk7XG4gICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICBleHBsb3Npb24gPSB0aGlzLmdhbWUuYWRkLnNwcml0ZShlbmVteS54LCBlbmVteS55LCAnZXhwbG9zaW9uJyk7XG4gICAgICAgICAgIGV4cGxvc2lvbi5hbmNob3Iuc2V0VG8oLjUsLjUpO1xuICAgICAgICAgICB2YXIgZXhhbmltID0gZXhwbG9zaW9uLmFuaW1hdGlvbnMuYWRkKCdleHBsb2RlJyxbMCwxLDIsMyw0LDUsNl0sMTAsIGZhbHNlKTtcbiAgICAgICAgICAgZXhhbmltLmtpbGxPbkNvbXBsZXRlID0gdHJ1ZTsgICAgICAgXG4gICAgICAgICAgIH1cbiAgICAgICAgZXhhbmltLnBsYXkoKTtcbiAgICAgICAgZW5lbXkuZGVzdHJveUVuZW15ID0gdHJ1ZTtcbiAgICAgICAgXG4gICAgfVxuICAgIFxuICAgIHJvY2tldEV4cGxvZGUocm9ja2V0LGxheWVyKXtcbiAgICAgICAgXG4gICAgICAgIHJvY2tldC5raWxsKCk7XG4gICAgICAgICAgIFxuICAgICAgICAgICAgICAgIHZhciBleHBsb3Npb24gPSB0aGlzLmV4cGxvc2lvbnMuZ2V0Rmlyc3REZWFkKCk7XG4gICAgICAgIGlmKGV4cGxvc2lvbil7XG4gICAgICAgICAgICBleHBsb3Npb24ueCA9IHJvY2tldC54O1xuICAgICAgICAgICAgZXhwbG9zaW9uLnkgPSByb2NrZXQueTtcbiAgICAgICAgICAgIGV4cGxvc2lvbi5yZXZpdmUoKTtcbiAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgIGV4cGxvc2lvbiA9IHRoaXMuZ2FtZS5hZGQuc3ByaXRlKHJvY2tldC54LCByb2NrZXQueSwgJ2V4cGxvc2lvbicpO1xuICAgICAgICAgICBleHBsb3Npb24uYW5jaG9yLnNldFRvKC41LC41KTtcbiAgICAgICAgICAgdmFyIGV4YW5pbSA9IGV4cGxvc2lvbi5hbmltYXRpb25zLmFkZCgnZXhwbG9kZScsWzAsMSwyLDMsNCw1LDZdLDEwLCBmYWxzZSk7XG4gICAgICAgICAgIGV4YW5pbS5raWxsT25Db21wbGV0ZSA9IHRydWU7ICAgICAgIFxuICAgICAgICAgICB9XG4gICAgICAgIGV4YW5pbS5wbGF5KCk7XG4gICAgICAgIFxuICAgIH1cbiAgICBcbiAgICAgICAgXG4gICAgXG4gICAgXG4gICAgXG59IiwiLyogZ2xvYmFsIFBoYXNlciAqL1xyXG5cclxuaW1wb3J0IFBsYXllciBmcm9tIFwiLi4vcHJlZmFicy9QbGF5ZXIuanNcIjtcclxuaW1wb3J0IEVuZW15IGZyb20gIFwiLi4vcHJlZmFicy9FbmVteS5qc1wiO1xyXG5pbXBvcnQgSGVhbHRoQmFyIGZyb20gXCIuLi9wcmVmYWJzL0hlYWx0aEJhci5qc1wiO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTGV2ZWwyIGV4dGVuZHMgUGhhc2VyLlN0YXRlIHtcclxuICAgIFxyXG4gICAgaW5pdChzY29yZSl7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5zY29yZSA9IHNjb3JlO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG5cclxuICAgIH1cclxuICAgIHByZWxvYWQoKXtcclxuICAgICAgICAgICAgICAgIHRoaXMubG9hZC5pbWFnZSgndGlsZXNldCcsJ2Fzc2V0cy9pbWcvc2NpX2ZpX3RpbGVzLnBuZycpO1xyXG4gICAgICAgICAgICB0aGlzLmxvYWQudGlsZW1hcCgnbXl0aWxlbWFwJywnYXNzZXRzL3RpbGVzL2xldmVsMi5qc29uJywgbnVsbCwgUGhhc2VyLlRpbGVtYXAuVElMRURfSlNPTik7ICAgIFxyXG4gICAgICAgIFxyXG4gICAgfVxyXG4gICAgXHJcbiAgICBjcmVhdGUoKSB7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5nYW1lLnBoeXNpY3Muc3RhcnRTeXN0ZW0oUGhhc2VyLlBoeXNpY3MuQVJDQURFKTtcclxuICAgICAgICB0aGlzLmdhbWUuc3RhZ2UuYmFja2dyb3VuZENvbG9yID0gXCIjOTE4YTg3XCI7XHJcbiAgICAgICAgXHJcbiAgICAgICAgXHJcbiAgICAgICAgICAgIHRoaXMuZG9vcklzQ2xvc2VkID0gdHJ1ZTtcclxuICAgICAgICAgICAgdGhpcy5lbmVteUNvdW50ID0ge2N1cnJlbnQ6IDAsIHRvdGFsOiAwfTtcclxuICAgICAgICAgICAgdGhpcy5kZWF0aERlbGF5ID0gMDtcclxuICAgICAgICBcclxuICAgICAgICAvL2NyZWF0ZSB0aWxlc2V0XHJcbiAgICAgICAgICAgIHRoaXMubXlUaWxlcyA9IHRoaXMuZ2FtZS5hZGQudGlsZW1hcCgnbXl0aWxlbWFwJyk7XHJcbiAgICAgICAgICAgIHRoaXMubXlUaWxlcy5hZGRUaWxlc2V0SW1hZ2UoJ3NjaV9maV90aWxlcycsICd0aWxlc2V0Jyk7XHJcbiAgICAgICAgICAgIHRoaXMubXlUaWxlcy5zZXRDb2xsaXNpb25CZXR3ZWVuKDAsNTAwKTtcclxuICAgICAgICAgICAgdGhpcy5teXRpbGViYWNrZ3JvdW5kID0gdGhpcy5teVRpbGVzLmNyZWF0ZUxheWVyKCdCYWNrZ3JvdW5kJyk7XHJcbiAgICAgICAgICAgIHRoaXMubXl0aWxlc2xheWVyID0gdGhpcy5teVRpbGVzLmNyZWF0ZUxheWVyKCdXb3JsZCcpO1xyXG4gICAgICAgICAgICB0aGlzLm15dGlsZXNsYXllci5yZXNpemVXb3JsZCgpOyBcclxuICAgICAgIFxyXG4gICAgICAgICAgdGhpcy5xdWFkVHJlZSA9IG5ldyBQaGFzZXIuUXVhZFRyZWUoMCwgMCwgdGhpcy5nYW1lLndvcmxkLndpZHRoLCB0aGlzLmdhbWUud29ybGQuaGVpZ2h0LCA0LCA0LCAwKTtcclxuICAgICAgICAgIFxyXG4gICAgICAgIFxyXG4gICAgdGhpcy5wbGF5ZXJCdWxsZXRzID0gdGhpcy5hZGQuZ3JvdXAoKTtcclxuICAgIHRoaXMucGxheWVyQnVsbGV0cy5lbmFibGVCb2R5ID0gdHJ1ZTtcclxuICAgIHRoaXMucGxheWVyQnVsbGV0cy5waHlzaWNzQm9keVR5cGUgPSBQaGFzZXIuUGh5c2ljcy5BUkNBREU7XHJcbiAgICAgICAgXHJcbiAgICAgdGhpcy5wbGF5ZXJSb2NrZXRzID0gdGhpcy5hZGQuZ3JvdXAoKTtcclxuICAgIHRoaXMucGxheWVyUm9ja2V0cy5lbmFibGVCb2R5ID0gdHJ1ZTtcclxuICAgIHRoaXMucGxheWVyUm9ja2V0cy5waHlzaWNzQm9keVR5cGUgPSBQaGFzZXIuUGh5c2ljcy5BUkNBREU7ICAgIFxyXG4gICAgICAgIFxyXG4gICAgIHRoaXMuZW5lbXlCdWxsZXRzID0gdGhpcy5hZGQuZ3JvdXAoKTtcclxuICAgIHRoaXMuZW5lbXlCdWxsZXRzLmVuYWJsZUJvZHkgPSB0cnVlO1xyXG4gICAgdGhpcy5lbmVteUJ1bGxldHMucGh5c2ljc0JvZHlUeXBlID0gUGhhc2VyLlBoeXNpY3MuQVJDQURFOyBcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLnNldHVwVUkoKTtcclxuICAgXHJcbiAgICAgICAgXHJcbiAgIC8vY3JlYXRlIGRvb3IgICAgIFxyXG4gICB0aGlzLm15VGlsZXMuY3JlYXRlRnJvbU9iamVjdHMoJ0Rvb3InLDYxOCwnZG9vcicsMCx0cnVlLCBmYWxzZSk7ICAgIFxyXG4gICB0aGlzLmRvb3IgPSB0aGlzLndvcmxkLmdldFRvcCgpO1xyXG4gICB0aGlzLmdhbWUucGh5c2ljcy5hcmNhZGUuZW5hYmxlKHRoaXMuZG9vcik7XHJcbiAgIHRoaXMuZG9vci5hbmltYXRpb25zLmFkZCgnb3BlbicsWzAsMSwyLDMsNF0sIDEwLCBmYWxzZSk7XHJcbiAgICAgICAgXHJcbiAgICBcclxuICAgIFxyXG4gICAgLy9jcmVhdGUgbWFpbiBDaGFyZWN0ZXIgICAgXHJcbi8vICAgIHRoaXMubWFpbkNoYXJlY3RlciA9IG5ldyBQbGF5ZXIodGhpcy5nYW1lLCA0MDAsIDUwLCB0aGlzLnBsYXllckJ1bGxldHMsIHRoaXMucGxheWVyUm9ja2V0cywgdGhpcy5mdWVsQmFyLCB0aGlzLmhlYWx0aEJhcik7XHJcbi8vICAgIHRoaXMuZ2FtZS5hZGQuZXhpc3RpbmcodGhpcy5tYWluQ2hhcmVjdGVyKTtcclxuICAgICAgICBcclxuICAgIHRoaXMubXlUaWxlcy5jcmVhdGVGcm9tT2JqZWN0cygnUGxheWVyJyw1MTksJ251bGwnLCdudWxsJyx0cnVlLCBmYWxzZSwgdGhpcy53b3JsZCwgUGxheWVyKTtcclxuICAgIHRoaXMubWFpbkNoYXJlY3RlciA9IHRoaXMud29ybGQuZ2V0VG9wKCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5tYWluQ2hhcmVjdGVyLmJ1bGxldHMgPSB0aGlzLnBsYXllckJ1bGxldHM7XHJcbiAgICAgICAgdGhpcy5tYWluQ2hhcmVjdGVyLnJvY2tldHMgPSB0aGlzLnBsYXllclJvY2tldHM7XHJcbiAgICAgICAgdGhpcy5tYWluQ2hhcmVjdGVyLmZ1ZWxVSSA9IHRoaXMuZnVlbEJhcjtcclxuICAgICAgICB0aGlzLm1haW5DaGFyZWN0ZXIuaGVhbHRoVUkgPSB0aGlzLmhlYWx0aEJhcjtcclxuICAgICAgICB0aGlzLm1haW5DaGFyZWN0ZXIubGlmZVVJID0gdGhpcy5saWZlVGV4dDtcclxuICAgICAgICB0aGlzLmxpZmVUZXh0LnRleHQgPSBcInggXCIgKyB0aGlzLm1haW5DaGFyZWN0ZXIubGl2ZXM7XHJcbiAgICAgICAgXHJcbiAgICB0aGlzLmdhbWUuY2FtZXJhLmZvbGxvdyh0aGlzLm1haW5DaGFyZWN0ZXIpO1xyXG4gICAgICAgICAgICAgIFxyXG4gICAgICAgIC8vcGxhY2UgZW5lbWllc1xyXG4gICAgICAgIHRoaXMuZW5lbWllcyA9IHRoaXMuYWRkLmdyb3VwKCk7XHJcbiAgICAgICAgdGhpcy5teVRpbGVzLmNyZWF0ZUZyb21PYmplY3RzKCdFbmVtaWVzJywgNjIzLCAnbnVsbCcsICdudWxsJywgdHJ1ZSwgZmFsc2UsIHRoaXMuZW5lbWllcywgRW5lbXkpO1xyXG4gICAgICAgIHRoaXMuZW5lbWllcy5zZXRBbGwoJ3BsYXllcicsIHRoaXMubWFpbkNoYXJlY3Rlcik7XHJcbiAgICAgICAgdGhpcy5lbmVtaWVzLnNldEFsbCgnYnVsbGV0cycsIHRoaXMuZW5lbXlCdWxsZXRzKTtcclxuICAgICAgICB0aGlzLmVuZW1pZXMuc2V0QWxsKCdsYXllcicsIHRoaXMubXl0aWxlc2xheWVyKTtcclxuICAgICAgICB0aGlzLmVuZW1pZXMuc2V0QWxsKCdkZXRlY3REaXN0YW5jZScsIDkwMCk7XHJcbiAgICAgICAgdGhpcy5lbmVtaWVzLnNldEFsbCgnc2hvdHNQZXJTZWNvbmQnLCAxLjUpO1xyXG4gICAgICAgIHRoaXMuZW5lbXlDb3VudC5jdXJyZW50ID0gdGhpcy5lbmVteUNvdW50LnRvdGFsID0gdGhpcy5lbmVtaWVzLmxlbmd0aDtcclxuICAgICAgICBcclxuICAgICAgICBjb25zb2xlLmxvZyh0aGlzLmVuZW1pZXMpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIFxyXG4gICAgICAgIFxyXG4gICAgICAgICAgICB0aGlzLmNvbGxlY3RTb3VuZCA9IHRoaXMuYWRkLmF1ZGlvKCdjb2xsZWN0Jyk7XHJcbiAgICAgICAgICAgIHRoaXMuamV0QXVkaW8gPSB0aGlzLmFkZC5hdWRpbygnamV0cycpO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgXHJcbiAgICAgICAgICAgXHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgXHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB0aGlzLmNvaW5zID0gdGhpcy5hZGQuZ3JvdXAoKTtcclxuICAgICAgICAgICAgdGhpcy5jb2lucy5lbmFibGVCb2R5ID0gdHJ1ZTtcclxuICAgICAgICAgICAgdGhpcy5teVRpbGVzLmNyZWF0ZUZyb21PYmplY3RzKCdnZW1zJywgNjgxLCAnY29pbnMnLCAwLCB0cnVlLCBmYWxzZSwgdGhpcy5jb2lucyk7XHJcblxyXG4gIC8vICBBZGQgYW5pbWF0aW9ucyB0byBhbGwgb2YgdGhlIGNvaW4gc3ByaXRlc1xyXG4gICAgICAgICAgIFxyXG4gICAgdGhpcy5jb2lucy5jYWxsQWxsKCdhbmltYXRpb25zLmFkZCcsICdhbmltYXRpb25zJywgJ3NwaW4nLCBbMCwgMSwgMiwgMywgNCwgNV0sIDEwLCB0cnVlKTtcclxuICAgIHRoaXMuY29pbnMuY2FsbEFsbCgnYW5pbWF0aW9ucy5wbGF5JywgJ2FuaW1hdGlvbnMnLCAnc3BpbicpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMuc2hvY2tzID0gdGhpcy5hZGQuZ3JvdXAoKTtcclxuICAgICAgICB0aGlzLnNob2Nrcy5lbmFibGVCb2R5ID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLm15VGlsZXMuY3JlYXRlRnJvbU9iamVjdHMoJ1Nob2NrcycsIDcxMiwgJ3Nob2NrJywgMCwgdHJ1ZSwgZmFsc2UsIHRoaXMuc2hvY2tzKTtcclxuICAgICAgICB0aGlzLnNob2Nrcy5zZXRBbGwoJ2JvZHkuaW1tb3ZhYmxlJywgdHJ1ZSk7XHJcbiAgICAgICAgdGhpcy5zaG9ja3MuY2FsbEFsbCgnYm9keS5zZXRTaXplJywgJ2JvZHknICwgMTI4LCAxMCwgMCwgNTkpO1xyXG4gICAgICAgIHRoaXMuc2hvY2tzLmNhbGxBbGwoJ2FuaW1hdGlvbnMuYWRkJywgJ2FuaW1hdGlvbnMnLCAnd2lnZ2xlJywgWzAsIDEsIDIsIDNdLCAxMCwgdHJ1ZSk7XHJcbiAgICAgICAgdGhpcy5zaG9ja3MuY2FsbEFsbCgnYW5pbWF0aW9ucy5wbGF5JywgJ2FuaW1hdGlvbnMnLCAnd2lnZ2xlJyk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgIHRoaXMudmVydFNob2NrcyA9IHRoaXMuYWRkLmdyb3VwKCk7XHJcbiAgICAgICAgdGhpcy52ZXJ0U2hvY2tzLmVuYWJsZUJvZHkgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMubXlUaWxlcy5jcmVhdGVGcm9tT2JqZWN0cygnU2hvY2tzJywgNzA1LCAnc2hvY2snLCAwLCB0cnVlLCBmYWxzZSwgdGhpcy52ZXJ0U2hvY2tzKTtcclxuICAgICAgICB0aGlzLnZlcnRTaG9ja3Muc2V0QWxsKCdib2R5LmltbW92YWJsZScsIHRydWUpO1xyXG4gICAgICAgIHRoaXMudmVydFNob2Nrcy5jYWxsQWxsKCdib2R5LnNldFNpemUnLCAnYm9keScgLCAxMCwgMTI4LCA1OSwgMCk7XHJcbiAgICAgICAgdGhpcy52ZXJ0U2hvY2tzLmNhbGxBbGwoJ2FuaW1hdGlvbnMuYWRkJywgJ2FuaW1hdGlvbnMnLCAndmVydF93aWdnbGUnLCBbOCwgOSwgMTAsIDExXSwgMTAsIHRydWUpO1xyXG4gICAgICAgIHRoaXMudmVydFNob2Nrcy5jYWxsQWxsKCdhbmltYXRpb25zLnBsYXknLCAnYW5pbWF0aW9ucycsICd2ZXJ0X3dpZ2dsZScpO1xyXG4gICAgICAgIFxyXG4gICAgICAgICAgdGhpcy5oZWFsdGhQYWNrcyA9IHRoaXMuYWRkLmdyb3VwKCk7XHJcbiAgICAgICAgdGhpcy5oZWFsdGhQYWNrcy5lbmFibGVCb2R5ID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLm15VGlsZXMuY3JlYXRlRnJvbU9iamVjdHMoJ0hlYWx0aCcsIDcyNywgJ2hlYWx0aF9wYWNrJywgMCwgdHJ1ZSwgZmFsc2UsIHRoaXMuaGVhbHRoUGFja3MpO1xyXG4gICAgICAgIHRoaXMuaGVhbHRoUGFja3Muc2V0QWxsKCdib2R5LmltbW92YWJsZScsIHRydWUpO1xyXG4vLyAgICAgICAgdGhpcy5oZWFsdGhQYWNrcy5jYWxsQWxsKCdib2R5LnNldFNpemUnLCAnYm9keScgLCAxMCwgMTI4LCA1OSwgMCk7XHJcbiAgICAgXHJcbiAgICAgICAgXHJcbiAgICBcclxuICAgICAgICB0aGlzLmV4cGxvc2lvbnMgPSB0aGlzLmFkZC5ncm91cCgpOyBcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgIFxyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgXHJcbiAgIFxyXG4gICAgICAgIFxyXG4gICAgICAgICAgICBcclxuICBcclxuICAgICAgICAgICAgXHJcbiAgICAgICBcclxuICAgIH1cclxuICAgIFxyXG4gICAgdXBkYXRlKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucXVhZFRyZWUuY2xlYXIoKTtcclxuICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICBmb3IodmFyIGkgPSAwOyBpPCB0aGlzLmVuZW1pZXMubGVuZ3RoOyBpKyspe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmVuZW1pZXMuZ2V0QXQoaSkuZW5lbXlVcGRhdGUgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucXVhZFRyZWUuaW5zZXJ0KHRoaXMuZW5lbWllcy5nZXRBdChpKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4vLyAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5mb3VuZCA9IHRoaXMucXVhZFRyZWUucmV0cmlldmUodGhpcy5tYWluQ2hhcmVjdGVyKTtcclxuLy8gICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIGZvcih2YXIgaSA9IDA7IGkgPCB0aGlzLmZvdW5kLmxlbmd0aDsgaSsrICl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmZvdW5kW2ldLmVuZW15VXBkYXRlID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKHRoaXMuZm91bmRbaV0uZGVzdHJveUVuZW15KXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZm91bmRbaV0uZGVzdHJveSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIFxyXG4gICAgICAgICAgICB0aGlzLnBoeXNpY3MuYXJjYWRlLm92ZXJsYXAodGhpcy5tYWluQ2hhcmVjdGVyLCB0aGlzLmhlYWx0aFBhY2tzLCB0aGlzLmNvbGxlY3RIZWFsdGgsIG51bGwsIHRoaXMpO1xyXG4gICAgICAgICAgICB0aGlzLnBoeXNpY3MuYXJjYWRlLm92ZXJsYXAodGhpcy5tYWluQ2hhcmVjdGVyLCB0aGlzLnNob2NrcywgdGhpcy5lbGVjdHJvY3V0ZSwgbnVsbCwgdGhpcyk7XHJcbiAgICAgICAgICAgIHRoaXMucGh5c2ljcy5hcmNhZGUub3ZlcmxhcCh0aGlzLm1haW5DaGFyZWN0ZXIsIHRoaXMudmVydFNob2NrcywgdGhpcy5lbGVjdHJvY3V0ZSwgbnVsbCwgdGhpcyk7XHJcbiAgICAgICAgICAgIHRoaXMucGh5c2ljcy5hcmNhZGUuY29sbGlkZSh0aGlzLm1haW5DaGFyZWN0ZXIsIHRoaXMubXl0aWxlc2xheWVyKTtcclxuICAgICAgICAgICAgdGhpcy5waHlzaWNzLmFyY2FkZS5jb2xsaWRlKHRoaXMuZW5lbWllcywgdGhpcy5teXRpbGVzbGF5ZXIpO1xyXG4gICAgICAgICAgICB0aGlzLnBoeXNpY3MuYXJjYWRlLm92ZXJsYXAodGhpcy5tYWluQ2hhcmVjdGVyLCB0aGlzLmNvaW5zLCB0aGlzLmNvbGxlY3QgLCBudWxsLCB0aGlzKTtcclxuICAgICAgICBcclxuICAgICAgICAgICAgdGhpcy5waHlzaWNzLmFyY2FkZS5jb2xsaWRlKHRoaXMuZm91bmQsIHRoaXMucGxheWVyQnVsbGV0cywgdGhpcy5lbmVteVNob3QsIG51bGwsIHRoaXMpO1xyXG4gICAgICAgIFxyXG4gICAgICAgICAgICB0aGlzLnBoeXNpY3MuYXJjYWRlLmNvbGxpZGUodGhpcy5tYWluQ2hhcmVjdGVyLCB0aGlzLmVuZW15QnVsbGV0cywgdGhpcy5wbGF5ZXJTaG90LCBudWxsLCB0aGlzKTtcclxuICAgICAgICAgICAgdGhpcy5waHlzaWNzLmFyY2FkZS5jb2xsaWRlKHRoaXMubXl0aWxlc2xheWVyLCB0aGlzLmVuZW15QnVsbGV0cywgdGhpcy5idWxsZXRTcGFyaywgbnVsbCwgdGhpcyk7XHJcbiAgICAgICAgICAgIHRoaXMucGh5c2ljcy5hcmNhZGUuY29sbGlkZSh0aGlzLm15dGlsZXNsYXllciwgdGhpcy5wbGF5ZXJCdWxsZXRzLCB0aGlzLnBsYXllckJ1bGxldFNwYXJrLCBudWxsLCB0aGlzKTtcclxuICAgICAgICAgICAgdGhpcy5waHlzaWNzLmFyY2FkZS5jb2xsaWRlKHRoaXMuZW5lbWllcywgdGhpcy5wbGF5ZXJSb2NrZXRzLCB0aGlzLnJvY2tldEtpbGwsIG51bGwsIHRoaXMpO1xyXG4gICAgICAgICAgICB0aGlzLnBoeXNpY3MuYXJjYWRlLmNvbGxpZGUodGhpcy5teXRpbGVzbGF5ZXIsIHRoaXMucGxheWVyUm9ja2V0cywgdGhpcy5yb2NrZXRFeHBsb2RlLCBudWxsLCB0aGlzKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgXHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgIFxyXG4gICAgICAgICAgICB0aGlzLnBoeXNpY3MuYXJjYWRlLm92ZXJsYXAodGhpcy5tYWluQ2hhcmVjdGVyLCB0aGlzLmRvb3IsIHRoaXMub3BlbkRvb3IsIG51bGwsIHRoaXMpO1xyXG4gICAgICAgICAgIFxyXG4gICAgfVxyXG4gICAgXHJcbiAgICByZW5kZXIoKXtcclxuICAgICAgICBcclxuLy8gICAgICAgIHRoaXMuZ2FtZS5kZWJ1Zy5zcHJpdGVJbmZvKHRoaXMuY29pblVJLCAyMCwgMzIpO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBzZXR1cFVJKCkge1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMuc3R5bGVVSSA9IHtcclxuICAgICAgICBmb250OiBcIjQwcHggQXJpYWxcIixcclxuICAgICAgICBmaWxsOiBcIiNmZmZmZmZcIixcclxuICAgICAgICBhbGlnbjogXCJjZW50ZXJcIixcclxuICAgICAgICBzdHJva2U6ICcjMDAwMDAwJyxcclxuICAgICAgICBzdHJva2VUaGlja25lc3M6IDEsXHJcbiAgICAgICAgIFxyXG4gICAgfTtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLlVJTGF5ZXIgPSB0aGlzLmFkZC5ncm91cCgpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMuaGVhbHRoQmFyID0gbmV3IEhlYWx0aEJhcih0aGlzLmdhbWUsIDAsMCwgXCJoZWFsdGhfYmFyXCIsIFwiZW1wdHlfYmFyXCIpO1xyXG4gICAgICAgIHRoaXMuaGVhbHRoQmFyLmZpeGVkVG9DYW1lcmEgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMuaGVhbHRoQmFyLmNhbWVyYU9mZnNldC5zZXRUbygxMDAsIDE1KTtcclxuICAgICAgICB0aGlzLmZ1ZWxCYXIgPSBuZXcgSGVhbHRoQmFyKHRoaXMuZ2FtZSwgMCwwLCBcImpldEZ1ZWxfYmFyXCIsIFwiZW1wdHlfYmFyXCIpO1xyXG4gICAgICAgIHRoaXMuZnVlbEJhci5maXhlZFRvQ2FtZXJhID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLmZ1ZWxCYXIuY2FtZXJhT2Zmc2V0LnNldFRvKDEwMCwgMzUpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMucGxheWVyTGlmZVVJID0gdGhpcy5nYW1lLmFkZC5zcHJpdGUoMCwwLCAnbmluamFfaGVhZCcpO1xyXG4gICAgICAgIHRoaXMucGxheWVyTGlmZVVJLmZpeGVkVG9DYW1lcmEgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMucGxheWVyTGlmZVVJLmNhbWVyYU9mZnNldC5zZXRUbygzICwxNSk7XHJcbiAgICAgICAgdGhpcy5saWZlVGV4dCA9IHRoaXMuYWRkLnRleHQoMCwwLFwieFwiLCB0aGlzLnN0eWxlVUkpO1xyXG4gICAgICAgIHRoaXMubGlmZVRleHQuZml4ZWRUb0NhbWVyYSA9dHJ1ZTtcclxuICAgICAgICB0aGlzLmxpZmVUZXh0LmNhbWVyYU9mZnNldC5zZXRUbyg1NSwgMzApO1xyXG4gICAgICAgIHRoaXMubGlmZVRleHQuZm9udFNpemUgPSAyNTtcclxuICAgICAgICBcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLmNvaW5VSSA9IHRoaXMuZ2FtZS5hZGQuc3ByaXRlKDAsMCwgJ2NvaW5zJywwLCk7XHJcbiAgICAgICAgdGhpcy5jb2luVUkuc2NhbGUuc2V0VG8oLjc1KTtcclxuICAgICAgICB0aGlzLmNvaW5VSS5maXhlZFRvQ2FtZXJhID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLmNvaW5VSS5jYW1lcmFPZmZzZXQuc2V0VG8odGhpcy5nYW1lLndpZHRoIC0gMjAwLDE1KTtcclxuICAgICAgICB0aGlzLmNvaW5UZXh0ID0gdGhpcy5nYW1lLmFkZC50ZXh0KDAsMCwgXCIwXCIsICB0aGlzLnN0eWxlVUkgKTtcclxuXHJcbiAgICAgICAgdGhpcy5jb2luVGV4dC5maXhlZFRvQ2FtZXJhID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLmNvaW5UZXh0LmNhbWVyYU9mZnNldC5zZXRUbyh0aGlzLmdhbWUud2lkdGggLSAxNTAsMTUpO1xyXG4gICAgICAgIHRoaXMuY29pblRleHQudGV4dCA9IHRoaXMuc2NvcmU7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5lbmVteVVJID0gdGhpcy5nYW1lLmFkZC5zcHJpdGUoMCwwLCdlbmVteVVJJyk7XHJcbiAgICAgICAgdGhpcy5lbmVteVVJLmZpeGVkVG9DYW1lcmEgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMuZW5lbXlVSS5jYW1lcmFPZmZzZXQuc2V0VG8odGhpcy5nYW1lLndpZHRoIC0gMjA1LDU1KTtcclxuICAgICAgICAgICAgICAgIHRoaXMuZW5lbXlUZXh0ID0gdGhpcy5nYW1lLmFkZC50ZXh0KDAsMCwgXCIwJVwiLCAgdGhpcy5zdHlsZVVJKTtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLmVuZW15VGV4dC5maXhlZFRvQ2FtZXJhID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLmVuZW15VGV4dC5jYW1lcmFPZmZzZXQuc2V0VG8odGhpcy5nYW1lLndpZHRoIC0gMTUwLDU1KTtcclxuICAgICAgICBcclxuICAgICAgICBcclxuICAgICAgICAgdGhpcy5VSUxheWVyLmFkZCh0aGlzLmVuZW15VUkpO1xyXG4gICAgICAgIHRoaXMuVUlMYXllci5hZGQodGhpcy5jb2luVUkpO1xyXG4gICAgICAgIHRoaXMuVUlMYXllci5hZGQodGhpcy5lbmVteVVJKTtcclxuICAgICAgICB0aGlzLlVJTGF5ZXIuYWRkKHRoaXMuaGVhbHRoQmFyKTtcclxuICAgICAgICB0aGlzLlVJTGF5ZXIuYWRkKHRoaXMuZnVlbEJhcik7XHJcblxyXG4gICAgICAgIFxyXG4gICAgICAgIFxyXG4gICAgfVxyXG4gICAgXHJcbiAgICBlbmVteVNob3QoZW5lbXksIGJ1bGxldCl7XHJcbiAgICAgXHJcbiAgICAgICAgYnVsbGV0LmtpbGwoKTtcclxuICAgICAgICBlbmVteS5lbmVteUhlYWx0aC5jdXJyZW50LS07XHJcblxyXG4gICAgICAgICBcclxuICAgICAgIGlmKGVuZW15LmVuZW15SGVhbHRoLmN1cnJlbnQgPT09IDApe1xyXG4gICAgICAgICAgIFxyXG4gICAgICAgICAgIHRoaXMuZW5lbXlDb3VudC5jdXJyZW50LS07XHJcbiAgICAgICAgICAgdGhpcy5lbmVteVRleHQudGV4dCA9ICgoMSAtICh0aGlzLmVuZW15Q291bnQuY3VycmVudC90aGlzLmVuZW15Q291bnQudG90YWwpKSAqIDEwMCkudG9GaXhlZCgxKSArIFwiJVwiOyAgXHJcbiAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICB2YXIgZXhwbG9zaW9uID0gdGhpcy5leHBsb3Npb25zLmdldEZpcnN0RGVhZCgpO1xyXG4gICAgICAgIGlmKGV4cGxvc2lvbil7XHJcbiAgICAgICAgICAgIGV4cGxvc2lvbi54ID0gZW5lbXkueDtcclxuICAgICAgICAgICAgZXhwbG9zaW9uLnkgPSBlbmVteS55O1xyXG4gICAgICAgICAgICBleHBsb3Npb24ucmV2aXZlKCk7XHJcbiAgICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgZXhwbG9zaW9uID0gdGhpcy5nYW1lLmFkZC5zcHJpdGUoZW5lbXkueCwgZW5lbXkueSwgJ2V4cGxvc2lvbicpO1xyXG4gICAgICAgICAgIGV4cGxvc2lvbi5hbmNob3Iuc2V0VG8oLjUsLjUpO1xyXG4gICAgICAgICAgIHZhciBleGFuaW0gPSBleHBsb3Npb24uYW5pbWF0aW9ucy5hZGQoJ2V4cGxvZGUnLFswLDEsMiwzLDQsNSw2XSwxMCwgZmFsc2UpO1xyXG4gICAgICAgICAgIGV4YW5pbS5raWxsT25Db21wbGV0ZSA9IHRydWU7ICAgICAgIFxyXG4gICAgICAgICAgIH1cclxuICAgICAgICBleGFuaW0ucGxheSgpOyAgIFxyXG4gICAgICAgZW5lbXkuZGVzdHJveUVuZW15ID0gdHJ1ZTtcclxuICAgICAgICAgICBcclxuICAgICAgIH1lbHNle1xyXG5cclxuICAgICAgICB2YXIgZW1pdHRlciA9IHRoaXMuZ2FtZS5hZGQuZW1pdHRlcihlbmVteS54LCBlbmVteS55LCAxMDApO1xyXG4gICAgICAgICAgICBlbWl0dGVyLm1ha2VQYXJ0aWNsZXMoJ3JlZF9mbGFtZScpO1xyXG4gICAgICAgICAgICBlbWl0dGVyLm1pblBhcnRpY2xlU3BlZWQuc2V0VG8oLTEwMCwgLTEwMCk7XHJcbiAgICAgICAgICAgIGVtaXR0ZXIubWF4UGFydGljbGVTcGVlZC5zZXRUbygxMDAsIDEwMCk7XHJcbiAgICAgICAgICAgIGVtaXR0ZXIuZ3Jhdml0eSA9IDIwO1xyXG4gICAgICAgICAgICBlbWl0dGVyLnN0YXJ0KHRydWUsIDUwMCwgbnVsbCwgMTAwKTtcclxuICAgICAgIFxyXG4gICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIFxyXG4gICAgICAgIFxyXG4gICAgfVxyXG5cclxuICAgIFxyXG4gICAgcGxheWVyU2hvdChwbGF5ZXIsIGJ1bGxldCl7XHJcblxyXG4gICAgICAgIFxyXG4gICAgICAgICAgdmFyIGVtaXR0ZXIgPSB0aGlzLmdhbWUuYWRkLmVtaXR0ZXIocGxheWVyLngsIHBsYXllci55LCAxMDApO1xyXG4gICAgICAgICAgICBlbWl0dGVyLm1ha2VQYXJ0aWNsZXMoJ2JsdWVfZmxhbWUnKTtcclxuICAgICAgICAgICAgZW1pdHRlci5taW5QYXJ0aWNsZVNwZWVkLnNldFRvKC0xMDAsIC0xMDApO1xyXG4gICAgICAgICAgICBlbWl0dGVyLm1heFBhcnRpY2xlU3BlZWQuc2V0VG8oMTAwLCAxMDApO1xyXG4gICAgICAgICAgICBlbWl0dGVyLmdyYXZpdHkgPSAyMDtcclxuICAgICAgICAgICAgZW1pdHRlci5zdGFydCh0cnVlLCA1MDAsIG51bGwsIDEwMCk7XHJcblxyXG4gICAgICAgIGJ1bGxldC5raWxsKCk7XHJcbiAgICAgICB0aGlzLnBsYXllckRhbWFnZWQocGxheWVyLCAxKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcblxyXG5cclxuICAgIFxyXG5jb2xsZWN0KHBsYXllcixjb2luKXtcclxuICAgICAgICAgICAgY29pbi5raWxsKCk7XHJcbiAgICAgICAgICAgIHRoaXMuc2NvcmUrKztcclxuICAgICAgICAgICAgdGhpcy5jb2luVGV4dC50ZXh0ID0gdGhpcy5zY29yZTtcclxuICAgICAgICAgICAgdGhpcy5jb2xsZWN0U291bmQucGxheSgpO1xyXG4gICAgICAgIH1cclxuICAgIFxyXG5jb2xsZWN0SGVhbHRoKHBsYXllciwgaGVhbHRoKXtcclxuIFxyXG4gICAgaGVhbHRoLmtpbGwoKTtcclxuICAgIFxyXG4gICAgcGxheWVyLmhlYWx0aC5jdXJyZW50ICs9IHBsYXllci5oZWFsdGgubWF4LzI7XHJcbiAgICBpZihwbGF5ZXIuaGVhbHRoLmN1cnJlbnQgPiBwbGF5ZXIuaGVhbHRoLm1heCl7XHJcbiAgICAgICAgcGxheWVyLmhlYWx0aC5jdXJyZW50ID0gcGxheWVyLmhlYWx0aC5tYXg7XHJcbiAgICB9XHJcbiAgICB0aGlzLmhlYWx0aEJhci5zZXRWYWx1ZShwbGF5ZXIuaGVhbHRoLmN1cnJlbnQvIHBsYXllci5oZWFsdGgubWF4KTtcclxuXHJcbn0gICAgXHJcbm9wZW5Eb29yKHBsYXllciwgZG9vcil7XHJcbiAgICBpZih0aGlzLmRvb3JJc0Nsb3NlZCl7XHJcbiAgICAgICAgZG9vci5wbGF5KCdvcGVuJyk7XHJcbiAgICAgICAgdGhpcy5kb29ySXNDbG9zZWQgPSBmYWxzZTtcclxuICAgIH1lbHNlIGlmKHRoaXMubWFpbkNoYXJlY3Rlci5qdW1wLmlzRG93bil7XHJcbiAgICAgICAgICAgIHBsYXllci5ib2R5LnZlbG9jaXR5LnkgPSAwO1xyXG4gICAgICAgIGlmKHRoaXMuZW5lbXlDb3VudC5jdXJyZW50IDw9IHRoaXMuZW5lbXlDb3VudC50b3RhbCAqIC43NSl7XHJcbiAgICAgICAgICAgIHRoaXMuZ2FtZS5zdGF0ZS5zdGFydCgnbWVudScsIHRydWUsIGZhbHNlKTtcclxuICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgdGhpcy5lbmVteVRleHQuYWRkQ29sb3IoJyNGRjAwMDAnLCAwKSA7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgfVxyXG4gICAgXHJcbiAgICBcclxufSAgXHJcbiAgICBcclxuICAgIGVsZWN0cm9jdXRlKHBsYXllciwgc2hvY2tzKXtcclxuICAgIGlmKHRoaXMuZGVhdGhEZWxheSA8IHRoaXMuZ2FtZS50aW1lLm5vdyl7XHJcbiAgICAgICAgdGhpcy5kZWF0aERlbGF5ID0gdGhpcy5nYW1lLnRpbWUubm93ICsgUGhhc2VyLlRpbWVyLlNFQ09ORCAqIC41O1xyXG4gICAgICAgIFxyXG4gICAgICB0aGlzLnBsYXllckRhbWFnZWQocGxheWVyLCAzKTtcclxuICAgICAgICBcclxuICAgICAgICBcclxuICAgIH0gXHJcbiAgICB9XHJcbiAgICAgICBcclxuICAgIHBsYXllckRhbWFnZWQocGxheWVyLCBkYW1hZ2Upe1xyXG4gICAgICAgICAgIGlmKHBsYXllci5oZWFsdGguY3VycmVudCA+IDApe1xyXG4gICAgICAgICAgICBwbGF5ZXIuaGVhbHRoLmN1cnJlbnQtPWRhbWFnZTtcclxuICAgICAgICAgICAgIHBsYXllci5mbGFzaCgpO1xyXG4gICAgICAgIHRoaXMuaGVhbHRoQmFyLnNldFZhbHVlKHBsYXllci5oZWFsdGguY3VycmVudC8gcGxheWVyLmhlYWx0aC5tYXgpO1xyXG4gICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICBwbGF5ZXIuZGllZCgpOyAgIFxyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICAgICBcclxuICAgICAgICBcclxuICAgIH1cclxuICAgIFxyXG4gICAgYnVsbGV0U3BhcmsoYnVsbGV0LCBsYXllcil7XHJcbiAgICAgICAgdmFyIGVtaXR0ZXIgPSB0aGlzLmdhbWUuYWRkLmVtaXR0ZXIoYnVsbGV0LngsIGJ1bGxldC55LCAxMDApO1xyXG4gICAgICAgICAgICBlbWl0dGVyLm1ha2VQYXJ0aWNsZXMoJ2JsdWVfZmxhbWUnKTtcclxuICAgICAgICAgICAgZW1pdHRlci5taW5QYXJ0aWNsZVNwZWVkLnNldFRvKC0xMDAsIC0xMDApO1xyXG4gICAgICAgICAgICBlbWl0dGVyLm1heFBhcnRpY2xlU3BlZWQuc2V0VG8oMTAwLCAxMDApO1xyXG4gICAgICAgICAgICBlbWl0dGVyLmdyYXZpdHkgPSAyMDtcclxuICAgICAgICAgICAgZW1pdHRlci5zdGFydCh0cnVlLCA1MDAsIG51bGwsIDEwMCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgXHJcbiAgICAgICAgXHJcbiAgICAgICAgYnVsbGV0LmtpbGwoKTtcclxuICAgICAgICBcclxuICAgICAgICBcclxuICAgICAgICBcclxuICAgIH1cclxuICAgIFxyXG4gICAgcGxheWVyQnVsbGV0U3BhcmsoYnVsbGV0LCBsYXllcil7XHJcbiAgICAgICAgXHJcbiAgICAgICAgICB2YXIgZW1pdHRlciA9IHRoaXMuZ2FtZS5hZGQuZW1pdHRlcihidWxsZXQueCwgYnVsbGV0LnksIDEwMCk7XHJcbiAgICAgICAgICAgIGVtaXR0ZXIubWFrZVBhcnRpY2xlcygncmVkX2ZsYW1lJyk7XHJcbiAgICAgICAgICAgIGVtaXR0ZXIubWluUGFydGljbGVTcGVlZC5zZXRUbygtMTAwLCAtMTAwKTtcclxuICAgICAgICAgICAgZW1pdHRlci5tYXhQYXJ0aWNsZVNwZWVkLnNldFRvKDEwMCwgMTAwKTtcclxuICAgICAgICAgICAgZW1pdHRlci5ncmF2aXR5ID0gMjA7XHJcbiAgICAgICAgICAgIGVtaXR0ZXIuc3RhcnQodHJ1ZSwgNTAwLCBudWxsLCAxMDApO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGJ1bGxldC5raWxsKCk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHJvY2tldEtpbGwoZW5lbXksIGJ1bGxldCl7XHJcbiAgICAgICAgXHJcbiAgICAgICAgYnVsbGV0LmtpbGwoKTtcclxuICAgICAgICBlbmVteS5lbmVteUhlYWx0aC5jdXJyZW50LS07XHJcblxyXG4gICAgICAgICBcclxuICAgICAgICAgICBlbmVteS5kZXN0cm95KCk7XHJcbiAgICAgICAgICAgdGhpcy5lbmVteUNvdW50LmN1cnJlbnQtLTtcclxuICAgICAgICAgICB0aGlzLmVuZW15VGV4dC50ZXh0ID0gICgoMSAtICh0aGlzLmVuZW15Q291bnQuY3VycmVudC90aGlzLmVuZW15Q291bnQudG90YWwpKSAqIDEwMCkudG9GaXhlZCgxKSArIFwiJVwiOyAgXHJcbiAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICB2YXIgZXhwbG9zaW9uID0gdGhpcy5leHBsb3Npb25zLmdldEZpcnN0RGVhZCgpO1xyXG4gICAgICAgIGlmKGV4cGxvc2lvbil7XHJcbiAgICAgICAgICAgIGV4cGxvc2lvbi54ID0gZW5lbXkueDtcclxuICAgICAgICAgICAgZXhwbG9zaW9uLnkgPSBlbmVteS55O1xyXG4gICAgICAgICAgICBleHBsb3Npb24ucmV2aXZlKCk7XHJcbiAgICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgZXhwbG9zaW9uID0gdGhpcy5nYW1lLmFkZC5zcHJpdGUoZW5lbXkueCwgZW5lbXkueSwgJ2V4cGxvc2lvbicpO1xyXG4gICAgICAgICAgIGV4cGxvc2lvbi5hbmNob3Iuc2V0VG8oLjUsLjUpO1xyXG4gICAgICAgICAgIHZhciBleGFuaW0gPSBleHBsb3Npb24uYW5pbWF0aW9ucy5hZGQoJ2V4cGxvZGUnLFswLDEsMiwzLDQsNSw2XSwxMCwgZmFsc2UpO1xyXG4gICAgICAgICAgIGV4YW5pbS5raWxsT25Db21wbGV0ZSA9IHRydWU7ICAgICAgIFxyXG4gICAgICAgICAgIH1cclxuICAgICAgICBleGFuaW0ucGxheSgpO1xyXG4gICAgICAgIFxyXG4gICAgfVxyXG4gICAgXHJcbiAgICByb2NrZXRFeHBsb2RlKHJvY2tldCxsYXllcil7XHJcbiAgICAgICAgXHJcbiAgICAgICAgcm9ja2V0LmtpbGwoKTtcclxuICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIHZhciBleHBsb3Npb24gPSB0aGlzLmV4cGxvc2lvbnMuZ2V0Rmlyc3REZWFkKCk7XHJcbiAgICAgICAgaWYoZXhwbG9zaW9uKXtcclxuICAgICAgICAgICAgZXhwbG9zaW9uLnggPSByb2NrZXQueDtcclxuICAgICAgICAgICAgZXhwbG9zaW9uLnkgPSByb2NrZXQueTtcclxuICAgICAgICAgICAgZXhwbG9zaW9uLnJldml2ZSgpO1xyXG4gICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgIGV4cGxvc2lvbiA9IHRoaXMuZ2FtZS5hZGQuc3ByaXRlKHJvY2tldC54LCByb2NrZXQueSwgJ2V4cGxvc2lvbicpO1xyXG4gICAgICAgICAgIGV4cGxvc2lvbi5hbmNob3Iuc2V0VG8oLjUsLjUpO1xyXG4gICAgICAgICAgIHZhciBleGFuaW0gPSBleHBsb3Npb24uYW5pbWF0aW9ucy5hZGQoJ2V4cGxvZGUnLFswLDEsMiwzLDQsNSw2XSwxMCwgZmFsc2UpO1xyXG4gICAgICAgICAgIGV4YW5pbS5raWxsT25Db21wbGV0ZSA9IHRydWU7ICAgICAgIFxyXG4gICAgICAgICAgIH1cclxuICAgICAgICBleGFuaW0ucGxheSgpO1xyXG4gICAgICAgIFxyXG4gICAgfVxyXG4gICAgXHJcbiAgICAgICAgXHJcbiAgICBcclxuICAgIFxyXG4gICAgXHJcbn0iLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBNZW51IGV4dGVuZHMgUGhhc2VyLlN0YXRlIHtcclxuICAgIFxyXG4gICAgcHJlbG9hZCgpe1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMubG9hZC5pbWFnZSgnbWVudV9iYWNrZ3JvdW5kJywnYXNzZXRzL2ltZy9tZW51X2JhY2tncm91bmQuanBnJyk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGNyZWF0ZSgpIHtcclxuICAgICAgICBcclxuICAgICAgICB2YXIgY29udHJvbHMgPSBbJ0xFRlQ6ICcsJ1JJR0hUOiAnLCdKVU1QXCI6ICcsJ1NIT09UOiAnLCdKRVRQQUNLOiAnLCdGTFkgVVA6ICcsJ0ZMWSBET1dOOiAnXTtcclxuICAgICAgICB2YXIga2V5Ym9hcmQgPSBbJ0EnLCdEJywnVycsJ0VOVEVSJywnU0hJRlQnLCdXJywnUyddO1xyXG4gICAgICAgIFxyXG4gICAgICAgIFxyXG4gICAgICAgIFxyXG4gICAgICAgIFxyXG4gICAgICAgIHZhciB5Q29vcmQgPSAyMDA7XHJcbiAgICAgICAgdmFyIHRleHRTcGFjaW5nID0gNTA7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdmFyIHN0eWxlID0gIHtcclxuICAgICAgICBmb250OiBcIjYwcHggQXJpYWxcIixcclxuICAgICAgICBmaWxsOiAnI2ZmZmZmZicsXHJcbiAgICAgICAgYWxpZ246IFwiY2VudGVyXCIsXHJcbiAgICAgICAgc3Ryb2tlOiAnIzAwMDAwMCcsXHJcbiAgICAgICAgc3Ryb2tlVGhpY2tuZXNzOiAyLFxyXG4gICAgICAgIH07XHJcbiAgICAgIFxyXG4gICAgICAgICB0aGlzLnN0YXJ0R2FtZSA9IHRoaXMuZ2FtZS5pbnB1dC5rZXlib2FyZC5hZGRLZXkoUGhhc2VyLktleWJvYXJkLkVOVEVSKTtcclxuICAgICAgICAgdGhpcy5hZGQuc3ByaXRlKDAsMCwnbWVudV9iYWNrZ3JvdW5kJyk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdmFyIHRpdGxlID0gdGhpcy5hZGRUZXh0KHRoaXMuZ2FtZS53aWR0aC8yLCAxMDAsIDYwLCBcIkN5Ym9yZyBOaW5qYVwiLCBzdHlsZSk7XHJcbiAgICAgICAgdGl0bGUuYW5jaG9yLnNldFRvKC41LCAwKTtcclxuICAgICAgICB2YXIgdGV4dEFsaWduID0gKHRoaXMuZ2FtZS53aWR0aC8yKSAtICh0aXRsZS53aWR0aC8yKTtcclxuICAgICAgICB2YXIgc3VidGl0bGUgPSB0aGlzLmFkZFRleHQodGV4dEFsaWduLCAyMDAsIDQwLCBcIkNvbnRyb2xzXCIsIHN0eWxlKTtcclxuICAgICAgICBcclxuICAgICAgICB2YXIgeVNwYWNpbmcgPSBzdWJ0aXRsZS55ICsgNTA7XHJcbiAgICAgICAgXHJcbiAgICAgICAgIHlDb29yZCArPSAyNTtcclxuICAgICAgICBcclxuICAgICAgICBmb3IodmFyIGkgPSAwOyBpIDwgY29udHJvbHMubGVuZ3RoOyBpKyspe1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICB0aGlzLmFkZFRleHQodGV4dEFsaWduLCB5U3BhY2luZywgMjAsIGNvbnRyb2xzW2ldLCBzdHlsZSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmFkZFRleHQodGV4dEFsaWduICsgMjAwLCB5U3BhY2luZywgMjAsIGtleWJvYXJkW2ldLCBzdHlsZSk7XHJcbiAgICAgICAgICAgICAgICB5U3BhY2luZyArPSAzMDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgICB0aGlzLmFkZFRleHQodGV4dEFsaWduLCB0aGlzLmdhbWUuaGVpZ2h0IC0gMjAwLCA0MCwgXCJQcmVzcyBFbnRlciB0byBQbGF5IVwiLCBzdHlsZSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdmFyIHNwcml0ZSA9IHRoaXMuZ2FtZS5hZGQuc3ByaXRlKHRoaXMuZ2FtZS53aWR0aCAtIDMwMCwgdGhpcy5nYW1lLmhlaWdodC0zMDAsICduaW5qYScpO1xyXG4gICAgICAgIHNwcml0ZS5zY2FsZS5zZXRUbygyKTtcclxuICAgICAgIHNwcml0ZS5hbmltYXRpb25zLmFkZCgncnVuJywgWzU2LCA1NywgNTgsIDU5LCA2MCwgNjEsIDYyLCA2MywgNjQsIDY1XSwxNSwgdHJ1ZSk7XHJcbiAgICAgICAgc3ByaXRlLnBsYXkoJ3J1bicpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIH1cclxuICAgIFxyXG4gICAgdXBkYXRlKCkge1xyXG5cclxuICAgIFxyXG4gICAgICAgICAgaWYodGhpcy5zdGFydEdhbWUuaXNEb3duKXtcclxuICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICB0aGlzLmdhbWUuc3RhdGUuc3RhcnQoJ2xldmVsMScsIHRydWUsIGZhbHNlLCAyMCk7XHJcbiAgICAgICAgICB9XHJcbiAgICBcclxuICAgIH1cclxuICAgIFxyXG4gICAgYWRkVGV4dCh4LHksIHRleHRTaXplLCBtZXNzYWdlLCBzdHlsZSl7XHJcbiAgICAgICAgXHJcbiAgICAgICAgICAgICB2YXIgdGV4dCA9IHRoaXMuZ2FtZS5hZGQudGV4dCh4LHksIG1lc3NhZ2UsICBzdHlsZSk7XHJcbiAgICAgICAgICAgICB0ZXh0LnNldFNoYWRvdyg1LCA1LCAncmdiYSgwLDAsMCwwLjUpJywgNSk7XHJcbiAgICAgICAgICAgIHZhciBncmQgPSB0ZXh0LmNvbnRleHQuY3JlYXRlTGluZWFyR3JhZGllbnQoMCwgMCwgMCwgNzQpO1xyXG4gICAgICAgICAgICBncmQuYWRkQ29sb3JTdG9wKDAsICcjOEVENkZGJyk7ICAgXHJcbiAgICAgICAgICAgIGdyZC5hZGRDb2xvclN0b3AoMSwgJyMwMDRDQjMnKTtcclxuICAgICAgICAgICAgdGV4dC5maWxsID0gZ3JkO1xyXG4gICAgICAgICAgICB0ZXh0LmZvbnRTaXplID0gdGV4dFNpemU7XHJcbiAgICAgICAgXHJcbiAgICAgICAgcmV0dXJuIHRleHQ7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIFxyXG4gICAgXHJcbiAgICBcclxuICAgIFxyXG4gICAgXHJcbn0iLCJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFByZWxvYWQge1xuICAgIFxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLmFzc2V0ID0gbnVsbDtcbiAgICAgICAgdGhpcy5yZWFkeSA9IGZhbHNlO1xuICAgIH1cbiAgICBcbiAgICBwcmVsb2FkKCkge1xuICAgICAgICB0aGlzLmxvYWQuaW1hZ2UoJ2xvYWRpbmdfYmcnLCAnYXNzZXRzL2ltZy9sb2FkaW5nX2JnLmpwZycpO1xuICAgIH1cbiAgICBcbiAgICBjcmVhdGUoKSB7XG4gICAgICAgIHRoaXMuYWRkLnNwcml0ZSgwLDAsIFwibG9hZGluZ19iZ1wiKTtcbiAgICAgICAgdGhpcy5hc3NldCA9IHRoaXMuYWRkLnNwcml0ZSh0aGlzLmdhbWUud2lkdGgvMiwgdGhpcy5nYW1lLmhlaWdodC8yLCBcInByZWxvYWRlclwiKTtcbiAgICAgICAgdGhpcy5hc3NldC5hbmNob3Iuc2V0VG8oMC41LDAuNSk7XG4gICAgICAgIHRoaXMubG9hZC5vbkxvYWRTdGFydC5hZGQodGhpcy5vbkxvYWRTdGFydCx0aGlzKTtcbiAgICAgICAgdGhpcy5sb2FkLm9uTG9hZENvbXBsZXRlLmFkZCh0aGlzLm9uTG9hZENvbXBsZXRlLCB0aGlzKTtcbiAgICAgICAgdGhpcy5sb2FkLnNldFByZWxvYWRTcHJpdGUodGhpcy5hc3NldCk7XG5cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdGhpcy5sb2FkLnN0YXJ0KCk7XG4gICAgfVxuICAgIFxuICAgIHVwZGF0ZSgpIHtcbiAgICAgXG4gICAgICAgIGlmKHRoaXMucmVhZHkpe1xuICAgICAgICAgXG4gICAgICAgICAgICB0aGlzLmdhbWUuc3RhdGUuc3RhcnQoJ21lbnUnKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBvbkxvYWRTdGFydCgpIHtcbiAgICAgICAgICAgICAgIC8vbG9hZCB5b3VyIGFzc2V0cyBoZXJlXG4gICAgICAgICAgICB0aGlzLmxvYWQuc3ByaXRlc2hlZXQoJ25pbmphJywnYXNzZXRzL2ltZy9uaW5qYTIucG5nJywgOTAsIDkwKTtcbiAgICAgICAgICAgIHRoaXMubG9hZC5pbWFnZSgnbmluamFfaGVhZCcsJ2Fzc2V0cy9pbWcvbmluamFfaGVhZC5wbmcnKTtcbiAgICAgICAgICAgIHRoaXMubG9hZC5zcHJpdGVzaGVldCgnY29pbnMnLCdhc3NldHMvaW1nL2NvaW5zLnBuZycsNDAsIDM5KTtcbiAgICAgICAgICAgIHRoaXMubG9hZC5zcHJpdGVzaGVldCgncm9ib3RfcnVuJywnYXNzZXRzL2ltZy9yb2JvdF9ydW4ucG5nJyw5MiwgOTApO1xuICAgICAgICAgICAgdGhpcy5sb2FkLnNwcml0ZXNoZWV0KCdkb29yJywnYXNzZXRzL2ltZy9kb29yLnBuZycsMTAwLDEwMCk7XG4gICAgICAgICAgICB0aGlzLmxvYWQuc3ByaXRlc2hlZXQoJ3JvY2tldCcsJ2Fzc2V0cy9pbWcvcm9ja2V0LnBuZycsMzAsMTIpO1xuICAgICAgICAgICAgdGhpcy5sb2FkLnNwcml0ZXNoZWV0KCdzaG9jaycsJ2Fzc2V0cy9pbWcvc2hvY2sucG5nJywxMjgsMTI4KTtcbiAgICAgICAgICAgIHRoaXMubG9hZC5zcHJpdGVzaGVldCgnZXhwbG9zaW9uJywnYXNzZXRzL2ltZy9leHBsb3Npb24ucG5nJywxMDAsMTA1KTtcbiAgICAgICAgICAgIHRoaXMubG9hZC5pbWFnZSgnYnVsbGV0JywnYXNzZXRzL2ltZy9CdWxsZXQwMS5wbmcnKTtcbiAgICAgICAgICAgIHRoaXMubG9hZC5pbWFnZSgnaGVhbHRoX3BhY2snLCdhc3NldHMvaW1nL2hlYWx0aF9wb3Rpb24ucG5nJyk7XG4gICAgICAgICAgICB0aGlzLmxvYWQuaW1hZ2UoJ2JsdWVfZmxhbWUnLCdhc3NldHMvaW1nL2JsdWVfZmxhbWUucG5nJyk7XG4gICAgICAgICAgICB0aGlzLmxvYWQuaW1hZ2UoJ3JlZF9mbGFtZScsJ2Fzc2V0cy9pbWcvcmVkX2ZsYW1lLnBuZycpO1xuICAgICAgICAgICAgdGhpcy5sb2FkLmltYWdlKCdlbmVteV9idWxsZXQnLCdhc3NldHMvaW1nL2VuZW15X2J1bGxldC5wbmcnKTtcbiAgICAgICAgICAgIHRoaXMubG9hZC5pbWFnZSgnZW5lbXlfc2hvb3QnLCdhc3NldHMvaW1nL3JvYm90X3BsYWNlLnBuZycpO1xuICAgICAgICAgICAgdGhpcy5sb2FkLmltYWdlKCdib2R5JywnYXNzZXRzL2ltZy9yb2JvdF9ib2R5LnBuZycpO1xuICAgICAgICAgICAgdGhpcy5sb2FkLmltYWdlKCdhcm0nLCdhc3NldHMvaW1nL3JvYm90X2FybS5wbmcnKTtcbiAgICAgICAgICAgIHRoaXMubG9hZC5pbWFnZSgnZW1wdHlfYmFyJywnYXNzZXRzL2ltZy9FbXB0eUJhci5wbmcnKTtcbiAgICAgICAgICAgIHRoaXMubG9hZC5pbWFnZSgnaGVhbHRoX2JhcicsJ2Fzc2V0cy9pbWcvUmVkQmFyLnBuZycpO1xuICAgICAgICAgICAgdGhpcy5sb2FkLmltYWdlKCdqZXRGdWVsX2JhcicsJ2Fzc2V0cy9pbWcvR3JlZW5CYXIucG5nJyk7XG4gICAgICAgICAgICB0aGlzLmxvYWQuaW1hZ2UoJ2VuZW15VUknLCdhc3NldHMvaW1nL0VuZW15SGVhZC5wbmcnKTtcbiAgICAgICAgICAgIHRoaXMubG9hZC5hdWRpbygnY29sbGVjdCcsJ2Fzc2V0cy9hdWRpby9VSV9FbGVjdHJpY18wOC5tcDMnKTtcbiAgICAgICAgICAgIHRoaXMubG9hZC5hdWRpbygnamV0cycsJ2Fzc2V0cy9hdWRpby9qZXRfc291bmQubXAzJyk7IFxuICAgIH1cbiAgICBcbiAgICBvbkxvYWRDb21wbGV0ZSgpIHtcbiAgICAgICAgdGhpcy5yZWFkeSA9IHRydWU7XG4gICAgfVxufSJdfQ==
