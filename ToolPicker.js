const buttonWidth = 70;
const buttonHeight = 70;

const halfWidth = buttonWidth / 2;
const halfHeight = buttonHeight / 2;
const thirdWidth = buttonWidth / 3;
const thirdHeight = buttonHeight / 3;
const fourthWidth = buttonWidth / 4;
const fourthHeight = buttonHeight / 4;
const sixthWidth = thirdWidth / 2;
const sixthHeight = thirdHeight / 2;
const twelfthWidth = sixthWidth / 2;
const twelfthHeight = sixthHeight / 2;

const glowMax = 1;
const glowColor = 0xFFFFFF;

class ToolPicker extends Phaser.GameObjects.Container {
  constructor(scene, x, y, children) {
    super(scene, x, y, children);

    this.lastX = 0;

    this.glowFX = {};
    this.glowTweens = {};
    this.tools = {};

    this.addButton('state', {
      type: 'toggle',
      on: [
        { x: thirdWidth, y: fourthHeight },
        { x: thirdWidth, y: buttonHeight - fourthHeight },
        { x: buttonWidth - thirdWidth, y: fourthHeight, jump: true },
        { x: buttonWidth - thirdWidth, y: buttonHeight - fourthHeight },
      ],
      off: [
        { x: fourthWidth, y: fourthHeight },
        { x: fourthWidth, y: buttonHeight - fourthHeight },
        { x: buttonWidth - fourthWidth, y: halfHeight },
        { x: fourthWidth, y: fourthHeight },
      ],
    });
    this.addButton('prune', {
      type: 'group',
      group: 'tool',
      on: [
        { x: buttonWidth - sixthWidth, y: thirdWidth },
        { x: sixthWidth, y: thirdWidth * 2 },
        { x: sixthWidth, y: halfHeight },
        { x: halfWidth, y: halfHeight },

        { x: buttonWidth - thirdWidth, y: sixthHeight, jump: true },
        { x: thirdWidth, y: buttonHeight - sixthHeight },
        { x: halfWidth, y: buttonHeight - sixthHeight },
        { x: halfWidth, y: halfHeight },
      ]
    });
    this.addButton('swatter', {
      type: 'group',
      group: 'tool',
      on: [
        { x: sixthWidth, y: halfHeight },
        { x: halfWidth, y: sixthHeight },
        { x: buttonWidth - sixthWidth, y: halfHeight },
        { x: halfWidth, y: buttonHeight - sixthHeight },
        { x: sixthWidth, y: halfHeight },

        { x: sixthWidth + twelfthWidth, y: halfHeight + twelfthHeight, jump: true },
        { x: halfWidth + twelfthWidth, y: sixthHeight + twelfthHeight },

        { x: thirdWidth, y: buttonHeight - thirdHeight + twelfthHeight, jump: true },
        { x: buttonWidth - thirdWidth + twelfthWidth, y: thirdHeight },

        { x: thirdWidth, y: thirdHeight, jump: true },
        { x: buttonWidth - sixthWidth, y: buttonHeight - sixthHeight },
      ]
    });
    this.addButton('spray', {
      type: 'group',
      group: 'tool',
      on: [
        { x: sixthWidth, y: thirdHeight },
        { x: halfWidth, y: thirdHeight },
        { x: halfWidth, y: buttonHeight - sixthHeight },
        { x: sixthWidth, y: buttonHeight - sixthHeight },
        { x: sixthWidth, y: thirdHeight },

        { x: sixthWidth + twelfthWidth, y: thirdHeight, jump: true },
        { x: sixthWidth + twelfthWidth, y: sixthHeight },
        { x: thirdWidth + twelfthWidth, y: sixthHeight },
        { x: thirdWidth + twelfthWidth, y: thirdHeight },

        { x: buttonWidth - thirdWidth, y: sixthHeight, jump: true },
        { x: buttonWidth - sixthWidth, y: sixthHeight },

        { x: buttonWidth - thirdWidth, y: thirdHeight, jump: true },
        { x: buttonWidth - sixthWidth, y: thirdHeight + twelfthHeight },

        { x: buttonWidth - thirdWidth, y: thirdHeight + sixthHeight, jump: true },
        { x: buttonWidth - sixthWidth, y: thirdHeight * 2 },
      ]
    });
    this.addButton('reset', {
      type: 'button',
      on: [
        { x: fourthWidth, y: thirdWidth },
        { x: fourthWidth, y: fourthWidth },
        { x: buttonWidth - fourthWidth, y: fourthHeight },
        { x: buttonWidth - fourthWidth, y: buttonHeight - fourthHeight },
        { x: fourthWidth, y: buttonHeight - fourthHeight },
        { x: fourthWidth, y: halfHeight - twelfthHeight },
        { x: fourthWidth - sixthWidth, y: halfHeight + twelfthHeight },
        { x: fourthWidth, y: halfHeight - twelfthHeight, jump: true },
        { x: fourthWidth + sixthWidth, y: halfHeight + twelfthHeight },

      ]
    });

    scene.input.on('gameobjectup', (pointer, gameObject) => {
      let tool = this.tools[gameObject.name];

      if (!tool) {
        return;
      }

      if (tool.type === 'group') {
        let currentTool;
        Object.keys(this.tools).forEach(otherToolName => {
          let otherTool = this.tools[otherToolName];

          if (otherTool.state) {
            currentTool = otherTool;
          }

          if (otherTool.type === 'group' && otherTool.group === tool.group && otherTool.name !== tool.name) {
            this.glowFX[otherTool.name].outerStrength = 0;
            otherTool.state = false;
          }
        });
        if (currentTool && currentTool.name === tool.name) {
          return;
        }
        this.glowFX[tool.name].outerStrength = glowMax;
        tool.state = true;
      } else if (tool.type === 'toggle') {
        tool.state = !tool.state;
        this.renderButton(tool)
      }

      this.listeners.forEach(listener => {
        listener.message('clicked', {
          name: tool.name,
          group: tool.group,
          state: tool.state
        });
      });
    });

    scene.input.on('gameobjectover', (pointer, gameObject) => {
      if (this.glowFX[gameObject.name]) {
        this.addGlowTween(gameObject.name, glowMax);
      }
    });

    scene.input.on('gameobjectout', (pointer, gameObject) => {
      if (this.glowFX[gameObject.name]) {
        this.addGlowTween(gameObject.name, 0);
      }
    });

    this.postFX.addBloom(config.bloomColor, 1, 1, 1, config.bloomStrength);

    this.listeners = [];
  }

