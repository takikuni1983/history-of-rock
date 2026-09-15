/* =====================================================================
   ROCK GENEALOGY — APP
   系統樹の描画・パン/ズーム・系譜ハイライト・フロートウインドウ・試聴
   ===================================================================== */
(function () {
  "use strict";

  const SVGNS = "http://www.w3.org/2000/svg";

  /* ---- layout constants ---- */
  const MARGIN_L = 220;   // 左の年代ガター
  const MARGIN_R = 130;
  const NODE_W = 1900;    // ノード領域の幅
  const ROW_H = 250;      // 世代(行)の高さ
  const TOP = 150;
  const BOTTOM = 220;

  const maxGen = GENRES.reduce((m, g) => Math.max(m, g.gen), 0);
  const TOTAL_W = MARGIN_L + NODE_W + MARGIN_R;
  const TOTAL_H = TOP + maxGen * ROW_H + BOTTOM;

  /* エラを世代範囲へマップ */
  const ERA_RANGES = {
    roots: [0, 0], "60s": [1, 3], "70s": [4, 5],
    "80s": [6, 7], "90s": [8, 8], "00s": [9, 9],
  };

  const byId = {};
  GENRES.forEach((g) => (byId[g.id] = g));

  /* 位置を計算 */
  GENRES.forEach((g) => {
    g.px = MARGIN_L + g.x * NODE_W;
    g.py = TOP + g.gen * ROW_H;
  });

  /* 同じ世代(行)内での並び順 → ラベルを段違いにして重なりを防ぐ */
  const _byGen = {};
  GENRES.forEach((g) => ((_byGen[g.gen] = _byGen[g.gen] || []).push(g)));
  Object.values(_byGen).forEach((arr) => {
    arr.sort((a, b) => a.x - b.x).forEach((g, i) => (g.tier = arr.length > 4 ? i % 2 : 0));
  });

  /* 親子関係 */
  const childrenOf = {};
  GENRES.forEach((g) => (childrenOf[g.id] = []));
  GENRES.forEach((g) => g.parents.forEach((p) => childrenOf[p] && childrenOf[p].push(g.id)));

  function ancestors(id, acc) {
    acc = acc || new Set();
    (byId[id].parents || []).forEach((p) => {
      if (!acc.has(p)) { acc.add(p); ancestors(p, acc); }
    });
    return acc;
  }
  function descendants(id, acc) {
    acc = acc || new Set();
    (childrenOf[id] || []).forEach((c) => {
      if (!acc.has(c)) { acc.add(c); descendants(c, acc); }
    });
    return acc;
  }

  /* ---- build the SVG ---- */
  const stage = document.getElementById("stage");
  const svg = document.createElementNS(SVGNS, "svg");
  svg.setAttribute("class", "tree");
  svg.setAttribute("width", TOTAL_W);
  svg.setAttribute("height", TOTAL_H);
  svg.setAttribute("viewBox", `0 0 ${TOTAL_W} ${TOTAL_H}`);
  stage.appendChild(svg);

  const defs = document.createElementNS(SVGNS, "defs");
  svg.appendChild(defs);

  const gBands = mkG("bands");
  const gEdges = mkG("edges");
  const gNodes = mkG("nodes");
  svg.appendChild(gBands);
  svg.appendChild(gEdges);
  svg.appendChild(gNodes);

  function mkG(cls) { const g = document.createElementNS(SVGNS, "g"); g.setAttribute("class", cls); return g; }
  function el(name, attrs) {
    const e = document.createElementNS(SVGNS, name);
    for (const k in attrs) e.setAttribute(k, attrs[k]);
    return e;
  }

  /* ---- era bands + labels ---- */
  ERAS.forEach((era) => {
    const [gs, ge] = ERA_RANGES[era.id];
    const yTop = TOP + gs * ROW_H - ROW_H * 0.55;
    const yBot = TOP + ge * ROW_H + ROW_H * 0.55;
    const band = mkG("era-band");
    band.appendChild(el("rect", { x: 0, y: yTop, width: TOTAL_W, height: yBot - yTop }));
    band.appendChild(el("line", { x1: 0, y1: yTop, x2: TOTAL_W, y2: yTop }));

    const lab = el("text", { class: "era-label", x: 34, y: TOP + gs * ROW_H - 6 });
    lab.textContent = era.label;
    const ttl = el("text", { class: "era-title", x: 34, y: TOP + gs * ROW_H + 14 });
    ttl.textContent = era.title.split(" — ")[1] || "";
    band.appendChild(lab);
    band.appendChild(ttl);
    lab.style.cursor = ttl.style.cursor = "pointer";
    lab.addEventListener("click", () => openEra(era));
    ttl.addEventListener("click", () => openEra(era));
    gBands.appendChild(band);
  });

  /* ---- edges (branches) ---- */
  const edgeEls = []; // {el, from, to}
  GENRES.forEach((child) => {
    child.parents.forEach((pid) => {
      const p = byId[pid];
      if (!p) return;
      const x1 = p.px, y1 = p.py, x2 = child.px, y2 = child.py;
      const my = (y1 + y2) / 2;
      const d = `M ${x1} ${y1} C ${x1} ${my}, ${x2} ${my}, ${x2} ${y2}`;
      const path = el("path", { class: "edge", d: d });
      path.style.stroke = `hsla(${child.hue}, 55%, 60%, 0.22)`;
      // growth animation
      const len = Math.hypot(x2 - x1, y2 - y1) + Math.abs(my - y1) * 1.4;
      path.style.strokeDasharray = len;
      path.style.strokeDashoffset = len;
      gEdges.appendChild(path);
      edgeEls.push({ el: path, from: pid, to: child.id, len });
    });
  });

  /* ---- nodes (cells / organisms) ---- */
  const nodeEls = {};
  GENRES.forEach((g, i) => {
    const grp = el("g", { class: "node" });
    grp.setAttribute("transform", `translate(${g.px}, ${g.py})`);

    // gradient per node
    const gid = "grad-" + g.id;
    const rg = el("radialGradient", { id: gid, cx: "40%", cy: "38%", r: "70%" });
    rg.appendChild(el("stop", { offset: "0%", "stop-color": `hsl(${g.hue},90%,72%)` }));
    rg.appendChild(el("stop", { offset: "60%", "stop-color": `hsl(${g.hue},70%,50%)` }));
    rg.appendChild(el("stop", { offset: "100%", "stop-color": `hsl(${g.hue},72%,32%)` }));
    defs.appendChild(rg);

    const R = g.gen === 0 ? 30 : 26;

    const halo = el("circle", { class: "halo breathe", r: R + 18, cx: 0, cy: 0, fill: `hsla(${g.hue},80%,60%,0.28)` });
    halo.style.setProperty("--dur", (4 + (i % 5)) + "s");
    halo.style.setProperty("--delay", (i % 7) * 0.4 + "s");

    const cellG = el("g", { class: "cell" });
    const cell = el("circle", { class: "cell-core", r: R, cx: 0, cy: 0, fill: `url(#${gid})` });
    cell.style.filter = `drop-shadow(0 0 14px hsla(${g.hue},80%,55%,0.55))`;
    // inner nucleus for a cell-like look
    const nucleus = el("circle", { r: R * 0.4, cx: -R * 0.2, cy: -R * 0.22, fill: "rgba(255,255,255,0.35)" });
    const ring = el("circle", { r: R + 5, cx: 0, cy: 0, fill: "none", stroke: `hsla(${g.hue},80%,72%,0.5)`, "stroke-width": 1 });
    cellG.appendChild(ring);
    cellG.appendChild(cell);
    cellG.appendChild(nucleus);

    const ly = R + 20 + (g.tier ? 24 : 0); // 段違い
    const label = el("text", { class: "label", x: 0, y: ly, "text-anchor": "middle" });
    label.textContent = g.name;
    const labelEn = el("text", { class: "label-en", x: 0, y: ly + 14, "text-anchor": "middle" });
    labelEn.textContent = g.en;
    if (g.tier) {
      // 段違いラベルへ細い引き出し線
      grp.appendChild(el("line", { x1: 0, y1: R, x2: 0, y2: ly - 12, stroke: `hsla(${g.hue},70%,65%,0.35)`, "stroke-width": 1 }));
    }

    grp.appendChild(halo);
    grp.appendChild(cellG);
    grp.appendChild(label);
    grp.appendChild(labelEn);
    gNodes.appendChild(grp);
    nodeEls[g.id] = grp;

    grp.addEventListener("mouseenter", () => highlight(g.id));
    grp.addEventListener("mouseleave", clearHighlight);
    grp.addEventListener("click", (e) => { e.stopPropagation(); openGenre(g); });
  });

  /* reveal edges after mount (growth) */
  requestAnimationFrame(() => {
    setTimeout(() => {
      edgeEls.forEach((e, i) => {
        e.el.style.transition = `stroke-dashoffset 1.4s ease ${(i % 20) * 0.05 + 0.2}s, stroke 0.35s ease, opacity 0.35s ease`;
        e.el.style.strokeDashoffset = "0";
      });
    }, 60);
  });

  /* ---- lineage highlight ---- */
  function highlight(id) {
    const anc = ancestors(id);
    const dec = descendants(id);
    const lit = new Set([id, ...anc, ...dec]);
    GENRES.forEach((g) => {
      nodeEls[g.id].classList.toggle("dim", !lit.has(g.id));
    });
    edgeEls.forEach((e) => {
      const on = lit.has(e.from) && lit.has(e.to) &&
        (e.to === id || e.from === id || (anc.has(e.from) && (anc.has(e.to) || e.to === id)) ||
         (dec.has(e.to) && (dec.has(e.from) || e.from === id)));
      e.el.classList.toggle("lit", on);
      e.el.classList.toggle("dim", !on);
      if (on) e.el.style.stroke = `hsla(${byId[e.to].hue},85%,68%,0.9)`;
      else e.el.style.stroke = `hsla(${byId[e.to].hue},55%,60%,0.22)`;
    });
  }
  function clearHighlight() {
    GENRES.forEach((g) => nodeEls[g.id].classList.remove("dim"));
    edgeEls.forEach((e) => {
      e.el.classList.remove("lit", "dim");
      e.el.style.stroke = `hsla(${byId[e.to].hue},55%,60%,0.22)`;
    });
  }

  /* =====================================================================
     PAN & ZOOM
     ===================================================================== */
  const viewport = document.getElementById("viewport");
  const view = { x: 0, y: 0, scale: 1 };
  let minScale = 0.28, maxScale = 2.4;

  function applyView() {
    stage.style.transform = `translate(${view.x}px, ${view.y}px) scale(${view.scale})`;
  }
  function clampView() {
    view.scale = Math.max(minScale, Math.min(maxScale, view.scale));
  }

  function fitInitial() {
    const vw = viewport.clientWidth, vh = viewport.clientHeight;
    const s = Math.min(vw / TOTAL_W, 0.9);
    view.scale = Math.max(minScale, Math.min(s, 0.62));
    view.x = (vw - TOTAL_W * view.scale) / 2;
    view.y = 96;
    applyView();
  }

  /* wheel zoom toward cursor */
  viewport.addEventListener("wheel", (e) => {
    e.preventDefault();
    const rect = viewport.getBoundingClientRect();
    const cx = e.clientX - rect.left, cy = e.clientY - rect.top;
    const factor = Math.exp(-e.deltaY * 0.0016);
    zoomAt(cx, cy, factor);
  }, { passive: false });

  function zoomAt(cx, cy, factor) {
    const prev = view.scale;
    view.scale *= factor;
    clampView();
    const real = view.scale / prev;
    view.x = cx - (cx - view.x) * real;
    view.y = cy - (cy - view.y) * real;
    applyView();
  }

  /* drag pan */
  let dragging = false, last = null, moved = 0;
  viewport.addEventListener("pointerdown", (e) => {
    if (e.target.closest(".node")) return; // node handles its own click
    dragging = true; moved = 0;
    last = { x: e.clientX, y: e.clientY };
    viewport.classList.add("grabbing");
    viewport.setPointerCapture(e.pointerId);
  });
  viewport.addEventListener("pointermove", (e) => {
    if (!dragging) return;
    const dx = e.clientX - last.x, dy = e.clientY - last.y;
    moved += Math.abs(dx) + Math.abs(dy);
    view.x += dx; view.y += dy;
    last = { x: e.clientX, y: e.clientY };
    applyView();
  });
  function endDrag(e) {
    if (!dragging) return;
    dragging = false;
    viewport.classList.remove("grabbing");
  }
  viewport.addEventListener("pointerup", endDrag);
  viewport.addEventListener("pointercancel", endDrag);

  /* touch pinch */
  const touches = new Map();
  let pinchDist = 0, pinchMid = null;
  viewport.addEventListener("touchstart", (e) => {
    if (e.touches.length === 2) {
      const [a, b] = e.touches;
      pinchDist = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
      const rect = viewport.getBoundingClientRect();
      pinchMid = { x: (a.clientX + b.clientX) / 2 - rect.left, y: (a.clientY + b.clientY) / 2 - rect.top };
      dragging = false;
    }
  }, { passive: true });
  viewport.addEventListener("touchmove", (e) => {
    if (e.touches.length === 2 && pinchMid) {
      const [a, b] = e.touches;
      const d = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
      if (pinchDist) zoomAt(pinchMid.x, pinchMid.y, d / pinchDist);
      pinchDist = d;
    }
  }, { passive: true });

  /* zoom buttons */
  document.getElementById("zin").addEventListener("click", () => {
    const r = viewport.getBoundingClientRect(); zoomAt(r.width / 2, r.height / 2, 1.25);
  });
  document.getElementById("zout").addEventListener("click", () => {
    const r = viewport.getBoundingClientRect(); zoomAt(r.width / 2, r.height / 2, 0.8);
  });
  document.getElementById("zfit").addEventListener("click", fitInitial);

  /* center on a node (used by lineage chips) */
  function focusNode(id, targetScale) {
    const g = byId[id];
    const vw = viewport.clientWidth, vh = viewport.clientHeight;
    const s = targetScale || Math.max(view.scale, 0.7);
    view.scale = Math.max(minScale, Math.min(maxScale, s));
    view.x = vw / 2 - g.px * view.scale;
    view.y = vh / 2 - g.py * view.scale;
    animateView();
  }
  function animateView() {
    stage.style.transition = "transform 0.7s cubic-bezier(.2,.9,.25,1)";
    applyView();
    setTimeout(() => (stage.style.transition = ""), 720);
  }

  /* =====================================================================
     FLOATING WINDOW
     ===================================================================== */
  const scrim = document.getElementById("scrim");
  const float = document.getElementById("float");

  function openFloat() { scrim.classList.add("open"); float.classList.add("open"); }
  function closeFloat() {
    scrim.classList.remove("open");
    float.classList.remove("open");
    float.querySelectorAll("iframe").forEach((f) => f.remove()); // stop audio
  }
  scrim.addEventListener("click", closeFloat);
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeFloat(); });

  function esc(s) { return (s || "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c])); }

  function openGenre(g) {
    const parentsHtml = g.parents.length
      ? g.parents.map((p) => `<span class="chip" data-goto="${p}"><span class="arrow">↑</span>${esc(byId[p].name)}</span>`).join("")
      : `<span class="chip" style="cursor:default"><span class="arrow">✦</span>源流 — 親を持たないルーツ</span>`;
    const childrenHtml = (childrenOf[g.id] || []).length
      ? (childrenOf[g.id]).map((c) => `<span class="chip" data-goto="${c}"><span class="arrow">↓</span>${esc(byId[c].name)}</span>`).join("")
      : `<span class="chip" style="cursor:default">— 現時点で末端の枝</span>`;

    const artistsHtml = g.artists.map((a) => {
      const songs = a.songs.map((s) => {
        const q = encodeURIComponent(s.q);
        return `<div class="song" data-q="${esc(s.q)}">
            <div class="play">▶</div>
            <div class="stitle">${esc(s.t)}</div>
            <a class="ext" href="https://www.youtube.com/results?search_query=${q}" target="_blank" rel="noopener" title="YouTubeで開く">↗ YT</a>
          </div>`;
      }).join("");
      return `<div class="artist">
          <p class="aname">${esc(a.name)}</p>
          <p class="anote">${esc(a.note)}</p>
          <div class="songs">${songs}</div>
        </div>`;
    }).join("");

    float.className = "float genre";
    float.innerHTML = `
      <button class="fclose" aria-label="閉じる">✕</button>
      <div class="fhead">
        <div class="glow" style="background:radial-gradient(60% 100% at 30% 0%, hsla(${g.hue},85%,60%,0.8), transparent 70%)"></div>
        <p class="kicker">GENRE · ${esc(g.en)}</p>
        <h2>${esc(g.name)}</h2>
        <p class="en">${esc(g.en)}</p>
        <div><span class="years">${esc(g.years)}</span></div>
        <p class="tagline">“${esc(g.tagline)}”</p>
      </div>
      <div class="fbody">
        <div class="sect">
          <h3><span class="ic">🌱</span>系譜のつながり</h3>
          <div class="lineage-chips">${parentsHtml}</div>
          <div class="lineage-chips" style="margin-top:8px">${childrenHtml}</div>
        </div>
        <div class="sect interp">
          <h3><span class="ic">🧭</span>ジャンルの解釈 — 諸説あり</h3>
          <p>${esc(g.interpretation)}</p>
        </div>
        <div class="sect">
          <h3><span class="ic">🎚️</span>音楽的特徴・様式</h3>
          <p>${esc(g.sound)}</p>
        </div>
        <div class="sect">
          <h3><span class="ic">🖤</span>象徴的なビジュアル・美学</h3>
          <p>${esc(g.visual)}</p>
        </div>
        <div class="sect">
          <h3><span class="ic">🕰️</span>盛んだった年代</h3>
          <p>${esc(g.era)}</p>
        </div>
        <div class="sect">
          <h3><span class="ic">🎸</span>代表アーティスト & 試聴</h3>
          ${artistsHtml}
        </div>
      </div>`;

    float.querySelector(".fclose").addEventListener("click", closeFloat);
    float.querySelectorAll(".chip[data-goto]").forEach((c) => {
      c.addEventListener("click", () => {
        const id = c.getAttribute("data-goto");
        openGenre(byId[id]);
        focusNode(id);
      });
    });
    float.querySelectorAll(".song").forEach((row) => {
      row.addEventListener("click", (e) => {
        if (e.target.closest(".ext")) return;
        toggleSong(row);
      });
    });

    openFloat();
    float.querySelector(".fbody").scrollTop = 0;
  }

  /* inline playback: YouTube 検索埋め込みを試み、確実なフォールバックを併記 */
  function toggleSong(row) {
    const existing = row.nextElementSibling;
    if (existing && existing.classList.contains("player-wrap")) {
      row.classList.remove("playing");
      existing.remove();
      return;
    }
    // close other players in the same artist block
    row.parentElement.querySelectorAll(".player-wrap").forEach((p) => p.remove());
    row.parentElement.querySelectorAll(".song.playing").forEach((s) => s.classList.remove("playing"));

    const q = row.getAttribute("data-q");
    const enc = encodeURIComponent(q);
    const wrap = document.createElement("div");
    wrap.className = "player-wrap";
    wrap.innerHTML = `
      <div class="player">
        <iframe
          src="https://www.youtube.com/embed?listType=search&list=${enc}&autoplay=1&rel=0"
          allow="autoplay; encrypted-media; picture-in-picture"
          allowfullscreen loading="lazy"></iframe>
      </div>
      <p class="player-note">▶ その場で再生を試みています。もし再生されない/違う曲が出る場合は
        <a href="https://www.youtube.com/results?search_query=${enc}" target="_blank" rel="noopener" style="color:var(--accent)">こちらでYouTube検索</a>してください。</p>`;
    row.classList.add("playing");
    row.after(wrap);
    wrap.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  /* era window */
  function openEra(era) {
    float.className = "float era";
    float.innerHTML = `
      <button class="fclose" aria-label="閉じる">✕</button>
      <div class="fhead">
        <div class="glow" style="background:radial-gradient(60% 100% at 30% 0%, rgba(127,227,208,0.7), transparent 70%)"></div>
        <p class="kicker">ERA · TIME & CULTURE</p>
        <h2>${esc(era.title.split(" — ")[0])}</h2>
        <p class="en">${esc(era.label)} — ${esc(era.title.split(" — ")[1] || "")}</p>
      </div>
      <div class="fbody">
        <div class="sect">
          <h3><span class="ic">🌍</span>時代背景 — 音楽と、文化と、世界情勢</h3>
          <p>${esc(era.body)}</p>
        </div>
      </div>`;
    float.querySelector(".fclose").addEventListener("click", closeFloat);
    openFloat();
    float.querySelector(".fbody").scrollTop = 0;
  }

  /* expose for possible external use */
  window.__rock = { openGenre, openEra, byId };

  /* =====================================================================
     DRIFTING SPORES (background particles) — canvas
     ===================================================================== */
  const canvas = document.getElementById("spores");
  const ctx = canvas.getContext("2d");
  let W, H, spores = [];
  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  function makeSpores() {
    const n = Math.min(70, Math.floor((W * H) / 26000));
    spores = [];
    for (let i = 0; i < n; i++) {
      spores.push({
        x: Math.random() * W, y: Math.random() * H,
        r: Math.random() * 2.2 + 0.5,
        vx: (Math.random() - 0.5) * 0.18,
        vy: -Math.random() * 0.28 - 0.05,
        hue: 150 + Math.random() * 140,
        a: Math.random() * 0.4 + 0.1,
        tw: Math.random() * Math.PI * 2,
      });
    }
  }
  function tick() {
    ctx.clearRect(0, 0, W, H);
    for (const s of spores) {
      s.x += s.vx; s.y += s.vy; s.tw += 0.02;
      if (s.y < -10) { s.y = H + 10; s.x = Math.random() * W; }
      if (s.x < -10) s.x = W + 10; else if (s.x > W + 10) s.x = -10;
      const a = s.a * (0.6 + 0.4 * Math.sin(s.tw));
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${s.hue},80%,70%,${a})`;
      ctx.shadowColor = `hsla(${s.hue},80%,70%,${a})`;
      ctx.shadowBlur = 8;
      ctx.fill();
    }
    ctx.shadowBlur = 0;
    requestAnimationFrame(tick);
  }
  resize(); makeSpores(); tick();
  window.addEventListener("resize", () => { resize(); makeSpores(); if (!dragging) fitPreserve(); });
  function fitPreserve() { applyView(); }

  /* =====================================================================
     INTRO
     ===================================================================== */
  const intro = document.getElementById("intro");
  document.getElementById("enter").addEventListener("click", () => {
    intro.classList.add("hidden");
    setTimeout(() => (intro.style.display = "none"), 900);
  });

  fitInitial();
})();
