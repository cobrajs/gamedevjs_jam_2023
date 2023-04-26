class Tree extends Phaser.GameObjects.Graphics {
  constructor(scene) {
    super(scene);

    this.postFX.addBloom(config.bloomColor, 1, 1, 1, config.bloomStrength);
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

    this.fillRect(this.pot.x, this.pot.y, this.pot.w, this.pot.h);
    this.strokeRect(this.pot.x, this.pot.y, this.pot.w, this.pot.h);

    //console.log(JSON.stringify(this.branchHolder));
  }
}

