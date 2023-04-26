class Branch extends Phaser.GameObjects.Graphics {
  constructor(scene, x, y, branch) {
    super(scene);

    this.x = x;
    this.y = y;
    this.branchHolder = branch;

    this.scene.physics.add.existing(this);

    this.zeroOutBranches(this.branchHolder, this.branchHolder[0].x, this.branchHolder[0].y);

    //this.postFX.addPixelate(2);
    //this.postFX.addBloom(0xFFFFFF, 1, 1, 1, 2);
    this.postFX.addBloom(config.bloomColor, 1, 1, 1, config.bloomStrength);

    this.scene.tweens.add({
      targets: this,
      alpha: 0,
      duration: 1000,
      onComplete: () => this.destroy()
    });

    this.updateBranches();
  }

  zeroOutBranches(branches, x, y) {
    branches.forEach(branch => {
      branch.x -= x;
      branch.y -= y;
      branch.a.x -= x;
      branch.a.y -= y;
      branch.b.x -= x;
      branch.b.y -= y;
      if (branch.suba) {
        this.zeroOutBranches(branch.suba, x, y);
      }
      if (branch.subb) {
        this.zeroOutBranches(branch.subb, x, y);
      }
    });
  }

  updateBranches() {
    this.clear();

    this.lineStyle(config.lineWidth, config.lineColor, 1);
    this.fillStyle(config.fillColor, 1);

    if (this.branchHolder.length <= 1) {
      return;
    }

    const branchArrays = this.getAllBranchArrays();
    branchArrays.reverse();

    branchArrays.forEach(branch => {
      this.renderBranch(branch);
    });
  }

  renderBranch(mainBranch) {
    this.beginPath();

    let total = mainBranch.length * 2 - 1;
    let getter = 'a';
    let dir = 1;
    let isLast = false;
    this.moveTo(mainBranch[0].b.x, mainBranch[0].b.y);
    this.lineTo(mainBranch[0].a.x, mainBranch[0].a.y);
    for (let i = 0; total > 0; total--) {
      const branch = mainBranch[i];
      if (dir === 1 && i === mainBranch.length - 1) {
        dir = -1;
        getter = 'b';
        isLast = true;
      }
      let currentPosition = branch[getter];
      if (isLast) {
        if (branch.cut) {
          this.lineTo(branch.a.x, branch.a.y);
          this.lineTo(currentPosition.x, currentPosition.y);
        } else {
          this.lineTo(branch.x, branch.y);
        }
      } else {
        this.lineTo(currentPosition.x, currentPosition.y);
      }
      i += dir;
      isLast = false;
    }

    this.fillPath();
    this.strokePath();
  }

  getAllBranchArrays(currentBranch, branchArrays) {
    if (!currentBranch) {
      currentBranch = this.branchHolder;
    }

    if (!branchArrays) {
      branchArrays = [currentBranch];
    } else {
      branchArrays.push(currentBranch);
    }

    currentBranch.forEach(branch => {
      if (branch.suba) {
        branchArrays = this.getAllBranchArrays(branch.suba, branchArrays);
      }
      if (branch.subb) {
        branchArrays = this.getAllBranchArrays(branch.subb, branchArrays);
      }
    });

    return branchArrays;
  }
}

