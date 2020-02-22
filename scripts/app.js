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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJEOi9Vc2Vycy9MaW5kc2V5L0RvY3VtZW50cy9Qb3J0Zm9saW9fRGV2ZWxvcG1lbnQvUG9ydF9TaXRlcy9jeWJvcmdOaW5qYS9DeWJvcmdOaW5qYS12ZXIxLjMvc3JjL2FwcC5qcyIsIkQ6L1VzZXJzL0xpbmRzZXkvRG9jdW1lbnRzL1BvcnRmb2xpb19EZXZlbG9wbWVudC9Qb3J0X1NpdGVzL2N5Ym9yZ05pbmphL0N5Ym9yZ05pbmphLXZlcjEuMy9zcmMvcHJlZmFicy9FbmVteS5qcyIsIkQ6L1VzZXJzL0xpbmRzZXkvRG9jdW1lbnRzL1BvcnRmb2xpb19EZXZlbG9wbWVudC9Qb3J0X1NpdGVzL2N5Ym9yZ05pbmphL0N5Ym9yZ05pbmphLXZlcjEuMy9zcmMvcHJlZmFicy9IZWFsdGhCYXIuanMiLCJEOi9Vc2Vycy9MaW5kc2V5L0RvY3VtZW50cy9Qb3J0Zm9saW9fRGV2ZWxvcG1lbnQvUG9ydF9TaXRlcy9jeWJvcmdOaW5qYS9DeWJvcmdOaW5qYS12ZXIxLjMvc3JjL3ByZWZhYnMvUGxheWVyLmpzIiwiRDovVXNlcnMvTGluZHNleS9Eb2N1bWVudHMvUG9ydGZvbGlvX0RldmVsb3BtZW50L1BvcnRfU2l0ZXMvY3lib3JnTmluamEvQ3lib3JnTmluamEtdmVyMS4zL3NyYy9zdGF0ZXMvQm9vdC5qcyIsIkQ6L1VzZXJzL0xpbmRzZXkvRG9jdW1lbnRzL1BvcnRmb2xpb19EZXZlbG9wbWVudC9Qb3J0X1NpdGVzL2N5Ym9yZ05pbmphL0N5Ym9yZ05pbmphLXZlcjEuMy9zcmMvc3RhdGVzL0dhbWVPdmVyLmpzIiwiRDovVXNlcnMvTGluZHNleS9Eb2N1bWVudHMvUG9ydGZvbGlvX0RldmVsb3BtZW50L1BvcnRfU2l0ZXMvY3lib3JnTmluamEvQ3lib3JnTmluamEtdmVyMS4zL3NyYy9zdGF0ZXMvTGV2ZWwxLmpzIiwiRDovVXNlcnMvTGluZHNleS9Eb2N1bWVudHMvUG9ydGZvbGlvX0RldmVsb3BtZW50L1BvcnRfU2l0ZXMvY3lib3JnTmluamEvQ3lib3JnTmluamEtdmVyMS4zL3NyYy9zdGF0ZXMvTGV2ZWwyLmpzIiwiRDovVXNlcnMvTGluZHNleS9Eb2N1bWVudHMvUG9ydGZvbGlvX0RldmVsb3BtZW50L1BvcnRfU2l0ZXMvY3lib3JnTmluamEvQ3lib3JnTmluamEtdmVyMS4zL3NyYy9zdGF0ZXMvTWVudS5qcyIsIkQ6L1VzZXJzL0xpbmRzZXkvRG9jdW1lbnRzL1BvcnRmb2xpb19EZXZlbG9wbWVudC9Qb3J0X1NpdGVzL2N5Ym9yZ05pbmphL0N5Ym9yZ05pbmphLXZlcjEuMy9zcmMvc3RhdGVzL1ByZWxvYWQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs0QkNHaUIsa0JBQWtCOzs7OytCQUNmLHFCQUFxQjs7Ozs0QkFDeEIsa0JBQWtCOzs7OzhCQUNoQixvQkFBb0I7Ozs7OEJBQ3BCLG9CQUFvQjs7OztnQ0FDbEIsc0JBQXNCOzs7O0FBUDNDLElBQUksSUFBSSxDQUFDOztBQVNULE1BQU0sQ0FBQyxNQUFNLEdBQUcsWUFBWTtBQUN4QixRQUFJLEdBQUcsSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQztBQUNsQyxRQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxNQUFNLDRCQUFPLENBQUM7QUFDN0IsUUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsU0FBUywrQkFBVSxDQUFDO0FBQ25DLFFBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLE1BQU0sNEJBQU8sQ0FBQztBQUM3QixRQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxRQUFRLDhCQUFTLENBQUM7QUFDakMsUUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsUUFBUSw4QkFBUyxDQUFDO0FBQ2pDLFFBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLFdBQVcsZ0NBQVcsQ0FBQztBQUN0QyxRQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxN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LEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDO0FBQzdGLFlBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FBQztBQUN4RCxZQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQ25HLFlBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLFNBQVMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDMUUsWUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBQyxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7QUFDaEUsWUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FBQztBQUN2RSxZQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBQyxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7QUFDL0UsWUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxjQUFjLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBQyxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7QUFDdkcsWUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUMsRUFBRSxFQUFDLEVBQUUsRUFBQyxFQUFFLEVBQUMsRUFBRSxDQUFDLEVBQUMsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO0FBQ3hFLFlBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsVUFBVSxFQUFFLENBQUMsRUFBRSxFQUFDLEVBQUUsQ0FBQyxFQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQztBQUNyRSxZQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FBQztBQUNsRSxZQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxVQUFVLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FBQztBQUNuRSxZQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxjQUFjLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUMsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO0FBQ3BFLFlBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLFdBQVcsRUFBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsRUFBQyxFQUFFLEVBQUMsS0FBSyxDQUFDLENBQUM7QUFDbEUsWUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7OztBQUd6QyxZQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FDOUMsRUFBRSxDQUFFLEVBQUUsS0FBSyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxNQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FDL0MsRUFBRSxDQUFFLEVBQUUsS0FBSyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxNQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FDaEQsRUFBRSxDQUFFLEVBQUUsS0FBSyxFQUFFLENBQUMsRUFBRSxFQUFFLEdBQUcsRUFBRSxNQUFNLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQzs7O0FBR2pELFlBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDbkUsWUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMs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QUMsQ0FBQztBQUN4RCxnQkFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsY0FBYyxFQUFDLDZCQUE2QixDQUFDLENBQUM7QUFDOUQsZ0JBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsRUFBQyw0QkFBNEIsQ0FBQyxDQUFDO0FBQzVELGdCQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUMsMkJBQTJCLENBQUMsQ0FBQztBQUNwRCxnQkFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFDLDBCQUEwQixDQUFDLENBQUM7QUFDbEQsZ0JBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFdBQVcsRUFBQyx5QkFBeUIsQ0FBQyxDQUFDO0FBQ3ZELGdCQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxZQUFZLEVBQUMsdUJBQXVCLENBQUMsQ0FBQztBQUN0RCxnQkFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxFQUFDLHlCQUF5QixDQUFDLENBQUM7QUFDekQsZ0JBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsRUFBQywwQkFBMEIsQ0FBQyxDQUFDO0FBQ3RELGdCQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLEVBQUMsaUNBQWlDLENBQUMsQ0FBQztBQUM3RCxnQkFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFDLDRCQUE0QixDQUFDLENBQUM7U0FDNUQ7OztlQUVhLDBCQUFHO0FBQ2IsZ0JBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO1NBQ3JCOzs7V0ExRGdCLE9BQU87OztxQkFBUCxPQUFPIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiLypnbG9iYWwgUGhhc2VyKi9cclxudmFyIGdhbWU7XHJcblxyXG5pbXBvcnQgQm9vdCBmcm9tIFwiLi9zdGF0ZXMvQm9vdC5qc1wiO1xyXG5pbXBvcnQgUHJlbG9hZCBmcm9tIFwiLi9zdGF0ZXMvUHJlbG9hZC5qc1wiO1xyXG5pbXBvcnQgTWVudSBmcm9tIFwiLi9zdGF0ZXMvTWVudS5qc1wiO1xyXG5pbXBvcnQgTGV2ZWwxIGZyb20gXCIuL3N0YXRlcy9MZXZlbDEuanNcIjtcclxuaW1wb3J0IExldmVsMiBmcm9tIFwiLi9zdGF0ZXMvTGV2ZWwyLmpzXCI7XHJcbmltcG9ydCBHYW1lT3ZlciBmcm9tIFwiLi9zdGF0ZXMvR2FtZU92ZXIuanNcIjtcclxuXHJcbndpbmRvdy5vbmxvYWQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICBnYW1lID0gbmV3IFBoYXNlci5HYW1lKDEyMDAsIDgwMCk7XHJcbiAgICBnYW1lLnN0YXRlLmFkZCgnYm9vdCcsIEJvb3QpO1xyXG4gICAgZ2FtZS5zdGF0ZS5hZGQoJ3ByZWxvYWQnLCBQcmVsb2FkKTtcclxuICAgIGdhbWUuc3RhdGUuYWRkKCdtZW51JywgTWVudSk7XHJcbiAgICBnYW1lLnN0YXRlLmFkZCgnbGV2ZWwxJywgTGV2ZWwxKTtcclxuICAgIGdhbWUuc3RhdGUuYWRkKCdsZXZlbDInLCBMZXZlbDIpO1xyXG4gICAgZ2FtZS5zdGF0ZS5hZGQoJ2dhbWVfb3ZlcicsIEdhbWVPdmVyKTtcclxuICAgIGdhbWUuc3RhdGUuc3RhcnQoJ2Jvb3QnKTtcclxuICAgIFxyXG59OyIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIEVuZW15IGV4dGVuZHMgUGhhc2VyLlNwcml0ZSB7XHJcbiAgICBcclxuICAgIGNvbnN0cnVjdG9yKGdhbWUsIHgsIHksIGJ1bGxldHMsIHBsYXllciwgbGF5ZXIpIHtcclxuICAgICAgICBzdXBlcihnYW1lLCB4LCB5LCAnZW5lbXlfc2hvb3QnLCAwKTtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLnBsYXllciA9IHBsYXllcjsgXHJcbiAgICAgICAgdGhpcy5idWxsZXRzID0gYnVsbGV0cztcclxuICAgICAgICB0aGlzLmdhbWUucGh5c2ljcy5lbmFibGUodGhpcywgUGhhc2VyLlBoeXNpY3MuQVJDQURFKTtcclxuICAgICAgICB0aGlzLmJvZHkuZ3Jhdml0eS55ID0gNzAwO1xyXG4gICAgICAgIHRoaXMuYm9keS5pbW1vdmFibGUgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMuaXNXYWxraW5nID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5lbmVteV9uZXh0U2hvdCA9IDA7XHJcbiAgICAgICAgdGhpcy5sZWZ0Qm91bmRlcnkgPSB4IC0gMTAwO1xyXG4gICAgICAgIHRoaXMucmlnaHRCb3VuZGVyeSA9IHggKyAxMDA7XHJcbiAgICAgICAgXHJcbiAgICAgICAgXHJcbiAgICAgICAgICB0aGlzLmxpbmUgPSBuZXcgUGhhc2VyLkxpbmUoKTtcclxuICAgICAgICAgIHRoaXMudGlsZXNIaXQgPSBbXTtcclxuICAgICAgICAgIHRoaXMubGF5ZXIgPSBsYXllcjtcclxuICAgICAgICB0aGlzLmVuZW15VXBkYXRlID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5kZXN0cm95RW5lbXkgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLmRldGVjdERpc3RhbmNlID0gNjAwO1xyXG4gICAgICAgIHRoaXMuc2hvdHNQZXJTZWNvbmQgPSAxO1xyXG4gICAgICAgIFxyXG4gICAgIFxyXG4gICAgICAgIFxyXG4gICAgICAgICAgdGhpcy5hcm0gPSB0aGlzLmFkZENoaWxkKG5ldyBQaGFzZXIuU3ByaXRlKGdhbWUsIDAsMCwnYXJtJykpO1xyXG4gICAgICAgICAgdGhpcy50b3JzbyA9IHRoaXMuYWRkQ2hpbGQobmV3IFBoYXNlci5TcHJpdGUoZ2FtZSwgMCwwLCdib2R5JykpO1xyXG4gICAgICAgICAgdGhpcy5yb2JvdFJ1biA9IHRoaXMuYWRkQ2hpbGQobmV3IFBoYXNlci5TcHJpdGUoZ2FtZSwgMCwwLCdyb2JvdF9ydW4nKSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgICB0aGlzLmFuY2hvci5zZXRUbyguNSwuNSk7XHJcbiAgICAgICAgICB0aGlzLmFybS5hbmNob3Iuc2V0VG8oMCwuNSk7XHJcbiAgICAgICAgICB0aGlzLnRvcnNvLmFuY2hvci5zZXRUbyguNSwuNSk7XHJcbiAgICAgICAgICB0aGlzLnJvYm90UnVuLmFuY2hvci5zZXRUbyguNSwuNSk7XHJcbiAgICAgICAgICB0aGlzLmFybS52aXNpYmxlID0gZmFsc2U7XHJcbiAgICAgICAgICB0aGlzLnRvcnNvLnZpc2libGUgPSBmYWxzZTtcclxuICAgICAgICAgIHRoaXMuc2NhbGUueCA9IC0xO1xyXG4gICAgICAgIFxyXG4gICAgICAgICBcclxuICAgICAgICB0aGlzLnJvYm90UnVuLmFuaW1hdGlvbnMuYWRkKCdydW4nLFswLDEsMiwzLDQsNSw2XSwgNSwgdHJ1ZSk7XHJcbiAgICAgICAgdGhpcy5yb2JvdFJ1bi5wbGF5KCdydW4nKTtcclxuXHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5lbmVteUhlYWx0aCA9IHtjdXJyZW50OiAzLCBtYXg6IDMgfTtcclxuICAgICAgXHJcbiAgICAgICAgXHJcbiAgICB9XHJcbiAgICBcclxuICAgIFxyXG4gICAgXHJcbiB1cGRhdGUoKXtcclxuICAgICBcclxuICAgICBcclxuXHJcbiAgICAgICAgICAgIGlmKHRoaXMuZW5lbXlVcGRhdGUpe1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgIGlmKChQaGFzZXIuTWF0aC5kaXN0YW5jZSh0aGlzLnBsYXllci54LHRoaXMucGxheWVyLnksdGhpcy54LHRoaXMueSkgPCB0aGlzLmRldGVjdERpc3RhbmNlKSAgJiYgICgoKHRoaXMuc2NhbGUueCAgPCAgMCkgICYmICAoKHRoaXMueCAtIHRoaXMucGxheWVyLngpPjApICkgfHwgKCh0aGlzLnNjYWxlLnggID4gIDApICAmJiAgKCh0aGlzLnggLSB0aGlzLnBsYXllci54KSA8IDApICkgKSl7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICB0aGlzLmxpbmUuc3RhcnQuc2V0KHRoaXMucGxheWVyLngsIHRoaXMucGxheWVyLnkpO1xyXG4gICAgICAgICAgIHRoaXMubGluZS5lbmQuc2V0KHRoaXMueCwgdGhpcy55KTtcclxuICAgICAgICAgICB0aGlzLnRpbGVzSGl0ID0gdGhpcy5sYXllci5nZXRSYXlDYXN0VGlsZXModGhpcy5saW5lLCA0LCBmYWxzZSwgdHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIGlmKHRoaXMudGlsZXNIaXQubGVuZ3RoID09IDApe1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKHRoaXMuaXNXYWxraW5nKXtcclxuICAgICAgICAgICAgICAgIHRoaXMuYm9keS52ZWxvY2l0eS54ID0gMDtcclxuICAgICAgICAgICAgICAgIHRoaXMuY2hpbGRyZW5bMl0udmlzaWJsZSA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jaGlsZHJlblswXS52aXNpYmxlID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIHRoaXMuY2hpbGRyZW5bMV0udmlzaWJsZSA9IHRydWU7IFxyXG4gICAgICAgICAgICAgICAgdGhpcy5pc1dhbGtpbmcgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgdGhpcy5lbmVteVNob290cygpO1xyXG4gICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgICAgICB0aGlzLndhbGsoKTtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAgICAgICAgICB0aGlzLndhbGsoKTsgXHJcbiAgICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgfWVsc2V7XHJcbi8vICAgICAgICAgICAgICAgIHRoaXMuaWRsZUFuaW0ucGxheSgpO1xyXG4gICAgICAgICAgICAgICB0aGlzLmJvZHkudmVsb2NpdHkueCA9IDA7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmlzV2Fsa2luZyA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICBcclxuICAgICBcclxuICAgICBcclxuICAgICBcclxuIFxyXG4gfVxyXG4gICAgXHJcbiAgICB3YWxrKCl7XHJcbiAgICAgICAgXHJcbiAgICAgICAgICAgIGlmKCF0aGlzLmlzV2Fsa2luZyl7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNoaWxkcmVuWzJdLnZpc2libGUgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jaGlsZHJlblswXS52aXNpYmxlID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNoaWxkcmVuWzFdLnZpc2libGUgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmlzV2Fsa2luZyA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgaWYodGhpcy5wbGF5ZXIueCA+IHRoaXMueCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICB0aGlzLmJvZHkudmVsb2NpdHkueCA9IDEwMDsgXHJcbiAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNjYWxlLnggPSAxOyBcclxuICAgICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYm9keS52ZWxvY2l0eS54ID0gLTEwMDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zY2FsZS54ID0gLTE7XHJcbiAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICBpZih0aGlzLnggPCB0aGlzLmxlZnRCb3VuZGVyeSl7XHJcbiAgICAgICAgICAgICAgICAgICB0aGlzLmJvZHkudmVsb2NpdHkueCA9IDUwOyBcclxuICAgICAgICAgICAgICAgICAgIHRoaXMuc2NhbGUueCA9IDE7ICAgIFxyXG4gICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIH1lbHNlIGlmKCB0aGlzLnggPiB0aGlzLnJpZ2h0Qm91bmRlcnkpe1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYm9keS52ZWxvY2l0eS54ID0gLTUwO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2NhbGUueCA9IC0xO1xyXG4gICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGVuZW15U2hvb3RzKCl7XHJcbiAgICAgICAgXHJcbiAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICB2YXIgZGlyID0gKHRoaXMuc2NhbGUueCA+IDApID8gMSA6IC0xO1xyXG4gICAgICAgICAgICAgICAgICAgdGhpcy5jaGlsZHJlblswXS5yb3RhdGlvbiA9ICBkaXIgKiAoTWF0aC5hdGFuKCh0aGlzLnkgLSB0aGlzLnBsYXllci55KS8odGhpcy54IC0gdGhpcy5wbGF5ZXIueCkpKTtcclxuICAgICAgICAgICAgICAgICAgIHZhciBwID0gbmV3IFBoYXNlci5Qb2ludCh0aGlzLngsIHRoaXMueSk7IFxyXG4gICAgICAgICAgICAgICAgICAgcC5yb3RhdGUocC54LCBwLnksICh0aGlzLmNoaWxkcmVuWzBdLnJvdGF0aW9uIC0gLjA1KSogZGlyLCBmYWxzZSwgKHRoaXMuc2NhbGUueCA+IDApID8gMjUgOiAtNTApO1xyXG4gICAgICAgIFxyXG4gICAgICAgICAgICAgICAgaWYodGhpcy5nYW1lLnRpbWUubm93ID4gdGhpcy5lbmVteV9uZXh0U2hvdCl7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmVuZW15X25leHRTaG90ID0gdGhpcy5nYW1lLnRpbWUubm93ICsgKFBoYXNlci5UaW1lci5TRUNPTkQgKiAoMS8gdGhpcy5zaG90c1BlclNlY29uZCkpO1xyXG4gICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgdmFyIGJ1bGxldCA9IHRoaXMuYnVsbGV0cy5nZXRGaXJzdERlYWQoKTtcclxuICAgICAgICAgICAgICAgICBpZihidWxsZXQpe1xyXG4gICAgICAgICAgICAgICAgICBidWxsZXQueCA9IHAueDtcclxuICAgICAgICAgICAgICAgICAgYnVsbGV0LnkgPSBwLnk7XHJcbiAgICAgICAgICAgICAgICAgIGJ1bGxldC5yZXZpdmUoKTtcclxuICAgICAgICAgICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgICAgIGJ1bGxldCA9IHRoaXMuYnVsbGV0cy5jcmVhdGUocC54LHAueSwnZW5lbXlfYnVsbGV0Jyk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmdhbWUucGh5c2ljcy5hcmNhZGUuZW5hYmxlKGJ1bGxldCk7ICAgXHJcbiAgICAgICAgICAgICAgICBidWxsZXQub3V0T2ZCb3VuZHNLaWxsID0gdHJ1ZTtcclxuXHQgICAgXHRcdGJ1bGxldC5jaGVja1dvcmxkQm91bmRzID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBidWxsZXQuYW5nbGUgPSB0aGlzLmNoaWxkcmVuWzBdLmFuZ2xlICogZGlyO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5nYW1lLnBoeXNpY3MuYXJjYWRlLnZlbG9jaXR5RnJvbVJvdGF0aW9uKCh0aGlzLmNoaWxkcmVuWzBdLnJvdGF0aW9uICogZGlyKSwgKDcwMCAqIGRpciksIGJ1bGxldC5ib2R5LnZlbG9jaXR5KTtcclxuICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICBcclxuICAgIH1cclxuXHJcbn0iLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBIZWFsdGhCYXIgZXh0ZW5kcyBQaGFzZXIuR3JvdXAge1xyXG4gICAgXHJcbiAgICBjb25zdHJ1Y3RvcihnYW1lLCB4cG9zLCB5cG9zLCBiYXJHcmFwaGljLCBob2xkZXJHcmFwaGljICl7XHJcbiAgICAgICAgc3VwZXIoZ2FtZSk7XHJcbiAgICAgICAgdGhpcy54PSB4cG9zO1xyXG4gICAgICAgIHRoaXMueSA9IHlwb3M7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5iYXIgPSB0aGlzLmNyZWF0ZSgwLDAsIGJhckdyYXBoaWMpO1xyXG4gICAgICAgIHRoaXMuaG9sZGVyID0gdGhpcy5jcmVhdGUoMCwwLCBob2xkZXJHcmFwaGljKTtcclxuICAgICAgICBcclxuICAgIH1cclxuICAgIFxyXG4gICAgc2V0VmFsdWUoIHZhbCApe1xyXG4gXHJcbiAgICAgICAgaWYodGhpcy50d2VlbikgdGhpcy50d2Vlbi5zdG9wKCk7XHJcbiAgICAgICAgdGhpcy50d2VlbiA9IHRoaXMuZ2FtZS5hZGQudHdlZW4oIHRoaXMuYmFyLnNjYWxlKTtcclxuICAgICAgICB0aGlzLnR3ZWVuLnRvKHsgeDogdmFsIH0sIDM1MCk7XHJcbiAgICAgICAgdGhpcy50d2Vlbi5zdGFydCgpO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBcclxufSIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIFBsYXllciBleHRlbmRzIFBoYXNlci5TcHJpdGUge1xyXG4gICAgXHJcbiAgICBcclxuICAgIGNvbnN0cnVjdG9yKGdhbWUsIHgsIHksIGJ1bGxldHMsIHJvY2tldHMsIGZ1ZWxVSSwgaGVhbHRoVUksIGxpZmVVSSApIHtcclxuICAgICAgICBzdXBlcihnYW1lLCB4LCB5LCAnbmluamEnLCAwKTtcclxuICAgICAgICB0aGlzLmpldHBhY2tTcGVlZCA9IDUwO1xyXG4gICAgICAgIHRoaXMuaGVyb2ZseWluZyA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuZmlyc3RBbmltYXRpb24gPSB0cnVlO1xyXG4gICAgICAgIHRoaXMuZmxpZ2h0U2VxdWVuY2VJbml0ID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5ub1Nob3RBbmltID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLnNob3RTcGVlZCA9IDE1MDA7XHJcbiAgICAgICAgdGhpcy5idWxsZXRzID0gYnVsbGV0cztcclxuICAgICAgICB0aGlzLnJvY2tldHMgPSByb2NrZXRzO1xyXG4gICAgICAgIHRoaXMuZnVlbFVJID0gZnVlbFVJO1xyXG4gICAgICAgIHRoaXMuaGVhbHRoVUkgPSBoZWFsdGhVSTtcclxuICAgICAgICB0aGlzLnNob3RJbnRlcnZhbCA9IC41O1xyXG4gICAgICAgIHRoaXMuaXNEZWFkID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5qZXRVc2VkID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5zdGFydGluZ1ggPSB4O1xyXG4gICAgICAgIHRoaXMuc3RhcnRpbmdZID0geTtcclxuICAgICAgXHJcbiAgICAgICAgXHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5oZWFsdGggPSB7IG1heDogMTAsIGN1cnJlbnQ6IDEwfTtcclxuICAgICAgICB0aGlzLmZ1ZWwgPSB7IGN1cnJlbnQ6IDEwLCBtYXg6IDEwfTtcclxuICAgICAgICB0aGlzLmxpdmVzID0gMztcclxuXHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5mbGlnaHREZWxheSA9IDA7XHJcbiAgICAgICAgdGhpcy5jaGFyZWN0ZXJzcGVlZCA9IDQwMDtcclxuICAgICAgICB0aGlzLm5leHRTaG90ID0gMDtcclxuICAgICAgIFxyXG4gICAgICAgIC8vaW50aXRhaWwgZmxpZ2h0IGJvb3N0IHZhcmlhYmxlc1xyXG4gICAgICAgXHJcbiAgICAgICAgdGhpcy5mbGlnaHRXYXJtVXBUaW1lID0gMjtcclxuICAgICAgICB0aGlzLmpldFNwZWVkID0gNDAwO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMuZmxpZ2h0V2FybVVwID0gMDtcclxuICAgICAgICB0aGlzLnNlcUNvdW50ID0gMDtcclxuICAgICAgICB0aGlzLmpldEJvb3N0ID0gMDtcclxuICAgICAgICB0aGlzLmxvb3BEZWxheSA9IDA7XHJcbiAgICAgICAgdGhpcy5sb29wUmF0ZSA9IC4xO1xyXG4gICAgICAgIHRoaXMucm90YXRpb25PZmZzZXQgPSAuMTVcclxuICAgICAgICB0aGlzLnJhdGVPdmVyVGltZSA9IHRoaXMuZmxpZ2h0V2FybVVwVGltZS90aGlzLmxvb3BSYXRlO1xyXG4gICAgICAgIHRoaXMucm90YXRpb25PdmVyVGltZSA9ICguMzYpL3RoaXMucmF0ZU92ZXJUaW1lO1xyXG4gICAgICAgIHRoaXMuamV0QWNjZWxsZXJhdGlvbiA9IHRoaXMuamV0U3BlZWQvdGhpcy5yYXRlT3ZlclRpbWU7XHJcbiAgICAgICAgdGhpcy5hbmdsZU92ZXJUaW1lID0gMTkvIHRoaXMucmF0ZU92ZXJUaW1lO1xyXG4gICAgICAgIHRoaXMucm90YXRpb25TZXEgPSAwO1xyXG4gICAgICAgIHRoaXMuZnVlbFVzZUludGVydmFsID0gMDtcclxuICAgICAgICBcclxuICAgICAgICBcclxuICAgICAgICAgdGhpcy5nYW1lLnBoeXNpY3MuYXJjYWRlLmVuYWJsZSh0aGlzLCBQaGFzZXIuUGh5c2ljcy5BUkNBREUpO1xyXG4gICAgICAgIFxyXG4gICAgICAgICAgICAgIHRoaXMuYm9keS5ncmF2aXR5LnkgPSA2MDA7XHJcbiAgICAgICAgICAgICAgdGhpcy5hbmNob3Iuc2V0VG8oLjUsIC41KTtcclxuICAgICAgICAgICAgICB0aGlzLmJvZHkuc2V0U2l6ZSg2MCw5MCwwLCAtNyk7XHJcbiAgICAgICAgICBcclxuICAgICAgICAgICAgdGhpcy5hbmltYXRpb25zLmFkZCgnYXR0YWNrJywgWzAsIDEsIDIsIDMsIDQsIDVdLDEwLCB0cnVlKTtcclxuICAgICAgICAgICAgdGhpcy5kaWUgPSB0aGlzLmFuaW1hdGlvbnMuYWRkKCdkaWUnLCBbNiwgNywgOCwgOSwgMTAsIDExLCAxMiwgMTMsIDE0LCAxNSwgMTYsIDE3XSw1LCBmYWxzZSk7XHJcbiAgICAgICAgICAgIHRoaXMuYW5pbWF0aW9ucy5hZGQoJ2Rpenp5JywgWzE4LCAxOSwgMjAsIDIxXSwxMCwgdHJ1ZSk7XHJcbiAgICAgICAgICAgIHRoaXMuaWRsZSA9IHRoaXMuYW5pbWF0aW9ucy5hZGQoJ2lkbGUnLCBbMjIsIDIzLCAyNCwgMjUsIDI2LCAyNywgMjgsIDI5LCAzMCwgMzEsIDMyLCAzM10sMTAsIHRydWUpO1xyXG4gICAgICAgICAgICB0aGlzLmFuaW1hdGlvbnMuYWRkKCdqZXRwYWNrJywgWzM0LCAzNSwgMzYsIDM3LCAzOCwgMzksIDQwLCA0MV0sMTAsIHRydWUpO1xyXG4gICAgICAgICAgICB0aGlzLmFuaW1hdGlvbnMuYWRkKCdqdW1wJywgWzQyLCA0MywgNDQsIDQ1LCA0NiwgNDddLDEwLCBmYWxzZSk7XHJcbiAgICAgICAgICAgIHRoaXMuYW5pbWF0aW9ucy5hZGQoJ3JvbGwnLCBbNDgsIDQ5LCA1MCwgNTEsIDUyLCA1MywgNTQsIDU1XSwxMCwgdHJ1ZSk7XHJcbiAgICAgICAgICAgIHRoaXMuYW5pbWF0aW9ucy5hZGQoJ3J1bicsIFs1NiwgNTcsIDU4LCA1OSwgNjAsIDYxLCA2MiwgNjMsIDY0LCA2NV0sMTAsIGZhbHNlKTtcclxuICAgICAgICAgICAgdGhpcy5ydW5TaG90ID0gdGhpcy5hbmltYXRpb25zLmFkZCgncnVuX3dpdGhfZ3VuJywgWzY2LCA2NywgNjgsIDY5LCA3MCwgNzEsIDcyLCA3MywgNzQsIDc1XSwxMCwgZmFsc2UpO1xyXG4gICAgICAgICAgICB0aGlzLmlkbGVTaG90ID0gdGhpcy5hbmltYXRpb25zLmFkZCgnc2hvdCcsIFs3Niw3Nyw3OCw3OSw4MF0sMTAsIGZhbHNlKTtcclxuICAgICAgICAgICAgdGhpcy5ydW5TaG90U3RvcCA9IHRoaXMuYW5pbWF0aW9ucy5hZGQoJ3Nob3RTdG9wJywgWzc5LDgwXSw4LCBmYWxzZSk7XHJcbiAgICAgICAgICAgIHRoaXMuYW5pbWF0aW9ucy5hZGQoJ3NsaWRpbmcnLCBbODEsIDgyLCA4MywgODQsIDg1LCA4Nl0sMTAsIHRydWUpO1xyXG4gICAgICAgICAgICB0aGlzLmFuaW1hdGlvbnMuYWRkKCd0aHJvd2luZycsIFs4NywgODgsIDg5LCA5MCwgOTEsIDkyXSwxMCwgdHJ1ZSk7XHJcbiAgICAgICAgICAgIHRoaXMuYW5pbWF0aW9ucy5hZGQoJ2pldHBhY2tfZmlyZScsIFs5MywgOTQsIDk1LCA5NiwgOTddLDEwLCBmYWxzZSk7XHJcbiAgICAgICAgICAgIHRoaXMuYW5pbWF0aW9ucy5hZGQoJ2p1bXBfZmlyZScsWzk4LCA5OSwgMTAwLCAxMDEsIDEwMl0sMTAsZmFsc2UpO1xyXG4gICAgICAgICAgICB0aGlzLmRpZS5vbkNvbXBsZXRlLmFkZCh0aGlzLmRlYWQsIHRoaXMpO1xyXG4gICAgICAgIFxyXG4gICAgICAgICAgICAvL1BsYXllciBmbGFzaGVzIHdoZW4gaGl0XHJcbiAgICAgICAgICAgIHRoaXMuZmxhc2hFZmZlY3QgPSB0aGlzLmdhbWUuYWRkLnR3ZWVuKHRoaXMpXHJcblx0XHRcdFx0XHRcdFx0XHRcdC50byggeyBhbHBoYTogMCB9LCA1MCwgUGhhc2VyLkVhc2luZy5Cb3VuY2UuT3V0KVxyXG5cdFx0XHRcdFx0XHRcdFx0XHQudG8oIHsgYWxwaGE6IC44IH0sIDUwLCBQaGFzZXIuRWFzaW5nLkJvdW5jZS5PdXQpXHJcblx0XHRcdFx0XHRcdFx0XHRcdC50byggeyBhbHBoYTogMSB9LCAxNTAsIFBoYXNlci5FYXNpbmcuQ2lyY3VsYXIuT3V0KTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIC8vcmVnaXN0ZXJlZCBpbnB1dHNcclxuICAgICAgICAgICAgdGhpcy5tb3ZlTGVmdCA9IHRoaXMuZ2FtZS5pbnB1dC5rZXlib2FyZC5hZGRLZXkoXCJBXCIuY2hhckNvZGVBdCgwKSk7XHJcbiAgICAgICAgICAgIHRoaXMubW92ZVJpZ2h0ID0gdGhpcy5nYW1lLmlucHV0LmtleWJvYXJkLmFkZEtleShcIkRcIi5jaGFyQ29kZUF0KDApKTtcclxuICAgICAgICAgICAgdGhpcy5qdW1wID0gdGhpcy5nYW1lLmlucHV0LmtleWJvYXJkLmFkZEtleShcIldcIi5jaGFyQ29kZUF0KDApKTtcclxuICAgICAgICAgICAgdGhpcy5tb3ZlRG93biA9IHRoaXMuZ2FtZS5pbnB1dC5rZXlib2FyZC5hZGRLZXkoXCJTXCIuY2hhckNvZGVBdCgwKSk7XHJcbiAgICAgICAgICAgIHRoaXMuY3Vyc29yID0gdGhpcy5nYW1lLmlucHV0LmtleWJvYXJkLmNyZWF0ZUN1cnNvcktleXMoKTtcclxuICAgICAgICAgICAgdGhpcy5qZXRtb2RlID0gdGhpcy5nYW1lLmlucHV0LmtleWJvYXJkLmFkZEtleSgxNik7XHJcbiAgICAgICAgICAgIHRoaXMuc2hvb3QgPSB0aGlzLmdhbWUuaW5wdXQua2V5Ym9hcmQuYWRkS2V5KFBoYXNlci5LZXlib2FyZC5FTlRFUik7XHJcbiAgICAgICAgICAgIHRoaXMudGVzdHNob3QgPSB0aGlzLmdhbWUuaW5wdXQua2V5Ym9hcmQuYWRkS2V5KDEzKTtcclxuICAgICAgICBcclxuICAgIH1cclxuICAgIFxyXG4gICAgdXBkYXRlKCl7XHJcbiAgICBpZighdGhpcy5pc0RlYWQpe1xyXG4gICAgICAgICAgIGlmKHRoaXMuYm9keS5vbkZsb29yKCkpe1xyXG4gICAgICAgICAgICAgICB0aGlzLmZpcnN0QW5pbWF0aW9uID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIGlmKHRoaXMuaGVyb2ZseWluZylcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgdGhpcy5yZXNldEZsaWdodCgpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZih0aGlzLmpldFVzZWQpe1xyXG4gICAgICAgIHRoaXMuZnVlbFVJLnNldFZhbHVlKDEpO1xyXG4gICAgICAgIHRoaXMuZnVlbC5jdXJyZW50ID0gdGhpcy5mdWVsLm1heDtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmpldFVzZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgdGhpcy5ncm91bmRDb250cm9scygpO1xyXG4gICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIGlmKCF0aGlzLmhlcm9mbHlpbmcpe1xyXG4gICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgdGhpcy5qdW1wQ29udHJvbHMoKTsgXHJcbiAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgIHRoaXMuZmxpZ2h0Q29udHJvbHMoKTtcclxuICAgICAgICAgICAgICAgICBcclxuICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICBcclxuICAgICAgICBcclxuICAgIH0gIFxyXG4gXHJcbiAgICAgICAgXHJcbiAgICB9XHJcbiAgICBcclxuICAgIGdyb3VuZENvbnRyb2xzKCl7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBpZih0aGlzLnNob290LmlzRG93bil7XHJcbiAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2hvdEZpcmVkKCk7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5ub1Nob3RBbmltID0gISh0aGlzLnJ1blNob3QuaXNQbGF5aW5nIHx8IHRoaXMuaWRsZVNob3QuaXNQbGF5aW5nICk7IFxyXG4gICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgaWYodGhpcy5tb3ZlUmlnaHQuaXNEb3duKXtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICBpZih0aGlzLmlkbGVTaG90LmlzUGxheWluZyl7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pZGxlU2hvdC5zdG9wKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ydW5TaG90LnBsYXkoKTtcclxuICAgICAgICAgICAgICAgIH1lbHNlIGlmKCF0aGlzLnJ1blNob3QuaXNQbGF5aW5nKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wbGF5KCdydW4nKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB0aGlzLmJvZHkudmVsb2NpdHkueCA9IHRoaXMuY2hhcmVjdGVyc3BlZWQ7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNjYWxlLnggPSAxO1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgIH1lbHNlIGlmKHRoaXMubW92ZUxlZnQuaXNEb3duKXtcclxuICAgICAgICAgICAgaWYodGhpcy5pZGxlU2hvdC5pc1BsYXlpbmcpe1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaWRsZVNob3Quc3RvcCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucnVuU2hvdC5wbGF5KCk7XHJcbiAgICAgICAgICAgICAgICB9ZWxzZSBpZighdGhpcy5ydW5TaG90LmlzUGxheWluZyl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGxheSgncnVuJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYm9keS52ZWxvY2l0eS54ID0gLXRoaXMuY2hhcmVjdGVyc3BlZWQ7ICBcclxuICAgICAgICAgICAgICAgIHRoaXMuc2NhbGUueCA9IC0xO1xyXG4gICAgICAgICAgICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYm9keS52ZWxvY2l0eS54ID0gMDtcclxuICAgICAgICAgICAgICAgICAgICBpZih0aGlzLm5vU2hvdEFuaW0gJiYgKCF0aGlzLnJ1blNob3RTdG9wLmlzUGxheWluZykpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBsYXkoJ2lkbGUnKTtcclxuICAgICAgICAgICAgICAgICAgICB9ZWxzZXsgaWYodGhpcy5ydW5TaG90LmlzUGxheWluZyl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnJ1blNob3Quc3RvcCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5ydW5TaG90U3RvcC5wbGF5KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0gXHJcbiAgICAgICAgICAgICAgICBpZih0aGlzLmp1bXAuaXNEb3duKXtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmJvZHkudmVsb2NpdHkueSA9IC01MDA7XHJcbiAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgaWYgKHRoaXMuamV0bW9kZS5pc0Rvd24pIHsgXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ib2R5LnkgPSB0aGlzLmJvZHkueSAtIDEwO1xyXG4gICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICAgdGhpcy5hbmdsZSAtPSAodGhpcy5zY2FsZS54ID4gMCApID8gNzI6IC03MjtcclxuLy8gICAgICAgICAgICAgICAgICB0aGlzLmdhbWUudGltZS5ldmVudHMuYWRkKFBoYXNlci5UaW1lci5TRUNPTkQgKiAuMSwgdGhpcy5zdGFydEZsaWdodCwgdGhpcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhcnRGbGlnaHQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgdGhpcy5mbGlnaHREZWxheSA9IHRoaXMuZ2FtZS50aW1lLm5vdyArIDYwMDtcclxuICAgICAgICAgICAgICAgICAgICAgdGhpcy5qZXRVc2VkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGp1bXBDb250cm9scygpe1xyXG4gICAgICAgICAgICAgICAgaWYodGhpcy5maXJzdEFuaW1hdGlvbil7XHJcbiAgICAgICAgICAgICAgIHRoaXMucGxheSgnanVtcCcpOyAgXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5maXJzdEFuaW1hdGlvbiA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgfSAgICBcclxuICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgaWYodGhpcy5tb3ZlUmlnaHQuaXNEb3duKXtcclxuICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmJvZHkudmVsb2NpdHkueCA9IHRoaXMuY2hhcmVjdGVyc3BlZWQ7XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5zY2FsZS54ID0gMTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2UgaWYodGhpcy5tb3ZlTGVmdC5pc0Rvd24pe1xyXG4gICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYm9keS52ZWxvY2l0eS54ID0gLXRoaXMuY2hhcmVjdGVyc3BlZWQ7XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5zY2FsZS54ID0gLTE7XHJcbiAgICAgICAgICAgICAgICB9ZWxzZXtcclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLmJvZHkudmVsb2NpdHkueCA9IDA7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5qZXRtb2RlLmlzRG93bikge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKHRoaXMuZ2FtZS50aW1lLm5vdyA+IHRoaXMuZmxpZ2h0RGVsYXkpe1xyXG4gICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnN0YXJ0RmxpZ2h0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuamV0VXNlZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9IFxyXG4gICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICBpZih0aGlzLnNob290LmlzRG93bil7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zaG90RmlyZWQoKTtcclxuICAgICAgICAgICAgICAgICAgfSBcclxuICAgIH1cclxuICAgIFxyXG4gICAgZmxpZ2h0Q29udHJvbHMoKXtcclxuICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICBpZih0aGlzLnNob290LmlzRG93bil7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYWlyU2hvdCgpO1xyXG4gICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICB2YXIgZGlyID0gKHRoaXMuc2NhbGUueCA+IDApID8gMSA6IC0xO1xyXG4gICAgICAgICAgICAgICAgICAgICAgIGlmKHRoaXMuanVtcC5pc0Rvd24pe1xyXG4gICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYW5nbGUtPTIqKGRpcik7XHJcbiAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICBpZih0aGlzLm1vdmVEb3duLmlzRG93bil7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5hbmdsZSs9MiooZGlyKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgIGlmKCF0aGlzLmZsaWdodFNlcXVlbmNlSW5pdCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5mbGlnaHRTZXF1ZW5jZShkaXIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICAgdGhpcy5nYW1lLnBoeXNpY3MuYXJjYWRlLnZlbG9jaXR5RnJvbVJvdGF0aW9uKHRoaXMucm90YXRpb24gKyB0aGlzLnJvdGF0aW9uU2VxLCAodGhpcy5qZXRwYWNrU3BlZWQgKyB0aGlzLmpldEJvb3N0KSAqIChkaXIpLCB0aGlzLmJvZHkudmVsb2NpdHkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmpldG1vZGUuaXNEb3duKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZih0aGlzLmdhbWUudGltZS5ub3cgPiB0aGlzLmZsaWdodERlbGF5KXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGxheSgnanVtcCcpOyAgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnJlc2V0RmxpZ2h0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmZsaWdodERlbGF5ID0gdGhpcy5nYW1lLnRpbWUubm93ICsgNjAwO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXHJcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmpldEF1ZGlvLnN0b3AoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICBpZih0aGlzLmdhbWUudGltZS5ub3cgPiB0aGlzLmZ1ZWxVc2VJbnRlcnZhbCApe1xyXG4gICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgICB0aGlzLmZ1ZWxVc2VJbnRlcnZhbCA9IHRoaXMuZ2FtZS50aW1lLm5vdyArIFBoYXNlci5UaW1lci5TRUNPTkQgKiAuNTtcclxuICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZnVlbC5jdXJyZW50LS07XHJcbiAgICAgICAgICAgICAgICAgICAgICB0aGlzLmZ1ZWxVSS5zZXRWYWx1ZSh0aGlzLmZ1ZWwuY3VycmVudC90aGlzLmZ1ZWwubWF4KTtcclxuICAgICAgICAgICAgICAgICAgICAgIGlmKHRoaXMuZnVlbC5jdXJyZW50IDw9IDApe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBsYXkoJ2p1bXAnKTsgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5yZXNldEZsaWdodCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgXHJcblxyXG4gICAgICAgIFxyXG4gICAgICAgIFxyXG4gICAgfVxyXG4gICAgXHJcbiAgICByZXNldEZsaWdodCgpe1xyXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgdGhpcy5qZXRBdWRpby5zdG9wKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmhlcm9mbHlpbmcgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYW5nbGUgPSAwO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXFDb3VudCA9IDA7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmZsaWdodFNlcXVlbmNlSW5pdCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5yb3RhdGlvblNlcSA9IDA7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmpldEJvb3N0ID0gMDsgICBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZ2FtZS5waHlzaWNzLmFyY2FkZS52ZWxvY2l0eUZyb21Sb3RhdGlvbih0aGlzLnJvdGF0aW9uLCAwLCB0aGlzLmJvZHkudmVsb2NpdHkpOyAgICBcclxuICAgIH1cclxuICAgIFxyXG4gICAgc2hvdEZpcmVkKCl7XHJcbiAgICBcclxuICAgICAgICAgICAgaWYodGhpcy5nYW1lLnRpbWUubm93ID4gdGhpcy5uZXh0U2hvdCApe1xyXG4gICAgICAgICAgICAgICAgdGhpcy5uZXh0U2hvdCA9IHRoaXMuZ2FtZS50aW1lLm5vdyArIFBoYXNlci5UaW1lci5TRUNPTkQgKiB0aGlzLnNob3RJbnRlcnZhbDtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgdmFyIGRpciA9ICh0aGlzLnNjYWxlLnggPiAwKSA/IDEgOiAtMTtcclxuICAgICAgICAgICAgICAgIHZhciBidWxsZXQgPSB0aGlzLmJ1bGxldHMuZ2V0Rmlyc3REZWFkKCk7XHJcbiAgICAgICAgICAgICAgICBpZihidWxsZXQpe1xyXG4gICAgICAgICAgICAgICAgICAgIGJ1bGxldC54ID0gIHRoaXMueCArIChkaXIgKiAyNSk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnVsbGV0LnkgPSB0aGlzLnk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnVsbGV0LmFuZ2xlID0gMDtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmdhbWUucGh5c2ljcy5hcmNhZGUudmVsb2NpdHlGcm9tUm90YXRpb24odGhpcy5yb3RhdGlvbiwgMCwgYnVsbGV0LmJvZHkudmVsb2NpdHkpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJ1bGxldC5yZXZpdmUoKTsgICAgXHJcbiAgICAgICAgICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgICAgIGJ1bGxldCA9IHRoaXMuYnVsbGV0cy5jcmVhdGUodGhpcy54ICsgKGRpciAqIDI1KSx0aGlzLnksJ2J1bGxldCcpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5nYW1lLnBoeXNpY3MuZW5hYmxlKGJ1bGxldCwgUGhhc2VyLlBoeXNpY3MuQVJDQURFKTtcclxuXHRcdFx0XHRidWxsZXQub3V0T2ZCb3VuZHNLaWxsID0gdHJ1ZTtcclxuXHQgICAgXHRcdGJ1bGxldC5jaGVja1dvcmxkQm91bmRzID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGJ1bGxldC5ib2R5LnZlbG9jaXR5LnggPSBkaXIgKiB0aGlzLnNob3RTcGVlZDsgIFxyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAvL2FuaW1hdGlvbnMgZm9yIHNob3RzXHJcbiAgICAgICAgICAgICAgICBpZih0aGlzLmJvZHkub25GbG9vcigpKXtcclxuICAgICAgICAgICAgICAgICAgICBpZih0aGlzLmJvZHkudmVsb2NpdHkueCA9PT0gMCl7XHJcbiAgICAgICAgICAgICAgICAgICB0aGlzLmlkbGVTaG90LnBsYXkoKTsgXHJcbiAgICAgICAgICAgICAgICB9ZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICB0aGlzLnJ1blNob3QucGxheSgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wbGF5KCdqdW1wX2ZpcmUnKTsgXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICBhaXJTaG90KCl7XHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYodGhpcy5nYW1lLnRpbWUubm93ID4gdGhpcy5uZXh0U2hvdCl7XHJcbiAgICAgICAgICAgIHRoaXMubmV4dFNob3QgPSB0aGlzLmdhbWUudGltZS5ub3cgKyBQaGFzZXIuVGltZXIuU0VDT05EICogdGhpcy5zaG90SW50ZXJ2YWw7XHJcbiAgICAgICAgICAgICB0aGlzLnBsYXkoJ2pldHBhY2tfZmlyZScpOyBcclxuICAgICAgICAgICAgIHRoaXMuYW5pbWF0aW9ucy5jdXJyZW50QW5pbS5vbkNvbXBsZXRlLmFkZChmdW5jdGlvbiAoKSB7XHR0aGlzLnBsYXkoJ2pldHBhY2snKTsgfSwgdGhpcyk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgdmFyIGRpciA9ICh0aGlzLnNjYWxlLnggPiAwKSA/IDEgOiAtMTtcclxuICAgICAgICAgICAgdmFyIHAgPSBuZXcgUGhhc2VyLlBvaW50KHRoaXMueCwgdGhpcy55KTsgXHJcbiAgICAgICAgICBwLnJvdGF0ZShwLngsIHAueSwgdGhpcy5yb3RhdGlvbiwgZmFsc2UsICg0MCpkaXIpKTtcclxuICAgICAgICAgIHZhciByb2NrZXQgPSB0aGlzLnJvY2tldHMuZ2V0Rmlyc3REZWFkKCk7XHJcbiAgICAgICAgICAgIGlmKHJvY2tldCl7XHJcbiAgICAgICAgICAgICAgICByb2NrZXQueCA9IHAueDtcclxuICAgICAgICAgICAgICAgIHJvY2tldC55ID0gcC55O1xyXG4gICAgICAgICAgICAgICAgcm9ja2V0LnJldml2ZSgpO1xyXG4gICAgICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgICAgIHJvY2tldCA9IHRoaXMucm9ja2V0cy5jcmVhdGUocC54LHAueSwncm9ja2V0Jyk7XHJcbiAgICAgICAgICAgICAgICByb2NrZXQuYW5pbWF0aW9ucy5hZGQoJ3NvYXInKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuZ2FtZS5waHlzaWNzLmFyY2FkZS5lbmFibGUocm9ja2V0KTtcclxuICAgICAgICAgICAgICAgICByb2NrZXQub3V0T2ZCb3VuZHNLaWxsID0gdHJ1ZTtcclxuXHQgICAgXHRcdCByb2NrZXQuY2hlY2tXb3JsZEJvdW5kcyA9IHRydWU7XHJcbiAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByb2NrZXQuc2NhbGUueCA9IGRpcjtcclxuICAgICAgICAgICAgICAgIHJvY2tldC5hbmdsZSA9IHRoaXMuYW5nbGUgKyAoKC0xOCkqZGlyKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuZ2FtZS5waHlzaWNzLmFyY2FkZS52ZWxvY2l0eUZyb21Sb3RhdGlvbih0aGlzLnJvdGF0aW9uICsgdGhpcy5yb3RhdGlvblNlcSwgdGhpcy5zaG90U3BlZWQgKiBkaXIsIHJvY2tldC5ib2R5LnZlbG9jaXR5KTtcclxuICAgICAgICAgICAgICAgIHJvY2tldC5wbGF5KCdzb2FyJyk7XHJcbiAgICAgICAgICAgfVxyXG4gICAgICAgIH0gIFxyXG4gICAgXHJcbiAgICBmbGlnaHRTZXF1ZW5jZShkaXIpe1xyXG4gICAgICAgICBpZih0aGlzLmdhbWUudGltZS5ub3cgPiB0aGlzLmxvb3BEZWxheSlcclxuICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5sb29wRGVsYXkgPSB0aGlzLmdhbWUudGltZS5ub3cgKyBQaGFzZXIuVGltZXIuU0VDT05EICogdGhpcy5sb29wUmF0ZTs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNlcUNvdW50Kys7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmFuZ2xlKz0gdGhpcy5hbmdsZU92ZXJUaW1lICooZGlyKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucm90YXRpb25TZXEgLT0gKHRoaXMucm90YXRpb25PdmVyVGltZSooZGlyKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmpldEJvb3N0ICs9IHRoaXMuamV0QWNjZWxsZXJhdGlvbjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKHRoaXMuc2VxQ291bnQgPT0gdGhpcy5yYXRlT3ZlclRpbWUpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5mbGlnaHRTZXF1ZW5jZUluaXQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICBcclxuICAgIH1cclxuICAgIFxyXG4gICAgc3RhcnRGbGlnaHQoKXtcclxuICAgICAgICAgICAgICAgICAgIHRoaXMucGxheSgnamV0cGFjaycpO1xyXG4gICAgICAgICAgICAgICAgICAgdGhpcy5oZXJvZmx5aW5nID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgIHRoaXMuZmxpZ2h0RGVsYXkgPSB0aGlzLmdhbWUudGltZS5ub3cgKyA2MDA7XHJcbi8vICAgICAgICAgICAgICAgICAgICB0aGlzLmpldEF1ZGlvLnBsYXkoJycsMCwxLHRydWUpOyAgICBcclxuICAgICAgICBcclxuICAgIH1cclxuICAgIFxyXG4gICAgZGllZCgpe1xyXG4gICAgdGhpcy5pc0RlYWQgPSB0cnVlOyBcclxuICAgIHRoaXMuYm9keS52ZWxvY2l0eS54ID0gMDsgICAgXHJcbiAgICB0aGlzLnBsYXkoJ2RpZScpOyAgXHJcbiAgICAgICAgICAgIFxyXG4gICAgfVxyXG4gICAgXHJcbiAgICBkZWFkKCl7IFxyXG4gICAgICAgIHRoaXMubGl2ZXMtLTtcclxuICAgICAgICBcclxuICAgICAgICBpZih0aGlzLmxpdmVzID4gMCl7XHJcbiAgICAgICAgICAgIHRoaXMuaGVhbHRoVUkuc2V0VmFsdWUoMSk7XHJcbiAgICAgICAgICAgIHRoaXMubGlmZVVJLnRleHQgPSBcInggXCIrIHRoaXMubGl2ZXM7XHJcbiAgICAgICAgdGhpcy54ID0gdGhpcy5zdGFydGluZ1g7XHJcbiAgICAgICAgdGhpcy55ID0gdGhpcy5zdGFydGluZ1k7XHJcbiAgICAgICAgdGhpcy5pc0RlYWQgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLmhlYWx0aC5jdXJyZW50ID0gdGhpcy5oZWFsdGgubWF4O1xyXG4gICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgIHRoaXMuZ2FtZS5zdGF0ZS5zdGFydCgnZ2FtZV9vdmVyJywgdHJ1ZSwgZmFsc2UpOyBcclxuICAgICAgICB9XHJcbiAgICBcclxuICAgIFxyXG4gICAgfVxyXG4gICAgXHJcbiAgICBmbGFzaCgpIHtcclxuXHRcdGlmKCF0aGlzLmZsYXNoRWZmZWN0LmlzUnVubmluZykge1xyXG5cdFx0XHR0aGlzLmZsYXNoRWZmZWN0LnN0YXJ0KCk7XHJcblx0XHR9XHJcblx0fVxyXG4gICAgXHJcbiAgICBcclxuICAgIFxyXG59XHJcbiIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIEJvb3Qge1xyXG4gICAgXHJcbiAgICBwcmVsb2FkKCkge1xyXG4gICAgICAgIHRoaXMubG9hZC5pbWFnZSgncHJlbG9hZGVyJywgJ2Fzc2V0cy9pbWcvbG9hZGluZ19iYXIucG5nJyk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGNyZWF0ZSgpIHtcclxuICAgICAgICB0aGlzLmdhbWUuaW5wdXQubWF4UG9pbnRlciA9IDE7XHJcbiAgICAgICAgdGhpcy5nYW1lLnN0YXRlLnN0YXJ0KCdwcmVsb2FkJyk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIFxyXG59IiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgR2FtZU92ZXIgZXh0ZW5kcyBQaGFzZXIuU3RhdGUge1xyXG4gICAgXHJcbiAgICBcclxuICAgIHByZWxvYWQoKXtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLmxvYWQuaW1hZ2UoJ21lbnVfYmFja2dyb3VuZCcsJ2Fzc2V0cy9pbWcvbWVudV9iYWNrZ3JvdW5kLmpwZycpO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBjcmVhdGUoKSB7XHJcbiAgICAgICAgXHJcbiAgICAgICBcclxuICAgICAgICB2YXIgc3R5bGUgPSAge1xyXG4gICAgICAgIGZvbnQ6IFwiNjBweCBBcmlhbFwiLFxyXG4gICAgICAgIGZpbGw6ICcjZmZmZmZmJyxcclxuICAgICAgICBhbGlnbjogXCJjZW50ZXJcIixcclxuICAgICAgICBzdHJva2U6ICcjMDAwMDAwJyxcclxuICAgICAgICBzdHJva2VUaGlja25lc3M6IDIsXHJcbiAgICAgICAgfTtcclxuICAgICAgXHJcbiAgICAgICAgIHRoaXMuc3RhcnRHYW1lID0gdGhpcy5nYW1lLmlucHV0LmtleWJvYXJkLmFkZEtleShQaGFzZXIuS2V5Ym9hcmQuRU5URVIpO1xyXG4gICAgICAgICB0aGlzLmFkZC5zcHJpdGUoMCwwLCdtZW51X2JhY2tncm91bmQnKTtcclxuICAgICAgICBcclxuICAgICAgICB2YXIgdGl0bGUgPSB0aGlzLmFkZFRleHQodGhpcy5nYW1lLndpZHRoLzIsIDEwMCwgNjAsIFwiR0FNRSBPVkVSXCIsIHN0eWxlKTtcclxuICAgICAgICB0aXRsZS5hbmNob3Iuc2V0VG8oLjUsIDApO1xyXG4gICAgICAgIHZhciB0ZXh0QWxpZ24gPSAodGhpcy5nYW1lLndpZHRoLzIpIC0gKHRpdGxlLndpZHRoLzIpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIFxyXG4gICAgICAgIHZhciBzcHJpdGUgPSB0aGlzLmdhbWUuYWRkLnNwcml0ZSh0aGlzLmdhbWUud2lkdGgvMiwgdGhpcy5nYW1lLmhlaWdodC8yLCAnbmluamEnKTtcclxuICAgICAgICBzcHJpdGUuc2NhbGUuc2V0VG8oMik7XHJcbiAgICAgICBzcHJpdGUuYW5pbWF0aW9ucy5hZGQoJ2Rpenp5JywgWzE4LCAxOSwgMjAsIDIxXSwxMCwgdHJ1ZSk7XHJcbiAgICAgICAgc3ByaXRlLnBsYXkoJ2Rpenp5Jyk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgfVxyXG4gICAgXHJcbiAgICBcclxuICAgIFxyXG4gICAgdXBkYXRlKCkge1xyXG5cclxuICAgIFxyXG4gICAgICAgICAgaWYodGhpcy5zdGFydEdhbWUuaXNEb3duKXtcclxuICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICB0aGlzLmdhbWUuc3RhdGUuc3RhcnQoJ21lbnUnKTtcclxuICAgICAgICAgIH1cclxuICAgIFxyXG4gICAgfVxyXG4gICAgXHJcbiAgICBhZGRUZXh0KHgseSwgdGV4dFNpemUsIG1lc3NhZ2UsIHN0eWxlKXtcclxuICAgICAgICBcclxuICAgICAgICAgICAgIHZhciB0ZXh0ID0gdGhpcy5nYW1lLmFkZC50ZXh0KHgseSwgbWVzc2FnZSwgIHN0eWxlKTtcclxuICAgICAgICAgICAgIHRleHQuc2V0U2hhZG93KDUsIDUsICdyZ2JhKDAsMCwwLDAuNSknLCA1KTtcclxuICAgICAgICAgICAgdmFyIGdyZCA9IHRleHQuY29udGV4dC5jcmVhdGVMaW5lYXJHcmFkaWVudCgwLCAwLCAwLCA3NCk7XHJcbiAgICAgICAgICAgIGdyZC5hZGRDb2xvclN0b3AoMCwgJyM4RUQ2RkYnKTsgICBcclxuICAgICAgICAgICAgZ3JkLmFkZENvbG9yU3RvcCgxLCAnIzAwNENCMycpO1xyXG4gICAgICAgICAgICB0ZXh0LmZpbGwgPSBncmQ7XHJcbiAgICAgICAgICAgIHRleHQuZm9udFNpemUgPSB0ZXh0U2l6ZTtcclxuICAgICAgICBcclxuICAgICAgICByZXR1cm4gdGV4dDtcclxuICAgIH1cclxuICAgIFxyXG4gICAgXHJcbiAgICBcclxuICAgIFxyXG4gICAgXHJcbiAgICBcclxufSIsIi8qIGdsb2JhbCBQaGFzZXIgKi9cclxuXHJcbmltcG9ydCBQbGF5ZXIgZnJvbSBcIi4uL3ByZWZhYnMvUGxheWVyLmpzXCI7XHJcbmltcG9ydCBFbmVteSBmcm9tICBcIi4uL3ByZWZhYnMvRW5lbXkuanNcIjtcclxuaW1wb3J0IEhlYWx0aEJhciBmcm9tIFwiLi4vcHJlZmFicy9IZWFsdGhCYXIuanNcIjtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIExldmVsMSBleHRlbmRzIFBoYXNlci5TdGF0ZSB7XHJcbiAgICBcclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcblxyXG4gICAgfVxyXG4gICAgcHJlbG9hZCgpe1xyXG4gICAgICAgICAgICAgICAgdGhpcy5sb2FkLmltYWdlKCd0aWxlc2V0JywnYXNzZXRzL2ltZy9zY2lfZmlfdGlsZXMucG5nJyk7XHJcbiAgICAgICAgICAgIHRoaXMubG9hZC50aWxlbWFwKCdteXRpbGVtYXAnLCdhc3NldHMvdGlsZXMvbGV2ZWwxLmpzb24nLCBudWxsLCBQaGFzZXIuVGlsZW1hcC5USUxFRF9KU09OKTsgICAgXHJcbiAgICAgICAgXHJcbiAgICB9XHJcbiAgICBcclxuICAgIGNyZWF0ZSgpIHtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLmdhbWUucGh5c2ljcy5zdGFydFN5c3RlbShQaGFzZXIuUGh5c2ljcy5BUkNBREUpO1xyXG4gICAgICAgIHRoaXMuZ2FtZS5zdGFnZS5iYWNrZ3JvdW5kQ29sb3IgPSBcIiM5MThhODdcIjtcclxuICAgICAgICBcclxuICAgICAgICBcclxuICAgICAgICAgICAgdGhpcy5kb29ySXNDbG9zZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICB0aGlzLnNjb3JlID0gMDtcclxuICAgICAgICAgICAgdGhpcy5lbmVteUNvdW50ID0ge2N1cnJlbnQ6IDAsIHRvdGFsOiAwfTtcclxuICAgICAgICAgICAgdGhpcy5kZWF0aERlbGF5ID0gMDtcclxuICAgICAgICBcclxuICAgICAgICAvL2NyZWF0ZSB0aWxlc2V0XHJcbiAgICAgICAgICAgIHRoaXMubXlUaWxlcyA9IHRoaXMuZ2FtZS5hZGQudGlsZW1hcCgnbXl0aWxlbWFwJyk7XHJcbiAgICAgICAgICAgIHRoaXMubXlUaWxlcy5hZGRUaWxlc2V0SW1hZ2UoJ3NjaV9maV90aWxlcycsICd0aWxlc2V0Jyk7XHJcbiAgICAgICAgICAgIHRoaXMubXlUaWxlcy5zZXRDb2xsaXNpb25CZXR3ZWVuKDAsNTAwKTtcclxuICAgICAgICAgICAgdGhpcy5teXRpbGViYWNrZ3JvdW5kID0gdGhpcy5teVRpbGVzLmNyZWF0ZUxheWVyKCdCYWNrZ3JvdW5kJyk7XHJcbiAgICAgICAgICAgIHRoaXMubXl0aWxlc2xheWVyID0gdGhpcy5teVRpbGVzLmNyZWF0ZUxheWVyKCdXb3JsZCcpO1xyXG4gICAgICAgICAgICB0aGlzLm15dGlsZXNsYXllci5yZXNpemVXb3JsZCgpOyBcclxuICAgICAgIFxyXG4gICAgICAgICAgdGhpcy5xdWFkVHJlZSA9IG5ldyBQaGFzZXIuUXVhZFRyZWUoMCwgMCwgdGhpcy5nYW1lLndvcmxkLndpZHRoLCB0aGlzLmdhbWUud29ybGQuaGVpZ2h0LCA0LCA0LCAwKTtcclxuICAgICAgICAgIFxyXG4gICAgICAgIFxyXG4gICAgdGhpcy5wbGF5ZXJCdWxsZXRzID0gdGhpcy5hZGQuZ3JvdXAoKTtcclxuICAgIHRoaXMucGxheWVyQnVsbGV0cy5lbmFibGVCb2R5ID0gdHJ1ZTtcclxuICAgIHRoaXMucGxheWVyQnVsbGV0cy5waHlzaWNzQm9keVR5cGUgPSBQaGFzZXIuUGh5c2ljcy5BUkNBREU7XHJcbiAgICAgICAgXHJcbiAgICAgdGhpcy5wbGF5ZXJSb2NrZXRzID0gdGhpcy5hZGQuZ3JvdXAoKTtcclxuICAgIHRoaXMucGxheWVyUm9ja2V0cy5lbmFibGVCb2R5ID0gdHJ1ZTtcclxuICAgIHRoaXMucGxheWVyUm9ja2V0cy5waHlzaWNzQm9keVR5cGUgPSBQaGFzZXIuUGh5c2ljcy5BUkNBREU7ICAgIFxyXG4gICAgICAgIFxyXG4gICAgIHRoaXMuZW5lbXlCdWxsZXRzID0gdGhpcy5hZGQuZ3JvdXAoKTtcclxuICAgIHRoaXMuZW5lbXlCdWxsZXRzLmVuYWJsZUJvZHkgPSB0cnVlO1xyXG4gICAgdGhpcy5lbmVteUJ1bGxldHMucGh5c2ljc0JvZHlUeXBlID0gUGhhc2VyLlBoeXNpY3MuQVJDQURFOyBcclxuICAgICAgICBcclxuICAgICAgICBcclxuICAgXHJcbiAgICAgICAgXHJcbiAgIC8vY3JlYXRlIGRvb3IgICAgIFxyXG4gICB0aGlzLm15VGlsZXMuY3JlYXRlRnJvbU9iamVjdHMoJ0Rvb3InLDYxOCwnZG9vcicsMCx0cnVlLCBmYWxzZSk7ICAgIFxyXG4gICB0aGlzLmRvb3IgPSB0aGlzLndvcmxkLmdldFRvcCgpO1xyXG4gICB0aGlzLmdhbWUucGh5c2ljcy5hcmNhZGUuZW5hYmxlKHRoaXMuZG9vcik7XHJcbiAgIHRoaXMuZG9vci5hbmltYXRpb25zLmFkZCgnb3BlbicsWzAsMSwyLDMsNF0sIDEwLCBmYWxzZSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5zZXR1cFVJKCk7XHJcbiAgICAgICAgXHJcbiAgICBcclxuICAgIFxyXG4gICAgLy9jcmVhdGUgbWFpbiBDaGFyZWN0ZXIgICAgXHJcbi8vICAgIHRoaXMubWFpbkNoYXJlY3RlciA9IG5ldyBQbGF5ZXIodGhpcy5nYW1lLCA0MDAsIDUwLCB0aGlzLnBsYXllckJ1bGxldHMsIHRoaXMucGxheWVyUm9ja2V0cywgdGhpcy5mdWVsQmFyLCB0aGlzLmhlYWx0aEJhcik7XHJcbi8vICAgIHRoaXMuZ2FtZS5hZGQuZXhpc3RpbmcodGhpcy5tYWluQ2hhcmVjdGVyKTtcclxuICAgICAgICBcclxuICAgIHRoaXMubXlUaWxlcy5jcmVhdGVGcm9tT2JqZWN0cygnUGxheWVyJyw1MTksJ251bGwnLCdudWxsJyx0cnVlLCBmYWxzZSwgdGhpcy53b3JsZCwgUGxheWVyKTtcclxuICAgIHRoaXMubWFpbkNoYXJlY3RlciA9IHRoaXMud29ybGQuZ2V0VG9wKCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5tYWluQ2hhcmVjdGVyLmJ1bGxldHMgPSB0aGlzLnBsYXllckJ1bGxldHM7XHJcbiAgICAgICAgdGhpcy5tYWluQ2hhcmVjdGVyLnJvY2tldHMgPSB0aGlzLnBsYXllclJvY2tldHM7XHJcbiAgICAgICAgdGhpcy5tYWluQ2hhcmVjdGVyLmZ1ZWxVSSA9IHRoaXMuZnVlbEJhcjtcclxuICAgICAgICB0aGlzLm1haW5DaGFyZWN0ZXIuaGVhbHRoVUkgPSB0aGlzLmhlYWx0aEJhcjtcclxuICAgICAgICB0aGlzLm1haW5DaGFyZWN0ZXIubGlmZVVJID0gdGhpcy5saWZlVGV4dDtcclxuICAgICAgICB0aGlzLmxpZmVUZXh0LnRleHQgPSBcInggXCIgKyB0aGlzLm1haW5DaGFyZWN0ZXIubGl2ZXM7XHJcbiAgICAgICAgXHJcbiAgICB0aGlzLmdhbWUuY2FtZXJhLmZvbGxvdyh0aGlzLm1haW5DaGFyZWN0ZXIpO1xyXG4gICAgICAgXHJcbiAgICAgICBcclxuICAgICAgICAgICAgICBcclxuICAgICAgICAvL3BsYWNlIGVuZW1pZXNcclxuICAgICAgICB0aGlzLmVuZW1pZXMgPSB0aGlzLmFkZC5ncm91cCgpO1xyXG4gICAgICAgIHRoaXMubXlUaWxlcy5jcmVhdGVGcm9tT2JqZWN0cygnRW5lbWllcycsIDYyMywgJ251bGwnLCAnbnVsbCcsIHRydWUsIGZhbHNlLCB0aGlzLmVuZW1pZXMsIEVuZW15KTtcclxuICAgICAgICB0aGlzLmVuZW1pZXMuc2V0QWxsKCdwbGF5ZXInLCB0aGlzLm1haW5DaGFyZWN0ZXIpO1xyXG4gICAgICAgIHRoaXMuZW5lbWllcy5zZXRBbGwoJ2J1bGxldHMnLCB0aGlzLmVuZW15QnVsbGV0cyk7XHJcbiAgICAgICAgdGhpcy5lbmVtaWVzLnNldEFsbCgnbGF5ZXInLCB0aGlzLm15dGlsZXNsYXllcik7XHJcbiAgICAgICAgdGhpcy5lbmVteUNvdW50LmN1cnJlbnQgPSB0aGlzLmVuZW15Q291bnQudG90YWwgPSB0aGlzLmVuZW1pZXMubGVuZ3RoO1xyXG4gICAgICAgIFxyXG4gICAgICAgIFxyXG4gICAgICAgIFxyXG4gICAgICAgICAgICB0aGlzLmNvbGxlY3RTb3VuZCA9IHRoaXMuYWRkLmF1ZGlvKCdjb2xsZWN0Jyk7XHJcbiAgICAgICAgICAgIHRoaXMuamV0QXVkaW8gPSB0aGlzLmFkZC5hdWRpbygnamV0cycpO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgXHJcbiAgICAgICAgICAgXHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgXHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB0aGlzLmNvaW5zID0gdGhpcy5hZGQuZ3JvdXAoKTtcclxuICAgICAgICAgICAgdGhpcy5jb2lucy5lbmFibGVCb2R5ID0gdHJ1ZTtcclxuICAgICAgICAgICAgdGhpcy5teVRpbGVzLmNyZWF0ZUZyb21PYmplY3RzKCdnZW1zJywgNjgxLCAnY29pbnMnLCAwLCB0cnVlLCBmYWxzZSwgdGhpcy5jb2lucyk7XHJcblxyXG4gIC8vICBBZGQgYW5pbWF0aW9ucyB0byBhbGwgb2YgdGhlIGNvaW4gc3ByaXRlc1xyXG4gICAgIFxyXG4gICAgdGhpcy5jb2lucy5jYWxsQWxsKCdhbmltYXRpb25zLmFkZCcsICdhbmltYXRpb25zJywgJ3NwaW4nLCBbMCwgMSwgMiwgMywgNCwgNV0sIDEwLCB0cnVlKTtcclxuICAgIHRoaXMuY29pbnMuY2FsbEFsbCgnYW5pbWF0aW9ucy5wbGF5JywgJ2FuaW1hdGlvbnMnLCAnc3BpbicpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMuc2hvY2tzID0gdGhpcy5hZGQuZ3JvdXAoKTtcclxuICAgICAgICB0aGlzLnNob2Nrcy5lbmFibGVCb2R5ID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLm15VGlsZXMuY3JlYXRlRnJvbU9iamVjdHMoJ1Nob2NrcycsIDcxMiwgJ3Nob2NrJywgMCwgdHJ1ZSwgZmFsc2UsIHRoaXMuc2hvY2tzKTtcclxuICAgICAgICB0aGlzLnNob2Nrcy5zZXRBbGwoJ2JvZHkuaW1tb3ZhYmxlJywgdHJ1ZSk7XHJcbiAgICAgICAgdGhpcy5zaG9ja3MuY2FsbEFsbCgnYm9keS5zZXRTaXplJywgJ2JvZHknICwgMTI4LCAxMCwgMCwgNTkpO1xyXG4gICAgICAgIHRoaXMuc2hvY2tzLmNhbGxBbGwoJ2FuaW1hdGlvbnMuYWRkJywgJ2FuaW1hdGlvbnMnLCAnd2lnZ2xlJywgWzAsIDEsIDIsIDNdLCAxMCwgdHJ1ZSk7XHJcbiAgICAgICAgdGhpcy5zaG9ja3MuY2FsbEFsbCgnYW5pbWF0aW9ucy5wbGF5JywgJ2FuaW1hdGlvbnMnLCAnd2lnZ2xlJyk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgIHRoaXMudmVydFNob2NrcyA9IHRoaXMuYWRkLmdyb3VwKCk7XHJcbiAgICAgICAgdGhpcy52ZXJ0U2hvY2tzLmVuYWJsZUJvZHkgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMubXlUaWxlcy5jcmVhdGVGcm9tT2JqZWN0cygnU2hvY2tzJywgNzA1LCAnc2hvY2snLCAwLCB0cnVlLCBmYWxzZSwgdGhpcy52ZXJ0U2hvY2tzKTtcclxuICAgICAgICB0aGlzLnZlcnRTaG9ja3Muc2V0QWxsKCdib2R5LmltbW92YWJsZScsIHRydWUpO1xyXG4gICAgICAgIHRoaXMudmVydFNob2Nrcy5jYWxsQWxsKCdib2R5LnNldFNpemUnLCAnYm9keScgLCAxMCwgMTI4LCA1OSwgMCk7XHJcbiAgICAgICAgdGhpcy52ZXJ0U2hvY2tzLmNhbGxBbGwoJ2FuaW1hdGlvbnMuYWRkJywgJ2FuaW1hdGlvbnMnLCAndmVydF93aWdnbGUnLCBbOCwgOSwgMTAsIDExXSwgMTAsIHRydWUpO1xyXG4gICAgICAgIHRoaXMudmVydFNob2Nrcy5jYWxsQWxsKCdhbmltYXRpb25zLnBsYXknLCAnYW5pbWF0aW9ucycsICd2ZXJ0X3dpZ2dsZScpO1xyXG4gICAgICAgIFxyXG4gICAgICAgICAgdGhpcy5oZWFsdGhQYWNrcyA9IHRoaXMuYWRkLmdyb3VwKCk7XHJcbiAgICAgICAgdGhpcy5oZWFsdGhQYWNrcy5lbmFibGVCb2R5ID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLm15VGlsZXMuY3JlYXRlRnJvbU9iamVjdHMoJ0hlYWx0aCcsIDcyNywgJ2hlYWx0aF9wYWNrJywgMCwgdHJ1ZSwgZmFsc2UsIHRoaXMuaGVhbHRoUGFja3MpO1xyXG4gICAgICAgIHRoaXMuaGVhbHRoUGFja3Muc2V0QWxsKCdib2R5LmltbW92YWJsZScsIHRydWUpO1xyXG4vLyAgICAgICAgdGhpcy5oZWFsdGhQYWNrcy5jYWxsQWxsKCdib2R5LnNldFNpemUnLCAnYm9keScgLCAxMCwgMTI4LCA1OSwgMCk7XHJcbiAgICAgXHJcbiAgICAgICAgXHJcbiAgICBcclxuICAgICAgICB0aGlzLmV4cGxvc2lvbnMgPSB0aGlzLmFkZC5ncm91cCgpOyBcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgIFxyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgXHJcbiAgIFxyXG4gICAgICAgIFxyXG4gICAgICAgICAgICBcclxuICBcclxuICAgICAgICAgICAgXHJcbiAgICAgICBcclxuICAgIH1cclxuICAgIFxyXG4gICAgdXBkYXRlKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucXVhZFRyZWUuY2xlYXIoKTtcclxuICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICBmb3IodmFyIGkgPSAwOyBpPCB0aGlzLmVuZW1pZXMubGVuZ3RoOyBpKyspe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmVuZW1pZXMuZ2V0QXQoaSkuZW5lbXlVcGRhdGUgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucXVhZFRyZWUuaW5zZXJ0KHRoaXMuZW5lbWllcy5nZXRBdChpKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4vLyAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5mb3VuZCA9IHRoaXMucXVhZFRyZWUucmV0cmlldmUodGhpcy5tYWluQ2hhcmVjdGVyKTtcclxuLy8gICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIGZvcih2YXIgaSA9IDA7IGkgPCB0aGlzLmZvdW5kLmxlbmd0aDsgaSsrICl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmZvdW5kW2ldLmVuZW15VXBkYXRlID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKHRoaXMuZm91bmRbaV0uZGVzdHJveUVuZW15KXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZm91bmRbaV0uZGVzdHJveSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIFxyXG4gICAgICAgICAgICB0aGlzLnBoeXNpY3MuYXJjYWRlLm92ZXJsYXAodGhpcy5tYWluQ2hhcmVjdGVyLCB0aGlzLmhlYWx0aFBhY2tzLCB0aGlzLmNvbGxlY3RIZWFsdGgsIG51bGwsIHRoaXMpO1xyXG4gICAgICAgICAgICB0aGlzLnBoeXNpY3MuYXJjYWRlLm92ZXJsYXAodGhpcy5tYWluQ2hhcmVjdGVyLCB0aGlzLnNob2NrcywgdGhpcy5lbGVjdHJvY3V0ZSwgbnVsbCwgdGhpcyk7XHJcbiAgICAgICAgICAgIHRoaXMucGh5c2ljcy5hcmNhZGUub3ZlcmxhcCh0aGlzLm1haW5DaGFyZWN0ZXIsIHRoaXMudmVydFNob2NrcywgdGhpcy5lbGVjdHJvY3V0ZSwgbnVsbCwgdGhpcyk7XHJcbiAgICAgICAgICAgIHRoaXMucGh5c2ljcy5hcmNhZGUuY29sbGlkZSh0aGlzLm1haW5DaGFyZWN0ZXIsIHRoaXMubXl0aWxlc2xheWVyKTtcclxuICAgICAgICAgICAgdGhpcy5waHlzaWNzLmFyY2FkZS5jb2xsaWRlKHRoaXMuZW5lbWllcywgdGhpcy5teXRpbGVzbGF5ZXIpO1xyXG4gICAgICAgICAgICB0aGlzLnBoeXNpY3MuYXJjYWRlLm92ZXJsYXAodGhpcy5tYWluQ2hhcmVjdGVyLCB0aGlzLmNvaW5zLCB0aGlzLmNvbGxlY3QgLCBudWxsLCB0aGlzKTtcclxuICAgICAgICBcclxuICAgICAgICAgICAgdGhpcy5waHlzaWNzLmFyY2FkZS5jb2xsaWRlKHRoaXMuZm91bmQsIHRoaXMucGxheWVyQnVsbGV0cywgdGhpcy5lbmVteVNob3QsIG51bGwsIHRoaXMpO1xyXG4gICAgICAgIFxyXG4gICAgICAgICAgICB0aGlzLnBoeXNpY3MuYXJjYWRlLmNvbGxpZGUodGhpcy5tYWluQ2hhcmVjdGVyLCB0aGlzLmVuZW15QnVsbGV0cywgdGhpcy5wbGF5ZXJTaG90LCBudWxsLCB0aGlzKTtcclxuICAgICAgICAgICAgdGhpcy5waHlzaWNzLmFyY2FkZS5jb2xsaWRlKHRoaXMubXl0aWxlc2xheWVyLCB0aGlzLmVuZW15QnVsbGV0cywgdGhpcy5idWxsZXRTcGFyaywgbnVsbCwgdGhpcyk7XHJcbiAgICAgICAgICAgIHRoaXMucGh5c2ljcy5hcmNhZGUuY29sbGlkZSh0aGlzLm15dGlsZXNsYXllciwgdGhpcy5wbGF5ZXJCdWxsZXRzLCB0aGlzLnBsYXllckJ1bGxldFNwYXJrLCBudWxsLCB0aGlzKTtcclxuICAgICAgICAgICAgdGhpcy5waHlzaWNzLmFyY2FkZS5jb2xsaWRlKHRoaXMuZW5lbWllcywgdGhpcy5wbGF5ZXJSb2NrZXRzLCB0aGlzLnJvY2tldEtpbGwsIG51bGwsIHRoaXMpO1xyXG4gICAgICAgICAgICB0aGlzLnBoeXNpY3MuYXJjYWRlLmNvbGxpZGUodGhpcy5teXRpbGVzbGF5ZXIsIHRoaXMucGxheWVyUm9ja2V0cywgdGhpcy5yb2NrZXRFeHBsb2RlLCBudWxsLCB0aGlzKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgXHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgIFxyXG4gICAgICAgICAgICB0aGlzLnBoeXNpY3MuYXJjYWRlLm92ZXJsYXAodGhpcy5tYWluQ2hhcmVjdGVyLCB0aGlzLmRvb3IsIHRoaXMub3BlbkRvb3IsIG51bGwsIHRoaXMpO1xyXG4gICAgICAgICAgIFxyXG4gICAgfVxyXG4gICAgXHJcbiAgICByZW5kZXIoKXtcclxuICAgICAgICBcclxuLy8gICAgICAgIHRoaXMuZ2FtZS5kZWJ1Zy5zcHJpdGVJbmZvKHRoaXMuY29pblVJLCAyMCwgMzIpO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBzZXR1cFVJKCkge1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMuc3R5bGVVSSA9IHtcclxuICAgICAgICBmb250OiBcIjQwcHggQXJpYWxcIixcclxuICAgICAgICBmaWxsOiBcIiNmZmZmZmZcIixcclxuICAgICAgICBhbGlnbjogXCJjZW50ZXJcIixcclxuICAgICAgICBzdHJva2U6ICcjMDAwMDAwJyxcclxuICAgICAgICBzdHJva2VUaGlja25lc3M6IDEsXHJcbiAgICAgICAgIFxyXG4gICAgfTtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLlVJTGF5ZXIgPSB0aGlzLmFkZC5ncm91cCgpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMuaGVhbHRoQmFyID0gbmV3IEhlYWx0aEJhcih0aGlzLmdhbWUsIDAsMCwgXCJoZWFsdGhfYmFyXCIsIFwiZW1wdHlfYmFyXCIpO1xyXG4gICAgICAgIHRoaXMuaGVhbHRoQmFyLmZpeGVkVG9DYW1lcmEgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMuaGVhbHRoQmFyLmNhbWVyYU9mZnNldC5zZXRUbygxMDAsIDE1KTtcclxuICAgICAgICB0aGlzLmZ1ZWxCYXIgPSBuZXcgSGVhbHRoQmFyKHRoaXMuZ2FtZSwgMCwwLCBcImpldEZ1ZWxfYmFyXCIsIFwiZW1wdHlfYmFyXCIpO1xyXG4gICAgICAgIHRoaXMuZnVlbEJhci5maXhlZFRvQ2FtZXJhID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLmZ1ZWxCYXIuY2FtZXJhT2Zmc2V0LnNldFRvKDEwMCwgMzUpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMucGxheWVyTGlmZVVJID0gdGhpcy5nYW1lLmFkZC5zcHJpdGUoMCwwLCAnbmluamFfaGVhZCcpO1xyXG4gICAgICAgIHRoaXMucGxheWVyTGlmZVVJLmZpeGVkVG9DYW1lcmEgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMucGxheWVyTGlmZVVJLmNhbWVyYU9mZnNldC5zZXRUbygzICwxNSk7XHJcbiAgICAgICAgdGhpcy5saWZlVGV4dCA9IHRoaXMuYWRkLnRleHQoMCwwLFwieFwiLCB0aGlzLnN0eWxlVUkpO1xyXG4gICAgICAgIHRoaXMubGlmZVRleHQuZml4ZWRUb0NhbWVyYSA9dHJ1ZTtcclxuICAgICAgICB0aGlzLmxpZmVUZXh0LmNhbWVyYU9mZnNldC5zZXRUbyg1NSwgMzApO1xyXG4gICAgICAgIHRoaXMubGlmZVRleHQuZm9udFNpemUgPSAyNTtcclxuICAgICAgICBcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLmNvaW5VSSA9IHRoaXMuZ2FtZS5hZGQuc3ByaXRlKDAsMCwgJ2NvaW5zJywwLCk7XHJcbiAgICAgICAgdGhpcy5jb2luVUkuc2NhbGUuc2V0VG8oLjc1KTtcclxuICAgICAgICB0aGlzLmNvaW5VSS5maXhlZFRvQ2FtZXJhID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLmNvaW5VSS5jYW1lcmFPZmZzZXQuc2V0VG8odGhpcy5nYW1lLndpZHRoIC0gMjAwLDE1KTtcclxuICAgICAgICB0aGlzLmNvaW5UZXh0ID0gdGhpcy5nYW1lLmFkZC50ZXh0KDAsMCwgXCIwXCIsICB0aGlzLnN0eWxlVUkgKTtcclxuXHJcbiAgICAgICAgIHRoaXMuY29pblRleHQuZml4ZWRUb0NhbWVyYSA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5jb2luVGV4dC5jYW1lcmFPZmZzZXQuc2V0VG8odGhpcy5nYW1lLndpZHRoIC0gMTUwLDE1KTtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLmVuZW15VUkgPSB0aGlzLmdhbWUuYWRkLnNwcml0ZSgwLDAsJ2VuZW15VUknKTtcclxuICAgICAgICB0aGlzLmVuZW15VUkuZml4ZWRUb0NhbWVyYSA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5lbmVteVVJLmNhbWVyYU9mZnNldC5zZXRUbyh0aGlzLmdhbWUud2lkdGggLSAyMDUsNTUpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5lbmVteVRleHQgPSB0aGlzLmdhbWUuYWRkLnRleHQoMCwwLCBcIjAlXCIsICB0aGlzLnN0eWxlVUkpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMuZW5lbXlUZXh0LmZpeGVkVG9DYW1lcmEgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMuZW5lbXlUZXh0LmNhbWVyYU9mZnNldC5zZXRUbyh0aGlzLmdhbWUud2lkdGggLSAxNTAsNTUpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIFxyXG4gICAgICAgICB0aGlzLlVJTGF5ZXIuYWRkKHRoaXMuZW5lbXlVSSk7XHJcbiAgICAgICAgdGhpcy5VSUxheWVyLmFkZCh0aGlzLmNvaW5VSSk7XHJcbiAgICAgICAgdGhpcy5VSUxheWVyLmFkZCh0aGlzLmVuZW15VUkpO1xyXG4gICAgICAgIHRoaXMuVUlMYXllci5hZGQodGhpcy5oZWFsdGhCYXIpO1xyXG4gICAgICAgIHRoaXMuVUlMYXllci5hZGQodGhpcy5mdWVsQmFyKTtcclxuXHJcbiAgICAgICAgXHJcbiAgICAgICAgXHJcbiAgICB9XHJcbiAgICBcclxuICAgIGVuZW15U2hvdChlbmVteSwgYnVsbGV0KXtcclxuICAgICBcclxuICAgICAgICBidWxsZXQua2lsbCgpO1xyXG4gICAgICAgIGVuZW15LmVuZW15SGVhbHRoLmN1cnJlbnQtLTtcclxuXHJcbiAgICAgICAgIFxyXG4gICAgICAgaWYoZW5lbXkuZW5lbXlIZWFsdGguY3VycmVudCA9PT0gMCl7XHJcbiAgICAgICAgICAgXHJcbiAgICAgICAgICAgdGhpcy5lbmVteUNvdW50LmN1cnJlbnQtLTtcclxuICAgICAgICAgICB0aGlzLmVuZW15VGV4dC50ZXh0ID0gICgoMSAtICh0aGlzLmVuZW15Q291bnQuY3VycmVudC90aGlzLmVuZW15Q291bnQudG90YWwpKSAqIDEwMCkudG9GaXhlZCgxKSArIFwiJVwiOyBcclxuICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIHZhciBleHBsb3Npb24gPSB0aGlzLmV4cGxvc2lvbnMuZ2V0Rmlyc3REZWFkKCk7XHJcbiAgICAgICAgaWYoZXhwbG9zaW9uKXtcclxuICAgICAgICAgICAgZXhwbG9zaW9uLnggPSBlbmVteS54O1xyXG4gICAgICAgICAgICBleHBsb3Npb24ueSA9IGVuZW15Lnk7XHJcbiAgICAgICAgICAgIGV4cGxvc2lvbi5yZXZpdmUoKTtcclxuICAgICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICBleHBsb3Npb24gPSB0aGlzLmdhbWUuYWRkLnNwcml0ZShlbmVteS54LCBlbmVteS55LCAnZXhwbG9zaW9uJyk7XHJcbiAgICAgICAgICAgZXhwbG9zaW9uLmFuY2hvci5zZXRUbyguNSwuNSk7XHJcbiAgICAgICAgICAgdmFyIGV4YW5pbSA9IGV4cGxvc2lvbi5hbmltYXRpb25zLmFkZCgnZXhwbG9kZScsWzAsMSwyLDMsNCw1LDZdLDEwLCBmYWxzZSk7XHJcbiAgICAgICAgICAgZXhhbmltLmtpbGxPbkNvbXBsZXRlID0gdHJ1ZTsgICAgICAgXHJcbiAgICAgICAgICAgfVxyXG4gICAgICAgIGV4YW5pbS5wbGF5KCk7ICAgXHJcbiAgICAgICBlbmVteS5kZXN0cm95RW5lbXkgPSB0cnVlO1xyXG4gICAgICAgICAgIFxyXG4gICAgICAgfWVsc2V7XHJcblxyXG4gICAgICAgIHZhciBlbWl0dGVyID0gdGhpcy5nYW1lLmFkZC5lbWl0dGVyKGVuZW15LngsIGVuZW15LnksIDEwMCk7XHJcbiAgICAgICAgICAgIGVtaXR0ZXIubWFrZVBhcnRpY2xlcygncmVkX2ZsYW1lJyk7XHJcbiAgICAgICAgICAgIGVtaXR0ZXIubWluUGFydGljbGVTcGVlZC5zZXRUbygtMTAwLCAtMTAwKTtcclxuICAgICAgICAgICAgZW1pdHRlci5tYXhQYXJ0aWNsZVNwZWVkLnNldFRvKDEwMCwgMTAwKTtcclxuICAgICAgICAgICAgZW1pdHRlci5ncmF2aXR5ID0gMjA7XHJcbiAgICAgICAgICAgIGVtaXR0ZXIuc3RhcnQodHJ1ZSwgNTAwLCBudWxsLCAxMDApO1xyXG4gICAgICAgXHJcbiAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgXHJcbiAgICAgICAgXHJcbiAgICB9XHJcblxyXG4gICAgXHJcbiAgICBwbGF5ZXJTaG90KHBsYXllciwgYnVsbGV0KXtcclxuXHJcbiAgICAgICAgXHJcbiAgICAgICAgICB2YXIgZW1pdHRlciA9IHRoaXMuZ2FtZS5hZGQuZW1pdHRlcihwbGF5ZXIueCwgcGxheWVyLnksIDEwMCk7XHJcbiAgICAgICAgICAgIGVtaXR0ZXIubWFrZVBhcnRpY2xlcygnYmx1ZV9mbGFtZScpO1xyXG4gICAgICAgICAgICBlbWl0dGVyLm1pblBhcnRpY2xlU3BlZWQuc2V0VG8oLTEwMCwgLTEwMCk7XHJcbiAgICAgICAgICAgIGVtaXR0ZXIubWF4UGFydGljbGVTcGVlZC5zZXRUbygxMDAsIDEwMCk7XHJcbiAgICAgICAgICAgIGVtaXR0ZXIuZ3Jhdml0eSA9IDIwO1xyXG4gICAgICAgICAgICBlbWl0dGVyLnN0YXJ0KHRydWUsIDUwMCwgbnVsbCwgMTAwKTtcclxuXHJcbiAgICAgICAgYnVsbGV0LmtpbGwoKTtcclxuICAgICAgIHRoaXMucGxheWVyRGFtYWdlZChwbGF5ZXIsMSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG5cclxuXHJcbiAgICBcclxuY29sbGVjdChwbGF5ZXIsY29pbil7XHJcbiAgICAgICAgICAgIGNvaW4ua2lsbCgpO1xyXG4gICAgICAgICAgICB0aGlzLnNjb3JlKys7XHJcbiAgICAgICAgICAgIHRoaXMuY29pblRleHQudGV4dCA9IHRoaXMuc2NvcmU7XHJcbiAgICAgICAgICAgIHRoaXMuY29sbGVjdFNvdW5kLnBsYXkoKTtcclxuICAgICAgICB9XHJcbiAgICBcclxuY29sbGVjdEhlYWx0aChwbGF5ZXIsIGhlYWx0aCl7XHJcbiBcclxuICAgIGhlYWx0aC5raWxsKCk7XHJcbiBcclxuICAgIHBsYXllci5oZWFsdGguY3VycmVudCArPSBwbGF5ZXIuaGVhbHRoLm1heC8yO1xyXG4gICAgaWYocGxheWVyLmhlYWx0aC5jdXJyZW50ID4gcGxheWVyLmhlYWx0aC5tYXgpe1xyXG4gICAgICAgIHBsYXllci5oZWFsdGguY3VycmVudCA9IHBsYXllci5oZWFsdGgubWF4O1xyXG4gICAgfVxyXG4gICAgdGhpcy5oZWFsdGhCYXIuc2V0VmFsdWUocGxheWVyLmhlYWx0aC5jdXJyZW50LyBwbGF5ZXIuaGVhbHRoLm1heCk7XHJcblxyXG59ICAgIFxyXG5vcGVuRG9vcihwbGF5ZXIsIGRvb3Ipe1xyXG4gICAgaWYodGhpcy5kb29ySXNDbG9zZWQpe1xyXG4gICAgICAgIGRvb3IucGxheSgnb3BlbicpO1xyXG4gICAgICAgIHRoaXMuZG9vcklzQ2xvc2VkID0gZmFsc2U7XHJcbiAgICB9ZWxzZSBpZih0aGlzLm1haW5DaGFyZWN0ZXIuanVtcC5pc0Rvd24pe1xyXG4gICAgICAgICAgICBwbGF5ZXIuYm9keS52ZWxvY2l0eS55ID0gMDtcclxuICAgICAgICBpZih0aGlzLmVuZW15Q291bnQuY3VycmVudCA8PSB0aGlzLmVuZW15Q291bnQudG90YWwgKiAuNzUpe1xyXG4gICAgICAgICAgICB0aGlzLmdhbWUuc3RhdGUuc3RhcnQoJ2xldmVsMicsIHRydWUsIGZhbHNlLCB0aGlzLnNjb3JlICk7XHJcbiAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgIHRoaXMuZW5lbXlUZXh0LmFkZENvbG9yKCcjRkYwMDAwJywgMCkgO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgIH1cclxuICAgIFxyXG4gICAgXHJcbn0gIFxyXG4gICAgXHJcbiAgICBlbGVjdHJvY3V0ZShwbGF5ZXIsIHNob2Nrcyl7XHJcbiAgICBpZih0aGlzLmRlYXRoRGVsYXkgPCB0aGlzLmdhbWUudGltZS5ub3cpe1xyXG4gICAgICAgIHRoaXMuZGVhdGhEZWxheSA9IHRoaXMuZ2FtZS50aW1lLm5vdyArIFBoYXNlci5UaW1lci5TRUNPTkQgKiAuNTtcclxuICAgICAgICBcclxuICAgICAgdGhpcy5wbGF5ZXJEYW1hZ2VkKHBsYXllciwyKTtcclxuICAgICAgICBcclxuICAgICAgICBcclxuICAgIH0gXHJcbiAgICB9XHJcbiAgICAgICBcclxuICAgIHBsYXllckRhbWFnZWQocGxheWVyLCBkYW1hZ2Upe1xyXG4gICAgICAgICAgIGlmKHBsYXllci5oZWFsdGguY3VycmVudCA+IDApe1xyXG4gICAgICAgICAgICAgICBjb25zb2xlLmxvZyhwbGF5ZXIuaGVhbHRoLmN1cnJlbnQpO1xyXG4gICAgICAgICAgICBwbGF5ZXIuaGVhbHRoLmN1cnJlbnQtPWRhbWFnZTtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHBsYXllci5oZWFsdGguY3VycmVudCk7XHJcbiAgICAgICAgICAgICBwbGF5ZXIuZmxhc2goKTtcclxuICAgICAgICB0aGlzLmhlYWx0aEJhci5zZXRWYWx1ZShwbGF5ZXIuaGVhbHRoLmN1cnJlbnQvIHBsYXllci5oZWFsdGgubWF4KTtcclxuICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgcGxheWVyLmRpZWQoKTsgICBcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgICAgXHJcbiAgICAgICAgXHJcbiAgICB9XHJcbiAgICBcclxuICAgIGJ1bGxldFNwYXJrKGJ1bGxldCwgbGF5ZXIpe1xyXG4gICAgICAgIHZhciBlbWl0dGVyID0gdGhpcy5nYW1lLmFkZC5lbWl0dGVyKGJ1bGxldC54LCBidWxsZXQueSwgMTAwKTtcclxuICAgICAgICAgICAgZW1pdHRlci5tYWtlUGFydGljbGVzKCdibHVlX2ZsYW1lJyk7XHJcbiAgICAgICAgICAgIGVtaXR0ZXIubWluUGFydGljbGVTcGVlZC5zZXRUbygtMTAwLCAtMTAwKTtcclxuICAgICAgICAgICAgZW1pdHRlci5tYXhQYXJ0aWNsZVNwZWVkLnNldFRvKDEwMCwgMTAwKTtcclxuICAgICAgICAgICAgZW1pdHRlci5ncmF2aXR5ID0gMjA7XHJcbiAgICAgICAgICAgIGVtaXR0ZXIuc3RhcnQodHJ1ZSwgNTAwLCBudWxsLCAxMDApO1xyXG4gICAgICAgIFxyXG4gICAgICAgIFxyXG4gICAgICAgIFxyXG4gICAgICAgIGJ1bGxldC5raWxsKCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgXHJcbiAgICAgICAgXHJcbiAgICB9XHJcbiAgICBcclxuICAgIHBsYXllckJ1bGxldFNwYXJrKGJ1bGxldCwgbGF5ZXIpe1xyXG4gICAgICAgIFxyXG4gICAgICAgICAgdmFyIGVtaXR0ZXIgPSB0aGlzLmdhbWUuYWRkLmVtaXR0ZXIoYnVsbGV0LngsIGJ1bGxldC55LCAxMDApO1xyXG4gICAgICAgICAgICBlbWl0dGVyLm1ha2VQYXJ0aWNsZXMoJ3JlZF9mbGFtZScpO1xyXG4gICAgICAgICAgICBlbWl0dGVyLm1pblBhcnRpY2xlU3BlZWQuc2V0VG8oLTEwMCwgLTEwMCk7XHJcbiAgICAgICAgICAgIGVtaXR0ZXIubWF4UGFydGljbGVTcGVlZC5zZXRUbygxMDAsIDEwMCk7XHJcbiAgICAgICAgICAgIGVtaXR0ZXIuZ3Jhdml0eSA9IDIwO1xyXG4gICAgICAgICAgICBlbWl0dGVyLnN0YXJ0KHRydWUsIDUwMCwgbnVsbCwgMTAwKTtcclxuICAgICAgICBcclxuICAgICAgICBidWxsZXQua2lsbCgpO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICByb2NrZXRLaWxsKGVuZW15LCBidWxsZXQpe1xyXG4gICAgICAgIFxyXG4gICAgICAgIGJ1bGxldC5raWxsKCk7XHJcbiAgICAgICAgZW5lbXkuZW5lbXlIZWFsdGguY3VycmVudC0tO1xyXG5cclxuICAgICAgICAgXHJcbiAgICAgICAgICBcclxuICAgICAgICAgICB0aGlzLmVuZW15Q291bnQuY3VycmVudC0tO1xyXG4gICAgICAgICAgIHRoaXMuZW5lbXlUZXh0LnRleHQgPSAgKCgxIC0gKHRoaXMuZW5lbXlDb3VudC5jdXJyZW50L3RoaXMuZW5lbXlDb3VudC50b3RhbCkpICogMTAwKS50b0ZpeGVkKDEpICsgXCIlXCI7IFxyXG4gICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgdmFyIGV4cGxvc2lvbiA9IHRoaXMuZXhwbG9zaW9ucy5nZXRGaXJzdERlYWQoKTtcclxuICAgICAgICBpZihleHBsb3Npb24pe1xyXG4gICAgICAgICAgICBleHBsb3Npb24ueCA9IGVuZW15Lng7XHJcbiAgICAgICAgICAgIGV4cGxvc2lvbi55ID0gZW5lbXkueTtcclxuICAgICAgICAgICAgZXhwbG9zaW9uLnJldml2ZSgpO1xyXG4gICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgIGV4cGxvc2lvbiA9IHRoaXMuZ2FtZS5hZGQuc3ByaXRlKGVuZW15LngsIGVuZW15LnksICdleHBsb3Npb24nKTtcclxuICAgICAgICAgICBleHBsb3Npb24uYW5jaG9yLnNldFRvKC41LC41KTtcclxuICAgICAgICAgICB2YXIgZXhhbmltID0gZXhwbG9zaW9uLmFuaW1hdGlvbnMuYWRkKCdleHBsb2RlJyxbMCwxLDIsMyw0LDUsNl0sMTAsIGZhbHNlKTtcclxuICAgICAgICAgICBleGFuaW0ua2lsbE9uQ29tcGxldGUgPSB0cnVlOyAgICAgICBcclxuICAgICAgICAgICB9XHJcbiAgICAgICAgZXhhbmltLnBsYXkoKTtcclxuICAgICAgICBlbmVteS5kZXN0cm95RW5lbXkgPSB0cnVlO1xyXG4gICAgICAgIFxyXG4gICAgfVxyXG4gICAgXHJcbiAgICByb2NrZXRFeHBsb2RlKHJvY2tldCxsYXllcil7XHJcbiAgICAgICAgXHJcbiAgICAgICAgcm9ja2V0LmtpbGwoKTtcclxuICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIHZhciBleHBsb3Npb24gPSB0aGlzLmV4cGxvc2lvbnMuZ2V0Rmlyc3REZWFkKCk7XHJcbiAgICAgICAgaWYoZXhwbG9zaW9uKXtcclxuICAgICAgICAgICAgZXhwbG9zaW9uLnggPSByb2NrZXQueDtcclxuICAgICAgICAgICAgZXhwbG9zaW9uLnkgPSByb2NrZXQueTtcclxuICAgICAgICAgICAgZXhwbG9zaW9uLnJldml2ZSgpO1xyXG4gICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgIGV4cGxvc2lvbiA9IHRoaXMuZ2FtZS5hZGQuc3ByaXRlKHJvY2tldC54LCByb2NrZXQueSwgJ2V4cGxvc2lvbicpO1xyXG4gICAgICAgICAgIGV4cGxvc2lvbi5hbmNob3Iuc2V0VG8oLjUsLjUpO1xyXG4gICAgICAgICAgIHZhciBleGFuaW0gPSBleHBsb3Npb24uYW5pbWF0aW9ucy5hZGQoJ2V4cGxvZGUnLFswLDEsMiwzLDQsNSw2XSwxMCwgZmFsc2UpO1xyXG4gICAgICAgICAgIGV4YW5pbS5raWxsT25Db21wbGV0ZSA9IHRydWU7ICAgICAgIFxyXG4gICAgICAgICAgIH1cclxuICAgICAgICBleGFuaW0ucGxheSgpO1xyXG4gICAgICAgIFxyXG4gICAgfVxyXG4gICAgXHJcbiAgICAgICAgXHJcbiAgICBcclxuICAgIFxyXG4gICAgXHJcbn0iLCIvKiBnbG9iYWwgUGhhc2VyICovXHJcblxyXG5pbXBvcnQgUGxheWVyIGZyb20gXCIuLi9wcmVmYWJzL1BsYXllci5qc1wiO1xyXG5pbXBvcnQgRW5lbXkgZnJvbSAgXCIuLi9wcmVmYWJzL0VuZW15LmpzXCI7XHJcbmltcG9ydCBIZWFsdGhCYXIgZnJvbSBcIi4uL3ByZWZhYnMvSGVhbHRoQmFyLmpzXCI7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBMZXZlbDIgZXh0ZW5kcyBQaGFzZXIuU3RhdGUge1xyXG4gICAgXHJcbiAgICBpbml0KHNjb3JlKXtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLnNjb3JlID0gc2NvcmU7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcblxyXG4gICAgfVxyXG4gICAgcHJlbG9hZCgpe1xyXG4gICAgICAgICAgICAgICAgdGhpcy5sb2FkLmltYWdlKCd0aWxlc2V0JywnYXNzZXRzL2ltZy9zY2lfZmlfdGlsZXMucG5nJyk7XHJcbiAgICAgICAgICAgIHRoaXMubG9hZC50aWxlbWFwKCdteXRpbGVtYXAnLCdhc3NldHMvdGlsZXMvbGV2ZWwyLmpzb24nLCBudWxsLCBQaGFzZXIuVGlsZW1hcC5USUxFRF9KU09OKTsgICAgXHJcbiAgICAgICAgXHJcbiAgICB9XHJcbiAgICBcclxuICAgIGNyZWF0ZSgpIHtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLmdhbWUucGh5c2ljcy5zdGFydFN5c3RlbShQaGFzZXIuUGh5c2ljcy5BUkNBREUpO1xyXG4gICAgICAgIHRoaXMuZ2FtZS5zdGFnZS5iYWNrZ3JvdW5kQ29sb3IgPSBcIiM5MThhODdcIjtcclxuICAgICAgICBcclxuICAgICAgICBcclxuICAgICAgICAgICAgdGhpcy5kb29ySXNDbG9zZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICB0aGlzLmVuZW15Q291bnQgPSB7Y3VycmVudDogMCwgdG90YWw6IDB9O1xyXG4gICAgICAgICAgICB0aGlzLmRlYXRoRGVsYXkgPSAwO1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8vY3JlYXRlIHRpbGVzZXRcclxuICAgICAgICAgICAgdGhpcy5teVRpbGVzID0gdGhpcy5nYW1lLmFkZC50aWxlbWFwKCdteXRpbGVtYXAnKTtcclxuICAgICAgICAgICAgdGhpcy5teVRpbGVzLmFkZFRpbGVzZXRJbWFnZSgnc2NpX2ZpX3RpbGVzJywgJ3RpbGVzZXQnKTtcclxuICAgICAgICAgICAgdGhpcy5teVRpbGVzLnNldENvbGxpc2lvbkJldHdlZW4oMCw1MDApO1xyXG4gICAgICAgICAgICB0aGlzLm15dGlsZWJhY2tncm91bmQgPSB0aGlzLm15VGlsZXMuY3JlYXRlTGF5ZXIoJ0JhY2tncm91bmQnKTtcclxuICAgICAgICAgICAgdGhpcy5teXRpbGVzbGF5ZXIgPSB0aGlzLm15VGlsZXMuY3JlYXRlTGF5ZXIoJ1dvcmxkJyk7XHJcbiAgICAgICAgICAgIHRoaXMubXl0aWxlc2xheWVyLnJlc2l6ZVdvcmxkKCk7IFxyXG4gICAgICAgXHJcbiAgICAgICAgICB0aGlzLnF1YWRUcmVlID0gbmV3IFBoYXNlci5RdWFkVHJlZSgwLCAwLCB0aGlzLmdhbWUud29ybGQud2lkdGgsIHRoaXMuZ2FtZS53b3JsZC5oZWlnaHQsIDQsIDQsIDApO1xyXG4gICAgICAgICAgXHJcbiAgICAgICAgXHJcbiAgICB0aGlzLnBsYXllckJ1bGxldHMgPSB0aGlzLmFkZC5ncm91cCgpO1xyXG4gICAgdGhpcy5wbGF5ZXJCdWxsZXRzLmVuYWJsZUJvZHkgPSB0cnVlO1xyXG4gICAgdGhpcy5wbGF5ZXJCdWxsZXRzLnBoeXNpY3NCb2R5VHlwZSA9IFBoYXNlci5QaHlzaWNzLkFSQ0FERTtcclxuICAgICAgICBcclxuICAgICB0aGlzLnBsYXllclJvY2tldHMgPSB0aGlzLmFkZC5ncm91cCgpO1xyXG4gICAgdGhpcy5wbGF5ZXJSb2NrZXRzLmVuYWJsZUJvZHkgPSB0cnVlO1xyXG4gICAgdGhpcy5wbGF5ZXJSb2NrZXRzLnBoeXNpY3NCb2R5VHlwZSA9IFBoYXNlci5QaHlzaWNzLkFSQ0FERTsgICAgXHJcbiAgICAgICAgXHJcbiAgICAgdGhpcy5lbmVteUJ1bGxldHMgPSB0aGlzLmFkZC5ncm91cCgpO1xyXG4gICAgdGhpcy5lbmVteUJ1bGxldHMuZW5hYmxlQm9keSA9IHRydWU7XHJcbiAgICB0aGlzLmVuZW15QnVsbGV0cy5waHlzaWNzQm9keVR5cGUgPSBQaGFzZXIuUGh5c2ljcy5BUkNBREU7IFxyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMuc2V0dXBVSSgpO1xyXG4gICBcclxuICAgICAgICBcclxuICAgLy9jcmVhdGUgZG9vciAgICAgXHJcbiAgIHRoaXMubXlUaWxlcy5jcmVhdGVGcm9tT2JqZWN0cygnRG9vcicsNjE4LCdkb29yJywwLHRydWUsIGZhbHNlKTsgICAgXHJcbiAgIHRoaXMuZG9vciA9IHRoaXMud29ybGQuZ2V0VG9wKCk7XHJcbiAgIHRoaXMuZ2FtZS5waHlzaWNzLmFyY2FkZS5lbmFibGUodGhpcy5kb29yKTtcclxuICAgdGhpcy5kb29yLmFuaW1hdGlvbnMuYWRkKCdvcGVuJyxbMCwxLDIsMyw0XSwgMTAsIGZhbHNlKTtcclxuICAgICAgICBcclxuICAgIFxyXG4gICAgXHJcbiAgICAvL2NyZWF0ZSBtYWluIENoYXJlY3RlciAgICBcclxuLy8gICAgdGhpcy5tYWluQ2hhcmVjdGVyID0gbmV3IFBsYXllcih0aGlzLmdhbWUsIDQwMCwgNTAsIHRoaXMucGxheWVyQnVsbGV0cywgdGhpcy5wbGF5ZXJSb2NrZXRzLCB0aGlzLmZ1ZWxCYXIsIHRoaXMuaGVhbHRoQmFyKTtcclxuLy8gICAgdGhpcy5nYW1lLmFkZC5leGlzdGluZyh0aGlzLm1haW5DaGFyZWN0ZXIpO1xyXG4gICAgICAgIFxyXG4gICAgdGhpcy5teVRpbGVzLmNyZWF0ZUZyb21PYmplY3RzKCdQbGF5ZXInLDUxOSwnbnVsbCcsJ251bGwnLHRydWUsIGZhbHNlLCB0aGlzLndvcmxkLCBQbGF5ZXIpO1xyXG4gICAgdGhpcy5tYWluQ2hhcmVjdGVyID0gdGhpcy53b3JsZC5nZXRUb3AoKTtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLm1haW5DaGFyZWN0ZXIuYnVsbGV0cyA9IHRoaXMucGxheWVyQnVsbGV0cztcclxuICAgICAgICB0aGlzLm1haW5DaGFyZWN0ZXIucm9ja2V0cyA9IHRoaXMucGxheWVyUm9ja2V0cztcclxuICAgICAgICB0aGlzLm1haW5DaGFyZWN0ZXIuZnVlbFVJID0gdGhpcy5mdWVsQmFyO1xyXG4gICAgICAgIHRoaXMubWFpbkNoYXJlY3Rlci5oZWFsdGhVSSA9IHRoaXMuaGVhbHRoQmFyO1xyXG4gICAgICAgIHRoaXMubWFpbkNoYXJlY3Rlci5saWZlVUkgPSB0aGlzLmxpZmVUZXh0O1xyXG4gICAgICAgIHRoaXMubGlmZVRleHQudGV4dCA9IFwieCBcIiArIHRoaXMubWFpbkNoYXJlY3Rlci5saXZlcztcclxuICAgICAgICBcclxuICAgIHRoaXMuZ2FtZS5jYW1lcmEuZm9sbG93KHRoaXMubWFpbkNoYXJlY3Rlcik7XHJcbiAgICAgICAgICAgICAgXHJcbiAgICAgICAgLy9wbGFjZSBlbmVtaWVzXHJcbiAgICAgICAgdGhpcy5lbmVtaWVzID0gdGhpcy5hZGQuZ3JvdXAoKTtcclxuICAgICAgICB0aGlzLm15VGlsZXMuY3JlYXRlRnJvbU9iamVjdHMoJ0VuZW1pZXMnLCA2MjMsICdudWxsJywgJ251bGwnLCB0cnVlLCBmYWxzZSwgdGhpcy5lbmVtaWVzLCBFbmVteSk7XHJcbiAgICAgICAgdGhpcy5lbmVtaWVzLnNldEFsbCgncGxheWVyJywgdGhpcy5tYWluQ2hhcmVjdGVyKTtcclxuICAgICAgICB0aGlzLmVuZW1pZXMuc2V0QWxsKCdidWxsZXRzJywgdGhpcy5lbmVteUJ1bGxldHMpO1xyXG4gICAgICAgIHRoaXMuZW5lbWllcy5zZXRBbGwoJ2xheWVyJywgdGhpcy5teXRpbGVzbGF5ZXIpO1xyXG4gICAgICAgIHRoaXMuZW5lbWllcy5zZXRBbGwoJ2RldGVjdERpc3RhbmNlJywgOTAwKTtcclxuICAgICAgICB0aGlzLmVuZW1pZXMuc2V0QWxsKCdzaG90c1BlclNlY29uZCcsIDEuNSk7XHJcbiAgICAgICAgdGhpcy5lbmVteUNvdW50LmN1cnJlbnQgPSB0aGlzLmVuZW15Q291bnQudG90YWwgPSB0aGlzLmVuZW1pZXMubGVuZ3RoO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGNvbnNvbGUubG9nKHRoaXMuZW5lbWllcyk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgXHJcbiAgICAgICAgXHJcbiAgICAgICAgICAgIHRoaXMuY29sbGVjdFNvdW5kID0gdGhpcy5hZGQuYXVkaW8oJ2NvbGxlY3QnKTtcclxuICAgICAgICAgICAgdGhpcy5qZXRBdWRpbyA9IHRoaXMuYWRkLmF1ZGlvKCdqZXRzJyk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBcclxuICAgICAgICBcclxuICAgICAgICAgICBcclxuICAgICAgICAgICAgXHJcbiAgICAgICBcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHRoaXMuY29pbnMgPSB0aGlzLmFkZC5ncm91cCgpO1xyXG4gICAgICAgICAgICB0aGlzLmNvaW5zLmVuYWJsZUJvZHkgPSB0cnVlO1xyXG4gICAgICAgICAgICB0aGlzLm15VGlsZXMuY3JlYXRlRnJvbU9iamVjdHMoJ2dlbXMnLCA2ODEsICdjb2lucycsIDAsIHRydWUsIGZhbHNlLCB0aGlzLmNvaW5zKTtcclxuXHJcbiAgLy8gIEFkZCBhbmltYXRpb25zIHRvIGFsbCBvZiB0aGUgY29pbiBzcHJpdGVzXHJcbiAgICAgICAgICAgXHJcbiAgICB0aGlzLmNvaW5zLmNhbGxBbGwoJ2FuaW1hdGlvbnMuYWRkJywgJ2FuaW1hdGlvbnMnLCAnc3BpbicsIFswLCAxLCAyLCAzLCA0LCA1XSwgMTAsIHRydWUpO1xyXG4gICAgdGhpcy5jb2lucy5jYWxsQWxsKCdhbmltYXRpb25zLnBsYXknLCAnYW5pbWF0aW9ucycsICdzcGluJyk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5zaG9ja3MgPSB0aGlzLmFkZC5ncm91cCgpO1xyXG4gICAgICAgIHRoaXMuc2hvY2tzLmVuYWJsZUJvZHkgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMubXlUaWxlcy5jcmVhdGVGcm9tT2JqZWN0cygnU2hvY2tzJywgNzEyLCAnc2hvY2snLCAwLCB0cnVlLCBmYWxzZSwgdGhpcy5zaG9ja3MpO1xyXG4gICAgICAgIHRoaXMuc2hvY2tzLnNldEFsbCgnYm9keS5pbW1vdmFibGUnLCB0cnVlKTtcclxuICAgICAgICB0aGlzLnNob2Nrcy5jYWxsQWxsKCdib2R5LnNldFNpemUnLCAnYm9keScgLCAxMjgsIDEwLCAwLCA1OSk7XHJcbiAgICAgICAgdGhpcy5zaG9ja3MuY2FsbEFsbCgnYW5pbWF0aW9ucy5hZGQnLCAnYW5pbWF0aW9ucycsICd3aWdnbGUnLCBbMCwgMSwgMiwgM10sIDEwLCB0cnVlKTtcclxuICAgICAgICB0aGlzLnNob2Nrcy5jYWxsQWxsKCdhbmltYXRpb25zLnBsYXknLCAnYW5pbWF0aW9ucycsICd3aWdnbGUnKTtcclxuICAgICAgICBcclxuICAgICAgICAgdGhpcy52ZXJ0U2hvY2tzID0gdGhpcy5hZGQuZ3JvdXAoKTtcclxuICAgICAgICB0aGlzLnZlcnRTaG9ja3MuZW5hYmxlQm9keSA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5teVRpbGVzLmNyZWF0ZUZyb21PYmplY3RzKCdTaG9ja3MnLCA3MDUsICdzaG9jaycsIDAsIHRydWUsIGZhbHNlLCB0aGlzLnZlcnRTaG9ja3MpO1xyXG4gICAgICAgIHRoaXMudmVydFNob2Nrcy5zZXRBbGwoJ2JvZHkuaW1tb3ZhYmxlJywgdHJ1ZSk7XHJcbiAgICAgICAgdGhpcy52ZXJ0U2hvY2tzLmNhbGxBbGwoJ2JvZHkuc2V0U2l6ZScsICdib2R5JyAsIDEwLCAxMjgsIDU5LCAwKTtcclxuICAgICAgICB0aGlzLnZlcnRTaG9ja3MuY2FsbEFsbCgnYW5pbWF0aW9ucy5hZGQnLCAnYW5pbWF0aW9ucycsICd2ZXJ0X3dpZ2dsZScsIFs4LCA5LCAxMCwgMTFdLCAxMCwgdHJ1ZSk7XHJcbiAgICAgICAgdGhpcy52ZXJ0U2hvY2tzLmNhbGxBbGwoJ2FuaW1hdGlvbnMucGxheScsICdhbmltYXRpb25zJywgJ3ZlcnRfd2lnZ2xlJyk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgICB0aGlzLmhlYWx0aFBhY2tzID0gdGhpcy5hZGQuZ3JvdXAoKTtcclxuICAgICAgICB0aGlzLmhlYWx0aFBhY2tzLmVuYWJsZUJvZHkgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMubXlUaWxlcy5jcmVhdGVGcm9tT2JqZWN0cygnSGVhbHRoJywgNzI3LCAnaGVhbHRoX3BhY2snLCAwLCB0cnVlLCBmYWxzZSwgdGhpcy5oZWFsdGhQYWNrcyk7XHJcbiAgICAgICAgdGhpcy5oZWFsdGhQYWNrcy5zZXRBbGwoJ2JvZHkuaW1tb3ZhYmxlJywgdHJ1ZSk7XHJcbi8vICAgICAgICB0aGlzLmhlYWx0aFBhY2tzLmNhbGxBbGwoJ2JvZHkuc2V0U2l6ZScsICdib2R5JyAsIDEwLCAxMjgsIDU5LCAwKTtcclxuICAgICBcclxuICAgICAgICBcclxuICAgIFxyXG4gICAgICAgIHRoaXMuZXhwbG9zaW9ucyA9IHRoaXMuYWRkLmdyb3VwKCk7IFxyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgXHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBcclxuICAgXHJcbiAgICAgICAgXHJcbiAgICAgICAgICAgIFxyXG4gIFxyXG4gICAgICAgICAgICBcclxuICAgICAgIFxyXG4gICAgfVxyXG4gICAgXHJcbiAgICB1cGRhdGUoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5xdWFkVHJlZS5jbGVhcigpO1xyXG4gICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIGZvcih2YXIgaSA9IDA7IGk8IHRoaXMuZW5lbWllcy5sZW5ndGg7IGkrKyl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZW5lbWllcy5nZXRBdChpKS5lbmVteVVwZGF0ZSA9IGZhbHNlO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5xdWFkVHJlZS5pbnNlcnQodGhpcy5lbmVtaWVzLmdldEF0KGkpKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbi8vICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmZvdW5kID0gdGhpcy5xdWFkVHJlZS5yZXRyaWV2ZSh0aGlzLm1haW5DaGFyZWN0ZXIpO1xyXG4vLyAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgZm9yKHZhciBpID0gMDsgaSA8IHRoaXMuZm91bmQubGVuZ3RoOyBpKysgKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZm91bmRbaV0uZW5lbXlVcGRhdGUgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYodGhpcy5mb3VuZFtpXS5kZXN0cm95RW5lbXkpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5mb3VuZFtpXS5kZXN0cm95KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgXHJcbiAgICAgICAgICAgIHRoaXMucGh5c2ljcy5hcmNhZGUub3ZlcmxhcCh0aGlzLm1haW5DaGFyZWN0ZXIsIHRoaXMuaGVhbHRoUGFja3MsIHRoaXMuY29sbGVjdEhlYWx0aCwgbnVsbCwgdGhpcyk7XHJcbiAgICAgICAgICAgIHRoaXMucGh5c2ljcy5hcmNhZGUub3ZlcmxhcCh0aGlzLm1haW5DaGFyZWN0ZXIsIHRoaXMuc2hvY2tzLCB0aGlzLmVsZWN0cm9jdXRlLCBudWxsLCB0aGlzKTtcclxuICAgICAgICAgICAgdGhpcy5waHlzaWNzLmFyY2FkZS5vdmVybGFwKHRoaXMubWFpbkNoYXJlY3RlciwgdGhpcy52ZXJ0U2hvY2tzLCB0aGlzLmVsZWN0cm9jdXRlLCBudWxsLCB0aGlzKTtcclxuICAgICAgICAgICAgdGhpcy5waHlzaWNzLmFyY2FkZS5jb2xsaWRlKHRoaXMubWFpbkNoYXJlY3RlciwgdGhpcy5teXRpbGVzbGF5ZXIpO1xyXG4gICAgICAgICAgICB0aGlzLnBoeXNpY3MuYXJjYWRlLmNvbGxpZGUodGhpcy5lbmVtaWVzLCB0aGlzLm15dGlsZXNsYXllcik7XHJcbiAgICAgICAgICAgIHRoaXMucGh5c2ljcy5hcmNhZGUub3ZlcmxhcCh0aGlzLm1haW5DaGFyZWN0ZXIsIHRoaXMuY29pbnMsIHRoaXMuY29sbGVjdCAsIG51bGwsIHRoaXMpO1xyXG4gICAgICAgIFxyXG4gICAgICAgICAgICB0aGlzLnBoeXNpY3MuYXJjYWRlLmNvbGxpZGUodGhpcy5mb3VuZCwgdGhpcy5wbGF5ZXJCdWxsZXRzLCB0aGlzLmVuZW15U2hvdCwgbnVsbCwgdGhpcyk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgICAgIHRoaXMucGh5c2ljcy5hcmNhZGUuY29sbGlkZSh0aGlzLm1haW5DaGFyZWN0ZXIsIHRoaXMuZW5lbXlCdWxsZXRzLCB0aGlzLnBsYXllclNob3QsIG51bGwsIHRoaXMpO1xyXG4gICAgICAgICAgICB0aGlzLnBoeXNpY3MuYXJjYWRlLmNvbGxpZGUodGhpcy5teXRpbGVzbGF5ZXIsIHRoaXMuZW5lbXlCdWxsZXRzLCB0aGlzLmJ1bGxldFNwYXJrLCBudWxsLCB0aGlzKTtcclxuICAgICAgICAgICAgdGhpcy5waHlzaWNzLmFyY2FkZS5jb2xsaWRlKHRoaXMubXl0aWxlc2xheWVyLCB0aGlzLnBsYXllckJ1bGxldHMsIHRoaXMucGxheWVyQnVsbGV0U3BhcmssIG51bGwsIHRoaXMpO1xyXG4gICAgICAgICAgICB0aGlzLnBoeXNpY3MuYXJjYWRlLmNvbGxpZGUodGhpcy5lbmVtaWVzLCB0aGlzLnBsYXllclJvY2tldHMsIHRoaXMucm9ja2V0S2lsbCwgbnVsbCwgdGhpcyk7XHJcbiAgICAgICAgICAgIHRoaXMucGh5c2ljcy5hcmNhZGUuY29sbGlkZSh0aGlzLm15dGlsZXNsYXllciwgdGhpcy5wbGF5ZXJSb2NrZXRzLCB0aGlzLnJvY2tldEV4cGxvZGUsIG51bGwsIHRoaXMpO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICBcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgXHJcbiAgICAgICAgICAgIHRoaXMucGh5c2ljcy5hcmNhZGUub3ZlcmxhcCh0aGlzLm1haW5DaGFyZWN0ZXIsIHRoaXMuZG9vciwgdGhpcy5vcGVuRG9vciwgbnVsbCwgdGhpcyk7XHJcbiAgICAgICAgICAgXHJcbiAgICB9XHJcbiAgICBcclxuICAgIHJlbmRlcigpe1xyXG4gICAgICAgIFxyXG4vLyAgICAgICAgdGhpcy5nYW1lLmRlYnVnLnNwcml0ZUluZm8odGhpcy5jb2luVUksIDIwLCAzMik7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHNldHVwVUkoKSB7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5zdHlsZVVJID0ge1xyXG4gICAgICAgIGZvbnQ6IFwiNDBweCBBcmlhbFwiLFxyXG4gICAgICAgIGZpbGw6IFwiI2ZmZmZmZlwiLFxyXG4gICAgICAgIGFsaWduOiBcImNlbnRlclwiLFxyXG4gICAgICAgIHN0cm9rZTogJyMwMDAwMDAnLFxyXG4gICAgICAgIHN0cm9rZVRoaWNrbmVzczogMSxcclxuICAgICAgICAgXHJcbiAgICB9O1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMuVUlMYXllciA9IHRoaXMuYWRkLmdyb3VwKCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5oZWFsdGhCYXIgPSBuZXcgSGVhbHRoQmFyKHRoaXMuZ2FtZSwgMCwwLCBcImhlYWx0aF9iYXJcIiwgXCJlbXB0eV9iYXJcIik7XHJcbiAgICAgICAgdGhpcy5oZWFsdGhCYXIuZml4ZWRUb0NhbWVyYSA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5oZWFsdGhCYXIuY2FtZXJhT2Zmc2V0LnNldFRvKDEwMCwgMTUpO1xyXG4gICAgICAgIHRoaXMuZnVlbEJhciA9IG5ldyBIZWFsdGhCYXIodGhpcy5nYW1lLCAwLDAsIFwiamV0RnVlbF9iYXJcIiwgXCJlbXB0eV9iYXJcIik7XHJcbiAgICAgICAgdGhpcy5mdWVsQmFyLmZpeGVkVG9DYW1lcmEgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMuZnVlbEJhci5jYW1lcmFPZmZzZXQuc2V0VG8oMTAwLCAzNSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5wbGF5ZXJMaWZlVUkgPSB0aGlzLmdhbWUuYWRkLnNwcml0ZSgwLDAsICduaW5qYV9oZWFkJyk7XHJcbiAgICAgICAgdGhpcy5wbGF5ZXJMaWZlVUkuZml4ZWRUb0NhbWVyYSA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5wbGF5ZXJMaWZlVUkuY2FtZXJhT2Zmc2V0LnNldFRvKDMgLDE1KTtcclxuICAgICAgICB0aGlzLmxpZmVUZXh0ID0gdGhpcy5hZGQudGV4dCgwLDAsXCJ4XCIsIHRoaXMuc3R5bGVVSSk7XHJcbiAgICAgICAgdGhpcy5saWZlVGV4dC5maXhlZFRvQ2FtZXJhID10cnVlO1xyXG4gICAgICAgIHRoaXMubGlmZVRleHQuY2FtZXJhT2Zmc2V0LnNldFRvKDU1LCAzMCk7XHJcbiAgICAgICAgdGhpcy5saWZlVGV4dC5mb250U2l6ZSA9IDI1O1xyXG4gICAgICAgIFxyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMuY29pblVJID0gdGhpcy5nYW1lLmFkZC5zcHJpdGUoMCwwLCAnY29pbnMnLDAsKTtcclxuICAgICAgICB0aGlzLmNvaW5VSS5zY2FsZS5zZXRUbyguNzUpO1xyXG4gICAgICAgIHRoaXMuY29pblVJLmZpeGVkVG9DYW1lcmEgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMuY29pblVJLmNhbWVyYU9mZnNldC5zZXRUbyh0aGlzLmdhbWUud2lkdGggLSAyMDAsMTUpO1xyXG4gICAgICAgIHRoaXMuY29pblRleHQgPSB0aGlzLmdhbWUuYWRkLnRleHQoMCwwLCBcIjBcIiwgIHRoaXMuc3R5bGVVSSApO1xyXG5cclxuICAgICAgICB0aGlzLmNvaW5UZXh0LmZpeGVkVG9DYW1lcmEgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMuY29pblRleHQuY2FtZXJhT2Zmc2V0LnNldFRvKHRoaXMuZ2FtZS53aWR0aCAtIDE1MCwxNSk7XHJcbiAgICAgICAgdGhpcy5jb2luVGV4dC50ZXh0ID0gdGhpcy5zY29yZTtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLmVuZW15VUkgPSB0aGlzLmdhbWUuYWRkLnNwcml0ZSgwLDAsJ2VuZW15VUknKTtcclxuICAgICAgICB0aGlzLmVuZW15VUkuZml4ZWRUb0NhbWVyYSA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5lbmVteVVJLmNhbWVyYU9mZnNldC5zZXRUbyh0aGlzLmdhbWUud2lkdGggLSAyMDUsNTUpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5lbmVteVRleHQgPSB0aGlzLmdhbWUuYWRkLnRleHQoMCwwLCBcIjAlXCIsICB0aGlzLnN0eWxlVUkpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMuZW5lbXlUZXh0LmZpeGVkVG9DYW1lcmEgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMuZW5lbXlUZXh0LmNhbWVyYU9mZnNldC5zZXRUbyh0aGlzLmdhbWUud2lkdGggLSAxNTAsNTUpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIFxyXG4gICAgICAgICB0aGlzLlVJTGF5ZXIuYWRkKHRoaXMuZW5lbXlVSSk7XHJcbiAgICAgICAgdGhpcy5VSUxheWVyLmFkZCh0aGlzLmNvaW5VSSk7XHJcbiAgICAgICAgdGhpcy5VSUxheWVyLmFkZCh0aGlzLmVuZW15VUkpO1xyXG4gICAgICAgIHRoaXMuVUlMYXllci5hZGQodGhpcy5oZWFsdGhCYXIpO1xyXG4gICAgICAgIHRoaXMuVUlMYXllci5hZGQodGhpcy5mdWVsQmFyKTtcclxuXHJcbiAgICAgICAgXHJcbiAgICAgICAgXHJcbiAgICB9XHJcbiAgICBcclxuICAgIGVuZW15U2hvdChlbmVteSwgYnVsbGV0KXtcclxuICAgICBcclxuICAgICAgICBidWxsZXQua2lsbCgpO1xyXG4gICAgICAgIGVuZW15LmVuZW15SGVhbHRoLmN1cnJlbnQtLTtcclxuXHJcbiAgICAgICAgIFxyXG4gICAgICAgaWYoZW5lbXkuZW5lbXlIZWFsdGguY3VycmVudCA9PT0gMCl7XHJcbiAgICAgICAgICAgXHJcbiAgICAgICAgICAgdGhpcy5lbmVteUNvdW50LmN1cnJlbnQtLTtcclxuICAgICAgICAgICB0aGlzLmVuZW15VGV4dC50ZXh0ID0gKCgxIC0gKHRoaXMuZW5lbXlDb3VudC5jdXJyZW50L3RoaXMuZW5lbXlDb3VudC50b3RhbCkpICogMTAwKS50b0ZpeGVkKDEpICsgXCIlXCI7ICBcclxuICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIHZhciBleHBsb3Npb24gPSB0aGlzLmV4cGxvc2lvbnMuZ2V0Rmlyc3REZWFkKCk7XHJcbiAgICAgICAgaWYoZXhwbG9zaW9uKXtcclxuICAgICAgICAgICAgZXhwbG9zaW9uLnggPSBlbmVteS54O1xyXG4gICAgICAgICAgICBleHBsb3Npb24ueSA9IGVuZW15Lnk7XHJcbiAgICAgICAgICAgIGV4cGxvc2lvbi5yZXZpdmUoKTtcclxuICAgICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICBleHBsb3Npb24gPSB0aGlzLmdhbWUuYWRkLnNwcml0ZShlbmVteS54LCBlbmVteS55LCAnZXhwbG9zaW9uJyk7XHJcbiAgICAgICAgICAgZXhwbG9zaW9uLmFuY2hvci5zZXRUbyguNSwuNSk7XHJcbiAgICAgICAgICAgdmFyIGV4YW5pbSA9IGV4cGxvc2lvbi5hbmltYXRpb25zLmFkZCgnZXhwbG9kZScsWzAsMSwyLDMsNCw1LDZdLDEwLCBmYWxzZSk7XHJcbiAgICAgICAgICAgZXhhbmltLmtpbGxPbkNvbXBsZXRlID0gdHJ1ZTsgICAgICAgXHJcbiAgICAgICAgICAgfVxyXG4gICAgICAgIGV4YW5pbS5wbGF5KCk7ICAgXHJcbiAgICAgICBlbmVteS5kZXN0cm95RW5lbXkgPSB0cnVlO1xyXG4gICAgICAgICAgIFxyXG4gICAgICAgfWVsc2V7XHJcblxyXG4gICAgICAgIHZhciBlbWl0dGVyID0gdGhpcy5nYW1lLmFkZC5lbWl0dGVyKGVuZW15LngsIGVuZW15LnksIDEwMCk7XHJcbiAgICAgICAgICAgIGVtaXR0ZXIubWFrZVBhcnRpY2xlcygncmVkX2ZsYW1lJyk7XHJcbiAgICAgICAgICAgIGVtaXR0ZXIubWluUGFydGljbGVTcGVlZC5zZXRUbygtMTAwLCAtMTAwKTtcclxuICAgICAgICAgICAgZW1pdHRlci5tYXhQYXJ0aWNsZVNwZWVkLnNldFRvKDEwMCwgMTAwKTtcclxuICAgICAgICAgICAgZW1pdHRlci5ncmF2aXR5ID0gMjA7XHJcbiAgICAgICAgICAgIGVtaXR0ZXIuc3RhcnQodHJ1ZSwgNTAwLCBudWxsLCAxMDApO1xyXG4gICAgICAgXHJcbiAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgXHJcbiAgICAgICAgXHJcbiAgICB9XHJcblxyXG4gICAgXHJcbiAgICBwbGF5ZXJTaG90KHBsYXllciwgYnVsbGV0KXtcclxuXHJcbiAgICAgICAgXHJcbiAgICAgICAgICB2YXIgZW1pdHRlciA9IHRoaXMuZ2FtZS5hZGQuZW1pdHRlcihwbGF5ZXIueCwgcGxheWVyLnksIDEwMCk7XHJcbiAgICAgICAgICAgIGVtaXR0ZXIubWFrZVBhcnRpY2xlcygnYmx1ZV9mbGFtZScpO1xyXG4gICAgICAgICAgICBlbWl0dGVyLm1pblBhcnRpY2xlU3BlZWQuc2V0VG8oLTEwMCwgLTEwMCk7XHJcbiAgICAgICAgICAgIGVtaXR0ZXIubWF4UGFydGljbGVTcGVlZC5zZXRUbygxMDAsIDEwMCk7XHJcbiAgICAgICAgICAgIGVtaXR0ZXIuZ3Jhdml0eSA9IDIwO1xyXG4gICAgICAgICAgICBlbWl0dGVyLnN0YXJ0KHRydWUsIDUwMCwgbnVsbCwgMTAwKTtcclxuXHJcbiAgICAgICAgYnVsbGV0LmtpbGwoKTtcclxuICAgICAgIHRoaXMucGxheWVyRGFtYWdlZChwbGF5ZXIsIDEpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuXHJcblxyXG4gICAgXHJcbmNvbGxlY3QocGxheWVyLGNvaW4pe1xyXG4gICAgICAgICAgICBjb2luLmtpbGwoKTtcclxuICAgICAgICAgICAgdGhpcy5zY29yZSsrO1xyXG4gICAgICAgICAgICB0aGlzLmNvaW5UZXh0LnRleHQgPSB0aGlzLnNjb3JlO1xyXG4gICAgICAgICAgICB0aGlzLmNvbGxlY3RTb3VuZC5wbGF5KCk7XHJcbiAgICAgICAgfVxyXG4gICAgXHJcbmNvbGxlY3RIZWFsdGgocGxheWVyLCBoZWFsdGgpe1xyXG4gXHJcbiAgICBoZWFsdGgua2lsbCgpO1xyXG4gICAgXHJcbiAgICBwbGF5ZXIuaGVhbHRoLmN1cnJlbnQgKz0gcGxheWVyLmhlYWx0aC5tYXgvMjtcclxuICAgIGlmKHBsYXllci5oZWFsdGguY3VycmVudCA+IHBsYXllci5oZWFsdGgubWF4KXtcclxuICAgICAgICBwbGF5ZXIuaGVhbHRoLmN1cnJlbnQgPSBwbGF5ZXIuaGVhbHRoLm1heDtcclxuICAgIH1cclxuICAgIHRoaXMuaGVhbHRoQmFyLnNldFZhbHVlKHBsYXllci5oZWFsdGguY3VycmVudC8gcGxheWVyLmhlYWx0aC5tYXgpO1xyXG5cclxufSAgICBcclxub3BlbkRvb3IocGxheWVyLCBkb29yKXtcclxuICAgIGlmKHRoaXMuZG9vcklzQ2xvc2VkKXtcclxuICAgICAgICBkb29yLnBsYXkoJ29wZW4nKTtcclxuICAgICAgICB0aGlzLmRvb3JJc0Nsb3NlZCA9IGZhbHNlO1xyXG4gICAgfWVsc2UgaWYodGhpcy5tYWluQ2hhcmVjdGVyLmp1bXAuaXNEb3duKXtcclxuICAgICAgICAgICAgcGxheWVyLmJvZHkudmVsb2NpdHkueSA9IDA7XHJcbiAgICAgICAgaWYodGhpcy5lbmVteUNvdW50LmN1cnJlbnQgPD0gdGhpcy5lbmVteUNvdW50LnRvdGFsICogLjc1KXtcclxuICAgICAgICAgICAgdGhpcy5nYW1lLnN0YXRlLnN0YXJ0KCdtZW51JywgdHJ1ZSwgZmFsc2UpO1xyXG4gICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICB0aGlzLmVuZW15VGV4dC5hZGRDb2xvcignI0ZGMDAwMCcsIDApIDtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICB9XHJcbiAgICBcclxuICAgIFxyXG59ICBcclxuICAgIFxyXG4gICAgZWxlY3Ryb2N1dGUocGxheWVyLCBzaG9ja3Mpe1xyXG4gICAgaWYodGhpcy5kZWF0aERlbGF5IDwgdGhpcy5nYW1lLnRpbWUubm93KXtcclxuICAgICAgICB0aGlzLmRlYXRoRGVsYXkgPSB0aGlzLmdhbWUudGltZS5ub3cgKyBQaGFzZXIuVGltZXIuU0VDT05EICogLjU7XHJcbiAgICAgICAgXHJcbiAgICAgIHRoaXMucGxheWVyRGFtYWdlZChwbGF5ZXIsIDMpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIFxyXG4gICAgfSBcclxuICAgIH1cclxuICAgICAgIFxyXG4gICAgcGxheWVyRGFtYWdlZChwbGF5ZXIsIGRhbWFnZSl7XHJcbiAgICAgICAgICAgaWYocGxheWVyLmhlYWx0aC5jdXJyZW50ID4gMCl7XHJcbiAgICAgICAgICAgIHBsYXllci5oZWFsdGguY3VycmVudC09ZGFtYWdlO1xyXG4gICAgICAgICAgICAgcGxheWVyLmZsYXNoKCk7XHJcbiAgICAgICAgdGhpcy5oZWFsdGhCYXIuc2V0VmFsdWUocGxheWVyLmhlYWx0aC5jdXJyZW50LyBwbGF5ZXIuaGVhbHRoLm1heCk7XHJcbiAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgIHBsYXllci5kaWVkKCk7ICAgXHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgICAgIFxyXG4gICAgICAgIFxyXG4gICAgfVxyXG4gICAgXHJcbiAgICBidWxsZXRTcGFyayhidWxsZXQsIGxheWVyKXtcclxuICAgICAgICB2YXIgZW1pdHRlciA9IHRoaXMuZ2FtZS5hZGQuZW1pdHRlcihidWxsZXQueCwgYnVsbGV0LnksIDEwMCk7XHJcbiAgICAgICAgICAgIGVtaXR0ZXIubWFrZVBhcnRpY2xlcygnYmx1ZV9mbGFtZScpO1xyXG4gICAgICAgICAgICBlbWl0dGVyLm1pblBhcnRpY2xlU3BlZWQuc2V0VG8oLTEwMCwgLTEwMCk7XHJcbiAgICAgICAgICAgIGVtaXR0ZXIubWF4UGFydGljbGVTcGVlZC5zZXRUbygxMDAsIDEwMCk7XHJcbiAgICAgICAgICAgIGVtaXR0ZXIuZ3Jhdml0eSA9IDIwO1xyXG4gICAgICAgICAgICBlbWl0dGVyLnN0YXJ0KHRydWUsIDUwMCwgbnVsbCwgMTAwKTtcclxuICAgICAgICBcclxuICAgICAgICBcclxuICAgICAgICBcclxuICAgICAgICBidWxsZXQua2lsbCgpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIFxyXG4gICAgICAgIFxyXG4gICAgfVxyXG4gICAgXHJcbiAgICBwbGF5ZXJCdWxsZXRTcGFyayhidWxsZXQsIGxheWVyKXtcclxuICAgICAgICBcclxuICAgICAgICAgIHZhciBlbWl0dGVyID0gdGhpcy5nYW1lLmFkZC5lbWl0dGVyKGJ1bGxldC54LCBidWxsZXQueSwgMTAwKTtcclxuICAgICAgICAgICAgZW1pdHRlci5tYWtlUGFydGljbGVzKCdyZWRfZmxhbWUnKTtcclxuICAgICAgICAgICAgZW1pdHRlci5taW5QYXJ0aWNsZVNwZWVkLnNldFRvKC0xMDAsIC0xMDApO1xyXG4gICAgICAgICAgICBlbWl0dGVyLm1heFBhcnRpY2xlU3BlZWQuc2V0VG8oMTAwLCAxMDApO1xyXG4gICAgICAgICAgICBlbWl0dGVyLmdyYXZpdHkgPSAyMDtcclxuICAgICAgICAgICAgZW1pdHRlci5zdGFydCh0cnVlLCA1MDAsIG51bGwsIDEwMCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgYnVsbGV0LmtpbGwoKTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgcm9ja2V0S2lsbChlbmVteSwgYnVsbGV0KXtcclxuICAgICAgICBcclxuICAgICAgICBidWxsZXQua2lsbCgpO1xyXG4gICAgICAgIGVuZW15LmVuZW15SGVhbHRoLmN1cnJlbnQtLTtcclxuXHJcbiAgICAgICAgIFxyXG4gICAgICAgICAgIGVuZW15LmRlc3Ryb3koKTtcclxuICAgICAgICAgICB0aGlzLmVuZW15Q291bnQuY3VycmVudC0tO1xyXG4gICAgICAgICAgIHRoaXMuZW5lbXlUZXh0LnRleHQgPSAgKCgxIC0gKHRoaXMuZW5lbXlDb3VudC5jdXJyZW50L3RoaXMuZW5lbXlDb3VudC50b3RhbCkpICogMTAwKS50b0ZpeGVkKDEpICsgXCIlXCI7ICBcclxuICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIHZhciBleHBsb3Npb24gPSB0aGlzLmV4cGxvc2lvbnMuZ2V0Rmlyc3REZWFkKCk7XHJcbiAgICAgICAgaWYoZXhwbG9zaW9uKXtcclxuICAgICAgICAgICAgZXhwbG9zaW9uLnggPSBlbmVteS54O1xyXG4gICAgICAgICAgICBleHBsb3Npb24ueSA9IGVuZW15Lnk7XHJcbiAgICAgICAgICAgIGV4cGxvc2lvbi5yZXZpdmUoKTtcclxuICAgICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICBleHBsb3Npb24gPSB0aGlzLmdhbWUuYWRkLnNwcml0ZShlbmVteS54LCBlbmVteS55LCAnZXhwbG9zaW9uJyk7XHJcbiAgICAgICAgICAgZXhwbG9zaW9uLmFuY2hvci5zZXRUbyguNSwuNSk7XHJcbiAgICAgICAgICAgdmFyIGV4YW5pbSA9IGV4cGxvc2lvbi5hbmltYXRpb25zLmFkZCgnZXhwbG9kZScsWzAsMSwyLDMsNCw1LDZdLDEwLCBmYWxzZSk7XHJcbiAgICAgICAgICAgZXhhbmltLmtpbGxPbkNvbXBsZXRlID0gdHJ1ZTsgICAgICAgXHJcbiAgICAgICAgICAgfVxyXG4gICAgICAgIGV4YW5pbS5wbGF5KCk7XHJcbiAgICAgICAgXHJcbiAgICB9XHJcbiAgICBcclxuICAgIHJvY2tldEV4cGxvZGUocm9ja2V0LGxheWVyKXtcclxuICAgICAgICBcclxuICAgICAgICByb2NrZXQua2lsbCgpO1xyXG4gICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgdmFyIGV4cGxvc2lvbiA9IHRoaXMuZXhwbG9zaW9ucy5nZXRGaXJzdERlYWQoKTtcclxuICAgICAgICBpZihleHBsb3Npb24pe1xyXG4gICAgICAgICAgICBleHBsb3Npb24ueCA9IHJvY2tldC54O1xyXG4gICAgICAgICAgICBleHBsb3Npb24ueSA9IHJvY2tldC55O1xyXG4gICAgICAgICAgICBleHBsb3Npb24ucmV2aXZlKCk7XHJcbiAgICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgZXhwbG9zaW9uID0gdGhpcy5nYW1lLmFkZC5zcHJpdGUocm9ja2V0LngsIHJvY2tldC55LCAnZXhwbG9zaW9uJyk7XHJcbiAgICAgICAgICAgZXhwbG9zaW9uLmFuY2hvci5zZXRUbyguNSwuNSk7XHJcbiAgICAgICAgICAgdmFyIGV4YW5pbSA9IGV4cGxvc2lvbi5hbmltYXRpb25zLmFkZCgnZXhwbG9kZScsWzAsMSwyLDMsNCw1LDZdLDEwLCBmYWxzZSk7XHJcbiAgICAgICAgICAgZXhhbmltLmtpbGxPbkNvbXBsZXRlID0gdHJ1ZTsgICAgICAgXHJcbiAgICAgICAgICAgfVxyXG4gICAgICAgIGV4YW5pbS5wbGF5KCk7XHJcbiAgICAgICAgXHJcbiAgICB9XHJcbiAgICBcclxuICAgICAgICBcclxuICAgIFxyXG4gICAgXHJcbiAgICBcclxufSIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIE1lbnUgZXh0ZW5kcyBQaGFzZXIuU3RhdGUge1xyXG4gICAgXHJcbiAgICBwcmVsb2FkKCl7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5sb2FkLmltYWdlKCdtZW51X2JhY2tncm91bmQnLCdhc3NldHMvaW1nL21lbnVfYmFja2dyb3VuZC5qcGcnKTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgY3JlYXRlKCkge1xyXG4gICAgICAgIFxyXG4gICAgICAgIHZhciBjb250cm9scyA9IFsnTEVGVDogJywnUklHSFQ6ICcsJ0pVTVBcIjogJywnU0hPT1Q6ICcsJ0pFVFBBQ0s6ICcsJ0ZMWSBVUDogJywnRkxZIERPV046ICddO1xyXG4gICAgICAgIHZhciBrZXlib2FyZCA9IFsnQScsJ0QnLCdXJywnRU5URVInLCdTSElGVCcsJ1cnLCdTJ107XHJcbiAgICAgICAgXHJcbiAgICAgICAgXHJcbiAgICAgICAgXHJcbiAgICAgICAgXHJcbiAgICAgICAgdmFyIHlDb29yZCA9IDIwMDtcclxuICAgICAgICB2YXIgdGV4dFNwYWNpbmcgPSA1MDtcclxuICAgICAgICBcclxuICAgICAgICB2YXIgc3R5bGUgPSAge1xyXG4gICAgICAgIGZvbnQ6IFwiNjBweCBBcmlhbFwiLFxyXG4gICAgICAgIGZpbGw6ICcjZmZmZmZmJyxcclxuICAgICAgICBhbGlnbjogXCJjZW50ZXJcIixcclxuICAgICAgICBzdHJva2U6ICcjMDAwMDAwJyxcclxuICAgICAgICBzdHJva2VUaGlja25lc3M6IDIsXHJcbiAgICAgICAgfTtcclxuICAgICAgXHJcbiAgICAgICAgIHRoaXMuc3RhcnRHYW1lID0gdGhpcy5nYW1lLmlucHV0LmtleWJvYXJkLmFkZEtleShQaGFzZXIuS2V5Ym9hcmQuRU5URVIpO1xyXG4gICAgICAgICB0aGlzLmFkZC5zcHJpdGUoMCwwLCdtZW51X2JhY2tncm91bmQnKTtcclxuICAgICAgICBcclxuICAgICAgICB2YXIgdGl0bGUgPSB0aGlzLmFkZFRleHQodGhpcy5nYW1lLndpZHRoLzIsIDEwMCwgNjAsIFwiQ3lib3JnIE5pbmphXCIsIHN0eWxlKTtcclxuICAgICAgICB0aXRsZS5hbmNob3Iuc2V0VG8oLjUsIDApO1xyXG4gICAgICAgIHZhciB0ZXh0QWxpZ24gPSAodGhpcy5nYW1lLndpZHRoLzIpIC0gKHRpdGxlLndpZHRoLzIpO1xyXG4gICAgICAgIHZhciBzdWJ0aXRsZSA9IHRoaXMuYWRkVGV4dCh0ZXh0QWxpZ24sIDIwMCwgNDAsIFwiQ29udHJvbHNcIiwgc3R5bGUpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHZhciB5U3BhY2luZyA9IHN1YnRpdGxlLnkgKyA1MDtcclxuICAgICAgICBcclxuICAgICAgICAgeUNvb3JkICs9IDI1O1xyXG4gICAgICAgIFxyXG4gICAgICAgIGZvcih2YXIgaSA9IDA7IGkgPCBjb250cm9scy5sZW5ndGg7IGkrKyl7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIHRoaXMuYWRkVGV4dCh0ZXh0QWxpZ24sIHlTcGFjaW5nLCAyMCwgY29udHJvbHNbaV0sIHN0eWxlKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuYWRkVGV4dCh0ZXh0QWxpZ24gKyAyMDAsIHlTcGFjaW5nLCAyMCwga2V5Ym9hcmRbaV0sIHN0eWxlKTtcclxuICAgICAgICAgICAgICAgIHlTcGFjaW5nICs9IDMwO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgIHRoaXMuYWRkVGV4dCh0ZXh0QWxpZ24sIHRoaXMuZ2FtZS5oZWlnaHQgLSAyMDAsIDQwLCBcIlByZXNzIEVudGVyIHRvIFBsYXkhXCIsIHN0eWxlKTtcclxuICAgICAgICBcclxuICAgICAgICB2YXIgc3ByaXRlID0gdGhpcy5nYW1lLmFkZC5zcHJpdGUodGhpcy5nYW1lLndpZHRoIC0gMzAwLCB0aGlzLmdhbWUuaGVpZ2h0LTMwMCwgJ25pbmphJyk7XHJcbiAgICAgICAgc3ByaXRlLnNjYWxlLnNldFRvKDIpO1xyXG4gICAgICAgc3ByaXRlLmFuaW1hdGlvbnMuYWRkKCdydW4nLCBbNTYsIDU3LCA1OCwgNTksIDYwLCA2MSwgNjIsIDYzLCA2NCwgNjVdLDE1LCB0cnVlKTtcclxuICAgICAgICBzcHJpdGUucGxheSgncnVuJyk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgfVxyXG4gICAgXHJcbiAgICB1cGRhdGUoKSB7XHJcblxyXG4gICAgXHJcbiAgICAgICAgICBpZih0aGlzLnN0YXJ0R2FtZS5pc0Rvd24pe1xyXG4gICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgIHRoaXMuZ2FtZS5zdGF0ZS5zdGFydCgnbGV2ZWwxJywgdHJ1ZSwgZmFsc2UsIDIwKTtcclxuICAgICAgICAgIH1cclxuICAgIFxyXG4gICAgfVxyXG4gICAgXHJcbiAgICBhZGRUZXh0KHgseSwgdGV4dFNpemUsIG1lc3NhZ2UsIHN0eWxlKXtcclxuICAgICAgICBcclxuICAgICAgICAgICAgIHZhciB0ZXh0ID0gdGhpcy5nYW1lLmFkZC50ZXh0KHgseSwgbWVzc2FnZSwgIHN0eWxlKTtcclxuICAgICAgICAgICAgIHRleHQuc2V0U2hhZG93KDUsIDUsICdyZ2JhKDAsMCwwLDAuNSknLCA1KTtcclxuICAgICAgICAgICAgdmFyIGdyZCA9IHRleHQuY29udGV4dC5jcmVhdGVMaW5lYXJHcmFkaWVudCgwLCAwLCAwLCA3NCk7XHJcbiAgICAgICAgICAgIGdyZC5hZGRDb2xvclN0b3AoMCwgJyM4RUQ2RkYnKTsgICBcclxuICAgICAgICAgICAgZ3JkLmFkZENvbG9yU3RvcCgxLCAnIzAwNENCMycpO1xyXG4gICAgICAgICAgICB0ZXh0LmZpbGwgPSBncmQ7XHJcbiAgICAgICAgICAgIHRleHQuZm9udFNpemUgPSB0ZXh0U2l6ZTtcclxuICAgICAgICBcclxuICAgICAgICByZXR1cm4gdGV4dDtcclxuICAgIH1cclxuICAgIFxyXG4gICAgXHJcbiAgICBcclxuICAgIFxyXG4gICAgXHJcbiAgICBcclxufSIsIlxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQcmVsb2FkIHtcclxuICAgIFxyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgdGhpcy5hc3NldCA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5yZWFkeSA9IGZhbHNlO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBwcmVsb2FkKCkge1xyXG4gICAgICAgIHRoaXMubG9hZC5pbWFnZSgnbG9hZGluZ19iZycsICdhc3NldHMvaW1nL2xvYWRpbmdfYmcuanBnJyk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGNyZWF0ZSgpIHtcclxuICAgICAgICB0aGlzLmFkZC5zcHJpdGUoMCwwLCBcImxvYWRpbmdfYmdcIik7XHJcbiAgICAgICAgdGhpcy5hc3NldCA9IHRoaXMuYWRkLnNwcml0ZSh0aGlzLmdhbWUud2lkdGgvMiwgdGhpcy5nYW1lLmhlaWdodC8yLCBcInByZWxvYWRlclwiKTtcclxuICAgICAgICB0aGlzLmFzc2V0LmFuY2hvci5zZXRUbygwLjUsMC41KTtcclxuICAgICAgICB0aGlzLmxvYWQub25Mb2FkU3RhcnQuYWRkKHRoaXMub25Mb2FkU3RhcnQsdGhpcyk7XHJcbiAgICAgICAgdGhpcy5sb2FkLm9uTG9hZENvbXBsZXRlLmFkZCh0aGlzLm9uTG9hZENvbXBsZXRlLCB0aGlzKTtcclxuICAgICAgICB0aGlzLmxvYWQuc2V0UHJlbG9hZFNwcml0ZSh0aGlzLmFzc2V0KTtcclxuXHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB0aGlzLmxvYWQuc3RhcnQoKTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgdXBkYXRlKCkge1xyXG4gICAgIFxyXG4gICAgICAgIGlmKHRoaXMucmVhZHkpe1xyXG4gICAgICAgICBcclxuICAgICAgICAgICAgdGhpcy5nYW1lLnN0YXRlLnN0YXJ0KCdtZW51Jyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgb25Mb2FkU3RhcnQoKSB7XHJcbiAgICAgICAgICAgICAgIC8vbG9hZCB5b3VyIGFzc2V0cyBoZXJlXHJcbiAgICAgICAgICAgIHRoaXMubG9hZC5zcHJpdGVzaGVldCgnbmluamEnLCdhc3NldHMvaW1nL25pbmphMi5wbmcnLCA5MCwgOTApO1xyXG4gICAgICAgICAgICB0aGlzLmxvYWQuaW1hZ2UoJ25pbmphX2hlYWQnLCdhc3NldHMvaW1nL25pbmphX2hlYWQucG5nJyk7XHJcbiAgICAgICAgICAgIHRoaXMubG9hZC5zcHJpdGVzaGVldCgnY29pbnMnLCdhc3NldHMvaW1nL2NvaW5zLnBuZycsNDAsIDM5KTtcclxuICAgICAgICAgICAgdGhpcy5sb2FkLnNwcml0ZXNoZWV0KCdyb2JvdF9ydW4nLCdhc3NldHMvaW1nL3JvYm90X3J1bi5wbmcnLDkyLCA5MCk7XHJcbiAgICAgICAgICAgIHRoaXMubG9hZC5zcHJpdGVzaGVldCgnZG9vcicsJ2Fzc2V0cy9pbWcvZG9vci5wbmcnLDEwMCwxMDApO1xyXG4gICAgICAgICAgICB0aGlzLmxvYWQuc3ByaXRlc2hlZXQoJ3JvY2tldCcsJ2Fzc2V0cy9pbWcvcm9ja2V0LnBuZycsMzAsMTIpO1xyXG4gICAgICAgICAgICB0aGlzLmxvYWQuc3ByaXRlc2hlZXQoJ3Nob2NrJywnYXNzZXRzL2ltZy9zaG9jay5wbmcnLDEyOCwxMjgpO1xyXG4gICAgICAgICAgICB0aGlzLmxvYWQuc3ByaXRlc2hlZXQoJ2V4cGxvc2lvbicsJ2Fzc2V0cy9pbWcvZXhwbG9zaW9uLnBuZycsMTAwLDEwNSk7XHJcbiAgICAgICAgICAgIHRoaXMubG9hZC5pbWFnZSgnYnVsbGV0JywnYXNzZXRzL2ltZy9CdWxsZXQwMS5wbmcnKTtcclxuICAgICAgICAgICAgdGhpcy5sb2FkLmltYWdlKCdoZWFsdGhfcGFjaycsJ2Fzc2V0cy9pbWcvaGVhbHRoX3BvdGlvbi5wbmcnKTtcclxuICAgICAgICAgICAgdGhpcy5sb2FkLmltYWdlKCdibHVlX2ZsYW1lJywnYXNzZXRzL2ltZy9ibHVlX2ZsYW1lLnBuZycpO1xyXG4gICAgICAgICAgICB0aGlzLmxvYWQuaW1hZ2UoJ3JlZF9mbGFtZScsJ2Fzc2V0cy9pbWcvcmVkX2ZsYW1lLnBuZycpO1xyXG4gICAgICAgICAgICB0aGlzLmxvYWQuaW1hZ2UoJ2VuZW15X2J1bGxldCcsJ2Fzc2V0cy9pbWcvZW5lbXlfYnVsbGV0LnBuZycpO1xyXG4gICAgICAgICAgICB0aGlzLmxvYWQuaW1hZ2UoJ2VuZW15X3Nob290JywnYXNzZXRzL2ltZy9yb2JvdF9wbGFjZS5wbmcnKTtcclxuICAgICAgICAgICAgdGhpcy5sb2FkLmltYWdlKCdib2R5JywnYXNzZXRzL2ltZy9yb2JvdF9ib2R5LnBuZycpO1xyXG4gICAgICAgICAgICB0aGlzLmxvYWQuaW1hZ2UoJ2FybScsJ2Fzc2V0cy9pbWcvcm9ib3RfYXJtLnBuZycpO1xyXG4gICAgICAgICAgICB0aGlzLmxvYWQuaW1hZ2UoJ2VtcHR5X2JhcicsJ2Fzc2V0cy9pbWcvRW1wdHlCYXIucG5nJyk7XHJcbiAgICAgICAgICAgIHRoaXMubG9hZC5pbWFnZSgnaGVhbHRoX2JhcicsJ2Fzc2V0cy9pbWcvUmVkQmFyLnBuZycpO1xyXG4gICAgICAgICAgICB0aGlzLmxvYWQuaW1hZ2UoJ2pldEZ1ZWxfYmFyJywnYXNzZXRzL2ltZy9HcmVlbkJhci5wbmcnKTtcclxuICAgICAgICAgICAgdGhpcy5sb2FkLmltYWdlKCdlbmVteVVJJywnYXNzZXRzL2ltZy9FbmVteUhlYWQucG5nJyk7XHJcbiAgICAgICAgICAgIHRoaXMubG9hZC5hdWRpbygnY29sbGVjdCcsJ2Fzc2V0cy9hdWRpby9VSV9FbGVjdHJpY18wOC5tcDMnKTtcclxuICAgICAgICAgICAgdGhpcy5sb2FkLmF1ZGlvKCdqZXRzJywnYXNzZXRzL2F1ZGlvL2pldF9zb3VuZC5tcDMnKTsgXHJcbiAgICB9XHJcbiAgICBcclxuICAgIG9uTG9hZENvbXBsZXRlKCkge1xyXG4gICAgICAgIHRoaXMucmVhZHkgPSB0cnVlO1xyXG4gICAgfVxyXG59Il19
