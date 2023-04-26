const growSpeed = 0.1;
const expandSpeed = 1.2;

class Tree extends Phaser.GameObjects.Graphics {
  constructor(scene) {
    super(scene);

    this.pot = {
      x: config.width / 2 - 100,
      y: config.height - 60,
      w: 240,
      h: 58
    };

    this.branchHolder = [{
      x: this.pot.x + this.pot.w / 2,
      y: this.pot.y,
      w: 20,
      a: {x: 0, y: 0},
      b: {x: 0, y: 0}
    }, {
      x: this.pot.x + this.pot.w / 2,
      y: this.pot.y - 10,
      w: 20,
      a: {x: 0, y: 0},
      b: {x: 0, y: 0}
    }];

    this.branchHolder = [
      {"x":400,"y":550,"w":74,"a":{"x":363,"y":550},"b":{"x":437,"y":550}},
      {"x":400,"y":520,"w":62,"a":{"x":371,"y":528},"b":{"x":428,"y":511}},
      {"x":382,"y":495,"w":60,"a":{"x":360,"y":514},"b":{"x":405,"y":475}},
      {"x":360,"y":474,"w":58,"a":{"x":347,"y":499},"b":{"x":374,"y":450}},
      {"x":331,"y":467,"w":56,"a":{"x":317,"y":489},"b":{"x":346,"y":445}},
      {"x":314,"y":443,"w":54,"a":{"x":294,"y":461},"b":{"x":333,"y":424}},
      {"x":291,"y":423,"w":52,"a":{"x":270,"y":431},"b":{"x":312,"y":415}},
      {"x":295,"y":394,"w":50,"a":{"x":275,"y":382},"b":{"x":316,"y":405}},
      {"x":318,"y":374,"w":48,"a":{"x":304,"y":355},"b":{"x":332,"y":393}},
      {"x":343,"y":358,"w":46,"a":{"x":337,"y":337},"b":{"x":349,"y":379}},
      {"x":373,"y":358,"w":44,"a":{"x":373,"y":336},"b":{"x":372,"y":380}},
      {"x":403,"y":359,"w":42,"a":{"x":406,"y":338},"b":{"x":400,"y":380}},
      {"x":432,"y":367,"w":40,"a":{"x":437,"y":347},"b":{"x":427,"y":386}},
      {"x":461,"y":373,"w":38,"a":{"x":461,"y":355},"b":{"x":461,"y":392}},
      {"x":490,"y":366,"w":36,"a":{"x":486,"y":349},"b":{"x":495,"y":383}, "suba":[
        {"x":490,"y":366,"w":36},
        {"x":490,"y":336,"w":12},
        {"x":500,"y":306,"w":10}
      ]},
      {"x":519,"y":358,"w":34,"a":{"x":512,"y":343},"b":{"x":526,"y":373}},
      {"x":545,"y":342,"w":32,"a":{"x":536,"y":329},"b":{"x":554,"y":356}},
      {"x":569,"y":325,"w":30,"a":{"x":557,"y":318},"b":{"x":581,"y":332}},
      {"x":573,"y":295,"w":28,"a":{"x":559,"y":295},"b":{"x":587,"y":295}},
      {"x":570,"y":265,"w":26,"a":{"x":559,"y":271},"b":{"x":581,"y":260}},
      {"x":548,"y":244,"w":24,"a":{"x":545,"y":255},"b":{"x":552,"y":234}},
      {"x":518,"y":248,"w":22,"a":{"x":516,"y":258},"b":{"x":521,"y":238}, "subb":[
        {"x":518,"y":248,"w":22,"a":{"x":516,"y":258},"b":{"x":521,"y":238}},
        {"x":528,"y":228,"w":12,"a":{"x":528,"y":228},"b":{"x":490,"y":228}},
        {"x":538,"y":208,"w":10,"a":{"x":538,"y":208},"b":{"x":500,"y":208}}
      ]},
      {"x":494,"y":230,"w":20,"a":{"x":488,"y":238},"b":{"x":501,"y":223}},
      {"x":474,"y":208,"w":18,"a":{"x":466,"y":214},"b":{"x":481,"y":203}},
      {"x":460,"y":182,"w":16,"a":{"x":452,"y":184},"b":{"x":467,"y":180}, cut: true}/*,
      {"x":457,"y":152,"w":14,"a":{"x":450,"y":152},"b":{"x":464,"y":152}},
      {"x":462,"y":122,"w":12,"a":{"x":456,"y":121},"b":{"x":468,"y":124}},
      {"x":471,"y":94,"w":10,"a":{"x":467,"y":92},"b":{"x":476,"y":95}, "cut": true}
      */
    ];

    //this.postFX.addPixelate(2);
    this.bloom = this.postFX.addBloom(config.bloomColor, 1, 1, 1, config.bloomStrength);
    //let fx = this.postFX.addDisplacement('noise', -0.02, 0);

    /*
    scene.tweens.add({
      targets: fx,
      x: 0.02,
      yoyo: true,
      loop: -1,
      duration: 1000,
      ease: 'sine.inout'
    });
    */
  }

