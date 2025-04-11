const foods = [
  'ข้าวผัด', 'กะเพรา', 'ส้มตำ', 'ผัดไทย', 'ข้าวต้ม',
  'ข้าวมันไก่', 'ราดหน้า', 'หมูกระเทียม', 'ข้าวไข่เจียว', 'เกี๊ยวซ่า'
];

const canvas = document.getElementById("wheelCanvas");
const ctx = canvas.getContext("2d");
const tickSound = document.getElementById("tickSound");
const spinButton = document.getElementById("spinButton");

let startAngle = 0;
let arc = Math.PI * 2 / foods.length;
let spinTimeout = null;
let spinAngleStart = 0;
let spinTime = 0;
let spinTimeTotal = 0;
let spinning = false;

function drawWheel() {
  let colors = ["#fbc531", "#e84118"];
  for (let i = 0; i < foods.length; i++) {
    let angle = startAngle + i * arc;
    ctx.fillStyle = colors[i % 2];
    ctx.beginPath();
    ctx.moveTo(250, 250);
    ctx.arc(250, 250, 200, angle, angle + arc, false);
    ctx.lineTo(250, 250);
    ctx.fill();

    ctx.save();
    ctx.fillStyle = "white";
    ctx.translate(250, 250);
    ctx.rotate(angle + arc / 2);
    ctx.textAlign = "right";
    ctx.font = "16px sans-serif";
    ctx.fillText(foods[i], 190, 5);
    ctx.restore();
  }

  ctx.fillStyle = "#333";
  ctx.beginPath();
  ctx.moveTo(240, 10);
  ctx.lineTo(260, 10);
  ctx.lineTo(250, 40);
  ctx.fill();
}

function rotateWheel() {
  spinAngleStart *= 0.97;
  startAngle += spinAngleStart;

  if (spinAngleStart <= 0.002) {
    clearTimeout(spinTimeout);
    let degrees = startAngle * 180 / Math.PI + 90;
    let arcd = arc * 180 / Math.PI;
    let index = Math.floor((360 - (degrees % 360)) / arcd);
    let result = foods[index];
    showResultPopup(result);
    return;
  }

  drawWheel();
  tickSound.currentTime = 0;
  tickSound.play();

  spinTimeout = setTimeout(rotateWheel, 30);
}

function spin() {
  if (spinning) return;
  spinning = true;
  spinButton.disabled = true;
  spinAngleStart = Math.random() * 0.3 + 0.25;
  spinTime = 0;
  spinTimeTotal = Math.random() * 3000 + 4000;
  rotateWheel();
}

function showResultPopup(food) {
  document.getElementById("resultText").textContent = "ลองกิน " + food + " ไหม?";
  const popup = document.getElementById("popup");
  popup.classList.add("show");
  popup.classList.remove("hidden");
  confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
}

function closePopup() {
  const popup = document.getElementById("popup");
  popup.classList.remove("show");
  popup.classList.add("hidden");
  spinAngleStart = 0;
  spinTime = 0;
  spinTimeTotal = 0;
  startAngle = 0;
  spinning = false;
  spinButton.disabled = false;
  drawWheel();
}

drawWheel();
