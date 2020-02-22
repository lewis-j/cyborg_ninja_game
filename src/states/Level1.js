/* global Phaser */

import Player from "../prefabs/Player.js";
import Enemy from  "../prefabs/Enemy.js";
import HealthBar from "../prefabs/HealthBar.js";

export default class Level1 extends Phaser.State {
    
    constructor() {
        super();

    }
    preload(){
                this.load.image('tileset','assets/img/sci_fi_tiles.png');
            this.load.tilemap('mytilemap','assets/tiles/level1.json', null, Phaser.Tilemap.TILED_JSON);    
        
    }
    
    create() {
        
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.game.stage.backgroundColor = "#918a87";
        
        
            this.doorIsClosed = true;
            this.score = 0;
            this.enemyCount = {current: 0, total: 0};
            this.deathDelay = 0;
        
        //create tileset
            this.myTiles = this.game.add.tilemap('mytilemap');
            this.myTiles.addTilesetImage('sci_fi_tiles', 'tileset');
            this.myTiles.setCollisionBetween(0,500);
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
   this.myTiles.createFromObjects('Door',618,'door',0,true, false);    
   this.door = this.world.getTop();
   this.game.physics.arcade.enable(this.door);
   this.door.animations.add('open',[0,1,2,3,4], 10, false);
        
        this.setupUI();
        
    
    
    //create main Charecter    
//    this.mainCharecter = new Player(this.game, 400, 50, this.playerBullets, this.playerRockets, this.fuelBar, this.healthBar);
//    this.game.add.existing(this.mainCharecter);
        
    this.myTiles.createFromObjects('Player',519,'null','null',true, false, this.world, Player);
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
        this.myTiles.createFromObjects('Enemies', 623, 'null', 'null', true, false, this.enemies, Enemy);
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
        this.shocks.callAll('body.setSize', 'body' , 128, 10, 0, 59);
        this.shocks.callAll('animations.add', 'animations', 'wiggle', [0, 1, 2, 3], 10, true);
        this.shocks.callAll('animations.play', 'animations', 'wiggle');
        
         this.vertShocks = this.add.group();
        this.vertShocks.enableBody = true;
        this.myTiles.createFromObjects('Shocks', 705, 'shock', 0, true, false, this.vertShocks);
        this.vertShocks.setAll('body.immovable', true);
        this.vertShocks.callAll('body.setSize', 'body' , 10, 128, 59, 0);
        this.vertShocks.callAll('animations.add', 'animations', 'vert_wiggle', [8, 9, 10, 11], 10, true);
        this.vertShocks.callAll('animations.play', 'animations', 'vert_wiggle');
        
          this.healthPacks = this.add.group();
        this.healthPacks.enableBody = true;
        this.myTiles.createFromObjects('Health', 727, 'health_pack', 0, true, false, this.healthPacks);
        this.healthPacks.setAll('body.immovable', true);
//        this.healthPacks.callAll('body.setSize', 'body' , 10, 128, 59, 0);
     
        
    
        this.explosions = this.add.group(); 
            
            
           
            
            
   
        
            
  
            
       
    }
    
    update() {
                    this.quadTree.clear();
        
                    for(var i = 0; i< this.enemies.length; i++){
                        this.enemies.getAt(i).enemyUpdate = false;

                        this.quadTree.insert(this.enemies.getAt(i));
                    }
//                    
                    this.found = this.quadTree.retrieve(this.mainCharecter);
//        
                    for(var i = 0; i < this.found.length; i++ ){
                        
                        this.found[i].enemyUpdate = true;
                        
                        if(this.found[i].destroyEnemy){
                            this.found[i].destroy();
                        }
                    }
        
        
            this.physics.arcade.overlap(this.mainCharecter, this.healthPacks, this.collectHealth, null, this);
            this.physics.arcade.overlap(this.mainCharecter, this.shocks, this.electrocute, null, this);
            this.physics.arcade.overlap(this.mainCharecter, this.vertShocks, this.electrocute, null, this);
            this.physics.arcade.collide(this.mainCharecter, this.mytileslayer);
            this.physics.arcade.collide(this.enemies, this.mytileslayer);
            this.physics.arcade.overlap(this.mainCharecter, this.coins, this.collect , null, this);
        
            this.physics.arcade.collide(this.found, this.playerBullets, this.enemyShot, null, this);
        
            this.physics.arcade.collide(this.mainCharecter, this.enemyBullets, this.playerShot, null, this);
            this.physics.arcade.collide(this.mytileslayer, this.enemyBullets, this.bulletSpark, null, this);
            this.physics.arcade.collide(this.mytileslayer, this.playerBullets, this.playerBulletSpark, null, this);
            this.physics.arcade.collide(this.enemies, this.playerRockets, this.rocketKill, null, this);
            this.physics.arcade.collide(this.mytileslayer, this.playerRockets, this.rocketExplode, null, this);
            
        
            
        
            this.physics.arcade.overlap(this.mainCharecter, this.door, this.openDoor, null, this);
           
    }
    
