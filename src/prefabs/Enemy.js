export default class Enemy extends Phaser.Sprite {
    
    constructor(game, x, y, bullets, player, layer) {
        super(game, x, y, 'enemy_shoot', 0);
        
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
        
     
        
          this.arm = this.addChild(new Phaser.Sprite(game, 0,0,'arm'));
          this.torso = this.addChild(new Phaser.Sprite(game, 0,0,'body'));
          this.robotRun = this.addChild(new Phaser.Sprite(game, 0,0,'robot_run'));
        
          this.anchor.setTo(.5,.5);
          this.arm.anchor.setTo(0,.5);
          this.torso.anchor.setTo(.5,.5);
          this.robotRun.anchor.setTo(.5,.5);
          this.arm.visible = false;
          this.torso.visible = false;
          this.scale.x = -1;
        
         
        this.robotRun.animations.add('run',[0,1,2,3,4,5,6], 5, true);
        this.robotRun.play('run');

        
        this.enemyHealth = {current: 3, max: 3 };
      
        
    }
    
    
    
 update(){
     
     

            if(this.enemyUpdate){
                
                  if((Phaser.Math.distance(this.player.x,this.player.y,this.x,this.y) < this.detectDistance)  &&  (((this.scale.x  <  0)  &&  ((this.x - this.player.x)>0) ) || ((this.scale.x  >  0)  &&  ((this.x - this.player.x) < 0) ) )){
                
           this.line.start.set(this.player.x, this.player.y);
           this.line.end.set(this.x, this.y);
           this.tilesHit = this.layer.getRayCastTiles(this.line, 4, false, true);
                
                if(this.tilesHit.length == 0){
                    if(this.isWalking){
                this.body.velocity.x = 0;
                this.children[2].visible = false;
                this.children[0].visible = true;
                this.children[1].visible = true; 
                this.isWalking = false;
                        
                    }
                
                
                
                this.enemyShoots();
                    
                    
                    
                }else{
                this.walk();
                
            }
                  }else{
                     this.walk(); 
                      
                  }
            
                
                
                
            }else{
//                this.idleAnim.play();
               this.body.velocity.x = 0;
                this.isWalking = false;
                
                
                
                
                
                
                
                
                
                
                
                
            }
          
     
     
     
 
 }
    
    walk(){
        
            if(!this.isWalking){
                this.children[2].visible = true;
                this.children[0].visible = false;
                this.children[1].visible = false;
                    this.isWalking = true;
                 
                    if(this.player.x > this.x){
                      this.body.velocity.x = 100; 
                      this.scale.x = 1; 
                        
                    }else{
                        this.body.velocity.x = -100;
                        this.scale.x = -1;
                   
                    }
                    
                    
                }
              
                if(this.x < this.leftBoundery){
                   this.body.velocity.x = 50; 
                   this.scale.x = 1;    
               
                }else if( this.x > this.rightBoundery){
                    this.body.velocity.x = -50;
                    this.scale.x = -1;
                   
                }
    }
    
    enemyShoots(){
        
         
                
                var dir = (this.scale.x > 0) ? 1 : -1;
                   this.children[0].rotation =  dir * (Math.atan((this.y - this.player.y)/(this.x - this.player.x)));
                   var p = new Phaser.Point(this.x, this.y); 
                   p.rotate(p.x, p.y, (this.children[0].rotation - .05)* dir, false, (this.scale.x > 0) ? 25 : -50);
        
                if(this.game.time.now > this.enemy_nextShot){
                this.enemy_nextShot = this.game.time.now + (Phaser.Timer.SECOND * (1/ this.shotsPerSecond));
                 
                 
                var bullet = this.bullets.getFirstDead();
                 if(bullet){
                  bullet.x = p.x;
                  bullet.y = p.y;
                  bullet.revive();
                 }else{
                bullet = this.bullets.create(p.x,p.y,'enemy_bullet');
                this.game.physics.arcade.enable(bullet);   
                bullet.outOfBoundsKill = true;
	    		bullet.checkWorldBounds = true;
                 }
                bullet.angle = this.children[0].angle * dir;
                this.game.physics.arcade.velocityFromRotation((this.children[0].rotation * dir), (700 * dir), bullet.body.velocity);
                    
                    
                }
        
    }

}