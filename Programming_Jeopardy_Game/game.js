"use strict";

/* === CONFIG === */
const CSV_URL = "js_questions_console_heavy_balanced_copy.csv"; // Ensure this file is in the same folder as your HTML

/* === STYLE INJECTION (bigger fonts & pre-formatted question text) === */
(function injectStyles() {
  const css = `
    #modal .content { max-width: 720px; }
    #questionText { font-size: 1.15rem; line-height: 1.45; white-space: pre-line; }
    #choices .choice { font-size: 1.05rem; padding: 10px 12px; }
    .feedback { margin-top: 10px; font-weight: 600; }
    .feedback.ok { color: #0a7b3b; }
    .feedback.bad { color: #b00020; }
    #explanation { margin-top: 10px; font-size: 0.98rem; }
    #actionsRow { margin-top: 12px; display: none; gap: 8px; justify-content: flex-end; }
    #actionsRow button { padding: 8px 12px; font-size: 0.95rem; }
  `;
  const style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);
})();

/* === CSV LOADER === */
async function loadCSV(url) {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to fetch CSV: ${res.status}`);
  const text = await res.text();
  return parseCSV(text);
}

// Simple CSV parser that handles quotes and commas in fields
function parseCSV(str) {
  const rows = [];
  let i = 0, field = "", row = [], inQuotes = false;

  function pushField() { row.push(field); field = ""; }
  function pushRow() { rows.push(row); row = []; }

  while (i < str.length) {
    const ch = str[i];
    if (inQuotes) {
      if (ch === '"') {
        if (str[i + 1] === '"') { field += '"'; i += 2; }
        else { inQuotes = false; i++; }
      } else { field += ch; i++; }
    } else {
      if (ch === '"') { inQuotes = true; i++; }
      else if (ch === ",") { pushField(); i++; }
      else if (ch === "\n") { pushField(); pushRow(); i++; }
      else if (ch === "\r") { i++; if (str[i] === "\n") i++; pushField(); pushRow(); }
      else { field += ch; i++; }
    }
  }
  if (field.length > 0 || row.length > 0) { pushField(); pushRow(); }

  const headers = rows.shift().map(h => h.trim());
  return rows
    .filter(r => r.length && r.some(c => (c ?? "").trim() !== ""))
    .map(r => {
      const o = {};
      headers.forEach((h, idx) => { o[h] = r[idx] ?? ""; });
      return o;
    });
}

/* === Build QUESTIONS from CSV rows ===
Expected columns: id, question, A, B, C, D, correctIndex, correctLetter, category, difficulty, tip
*/
function buildQuestionsFromRows(rows) {
  return rows.map(r => {
    const answerIndex = Number(r.correctIndex);
    const choices = [r.A, r.B, r.C, r.D];
    return {
      id: Number(r.id) || 0,
      question: r.question,
      choices,
      answerIndex: Number.isFinite(answerIndex) ? answerIndex : 0,
      category: r.category || "",
      difficulty: r.difficulty || "easy",
      tip: r.tip || ""
    };
  });
}

/* === INDIVIDUALIZED EXPLANATIONS (always show) === */
function explainForQuestion(qObj, correctText) {
  const q = (qObj?.question || "").toLowerCase();
  const tip = qObj?.tip ? ` Tip: ${qObj.tip}` : "";
  const bits = [];

  // Always show the answer first
  bits.push(`Correct answer: ${correctText}.`);

  // Unique-line helper
  const seen = new Set();
  function add(line) {
    const key = line.trim().toLowerCase();
    if (!seen.has(key)) { bits.push(line); seen.add(key); }
  }

  // Function & operator detectors (extend as needed)
  const detectors = [
    // Numbers / conversion
    { test: /number\(/, msg: "`Number(x)` converts a value to a **number**; e.g., `Number('8')` → `8`." },
    { test: /parseint\(/, msg: "`parseInt(str, base)` parses an **integer** from the start of a string. With base 10, `parseInt('12px',10)` → `12`." },
    { test: /parsefloat\(/, msg: "`parseFloat(str)` parses a **floating-point** number; `parseFloat('2.5kg')` → `2.5`." },

    // Math
    { test: /math\.floor/, msg: "`Math.floor(x)` **rounds down** to the nearest integer." },
    { test: /math\.round/, msg: "`Math.round(x)` rounds to the **nearest** integer (0.5 rounds up)." },
    { test: /math\.ceil/,  msg: "`Math.ceil(x)` **rounds up** to the nearest integer." },
    { test: /math\.max/,   msg: "`Math.max(a,b,...)` returns the **largest** value." },
    { test: /math\.min/,   msg: "`Math.min(a,b,...)` returns the **smallest** value." },
    { test: /math\.sqrt/,  msg: "`Math.sqrt(x)` returns the non-negative **square root** of `x`." },

    // Strings
    { test: /\.touppercase\(\)/,  msg: "`toUpperCase()` returns a **new** uppercase string (strings are immutable)." },
    { test: /\.tolowercase\(\)/,  msg: "`toLowerCase()` returns a **new** lowercase string." },
    { test: /\.includes\(/,       msg: "On **strings**, `.includes(substr)` returns `true` if the substring occurs (case-sensitive)." },
    { test: /\.length/,           msg: "On **strings**, `.length` is the number of UTF-16 code units (ASCII ≈ characters)." },
    { test: /`\$?\{/,             msg: "Template literals use backticks and `${expr}` to embed expressions inside strings." },

    // Arrays
    { test: /\.push\(/,    msg: "`array.push(x)` **adds to the end** and returns the **new length** (mutates the array)." },
    { test: /\.pop\(/,     msg: "`array.pop()` **removes the last** element and returns it (mutates)." },
    { test: /\.shift\(/,   msg: "`array.shift()` **removes the first** element and returns it (mutates)." },
    { test: /\.unshift\(/, msg: "`array.unshift(x)` **adds to the start** and returns the **new length** (mutates)." },
    { test: /\.includes\(/, msg: "On **arrays**, `.includes(value)` returns `true` if the array contains the value." },
    { test: /\.indexof\(/, msg: "`indexOf(value)` returns the **index** (or `-1` if not found)." },
    { test: /\.slice\(/,   msg: "`slice(start,end)` returns a **copy** from `start` up to but **not including** `end` (does not mutate)." },
    { test: /\.splice\(/,  msg: "`splice(start,count,...)` **mutates** by removing/replacing items and returns the removed items." },
    { test: /\.join\(/,    msg: "`join(sep)` returns a **string** by joining the elements with `sep`." },
    { test: /\.concat\(/,  msg: "`concat(...)` returns a **new** array with appended items (original unchanged)." },
    { test: /\.map\(/,     msg: "`map(fn)` returns a **new** array by transforming each element with `fn` (non-mutating)." },
    { test: /\.filter\(/,  msg: "`filter(fn)` returns a **new** array of elements where `fn(element)` is truthy (non-mutating)." },
    { test: /\.reduce\(/,  msg: "`reduce(fn, init)` folds the array into **one value** by applying `fn(acc, item)` repeatedly." },
    { test: /\.some\(/,    msg: "`some(fn)` returns `true` if **any** element makes `fn` return truthy." },
    { test: /\.every\(/,   msg: "`every(fn)` returns `true` only if **all** elements make `fn` return truthy." },
    { test: /\.find\(/,    msg: "`find(fn)` returns the **first matching** element (or `undefined`)." },
    { test: /\.reverse\(\)/, msg: "`reverse()` **mutates** the array by reversing it in place." },

    // Logic & equality & arithmetic
    { test: /\|\|/, msg: "`a || b` returns `a` if `a` is truthy; otherwise it returns `b`." },
    { test: /&&/,   msg: "`a && b` returns `a` if `a` is falsy; otherwise it returns `b`." },
    { test: /===/,  msg: "`===` is **strict equality**: both value and type must match." },
    { test: /!==/,  msg: "`!==` is **strict not-equal**: either value or type differs." },
    { test: /%/,    msg: "`a % b` is the **remainder** of integer division." },
    { test: /\*\*/, msg: "`**` is **exponentiation** (e.g., `2 ** 3` = 8)." },
    { test: /\? *[^:]+: *[^:]+/, msg: "The **ternary** operator `cond ? x : y` returns `x` if `cond` is truthy, else `y`." },

    // Loops
    { test: /for *\(/,    msg: "`for (init; cond; step)` repeats while `cond` is true, applying `step` each time." },
    { test: /for *\(.*of.*\)/, msg: "`for (const v of iterable)` iterates **values** of arrays or strings." },
    { test: /while *\(/,  msg: "`while (cond)` repeats as long as `cond` is true." },
    { test: /\bcontinue\b/, msg: "`continue` skips the rest of the body for the current iteration." },
    { test: /\bbreak\b/,    msg: "`break` exits the nearest loop immediately." }
  ];

  detectors.forEach(d => { if (d.test.test(q)) add(d.msg); });

  // Case-specific micro-hints
  if (q.includes("console.log(") && /['"`]\s*\+\s*\d|\d\s*\+\s*['"`]/.test(q)) {
    add("If one side of `+` is a **string**, `+` does **string concatenation** (e.g., `'5' + 2` → `'52'`).");
  }
  if (q.includes("console.log(") && /\[[0-9]+\]/.test(q) && /'|"/.test(q)) {
    add("Indexing a **string** like `s[1]` returns the character at that index (0-based).");
  }
  if (q.includes(".length") && /\[[^\]]*\]/.test(q)) {
    add("On **arrays**, `.length` is the number of elements.");
  }
  if (q.includes(".map(")) add("Think of `.map` as: `newArr[i] = fn(oldArr[i])` for each element.");
  if (q.includes(".filter(")) add("Think of `.filter` as: keep items where `fn(item)` is truthy.");
  if (q.includes(".reduce(")) add("For `.reduce`, trace the accumulator step by step to the final value.");
  if (/(math\.floor|math\.round|math\.ceil)/.test(q)) {
    add("Evaluate the inner expression **first**, then apply the rounding function.");
  }
  if (/% *2/.test(q)) {
    add("`n % 2` is **0** for even numbers and **1** for odd numbers.");
  }

  if (tip) add(tip);

  return bits.join(" ");
}

/* === UTIL === */
function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function ready(fn) {
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fn);
  else fn();
}

/* === GAME === */
const TILE_COUNT = 50;
const TILE_VALUES = Array.from({ length: TILE_COUNT }, (_, i) => ((i % 5) + 1) * 10);

ready(async () => {
  const grid = document.getElementById("grid");
  const modal = document.getElementById("modal");
  const qText = document.getElementById("questionText");
  const choicesDiv = document.getElementById("choices");
  const feedbackDiv = document.getElementById("feedback");
  const solvedCountEl = document.getElementById("solvedCount");
  const poolCountEl = document.getElementById("poolCount");

  // Actions row (Exit)
  let actionsRow = document.getElementById("actionsRow");
  if (!actionsRow) {
    actionsRow = document.createElement("div");
    actionsRow.id = "actionsRow";
    const content = modal.querySelector(".content") || modal;
    content.appendChild(actionsRow);
  }
  const exitBtn = document.createElement("button");
  exitBtn.type = "button";
  exitBtn.textContent = "Exit";
  exitBtn.onclick = () => closeModal();
  actionsRow.appendChild(exitBtn);

  // Load CSV -> QUESTIONS
  let QUESTIONS = [];
  try {
    const rows = await loadCSV(CSV_URL);
    QUESTIONS = buildQuestionsFromRows(rows);
  } catch (e) {
    console.error(e);
    alert("Could not load the question CSV. Ensure it is named js_questions_console_heavy_balanced1.csv and placed next to your HTML.");
  }

  if (poolCountEl) poolCountEl.textContent = String(QUESTIONS.length || 0);

  // State
  const tileStatus = Array(TILE_COUNT).fill("unused"); // "unused" | "correct"
  const correctSet = new Set();                        // ids answered correctly
  let unused = shuffle(QUESTIONS.map(q => q.id));      // queue of fresh ids
  let incorrectPool = [];                               // ids missed at least once (and not yet solved)

  let activeTile = null;
  let activeQuestion = null;

  // Build grid
  for (let i = 0; i < TILE_COUNT; i++) {
    const div = document.createElement("button");
    div.type = "button";
    div.className = "tile";
    div.textContent = TILE_VALUES[i];
    div.setAttribute("aria-label", `Tile ${i + 1}, ${TILE_VALUES[i]} points`);
    div.onclick = () => openTile(i);
    grid.appendChild(div);
  }

  function findQuestionById(id) { return QUESTIONS.find(q => q.id === id); }

  function drawNextQuestion() {
    if (unused.length > 0) {
      const id = unused.shift();
      return findQuestionById(id);
    }
    const pool = incorrectPool.filter(id => !correctSet.has(id));
    if (pool.length > 0) {
      const id = pool[Math.floor(Math.random() * pool.length)];
      return findQuestionById(id);
    }
    // all solved: harmless fallback
    return QUESTIONS[Math.floor(Math.random() * QUESTIONS.length)];
  }

  function openTile(idx) {
    if (!QUESTIONS.length) return;
    if (tileStatus[idx] === "correct") return;
    activeTile = idx;
    activeQuestion = drawNextQuestion();

    qText.textContent = activeQuestion.question;
    feedbackDiv.textContent = "";
    setExplanation("");
    actionsRow.style.display = "none"; // only show after answering
    renderChoices(activeQuestion);
    showModal();
  }

  function renderChoices(q) {
    choicesDiv.innerHTML = "";
    q.choices.forEach((c, i) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "choice";
      btn.textContent = String.fromCharCode(65 + i) + ". " + c;
      btn.onclick = () => handleAnswer(i);
      choicesDiv.appendChild(btn);
    });
  }

  function handleAnswer(choiceIdx) {
    if (!activeQuestion) return;

    const correctIdx = activeQuestion.answerIndex;
    const correctText = activeQuestion.choices[correctIdx];
    const isCorrect = (choiceIdx === correctIdx);

    // Visual feedback
    feedbackDiv.textContent = isCorrect ? "Correct!" : "Incorrect.";
    feedbackDiv.className = "feedback " + (isCorrect ? "ok" : "bad");

    // Always show individualized explanation
    const explanation = explainForQuestion(activeQuestion, correctText);
    setExplanation(explanation);

    if (isCorrect) {
      tileStatus[activeTile] = "correct";
      correctSet.add(activeQuestion.id);
      incorrectPool = incorrectPool.filter(id => id !== activeQuestion.id);

      const tileEl = grid.children[activeTile];
      tileEl.textContent = "Correct";
      tileEl.classList.add("correct");

      solvedCountEl && (solvedCountEl.textContent = String(tileStatus.filter(s => s === "correct").length));
    } else {
      if (!incorrectPool.includes(activeQuestion.id)) incorrectPool.push(activeQuestion.id);
    }

    // Let the student close when ready
    actionsRow.style.display = "flex";
  }

  function setExplanation(text) {
    let ex = document.getElementById("explanation");
    if (!ex) {
      ex = document.createElement("div");
      ex.id = "explanation";
      const content = modal.querySelector(".content") || modal;
      content.appendChild(ex);
    }
    ex.textContent = text || "";
  }

  function showModal() { modal.style.display = "flex"; }
  function closeModal() {
    modal.style.display = "none";
    activeTile = null;
    activeQuestion = null;
    feedbackDiv.textContent = "";
    setExplanation("");
    actionsRow.style.display = "none";
  }
  window.closeModal = closeModal;

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.style.display === "flex") closeModal();
  });
});
