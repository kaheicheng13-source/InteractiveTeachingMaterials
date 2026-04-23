const PETAL_COUNT = 13;
const LOVE_TEXT = ["you love me", "you love me not"];

const COMPLIMENTS = {
  lover: [
    "Your smile brighten my world.",
    "You make ordinary days magical.",
    "Your kindness sings in my heart.",
    "I love how you listen with patience and caring.",
    "You’re my calm and stable.",
    "You are extraordinarily stunning inside and out.",
    "With you, everything feels possible.",
    "Your are sunbeam that brings warmth.",
    "You make me feel deeply recognised.",
    "You make my life complete.",
    "You inspire the best in me.",
    "I’m grateful for you every day.",
    "I will always choose you."
  ],
  family: [
    "You’re the heart of our home.",
    "Your love holds us strong and tight.",
    "You make everyone feel loved and cared.",
    "Your faith means the world.",
    "You’re strong, supportive and loving.",
    "Your every smile makes me feel comforting.",
    "Your generosity is beautiful.",
    "You always show up with unconditional love.",
    "You bring warmth wherever you go.",
    "You’re my hero.",
    "Your patience is a gift.",
    "You make hard days easier.",
    "We’re lucky to have you."
  ]
};

const ACTIVE_SET = "lover";

const flower = document.getElementById("flower");
const statusText = document.getElementById("statusText");
const statusPillText = document.getElementById("statusPillText");
const bubblesLayer = document.getElementById("bubbles");
const flowerWrap = document.getElementById("flowerWrap");
const finalHeart = document.getElementById("finalHeart");
const bgAudio = document.getElementById("bgAudio");

let clickCount = 0;
let clickedPetals = new Set();
let statusShown = false;
let audioStarted = false;

statusPillText.textContent = "";
statusText.classList.add("is-hidden");

function clamp(n, min, max){ return Math.max(min, Math.min(max, n)); }

function tryStartAudio(){
  if (audioStarted || !bgAudio) return;
  audioStarted = true;
  bgAudio.volume = 0.6;
  const p = bgAudio.play();
  if (p && typeof p.catch === "function") {
    p.catch(() => { audioStarted = false; });
  }
}

function createPetals(){
  flower.innerHTML = "";

  const step = 360 / PETAL_COUNT;
  const wrapPx = flowerWrap.getBoundingClientRect().width || 560;
  const radius = Math.floor(wrapPx * 0.30);

  for (let i = 0; i < PETAL_COUNT; i++){
    const petal = document.createElement("button");
    petal.type = "button";
    petal.className = "petal is-alive";
    petal.setAttribute("aria-label", `Petal ${i+1}`);

    const angle = i * step;
    const wobble = (Math.random() * 4 - 2);
    const a = angle + wobble;
    const tilt = (Math.random() * 10 - 5);

    petal.style.setProperty("--a", `${a}deg`);
    petal.style.setProperty("--tilt", `${tilt}deg`);
    petal.style.setProperty("--radius", `${radius}px`);
    petal.style.setProperty("--d", `${(i * 0.06).toFixed(2)}s`);

    petal.style.transform =
      `translate(-50%,-50%) rotate(${a}deg) translateY(${-radius}px) rotate(${tilt}deg)`;

    petal.dataset.a = a.toString();
    petal.dataset.tilt = tilt.toString();

    petal.addEventListener("click", () => onPetalClick(petal, i));
    flower.appendChild(petal);
  }
}

function onPetalClick(petal, index){
  if (petal.classList.contains("is-clicked")) return;

  tryStartAudio();

  if (!statusShown){
    statusShown = true;
    statusText.classList.remove("is-hidden");
  }

  clickCount += 1;
  statusPillText.textContent = LOVE_TEXT[(clickCount - 1) % 2];

  petal.classList.add("is-clicked");
  petal.classList.remove("is-alive");
  petal.disabled = true;

  clickedPetals.add(index);

  // Bubbles first
  burstBubblesFromCenter();

  // Then compliment appears
  const COMPLIMENT_DELAY_MS = 260;
  window.setTimeout(() => {
    addComplimentLabel(petal, index);

    // If this was the last petal, wait 2 seconds AFTER label appears
    if (clickedPetals.size === PETAL_COUNT){
      finishSequenceAfterLastCompliment();
    }
  }, COMPLIMENT_DELAY_MS);
}

