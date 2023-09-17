const [nb_i, nb_j] = [4, 5];

const 方块边长 = 100;

const width = nb_i * 方块边长;
const height = nb_j * 方块边长;

const app = new PIXI.Application({
  background: "#CFCFCF",
  width: width,
  height: height,
});
document.body.appendChild(app.view);

function 创建角色({ nb_i, nb_j, i, j, image_path }) {
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

app.stage.eventMode = "static";
app.stage.hitArea = app.screen;
app.stage.on("pointerup", onDragEnd);
app.stage.on("pointerupoutside", onDragEnd);

function allowDragTo(x, y) {
  if (
    dragTarget.x < 0 ||
    dragTarget.y < 0 ||
    dragTarget.x > width - dragTarget.width ||
    dragTarget.y > height - dragTarget.height
  ) {
    console.log("碰壁了");
    return false;
  }
  for (const 角色 in sprites) {
    if (
      sprites[角色] !== dragTarget &&
      dragTarget.x > sprites[角色].x - dragTarget.width &&
      dragTarget.x < sprites[角色].x + sprites[角色].width &&
      dragTarget.y > sprites[角色].y - dragTarget.height &&
      dragTarget.y < sprites[角色].y + sprites[角色].height
    ) {
      console.log("撞人了");
      return false;
    }
  }
  return true;
}

let lastDragPoint = null;
function onDragMove(event) {
  if (!lastDragPoint) lastDragPoint = event.global.clone();

  let del_x = event.global.x - lastDragPoint.x;
  let del_y = event.global.y - lastDragPoint.y;
  lastDragPoint = event.global.clone();

  if (dragTarget.orientation.equals(new PIXI.Point())) {
    if (Math.abs(del_x) > Math.abs(del_y)) {
      dragTarget.orientation.x = Math.sign(del_x);
    } else {
      dragTarget.orientation.y = Math.sign(del_y);
    }
  } else {
    if (Math.abs(del_x) > 方块边长 / 2)
      del_x = (方块边长 / 2 - 1) * Math.sign(del_x);
    if (Math.abs(del_y) > 方块边长 / 2)
      del_y = (方块边长 / 2 - 1) * Math.sign(del_y);
    if (dragTarget.orientation.x) {
      x = dragTarget.x + del_x;
      y = dragTarget.y;
    } else {
      x = dragTarget.x;
      y = dragTarget.y + del_y;
    }

    if (allowDragTo(x, y)) {
      console.log("允许拖拽到", x, y);
      dragTarget.parent.toLocal(
        new PIXI.Point(x, y),
        null,
        dragTarget.position
      );
    } else {
      onDragEnd();
    }
  }
}

function onDragStart() {
  // store a reference to the data
  // the reason for this is because of multitouch
  // we want to track the movement of this particular touch
  // this.data = event.data;
  if (!dragTarget) {
    this.alpha = 0.5;
    dragTarget = this;
    lastDragPoint = null;
    app.stage.on("pointermove", onDragMove);
  }
}

function onDragEnd() {
  if (dragTarget) {
    app.stage.off("pointermove", onDragMove);
    dragTarget.alpha = 1;
    dragTarget.x = Math.round(dragTarget.x / 方块边长) * 方块边长;
    dragTarget.y = Math.round(dragTarget.y / 方块边长) * 方块边长;
    if (sprites.曹操.x == 1 * 方块边长 && sprites.曹操.y == 3 * 方块边长) {
      alert("你赢了！");
    }
    dragTarget.orientation = new PIXI.Point(0);
    dragStartPoint = null;
    dragTarget = null;
  }
}

sprites = {};
fetch("scripts/角色.json")
  .then(response => response.json())
  .then(json => {
    for (const 角色 in json) {
      sprites[角色] = 创建角色(json[角色]);
    }
  });
