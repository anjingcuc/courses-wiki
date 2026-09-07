/* ============================================================
 * pyv2-loader.js — Python V2 课程交互组件智能加载器
 * 按页面标记按需注入 GSAP / Three.js / 各组件脚本，
 * 兼容 mkdocs-material 的 instant navigation（document$）。
 * ============================================================ */
(function () {
  "use strict";

  var me = document.currentScript;
  var jsRoot = me ? new URL("./", me.src).href : "";          // .../javascripts/
  var siteRoot = jsRoot ? new URL("../", jsRoot).href : "";   // 站点根

  var loaded = {}; // url -> Promise
  function loadScript(url) {
    if (!loaded[url]) {
      loaded[url] = new Promise(function (resolve, reject) {
        var s = document.createElement("script");
        s.src = url;
        s.async = true;
        s.onload = resolve;
        s.onerror = function () { reject(new Error("加载失败: " + url)); };
        document.head.appendChild(s);
      });
    }
    return loaded[url];
  }

  var registry = {}; // name -> init fn
  var PYV2 = {
    root: siteRoot,
    js: jsRoot,
    loadScript: loadScript,
    register: function (name, initFn) {
      registry[name] = initFn;
      // 脚本晚于页面检测加载完成时，立即对当前文档执行一次
      if (PYV2._active && PYV2._active.indexOf(name) >= 0 && !initFn._done) {
        initFn._done = true;
        try { initFn(document); } catch (e) { console.error("[pyv2]", name, e); }
      }
    }
  };
  window.PYV2 = PYV2;

  function any(sel) { return !!document.querySelector(sel); }

  function pageHasAnimations() {
    return any(".pyv2-hero, .pyv2 [data-anim], .pyv2-path, .pyv2-lab, .pyv2-tl, .pyv2-stats, .pyv2-lessons");
  }

  function initPage() {
    var need = [];
    if (any(".py-playground")) need.push("playground");
    if (any(".pyv2-quiz")) need.push("quiz");
    if (any("[data-pyv2-ai]")) need.push("ai");
    if (any("#pyv2-kgraph")) need.push("kgraph");
    if (any(".pyv2-terminal[data-terminal]")) need.push("landing");
    if (pageHasAnimations()) need.push("anim");

    PYV2._active = need;

    // 1) GSAP（动画类组件依赖）
    var gsapChain = Promise.resolve();
    if (need.indexOf("anim") >= 0) {
      gsapChain = loadScript(jsRoot + "vendor/gsap.min.js")
        .then(function () { return loadScript(jsRoot + "vendor/ScrollTrigger.min.js"); })
        .then(function () {
          if (window.gsap && window.ScrollTrigger) {
            gsap.registerPlugin(ScrollTrigger);
            return loadScript(jsRoot + "pyv2/module.js");
          }
        });
    }

    // 2) 独立组件（不依赖 GSAP）
    if (need.indexOf("playground") >= 0) loadScript(jsRoot + "pyv2/playground.js").catch(console.error);
    if (need.indexOf("quiz") >= 0) loadScript(jsRoot + "pyv2/quiz.js").catch(console.error);
    if (need.indexOf("ai") >= 0) loadScript(jsRoot + "pyv2/ai-companion.js").catch(console.error);
    if (need.indexOf("kgraph") >= 0) loadScript(jsRoot + "pyv2/knowledge-graph.js").catch(console.error);
    if (need.indexOf("landing") >= 0) loadScript(jsRoot + "pyv2/landing.js").catch(console.error);
    gsapChain.catch(console.error);
  }

  function run() {
    initPage();
    // 对已注册组件重新初始化（页面切换后）
    Object.keys(registry).forEach(function (name) {
      if (PYV2._active && PYV2._active.indexOf(name) >= 0) {
        var fn = registry[name];
        if (!fn._done) {
          fn._done = true;
          try { fn(document); } catch (e) { console.error("[pyv2]", name, e); }
        }
      }
    });
  }

  // 重置执行标记（每次页面切换时调用）
  function resetDone() {
    Object.keys(registry).forEach(function (name) { registry[name]._done = false; });
  }

  function boot() {
    resetDone();
    run();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }

  // mkdocs-material instant navigation 支持
  if (window.document$ && typeof window.document$.subscribe === "function") {
    window.document$.subscribe(function () { setTimeout(boot, 0); });
  }
})();
