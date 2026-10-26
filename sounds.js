// Matematik Macerası — ses efektleri
// Doğru cevap ve oyun sonu sesleri gerçek alkış/tezahürat kayıtlarıdır (audio/ klasörü, kaynaklar README'de).
// Yanlış cevaptaki üzgün trombon sesi Web Audio API ile tarayıcıda üretilir.

const Sounds = (() => {
  "use strict";

  const STORAGE_KEY = "matematik-macerasi-sessiz";
  const CLIPS = { correct: "audio/dogru.mp3", finale: "audio/final.mp3" };

  let ctx = null;
  let master = null;
  let muted = false;
  const buffers = {};
  let current = null;

  // Dosyalar sayfa açılırken indirilir; çözme işi ses açıldığında yapılır.
  const downloads = {};
  Object.entries(CLIPS).forEach(([name, url]) => {
    downloads[name] = fetch(url)
      .then((res) => (res.ok ? res.arrayBuffer() : null))
      .catch(() => null);
  });

  try {
    muted = localStorage.getItem(STORAGE_KEY) === "1";
  } catch (e) {
    // Depolama kapalı olabilir; ses açık başlar.
  }

  // Tarayıcılar sesi ancak bir tıklamadan sonra açmaya izin verir.
  function unlock() {
    if (!ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      ctx = new AudioCtx();
      master = ctx.createGain();
      master.gain.value = 0.9;
      master.connect(ctx.destination);
      Object.keys(CLIPS).forEach(decode);
    }
    if (ctx.state === "suspended") ctx.resume();
  }

  function decode(name) {
    downloads[name]
      .then((data) => data && new Promise((resolve, reject) => ctx.decodeAudioData(data, resolve, reject)))
      .then((buffer) => {
        if (buffer) buffers[name] = buffer;
      })
      .catch(() => {
        // Çözülemezse çalarken <audio> öğesine geçilir.
      });
  }

  function stop(fade = 0.3) {
    if (!current) return;
    const { source, gain, element } = current;
    current = null;
    if (element) {
      element.pause();
      return;
    }
    const now = ctx.currentTime;
    gain.gain.cancelScheduledValues(now);
    gain.gain.setValueAtTime(gain.gain.value, now);
    gain.gain.linearRampToValueAtTime(0, now + fade);
    source.stop(now + fade + 0.05);
  }

  function playClip(name) {
    if (muted) return;
    unlock();
    stop(0.1);
    if (ctx && buffers[name]) {
      const source = ctx.createBufferSource();
      source.buffer = buffers[name];
      const gain = ctx.createGain();
      source.connect(gain).connect(master);
      source.start();
      current = { source, gain };
      source.onended = () => {
        if (current && current.source === source) current = null;
      };
      return;
    }
    // Ses henüz çözülmediyse (ya da Web Audio yoksa) doğrudan çal.
    const element = new Audio(CLIPS[name]);
    element.volume = 0.9;
    element.play().catch(() => {});
    current = { element };
  }

  // Üzgün trombon: "vah vah vah vaaah"
  function sadTrombone(start) {
    const notes = [[233.08, 0.36], [220.0, 0.36], [207.65, 0.36], [196.0, 1.35]];
    let t = start;
    notes.forEach(([freq, length], i) => {
      const osc = ctx.createOscillator();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(freq, t);

      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.Q.value = 5;
      filter.frequency.setValueAtTime(300, t);
      filter.frequency.linearRampToValueAtTime(1300, t + Math.min(0.15, length * 0.4));
      filter.frequency.linearRampToValueAtTime(450, t + length);

      const env = ctx.createGain();
      env.gain.setValueAtTime(0.0001, t);
      env.gain.exponentialRampToValueAtTime(0.5, t + 0.04);
      env.gain.setValueAtTime(0.5, t + length - 0.08);
      env.gain.exponentialRampToValueAtTime(0.0001, t + length);

      if (i === notes.length - 1) {
        // Son nota titreyerek ve hafifçe pesleşerek söner.
        const lfo = ctx.createOscillator();
        lfo.frequency.value = 5;
        const pitchDepth = ctx.createGain();
        pitchDepth.gain.value = 6;
        const wahDepth = ctx.createGain();
        wahDepth.gain.value = 350;
        lfo.connect(pitchDepth).connect(osc.frequency);
        lfo.connect(wahDepth).connect(filter.frequency);
        osc.frequency.setValueAtTime(freq, t + length * 0.6);
        osc.frequency.linearRampToValueAtTime(freq * 0.94, t + length);
        lfo.start(t + 0.25);
        lfo.stop(t + length);
      }

      osc.connect(filter).connect(env).connect(master);
      osc.start(t);
      osc.stop(t + length + 0.05);
      t += length + 0.05;
    });
  }

  return {
    unlock,
    stop,
    correct() {
      playClip("correct");
    },
    wrong() {
      if (muted) return;
      unlock();
      if (!ctx) return;
      stop(0.1);
      sadTrombone(ctx.currentTime + 0.03);
    },
    finale() {
      playClip("finale");
    },
    isMuted: () => muted,
    setMuted(value) {
      muted = value;
      try {
        localStorage.setItem(STORAGE_KEY, value ? "1" : "0");
      } catch (e) {
        // Tercih kaydedilemezse yalnızca bu oturum için geçerli olur.
      }
      if (value) stop(0.05);
      if (ctx) value ? ctx.suspend() : ctx.resume();
    }
  };
})();
