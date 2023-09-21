const [nb_i, nb_j] = [4, 5];

const 方块边长 = 100;

const width = nb_i * 方块边长;
const height = nb_j * 方块边长;

const app = new PIXI.Application({
  background: "#CFCFCF",
  width: width,
  height: height,
});
document.getElementById("game").appendChild(app.view);

let time = 0;
let timer = null;

let step = 0;

function 创建角色({ nb_i, nb_j, i, j, image_path }) {
  const sprite = PIXI.Sprite.from(image_path);

  sprite.nb_i = nb_i;
  sprite.nb_j = nb_j;
  sprite.x = sprite.x_ = i * 方块边长;
  sprite.y = sprite.y_ = j * 方块边长;
  sprite.width = nb_i * 方块边长;
  sprite.height = nb_j * 方块边长;
  // sprite.anchor.set(0.5);

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
    x < 0 ||
    y < 0 ||
    x > width - dragTarget.width ||
    y > height - dragTarget.height
  ) {
    return false;
  }
  for (const 角色 in sprites) {
    if (
      sprites[角色] !== dragTarget &&
      x > sprites[角色].x - dragTarget.width &&
      x < sprites[角色].x + sprites[角色].width &&
      y > sprites[角色].y - dragTarget.height &&
      y < sprites[角色].y + sprites[角色].height
    ) {
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

  if (Math.abs(del_x) > 方块边长 / 2)
    del_x = (方块边长 / 2 - 1) * Math.sign(del_x);
  if (Math.abs(del_y) > 方块边长 / 2)
    del_y = (方块边长 / 2 - 1) * Math.sign(del_y);

  if (allowDragTo(dragTarget.x + del_x, dragTarget.y)) {
    dragTarget.parent.toLocal(
      new PIXI.Point(dragTarget.x + del_x, dragTarget.y),
      null,
      dragTarget.position
    );
  }
  if (allowDragTo(dragTarget.x, dragTarget.y + del_y)) {
    dragTarget.parent.toLocal(
      new PIXI.Point(dragTarget.x, dragTarget.y + del_y),
      null,
      dragTarget.position
    );
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

  if (!time) {
    chronoStart();
  }
}

function onDragEnd() {
  if (dragTarget) {
    app.stage.off("pointermove", onDragMove);
    dragTarget.alpha = 1;

    dragTarget.x = Math.round(dragTarget.x / 方块边长) * 方块边长;
    dragTarget.y = Math.round(dragTarget.y / 方块边长) * 方块边长;

    if (dragTarget.x !== dragTarget.x_ || dragTarget.y !== dragTarget.y_) {
      document.getElementById("step").textContent = ++step;
      dragTarget.x_ = dragTarget.x;
      dragTarget.y_ = dragTarget.y;
    }

    if (sprites.曹操.x == 1 * 方块边长 && sprites.曹操.y == 3 * 方块边长) {
      const username = prompt(
        `你赢了！用时${time / 100}秒，${step}步。\n输入昵称来添加至排行榜`,
        "name used on score board"
      );
      if (username) add_record(username, time / 100, step);
      clearInterval(timer);
    }

    dragStartPoint = null;
    dragTarget = null;
  }
}

function chronoStart() {
  timer = setInterval(() => {
    document.getElementById("clock").textContent = (time++ / 100).toFixed(2);
  }, 10);
}

sprites = {};
fetch("scripts/角色.json")
  .then(response => response.json())
  .then(json => {
    for (const 角色 in json) {
      sprites[角色] = 创建角色(json[角色]);
    }
  });
