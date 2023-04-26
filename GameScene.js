class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');

    this.playerState = {};

    this.flies = [];
  }

  preload() {
  }

  create () {
    const debug = this.add.graphics().fillStyle(0xffffff);

    this.sunmoon = new SunMoon(this, config.width / 2 - 200, config.height / 2 - 100);
    this.add.existing(this.sunmoon);

    this.tree = new Tree(this);
    this.tree.x = 140;

    this.add.existing(this.tree);

    this.tree.updateBranches();

    this.shift = this.input.keyboard.addKey('SHIFT');
    this.control = this.input.keyboard.addKey('CTRL');
    this.space = this.input.keyboard.addKey('SPACE');

    /*
    this.input.on('pointermove', pointer => {
      this.getFlies().forEach(fly => {
        let newVelocity = new Phaser.Math.Vector2(pointer.x - fly.x, pointer.y - fly.y);
        newVelocity.normalize();
        newVelocity.scale(200);

        fly.changeVelocity(newVelocity.x, newVelocity.y);
      });
    });
    */

    this.pointerLocation = null;

    this.input.on('pointerdown', pointer => {
      if (this.currentTool === 'prune') {
        this.tree.prune(pointer.x - this.tree.x, pointer.y);
      } else if (this.currentTool === 'swatter') {
        this.swatFlies(pointer.x, pointer.y);
      } else if (this.currentTool === 'spray') {
        this.pointerLocation = pointer;
      }
    });

    this.input.on('pointermove', pointer => {
      if (this.currentTool === 'spray' && this.pointerLocation) {
        this.pointerLocation = pointer;
      }
    });

    this.input.on('pointerup', pointer => {
      this.pointerLocation = null;
    });

    this.toolPicker = new ToolPicker(this, 3, config.height - config.buttonHeight - 3);
    this.add.existing(this.toolPicker);
    this.toolPicker.addListener(this);

    this.currentTool = '';

    this.pause();
  }

  message(subject, data) {
    if (subject === 'clicked') {
      if (data.name === 'state') {
        if (data.state) {
          this.resume();
        } else {
          this.pause();
        }
      } else if (data.group === 'tool') {
        this.currentTool = data.name;
      } else if (data.name === 'reset') {
        this.pause();
        this.tree.reset();
        this.getLeaves().forEach(leaf => leaf.makeFall());
      }
    }
  }

  swatFlies(x, y) {
    const swatRadius = 100;
    this.getFlies().forEach(fly => {
      const vector = new Phaser.Math.Vector2(fly.x - x, fly.y - y);
      if (vector.length() < swatRadius) {
        vector.normalize();
        vector.scale(400);
        fly.changeVelocity(vector.x, vector.y);
        fly.name = 'deadfly';
        fly.addRotation();
      }
    });
  }

  sprayFlies(x, y) {
    const sprayRadius = 200;
    this.getFlies().forEach(fly => {
      const vector = new Phaser.Math.Vector2(fly.x - x, fly.y - y);
      const length = vector.length();
      if (length < sprayRadius) {
        vector.normalize();
        //vector.scale(Math.max(10, (-sprayRadius / (sprayRadius - length)) / 10));
        vector.scale(100);
        fly.sprayed(vector);
      }
    });
  }

  addFly() {
    const side = Math.floor(Math.random() * 2) * config.width;
    const fly = new TimeFly(this, side, Math.random() * (config.height / 2));
    fly.changeVelocity(side > 0 ? -100 : 100, Math.random() * 50 - 25);
    fly.setTargetEvent();
    fly.name = 'fly';
    this.add.existing(fly);
  }

  pause() {
    this.time.paused = true;
    //this.physics.pause();
    this.removeFlies();
    this.sunmoon.pause();
    this.tree.disableBloom();
    if (this.addFlyEvent) {
      this.addFlyEvent.destroy();
    }
  }

  resume() {
    this.time.paused = false;
    //this.physics.resume();
    this.sunmoon.resume();
    this.tree.enableBloom();
    const timing = Math.max(2000, Math.min(100000 / this.tree.getTreeSize(), 5000));
    this.addFlyEvent = this.time.addEvent({
      delay: timing,
      loop: true,
      callback: () => this.addFly()
    });
  }

  getFlies(all) {
    return this.children.getChildren()
      .filter(object => {
        return object.name === 'fly' || (all && object.name === 'deadfly');
      });
  }

  getLeaves() {
    return this.children.getChildren()
      .filter(object => object.name === 'leaf');
  }

  removeFlies() {
    this.getFlies(true)
      .forEach(fly => {
        fly.body.destroy();
        this.tweens.add({
          targets: fly,
          props: {
            alpha: 0,
            scale: 0
          },
          duration: 200,
          onComplete: () => fly.destroy()
        });
      });
  }

  update() {
    if (this.time.paused) {
      return;
    }

    if (this.currentTool === 'spray' && this.pointerLocation) {
      this.sprayFlies(this.pointerLocation.x, this.pointerLocation.y);
    }

    this.children.list.forEach(child => {
      child.update()

      if (child.name === 'deadfly') {
        let segment = this.tree.getNearestSegmentSide(child.x - this.tree.x, child.y, 10);

        if (segment) {
          this.tree.addSubBranch(segment.branch, segment.sub, segment.index, child.x, child.y);
          child.destroy();
        }
      }
    });

    if (Math.floor(this.time.now) % 2 === 0) {
      this.tree.grow();
      this.tree.expand();
    } else {
      this.tree.updateBranches();
    }
  }
}