  reset() {
    this.branchHolder = [{
      x: this.pot.x + this.pot.w / 2,
      y: this.pot.y,
      w: 20,
      a: {x: 0, y: 0},
      b: {x: 0, y: 0}
    }, {
      x: this.pot.x + this.pot.w / 2,
      y: this.pot.y - 10,
      w: 20,
      a: {x: 0, y: 0},
      b: {x: 0, y: 0}
    }];

    this.updateBranches();
  }

  getNearesetInfluence(x, y, radius) {
    const influences = this.scene.children.getChildren().filter(child => child.name === 'fly');
    const nearest = influences.reduce((near, influence) => {
      const distance = Phaser.Math.Distance.Between(x, y, influence.x, influence.y);
      if (distance < near.dist) {
        near.dist = distance;
        near.obj = influence;
      }
      return near;
    }, {dist: Infinity, obj: null});

    if (radius && nearest.dist > radius) {
      return null;
    }

    return nearest.obj;
  }

  addBranch(x, y, w = 10) {
    this.branchHolder.push({
      x, y, w
    });

    this.updateBranches();
  }

  grow(branches, level) {
    if (!branches) {
      branches = this.branchHolder;
    }

    if (!level) {
      level = 1;
    }

    branches.forEach(branch => {
      branch.w += growSpeed * level;

      if (branch.suba) {
        this.grow(branch.suba, level / 2);
      }

      if (branch.subb) {
        this.grow(branch.subb, level / 2);
      }
    });
  }

  /**
   * This expands/extends the last segment towards or away from the nearest 
   *  point of influence (a timefly). The main branch (level 1) grows away and
   *  any subbranches grow towards
   */
  expand(branches, level) {
    const original = !branches;

    if (!branches) {
      branches = this.branchHolder;
    }

    if (!level) {
      level = 1;
    }

    branches.forEach(branch => {
      if (branch.suba) {
        this.expand(branch.suba, level / 2);
      }
      if (branch.subb) {
        this.expand(branch.subb, level / 2);
      }
    });

    const penultimatePoint = branches[branches.length - 2];
    const lastPoint = branches[branches.length - 1];

    if (!lastPoint.cut) {

      const nearestInfluence = this.getNearesetInfluence(lastPoint.x, lastPoint.y);

      let newPoint = new Phaser.Math.Vector2(lastPoint.x - penultimatePoint.x, lastPoint.y - penultimatePoint.y);
      newPoint.normalize();
      if (nearestInfluence) {
        let targetAngle = Phaser.Math.Angle.Between(lastPoint.x, lastPoint.y, nearestInfluence.x, nearestInfluence.y);
        if (level === 1) {
          targetAngle = Phaser.Math.Angle.Wrap(targetAngle + Math.PI);
        }
        const rotatedAngle = Phaser.Math.Angle.RotateTo(newPoint.angle(), targetAngle, 0.5 / level);
        newPoint.setAngle(rotatedAngle);
      }
      newPoint.scale(expandSpeed / level);

      const length = Phaser.Math.Distance.BetweenPoints(lastPoint, penultimatePoint);
      if (length < 20) {
        lastPoint.x += newPoint.x;
        lastPoint.y += newPoint.y;
      } else {
        branches.push({
          x: lastPoint.x + newPoint.x,
          y: lastPoint.y + newPoint.y,
          w: 10
        });
      }
    }

    if (original) {
      this.updateBranches();
    }
  }

