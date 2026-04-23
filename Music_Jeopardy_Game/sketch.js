"use strict";


// 100 QUESTIONS 
// Each: { id, question, choices[4], answerIndex }
const QUESTIONS = [
  {id:1,question:"How many beats does a whole note get in 4/4 time?",choices:["1","2","3","4"],answerIndex:3},
  {id:2,question:"How many beats does a half note get in 4/4 time?",choices:["1","2","3","4"],answerIndex:1},
  {id:3,question:"How many beats does a quarter note get in 4/4 time?",choices:["1","1.5","2","4"],answerIndex:0},
  {id:4,question:"How many eighth notes equal one whole note?",choices:["4","8","16","32"],answerIndex:1},
  {id:5,question:"A dot adds what to a note's duration?",choices:["Half its value","A full beat","Double its value","Nothing"],answerIndex:0},
  {id:6,question:"How many beats of silence is a whole rest in 4/4?",choices:["1","2","3","4"],answerIndex:3},
  {id:7,question:"Which rest equals one beat in 4/4 time?",choices:["Quarter rest","Half rest","Eighth rest","Whole rest"],answerIndex:0},
  {id:8,question:"How many sixteenth notes equal one quarter note?",choices:["2","3","4","8"],answerIndex:2},
  {id:9,question:"Two tied half notes equal:",choices:["A whole note","A dotted half note","A half note","A double whole note"],answerIndex:0},
  {id:10,question:"A triplet divides a beat into:",choices:["2 equal parts","3 equal parts","4 equal parts","6 equal parts"],answerIndex:1},

  {id:11,question:"What does the top number in a time signature indicate?",choices:["Beats per measure","Beat unit value","Tempo","Key"],answerIndex:0},
  {id:12,question:"In 6/8 time, one measure contains how many eighth-note beats?",choices:["2","3","6","8"],answerIndex:2},
  {id:13,question:"Which is compound duple meter?",choices:["2/4","3/4","6/8","4/4"],answerIndex:2},
  {id:14,question:"Cut time is another name for:",choices:["2/2","2/4","4/4","12/8"],answerIndex:0},
  {id:15,question:"A bar line separates:",choices:["Notes from rests","Measures","Pitches","Dynamics"],answerIndex:1},
  {id:16,question:"Which time signature has three beats per measure?",choices:["2/4","3/4","4/4","5/4"],answerIndex:1},
  {id:17,question:"In 4/4, the beat unit (bottom number 4) indicates the beat is:",choices:["Whole note","Half note","Quarter note","Eighth note"],answerIndex:2},
  {id:18,question:"A pickup note before the first full measure is called:",choices:["Coda","Anacrusis","D.C.","Fermata"],answerIndex:1},
  {id:19,question:"Which barline indicates the end of a piece?",choices:["Single barline","Double thin barline","Final barline (thin-thick)","Repeat barline"],answerIndex:2},
  {id:20,question:"The natural stress pattern in 4/4 is:",choices:["Strong-weak-strong-weak","Strong-weak-weak-weak","Weak-strong-weak-strong","All equal"],answerIndex:0},

  {id:21,question:"The treble clef is also called the:",choices:["G clef","C clef","F clef","Bass clef"],answerIndex:0},
  {id:22,question:"The bass clef dots surround which line note?",choices:["G","F","C","A"],answerIndex:1},
  {id:23,question:"How many lines are on a standard staff?",choices:["4","5","6","7"],answerIndex:1},
  {id:24,question:"Ledger lines are used to:",choices:["Change key","Extend the staff range","Indicate dynamics","Mark repeats"],answerIndex:1},
  {id:25,question:"Middle C is located:",choices:["On treble staff line 3","On a ledger line between staves","On bass staff line 1","On treble staff space 4"],answerIndex:1},
  {id:26,question:"A sharp does what to a pitch?",choices:["Lowers by a half step","Raises by a half step","Raises by a whole step","Cancels accidentals"],answerIndex:1},
  {id:27,question:"A flat does what to a pitch?",choices:["Raises by a half step","Lowers by a half step","Raises by a whole step","No change"],answerIndex:1},
  {id:28,question:"A natural sign:",choices:["Raises a note","Lowers a note","Cancels sharps/flats","Doubles a note"],answerIndex:2},
  {id:29,question:"Enharmonic equivalents are:",choices:["Different rhythms","Same pitch, different names","Same name, different pitch","Different keys"],answerIndex:1},
  {id:30,question:"Which is an enharmonic pair?",choices:["C and C#","E and Fb","G and A","B and C"],answerIndex:1},
  {id:31,question:"Which set lists only accidentals?",choices:["Sharp, flat, natural","Tie, slur, dot","Treble, bass, alto","C, D, E"],answerIndex:0},
  {id:32,question:"A slur indicates:",choices:["Notes are detached","Notes are connected smoothly","Repeat passage","Accent"],answerIndex:1},
  {id:33,question:"A tie connects:",choices:["Different pitches","Same pitch to add duration","Two measures","Two dynamics"],answerIndex:1},
  {id:34,question:"Staccato dots mean:",choices:["Hold longer","Play very loud","Play detached/short","Play slower"],answerIndex:2},
  {id:35,question:"A fermata indicates:",choices:["Hold the note","Play softly","Go back to the start","Speed up"],answerIndex:0},

  {id:36,question:"A major scale uses which step pattern?",choices:["W-W-H-W-W-W-H","W-H-W-W-H-W-W","H-W-W-H-W-W-W","W-W-W-H-W-H-W"],answerIndex:0},
  {id:37,question:"A natural minor scale pattern is:",choices:["W-W-H-W-W-W-H","W-H-W-W-H-W-W","W-H-W-W-W-H-W","H-W-W-H-W-W-W"],answerIndex:1},
  {id:38,question:"The key of C major has how many sharps/flats?",choices:["0","1 sharp","1 flat","2 sharps"],answerIndex:0},
  {id:39,question:"The key of G major has:",choices:["1 sharp","2 sharps","1 flat","No sharps/flats"],answerIndex:0},
  {id:40,question:"The key of F major has:",choices:["1 sharp","1 flat","2 flats","No sharps/flats"],answerIndex:1},
  {id:41,question:"Relative minor of C major is:",choices:["A minor","E minor","D minor","G minor"],answerIndex:0},
  {id:42,question:"Relative minor of G major is:",choices:["E minor","B minor","D minor","A minor"],answerIndex:0},
  {id:43,question:"Relative minor of F major is:",choices:["D minor","A minor","G minor","E minor"],answerIndex:0},
  {id:44,question:"How many sharps in D major?",choices:["1","2","3","4"],answerIndex:1},
  {id:45,question:"How many flats in Bb major?",choices:["1","2","3","4"],answerIndex:1},
  {id:46,question:"Key signature with 3 sharps is:",choices:["A major","E major","D major","F# major"],answerIndex:0},
  {id:47,question:"Key signature with 2 flats is:",choices:["Bb major","Eb major","Ab major","F major"],answerIndex:0},
  {id:48,question:"The order of sharps is:",choices:["B E A D G C F","F C G D A E B","C G D A E B F#","G D A E B F# C#"],answerIndex:1},
  {id:49,question:"The order of flats is:",choices:["F C G D A E B","B E A D G C F","G D A E B F# C#","C G D A E B F#"],answerIndex:1},
  {id:50,question:"Parallel minor of C major is:",choices:["A minor","C minor","G minor","E minor"],answerIndex:1},
  {id:51,question:"Harmonic minor raises which scale degree?",choices:["2","6","7","3"],answerIndex:2},
  {id:52,question:"Melodic minor ascending raises:",choices:["6 and 7","3 and 6","2 and 5","1 and 4"],answerIndex:0},
  {id:53,question:"The leading tone is which degree in major?",choices:["6","7","2","4"],answerIndex:1},
  {id:54,question:"The subdominant scale degree is:",choices:["4","5","3","2"],answerIndex:0},
  {id:55,question:"The dominant scale degree is:",choices:["3","4","5","6"],answerIndex:2},

  {id:56,question:"A major third spans how many semitones?",choices:["3","4","5","7"],answerIndex:1},
  {id:57,question:"A perfect fifth spans how many semitones?",choices:["6","7","8","9"],answerIndex:1},
  {id:58,question:"A minor third is:",choices:["2 semitones","3 semitones","4 semitones","5 semitones"],answerIndex:1},
  {id:59,question:"An augmented fourth is enharmonic to:",choices:["Minor third","Major third","Diminished fifth","Perfect fourth"],answerIndex:2},
  {id:60,question:"A tritone equals how many semitones?",choices:["5","6","7","8"],answerIndex:1},
  {id:61,question:"A major triad formula is:",choices:["m3 + M3","M3 + m3","M3 + M3","m3 + m3"],answerIndex:1},
  {id:62,question:"A minor triad formula is:",choices:["M3 + m3","m3 + M3","m3 + m3","M3 + M3"],answerIndex:1},
  {id:63,question:"A diminished triad is:",choices:["M3 + M3","m3 + M3","m3 + m3","M3 + m3"],answerIndex:2},
  {id:64,question:"An augmented triad is:",choices:["M3 + M3","m3 + m3","M3 + m3","m3 + M3"],answerIndex:0},
  {id:65,question:"A dominant seventh chord built on scale degree 5 includes which 7th?",choices:["Major 7th","Minor 7th","Diminished 7th","Augmented 7th"],answerIndex:1},
  {id:66,question:"The interval from C up to E is a:",choices:["Major 2nd","Minor 3rd","Major 3rd","Perfect 4th"],answerIndex:2},
  {id:67,question:"The interval from A up to E is a:",choices:["Perfect 5th","Major 6th","Perfect 4th","Minor 7th"],answerIndex:0},
  {id:68,question:"In solfege, 'ti' resolves to:",choices:["la","do","re","mi"],answerIndex:1},
  {id:69,question:"Scale degree 3 in major is called the:",choices:["Mediant","Dominant","Submediant","Supertonic"],answerIndex:0},
  {id:70,question:"The interval from E to F is:",choices:["Minor 2nd","Major 2nd","Unison","Tritone"],answerIndex:0},

  {id:71,question:"pp means:",choices:["Very soft","Soft","Medium","Very loud"],answerIndex:0},
  {id:72,question:"f means:",choices:["Soft","Loud","Very soft","Medium"],answerIndex:1},
  {id:73,question:"mf means:",choices:["Medium loud","Medium soft","Very loud","Very soft"],answerIndex:0},
  {id:74,question:"crescendo means:",choices:["Get softer","Get faster","Get louder","Hold the note"],answerIndex:2},
  {id:75,question:"diminuendo means:",choices:["Get louder","Get softer","Get faster","Get slower"],answerIndex:1},
  {id:76,question:"Allegro indicates:",choices:["Slow tempo","Walking tempo","Fast tempo","Very slow"],answerIndex:2},
  {id:77,question:"Andante indicates:",choices:["Very fast","Walking tempo","Very slow","Extremely loud"],answerIndex:1},
  {id:78,question:"Largo indicates:",choices:["Very slow","Moderate","Fast","Very fast"],answerIndex:0},
  {id:79,question:"rit. means:",choices:["Speed up","Slow down","Get louder","Repeat"],answerIndex:1},
  {id:80,question:"accel. means:",choices:["Slow down","Get louder","Speed up","Staccato"],answerIndex:2},
  {id:81,question:"A marcato accent means:",choices:["Very accented","Very soft","Smoothly connected","Repeat"],answerIndex:0},
  {id:82,question:"Legato means:",choices:["Smooth and connected","Short and detached","Very loud","Very soft"],answerIndex:0},
  {id:83,question:"Sforzando (sfz) means:",choices:["Sudden strong accent","Gradually softer","Gradually louder","Hold longer"],answerIndex:0},
  {id:84,question:"A tenuto marking means:",choices:["Shorten the note","Sustain full value","Play twice","Play louder"],answerIndex:1},
  {id:85,question:"da capo (D.C.) means:",choices:["Go to the coda","Go back to the beginning","Go to measure 2","End the piece"],answerIndex:1},

  {id:86,question:"The key signature with 4 sharps is:",choices:["E major","A major","D major","B major"],answerIndex:0},
  {id:87,question:"The key signature with 3 flats is:",choices:["Ab major","Eb major","Db major","Bb major"],answerIndex:1},
  {id:88,question:"The relative major of A minor is:",choices:["A major","C major","F major","G major"],answerIndex:1},
  {id:89,question:"Which pair are relative keys?",choices:["C major & C minor","G major & E minor","F major & G minor","D major & C minor"],answerIndex:1},
  {id:90,question:"The parallel minor of G major is:",choices:["G minor","E minor","D minor","C minor"],answerIndex:0},
  {id:91,question:"A key with one flat is:",choices:["Bb major","F major","Eb major","C major"],answerIndex:1},
  {id:92,question:"Enharmonic to C# major is:",choices:["Db major","Gb major","F# major","B major"],answerIndex:0},
  {id:93,question:"Concert pitch for a Bb instrument written in C sounds as:",choices:["Bb","A","D","C"],answerIndex:0},
  {id:94,question:"The circle of fifths moves by:",choices:["Major seconds","Perfect fifths","Minor thirds","Tritones"],answerIndex:1},
  {id:95,question:"How many semitones are in one octave?",choices:["8","10","12","16"],answerIndex:2},
  {id:96,question:"Common time (the 'C' symbol) is equivalent to:",choices:["2/2","2/4","4/4","6/8"],answerIndex:2},
  {id:97,question:"A metronome marking of ♩ = 60 means:",choices:["60 measures per minute","60 beats per minute","60 notes per measure","60 bars per hour"],answerIndex:1},
  {id:98,question:"In movable-do major, scale degree 4 is:",choices:["mi","fa","sol","la"],answerIndex:1},
  {id:99,question:"The chord built on scale degree 2 in major is usually:",choices:["Major","Minor","Diminished","Augmented"],answerIndex:1},
  {id:100,question:"In major, the leading-tone triad (vii°) is:",choices:["Major","Minor","Diminished","Augmented"],answerIndex:2},
];

