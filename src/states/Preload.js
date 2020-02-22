
export default class Preload {
    
    constructor() {
        this.asset = null;
        this.ready = false;
    }
    
    preload() {
        this.load.image('loading_bg', 'assets/img/loading_bg.jpg');
    }
    
    create() {
        this.add.sprite(0,0, "loading_bg");
        this.asset = this.add.sprite(this.game.width/2, this.game.height/2, "preloader");
        this.asset.anchor.setTo(0.5,0.5);
        this.load.onLoadStart.add(this.onLoadStart,this);
        this.load.onLoadComplete.add(this.onLoadComplete, this);
        this.load.setPreloadSprite(this.asset);

            
            this.load.start();
    }
    
    update() {
     
        if(this.ready){
         
            this.game.state.start('menu');
        }
    }
    onLoadStart() {
               //load your assets here
            this.load.spritesheet('ninja','assets/img/ninja2.png', 90, 90);
            this.load.image('ninja_head','assets/img/ninja_head.png');
            this.load.spritesheet('coins','assets/img/coins.png',40, 39);
            this.load.spritesheet('robot_run','assets/img/robot_run.png',92, 90);
            this.load.spritesheet('door','assets/img/door.png',100,100);
            this.load.spritesheet('rocket','assets/img/rocket.png',30,12);
            this.load.spritesheet('shock','assets/img/shock.png',128,128);
            this.load.spritesheet('explosion','assets/img/explosion.png',100,105);
            this.load.image('bullet','assets/img/Bullet01.png');
            this.load.image('health_pack','assets/img/health_potion.png');
            this.load.image('blue_flame','assets/img/blue_flame.png');
            this.load.image('red_flame','assets/img/red_flame.png');
            this.load.image('enemy_bullet','assets/img/enemy_bullet.png');
            this.load.image('enemy_shoot','assets/img/robot_place.png');
            this.load.image('body','assets/img/robot_body.png');
            this.load.image('arm','assets/img/robot_arm.png');
            this.load.image('empty_bar','assets/img/EmptyBar.png');
            this.load.image('health_bar','assets/img/RedBar.png');
            this.load.image('jetFuel_bar','assets/img/GreenBar.png');
            this.load.image('enemyUI','assets/img/EnemyHead.png');
            this.load.audio('collect','assets/audio/UI_Electric_08.mp3');
            this.load.audio('jets','assets/audio/jet_sound.mp3'); 
    }
    
    onLoadComplete() {
        this.ready = true;
    }
}