    render(){
        
//        this.game.debug.spriteInfo(this.coinUI, 20, 32);
    }
    
    setupUI() {
        
        this.styleUI = {
        font: "40px Arial",
        fill: "#ffffff",
        align: "center",
        stroke: '#000000',
        strokeThickness: 1,
         
    };
        
        this.UILayer = this.add.group();
        
        this.healthBar = new HealthBar(this.game, 0,0, "health_bar", "empty_bar");
        this.healthBar.fixedToCamera = true;
        this.healthBar.cameraOffset.setTo(100, 15);
        this.fuelBar = new HealthBar(this.game, 0,0, "jetFuel_bar", "empty_bar");
        this.fuelBar.fixedToCamera = true;
        this.fuelBar.cameraOffset.setTo(100, 35);
        
        this.playerLifeUI = this.game.add.sprite(0,0, 'ninja_head');
        this.playerLifeUI.fixedToCamera = true;
        this.playerLifeUI.cameraOffset.setTo(3 ,15);
        this.lifeText = this.add.text(0,0,"x", this.styleUI);
        this.lifeText.fixedToCamera =true;
        this.lifeText.cameraOffset.setTo(55, 30);
        this.lifeText.fontSize = 25;
        
        
        this.coinUI = this.game.add.sprite(0,0, 'coins',0,);
        this.coinUI.scale.setTo(.75);
        this.coinUI.fixedToCamera = true;
        this.coinUI.cameraOffset.setTo(this.game.width - 200,15);
        this.coinText = this.game.add.text(0,0, "0",  this.styleUI );

         this.coinText.fixedToCamera = true;
        this.coinText.cameraOffset.setTo(this.game.width - 150,15);
        
        this.enemyUI = this.game.add.sprite(0,0,'enemyUI');
        this.enemyUI.fixedToCamera = true;
        this.enemyUI.cameraOffset.setTo(this.game.width - 205,55);
                this.enemyText = this.game.add.text(0,0, "0%",  this.styleUI);
        
        this.enemyText.fixedToCamera = true;
        this.enemyText.cameraOffset.setTo(this.game.width - 150,55);
        
        
         this.UILayer.add(this.enemyUI);
        this.UILayer.add(this.coinUI);
        this.UILayer.add(this.enemyUI);
        this.UILayer.add(this.healthBar);
        this.UILayer.add(this.fuelBar);

        
        
    }
    
