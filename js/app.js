/* =====================================================================
   ROCK GENEALOGY — APP
   系統樹の描画・パン/ズーム・系譜ハイライト・フロートウインドウ・試聴
   ===================================================================== */
(function () {
  "use strict";

  const SVGNS = "http://www.w3.org/2000/svg";

  /* ---- layout ---- */
  const MARGIN_L = 220, MARGIN_R = 130, NODE_W = 1900, ROW_H = 250, TOP = 150, BOTTOM = 220;
  const maxGen = GENRES.reduce((m, g) => Math.max(m, g.gen), 0);
  const TOTAL_W = MARGIN_L + NODE_W + MARGIN_R;
  const TOTAL_H = TOP + maxGen * ROW_H + BOTTOM;

  const ERA_RANGES = {
    roots: [0, 0], "60s": [1, 3], "70s": [4, 5], "80s": [6, 7], "90s": [8, 8], "00s": [9, 9],
  };

  /* ---- lineage families (muted, cohesive palette) ---- */
  const FAMILY = {
    blues:     { c: "#5f83a0", label: "ブルース〜ハードロック系" },
    rocknroll: { c: "#b17c50", label: "ロックンロール系" },
    folk:      { c: "#a6924f", label: "フォーク/カントリー系" },
    psych:     { c: "#8a6e9e", label: "サイケ/プログレ系" },
    punk:      { c: "#a85f63", label: "パンク/ポストパンク系" },
    metal:     { c: "#63708a", label: "メタル系" },
    newwave:   { c: "#4f948b", label: "ニューウェイヴ/電子系" },
    alt:       { c: "#7f9558", label: "オルタナ/インディー系" },
  };
  const FAM_OF = {
    blues: "blues", blues_rock: "blues",
    rnb_gospel: "rocknroll", rocknroll: "rocknroll", surf: "rocknroll", british_invasion: "rocknroll", garage: "rocknroll",
    country: "folk", folk_rock: "folk",
    psychedelic: "psych", prog: "psych", glam: "psych", krautrock: "psych", post_rock: "psych",
    punk: "punk", hardcore_punk: "punk", post_punk: "punk", goth_rock: "punk", pop_punk: "punk", emo: "punk", emo_pop: "punk", garage_revival: "punk",
    heavy_metal: "metal", hard_rock: "metal", nwobhm: "metal", thrash_metal: "metal", extreme_metal: "metal", glam_metal: "metal", metalcore: "metal", nu_metal: "metal", industrial_rock: "metal",
    new_wave: "newwave", synth_pop: "newwave",
    college_alt: "alt", grunge: "alt", shoegaze: "alt", britpop: "alt", indie_rock: "alt",
  };
  function famColor(id) { return FAMILY[FAM_OF[id] || "alt"].c; }

  function hexToRgb(hex) {
    const n = parseInt(hex.slice(1), 16);
    return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
  }
  function lighten(hex, amt) {
    const { r, g, b } = hexToRgb(hex);
    const l = (c) => Math.round(c + (255 - c) * amt);
    return `rgb(${l(r)},${l(g)},${l(b)})`;
  }
  function rgba(hex, a) { const { r, g, b } = hexToRgb(hex); return `rgba(${r},${g},${b},${a})`; }

  /* ---- index / positions ---- */
  const byId = {};
  GENRES.forEach((g) => (byId[g.id] = g));
  GENRES.forEach((g) => { g.px = MARGIN_L + g.x * NODE_W; g.py = TOP + g.gen * ROW_H; });

  const _byGen = {};
  GENRES.forEach((g) => ((_byGen[g.gen] = _byGen[g.gen] || []).push(g)));
  Object.values(_byGen).forEach((arr) =>
    arr.sort((a, b) => a.x - b.x).forEach((g, i) => (g.tier = arr.length > 4 ? i % 2 : 0)));

  const childrenOf = {};
  GENRES.forEach((g) => (childrenOf[g.id] = []));
  GENRES.forEach((g) => g.parents.forEach((p) => childrenOf[p] && childrenOf[p].push(g.id)));

  function ancestors(id, acc) {
    acc = acc || new Set();
    (byId[id].parents || []).forEach((p) => { if (!acc.has(p)) { acc.add(p); ancestors(p, acc); } });
    return acc;
  }
  function descendants(id, acc) {
    acc = acc || new Set();
    (childrenOf[id] || []).forEach((c) => { if (!acc.has(c)) { acc.add(c); descendants(c, acc); } });
    return acc;
  }

  /* ---- SVG scaffold ---- */
  const stage = document.getElementById("stage");
  const svg = document.createElementNS(SVGNS, "svg");
  svg.setAttribute("class", "tree");
  svg.setAttribute("width", TOTAL_W);
  svg.setAttribute("height", TOTAL_H);
  svg.setAttribute("viewBox", `0 0 ${TOTAL_W} ${TOTAL_H}`);
  stage.appendChild(svg);

  const defs = document.createElementNS(SVGNS, "defs");
  svg.appendChild(defs);

  function el(name, attrs) {
    const e = document.createElementNS(SVGNS, name);
    for (const k in attrs) e.setAttribute(k, attrs[k]);
    return e;
  }
  function gEl(cls) { return el("g", { class: cls }); }

  /* per-family gradients (subtle, single-hue) */
  Object.entries(FAMILY).forEach(([fam, info]) => {
    const halo = el("radialGradient", { id: "halo-" + fam });
    halo.appendChild(el("stop", { offset: "0%", "stop-color": rgba(info.c, 0.42) }));
    halo.appendChild(el("stop", { offset: "60%", "stop-color": rgba(info.c, 0.12) }));
    halo.appendChild(el("stop", { offset: "100%", "stop-color": rgba(info.c, 0) }));
    defs.appendChild(halo);

    const cell = el("radialGradient", { id: "cell-" + fam, cx: "42%", cy: "38%", r: "72%" });
    cell.appendChild(el("stop", { offset: "0%", "stop-color": lighten(info.c, 0.22) }));
    cell.appendChild(el("stop", { offset: "100%", "stop-color": info.c }));
    defs.appendChild(cell);
  });

  const gBands = gEl("bands"), gEdges = gEl("edges"), gNodes = gEl("nodes");
  svg.appendChild(gBands); svg.appendChild(gEdges); svg.appendChild(gNodes);

  /* ---- era bands (clickable left gutter) ---- */
  ERAS.forEach((era) => {
    const [gs, ge] = ERA_RANGES[era.id];
    const yTop = TOP + gs * ROW_H - ROW_H / 2;
    const yBot = TOP + ge * ROW_H + ROW_H / 2;
    const grp = gEl("era-group");

    grp.appendChild(el("rect", { class: "band-bg", x: 0, y: yTop, width: TOTAL_W, height: yBot - yTop, fill: "rgba(255,255,255,0.014)" }));
    grp.appendChild(el("line", { class: "band-line", x1: 0, y1: yTop, x2: TOTAL_W, y2: yTop, stroke: "rgba(255,255,255,0.09)", "stroke-dasharray": "1 9" }));

    const ly = yTop + 30;
    const lab = el("text", { class: "era-label", x: 34, y: ly });
    lab.textContent = era.label;
    const ttl = el("text", { class: "era-title", x: 34, y: ly + 18 });
    ttl.textContent = era.title.split(" — ")[1] || "";
    const caret = el("text", { class: "era-caret", x: 34, y: ly + 36 });
    caret.textContent = "時代背景 ›";
    grp.appendChild(lab); grp.appendChild(ttl); grp.appendChild(caret);

    // transparent hit target over the left gutter
    const hit = el("rect", { class: "era-hit", x: 0, y: yTop, width: MARGIN_L - 20, height: yBot - yTop });
    grp.appendChild(hit);
    grp.addEventListener("click", () => openEra(era));
    gBands.appendChild(grp);
  });

  /* ---- edges ---- */
  const edgeEls = [];
  GENRES.forEach((child) => {
    child.parents.forEach((pid) => {
      const p = byId[pid]; if (!p) return;
      const x1 = p.px, y1 = p.py, x2 = child.px, y2 = child.py, my = (y1 + y2) / 2;
      const d = `M ${x1} ${y1} C ${x1} ${my}, ${x2} ${my}, ${x2} ${y2}`;
      const path = el("path", { class: "edge", d, stroke: rgba(famColor(child.id), 0.28) });
      const len = Math.hypot(x2 - x1, y2 - y1) + Math.abs(my - y1) * 1.4;
      path.style.strokeDasharray = len;
      path.style.strokeDashoffset = len;
      gEdges.appendChild(path);
      edgeEls.push({ el: path, from: pid, to: child.id });
    });
  });

  /* ---- nodes ---- */
  const nodeEls = {};
  GENRES.forEach((g, i) => {
    const fam = FAM_OF[g.id] || "alt";
    const col = famColor(g.id);
    const grp = el("g", { class: "node" });
    grp.setAttribute("transform", `translate(${g.px}, ${g.py})`);

    const R = g.gen === 0 ? 28 : 24;

    if (g.tier) grp.appendChild(el("line", { x1: 0, y1: R, x2: 0, y2: R + 32, stroke: rgba(col, 0.32), "stroke-width": 1 }));

    const halo = el("circle", { class: "halo breathe", r: R + 20, cx: 0, cy: 0, fill: `url(#halo-${fam})` });
    halo.style.setProperty("--dur", (5 + (i % 5)) + "s");
    halo.style.setProperty("--delay", (i % 7) * 0.5 + "s");

    const cellG = gEl("cell");
    cellG.appendChild(el("circle", { class: "ring", r: R + 4, cx: 0, cy: 0, fill: "none", stroke: rgba(col, 0.45), "stroke-width": 1 }));
    cellG.appendChild(el("circle", { class: "cell-core", r: R, cx: 0, cy: 0, fill: `url(#cell-${fam})` }));
    cellG.appendChild(el("circle", { r: R * 0.36, cx: -R * 0.22, cy: -R * 0.24, fill: "rgba(255,255,255,0.20)" }));

    const ly = R + 20 + (g.tier ? 32 : 0);
    const label = el("text", { class: "label", x: 0, y: ly, "text-anchor": "middle" });
    label.textContent = g.name;
    const labelEn = el("text", { class: "label-en", x: 0, y: ly + 14, "text-anchor": "middle" });
    labelEn.textContent = g.en;

    grp.appendChild(halo); grp.appendChild(cellG); grp.appendChild(label); grp.appendChild(labelEn);
    gNodes.appendChild(grp);
    nodeEls[g.id] = grp;

    grp.addEventListener("mouseenter", () => { if (hoverEnabled) highlight(g.id); });
    grp.addEventListener("mouseleave", () => { if (hoverEnabled) clearHighlight(); });
    grp.addEventListener("click", () => openGenre(g));
  });

  /* reveal edges (growth) */
  requestAnimationFrame(() => setTimeout(() => {
    edgeEls.forEach((e, i) => {
      e.el.style.transition = `stroke-dashoffset 1.3s ease ${(i % 18) * 0.045 + 0.15}s, stroke 0.3s ease, stroke-width 0.3s ease, opacity 0.3s ease`;
      e.el.style.strokeDashoffset = "0";
    });
  }, 80));

  /* ---- lineage highlight ---- */
  function highlight(id) {
    const anc = ancestors(id), dec = descendants(id);
    const lit = new Set([id, ...anc, ...dec]);
    GENRES.forEach((g) => nodeEls[g.id].classList.toggle("dim", !lit.has(g.id)));
    edgeEls.forEach((e) => {
      const on = lit.has(e.from) && lit.has(e.to) &&
        (e.to === id || e.from === id ||
         (anc.has(e.from) && (anc.has(e.to) || e.to === id)) ||
         (dec.has(e.to) && (dec.has(e.from) || e.from === id)));
      e.el.classList.toggle("lit", on);
      e.el.classList.toggle("dim", !on);
      e.el.setAttribute("stroke", on ? rgba(famColor(e.to), 0.85) : rgba(famColor(e.to), 0.28));
    });
  }
  function clearHighlight() {
    GENRES.forEach((g) => nodeEls[g.id].classList.remove("dim"));
    edgeEls.forEach((e) => {
      e.el.classList.remove("lit", "dim");
      e.el.setAttribute("stroke", rgba(famColor(e.to), 0.28));
    });
  }

  /* =====================================================================
     PAN / ZOOM / INPUT  (threshold drag, unified pointer, no click steal)
     ===================================================================== */
  const viewport = document.getElementById("viewport");
  const view = { x: 0, y: 0, scale: 1 };
  const minScale = 0.28, maxScale = 2.2, DRAG_THRESH = 6;
  const hoverEnabled = window.matchMedia && window.matchMedia("(hover: hover)").matches;

  function applyView() { stage.style.transform = `translate(${view.x}px, ${view.y}px) scale(${view.scale})`; }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }

  function fitInitial() {
    const vw = viewport.clientWidth;
    view.scale = clamp(Math.min(vw / TOTAL_W, 0.62), minScale, 0.62);
    view.x = (vw - TOTAL_W * view.scale) / 2;
    view.y = 96;
    applyView();
  }
  function zoomAt(cx, cy, factor) {
    const prev = view.scale;
    view.scale = clamp(view.scale * factor, minScale, maxScale);
    const real = view.scale / prev;
    view.x = cx - (cx - view.x) * real;
    view.y = cy - (cy - view.y) * real;
    applyView();
  }

  viewport.addEventListener("wheel", (e) => {
    e.preventDefault();
    const rect = viewport.getBoundingClientRect();
    zoomAt(e.clientX - rect.left, e.clientY - rect.top, Math.exp(-e.deltaY * 0.0015));
  }, { passive: false });

  const pointers = new Map();
  let panStart = null, pinch = null, didDrag = false, suppressClick = false;
  const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
  const mid = (a, b) => ({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 });

  viewport.addEventListener("pointerdown", (e) => {
    if (e.button != null && e.button !== 0 && e.pointerType === "mouse") return;
    suppressClick = false;
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.size === 1) {
      panStart = { x: e.clientX, y: e.clientY, vx: view.x, vy: view.y };
      didDrag = false;
    } else if (pointers.size === 2) {
      const p = [...pointers.values()];
      pinch = { dist: dist(p[0], p[1]) };
      panStart = null;
      didDrag = true;
    }
  });

  window.addEventListener("pointermove", (e) => {
    if (!pointers.has(e.pointerId)) return;
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.size === 2 && pinch) {
      const p = [...pointers.values()];
      const d = dist(p[0], p[1]);
      const m = mid(p[0], p[1]);
      const rect = viewport.getBoundingClientRect();
      if (pinch.dist) zoomAt(m.x - rect.left, m.y - rect.top, d / pinch.dist);
      pinch.dist = d;
      return;
    }
    if (pointers.size === 1 && panStart) {
      const dx = e.clientX - panStart.x, dy = e.clientY - panStart.y;
      if (!didDrag && Math.hypot(dx, dy) < DRAG_THRESH) return;
      if (!didDrag) { didDrag = true; viewport.classList.add("grabbing"); }
      view.x = panStart.vx + dx;
      view.y = panStart.vy + dy;
      applyView();
    }
  });

  function releasePointer(e) {
    if (!pointers.has(e.pointerId)) return;
    pointers.delete(e.pointerId);
    if (pointers.size < 2) pinch = null;
    if (pointers.size === 0) {
      viewport.classList.remove("grabbing");
      if (didDrag) suppressClick = true;
      panStart = null;
    } else if (pointers.size === 1) {
      const p = [...pointers.values()][0];
      panStart = { x: p.x, y: p.y, vx: view.x, vy: view.y };
    }
  }
  window.addEventListener("pointerup", releasePointer);
  window.addEventListener("pointercancel", releasePointer);

  // swallow the click that ends a drag, so it doesn't open a node/era
  viewport.addEventListener("click", (e) => {
    if (suppressClick) { e.stopPropagation(); e.preventDefault(); suppressClick = false; }
  }, true);

  document.getElementById("zin").addEventListener("click", () => {
    const r = viewport.getBoundingClientRect(); zoomAt(r.width / 2, r.height / 2, 1.25);
  });
  document.getElementById("zout").addEventListener("click", () => {
    const r = viewport.getBoundingClientRect(); zoomAt(r.width / 2, r.height / 2, 0.8);
  });
  document.getElementById("zfit").addEventListener("click", fitInitial);

  function focusNode(id) {
    const g = byId[id];
    const vw = viewport.clientWidth, vh = viewport.clientHeight;
    view.scale = clamp(Math.max(view.scale, 0.72), minScale, maxScale);
    view.x = vw / 2 - g.px * view.scale;
    view.y = vh / 2 - g.py * view.scale;
    stage.style.transition = "transform 0.6s cubic-bezier(.2,.8,.3,1)";
    applyView();
    setTimeout(() => (stage.style.transition = ""), 640);
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
    float.querySelectorAll("iframe").forEach((f) => f.remove());
  }
  scrim.addEventListener("click", closeFloat);
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeFloat(); });

  function esc(s) { return (s || "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c])); }

  function openGenre(g) {
    clearHighlight();
    const col = famColor(g.id);
    const parents = g.parents.length
      ? g.parents.map((p) => `<span class="chip" data-goto="${p}"><span class="arrow">↑</span>${esc(byId[p].name)}</span>`).join("")
      : `<span class="chip static"><span class="arrow">✦</span>源流 — 親を持たないルーツ</span>`;
    const kids = (childrenOf[g.id] || []).length
      ? childrenOf[g.id].map((c) => `<span class="chip" data-goto="${c}"><span class="arrow">↓</span>${esc(byId[c].name)}</span>`).join("")
      : `<span class="chip static">— 現時点で末端の枝</span>`;

    const artists = g.artists.map((a) => {
      const songs = a.songs.map((s) => {
        const q = encodeURIComponent(s.q);
        return `<div class="song" data-q="${esc(s.q)}" data-sp="${esc(s.sp || "")}">
            <div class="play">▶</div>
            <div class="stitle">${esc(s.t)}</div>
            <a class="ext" href="https://open.spotify.com/search/${q}" target="_blank" rel="noopener" title="Spotifyで開く">Spotify ↗</a>
          </div>`;
      }).join("");
      return `<div class="artist"><p class="aname">${esc(a.name)}</p><p class="anote">${esc(a.note)}</p><div class="songs">${songs}</div></div>`;
    }).join("");

    float.className = "float genre";
    float.innerHTML = `
      <button class="fclose" aria-label="閉じる">✕</button>
      <div class="fhead">
        <span class="accent-bar" style="background:${col}"></span>
        <p class="kicker">GENRE · ${esc(g.en)}</p>
        <h2>${esc(g.name)}</h2>
        <p class="en">${esc(g.en)}</p>
        <div><span class="years">${esc(g.years)}</span></div>
        <p class="tagline">${esc(g.tagline)}</p>
      </div>
      <div class="fbody">
        <div class="sect">
          <h3><span class="ic">🌱</span>系譜のつながり</h3>
          <div class="lineage-chips">${parents}</div>
          <div class="lineage-chips" style="margin-top:8px">${kids}</div>
        </div>
        <div class="sect interp">
          <h3><span class="ic">🧭</span>ジャンルの解釈 — 諸説あり</h3>
          <p>${esc(g.interpretation)}</p>
        </div>
        <div class="sect"><h3><span class="ic">🎚️</span>音楽的特徴・様式</h3><p>${esc(g.sound)}</p></div>
        <div class="sect"><h3><span class="ic">◐</span>象徴的なビジュアル・美学</h3><p>${esc(g.visual)}</p></div>
        <div class="sect"><h3><span class="ic">🕰️</span>盛んだった年代</h3><p>${esc(g.era)}</p></div>
        <div class="sect"><h3><span class="ic">♪</span>代表アーティスト & 試聴</h3>${artists}</div>
      </div>`;

    float.querySelector(".fclose").addEventListener("click", closeFloat);
    float.querySelectorAll(".chip[data-goto]").forEach((c) =>
      c.addEventListener("click", () => { const id = c.getAttribute("data-goto"); openGenre(byId[id]); focusNode(id); }));
    float.querySelectorAll(".song").forEach((row) =>
      row.addEventListener("click", (e) => { if (e.target.closest(".ext")) return; toggleSong(row); }));

    openFloat();
    float.querySelector(".fbody").scrollTop = 0;
  }

  /* Spotify inline playback */
  function toggleSong(row) {
    const next = row.nextElementSibling;
    if (next && next.classList.contains("player-wrap")) { row.classList.remove("playing"); next.remove(); return; }
    row.parentElement.querySelectorAll(".player-wrap").forEach((p) => p.remove());
    row.parentElement.querySelectorAll(".song.playing").forEach((s) => s.classList.remove("playing"));

    const q = encodeURIComponent(row.getAttribute("data-q"));
    const sp = row.getAttribute("data-sp");
    const wrap = document.createElement("div");
    wrap.className = "player-wrap";
    if (sp) {
      wrap.innerHTML = `
        <div class="player">
          <iframe style="height:152px" src="https://open.spotify.com/embed/track/${sp}?utm_source=generator"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
        </div>
        <p class="player-note">Spotifyのプレビュー（約30秒／ログイン時はフル尺）。
          <a href="https://open.spotify.com/search/${q}" target="_blank" rel="noopener">Spotifyアプリで開く</a></p>`;
    } else {
      wrap.innerHTML = `<p class="player-note">この曲は
        <a href="https://open.spotify.com/search/${q}" target="_blank" rel="noopener">Spotifyで検索して再生</a> できます。</p>`;
    }
    row.classList.add("playing");
    row.after(wrap);
    wrap.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  /* era window */
  function openEra(era) {
    clearHighlight();
    float.className = "float era";
    float.innerHTML = `
      <button class="fclose" aria-label="閉じる">✕</button>
      <div class="fhead">
        <span class="accent-bar" style="background:var(--accent)"></span>
        <p class="kicker">ERA · TIME &amp; CULTURE</p>
        <h2>${esc(era.title.split(" — ")[0])}</h2>
        <p class="en">${esc(era.label)} — ${esc(era.title.split(" — ")[1] || "")}</p>
      </div>
      <div class="fbody">
        <div class="sect"><h3><span class="ic">🌍</span>時代背景 — 音楽と、文化と、世界情勢</h3><p>${esc(era.body)}</p></div>
      </div>`;
    float.querySelector(".fclose").addEventListener("click", closeFloat);
    openFloat();
    float.querySelector(".fbody").scrollTop = 0;
  }

  window.__rock = { openGenre, openEra, byId, FAMILY };

  /* =====================================================================
     DRIFTING SPORES (calm background particles)
     ===================================================================== */
  const canvas = document.getElementById("spores");
  const ctx = canvas.getContext("2d");
  let W, H, spores = [];
  function resize() { W = canvas.width = innerWidth; H = canvas.height = innerHeight; }
  function makeSpores() {
    const n = Math.min(46, Math.floor((W * H) / 40000));
    spores = [];
    for (let i = 0; i < n; i++) spores.push({
      x: Math.random() * W, y: Math.random() * H, r: Math.random() * 1.8 + 0.4,
      vx: (Math.random() - 0.5) * 0.12, vy: -Math.random() * 0.2 - 0.03,
      a: Math.random() * 0.22 + 0.05, tw: Math.random() * Math.PI * 2,
    });
  }
  function tick() {
    ctx.clearRect(0, 0, W, H);
    for (const s of spores) {
      s.x += s.vx; s.y += s.vy; s.tw += 0.015;
      if (s.y < -10) { s.y = H + 10; s.x = Math.random() * W; }
      if (s.x < -10) s.x = W + 10; else if (s.x > W + 10) s.x = -10;
      const a = s.a * (0.55 + 0.45 * Math.sin(s.tw));
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(160,180,178,${a})`;
      ctx.fill();
    }
    requestAnimationFrame(tick);
  }
  resize(); makeSpores(); tick();
  addEventListener("resize", () => { resize(); makeSpores(); applyView(); });

  /* intro */
  const intro = document.getElementById("intro");
  document.getElementById("enter").addEventListener("click", () => {
    intro.classList.add("hidden");
    setTimeout(() => (intro.style.display = "none"), 700);
  });

  fitInitial();
})();
