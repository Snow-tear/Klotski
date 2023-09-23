let canvas = document.getElementById("背景");
let ctx = canvas.getContext("2d");
let bg_width, bg_height;

function 绘制背景() {
  bg_width = canvas.width = window.screen.availWidth;
  bg_height = canvas.height = window.screen.availHeight;
  let 背景方块数 = Math.floor((bg_width * bg_height) / 8000);
  console.log(背景方块数);
  添加背景方块(背景方块数);
}

function 添加背景方块(背景方块数) {
  if (背景方块数) {
    let img = new Image();
    img.src = [
      "images/曹操.svg",
      "images/关羽.svg",
      "images/张飞.svg",
      "images/赵云.svg",
      "images/马超.svg",
      "images/黄忠.svg",
      "images/兵.svg",
    ][Math.floor(Math.random() * 7)];
    img.onload = () => {
      ctx.save();

      const [x, y] = [bg_width * Math.random(), bg_height * Math.random()];
      ctx.globalAlpha = Math.random() * 0.7;
      ctx.translate(x, y);
      ctx.rotate(Math.PI * Math.random());
      const k = Math.random() * 0.5;
      ctx.drawImage(img, 0, 0, img.width * k, img.height * k);

      ctx.restore();
      背景方块数--;
      添加背景方块(背景方块数);
    };
  }
}

window.onload = 绘制背景;
window.onresize = 绘制背景;