    enemyShot(enemy, bullet){
     
        bullet.kill();
        enemy.enemyHealth.current--;

         
       if(enemy.enemyHealth.current === 0){
           
           this.enemyCount.current--;
           this.enemyText.text =  ((1 - (this.enemyCount.current/this.enemyCount.total)) * 100).toFixed(1) + "%"; 
           
                var explosion = this.explosions.getFirstDead();
        if(explosion){
            explosion.x = enemy.x;
            explosion.y = enemy.y;
            explosion.revive();
           }else{
           explosion = this.game.add.sprite(enemy.x, enemy.y, 'explosion');
           explosion.anchor.setTo(.5,.5);
           var exanim = explosion.animations.add('explode',[0,1,2,3,4,5,6],10, false);
           exanim.killOnComplete = true;       
           }
        exanim.play();   
       enemy.destroyEnemy = true;
           
       }else{

        var emitter = this.game.add.emitter(enemy.x, enemy.y, 100);
            emitter.makeParticles('red_flame');
            emitter.minParticleSpeed.setTo(-100, -100);
            emitter.maxParticleSpeed.setTo(100, 100);
            emitter.gravity = 20;
            emitter.start(true, 500, null, 100);
       
       }
        
        
        
    }

    
    playerShot(player, bullet){

        
          var emitter = this.game.add.emitter(player.x, player.y, 100);
            emitter.makeParticles('blue_flame');
            emitter.minParticleSpeed.setTo(-100, -100);
            emitter.maxParticleSpeed.setTo(100, 100);
            emitter.gravity = 20;
            emitter.start(true, 500, null, 100);

        bullet.kill();
       this.playerDamaged(player,1);
        }
        


    
collect(player,coin){
            coin.kill();
            this.score++;
            this.coinText.text = this.score;
            this.collectSound.play();
        }
    
collectHealth(player, health){
 
    health.kill();
 
    player.health.current += player.health.max/2;
    if(player.health.current > player.health.max){
        player.health.current = player.health.max;
    }
    this.healthBar.setValue(player.health.current/ player.health.max);

}    
openDoor(player, door){
    if(this.doorIsClosed){
        door.play('open');
        this.doorIsClosed = false;
    }else if(this.mainCharecter.jump.isDown){
            player.body.velocity.y = 0;
        if(this.enemyCount.current <= this.enemyCount.total * .75){
            this.game.state.start('level2', true, false, this.score );
        }else{
            this.enemyText.addColor('#FF0000', 0) ;
        }
        
    }
    
    
}  
    
    electrocute(player, shocks){
    if(this.deathDelay < this.game.time.now){
        this.deathDelay = this.game.time.now + Phaser.Timer.SECOND * .5;
        
      this.playerDamaged(player,2);
        
        
    } 
    }
       
    playerDamaged(player, damage){
           if(player.health.current > 0){
               console.log(player.health.current);
            player.health.current-=damage;
                console.log(player.health.current);
             player.flash();
        this.healthBar.setValue(player.health.current/ player.health.max);
        }else{
            player.died();   
        }
        
           
        
    }
    
    bulletSpark(bullet, layer){
        var emitter = this.game.add.emitter(bullet.x, bullet.y, 100);
            emitter.makeParticles('blue_flame');
            emitter.minParticleSpeed.setTo(-100, -100);
            emitter.maxParticleSpeed.setTo(100, 100);
            emitter.gravity = 20;
            emitter.start(true, 500, null, 100);
        
        
        
        bullet.kill();
        
        
        
    }
    
    playerBulletSpark(bullet, layer){
        
          var emitter = this.game.add.emitter(bullet.x, bullet.y, 100);
            emitter.makeParticles('red_flame');
            emitter.minParticleSpeed.setTo(-100, -100);
            emitter.maxParticleSpeed.setTo(100, 100);
            emitter.gravity = 20;
            emitter.start(true, 500, null, 100);
        
        bullet.kill();
    }
    
    rocketKill(enemy, bullet){
        
        bullet.kill();
        enemy.enemyHealth.current--;

         
          
           this.enemyCount.current--;
           this.enemyText.text =  ((1 - (this.enemyCount.current/this.enemyCount.total)) * 100).toFixed(1) + "%"; 
           
                var explosion = this.explosions.getFirstDead();
        if(explosion){
            explosion.x = enemy.x;
            explosion.y = enemy.y;
            explosion.revive();
           }else{
           explosion = this.game.add.sprite(enemy.x, enemy.y, 'explosion');
           explosion.anchor.setTo(.5,.5);
           var exanim = explosion.animations.add('explode',[0,1,2,3,4,5,6],10, false);
           exanim.killOnComplete = true;       
           }
        exanim.play();
        enemy.destroyEnemy = true;
        
    }
    
    rocketExplode(rocket,layer){
        
        rocket.kill();
           
                var explosion = this.explosions.getFirstDead();
        if(explosion){
            explosion.x = rocket.x;
            explosion.y = rocket.y;
            explosion.revive();
           }else{
           explosion = this.game.add.sprite(rocket.x, rocket.y, 'explosion');
           explosion.anchor.setTo(.5,.5);
           var exanim = explosion.animations.add('explode',[0,1,2,3,4,5,6],10, false);
           exanim.killOnComplete = true;       
           }
        exanim.play();
        
    }
    
        
    
    
    
}