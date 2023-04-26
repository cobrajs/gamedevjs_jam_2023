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

    this.input.on('pointerdown', pointer => {
      if (this.currentTool === 'prune') {
        let branch = this.tree.prune(pointer.x - this.tree.x, pointer.y);

        if (branch) {
          this.branches.push(branch);
        }
      } else if (this.currentTool === 'swatter') {
        this.swatFlies(pointer.x, pointer.y);
      } else if (this.currentTool === 'spray') {
        this.sprayFlies(pointer.x, pointer.y);
      }
    });

    /*
    this.input.on('pointerup', pointer => {
      if (this.shift.isDown) {
        console.log('Pointer up! Shift is down!');

        const nearest = this.tree.getNearest(pointer.x, pointer.y);

        this.tree.addSubBranch(nearest.i, nearest.sub, pointer.x, pointer.y);

        return;
      }

      if (this.control.isDown) {
        console.log('Pointer up! Control down!');
        this.flies.forEach(fly => {
          let newVelocity = new Phaser.Math.Vector2(pointer.x - fly.x, pointer.y - fly.y);
          newVelocity.normalize();
          newVelocity.scale(2);

          fly.changeVelocity(newVelocity);
        });

        return;
      }

      this.tree.grow();

      // Make all the sub btranches grow too!
      let lastPoint = this.tree.getLastBranch();

      let newPoint = new Phaser.Math.Vector2(pointer.x - lastPoint.x, pointer.y - lastPoint.y);
      newPoint.normalize();
      newPoint.scale(30);

      this.tree.addBranch(
        lastPoint.x + newPoint.x,
        lastPoint.y + newPoint.y,
        10
      );
    });
    */

    this.toolPicker = new ToolPicker(this, 3, config.height - config.buttonHeight - 3);
    this.add.existing(this.toolPicker);
    this.toolPicker.addListener(this);

    this.currentTool = '';

    this.pause();

    this.branches = [];
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
        //fly.addRotation();
      }
    });
  }

  sprayFlies(x, y) {
    const sprayRadius = 200;
    this.getFlies().forEach(fly => {
      const vector = new Phaser.Math.Vector2(fly.x - x, fly.y - y);
      if (vector.length() < swatRadius) {
        vector.normalize();
        vector.scale(10);
        fly.x += vector.x;
        fly.y += vector.y;
        //fly.addRotation();
      }
    });
  }

  addFly() {
    const side = Math.floor(Math.random() * 2) * config.width;
    const fly = new TimeFly(this, side, 50);
    fly.changeVelocity(side > 0 ? -100 : 100, 20);
    fly.name = 'fly';
    this.add.existing(fly);
  }

  pause() {
    this.time.paused = true;
    //this.physics.pause();
    this.removeFlies();
    this.sunmoon.pause();
    this.tree.disableBloom();
  }

  resume() {
    this.time.paused = false;
    //this.physics.resume();
    this.addFly();
    this.sunmoon.resume();
    this.tree.enableBloom();
  }

  getFlies() {
    return this.children.getChildren()
      .filter(object => object.name === 'fly');
  }

  removeFlies() {
    this.getFlies()
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

    if (Phaser.Input.Keyboard.JustDown(this.space)) {
      console.log('space baby');
      this.tree.expand();

      this.tree.grow();

      this.tree.updateBranches();
    }
  }
}