  updateBranchWidths(branchSet) {
    const firstBranch = branchSet[0];
    firstBranch.a = new Phaser.Math.Vector2(firstBranch.x - firstBranch.w / 2, firstBranch.y);
    firstBranch.b = new Phaser.Math.Vector2(firstBranch.x + firstBranch.w / 2, firstBranch.y);
    const lastI = branchSet.length - 1;
    for (let i = 1; i < branchSet.length; i++) {
      const branch = branchSet[i];
      const prev = branchSet[i - 1];
      let perp = this.getPerpendicular(prev.x, prev.y, branch.x, branch.y);
      if (i < lastI) {
        const next = branchSet[i + 1];
        let nextPerp = this.getPerpendicular(branch.x, branch.y, next.x, next.y);
        perp.add(nextPerp);
        perp.scale(0.5);
      }
      perp.scale(branch.w / 2);
      branch.a = new Phaser.Math.Vector2(branch.x - perp.x, branch.y - perp.y);
      branch.b = new Phaser.Math.Vector2(branch.x + perp.x, branch.y + perp.y);

      if (branch['suba']) {
        this.updateBranchWidths(branch['suba']);
      } else if (branch['subb']) {
        this.updateBranchWidths(branch['subb']);
      }
    }
  }

  updateBranches() {
    this.updateBranchWidths(this.branchHolder);

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

    /*
    this.beginPath();
    this.moveTo(this.pot.x, this.pot.y);
    this.lineTo(this.pot.x + this.pot.w, this.pot.y);
    this.lineTo(this.pot.x + this.pot.w, this.pot.y);

    this.fillPath();
    this.strokePath();
    */

    this.fillRect(this.pot.x, this.pot.y, this.pot.w, 20);
    this.strokeRect(this.pot.x, this.pot.y, this.pot.w, 20);
    this.fillRect(this.pot.x + 10, this.pot.y + 20, this.pot.w - 20, 20);
    this.strokeRect(this.pot.x + 10, this.pot.y + 20, this.pot.w - 20, 20);
    this.fillRect(this.pot.x + 20, this.pot.y + 40, this.pot.w - 40, this.pot.h - 40);
    this.strokeRect(this.pot.x + 20, this.pot.y + 40, this.pot.w - 40, this.pot.h - 40);

    //console.log(JSON.stringify(this.branchHolder));
  }

