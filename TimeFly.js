class TimeFly extends Phaser.GameObjects.Container {
  constructor(scene, x, y, children) {
    super(scene, x, y, children);

    this.wingA = new Phaser.GameObjects.Ellipse(scene, -4, -4, 14, 10, config.fillColor);
    this.wingA.isStroked = true;
    this.wingA.lineWidth = config.lineWidth;
    this.wingA.strokeColor = config.lineColor;
    this.wingA.displayOriginX = 1;
    //this.add(this.wingA);

    const body = new Phaser.GameObjects.Ellipse(scene, 0, 0, 20, 15, config.fillColor);
    body.isStroked = true;
    body.lineWidth = config.lineWidth;
    body.strokeColor = config.lineColor;
    //this.add(body);

    this.wingB = new Phaser.GameObjects.Ellipse(scene, -4, -4, 18, 12, config.fillColor);
    this.wingB.isStroked = true;
    this.wingB.lineWidth = config.lineWidth;
    this.wingB.strokeColor = config.lineColor;
    this.wingB.displayOriginX = 1;
    //this.add(this.wingB);

    this.flyContainer = new Phaser.GameObjects.Container(scene, 0, 0, [this.wingA, body, this.wingB]);
    this.add(this.flyContainer);
    this.flyContainer.scaleX = -1;

    scene.physics.add.existing(this);
    this.body.setAllowGravity(false);
    this.body.width = 20;
    this.body.isCircle = true;
    this.body.setOffset(-40, -50);

    this.timing = 0;

    this.postFX.addBloom(config.bloomColor, 1, 1, 1, config.bloomStrength);
    /*
    scene.tweens.add({
      targets: this,
      props: {
        scaleX: { value: 0, duration: 1000, yoyo: true, repeat: -1 }
      },
      ease: 'Linear'
    });
    */
  }

  changeVelocity(x, y) {
    if (x > 0 && this.flyContainer.scaleX > 0) {
      //this.addScaleXTween(-1);
      this.flyContainer.scaleX = -1;
    } else if (x < 0 && this.flyContainer.scaleX < 0) {
      //this.addScaleXTween(1);
      this.flyContainer.scaleX = 1;
    }

    this.body.setVelocity(x, y);
  }

  addScaleXTween(target) {
    if (this.flipTween) {
      this.flipTween.destroy();
    }

    this.flipTween = this.scene.tweens.add({
      targets: this.flyContainer,
      scaleX: { from: this.flyContainer.scaleX, to: target },
      ease: 'Ease',
      duration: 200
    });
  }

  sprayed(vector) {
    this.changeVelocity(vector.x, vector.y);
    this.setTargetEvent(1000);
  }

  setTargetEvent(delay = 500) {
    this.scene.time.addEvent({
      delay,
      callback: () => this.setTarget()
    });
  }

  setTarget(newTarget) {
    if (!this.scene) {
      return;
    }
    if (!newTarget) {
      newTarget = this.scene.tree.getRandomSegment();
    }
    const newVector = new Phaser.Math.Vector2(newTarget.x - this.x, newTarget.y - this.y);
    newVector.normalize();
    newVector.scale(100);
    this.changeVelocity(newVector.x, newVector.y);
  }

  addRotation() {
    this.scene.tweens.add({
      targets: this.flyContainer,
      rotation: { from: 0, to: 360 },
      duration: 500
    });
  }

  update() {
    this.wingB.rotation = Math.sin(this.timing / 2) * 0.75 - Math.PI / 8;
    this.wingA.rotation = Math.cos(this.timing / 2) * 0.75 - Math.PI / 8;
    this.timing += 1;

    if (this.x > config.width || this.x < 0 || this.y > config.height || this.y < 0) {
      this.destroy();
    }
  }
}

