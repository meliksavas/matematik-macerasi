// Matematik Macerası — oyun akışı

(() => {
  "use strict";

  const POINTS_PER_QUESTION = 5;
  const LETTERS = ["A", "B", "C", "D"];
  const TOPICS = [
    { name: "Üslü Sayılar", cls: "topic-powers" },
    { name: "Çarpanlar ve Katlar", cls: "topic-factors" },
    { name: "EBOB ve EKOK", cls: "topic-gcd" }
  ];
  const PRAISE = ["Bravo! Doğru cevap!", "Bravo! Tam isabet!", "Bravo! Harikasın!", "Bravo! Süpersin!"];
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const $ = (id) => document.getElementById(id);
  const screens = { start: $("start-screen"), game: $("game-screen"), end: $("end-screen") };

  const state = {
    order: [],
    index: 0,
    score: 0,
    streak: 0,
    answered: false,
    options: [],
    results: []
  };

  // ---------- Konfeti ----------
  const Confetti = (() => {
    const canvas = $("confetti");
    const c = canvas.getContext("2d");
    const colors = ["#fde047", "#f97316", "#22c55e", "#3b82f6", "#ec4899", "#a855f7"];
    let pieces = [];
    let frame = null;

    function resize() {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      c.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function tick() {
      c.clearRect(0, 0, window.innerWidth, window.innerHeight);
      pieces.forEach((p) => {
        p.vy += 0.32;
        p.vx *= 0.99;
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.spin;
        c.save();
        c.translate(p.x, p.y);
        c.rotate(p.rot);
        c.fillStyle = p.color;
        c.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
        c.restore();
      });
      pieces = pieces.filter((p) => p.y < window.innerHeight + 30);
      frame = pieces.length ? requestAnimationFrame(tick) : null;
    }

    function burst(amount = 140) {
      if (reduceMotion) return;
      const w = window.innerWidth;
      for (let i = 0; i < amount; i++) {
        pieces.push({
          x: w / 2 + (Math.random() - 0.5) * w * 0.5,
          y: window.innerHeight * 0.35,
          vx: (Math.random() - 0.5) * 16,
          vy: -Math.random() * 13 - 5,
          size: 8 + Math.random() * 7,
          rot: Math.random() * Math.PI * 2,
          spin: (Math.random() - 0.5) * 0.35,
          color: colors[Math.floor(Math.random() * colors.length)]
        });
      }
      if (!frame) frame = requestAnimationFrame(tick);
    }

    resize();
    window.addEventListener("resize", resize);
    return { burst };
  })();

  // ---------- Yardımcılar ----------
  function shuffle(list) {
    const a = list.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function topicClass(name) {
    const topic = TOPICS.find((t) => t.name === name);
    return topic ? topic.cls : "";
  }

  function restartAnimation(node, cls) {
    node.classList.remove(cls);
    void node.offsetWidth;
    node.classList.add(cls);
  }

  function showScreen(name) {
    Object.entries(screens).forEach(([key, node]) => {
      node.hidden = key !== name;
    });
    window.scrollTo(0, 0);
  }

  function stepsList(steps) {
    return `<ol class="steps">${steps.map((s) => `<li>${s}</li>`).join("")}</ol>`;
  }

  function setProgress(done) {
    const total = QUESTIONS.length;
    $("progress-fill").style.width = `${(done / total) * 100}%`;
    document.querySelector(".progress").setAttribute("aria-valuenow", String(done));
  }

  function updateStats() {
    $("score").textContent = `⭐ ${state.score} puan`;
    const streak = $("streak");
    streak.hidden = state.streak < 2;
    streak.textContent = `🔥 ${state.streak} seri`;
  }

  // ---------- Oyun akışı ----------
  function startGame() {
    Sounds.unlock();
    state.order = shuffle(QUESTIONS.map((_, i) => i));
    state.index = 0;
    state.score = 0;
    state.streak = 0;
    state.results = [];
    showScreen("game");
    renderQuestion();
  }

  function renderQuestion() {
    const q = QUESTIONS[state.order[state.index]];
    state.answered = false;
    state.options = shuffle(q.options.map((html, i) => ({ html, correct: i === q.answer })));

    $("q-number").textContent = `Soru ${state.index + 1} / ${QUESTIONS.length}`;
    setProgress(state.index);

    const topic = $("q-topic");
    topic.textContent = q.topic;
    topic.className = `topic ${topicClass(q.topic)}`;

    $("q-text").innerHTML = q.text;
    const figure = $("q-figure");
    figure.innerHTML = q.figure || "";
    figure.hidden = !q.figure;

    const list = $("options");
    list.innerHTML = "";
    state.options.forEach((opt, i) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "option";
      btn.innerHTML = `<span class="letter">${LETTERS[i]}</span><span class="option-text">${opt.html}</span>`;
      btn.addEventListener("click", () => choose(i));
      list.appendChild(btn);
    });

    $("feedback").hidden = true;
    $("next-btn").hidden = true;
    updateStats();
    $("question-card").classList.remove("shake");
    restartAnimation($("question-card"), "enter");
  }

  function choose(i) {
    if (state.answered) return;
    state.answered = true;

    const q = QUESTIONS[state.order[state.index]];
    const chosen = state.options[i];
    const correctIndex = state.options.findIndex((o) => o.correct);

    $("options").querySelectorAll(".option").forEach((btn, j) => {
      btn.disabled = true;
      if (j === correctIndex) btn.classList.add("correct");
      else if (j === i) btn.classList.add("wrong");
      else btn.classList.add("dim");
    });

    state.results.push({ topic: q.topic, correct: chosen.correct });

    const feedback = $("feedback");
    if (chosen.correct) {
      state.score += POINTS_PER_QUESTION;
      state.streak += 1;
      Sounds.correct();
      Confetti.burst();
      restartAnimation($("score"), "bump");
      feedback.className = "feedback is-correct";
      feedback.innerHTML = `
        <div class="fb-head">
          <span class="fb-emoji" aria-hidden="true">🎉</span>
          <div>
            <strong>${PRAISE[Math.floor(Math.random() * PRAISE.length)]}</strong>
            <span>+${POINTS_PER_QUESTION} puan kazandın.</span>
          </div>
        </div>
        <details class="solution">
          <summary>Çözümü göster</summary>
          ${stepsList(q.steps)}
        </details>`;
    } else {
      state.streak = 0;
      Sounds.wrong();
      restartAnimation($("question-card"), "shake");
      feedback.className = "feedback is-wrong";
      feedback.innerHTML = `
        <div class="fb-head">
          <span class="fb-emoji" aria-hidden="true">😔</span>
          <div>
            <strong>Olmadı, ama pes etmek yok!</strong>
            <span>Doğru cevap: <b>${LETTERS[correctIndex]}) ${state.options[correctIndex].html}</b></span>
          </div>
        </div>
        <h3 class="steps-title">💡 Adım adım çözüm</h3>
        ${stepsList(q.steps)}`;
    }

    feedback.hidden = false;
    updateStats();
    setProgress(state.index + 1);

    const next = $("next-btn");
    next.textContent = state.index === QUESTIONS.length - 1 ? "Sonuçları Gör 🏁" : "Sonraki Soru ➜";
    next.hidden = false;
    next.focus({ preventScroll: true });
    feedback.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "nearest" });
  }

  function nextQuestion() {
    if (!state.answered) return;
    Sounds.stop();
    if (state.index < QUESTIONS.length - 1) {
      state.index += 1;
      renderQuestion();
      window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    } else {
      finishGame();
    }
  }

  function finishGame() {
    const total = QUESTIONS.length;
    const correct = state.results.filter((r) => r.correct).length;
    const ratio = correct / total;
    const starCount = ratio >= 0.9 ? 3 : ratio >= 0.6 ? 2 : ratio >= 0.3 ? 1 : 0;

    $("stars").innerHTML = [0, 1, 2].map((i) => `<span class="${i < starCount ? "" : "off"}">⭐</span>`).join("");
    $("final-score").textContent = `${state.score} / ${total * POINTS_PER_QUESTION}`;
    $("final-detail").textContent = `${total} sorudan ${correct} doğru, ${total - correct} yanlış`;

    let message;
    if (correct >= 18) message = "Muhteşem! Sen gerçek bir matematik kaşifisin! 🏆";
    else if (correct >= 14) message = "Çok iyi! Biraz daha pratikle zirvedesin! 🌟";
    else if (correct >= 10) message = "İyi gidiyorsun! Yanlış yaptığın konuların çözümlerini tekrar incele. 💪";
    else message = "Macera yeni başlıyor! Çözümleri inceleyip tekrar dene, başaracaksın! 🚀";
    $("final-message").textContent = message;

    $("breakdown").innerHTML = TOPICS.map((t) => {
      const items = state.results.filter((r) => r.topic === t.name);
      const ok = items.filter((r) => r.correct).length;
      const pct = items.length ? (ok / items.length) * 100 : 0;
      return `
        <div class="bd-row">
          <div class="bd-row-head"><span>${t.name}</span><span>${ok} / ${items.length}</span></div>
          <div class="bd-bar"><div class="bd-fill ${t.cls}" style="width:0" data-width="${pct}%"></div></div>
        </div>`;
    }).join("");

    showScreen("end");
    requestAnimationFrame(() => {
      document.querySelectorAll(".bd-fill").forEach((bar) => {
        bar.style.width = bar.dataset.width;
      });
    });

    if (correct >= total / 2) {
      Sounds.finale();
      Confetti.burst(220);
    }
  }

  // ---------- Ses düğmesi ----------
  const soundToggle = $("sound-toggle");
  function renderSoundToggle() {
    const muted = Sounds.isMuted();
    soundToggle.textContent = muted ? "🔇" : "🔊";
    soundToggle.setAttribute("aria-pressed", String(muted));
    soundToggle.setAttribute("aria-label", muted ? "Sesi aç" : "Sesi kapat");
  }
  soundToggle.addEventListener("click", () => {
    Sounds.setMuted(!Sounds.isMuted());
    renderSoundToggle();
  });
  renderSoundToggle();

  // ---------- Olaylar ----------
  $("start-btn").addEventListener("click", startGame);
  $("restart-btn").addEventListener("click", startGame);
  $("home-btn").addEventListener("click", () => showScreen("start"));
  $("next-btn").addEventListener("click", nextQuestion);

  document.addEventListener("keydown", (e) => {
    if (screens.game.hidden || e.ctrlKey || e.metaKey || e.altKey) return;
    // Odaktaki düğmeye Enter basıldığında tarayıcı zaten tıklar.
    if (e.target instanceof HTMLButtonElement && (e.key === "Enter" || e.key === " ")) return;

    const keyMap = { a: 0, b: 1, c: 2, d: 3, 1: 0, 2: 1, 3: 2, 4: 3 };
    const key = e.key.toLocaleLowerCase("tr");
    if (!state.answered && key in keyMap) {
      choose(keyMap[key]);
    } else if (state.answered && e.key === "Enter") {
      e.preventDefault();
      nextQuestion();
    }
  });
})();
