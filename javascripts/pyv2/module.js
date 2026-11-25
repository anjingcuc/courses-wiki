/* ============================================================
 * module.js — GSAP 滚动动效（依赖 gsap + ScrollTrigger）
 * - [data-anim] 元素入场
 * - .pyv2-stat 数字滚动
 * - hero 入场时间线
 * ============================================================ */
(function () {
  "use strict";

  var COUNTERS = "pyv2:counters";

  function init() {
    if (!window.gsap) {
      document.querySelectorAll(".pyv2").forEach(function (el) { el.classList.add("no-anim"); });
      return;
    }
    var g = window.gsap;
    if (window.ScrollTrigger) g.registerPlugin(ScrollTrigger);

    var page = document.querySelector(".md-main__inner");

    /* hero 入场 */
    var hero = document.querySelector(".pyv2-hero");
    if (hero && !hero.dataset.animDone) {
      hero.dataset.animDone = "1";
      var tl = g.timeline({ defaults: { ease: "power3.out" } });
      if (hero.querySelector(".badge-row")) {
        tl.from(hero.querySelectorAll(".badge"), { y: 14, opacity: 0, stagger: 0.08, duration: 0.5 });
      }
      tl.from(hero.querySelectorAll("h1"), { y: 26, opacity: 0, duration: 0.7 }, "-=0.25");
      if (hero.querySelector(".sub")) tl.from(hero.querySelector(".sub"), { y: 18, opacity: 0, duration: 0.6 }, "-=0.35");
      if (hero.querySelector(".cta-row")) tl.from(hero.querySelectorAll(".pyv2-btn"), { y: 14, opacity: 0, stagger: 0.1, duration: 0.5 }, "-=0.3");
      if (hero.querySelector(".pyv2-terminal")) tl.from(hero.querySelector(".pyv2-terminal"), { y: 30, opacity: 0, scale: 0.97, duration: 0.8, ease: "power2.out" }, "-=0.5");
    }

    /* [data-anim] 滚动入场 */
    var items = document.querySelectorAll(".pyv2 [data-anim]:not([data-anim-done])");
    items.forEach(function (el) { el.setAttribute("data-anim-done", "1"); });
    if (items.length) {
      if (window.ScrollTrigger) {
        ScrollTrigger.batch(items, {
          interval: 0.08,
          onEnter: function (els) {
            g.to(els, { y: 0, opacity: 1, stagger: 0.07, duration: 0.6, ease: "power3.out", overwrite: true });
          },
          start: "top 88%"
        });
        g.set(items, { y: 28, opacity: 0 });
      } else {
        g.to(items, { y: 0, opacity: 1, stagger: 0.07, duration: 0.6, ease: "power3.out", delay: 0.15 });
      }
    }

    /* 数字滚动计数 */
    var nums = document.querySelectorAll(".pyv2-stat .n[data-count]:not([data-count-done])");
    nums.forEach(function (el) {
      el.setAttribute("data-count-done", "1");
      var target = parseFloat(el.dataset.count) || 0;
      var suffix = el.dataset.suffix || "";
      var obj = { v: 0 };
      var run = function () {
        g.to(obj, {
          v: target, duration: 1.6, ease: "power2.out",
          onUpdate: function () { el.innerHTML = Math.round(obj.v) + "<small>" + suffix + "</small>"; }
        });
      };
      if (window.ScrollTrigger) {
        ScrollTrigger.create({ trigger: el, start: "top 92%", once: true, onEnter: run });
      } else run();
    });

    if (window.ScrollTrigger) ScrollTrigger.refresh();

    // 兜底：4 秒后若入场元素仍隐藏（GSAP 静默失败/极端节流），直接显示
    setTimeout(function () {
      var stuck = document.querySelector(".pyv2 [data-anim]");
      if (stuck && !stuck.style.opacity && getComputedStyle(stuck).opacity === "0") {
        document.querySelectorAll(".pyv2").forEach(function (el) { el.classList.add("no-anim"); });
      }
    }, 4000);
  }

  if (window.PYV2) PYV2.register("anim", init);
  else if (document.readyState !== "loading") init();
  else document.addEventListener("DOMContentLoaded", init);
})();