function burstBubblesFromCenter(){
  const wrapRect = flowerWrap.getBoundingClientRect();
  const centerX = wrapRect.width / 2;
  const centerY = wrapRect.height / 2;

  const count = 120;
  const maxR = Math.min(wrapRect.width, wrapRect.height) * 1.10;

  for (let i = 0; i < count; i++){
    const bubble = document.createElement("div");
    bubble.className = "bubble";

    bubble.style.left = `${centerX}px`;
    bubble.style.top = `${centerY}px`;

    const theta = Math.random() * Math.PI * 2;
    const r = (Math.random() ** 0.28) * maxR;

    const dx = Math.cos(theta) * r;
    const dy = Math.sin(theta) * r;

    bubble.style.setProperty("--dx", `${dx.toFixed(1)}px`);
    bubble.style.setProperty("--dy", `${dy.toFixed(1)}px`);

    // Flow with gentle upward bias
    const upwardBias = 10 + Math.random() * 26;

    const flowR = 28 + Math.random() * 70;
    const flowTheta = theta + (Math.random() * 1.6 - 0.8);
    const fx = Math.cos(flowTheta) * flowR;
    const fy = Math.sin(flowTheta) * flowR - upwardBias;

    const flowR2 = 40 + Math.random() * 90;
    const flowTheta2 = flowTheta + (Math.random() * 1.8 - 0.9);
    const fx2 = Math.cos(flowTheta2) * flowR2;
    const fy2 = Math.sin(flowTheta2) * flowR2 - (upwardBias * 1.3);

    bubble.style.setProperty("--fx", `${fx.toFixed(1)}px`);
    bubble.style.setProperty("--fy", `${fy.toFixed(1)}px`);
    bubble.style.setProperty("--fx2", `${fx2.toFixed(1)}px`);
    bubble.style.setProperty("--fy2", `${fy2.toFixed(1)}px`);

    const size = clamp(6 + Math.random() * 22, 6, 26);
    bubble.style.width = `${size}px`;

    const popDur = 2200 + Math.random() * 900;     // was ~850–1270
    const driftDur = 4200 + Math.random() * 2200;  // was ~1800–3200
    const driftDelay = 700 + Math.random() * 600;  // was ~140–360

    bubble.style.setProperty("--popDur", `${Math.round(popDur)}ms`);
    bubble.style.setProperty("--driftDur", `${Math.round(driftDur)}ms`);
    bubble.style.setProperty("--driftDelay", `${Math.round(driftDelay)}ms`);

    bubblesLayer.appendChild(bubble);

    const totalLife = popDur + driftDelay + driftDur + 200;
    window.setTimeout(() => bubble.remove(), totalLife);
  }
}

function addComplimentLabel(petal, index){
  const existing = petal.querySelector(".petal-label");
  if (existing) return;

  const list = COMPLIMENTS[ACTIVE_SET];
  const text = list[index] ?? "You are loved.";

  const a = parseFloat(petal.dataset.a || "0");
  const tilt = parseFloat(petal.dataset.tilt || "0");
  const counter = -(a + tilt);

  const label = document.createElement("div");
  label.className = "petal-label";
  label.textContent = text;
  label.style.setProperty("--labelCounter", `${counter}deg`);

  petal.appendChild(label);
}

// Wait 2 seconds after the LAST compliment appears, then fade flower, then show heart
function finishSequenceAfterLastCompliment(){
  statusPillText.textContent = "you love me";

  const LAST_COMPLIMENT_PAUSE_MS = 2000; // requested
  const VANISH_MS = 720;                // matches CSS vanish timing

  window.setTimeout(() => {
    flowerWrap.classList.add("is-finished");

    window.setTimeout(() => {
      flowerWrap.style.display = "none";
      finalHeart.classList.add("is-show");
      finalHeart.setAttribute("aria-hidden", "false");
    }, VANISH_MS);

  }, LAST_COMPLIMENT_PAUSE_MS);
}

window.addEventListener("load", createPetals);
window.addEventListener("resize", () => {
  if (clickedPetals.size === PETAL_COUNT) return;
  createPetals();
});
