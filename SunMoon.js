class SunMoon extends Phaser.GameObjects.Container {
  constructor(scene, x, y, children) {
    super(scene, x, y, children);

    this.window = new Phaser.GameObjects.Rectangle(scene, 0, 0, 150, 100, config.fillColor);
    this.window.isStroked = true;
    this.window.lineWidth = config.lineWidth;
    this.window.strokeColor = config.lineColor;
    this.window.displayOriginX = 1;
    this.add(this.window);

    let background = new Phaser.GameObjects.Container(scene, 0, 0);

    let sun = new Phaser.GameObjects.Ellipse(scene, -100, 0, 50, 50, config.fillColor);
    sun.isStroked = true;
    sun.lineWidth = config.lineWidth;
    sun.strokeColor = config.lineColor;

    let moon = new Phaser.GameObjects.Ellipse(scene, 100, 0, 50, 50, config.fillColor);
    moon.isStroked = true;
    moon.lineWidth = config.lineWidth;
    moon.strokeColor = config.lineColor;

    let cycle = new Phaser.GameObjects.Container(scene, 150, 0, [sun, moon]);
    this.add(cycle);
    background.add(cycle);
    this.add(background);
    cycle.angle = Math.random() * 360;

    let mask = new Phaser.GameObjects.Graphics(scene);
    mask.clear();
    mask.fillStyle(0x000000, 1.0);
    mask.fillRect(150, 152, 150, 96);

    background.mask = new Phaser.Display.Masks.BitmapMask(scene, mask);

    this.moveTween = scene.tweens.add({
      targets: cycle,
      angle: { from: 0, to: 360 },
      loop: -1,
      duration: 2000
    });

    this.postFX.addBloom(config.bloomColor, 1, 1, 1, config.bloomStrength);
  }

  toggle() {
    if (this.moveTween.paused) {
      this.moveTween.resume();
    } else {
      this.moveTween.pause();
    }
  }

  resume() {
    if (this.moveTween.paused) {
      this.moveTween.resume();
    }
  }

  pause() {
    if (!this.moveTween.paused) {
      this.moveTween.pause();
    }
  }
}

