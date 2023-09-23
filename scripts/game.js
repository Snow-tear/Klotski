const [nb_i, nb_j] = [4, 5];

let 关卡;

let 赢了;

const 方块边长 = 500;

const width = nb_i * 方块边长;
const height = nb_j * 方块边长;

const tolerance = 5; //自动吸附长度（为了实现转角）

let lastDragPoint = null;

const 昵称默认词 = "name used on score board";

const app = new PIXI.Application({
  background: "#CFCFCF",
  width: width,
  height: height,
});
document.getElementById("game").appendChild(app.view);

let time;
let timer;

let step;

function 创建角色(角色们, { i, j, 角色 }) {
  const sprite = PIXI.Sprite.from("images/" + 角色 + ".svg");

  sprite.nb_i = 角色们[角色].nb_i;
  sprite.nb_j = 角色们[角色].nb_j;

  sprite.x = sprite.x_ = i * 方块边长;
  sprite.y = sprite.y_ = j * 方块边长;
  sprite.width = sprite.nb_i * 方块边长;
  sprite.height = sprite.nb_j * 方块边长;
  // sprite.anchor.set(0.5);

  sprite.canAutoGrid = false; //在行进过程中是否允许微量自动对齐（为了转角）

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

function nearestGridPosition(x) {
  return Math.round(x / 方块边长) * 方块边长;
}

function autoGrid(x) {
  if (
    dragTarget.canAutoGrid &&
    Math.abs(nearestGridPosition(x) - x) <= tolerance &&
    x !== nearestGridPosition(x)
  ) {
    dragTarget.canAutoGrid = false;
    return nearestGridPosition(x);
  }
  return x;
}

function restrict(del_x) {
  if (Math.abs(del_x) > 方块边长 / 2)
    return (方块边长 / 2 - 1) * Math.sign(del_x);
  return del_x;
}

function onDragMove(event) {
  if (!lastDragPoint) lastDragPoint = event.global.clone();

  let del_x = event.global.x - lastDragPoint.x;
  let del_y = event.global.y - lastDragPoint.y;
  lastDragPoint = event.global.clone();

  del_x = restrict(del_x);
  del_y = restrict(del_y);

  let x = dragTarget.x + del_x;
  let y = dragTarget.y + del_y;

  if (
    !dragTarget.canAutoGrid &&
    (Math.abs(nearestGridPosition(x) - x) > tolerance ||
      Math.abs(nearestGridPosition(y) - y) > tolerance)
  )
    dragTarget.canAutoGrid = true;

  if (allowDragTo(x, dragTarget.y)) dragTarget.x = autoGrid(x);
  if (allowDragTo(dragTarget.x, y)) dragTarget.y = autoGrid(y);
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

    dragTarget.x = nearestGridPosition(dragTarget.x);
    dragTarget.y = nearestGridPosition(dragTarget.y);

    if (dragTarget.x !== dragTarget.x_ || dragTarget.y !== dragTarget.y_) {
      document.getElementById("step").textContent = ++step;
      dragTarget.x_ = dragTarget.x;
      dragTarget.y_ = dragTarget.y;
    }

    if (
      sprites.曹操.x == 1 * 方块边长 &&
      sprites.曹操.y == 3 * 方块边长 &&
      !赢了
    ) {
      赢了 = true;
      let username = prompt(
        `你赢了！用时${time / 100}秒，${step}步。\n输入昵称来添加至排行榜`,
        昵称默认词
      );
      if (!username || username === 昵称默认词) username = "anomynous player";
      add_record(username, time / 100, step, 关卡);
      clearInterval(timer);
    }

    dragTarget.canAutoGrid = false;
    dragStartPoint = null;
    dragTarget = null;
  }
}

function chronoStart() {
  timer = setInterval(() => {
    document.getElementById("clock").textContent = (time++ / 100).toFixed(2);
  }, 10);
}

let sprites;

function startGame(关卡名) {
  关卡 = 关卡名;
  赢了 = false;
  app.stage.removeChildren();
  sprites = {};
  time = 0;
  document.getElementById("clock").textContent = time.toFixed(2);
  if (timer) clearInterval(timer);
  step = 0;
  document.getElementById("step").textContent = step;
  Promise.all([fetch("scripts/角色们.json"), fetch("scripts/关卡们.json")])
    .then(responses => Promise.all(responses.map(response => response.json())))
    .then(jsons => {
      const [角色们, 关卡们] = jsons;
      for (方块名 in 关卡们[关卡名]) {
        sprites[方块名] = 创建角色(角色们, 关卡们[关卡名][方块名]);
      }
    });
}

startGame("横刀立马");

document.querySelectorAll(".关卡 span")[0].onclick = () => {
  startGame("横刀立马");

  show_records();
};
document.querySelectorAll(".关卡 span")[1].onclick = () => {
  startGame("横竖皆将");

  show_records();
};
