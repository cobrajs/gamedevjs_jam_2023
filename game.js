var config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  backgroundColor: '#333333',
  physics: {
    /*
    default: 'matter',
    matter: {
      gravity: { y: 0.8 },
      debug: true,
      debugBodyColor: 0xffffff
    }
    */
    default: 'arcade',
    arcade: {
      debug: false,
      gravity: { y: 300 }
    }
  },
  scene: [GameScene],

  drawColorInt: 0xEEEEEE,

  lineColor: 0x00FF00,
  lineWidth: 5,

  fillColor: 0x333333,

  bloomColor: 0xAAFFAA,
  bloomStrength: 1,

  buttonWidth: 70,
  buttonHeight: 70,

};

config.customBounds = new Phaser.Geom.Rectangle(-100, -100, config.width + 200, config.height + 200);


var game = new Phaser.Game(config);

