// Matematik Macerası — ses efektleri
// Tüm sesler Web Audio API ile tarayıcıda üretilir; ayrı bir ses dosyası gerekmez.
// "Bravo!" sözü tarayıcının konuşma sentezleyicisiyle (varsa Türkçe sesle) söylenir.

const Sounds = (() => {
  "use strict";

  const STORAGE_KEY = "matematik-macerasi-sessiz";
  const BRAVO_LINES = ["Bravo!", "Bravo! Harikasın!", "Bravo! Süpersin!", "Bravo! Aferin sana!"];

  let ctx = null;
  let master = null;
  let noiseBuffer = null;
  let turkishVoice = null;
  let muted = false;

  try {
    muted = localStorage.getItem(STORAGE_KEY) === "1";
  } catch (e) {
    // Depolama kapalı olabilir; ses açık başlar.
  }

  function pickVoice() {
    const voices = window.speechSynthesis.getVoices();
    turkishVoice = voices.find((v) => /^tr/i.test(v.lang)) || null;
  }

  if ("speechSynthesis" in window) {
    pickVoice();
    if (typeof window.speechSynthesis.addEventListener === "function") {
      window.speechSynthesis.addEventListener("voiceschanged", pickVoice);
    } else {
      window.speechSynthesis.onvoiceschanged = pickVoice;
    }
  }

  // Tarayıcılar sesi ancak bir tıklamadan sonra açmaya izin verir.
  function unlock() {
    if (!ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      ctx = new AudioCtx();
      const compressor = ctx.createDynamicsCompressor();
      compressor.threshold.value = -16;
      compressor.ratio.value = 6;
      master = ctx.createGain();
      master.gain.value = 0.9;
      master.connect(compressor).connect(ctx.destination);
      noiseBuffer = createNoise(2);
    }
    if (ctx.state === "suspended") ctx.resume();
  }

  function createNoise(seconds) {
    const length = Math.floor(ctx.sampleRate * seconds);
    const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < length; i++) data[i] = Math.random() * 2 - 1;
    return buffer;
  }

  function toMaster(node, pan) {
    if (!ctx.createStereoPanner) {
      node.connect(master);
      return;
    }
    const panner = ctx.createStereoPanner();
    panner.pan.value = pan;
    node.connect(panner).connect(master);
  }

  // Tek bir el çırpma: kısa, filtrelenmiş bir gürültü patlaması.
  function clap(time, volume, pan) {
    const src = ctx.createBufferSource();
    src.buffer = noiseBuffer;
    const band = ctx.createBiquadFilter();
    band.type = "bandpass";
    band.frequency.value = 1000 + Math.random() * 1500;
    band.Q.value = 0.9 + Math.random() * 0.8;
    const gain = ctx.createGain();
    const decay = 0.05 + Math.random() * 0.06;
    gain.gain.setValueAtTime(0.0001, time);
    gain.gain.exponentialRampToValueAtTime(Math.max(volume, 0.001), time + 0.003);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + decay);
    src.connect(band).connect(gain);
    toMaster(gain, pan);
    src.start(time, Math.random() * 1.7, decay + 0.02);
  }

  // Alkış: farklı hızlarda el çırpan bir kalabalık.
  function applause(start, duration) {
    const end = start + duration;
    for (let person = 0; person < 18; person++) {
      const interval = 1 / (4 + Math.random() * 2.5);
      const pan = Math.random() * 1.6 - 0.8;
      const volume = 0.35 + Math.random() * 0.35;
      for (let t = start + Math.random() * 0.3; t < end; t += interval * (0.85 + Math.random() * 0.3)) {
        const fade = Math.min(1, (end - t) / 1.2);
        clap(t, volume * fade, pan);
      }
    }
  }

  // Mutlu bir "vuuu-hiii!" çığlığı: perdesi yükselen, titreşimli bir ses.
  function shout(time, pitch, duration, pan) {
    const osc = ctx.createOscillator();
    osc.type = "sawtooth";
    const f = osc.frequency;
    f.setValueAtTime(pitch * 0.7, time);
    f.exponentialRampToValueAtTime(pitch * 1.3, time + 0.16);
    f.exponentialRampToValueAtTime(pitch * 1.15, time + duration * 0.7);
    f.exponentialRampToValueAtTime(pitch * 0.75, time + duration);

    const vibrato = ctx.createOscillator();
    vibrato.frequency.value = 5.5 + Math.random() * 2.5;
    const vibratoDepth = ctx.createGain();
    vibratoDepth.gain.value = pitch * 0.04;
    vibrato.connect(vibratoDepth).connect(f);

    // İki formant filtresi sesi insan sesine yaklaştırır ("u" sesinden "i" sesine geçiş).
    const f1 = ctx.createBiquadFilter();
    f1.type = "bandpass";
    f1.Q.value = 4;
    f1.frequency.setValueAtTime(450, time);
    f1.frequency.linearRampToValueAtTime(800, time + 0.2);
    const f2 = ctx.createBiquadFilter();
    f2.type = "bandpass";
    f2.Q.value = 6;
    f2.frequency.setValueAtTime(1000, time);
    f2.frequency.linearRampToValueAtTime(2300, time + 0.25);
    const f2Level = ctx.createGain();
    f2Level.gain.value = 0.6;

    const env = ctx.createGain();
    env.gain.setValueAtTime(0.0001, time);
    env.gain.exponentialRampToValueAtTime(1.1, time + 0.05);
    env.gain.setValueAtTime(1.1, time + duration * 0.6);
    env.gain.exponentialRampToValueAtTime(0.0001, time + duration);

    osc.connect(f1).connect(env);
    osc.connect(f2).connect(f2Level).connect(env);
    toMaster(env, pan);
    osc.start(time);
    vibrato.start(time);
    osc.stop(time + duration + 0.05);
    vibrato.stop(time + duration + 0.05);
  }

  function cheer(start) {
    const firstWave = [520, 660, 600, 780, 470, 880];
    const secondWave = [560, 720, 640, 820];
    firstWave.forEach((pitch, i) => {
      shout(start + i * 0.1 + Math.random() * 0.08, pitch * (0.95 + Math.random() * 0.1), 0.8 + Math.random() * 0.5, Math.random() * 1.4 - 0.7);
    });
    secondWave.forEach((pitch, i) => {
      shout(start + 1.1 + i * 0.12 + Math.random() * 0.08, pitch * (0.95 + Math.random() * 0.1), 0.7 + Math.random() * 0.5, Math.random() * 1.4 - 0.7);
    });
  }

  function chime(start, notes, step) {
    notes.forEach((freq, i) => {
      const t = start + i * step;
      const osc = ctx.createOscillator();
      osc.type = "triangle";
      osc.frequency.value = freq;
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.exponentialRampToValueAtTime(0.35, t + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.35);
      osc.connect(gain).connect(master);
      osc.start(t);
      osc.stop(t + 0.4);
    });
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

  function speak(text) {
    if (muted || !("speechSynthesis" in window)) return;
    try {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "tr-TR";
      if (turkishVoice) utterance.voice = turkishVoice;
      utterance.pitch = 1.4;
      utterance.rate = 1.05;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      // Konuşma desteklenmiyorsa sessizce geç.
    }
  }

  function play(build) {
    if (muted) return;
    unlock();
    if (!ctx) return;
    build(ctx.currentTime + 0.03);
  }

  return {
    unlock,
    correct() {
      play((t) => {
        chime(t, [523.25, 659.25, 783.99, 1046.5], 0.08);
        applause(t + 0.15, 2.8);
        cheer(t + 0.25);
      });
      speak(BRAVO_LINES[Math.floor(Math.random() * BRAVO_LINES.length)]);
    },
    wrong() {
      play((t) => sadTrombone(t));
    },
    finale() {
      play((t) => {
        chime(t, [523.25, 659.25, 783.99, 1046.5, 1318.5], 0.12);
        applause(t + 0.3, 3.5);
        cheer(t + 0.4);
      });
    },
    isMuted: () => muted,
    setMuted(value) {
      muted = value;
      try {
        localStorage.setItem(STORAGE_KEY, value ? "1" : "0");
      } catch (e) {
        // Tercih kaydedilemezse yalnızca bu oturum için geçerli olur.
      }
      if (value && "speechSynthesis" in window) window.speechSynthesis.cancel();
      if (ctx) value ? ctx.suspend() : ctx.resume();
    }
  };
})();
