/* ============================================================
 * playground.js — 浏览器内 Python 运行场（Pyodide, Web Worker）
 * 用法（markdown 内）:
 * <div class="py-playground" data-py-title="试试看">
 *   <textarea>print("hello")</textarea>
 * </div>
 * ============================================================ */
(function () {
  "use strict";

  var WORKER_TIMEOUT = 15000;
  var worker = null;
  var workerDead = false;
  var booted = false;

  function getWorker(onBoot, onOut, onErr) {
    if (!worker || workerDead) {
      workerDead = false;
      booted = false;
      worker = new Worker(PYV2.js + "pyv2/playground-worker.js");
      worker.onmessage = function (e) {
        var d = e.data;
        if (d.type === "booted") { booted = true; onBoot && onBoot(); }
        else if (d.type === "out") { onOut && onOut(d.text, false); }
        else if (d.type === "err") { onOut && onOut(d.text, true); }
      };
    }
    return worker;
  }

  function esc(s) {
    return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  function enhance(box) {
    if (box.dataset.pyReady) return;
    box.dataset.pyReady = "1";

    var ta = box.querySelector("textarea");
    if (!ta) return;
    var initialCode = ta.value;
    var title = box.dataset.pyTitle || "Python 运行场";

    /* --- 构建 UI --- */
    var head = document.createElement("div");
    head.className = "pg-head";
    head.innerHTML =
      '<div class="pg-title"><span class="lang">Python</span><span>' + esc(title) + "</span>" +
      '<span class="pg-status"></span></div>' +
      '<div class="pg-actions">' +
      '<button class="pg-btn reset" type="button">重置</button>' +
      '<button class="pg-btn run" type="button">▶ 运行</button>' +
      "</div>";

    var out = document.createElement("div");
    out.className = "pg-out";
    out.innerHTML = '<span class="dim"># 点击「运行」在浏览器里直接执行（首次需下载运行时，约 5–10 秒）</span>';

    box.insertBefore(head, box.firstChild);
    box.appendChild(out);

    var runBtn = head.querySelector(".run");
    var status = head.querySelector(".pg-status");

    ta.addEventListener("keydown", function (e) {
      if (e.key === "Tab") {
        e.preventDefault();
        var s = ta.selectionStart, en = ta.selectionEnd;
        ta.value = ta.value.slice(0, s) + "    " + ta.value.slice(en);
        ta.selectionStart = ta.selectionEnd = s + 4;
      }
    });

    head.querySelector(".reset").addEventListener("click", function () {
      ta.value = initialCode;
      out.innerHTML = '<span class="dim"># 已重置</span>';
    });

    function setStatus(html) { status.innerHTML = html; }
    function appendOut(text, isErr) {
      var span = document.createElement("span");
      if (isErr) { span.className = "err"; text = text; }
      span.textContent = text + "\n";
      out.appendChild(span);
      out.scrollTop = out.scrollHeight;
    }

    runBtn.addEventListener("click", function () {
      var code = ta.value;
      if (!code.trim()) return;
      runBtn.disabled = true;
      out.textContent = "";
      setStatus(booted ? '<span class="spin"></span>运行中…' : '<span class="spin"></span>启动 Python 运行时…');

      var w = getWorker(
        function () { setStatus('<span class="spin"></span>运行中…'); },
        function (text, isErr) { appendOut(text, isErr); },
        null
      );

      var finished = false;
      var timer = setTimeout(function () {
        if (finished) return;
        finished = true;
        workerDead = true;
        try { w.terminate(); } catch (ignore) { /* noop */ }
        worker = null;
        appendOut("⏱ 运行超时（>15s），已自动终止——请检查是否有死循环。", true);
        setStatus("");
        runBtn.disabled = false;
      }, WORKER_TIMEOUT);

      w.onmessage = function (e) {
        var d = e.data;
        if (d.type === "booted") {
          booted = true;
          setStatus('<span class="spin"></span>运行中…');
        } else if (d.type === "out") {
          appendOut(d.text, false);
        } else if (d.type === "err") {
          appendOut(d.text, true);
        } else if (d.type === "done") {
          if (finished) return;
          finished = true;
          clearTimeout(timer);
          if (d.ok) {
            var ok = document.createElement("span");
            ok.className = "ok";
            ok.textContent = "\n✓ 运行完成";
            out.appendChild(ok);
          } else if (d.error) {
            appendOut(d.error, true);
          }
          setStatus("");
          runBtn.disabled = false;
        }
      };

      w.postMessage({ code: code });
    });
  }

  function init() {
    document.querySelectorAll(".py-playground").forEach(enhance);
  }

  if (window.PYV2) PYV2.register("playground", init);
  else if (document.readyState !== "loading") init();
  else document.addEventListener("DOMContentLoaded", init);
})();
