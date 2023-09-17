const [nb_i, nb_j] = [4, 5];

方块边长 = 100;

const app = new PIXI.Application({
  background: "#CFCFCF",
  width: nb_i * 方块边长,
  height: nb_j * 方块边长,
});
document.body.appendChild(app.view);

function 创建角色(nb_i, nb_j, i, j, image_path) {
  const sprite = PIXI.Sprite.from(image_path);

  sprite.nb_i = nb_i;
  sprite.nb_j = nb_j;
  sprite.i = i;
  sprite.j = j;
  sprite.x = (i + nb_i / 2) * 方块边长;
  sprite.y = (j + nb_j / 2) * 方块边长;
  sprite.anchor.set(0.5);

  sprite.orientation = new PIXI.Point(0);

  sprite.eventMode = "static";
  sprite.cursor = "pointer";
  sprite.on("pointerdown", onDragStart, sprite);
  //on函数的第三个参数是thisArg，即回调函数中的this指向的对象，这里是sprite
  //TODO 查询这是怎么实现的

  app.stage.addChild(sprite);
  return sprite;
}

let dragTarget = null;
let dragStartPoint = null;

app.stage.eventMode = "static";
app.stage.hitArea = app.screen;
app.stage.on("pointerup", onDragEnd);
app.stage.on("pointerupoutside", onDragEnd);

function onDragMove(event) {
  if (dragTarget) {
    if (!dragStartPoint) {
      dragStartPoint = { x: event.global.x, y: event.global.y };
    } else {
      displacement = new PIXI.Point(
        event.global.x - dragStartPoint.x,
        event.global.y - dragStartPoint.y
      );
      if (!dragTarget.orientation.x && !dragTarget.orientation.y) {
        if (Math.abs(displacement.x) > Math.abs(displacement.y)) {
          dragTarget.orientation.x = Math.sign(displacement.x);
        } else {
          dragTarget.orientation.y = Math.sign(displacement.y);
        }
      } else {
        if (dragTarget.orientation.x) {
          event.global.y = dragTarget.y_ + displacement.y;
        } else {
          event.global.x = dragTarget.x_ + displacement.x;
        }
        dragTarget.parent.toLocal(event.global, null, dragTarget.position);
      }
    }
  }
}

function onDragStart() {
  // store a reference to the data
  // the reason for this is because of multitouch
  // we want to track the movement of this particular touch
  // this.data = event.data;
  this.alpha = 0.5;
  this.x_ = this.x;
  this.y_ = this.y;

  dragTarget = this;

  app.stage.on("pointermove", onDragMove);
}

function onDragEnd() {
  if (dragTarget) {
    app.stage.off("pointermove", onDragMove);
    dragTarget.alpha = 1;
    dragTarget.orientation = new PIXI.Point(0);
    dragStartPoint = null;
    dragTarget = null;
  }
}

const 曹操 = 创建角色(2, 2, 1, 0, "../images/曹操.png");
const 关羽 = 创建角色(2, 1, 1, 2, "../images/关羽.png");
const 张飞 = 创建角色(1, 2, 0, 0, "../images/张飞.png");
const 赵云 = 创建角色(1, 2, 0, 2, "../images/赵云.png");
const 马超 = 创建角色(1, 2, 3, 0, "../images/马超.png");
const 黄忠 = 创建角色(1, 2, 3, 2, "../images/黄忠.png");
const 兵1 = 创建角色(1, 1, 0, 4, "../images/兵.png");
const 兵2 = 创建角色(1, 1, 3, 4, "../images/兵.png");
const 兵3 = 创建角色(1, 1, 1, 3, "../images/兵.png");
const 兵4 = 创建角色(1, 1, 2, 3, "../images/兵.png");
