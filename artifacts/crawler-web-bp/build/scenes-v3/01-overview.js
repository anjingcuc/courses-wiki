/* ============================================================
   SCENE 01 · 总图（sc-overview）
   点击图内阶段节点 → 图下缘三栏同步；hover 矩阵高亮行列
   入场 ≤1.2s
   ============================================================ */
BP.scene("sc-overview", function (root, gsap, api) {
  "use strict";

  var q = function (s) { return root.querySelector(s); };
  var qa = function (s) { return Array.prototype.slice.call(root.querySelectorAll(s)); };
  var reduced = !!(api && api.reduced);

  var cur = 0;
  var tl = null;

  /* ---------------- 四层读数 ---------------- */
  var RO = [
    {
      a: "磁盘上（构建时）", ad: "静态站生成器预渲染成 .html",
      b: "完整 HTML", bd: "数据已经在标签里",
      c: "requests + BeautifulSoup", cd: "一次 GET 就能直接解析",
      v: '同一条 <span class="mono">requests.get()</span>，在 ①② 能拿到完整数据；到整站前端渲染（③ 的极端）才只剩空壳。'
    },
    {
      a: "服务器上，每次请求现拼", ad: "模板渲染（CGI → WSGI 的细节在 03）",
      b: "完整 HTML", bd: "数据已经在标签里，只是按人不同",
      c: "requests + BeautifulSoup", cd: "把 URL 参数 / Cookie 拼对就行",
      v: '后端动态 ≠ 前端渲染：HTML 在服务器就拼好了；B 站首页的个性化正是这一层。'
    },
    {
      a: "浏览器里，JS 现场改", ad: "首屏 HTML 已有内容，JS 只做局部更新",
      b: "首屏 HTML + 后续 XHR（JSON）", bd: "首屏能拿，实时值要另找接口",
      c: "首屏 requests；实时值抓 XHR；整站 SPA 才上 headless", cd: "先看首屏里有没有你要的那个数",
      v: "局部 AJAX 的首屏是有内容的；只有 SPA / 整站前端渲染，首屏才是空壳。"
    },
    {
      a: "不在 HTML 里", ad: "AJAX 背后的数据通道，与 ③ 同期",
      b: "JSON（没有 HTML）", bd: "数据在接口里，不在页面里",
      c: "直接打接口", cd: "requests.get(url).json()，零解析",
      v: "④ 不是更晚的年代，而是 ③ 的另一面：同一批数据，换一条更省事的通道。"
    }
  ];

  /* ---------------- 读数渲染 ---------------- */
  var els = {
    a: q("#ovRoA"), ad: q("#ovRoAd"),
    b: q("#ovRoB"), bd: q("#ovRoBd"),
    c: q("#ovRoC"), cd: q("#ovRoCd"),
    v: q("#ovRoV")
  };

  function paint(i, animate) {
    cur = i;
    var d = RO[i];
    qa(".ov-stage").forEach(function (el, k) {
      var on = k === i;
      el.classList.toggle("is-on", on);
      el.setAttribute("aria-pressed", on ? "true" : "false");
    });
    els.a.textContent = d.a;
    els.ad.textContent = d.ad;
    els.b.textContent = d.b;
    els.bd.textContent = d.bd;
    els.c.textContent = d.c;
    els.cd.textContent = d.cd;
    els.v.innerHTML = d.v;

    if (animate && gsap && !reduced) {
      gsap.fromTo(qa(".ov-ro-cell"), { opacity: 0, y: 8 },
        { opacity: 1, y: 0, duration: .32, stagger: .05, ease: "power2.out", clearProps: "transform,opacity" });
      gsap.fromTo(q(".ov-verdict"), { opacity: 0 }, { opacity: 1, duration: .3, clearProps: "opacity" });
    }
  }

  /* ---------------- 矩阵行列高亮 ---------------- */
  function mxHi(r, c) {
    qa(".ov-mx-c").forEach(function (el) {
      el.classList.toggle("is-row", r >= 0 && +el.getAttribute("data-row") === r);
      el.classList.toggle("is-col", c >= 0 && +el.getAttribute("data-col") === c);
    });
    qa(".ov-mx-rhd").forEach(function (el) { el.classList.toggle("is-on", r >= 0 && +el.getAttribute("data-row") === r); });
    qa(".ov-mx-chd").forEach(function (el) { el.classList.toggle("is-on", c >= 0 && +el.getAttribute("data-col") === c); });
  }

  /* ---------------- 入场 ---------------- */
  function reset() {
    if (tl) { tl.kill(); tl = null; }
    if (!gsap) return;
    gsap.set(qa(".ov-stage, .ov-readout, .ov-next, .ov-map-hd"), { clearProps: "all" });
  }

  function build() {
    reset();
    paint(0, false);
    mxHi(-1, -1);
    if (!gsap || reduced) return;

    gsap.set(qa(".ov-stage"), { opacity: 0, y: 18 });
    gsap.set(qa(".ov-map-hd, .ov-readout"), { opacity: 0 });

    tl = gsap.timeline({ defaults: { ease: "power2.out" } });
    tl.to(q(".ov-map-hd"), { opacity: 1, duration: .25 }, 0)
      .to(qa(".ov-stage"), { opacity: 1, y: 0, duration: .42, stagger: .07 }, .06)
      .to(q(".ov-readout"), { opacity: 1, duration: .35 }, .38);
  }

  /* ---------------- 事件 ---------------- */
  root.addEventListener("click", function (e) {
    var st = e.target && e.target.closest ? e.target.closest(".ov-stage") : null;
    if (!st) return;
    var i = parseInt(st.getAttribute("data-stage"), 10);
    if (!isNaN(i) && i !== cur) paint(i, true);
  });

  root.addEventListener("keydown", function (e) {
    if (e.key !== "Enter" && e.key !== " ") return;
    var st = e.target && e.target.closest ? e.target.closest(".ov-stage") : null;
    if (!st) return;
    e.preventDefault();
    var i = parseInt(st.getAttribute("data-stage"), 10);
    if (!isNaN(i)) paint(i, true);
  });

  var mx = q("#ovMx");
  if (mx) {
    mx.addEventListener("mouseover", function (e) {
      var c = e.target && e.target.closest ? e.target.closest(".ov-mx-c") : null;
      if (!c) return;
      mxHi(+c.getAttribute("data-row"), +c.getAttribute("data-col"));
    });
    mx.addEventListener("mouseleave", function () { mxHi(-1, -1); });
  }

  build();

  return { replay: build };
});
