let canvas = document.getElementById("背景");
let ctx = canvas.getContext("2d");
let bg_width, bg_height;

let loaded_img_nb = 0;
let bg_imgs = [];

function 加载图片并绘制背景() {
  for (path of [
    "images/曹操.svg",
    "images/关羽.svg",
    "images/张飞.svg",
    "images/赵云.svg",
    "images/马超.svg",
    "images/黄忠.svg",
    "images/兵.svg",
  ]) {
    let img = new Image();
    img.src = path;
    bg_imgs.push(img);
    img.onload = () => {
      loaded_img_nb++;
      if (loaded_img_nb === 7) 绘制背景();
    };
  }
}
function 绘制背景() {
  if (loaded_img_nb === 7) {
    bg_width = canvas.width = document.body.clientWidth;
    bg_height = canvas.height = document.body.clientHeight;
    let 背景方块数 = Math.floor((bg_width * bg_height) / 8000);

    添加背景方块(背景方块数);
  }
}

function 添加背景方块(背景方块数) {
  if (背景方块数) {
    ctx.save();

    const [x, y] = [bg_width * Math.random(), bg_height * Math.random()];
    ctx.globalAlpha = Math.random() * 0.7;
    ctx.translate(x, y);
    ctx.rotate(Math.PI * Math.random());
    const k = Math.random() * 0.5;
    const img = bg_imgs[Math.floor(Math.random() * 7)];
    ctx.drawImage(img, 0, 0, img.width * k, img.height * k);

    ctx.restore();
    背景方块数--;
    添加背景方块(背景方块数);
  }
}

window.onload = 加载图片并绘制背景;
window.onresize = 绘制背景;
