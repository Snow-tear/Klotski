let canvas = document.getElementById("背景");
const [bg_width, bg_height] = [
  (canvas.width = document.body.clientWidth),
  (canvas.height = document.body.clientHeight),
];
console.log(bg_width, bg_height);
let ctx = canvas.getContext("2d");

let img_nb = 50;
背景添加方块(img_nb);
function 背景添加方块(img_nb) {
  if (img_nb) {
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
      ctx.globalAlpha = Math.random()*0.7;
      ctx.translate(x, y);
      ctx.rotate(Math.PI * Math.random());
      const k = Math.random() * 0.5;
      ctx.drawImage(img, 0, 0, img.width * k, img.height * k);

      ctx.restore();
      img_nb--;
      背景添加方块(img_nb);
    };
  }
}
