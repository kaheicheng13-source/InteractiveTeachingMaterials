//  Quiz data (students can edit/add questions)
const QUESTIONS = [
  {
    id: "q1",
    prompt: "Ideal date vibe?",
    options: [
      { text: "Cozy movie night", points: 2 },
      { text: "Fancy dinner", points: 3 },
      { text: "Arcade / games", points: 1 },
      { text: "Outdoor adventure", points: 0 }
    ]
  },
  {
    id: "q2",
    prompt: "Pick a sweet treat:",
    options: [
      { text: "Chocolate", points: 3 },
      { text: "Gummies", points: 1 },
      { text: "Cookies", points: 2 },
      { text: "Fruit", points: 0 }
    ]
  },
  {
    id: "q3",
    prompt: "Communication style?",
    options: [
      { text: "Lots of texting", points: 2 },
      { text: "Memes only 😄", points: 1 },
      { text: "Face-to-face", points: 3 },
      { text: "Carrier pigeon", points: 0 }
    ]
  },
  {
    id: "q4",
    prompt: "Choose a playlist:",
    options: [
      { text: "Romantic pop", points: 3 },
      { text: "Lo-fi chill", points: 2 },
      { text: "Throwback hits", points: 1 },
      { text: "Nature sounds", points: 0 }
    ]
  },
  
  {
    id: "q5",
    prompt: "What color would you like to wear?:",
    options: [
      { text: "Pink", points: 3 },
      { text: "Red", points: 2 },
      { text: "Blue", points: 1 },
      { text: "Green", points: 0 }
    ]
  },
    {
    id: "q6",
    prompt: "What outfit would you like to wear?",
    options: [
      { text: "Hoodies", points: 1 },
      { text: "Streetwear", points: 2 },
      { text: "Formal Dressing", points: 3 },
      { text: "PJs", points: 0 }
    ]
  }
];

// Result buckets (score ranges) 
function getResult(score, maxScore) {
  const pct = score / maxScore;

  if (pct >= 0.85) {
    return {
      title: "Cosmic Soulmates",
      message: "Your vibes align like perfectly synced playlists."
    };
  }
  if (pct >= 0.65) {
    return {
      title: "Perfect Partners-in-Crime",
      message: "A strong match—fun, balanced, and full of good energy."
    };
  }
  if (pct >= 0.45) {
    return {
      title: "Slow-Burn Sweethearts",
      message: "Not instant fireworks, but real potential with time."
    };
  }
  return {
    title: "Chaotic Cute Combo",
    message: "Different styles—could be hilarious and surprising!"
  };
}

// DOM rendering 
const questionsEl = document.getElementById("questions");
const quizForm = document.getElementById("quizForm");
const resultEl = document.getElementById("result");
const savedEl = document.getElementById("saved");
const nameEl = document.getElementById("name");
const resetBtn = document.getElementById("resetBtn");

function renderQuiz() {
  questionsEl.innerHTML = "";

  QUESTIONS.forEach((q, index) => {
    const wrapper = document.createElement("div");
    wrapper.className = "question";

    const title = document.createElement("h3");
    title.textContent = `${index + 1}. ${q.prompt}`;
    wrapper.appendChild(title);

    const options = document.createElement("div");
    options.className = "options";

    q.options.forEach((opt, i) => {
      const label = document.createElement("label");
      label.className = "option";

      const radio = document.createElement("input");
      radio.type = "radio";
      radio.name = q.id;
      radio.value = opt.points;
      radio.required = true;

      const span = document.createElement("span");
      span.textContent = opt.text;

      label.appendChild(radio);
      label.appendChild(span);
      options.appendChild(label);
    });

    wrapper.appendChild(options);
    questionsEl.appendChild(wrapper);
  });
}

// Submit handling
quizForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = nameEl.value.trim() || "Friend";

  let score = 0;
  let maxScore = 0;

  QUESTIONS.forEach((q) => {
    // maxScore = sum of the highest option points per question
    const qMax = Math.max(...q.options.map(o => o.points));
    maxScore += qMax;

    const selected = quizForm.querySelector(`input[name="${q.id}"]:checked`);
    score += Number(selected.value);
  });

  const res = getResult(score, maxScore);

  resultEl.innerHTML = `
    <h3>${res.title}</h3>
    <p><strong>${name}</strong>, your score is <strong>${score}</strong> out of <strong>${maxScore}</strong>.</p>
    <p>${res.message}</p>
  `;

  // Save last result (localStorage)
  const payload = { name, score, maxScore, title: res.title, when: new Date().toISOString() };
  localStorage.setItem("valentineQuizLast", JSON.stringify(payload));
  savedEl.textContent = "Saved your result in localStorage";
});

resetBtn.addEventListener("click", () => {
  quizForm.reset();
  resultEl.textContent = "";
  savedEl.textContent = "";
  nameEl.value = "";
});

// Load previous result (optional)
(function loadSaved() {
  renderQuiz();

  const raw = localStorage.getItem("valentineQuizLast");
  if (!raw) return;

  try {
    const last = JSON.parse(raw);
    savedEl.textContent = `Last saved: ${last.name} — ${last.title} (${last.score}/${last.maxScore})`;
  } catch {
    // ignore
  }
})();
