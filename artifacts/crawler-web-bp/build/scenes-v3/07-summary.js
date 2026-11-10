/* ============================================================
   场景 07 · 回到总图
   七屏路径（可深链跳转）+ 三条判据 + 决策树（默认折叠）+ 三题自测
   首屏入场 ≤ 1s；下面两段滚到视口再淡入
   ============================================================ */
BP.scene("sc-summary", function (root, gsap, api) {
  var tl = null;
  var io = null;
  var reduced = !!(api && api.reduced);
  var branch = null;

  function qa(sel) { return Array.prototype.slice.call(root.querySelectorAll(sel)); }
  function q1(sel) { return root.querySelector(sel); }
  function closest(el, sel) {
    while (el && el !== root) {
      if (el.nodeType === 1 && el.matches && el.matches(sel)) return el;
      el = el.parentNode;
    }
    return null;
  }

  /* ---------------- 决策树（默认全折叠） ---------------- */
  var treeDetail = q1(".tr-detail");

  function setBranch(k) {
    branch = k || null;
    qa(".tr-b").forEach(function (b) {
      var on = !!k && b.getAttribute("data-b") === k;
      b.classList.toggle("is-on", on);
      b.setAttribute("aria-expanded", on ? "true" : "false");
    });
    qa(".tr-pane").forEach(function (p) {
      p.classList.toggle("is-on", !!k && p.getAttribute("data-b") === k);
    });
    if (treeDetail) treeDetail.classList.toggle("is-idle", !k);
    var idle = q1(".tr-idle");
    if (idle) idle.style.display = k ? "none" : "";
    if (k && gsap && !reduced) {
      var pane = q1('.tr-pane[data-b="' + k + '"]');
      if (pane) gsap.fromTo(pane, { opacity: 0, y: -6 }, { opacity: 1, y: 0, duration: .28, ease: "power2.out" });
    }
  }

  /* ---------------- 自测 ---------------- */
  function paintScore() {
    var ok = qa(".qz-card.is-ok").length;
    var el = q1(".qz-score");
    if (!el) return;
    el.textContent = ok + " / 3";
    el.classList.toggle("is-full", ok === 3);
  }

  function resetQuiz() {
    qa(".qz-card").forEach(function (c) {
      c.classList.remove("is-done", "is-ok", "is-no");
      Array.prototype.slice.call(c.querySelectorAll(".qz-opt")).forEach(function (b) {
        b.classList.remove("is-good", "is-bad");
      });
      var exp = c.querySelector(".qz-exp");
      if (exp && gsap) gsap.set(exp, { clearProps: "opacity,transform" });
    });
    paintScore();
  }

  function answer(btn) {
    var card = closest(btn, ".qz-card");
    if (!card || card.classList.contains("is-done")) return;
    var ans = card.getAttribute("data-ans");
    var k = btn.getAttribute("data-k");
    card.classList.add("is-done");
    card.classList.add(k === ans ? "is-ok" : "is-no");
    Array.prototype.slice.call(card.querySelectorAll(".qz-opt")).forEach(function (b) {
      var bk = b.getAttribute("data-k");
      if (bk === ans) b.classList.add("is-good");
      else if (bk === k) b.classList.add("is-bad");
    });
    paintScore();
    if (gsap && !reduced) {
      var exp = card.querySelector(".qz-exp");
      if (exp) gsap.fromTo(exp, { opacity: 0, y: -5 }, { opacity: 1, y: 0, duration: .3, ease: "power2.out" });
    }
  }

  /* ---------------- 事件 ---------------- */
  root.addEventListener("click", function (e) {
    var stop = closest(e.target, ".su-stop");
    if (stop) {
      var n = stop.getAttribute("data-go");
      if (n && !(api && api.reader)) {
        e.preventDefault();
        location.hash = "#/" + n;
      }
      return;
    }
    var b = closest(e.target, ".tr-b");
    if (b) {
      var k = b.getAttribute("data-b");
      setBranch(branch === k ? null : k);
      return;
    }
    var o = closest(e.target, ".qz-opt");
    if (o) { answer(o); return; }
    if (closest(e.target, ".qz-reset")) { resetQuiz(); }
  });

  /* ---------------- 入场 ---------------- */
  function revealOnScroll(list) {
    if (!list.length) return;
    if (!("IntersectionObserver" in window)) {
      gsap.set(list, { opacity: 1, y: 0 });
      return;
    }
    io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target;
        io.unobserve(el);
        gsap.to(el, {
          opacity: 1, y: 0, duration: .5, ease: "power2.out",
          onComplete: function () { gsap.set(el, { clearProps: "opacity,transform" }); }
        });
      });
    }, { root: root, threshold: .06, rootMargin: "0px 0px -6% 0px" });
    list.forEach(function (el) { io.observe(el); });
  }

  function play() {
    if (tl) { tl.kill(); tl = null; }
    if (io) { io.disconnect(); io = null; }

    setBranch("1");
    resetQuiz();

    var head = q1(".su-head");
    var mapBlock = q1('.su-block[data-block="map"]');
    var later = qa('.su-block[data-block="tree"], .su-block[data-block="quiz"]');

    if (!gsap || reduced) {
      qa(".su-head, .su-block").forEach(function (el) {
        el.style.opacity = "";
        el.style.transform = "";
      });
      return;
    }

    var stops = qa(".su-stop");
    var crit = qa(".su-crit-c");

    gsap.set(head, { opacity: 0, y: 10 });
    gsap.set(mapBlock, { opacity: 0, y: 12 });
    gsap.set(stops, { opacity: 0, y: 8 });
    gsap.set(crit, { opacity: 0, y: 8 });
    gsap.set(later, { opacity: 0, y: 18 });

    tl = gsap.timeline({ defaults: { ease: "power2.out" } });
    tl.to(head, { opacity: 1, y: 0, duration: .38, stagger: .05 }, 0)
      .to(mapBlock, { opacity: 1, y: 0, duration: .4 }, .08)
      .to(stops, { opacity: 1, y: 0, duration: .3, stagger: .04 }, .22)
      .to(crit, { opacity: 1, y: 0, duration: .34, stagger: .06 }, .42)
      .add(function () {
        gsap.set(stops, { clearProps: "opacity,transform" });
        gsap.set(crit, { clearProps: "opacity,transform" });
        gsap.set([head, mapBlock], { clearProps: "opacity,transform" });
      }, .82);

    revealOnScroll(later);
  }

  play();

  return { replay: play };
});
