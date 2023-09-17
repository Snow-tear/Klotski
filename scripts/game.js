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
  sprite.x = i * 方块边长;
  sprite.y = j * 方块边长;
  sprite.width = nb_i * 方块边长;
  sprite.height = nb_j * 方块边长;
  // sprite.anchor.set(0.5);

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
      
  console.log(displacement)
  console.log(event.movement)
      if (!dragTarget.orientation.x && !dragTarget.orientation.y) {
        if (Math.abs(displacement.x) > Math.abs(displacement.y)) {
          dragTarget.orientation.x = Math.sign(displacement.x);
        } else {
          dragTarget.orientation.y = Math.sign(displacement.y);
        }
      } else {
        if (dragTarget.orientation.x) {
          x = dragTarget.x_ + displacement.x;
          y = dragTarget.y_;
        } else {
          x = dragTarget.x_;
          y = dragTarget.y_ + displacement.y;
        }
        dragTarget.parent.toLocal(
          new PIXI.Point(x, y),
          null,
          dragTarget.position
        );
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
    dragTarget.x = Math.round(dragTarget.x / 方块边长) * 方块边长;
    dragTarget.y = Math.round(dragTarget.y / 方块边长) * 方块边长;
    dragTarget.x = dragTarget.x < 0 ? 0 : dragTarget.x;
    dragTarget.y = dragTarget.y < 0 ? 0 : dragTarget.y;
    dragTarget.orientation = new PIXI.Point(0);
    dragStartPoint = null;
    dragTarget = null;
  }
}

fetch("scripts/角色.json")
  .then(response => response.json())
  .then(json => {
    for (const 角色名 in json) {
      角色 = json[角色名];
      创建角色(角色.nb_i, 角色.nb_j, 角色.i, 角色.j, 角色.image_path);
    }
  });
