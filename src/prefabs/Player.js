export default class Player extends Phaser.Sprite {
    
    
    constructor(game, x, y, bullets, rockets, fuelUI, healthUI, lifeUI ) {
        super(game, x, y, 'ninja', 0);
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
      
        
        
        this.health = { max: 10, current: 10};
        this.fuel = { current: 10, max: 10};
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
        this.rotationOffset = .15
        this.rateOverTime = this.flightWarmUpTime/this.loopRate;
        this.rotationOverTime = (.36)/this.rateOverTime;
        this.jetAccelleration = this.jetSpeed/this.rateOverTime;
        this.angleOverTime = 19/ this.rateOverTime;
        this.rotationSeq = 0;
        this.fuelUseInterval = 0;
        
        
         this.game.physics.arcade.enable(this, Phaser.Physics.ARCADE);
        
              this.body.gravity.y = 600;
              this.anchor.setTo(.5, .5);
              this.body.setSize(60,90,0, -7);
          
            this.animations.add('attack', [0, 1, 2, 3, 4, 5],10, true);
            this.die = this.animations.add('die', [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17],5, false);
            this.animations.add('dizzy', [18, 19, 20, 21],10, true);
            this.idle = this.animations.add('idle', [22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33],10, true);
            this.animations.add('jetpack', [34, 35, 36, 37, 38, 39, 40, 41],10, true);
            this.animations.add('jump', [42, 43, 44, 45, 46, 47],10, false);
            this.animations.add('roll', [48, 49, 50, 51, 52, 53, 54, 55],10, true);
            this.animations.add('run', [56, 57, 58, 59, 60, 61, 62, 63, 64, 65],10, false);
            this.runShot = this.animations.add('run_with_gun', [66, 67, 68, 69, 70, 71, 72, 73, 74, 75],10, false);
            this.idleShot = this.animations.add('shot', [76,77,78,79,80],10, false);
            this.runShotStop = this.animations.add('shotStop', [79,80],8, false);
            this.animations.add('sliding', [81, 82, 83, 84, 85, 86],10, true);
            this.animations.add('throwing', [87, 88, 89, 90, 91, 92],10, true);
            this.animations.add('jetpack_fire', [93, 94, 95, 96, 97],10, false);
            this.animations.add('jump_fire',[98, 99, 100, 101, 102],10,false);
            this.die.onComplete.add(this.dead, this);
        
            //Player flashes when hit
            this.flashEffect = this.game.add.tween(this)
									.to( { alpha: 0 }, 50, Phaser.Easing.Bounce.Out)
									.to( { alpha: .8 }, 50, Phaser.Easing.Bounce.Out)
									.to( { alpha: 1 }, 150, Phaser.Easing.Circular.Out);
            
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
    
    update(){
    if(!this.isDead){
           if(this.body.onFloor()){
               this.firstAnimation = true;
                if(this.heroflying)
                    {
        this.resetFlight();

                    }
                if(this.jetUsed){
        this.fuelUI.setValue(1);
        this.fuel.current = this.fuel.max;
                    this.jetUsed = false;
                }
        
                  this.groundControls();
        
                                }else{
                                    
                if(!this.heroflying){
                    
                   this.jumpControls(); 
                    
                   }else{
                       
                   this.flightControls();
                 
       
                       }
                    
                    
                }
        
        
        
    }  
 
        
    }
    
    groundControls(){
            
            if(this.shoot.isDown){
                     this.shotFired();
                
                        
                         }
        this.noShotAnim = !(this.runShot.isPlaying || this.idleShot.isPlaying ); 
                     
            if(this.moveRight.isDown){
                
                
                if(this.idleShot.isPlaying){
                    this.idleShot.stop();
                    this.runShot.play();
                }else if(!this.runShot.isPlaying){
                        this.play('run');
                    }
                this.body.velocity.x = this.charecterspeed;
                this.scale.x = 1;
                
                
       }else if(this.moveLeft.isDown){
            if(this.idleShot.isPlaying){
                    this.idleShot.stop();
                    this.runShot.play();
                }else if(!this.runShot.isPlaying){
                        this.play('run');
                    }
                    this.body.velocity.x = -this.charecterspeed;  
                this.scale.x = -1;
                    }else{
                      
                        this.body.velocity.x = 0;
                    if(this.noShotAnim && (!this.runShotStop.isPlaying)){
                        this.play('idle');
                    }else{ if(this.runShot.isPlaying){
                            this.runShot.stop();
                            this.runShotStop.play();
                        }
                        
                    }
                    } 
                if(this.jump.isDown){
                    this.body.velocity.y = -500;
                   }
                 if (this.jetmode.isDown) { 
                    this.body.y = this.body.y - 10;
                     
                     this.angle -= (this.scale.x > 0 ) ? 72: -72;
//                  this.game.time.events.add(Phaser.Timer.SECOND * .1, this.startFlight, this);
                     this.startFlight();
                     this.flightDelay = this.game.time.now + 600;
                     this.jetUsed = true;
                 
                 }
    }
    
    jumpControls(){
                if(this.firstAnimation){
               this.play('jump');  
                    this.firstAnimation = false;
                }    
                    
            if(this.moveRight.isDown){
                       this.body.velocity.x = this.charecterspeed;

                this.scale.x = 1;
                }
                else if(this.moveLeft.isDown){
                       this.body.velocity.x = -this.charecterspeed;

                this.scale.x = -1;
                }else{

                this.body.velocity.x = 0;
                }
                if (this.jetmode.isDown) {
                    if(this.game.time.now > this.flightDelay){
                 
                        this.startFlight();
                        this.jetUsed = true;
                }
                } 
                    
                  if(this.shoot.isDown){
                       this.shotFired();
                  } 
    }
    
    flightControls(){
        
                     
        
                   if(this.shoot.isDown){
                        this.airShot();
                   }
                      
                   var dir = (this.scale.x > 0) ? 1 : -1;
                       if(this.jump.isDown){
                       this.angle-=2*(dir);
                   }
                         if(this.moveDown.isDown){
                       this.angle+=2*(dir);
                         }
                      if(!this.flightSequenceInit){
                       this.flightSequence(dir);
                      }
                        
                     this.game.physics.arcade.velocityFromRotation(this.rotation + this.rotationSeq, (this.jetpackSpeed + this.jetBoost) * (dir), this.body.velocity);
                       
                    if (this.jetmode.isDown) {
                        
                        if(this.game.time.now > this.flightDelay){
                            this.play('jump');  
                            this.resetFlight();
                            this.flightDelay = this.game.time.now + 600;
                            
//                          this.jetAudio.stop();
                        }
                   }
        
                  if(this.game.time.now > this.fuelUseInterval ){
                      
                      this.fuelUseInterval = this.game.time.now + Phaser.Timer.SECOND * .5;
                      this.fuel.current--;
                      this.fuelUI.setValue(this.fuel.current/this.fuel.max);
                      if(this.fuel.current <= 0){
                           this.play('jump'); 
                          this.resetFlight();
                      }
                      
                      
                      
                  }
        

        
        
    }
    
    resetFlight(){
        //                  this.jetAudio.stop();
                            this.heroflying = false;
                            this.angle = 0;
                            this.seqCount = 0;
                            this.flightSequenceInit = false;
                            this.rotationSeq = 0;
                            this.jetBoost = 0;   
                            this.game.physics.arcade.velocityFromRotation(this.rotation, 0, this.body.velocity);    
    }
    
    shotFired(){
    
            if(this.game.time.now > this.nextShot ){
                this.nextShot = this.game.time.now + Phaser.Timer.SECOND * this.shotInterval;
                
                var dir = (this.scale.x > 0) ? 1 : -1;
                var bullet = this.bullets.getFirstDead();
                if(bullet){
                    bullet.x =  this.x + (dir * 25);
                    bullet.y = this.y;
                    bullet.angle = 0;
                    this.game.physics.arcade.velocityFromRotation(this.rotation, 0, bullet.body.velocity);
                    bullet.revive();    
                }else{
                bullet = this.bullets.create(this.x + (dir * 25),this.y,'bullet');
                this.game.physics.enable(bullet, Phaser.Physics.ARCADE);
				bullet.outOfBoundsKill = true;
	    		bullet.checkWorldBounds = true;
                }
                bullet.body.velocity.x = dir * this.shotSpeed;  
                
                //animations for shots
                if(this.body.onFloor()){
                    if(this.body.velocity.x === 0){
                   this.idleShot.play(); 
                }else {
                   this.runShot.play();
                }
                }else{
                    this.play('jump_fire'); 
                }
                   
         }
        }

    airShot(){
        
        if(this.game.time.now > this.nextShot){
            this.nextShot = this.game.time.now + Phaser.Timer.SECOND * this.shotInterval;
             this.play('jetpack_fire'); 
             this.animations.currentAnim.onComplete.add(function () {	this.play('jetpack'); }, this);
            
             var dir = (this.scale.x > 0) ? 1 : -1;
            var p = new Phaser.Point(this.x, this.y); 
          p.rotate(p.x, p.y, this.rotation, false, (40*dir));
          var rocket = this.rockets.getFirstDead();
            if(rocket){
                rocket.x = p.x;
                rocket.y = p.y;
                rocket.revive();
            }else{
                rocket = this.rockets.create(p.x,p.y,'rocket');
                rocket.animations.add('soar');
                this.game.physics.arcade.enable(rocket);
                 rocket.outOfBoundsKill = true;
	    		 rocket.checkWorldBounds = true;
             }
                rocket.scale.x = dir;
                rocket.angle = this.angle + ((-18)*dir);
                this.game.physics.arcade.velocityFromRotation(this.rotation + this.rotationSeq, this.shotSpeed * dir, rocket.body.velocity);
                rocket.play('soar');
           }
        }  
    
    flightSequence(dir){
         if(this.game.time.now > this.loopDelay)
                        {
                            this.loopDelay = this.game.time.now + Phaser.Timer.SECOND * this.loopRate;;
                            this.seqCount++;
                            this.angle+= this.angleOverTime *(dir);
                            this.rotationSeq -= (this.rotationOverTime*(dir));
                            this.jetBoost += this.jetAccelleration;
                            if(this.seqCount == this.rateOverTime){
                            this.flightSequenceInit = true;
                            }
                        }
    
    }
    
    startFlight(){
                   this.play('jetpack');
                   this.heroflying = true;
                   this.flightDelay = this.game.time.now + 600;
//                    this.jetAudio.play('',0,1,true);    
        
    }
    
    died(){
    this.isDead = true; 
    this.body.velocity.x = 0;    
    this.play('die');  
            
    }
    
    dead(){ 
        this.lives--;
        
        if(this.lives > 0){
            this.healthUI.setValue(1);
            this.lifeUI.text = "x "+ this.lives;
        this.x = this.startingX;
        this.y = this.startingY;
        this.isDead = false;
        this.health.current = this.health.max;
         }else{
          this.game.state.start('game_over', true, false); 
        }
    
    
    }
    
    flash() {
		if(!this.flashEffect.isRunning) {
			this.flashEffect.start();
		}
	}
    
    
    
}
