const foods = [
  'ข้าวผัด', 'กะเพราไก่ไข่ดาว', 'ข้าวมันไก่', 'ส้มตำ', 'ไก่ทอด',
  'หมูกระเทียม', 'ผัดไทย', 'ข้าวหน้าเป็ด', 'ข้าวต้มหมู', 'เกี๊ยวซ่า',
  'ราดหน้าหมู', 'มะหมี่เกี๊ยว', 'ข้าวไข่เจียวหมูสับ', 'ขนมจีนน้ำยา',
  'ข้าวหมูแดง', 'ข้าวหมูกรอบ', 'ซุปกิมจิ', 'ยำวุ้นเส้น', 'ข้าวคลุกกะปิ', 'มาม่าต้มยำกุ้ง'
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

  // draw pointer
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

  const spins = Math.random() * 3 + 5; // 5 ถึง 8 รอบ
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
  const selectedIndex = numSegments - Math.floor(((rotation % (2 * Math.PI)) / anglePerSegment)) - 1;
  const selectedFood = foods[selectedIndex % numSegments];
  resultText.textContent = `ลองกิน ${selectedFood} ไหม?`;

  // confetti
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

// เริ่มต้นวาด
drawWheel();
