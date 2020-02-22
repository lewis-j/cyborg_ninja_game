export default class GameOver extends Phaser.State {
    
    
    preload(){
        
        this.load.image('menu_background','assets/img/menu_background.jpg');
    }
    
    create() {
        
       
        var style =  {
        font: "60px Arial",
        fill: '#ffffff',
        align: "center",
        stroke: '#000000',
        strokeThickness: 2,
        };
      
         this.startGame = this.game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
         this.add.sprite(0,0,'menu_background');
        
        var title = this.addText(this.game.width/2, 100, 60, "GAME OVER", style);
        title.anchor.setTo(.5, 0);
        var textAlign = (this.game.width/2) - (title.width/2);
        
        
        var sprite = this.game.add.sprite(this.game.width/2, this.game.height/2, 'ninja');
        sprite.scale.setTo(2);
       sprite.animations.add('dizzy', [18, 19, 20, 21],10, true);
        sprite.play('dizzy');
        
        }
    
    
    
    update() {

    
          if(this.startGame.isDown){
              
              this.game.state.start('menu');
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