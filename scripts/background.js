let canvas = document.getElementById("背景");
const [bg_width, bg_height] = [
  (canvas.width = document.body.clientWidth),
  (canvas.height = document.body.clientHeight),
];
let ctx = canvas.getContext("2d");

let 背景方块数 = Math.floor((bg_width * bg_height) / 8000);
console.log(背景方块数);
添加背景方块(背景方块数);
function 添加背景方块(背景方块数) {
  if (背景方块数) {
    let img = new Image();
    img.src = [
      "images/曹操.png",
      "images/关羽.png",
      "images/张飞.png",
      "images/赵云.png",
      "images/马超.png",
      "images/黄忠.png",
      "images/兵.png",
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
