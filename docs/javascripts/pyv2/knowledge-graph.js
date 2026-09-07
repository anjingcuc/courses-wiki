/* ============================================================
 * knowledge-graph.js — 课程知识图谱（Canvas 力导向图）
 * <div class="pyv2-graph-wrap">
 *   <canvas id="pyv2-kgraph"></canvas>
 *   <div class="pyv2-graph-tip"></div>
 *   <script type="application/json" id="pyv2-kgraph-data">{...}</script>
 * </div>
 * 数据: modules[] / lessons[] / links[] / crosslinks[]
 * ============================================================ */
(function () {
  "use strict";

  function init() {
    var canvas = document.getElementById("pyv2-kgraph");
    var wrap = canvas ? canvas.parentElement : null;
    var tip = wrap ? wrap.querySelector(".pyv2-graph-tip") : null;
    var dataEl = document.getElementById("pyv2-kgraph-data");
    if (!canvas || !dataEl) return;
    // 防重复初始化：loader 的首次 boot 与 document$ 初次发射可能各触发一次 init，
    // 二次 init 会叠加 ctx.scale 导致节点画到画布外（表现为图谱空白）
    if (canvas.dataset.kgReady) return;
    canvas.dataset.kgReady = "1";

    var data;
    try { data = JSON.parse(dataEl.textContent); } catch (e) {
      console.error("[pyv2] 知识图谱数据解析失败:", e);
      return;
    }

    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    // 浅色主题下加深节点填充色，保证白色文字/白描边有足够对比度
    function shade(hex, f) {
      var v = hex.replace("#", "");
      function ch(i) {
        return Math.max(0, Math.min(255, Math.round(parseInt(v.substr(i, 2), 16) * f)));
      }
      return "rgb(" + ch(0) + "," + ch(2) + "," + ch(4) + ")";
    }
    var W = wrap.clientWidth || 900;
    var H = canvas.height || 520;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.height = H + "px";
    var ctx = canvas.getContext("2d");
    ctx.scale(dpr, dpr);

    /* ---- 构建节点 ---- */
    var nodes = [];
    var byId = {};
    var ringR = Math.min(W, H) * 0.34;
    var cx = W / 2, cy = H / 2;

    (data.modules || []).forEach(function (m, i) {
      var ang = (i / data.modules.length) * Math.PI * 2 - Math.PI / 2;
      var n = {
        id: m.id, label: m.label, kind: "module", color: m.color,
        r: m.r || 22, desc: m.desc || "", href: m.href || "",
        x: cx + Math.cos(ang) * ringR, y: cy + Math.sin(ang) * ringR,
        vx: 0, vy: 0, fixed: false
      };
      nodes.push(n); byId[m.id] = n;
    });

    (data.lessons || []).forEach(function (l) {
      var m = byId[l.m];
      if (!m) return;
      var n = {
        id: l.id, label: l.label, kind: "lesson", color: m.color,
        r: l.big ? 11 : 7, desc: l.desc || "", href: "",
        x: m.x + (Math.random() - 0.5) * 90, y: m.y + (Math.random() - 0.5) * 90,
        vx: 0, vy: 0, fixed: false
      };
      nodes.push(n); byId[l.id] = n;
    });

    var links = [];
    (data.links || []).forEach(function (pair) {
      var a = byId[pair[0]], b = byId[pair[1]];
      if (a && b) links.push({ a: a, b: b, kind: "module" });
    });
    (data.crosslinks || []).forEach(function (pair) {
      var a = byId[pair[0]], b = byId[pair[1]];
      if (a && b) links.push({ a: a, b: b, kind: "cross" });
    });

    /* ---- 悬停 / 拖拽 / 点击 ---- */
    var hover = null, drag = null, mouse = { x: -999, y: -999 };

    function pos(e) {
      var rect = canvas.getBoundingClientRect();
      var t = e.touches ? e.touches[0] : e;
      return { x: t.clientX - rect.left, y: t.clientY - rect.top };
    }
    function pick(p) {
      for (var i = nodes.length - 1; i >= 0; i--) {
        var n = nodes[i];
        var dx = p.x - n.x, dy = p.y - n.y;
        if (dx * dx + dy * dy <= (n.r + 5) * (n.r + 5)) return n;
      }
      return null;
    }

    function onMove(e) {
      mouse = pos(e);
      if (drag) {
        drag.x = mouse.x; drag.y = mouse.y;
        drag.vx = 0; drag.vy = 0;
        e.preventDefault();
        return;
      }
      hover = pick(mouse);
      canvas.style.cursor = hover ? (hover.href ? "pointer" : "grab") : "grab";
      if (tip) {
        if (hover) {
          tip.innerHTML = "<b>" + hover.label + "</b>" + (hover.desc ? "<br>" + hover.desc : "") +
            (hover.href ? "<br><span style='color:#0369a1;font-weight:600'>点击进入 →</span>" : "");
          tip.style.display = "block";
          var tw = tip.offsetWidth;
          tip.style.left = Math.min(mouse.x + 14, W - tw - 10) + "px";
          tip.style.top = Math.max(mouse.y - 10, 6) + "px";
        } else tip.style.display = "none";
      }
    }
    function onDown(e) {
      var p = pos(e);
      var n = pick(p);
      if (n) { drag = n; drag.fixed = true; }
    }
    function onUp(e) {
      if (drag) {
        var moved = Math.abs(drag.x - mouse.x) + Math.abs(drag.y - mouse.y) < 4;
        if (moved && drag.href) window.location.href = drag.href;
        drag.fixed = false;
        drag = null;
      }
    }
    canvas.addEventListener("mousemove", onMove);
    canvas.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    canvas.addEventListener("touchstart", function (e) { onDown(e); onMove(e); }, { passive: false });
    canvas.addEventListener("touchmove", function (e) { onMove(e); }, { passive: false });
    canvas.addEventListener("touchend", onUp);

    /* ---- 物理模拟 ---- */
    function step() {
      // 模块节点锚定在环形位置附近
      nodes.forEach(function (n) {
        if (n.kind === "module") {
          var tx = n.x0 || (n.x0 = n.x), ty = n.y0 || (n.y0 = n.y);
          if (!drag || drag !== n) {
            n.vx += (tx - n.x) * 0.004;
            n.vy += (ty - n.y) * 0.004;
          }
        } else {
          n.vx += (cx - n.x) * 0.0006;
          n.vy += (cy - n.y) * 0.0006;
        }
      });
      // 斥力
      for (var i = 0; i < nodes.length; i++) {
        for (var j = i + 1; j < nodes.length; j++) {
          var a = nodes[i], b = nodes[j];
          var dx = b.x - a.x, dy = b.y - a.y;
          var d2 = dx * dx + dy * dy || 0.01;
          if (d2 > 62500) continue;
          var minD = (a.r + b.r) * (a.kind === "module" && b.kind === "module" ? 2.6 : 1.15);
          var f = Math.min(2600 / d2, 3.2);
          var d = Math.sqrt(d2);
          var fx = (dx / d) * f, fy = (dy / d) * f;
          a.vx -= fx; a.vy -= fy; b.vx += fx; b.vy += fy;
          if (d < minD) {
            var push = (minD - d) * 0.12;
            a.vx -= (dx / d) * push; a.vy -= (dy / d) * push;
            b.vx += (dx / d) * push; b.vy += (dy / d) * push;
          }
        }
      }
      // 弹簧
      links.forEach(function (l) {
        var dx = l.b.x - l.a.x, dy = l.b.y - l.a.y;
        var d = Math.sqrt(dx * dx + dy * dy) || 0.01;
        var rest = l.kind === "cross" ? 190 : (l.a.kind === "lesson" ? 58 : 150);
        var f = (d - rest) * (l.kind === "cross" ? 0.0035 : 0.02);
        var fx = (dx / d) * f, fy = (dy / d) * f;
        l.a.vx += fx; l.a.vy += fy;
        l.b.vx -= fx; l.b.vy -= fy;
      });
      // 积分
      nodes.forEach(function (n) {
        if (drag === n) return;
        n.vx *= 0.86; n.vy *= 0.86;
        n.x += Math.max(-6, Math.min(6, n.vx));
        n.y += Math.max(-6, Math.min(6, n.vy));
        n.x = Math.max(n.r + 4, Math.min(W - n.r - 4, n.x));
        n.y = Math.max(n.r + 4, Math.min(H - n.r - 4, n.y));
      });
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);

      // 边
      links.forEach(function (l) {
        var active = hover && (l.a === hover || l.b === hover);
        ctx.beginPath();
        ctx.moveTo(l.a.x, l.a.y);
        var mx = (l.a.x + l.b.x) / 2, my = (l.a.y + l.b.y) / 2;
        ctx.quadraticCurveTo(mx, my, l.b.x, l.b.y);
        if (l.kind === "cross") {
          ctx.setLineDash([5, 5]);
          ctx.strokeStyle = active ? "rgba(185,28,28,.85)" : "rgba(220,38,38,.3)";
        } else {
          ctx.setLineDash([]);
          ctx.strokeStyle = active ? "rgba(2,132,199,.9)" : "rgba(100,116,139,.35)";
        }
        ctx.lineWidth = active ? 2 : 1;
        ctx.stroke();
        ctx.setLineDash([]);
      });

      // 节点
      nodes.forEach(function (n) {
        var active = hover === n;
        var glow = n.kind === "module" ? 26 : 10;
        if (n.kind === "module" || active) {
          var grad = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r + glow);
          grad.addColorStop(0, n.color + (active ? "88" : "33"));
          grad.addColorStop(1, "transparent");
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(n.x, n.y, n.r + glow, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = n.kind === "module" ? shade(n.color, 0.74) : shade(n.color, active ? 1 : 0.82);
        ctx.fill();
        ctx.lineWidth = n.kind === "module" ? 2.5 : 1.8;
        ctx.strokeStyle = "#ffffff";
        ctx.stroke();

        // 标签
        ctx.textAlign = "center";
        if (n.kind === "module") {
          ctx.font = "700 13px 'Noto Sans SC', sans-serif";
          ctx.fillStyle = "#ffffff";
          ctx.shadowColor = "rgba(15,23,42,.3)";
          ctx.shadowBlur = 3;
          ctx.fillText(n.label.split(" ")[0], n.x, n.y + 4.5);
          ctx.shadowBlur = 0;
          ctx.font = "11px 'Noto Sans SC', sans-serif";
          ctx.fillStyle = "rgba(51,65,85,.95)";
          ctx.fillText(n.label.split(" ").slice(1).join(" ") || "", n.x, n.y + n.r + 15);
        } else if (n.big || active) {
          ctx.font = (n.big ? "600 " : "") + "11px 'Noto Sans SC', sans-serif";
          ctx.fillStyle = active ? "#0c4a6e" : "rgba(71,85,105,.85)";
          ctx.fillText(n.label, n.x, n.y - n.r - 6);
        }
      });
    }

    function tick() { step(); draw(); requestAnimationFrame(tick); }
    tick();

    if (window.ResizeObserver) {
      new ResizeObserver(function () {
        var w = wrap.clientWidth;
        if (Math.abs(w - W) > 40) {
          W = w; canvas.width = W * dpr; canvas.height = H * dpr;
          canvas.style.height = H + "px";
          ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        }
      }).observe(wrap);
    }
  }

  if (window.PYV2) PYV2.register("kgraph", init);
  else if (document.readyState !== "loading") init();
  else document.addEventListener("DOMContentLoaded", init);
})();
