/* ============================================================
 * landing.js — 课程主页：AI 对话终端打字机
 * <div class="pyv2-terminal" data-terminal='{"loop":true}'>
 *   <script type="application/json" class="term-data">
 *     {"lines":[{"t":"in","x":"python chat.py"},{"t":"ai","x":"你好！"}]}
 *   </script>
 * </div>
 * t: in=用户输入 out=程序输出 ai=AI回复 dim=提示
 * ============================================================ */
(function () {
  "use strict";

  var CURSOR = '<span class="cursor"></span>';

  function color(cls, text) {
    return '<span class="' + cls + '"></span>';
  }

  function typewrite(term, lines, loop) {
    var idx = 0;
    term.innerHTML = "";

    function nextLine() {
      if (idx >= lines.length) {
        if (!loop) { term.innerHTML += CURSOR; return; }
        setTimeout(function () { idx = 0; term.innerHTML = ""; nextLine(); }, 5200);
        return;
      }
      var line = lines[idx++];
      var cls = { in: "c-in", out: "c-out", ai: "c-ai", dim: "c-dim" }[line.t] || "c-dim";
      var span = document.createElement("span");
      span.className = cls;
      term.appendChild(span);

      var text = line.x;
      var ci = 0;
      var speed = line.t === "in" ? 55 : 14;

      function typeChar() {
        if (ci < text.length) {
          span.textContent += text[ci++];
          term.scrollTop = term.scrollHeight;
          setTimeout(typeChar, speed + Math.random() * 30);
        } else {
          span.textContent += "\n";
          term.scrollTop = term.scrollHeight;
          setTimeout(nextLine, line.t === "ai" || line.t === "out" ? 620 : 380);
        }
      }
      typeChar();
    }
    nextLine();
  }

  function boot(box) {
    if (box.dataset.termReady) return;
    box.dataset.termReady = "1";
    var dataEl = box.querySelector('script.term-data, script[type="application/json"]');
    var body = box.querySelector(".body");
    if (!dataEl || !body) return;
    try {
      var data = JSON.parse(dataEl.textContent);
      typewrite(body, data.lines || [], data.loop !== false);
    } catch (e) {
      console.error("[pyv2] 终端数据解析失败:", e);
    }
  }

  function init() {
    document.querySelectorAll(".pyv2-terminal[data-terminal]").forEach(boot);
  }

  if (window.PYV2) PYV2.register("landing", init);
  else if (document.readyState !== "loading") init();
  else document.addEventListener("DOMContentLoaded", init);
})();
