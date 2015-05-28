var Bounds = require('./bounds.js');
var MAX_ITEMS = 4;
module.exports = TreeNode;

function TreeNode(bounds) {
  this.bounds = bounds;
  this.nw = null;
  this.ne = null;
  this.sw = null;
  this.se = null;
  this.items = null;
}

TreeNode.prototype.subdivide = function subdivide() {
  var bounds = this.bounds;
  var quarter = bounds.half/2;

  this.nw = new TreeNode(new Bounds(bounds.x - quarter, bounds.y - quarter, quarter));
  this.ne = new TreeNode(new Bounds(bounds.x + quarter, bounds.y - quarter, quarter));
  this.sw = new TreeNode(new Bounds(bounds.x - quarter, bounds.y + quarter, quarter));
  this.se = new TreeNode(new Bounds(bounds.x + quarter, bounds.y + quarter, quarter));
};

TreeNode.prototype.insert = function insert(idx, array) {
  var isLeaf = this.nw === null;
  if (isLeaf) {
    // todo: this memory could be recycled to avoid gc
    if (this.items === null) {
      this.items = [idx];
    } else {
      this.items.push(idx);
    }
    if (this.items.length >= MAX_ITEMS) {
      this.subdivide();
      for (var i = 0; i < this.items.length; ++i) {
        this.insert(this.items[i], array);
      }
      this.items.length = 0;
    }
  } else {
    var x = array[idx], y = array[idx + 1];
    var bounds = this.bounds;
    var quadIdx = 0; // assume NW
    if (x > bounds.x) {
      quadIdx += 1; // nope, we are in E part
    }
    if (y > bounds.y) {
      quadIdx += 2; // Somewhere south.
    }

    var child = getChild(this, quadIdx);
    child.insert(idx, array);
  }
};

function getChild(node, idx) {
  if (idx === 0) return node.nw;
  if (idx === 1) return node.ne;
  if (idx === 2) return node.sw;
  if (idx === 3) return node.se;
}