  renderBranch(mainBranch) {
    this.beginPath();

    let total = mainBranch.length * 2 - 1;
    let getter = 'a';
    let dir = 1;
    let isLast = false;
    this.moveTo(mainBranch[0].a.x, mainBranch[0].a.y);
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

  getNearestSegment(x, y, radius) {
    const branches = this.getAllBranchArrays();

    const near = branches.reduce((min, branch) => {
      const segment = branch.reduce((min, segment, i) => {
        const distance = Phaser.Math.Distance.Between(segment.x, segment.y, x, y);
        if (distance < min.distance) {
          min.distance = distance;
          min.segment = segment;
          min.index = i;
        }
        return min;
      }, {distance: Infinity, segment: null, index: -1});
      if (segment.distance < min.distance) {
        min.distance = segment.distance;
        min.branch = branch;
        min.index = segment.index;
      }
      return min;
    }, {distance: Infinity, branch: null, index: -1});

    if (near.distance < radius) {
      return near;
    }
  }

  getNearestSegmentSide(x, y, radius) {
    const branches = this.getAllBranchArrays();

    const near = branches.reduce((min, branch) => {
      const segment = branch.reduce((min, segment, i) => {
        const aDistance = Phaser.Math.Distance.Between(segment.a.x, segment.a.y, x, y);
        const bDistance = Phaser.Math.Distance.Between(segment.b.x, segment.b.y, x, y);
        const distance = Math.min(aDistance, bDistance);

        const sub = aDistance < bDistance ? 'a' : 'b';

        if (distance < min.distance) {
          min.distance = distance;
          min.segment = segment;
          min.index = i;
          min.sub = sub;
        }
        return min;
      }, {distance: Infinity, segment: null, index: -1, sub: ''});
      if (segment.distance < min.distance) {
        min.distance = segment.distance;
        min.branch = branch;
        min.index = segment.index;
        min.sub = segment.sub;
      }
      return min;
    }, {distance: Infinity, branch: null, index: -1, sub: ''});

    if (near.distance < radius) {
      return near;
    }
  }

  getNearest(x, y, radius) {
    const near = this.branchHolder.reduce((min, branch, i) => {
      const aDistance = Phaser.Math.Distance.Between(branch.a.x, branch.a.y, x, y);
      const bDistance = Phaser.Math.Distance.Between(branch.b.x, branch.b.y, x, y);
      const distance = Math.min(aDistance, bDistance);

      const sub = aDistance < bDistance ? 'a' : 'b';

      if (distance < min.distance) {
        min.distance = distance;
        min.i = i;
        min.sub = sub;
      }
      return min;
    }, {distance: Infinity, i: -1, sub: ''});

    if (radius && near.distance > radius) {
      return null;
    }

    return near;
  }

  prune(x, y) {
    const radius = 20;

    const near = this.getNearestSegment(x, y, radius);

    if (near) {
      const branch = new Branch(this.scene,
        near.branch[near.index].x + this.x,
        near.branch[near.index].y + this.y,
        Phaser.Utils.Objects.DeepCopy(near.branch.slice(near.index))
      );

      this.scene.add.existing(branch);
      branch.body.velocity.y = -70;
      branch.body.velocity.x = Math.random() * 80 - 40;
      branch.body.angularVelocity = Math.random() * 200 - 100;

      for (let i = near.index - 1; i < near.branch.length; i++) {
        near.branch.pop();
      }

      near.branch[near.branch.length - 1].cut = true;

      this.updateBranches();

      return branch;
    }
  }

  addSubBranch(branch, sub, index,  x, y) {
    let segment = branch[index];

    let newPoint = new Phaser.Math.Vector2(x - segment[sub].x, y - segment[sub].y);
    newPoint.normalize();
    newPoint.scale(10);

    segment['sub' + sub] = [{
      x: segment.x,
      y: segment.y,
      w: 10
    }, {
      x: segment[sub].x,
      y: segment[sub].y,
      w: 10
    }, {
      x: segment[sub].x + newPoint.x,
      y: segment[sub].y + newPoint.y,
      w: 10
    }];

    this.updateBranches();
  }

  getLastBranch() {
    return this.branchHolder[this.branchHolder.length - 1];
  }

  getNormal(x1, y1, x2, y2) {
    let normal = new Phaser.Math.Vector2(x1 - x2, y1 - y2);
    normal.normalize();
    return normal;
  }

  getPerpendicular(x1, y1, x2, y2) {
    let perpendicular = this.getNormal(x1, y1, x2, y2);
    perpendicular.normalizeLeftHand();
    return perpendicular;
  }

  disableBloom() {
  }
  enableBloom() {
  }
}
