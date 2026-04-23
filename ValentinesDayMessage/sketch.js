const heartBtn = document.getElementById("heartBtn");
const heartText = document.getElementById("heartText");
const nameSlot = document.getElementById("nameSlot");
const bgm = document.getElementById("bgm");

let clicked = false;

// Optional prompt for name (delete if you want to keep [name])
// (() => {
//   const name = prompt("Name to show in the heart (optional):")?.trim();
//   if (name) nameSlot.textContent = name;
// })();

heartBtn.addEventListener("click", async () => {
  // Start music on first user interaction (browser autoplay rules)
  try {
    if (bgm && bgm.paused) {
      bgm.volume = 0.7;
      await bgm.play();
    }
  } catch (e) {
    // If it fails, user can click again; many browsers require interaction.
  }

  if (clicked) return; // remove this line if you want re-trigger bursts
  clicked = true;

 
  heartBtn.classList.remove("pulse");
  void heartBtn.offsetWidth;
  heartBtn.classList.add("pulse");

 
  burst({
    count: 120,       // increase bubble amount
    spread: 520,      // how far bubbles travel
    durationMin: 1800, // ms
    durationMax: 2800  // ms
  });

  // Change text
  setTimeout(() => {
    heartText.textContent = "I love you, Honey! You have my support!";
  }, 180);
});

function burst({ count, spread, durationMin, durationMax }) {
  const r = heartBtn.getBoundingClientRect();
  const cx = r.left + r.width / 2;
  const cy = r.top + r.height / 2;

  for (let i = 0; i < count; i++) {
    const b = document.createElement("span");
    b.className = "bubble";

    // size variety
    const size = rand(10, 28);
    b.style.setProperty("--s", `${size}px`);

    // farther spread: random direction and distance (biased outward)
    const angle = Math.random() * Math.PI * 2;
    const distance = spread * (0.35 + Math.random() * 0.65); // 35%..100%
    const dx = Math.cos(angle) * distance;
    const dy = Math.sin(angle) * distance;

    b.style.setProperty("--dx", `${dx}px`);
    b.style.setProperty("--dy", `${dy}px`);

    // staggered start
    const dur = rand(durationMin, durationMax);
    b.style.setProperty("--dur", `${dur}ms`);
    b.style.animationDelay = `${rand(0, 250)}ms`;

    // spawn at heart center
    b.style.left = `${cx}px`;
    b.style.top = `${cy}px`;

    document.body.appendChild(b);
    b.addEventListener("animationend", () => b.remove());
  }
}

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