  addButton(name, options) {
    let tool = new Phaser.GameObjects.Graphics(this.scene, {x: this.lastX, y: 0});
    tool.setInteractive(new Phaser.Geom.Rectangle(0, 0, buttonWidth, buttonHeight), Phaser.Geom.Rectangle.Contains);
    tool.setName(name);
    this.add(tool);
    tool.state = false;
    tool.on = options.on;
    tool.off = options.off;
    tool.type = options.type;
    tool.group = options.group;
    this.tools[name] = tool;

    this.glowFX[name] = tool.postFX.addGlow(glowColor, 0, 0);

    this.renderButton(tool);

    this.lastX += buttonWidth;
  }

  renderButton(nameOrTool) {
    let tool = nameOrTool;
    if (typeof nameOrTool === 'string') {
      tool = this.tools[name];

      if (!tool) {
        return;
      }
    }

    tool.clear();
    tool.lineStyle(config.lineWidth, config.lineColor, 1.0);
    tool.fillStyle(config.fillColor, 1.0);
    tool.strokeRect(0, 0, buttonWidth, buttonHeight);

    if (tool.type === 'toggle') {
      this.renderButtonImage(tool, tool.state ? 'on' : 'off');
    } else {
      this.renderButtonImage(tool, 'on');
    }
  }

  renderButtonImage(tool, use) {
    let array = tool[use];
    array.forEach((point, i) => {
      if (point.jump || i === 0) {
        tool.moveTo(point.x, point.y);
      } else {
        tool.lineTo(point.x, point.y);
      }
    });
    tool.strokePath();
  }

  addGlowTween(object, target) {
    if (this.glowTweens[object]) {
      this.glowTweens[object].destroy();
    }

    let tool = this.tools[object];

    if (tool.type === 'group' && tool.state) {
      return;
    }

    this.glowTweens[object] = this.scene.tweens.add({
      targets: this.glowFX[object],
      outerStrength: target,
      duration: 200
    });
  }

  addListener(thing) {
    this.listeners.push(thing);
  }
}