// GAME STATE 
const TILE_COUNT = 50;
const TILE_VALUES = Array.from({ length: TILE_COUNT }, (_, i) => ((i % 5) + 1) * 10);

function shuffled(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

let unused = shuffled(QUESTIONS.map(q => q.id)); // queue of unused question IDs
let incorrectPool = [];                           // IDs answered incorrectly at least once (and not yet correct)
const correctSet = new Set();                     // IDs answered correctly
const tileStatus = Array(TILE_COUNT).fill("unused"); // "unused" | "correct"

let activeTile = null;
let activeQuestion = null;

// DOM references (guard if DOM not ready yet)
function ready(fn) {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", fn);
  } else {
    fn();
  }
}

ready(() => {
  const grid = document.getElementById("grid");
  const modal = document.getElementById("modal");
  const qText = document.getElementById("questionText");
  const choicesDiv = document.getElementById("choices");
  const feedbackDiv = document.getElementById("feedback");
  const solvedCountEl = document.getElementById("solvedCount");
  const poolCountEl = document.getElementById("poolCount");
  poolCountEl.textContent = QUESTIONS.length.toString();

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

  function drawNextQuestion() {
    if (unused.length > 0) {
      const id = unused.shift();
      return QUESTIONS.find(q => q.id === id);
    }
    const pool = incorrectPool.filter(id => !correctSet.has(id));
    if (pool.length > 0) {
      const id = pool[Math.floor(Math.random() * pool.length)];
      return QUESTIONS.find(q => q.id === id);
    }
    return QUESTIONS[Math.floor(Math.random() * QUESTIONS.length)];
  }

  function openTile(idx) {
    if (tileStatus[idx] === "correct") return; // locked
    activeTile = idx;
    activeQuestion = drawNextQuestion();
    qText.textContent = activeQuestion.question;
    feedbackDiv.textContent = "";
    choicesDiv.innerHTML = "";
    activeQuestion.choices.forEach((c, i) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "choice";
      btn.textContent = String.fromCharCode(65 + i) + ". " + c;
      btn.onclick = () => handleAnswer(i);
      choicesDiv.appendChild(btn);
    });
    showModal();
  }

  function handleAnswer(choiceIdx) {
    if (!activeQuestion) return;
    const isCorrect = (choiceIdx === activeQuestion.answerIndex);
    if (isCorrect) {
      tileStatus[activeTile] = "correct";
      correctSet.add(activeQuestion.id);
      incorrectPool = incorrectPool.filter(id => id !== activeQuestion.id);
      const tileEl = grid.children[activeTile];
      tileEl.textContent = "Correct";
      tileEl.classList.add("correct");
      feedbackDiv.textContent = "Correct!";
      feedbackDiv.className = "feedback ok";
      solvedCountEl.textContent = tileStatus.filter(s => s === "correct").length.toString();
      setTimeout(closeModal, 700);
    } else {
      if (!incorrectPool.includes(activeQuestion.id)) incorrectPool.push(activeQuestion.id);
      feedbackDiv.textContent = "Incorrect — try another tile.";
      feedbackDiv.className = "feedback bad";
      setTimeout(closeModal, 800);
    }
  }

  function showModal() { modal.style.display = "flex"; }
  function closeModal() {
    modal.style.display = "none";
    activeTile = null;
    activeQuestion = null;
    feedbackDiv.textContent = "";
  }
  // expose closeModal globally for the close button in HTML
  window.closeModal = closeModal;

  // Accessibility: ESC to close modal
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.style.display === "flex") closeModal();
  });
});
