const maxLeafSize = 50;

class Leaf extends Phaser.GameObjects.Polygon {
  constructor(scene, x, y, rotation) {
    super(scene, x, y, [0, 0, 10, 0], config.fillColor);

    this.x = x;
    this.y = y;
    this.rotation = rotation;

    this.leafSize = 20;

    this.name = 'leaf';
    this.isFilled = true;
    this.isStroked = true;

    this.postFX.addBloom(config.bloomColor, 1, 1, 1, config.bloomStrength);

    this.setStrokeStyle(config.lineWidth, config.lineColor, 1.0);
    this.setFillStyle(config.fillColor, 1.0);

    this.renderLeaf();

    scene.add.existing(this);
  }

  makeFall() {
    this.scene.physics.add.existing(this);
    this.body.velocity.y = -50;
    this.body.velocity.x = Math.random() * 80 - 40;
    this.body.angularVelocity = Math.random() * 300 - 150;

    this.scene.tweens.add({
      targets: this,
      alpha: 0,
      duration: 1000,
      onComplete: () => this.destroy()
    });
  }

  grow() {
    if (this.leafSize < maxLeafSize) {
      this.leafSize += 0.1;

      this.renderLeaf();
    }
  }

  renderLeaf() {
    const quarterSize = this.leafSize / 4;

    let points = [
      0, 0,
      quarterSize, 0,
      quarterSize * 2, -quarterSize,
      quarterSize * 3, -quarterSize,
      this.leafSize, 0,
      quarterSize * 3, quarterSize,
      quarterSize * 2, quarterSize,
      quarterSize, 0
    ];

    this.pathData = points;
  }

  /*
  renderLeaf() {
    //this.lineStyle(config.lineWidth, config.lineColor, 1);
    this.lineStyle(config.lineWidth, config.lineColor, 1.0);
    this.defaultStrokeWidth = config.lineWidth;
    this.fillStyle(config.fillColor, 1.0);

    this.clear();

    const quarterSize = this.leafSize / 4;

    this.beginPath();
    this.moveTo(0, 0);
    this.lineTo(quarterSize, 0);
    this.lineTo(quarterSize * 2, -quarterSize);
    this.lineTo(quarterSize * 3, -quarterSize);
    this.lineTo(this.leafSize, 0);
    this.lineTo(quarterSize * 3, quarterSize);
    this.lineTo(quarterSize * 2, quarterSize);
    this.lineTo(quarterSize, 0);
    this.fillPath();
    this.strokePath();
  }
  */
}

