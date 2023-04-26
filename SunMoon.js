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

    let sun = new Phaser.GameObjects.Graphics(scene, -100, 0, 50, 50, config.fillColor);
    sun.fillStyle(config.fillColor, 1.0);
    sun.lineStyle(config.lineWidth, config.lineColor, 1.0);
    let centerX = -100,
        centerY = 0;
    sun.strokeCircle(centerX, centerY, 25);
    sun.beginPath();
    for (let i = 0; i < Math.PI * 2; i += Math.PI / 4) {
      sun.moveTo(centerX + Math.cos(i) * 30, centerY + Math.sin(i) * 30);
      sun.lineTo(centerX + Math.cos(i) * 38, centerY + Math.sin(i) * 38);
    }
    sun.strokePath();

    this.moon = new Phaser.GameObjects.Graphics(scene, 100, 0, 50, 50, config.fillColor);
    this.moonOffset = 1;
    this.moonOffsetDir = -0.1;
    this.renderMoon();

    let cycle = new Phaser.GameObjects.Container(scene, 150, 0, [sun, this.moon]);
    this.add(cycle);
    background.add(cycle);
    this.add(background);
    cycle.angle = Math.random() * 360;

    let scenery = new Phaser.GameObjects.Graphics(scene, 0, 0);
    scenery.fillStyle(config.fillColor, 1.0);
    scenery.lineStyle(config.lineWidth, config.lineColor, 1.0);
    scenery.fillRect(-100, 30, 300, 50);
    scenery.strokeRect(-100, 30, 300, 50);

    background.add(scenery);

    let cloud = new Phaser.GameObjects.Graphics(scene);
    cloud.fillStyle(config.fillColor, 1.0);
    cloud.lineStyle(config.lineWidth, config.lineColor, 1.0);
    cloud.beginPath();
    cloud.moveTo(0, 0);
    cloud.lineTo(50, 0);
    cloud.lineTo(45, -10);
    cloud.lineTo(35, -15);
    cloud.lineTo(30, -10);
    cloud.lineTo(25, -10);
    cloud.lineTo(20, -25);
    cloud.lineTo(10, -20);
    cloud.lineTo(0, 0);
    cloud.fillPath();
    cloud.strokePath();
    cloud.x = -100;

    this.cloudTween = scene.tweens.add({
      targets: cloud,
      x: { from: -100, to: 200 },
      duration: 1000,
      loop: -1,
      onLoop: () => cloud.y = Math.random() * 50 - 25
    });

    background.add(cloud);

    let mask = new Phaser.GameObjects.Graphics(scene);
    mask.clear();
    mask.fillStyle(0x000000, 1.0);
    mask.fillRect(200, 152, 147, 96);

    background.mask = new Phaser.Display.Masks.BitmapMask(scene, mask);

    this.moveTween = scene.tweens.add({
      targets: cycle,
      angle: { from: 0, to: 360 },
      loop: -1,
      duration: 2000,
      onLoop: () => this.renderMoon()
    });

    this.postFX.addBloom(config.bloomColor, 1, 1, 1, config.bloomStrength);
  }

  renderMoon() {
    this.moon.clear();
    this.moon.fillStyle(config.fillColor, 1.0);
    this.moon.lineStyle(config.lineWidth, config.lineColor, 1.0);
    let centerX = 100;
    let centerY = 0;
    this.moon.beginPath();
    for (let i = 0; i < Math.PI * 2; i += Math.PI / 8) {
      let r = 25;
      if (i === 0) {
        this.moon.moveTo(centerX + Math.cos(i) * 25, centerY + Math.sin(i) * 25);
      } else {
        if (i > Math.PI) {
          r *= this.moonOffset;
        }
        this.moon.lineTo(centerX + Math.cos(i) * 25, centerY + Math.sin(i) * r);
      }
    }
    this.moon.lineTo(centerX + Math.cos(0) * 25, centerY + Math.sin(0) * 25);
    this.moon.strokePath();
    this.moonOffset += this.moonOffsetDir;
    if (this.moonOffset <= -1) {
      this.moonOffset = -0.9;
      this.moonOffsetDir *= -1;
    } else if (this.moonOffset > 1) {
      this.moonOffset = 1;
      this.moonOffsetDir *= -1;
    }
  }

  toggle() {
    if (this.moveTween.paused) {
      this.moveTween.resume();
      this.cloudTween.resume();
    } else {
      this.moveTween.pause();
      this.cloudTween.pause();
    }
  }

  resume() {
    if (this.moveTween.paused) {
      this.moveTween.resume();
      this.cloudTween.resume();
    }
  }

  pause() {
    if (!this.moveTween.paused) {
      this.moveTween.pause();
      this.cloudTween.pause();
    }
  }
}

