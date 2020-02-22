export default class Menu extends Phaser.State {
    
    preload(){
        
        this.load.image('menu_background','assets/img/menu_background.jpg');
    }
    
    create() {
        
        var controls = ['LEFT: ','RIGHT: ','JUMP": ','SHOOT: ','JETPACK: ','FLY UP: ','FLY DOWN: '];
        var keyboard = ['A','D','W','ENTER','SHIFT','W','S'];
        
        
        
        
        var yCoord = 200;
        var textSpacing = 50;
        
        var style =  {
        font: "60px Arial",
        fill: '#ffffff',
        align: "center",
        stroke: '#000000',
        strokeThickness: 2,
        };
      
         this.startGame = this.game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
         this.add.sprite(0,0,'menu_background');
        
        var title = this.addText(this.game.width/2, 100, 60, "Cyborg Ninja", style);
        title.anchor.setTo(.5, 0);
        var textAlign = (this.game.width/2) - (title.width/2);
        var subtitle = this.addText(textAlign, 200, 40, "Controls", style);
        
        var ySpacing = subtitle.y + 50;
        
         yCoord += 25;
        
        for(var i = 0; i < controls.length; i++){
            
            
                this.addText(textAlign, ySpacing, 20, controls[i], style);
                this.addText(textAlign + 200, ySpacing, 20, keyboard[i], style);
                ySpacing += 30;
            }
        
         this.addText(textAlign, this.game.height - 200, 40, "Press Enter to Play!", style);
        
        var sprite = this.game.add.sprite(this.game.width - 300, this.game.height-300, 'ninja');
        sprite.scale.setTo(2);
       sprite.animations.add('run', [56, 57, 58, 59, 60, 61, 62, 63, 64, 65],15, true);
        sprite.play('run');
        
        }
    
    update() {

    
          if(this.startGame.isDown){
              
              this.game.state.start('level1', true, false, 20);
          }
    
    }
    
    addText(x,y, textSize, message, style){
        
             var text = this.game.add.text(x,y, message,  style);
             text.setShadow(5, 5, 'rgba(0,0,0,0.5)', 5);
            var grd = text.context.createLinearGradient(0, 0, 0, 74);
            grd.addColorStop(0, '#8ED6FF');   
            grd.addColorStop(1, '#004CB3');
            text.fill = grd;
            text.fontSize = textSize;
        
        return text;
    }
    
    
    
    
    
    
}