const foods = [
  'ข้าวผัด', 'กะเพราไก่ไข่ดาว', 'ข้าวมันไก่', 'ส้มตำ', 'ไก่ทอด',
  'หมูกระเทียม', 'ผัดไทย', 'ข้าวหน้าเป็ด', 'ข้าวต้มหมู', 'เกี๊ยวซ่า'
];

const canvas = document.getElementById("wheelCanvas");
const ctx = canvas.getContext("2d");
const spinButton = document.getElementById("spinButton");
const popup = document.getElementById("popup");
const resultText = document.getElementById("resultText");
const closeButton = document.getElementById("closeButton");
const tickSound = document.getElementById("tickSound");

const wheelRadius = canvas.width / 2;
const numSegments = foods.length;
const anglePerSegment = (2 * Math.PI) / numSegments;
let rotation = 0;
let spinning = false;

function drawWheel() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < numSegments; i++) {
    const angle = i * anglePerSegment + rotation;
    ctx.beginPath();
    ctx.moveTo(wheelRadius, wheelRadius);
    ctx.arc(wheelRadius, wheelRadius, wheelRadius, angle, angle + anglePerSegment);
    ctx.fillStyle = i % 2 === 0 ? "#f39c12" : "#e74c3c";
    ctx.fill();
    ctx.save();
    ctx.translate(wheelRadius, wheelRadius);
    ctx.rotate(angle + anglePerSegment / 2);
    ctx.textAlign = "right";
    ctx.fillStyle = "#fff";
    ctx.font = "16px Segoe UI";
    ctx.fillText(foods[i], wheelRadius - 10, 10);
    ctx.restore();
  }

  ctx.beginPath();
  ctx.moveTo(wheelRadius - 10, 10);
  ctx.lineTo(wheelRadius + 10, 10);
  ctx.lineTo(wheelRadius, 40);
  ctx.fillStyle = "#000";
  ctx.fill();
}

function spin() {
  if (spinning) return;
  spinning = true;

  const spins = Math.random() * 3 + 5;
  const targetRotation = rotation + spins * 2 * Math.PI;
  const duration = 3000;
  const start = performance.now();

  function animate(time) {
    const elapsed = time - start;
    const progress = Math.min(elapsed / duration, 1);
    rotation = rotation + (targetRotation - rotation) * easeOutCubic(progress);
    drawWheel();
    tickSound.play();

    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      spinning = false;
      showResult();
    }
  }

  requestAnimationFrame(animate);
}

function easeOutCubic(x) {
  return 1 - Math.pow(1 - x, 3);
}

function showResult() {
  const normalizedRotation = (2 * Math.PI - (rotation % (2 * Math.PI))) % (2 * Math.PI);
  const selectedIndex = Math.floor(normalizedRotation / anglePerSegment);
  const selectedFood = foods[selectedIndex % numSegments];
  resultText.textContent = `ลองกิน ${selectedFood} ไหม?`;

  confetti({
    particleCount: 150,
    spread: 100,
    origin: { y: 0.6 },
  });

  popup.classList.add("show");
}

function closePopup() {
  popup.classList.remove("show");
}

spinButton.addEventListener("click", spin);
closeButton.addEventListener("click", closePopup);
drawWheel();
