/* =====================================================================
   场景 04 · 首屏是空壳时，沿图分两条路
   主图是导航（点节点/分岔 → 下方滚动对位），A/B 两段是细节区
   ===================================================================== */
BP.scene("sc-dynamic", function (root, gsap, api) {
  "use strict";

  var qa = function (s) { return Array.prototype.slice.call(root.querySelectorAll(s)); };
  var q1 = function (s) { return root.querySelector(s); };
  var pad2 = function (n) { return (n < 10 ? "0" : "") + n; };

  var reduced = !!(api && api.reduced) ||
    (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);

  /* ---------------- 节点 ---------------- */
  var dgm   = q1("#dgm");
  var blkA  = q1("#blkA");
  var blkB  = q1("#blkB");
  var wire1 = q1(".dgm-wire:not(.is-fork)");
  var wire2 = q1(".dgm-wire.is-fork");
  var fkChip = q1(".fk-chip");

  var aSteps  = qa(".a-flow .a-step");
  var aFrames = qa("#aStage .adf");
  var aLines  = qa(".ac-body .cl");
  var aRail   = q1("#aRailFill");
  var aNodes  = q1("#aNodes");
  var aFoot   = q1("#aFoot");
  var aStepNo = q1("#aStepNo");
  var aPlayTxt = q1("#aPlayTxt");
  var aPlayIco = q1("#aPlayIco");
  var aPlayBtn = q1('[data-a="play"]');
  var chipsA   = qa('.route.is-a .rstep');

  var bnRows  = q1("#bnRows");
  var bnCount = q1("#bnCount");
  var bnSay   = q1("#bnSay");
  var bvList  = q1("#bvList");
  var bvCount = q1("#bvCount");
  var bvMore  = q1("#bvMore");
  var bjBody  = q1("#bjBody");
  var bjName  = q1("#bjName");
  var bjMeta  = q1("#bjMeta");
  var bjPath  = q1("#bjPath");
  var jLines  = qa(".bj-code .cl");
  var xhrChip = q1('[data-b="xhr"]');
  var chipsB  = qa('.route.is-b .rstep');
  var pgBtns  = qa(".pages .pgbtn");
  var stockNum = q1("#stockNum");

  /* ---------------- 数据 ---------------- */
  var A_TOTAL = 7, A_DWELL = 850;
  var A_NODES = [0, 3, 3, 3, 3, 23, 23];
  var A_FOOT = ["driver 还没启动", "HTTP 200 · 114 B", "3 个子资源入队", "app.js 执行中…",
                "等待 li.stu", "page_source · 2.4 KB", "students.csv · 5 行（示意）"];

  var NET_DOC = { id: "doc", name: "/", st: "200", ty: "document", sz: "114 B", xhr: false };
  var NET_CSS = { id: "css", name: "/static/style.css", st: "200", ty: "stylesheet", sz: "11.7 kB", xhr: false };
  var NET_JS  = { id: "js",  name: "/static/app.js",   st: "200", ty: "script",     sz: "24.6 kB", xhr: false };
  var NET_FAV = { id: "fav", name: "/favicon.ico",     st: "404", ty: "other",      sz: "0 B",     xhr: false };
  var NET_P1  = { id: "p1",  name: "/data?page=1",     st: "200", ty: "xhr",        sz: "186 B",   xhr: true };
  var NET_P2  = { id: "p2",  name: "/data?page=2",     st: "200", ty: "xhr",        sz: "178 B",   xhr: true };

  var PAGES = {
    p1: { page: 1, names: ["张伟", "李静", "王磊", "陈曦", "刘洋"] },
    p2: { page: 2, names: ["赵敏", "孙浩", "周琳", "吴迪", "徐帆"] }
  };

  var SAY = {
    doc: "第一条是页面本身 —— 点开只有 3 行骨架，li 一个都没有。",
    css: "样式表：不是数据，排除。",
    js:  "JS 文件：不是数据，排除 —— 执行它的才是浏览器。",
    fav: "404 —— 静态站常见的 favicon 请求，和内容无关。",
    p1:  "第 1 条 XHR：application/json，返回的是字符串，没有 HTML 结构。",
    p2:  "下拉到底才出现的第 2 条 XHR —— HTML 没有再下载一次。"
  };

  /* ---------------- 状态 ---------------- */
  var aStep = 1, aPlaying = false, aTimer = null, aStartTimer = null;
  var bSel = "doc", bDrill = 0, bItem = 0, bXhrOnly = false, bPage2 = false, bLast = "doc";
  var tl = null, stockTween = null, nodeTween = null;

  /* ================================================================
     滚动 / 高亮
     ================================================================ */
  function scrollToEl(el, offset) {
    if (!el) return;
    var top = el.getBoundingClientRect().top - root.getBoundingClientRect().top + root.scrollTop - (offset || 12);
    top = Math.max(0, top);
    if (root.scrollTo) root.scrollTo({ top: top, behavior: reduced ? "auto" : "smooth" });
    else root.scrollTop = top;
  }

  function flash(el) {
    if (!el) return;
    el.classList.remove("is-flash");
    void el.offsetWidth;
    el.classList.add("is-flash");
    setTimeout(function () { el.classList.remove("is-flash"); }, 1150);
  }

  /* ================================================================
     A 段：七步流水线
     ================================================================ */
  function countNodes(to, instant) {
    if (!aNodes) return;
    if (!gsap || instant || reduced) { aNodes.textContent = to; return; }
    var o = { v: parseFloat(aNodes.textContent) || 0 };
    if (nodeTween) nodeTween.kill();
    nodeTween = gsap.to(o, {
      v: to, duration: .4, ease: "power2.out",
      onUpdate: function () { aNodes.textContent = Math.round(o.v); }
    });
  }

  function showAFrame(n, instant) {
    aFrames.forEach(function (f) {
      var on = parseInt(f.getAttribute("data-f"), 10) === n;
      if (!gsap) { f.style.opacity = on ? 1 : 0; return; }
      if (on) {
        f.style.zIndex = 2;
        if (instant || reduced) gsap.set(f, { opacity: 1, y: 0 });
        else gsap.fromTo(f, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: .24, ease: "power2.out" });
      } else {
        f.style.zIndex = 1;
        gsap.set(f, { opacity: 0, y: 0 });     /* 旧帧立刻让位，避免两层文字叠影 */
      }
    });
  }

  function setA(n, instant) {
    n = Math.max(1, Math.min(A_TOTAL, n));
    aStep = n;
    aSteps.forEach(function (el, i) {
      el.classList.toggle("is-on", i + 1 === n);
      el.classList.toggle("is-done", i + 1 < n);
    });
    chipsA.forEach(function (el) {
      el.classList.toggle("is-on", parseInt(el.getAttribute("data-step"), 10) === n);
    });
    if (aStepNo) aStepNo.textContent = "STEP " + pad2(n) + " / 07";
    if (aRail) {
      var h = ((n - 1) / (A_TOTAL - 1) * 100).toFixed(1) + "%";
      if (gsap && !instant && !reduced) gsap.to(aRail, { height: h, duration: .3, ease: "power2.inOut" });
      else aRail.style.height = h;
    }
    showAFrame(n, instant);
    aLines.forEach(function (el) {
      var s = (el.getAttribute("data-c") || "").split(",");
      el.classList.toggle("is-hl", s.indexOf(String(n)) > -1);
    });
    countNodes(A_NODES[n - 1], instant);
    if (aFoot) aFoot.textContent = A_FOOT[n - 1];
  }

  function aUpdateBtn() {
    if (!aPlayTxt) return;
    aPlayTxt.textContent = aPlaying ? "暂停" : (aStep >= A_TOTAL ? "重播" : "播放");
    aPlayIco.textContent = aPlaying ? "\u23F8" : "\u25B8";
    aPlayBtn.classList.toggle("is-on", aPlaying);
  }

  function aSchedule() {
    clearTimeout(aTimer);
    if (!aPlaying) return;
    aTimer = setTimeout(function () {
      if (!root.classList.contains("is-active")) { aPlaying = false; aUpdateBtn(); return; }
      if (aStep < A_TOTAL) { setA(aStep + 1); aSchedule(); }
      else { aPlaying = false; aUpdateBtn(); }
    }, A_DWELL);
  }

  function aStart() {
    if (aStep >= A_TOTAL) setA(1, true);
    aPlaying = true;
    aUpdateBtn();
    aSchedule();
  }

  function aStartSoon() {
    if (aPlaying) return;
    clearTimeout(aStartTimer);
    aStartTimer = setTimeout(function () {
      aStartTimer = null;
      if (!aPlaying && root.classList.contains("is-active")) aStart();
    }, 480);
  }

  function aPause() {
    aPlaying = false;
    clearTimeout(aTimer);
    clearTimeout(aStartTimer);
    aTimer = null;
    aStartTimer = null;
    aUpdateBtn();
  }

  /* ================================================================
     B 段：Network + JSON
     ================================================================ */
  function netList() {
    var list = [NET_DOC, NET_CSS, NET_JS, NET_FAV, NET_P1];
    if (bPage2) list.push(NET_P2);
    if (bXhrOnly) list = list.filter(function (r) { return r.xhr; });
    return list;
  }

  function findNet(id) {
    var all = [NET_DOC, NET_CSS, NET_JS, NET_FAV, NET_P1, NET_P2];
    for (var i = 0; i < all.length; i++) if (all[i].id === id) return all[i];
    return null;
  }

  function renderNet() {
    if (!bnRows) return;
    var list = netList(), h = "";
    list.forEach(function (r) {
      h += '<button class="bn-row' + (r.xhr ? " is-xhr" : "") + (r.id === bSel ? " is-on" : "") +
        '" type="button" data-row="' + r.id + '">' +
        '<span class="nm">' + r.name + "</span>" +
        '<span class="st' + (r.st === "404" ? " bad" : "") + '">' + r.st + "</span>" +
        '<span class="ty">' + r.ty + "</span>" +
        '<span class="sz">' + r.sz + "</span>" +
        "</button>";
    });
    bnRows.innerHTML = h;
    var all = 5 + (bPage2 ? 1 : 0);
    var xhrs = 1 + (bPage2 ? 1 : 0);
    if (bnCount) {
      bnCount.textContent = bXhrOnly
        ? "只看 XHR · " + xhrs + " 条"
        : all + " 个请求 · " + xhrs + " 个 XHR";
    }
  }

  function renderList() {
    if (!bvList) return;
    var names = PAGES.p1.names.slice();
    if (bPage2) names = names.concat(PAGES.p2.names);
    var h = "";
    names.forEach(function (n, i) {
      h += '<div class="bv-row"><i>' + pad2(i + 1) + "</i><b>" + n + "</b><span>" +
        (i < PAGES.p1.names.length ? "p1" : "p2") + "</span></div>";
    });
    bvList.innerHTML = h;
    if (bvCount) bvCount.textContent = "已渲染 " + names.length + " 条";
  }

  function row(html) { return '<div class="jrow">' + html + "</div>"; }

  function shellJSON() {
    return '<div class="jrow"><span class="jnote">// 114 B · text/html · 3 个节点</span></div>' +
      row("&lt;!DOCTYPE html&gt;") +
      row('&lt;html&gt;&lt;head&gt;&lt;script src=<span class="jv">"/static/app.js"</span>&gt;&lt;/script&gt;&lt;/head&gt;') +
      row('&lt;body&gt;&lt;div id=<span class="jv">"app"</span>&gt;&lt;/div&gt;&lt;/body&gt;&lt;/html&gt;') +
      '<div class="jrow"><span class="jnote">li 一个都没有 —— B 路线要的是它后面那条 XHR。</span></div>';
  }

  function setPath(t) { if (bjPath) bjPath.textContent = t; }

  function hlJ(list) {
    jLines.forEach(function (el) {
      var s = (el.getAttribute("data-j") || "").split(",");
      el.classList.toggle("is-hl", s.some(function (k) { return list.indexOf(+k) > -1; }));
    });
  }

  function renderJSON() {
    var r = findNet(bSel);
    if (!r || !bjBody) return;
    if (bjName) bjName.textContent = r.name;
    if (bjMeta) bjMeta.textContent = r.st + " · " + (r.xhr ? "application/json" : (r.id === "doc" ? "text/html" : "text/plain")) + " · " + r.sz;
    if (bnSay) bnSay.textContent = SAY[r.id] || "";

    if (r.id === "doc") {
      bjBody.innerHTML = shellJSON();
      setPath("resp.text");
      hlJ([]);
      return;
    }
    if (!r.xhr) {
      bjBody.innerHTML = '<div class="jrow"><span class="jnote">' +
        (r.st === "404" ? "404 —— 不是数据，跳过。" : "不是数据，跳过（讲师：样式表 / JS 都不管）。") +
        "</span></div>";
      setPath("resp.text");
      hlJ([]);
      return;
    }

    var p = PAGES[r.id], h = "";
    if (bDrill === 0) {
      h += row("{");
      h += row('  <span class="jks">"page"</span><span class="jc">:</span> <span class="jv num">' + p.page + "</span><span class=\"jc\">,</span>");
      h += row('  <span class="jk" data-k="data">"data"</span><span class="jc">: [</span>');
      p.names.forEach(function (n, i) {
        h += row('    <span class="jv">"' + n + '"</span>' + (i < p.names.length - 1 ? '<span class="jc">,</span>' : ""));
      });
      h += row('  <span class="jc">]</span>');
      h += row("}");
      h += '<div class="jrow"><span class="jnote">点 <span class="mono">"data"</span> 这个 key → 看它到底是什么</span></div>';
      setPath("resp.json()");
      hlJ([2]);
    } else if (bDrill === 1) {
      h += '<div class="jrow"><span class="jnote">resp.json()["data"] → list · ' + p.names.length + " 项（str）</span></div>";
      p.names.forEach(function (n, i) {
        h += '<div class="jitem" data-i="' + i + '"><span class="jind">[' + i + "]</span> <span class=\"jv\">\"" + n + '"</span></div>';
      });
      setPath('resp.json()["data"]');
      hlJ([2, 3]);
    } else {
      var nm = p.names[bItem] || p.names[0];
      h += '<div class="jrow"><span class="jnote">resp.json()["data"][' + bItem + "]</span></div>";
      h += '<div class="jrow jbig"><span class="jv">"' + nm + '"</span></div>';
      h += '<div class="jrow"><span class="jnote">取到名字了 —— 这就是 <span class="mono">students.append(item.strip())</span> 塞进列表的东西。</span></div>';
      setPath('resp.json()["data"][' + bItem + "]");
      hlJ([2, 3]);
    }
    bjBody.innerHTML = h;
  }

  function syncB() {
    chipsB.forEach(function (el) {
      el.classList.toggle("is-on", el.getAttribute("data-net") === bLast);
    });
    pgBtns.forEach(function (el) {
      el.classList.toggle("is-on", el.getAttribute("data-b") === bSel);
    });
  }

  function selectNet(id, drill) {
    if (id === "p2" && !bPage2) return;
    bSel = id;
    bDrill = drill || 0;
    bItem = 0;
    bLast = bSel;
    renderNet();
    renderJSON();
    syncB();
  }

  function loadMore() {
    if (bPage2) return;
    bPage2 = true;
    renderNet();
    renderList();
    selectNet("p2", 0);
    if (bvMore) {
      bvMore.classList.add("is-done");
      bvMore.innerHTML = '没有更多的数据了 · 讲师：<span class="mono">range(1, 5)</span> 到 4 为止';
    }
  }

  /* ================================================================
     库存 1000 → 999：AJAX 的日常形态
     ================================================================ */
  function startStock() {
    if (!gsap || !stockNum || reduced) return;
    if (stockTween) { stockTween.kill(); stockTween = null; }
    stockNum.textContent = "1000";
    var o = { v: 1000 };
    stockTween = gsap.to(o, {
      v: 999, duration: .01, delay: .5, repeat: -1, repeatDelay: 2.4, ease: "none",
      onUpdate: function () { stockNum.textContent = Math.round(o.v); }
    });
  }

  /* ================================================================
     交互：图 → 下方细节区
     ================================================================ */
  root.addEventListener("click", function (e) {
    var t = e.target;
    if (!t || !t.closest) return;
    var hit = t.closest("[data-step],[data-net],[data-jump],[data-a],[data-b],[data-row],[data-k],[data-i]");
    if (!hit || !root.contains(hit)) return;

    /* A：图里的步骤 chip / A 段的流程行 */
    if (hit.hasAttribute("data-step")) {
      aPause();
      setA(parseInt(hit.getAttribute("data-step"), 10));
      scrollToEl(blkA, 54);
      flash(blkA);
      return;
    }

    /* B：图里的接口 chip */
    if (hit.hasAttribute("data-net")) {
      var k = hit.getAttribute("data-net");
      bLast = k;
      if (k === "p2") loadMore();
      else if (k === "json") selectNet("p1", 1);
      else selectNet(k, 0);
      scrollToEl(blkB, 54);
      flash(blkB);
      return;
    }

    /* JSON 下钻 */
    if (hit.hasAttribute("data-k")) {
      if (hit.getAttribute("data-k") !== "data") return;
      bDrill = 1;
      bItem = 0;
      renderJSON();
      return;
    }
    if (hit.hasAttribute("data-i")) {
      bDrill = 2;
      bItem = parseInt(hit.getAttribute("data-i"), 10);
      renderJSON();
      return;
    }

    /* Network 行 */
    if (hit.hasAttribute("data-row")) {
      selectNet(hit.getAttribute("data-row"), 0);
      return;
    }

    /* 图上的跳转 */
    if (hit.hasAttribute("data-jump")) {
      var j = hit.getAttribute("data-jump");
      if (j === "top") { if (root.scrollTo) root.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" }); else root.scrollTop = 0; return; }
      if (j === "a") { scrollToEl(blkA, 54); flash(blkA); aStartSoon(); return; }
      if (j === "b") { scrollToEl(blkB, 54); flash(blkB); return; }
    }

    /* A 段控制 */
    if (hit.hasAttribute("data-a")) {
      var act = hit.getAttribute("data-a");
      if (act === "play") { if (aPlaying) aPause(); else aStart(); }
      else if (act === "step") { aPause(); setA(aStep < A_TOTAL ? aStep + 1 : 1); }
      else if (act === "reset") { aPause(); setA(1, true); }
      return;
    }

    /* B 段控制 */
    if (hit.hasAttribute("data-b")) {
      var b = hit.getAttribute("data-b");
      if (b === "xhr") {
        bXhrOnly = !bXhrOnly;
        xhrChip.classList.toggle("is-on", bXhrOnly);
        if (bXhrOnly && !findNet(bSel).xhr) bSel = "p1";
        renderNet(); renderJSON();
      } else if (b === "more") {
        loadMore();
      } else if (b === "p1" || b === "p2") {
        if (b === "p2") loadMore();
        selectNet(b, 0);
        scrollToEl(blkB, 54);
        flash(blkB);
      }
      return;
    }
  });

  /* ================================================================
     入场（≤1.2s）+ 复位
     ================================================================ */
  function play() {
    aPause();
    if (tl) { tl.kill(); tl = null; }
    if (stockTween) { stockTween.kill(); stockTween = null; }
    if (nodeTween) { nodeTween.kill(); nodeTween = null; }

    /* 复位状态 */
    bPage2 = false; bXhrOnly = false; bSel = "doc"; bDrill = 0; bItem = 0; bLast = "doc";
    if (xhrChip) xhrChip.classList.remove("is-on");
    if (bvMore) {
      bvMore.classList.remove("is-done");
      bvMore.innerHTML = '下拉到底 → 再发一条 <span class="mono">data?page=2</span>';
    }
    renderNet();
    renderJSON();
    renderList();
    syncB();
    setA(1, true);
    aUpdateBtn();
    root.scrollTop = 0;

    if (!gsap) return;

    var heads = qa(".dyn-headl > *").concat(qa(".dyn-headr > *"));
    var srcNodes = qa(".dgm-src .dnode");
    var arrow = q1(".dgm-src .darrow");
    var cmps = qa(".dcmp");
    var dvs = q1(".dvs");
    var routes = qa(".dgm-route .route");
    var vds = qa(".dgm-verdict .vd");

    if (reduced) {
      gsap.set(heads.concat(srcNodes, [arrow], cmps, [dvs, fkChip], routes, vds), { opacity: 1, x: 0, y: 0, scale: 1 });
      gsap.set([wire1, wire2], { opacity: 1, scaleY: 1 });
      startStock();
      return;
    }

    gsap.set(heads, { opacity: 0, y: 10 });
    gsap.set(srcNodes, { opacity: 0, y: 12 });
    gsap.set(arrow, { opacity: 0 });
    gsap.set([wire1, wire2], { opacity: 0, scaleY: 0, transformOrigin: "50% 0%" });
    gsap.set(cmps, { opacity: 0, y: 14 });
    gsap.set(dvs, { opacity: 0 });
    gsap.set(fkChip, { opacity: 0, y: -4 });
    gsap.set(routes, { opacity: 0, y: 16 });
    gsap.set(vds, { opacity: 0, y: 10 });

    tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.to(heads, { opacity: 1, y: 0, duration: .34, stagger: .05 }, 0)
      .to(srcNodes, { opacity: 1, y: 0, duration: .32, stagger: .05 }, .06)
      .to(arrow, { opacity: 1, duration: .24 }, .2)
      .to(wire1, { opacity: 1, scaleY: 1, duration: .26, ease: "power2.inOut" }, .3)
      .to(cmps, { opacity: 1, y: 0, duration: .36, stagger: .06 }, .34)
      .to(dvs, { opacity: 1, duration: .24 }, .42)
      .to(wire2, { opacity: 1, scaleY: 1, duration: .3, ease: "power2.inOut" }, .56)
      .to(fkChip, { opacity: 1, y: 0, duration: .24 }, .74)
      .to(routes, { opacity: 1, y: 0, duration: .34, stagger: .07 }, .62)
      .to(vds, { opacity: 1, y: 0, duration: .28, stagger: .05 }, .86);

    tl.add(function () { startStock(); }, .9);
  }

  play();
  return { replay: play };
});
