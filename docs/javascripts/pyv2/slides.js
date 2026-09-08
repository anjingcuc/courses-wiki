/* ============================================================
 * slides.js — 在线课件框架（16 周高交互课件）
 * <div class="pyv2-slides" data-title="...">
 *   <section class="slide">…</section>          // 普通页
 *   <section class="slide">…<span class="frag">…</span></section>  // 分步显示
 * </div>
 * 操作：← → / 空格 / PageUp PageDown 翻页；F 全屏；Home/End 首末页
 *       触摸左右滑动；右下角按钮；URL 深链 #/n
 * 前进顺序：先逐个显示当前页 frag，完毕后翻下一页；
 * 后退：直接回到上一页（该页 frag 全部显示）。
 * ============================================================ */
(function () {
  "use strict";

  function initDeck(root) {
    var slides = Array.prototype.slice.call(root.querySelectorAll("section.slide"));
    if (!slides.length) return;
    var cur = 0;

    /* ---- 导航 UI ---- */
    var bar = document.createElement("div");
    bar.className = "sl-bar";
    bar.innerHTML =
      '<button class="sl-btn" data-act="prev" title="上一页（←）">‹</button>' +
      '<span class="sl-count">1 / ' + slides.length + "</span>" +
      '<button class="sl-btn" data-act="next" title="下一页（→）">›</button>' +
      '<button class="sl-btn" data-act="fs" title="全屏（F）">⛶</button>';
    root.appendChild(bar);

    var prog = document.createElement("div");
    prog.className = "sl-prog";
    prog.innerHTML = "<i></i>";
    root.appendChild(prog);

    /* ---- 渲染 ---- */
    function fragsOf(s) { return Array.prototype.slice.call(s.querySelectorAll(".frag")); }
    function render() {
      slides.forEach(function (s, i) {
        s.classList.toggle("active", i === cur);
        if (i === cur) {
          fragsOf(s).forEach(function (f) { f.classList.remove("on"); });
        }
      });
      root.querySelector(".sl-count").textContent = cur + 1 + " / " + slides.length;
      root.querySelector(".sl-prog i").style.width = ((cur + 1) / slides.length * 100) + "%";
      if (history.replaceState) history.replaceState(null, "", "#/" + (cur + 1));
    }

    function next() {
      var fs = fragsOf(slides[cur]).filter(function (f) { return !f.classList.contains("on"); });
      if (fs.length) { fs[0].classList.add("on"); return; }
      if (cur < slides.length - 1) { cur++; render(); }
    }
    function prev() {
      if (cur > 0) {
        cur--;
        render();
        // 回退到上一页时全部显示
        fragsOf(slides[cur]).forEach(function (f) { f.classList.add("on"); });
      }
    }
    function go(n) {
      cur = Math.max(0, Math.min(slides.length - 1, n));
      render();
    }

    /* ---- 事件 ---- */
    bar.addEventListener("click", function (e) {
      var b = e.target.closest("button");
      if (!b) return;
      var act = b.dataset.act;
      if (act === "next") next();
      else if (act === "prev") prev();
      else if (act === "fs") toggleFs();
    });

    function toggleFs() {
      if (document.fullscreenElement) document.exitFullscreen();
      else if (root.requestFullscreen) root.requestFullscreen();
    }

    document.addEventListener("keydown", function (e) {
      // 输入控件内不拦截
      var t = e.target;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
      // 课件页面上才响应
      if (!root.dataset.slReady || !document.body.contains(root)) return;
      var k = e.key;
      if (k === "ArrowRight" || k === "ArrowDown" || k === " " || k === "PageDown" || k === "Enter") {
        e.preventDefault(); next();
      } else if (k === "ArrowLeft" || k === "ArrowUp" || k === "PageUp" || k === "Backspace") {
        e.preventDefault(); prev();
      } else if (k === "Home") { e.preventDefault(); go(0); }
      else if (k === "End") { e.preventDefault(); go(slides.length - 1); }
      else if (k === "f" || k === "F") { toggleFs(); }
    });

    /* 触摸滑动 */
    var tx = null;
    root.addEventListener("touchstart", function (e) { tx = e.touches[0].clientX; }, { passive: true });
    root.addEventListener("touchend", function (e) {
      if (tx === null) return;
      var dx = e.changedTouches[0].clientX - tx;
      if (Math.abs(dx) > 46) { dx < 0 ? next() : prev(); }
      tx = null;
    }, { passive: true });

    /* 点击页面右/左区域翻页（避开按钮与交互元素） */
    root.addEventListener("click", function (e) {
      if (e.target.closest("button, a, input, textarea, .pyv2-quiz, .py-playground, .sl-bar, select, label")) return;
      var r = root.getBoundingClientRect();
      if (e.clientX - r.left > r.width * 0.72) next();
      else if (e.clientX - r.left < r.width * 0.12) prev();
    });

    /* 深链 #/n */
    function fromHash() {
      var m = /^#\/(\d+)$/.exec(location.hash);
      if (m) go(parseInt(m[1], 10) - 1);
    }
    window.addEventListener("hashchange", fromHash);

    root.dataset.slReady = "1";
    fromHash();
    render();
  }

  function init() {
    var list = document.querySelectorAll(".pyv2-slides");
    Array.prototype.forEach.call(list, function (root) {
      if (root.dataset.slReady) return;
      initDeck(root);
    });
  }

  if (window.PYV2) PYV2.register("slides", init);
  else if (document.readyState !== "loading") init();
  else document.addEventListener("DOMContentLoaded", init);
})();
