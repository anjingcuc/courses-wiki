/* ============================================================
 * quiz.js — 交互式测验组件
 * 用法（markdown 内）:
 * <div class="pyv2-quiz">
 *   <script type="application/json" class="quiz-data">{
 *     "title": "随堂小测",
 *     "questions": [
 *       {"q": "问题", "opts": ["A","B","C"], "a": 1,
 *        "explain": "解析"}
 *     ]
 *   }</script>
 * </div>
 * ============================================================ */
(function () {
  "use strict";

  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  function renderInline(s) {
    // 支持 `code` 行内代码
    return esc(s).replace(/`([^`]+)`/g, function (_, c) {
      return '<code style="font-family:var(--pyv2-font-mono,monospace);font-size:.92em;color:#93c5fd;">' + c + "</code>";
    });
  }

  function build(box) {
    if (box.dataset.quizReady) return;
    box.dataset.quizReady = "1";

    var dataEl = box.querySelector('script.quiz-data, script[type="application/json"]');
    var data;
    try { data = JSON.parse(dataEl.textContent); }
    catch (e) {
      box.innerHTML = '<div style="color:#f87171;font-size:13px;">测验数据解析失败：' + esc(e.message) + "</div>";
      return;
    }

    var questions = data.questions || [];
    var answered = 0, correct = 0;

    var score = document.createElement("div");
    score.className = "quiz-score";
    score.textContent = (data.title || "随堂小测") + " · 共 " + questions.length + " 题";

    box.textContent = "";
    box.appendChild(score);

    questions.forEach(function (q, qi) {
      var card = document.createElement("div");
      card.className = "pyv2-q";

      var title = document.createElement("div");
      title.className = "q-title";
      title.innerHTML = '<span class="no">Q' + (qi + 1) + "</span>" + renderInline(q.q);
      card.appendChild(title);

      var opts = document.createElement("div");
      opts.className = "opts";

      var explain = document.createElement("div");
      explain.className = "explain";
      explain.innerHTML = renderInline(q.explain || "");

      (q.opts || []).forEach(function (text, oi) {
        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = "opt";
        btn.innerHTML = String.fromCharCode(65 + oi) + ". " + renderInline(text);
        btn.addEventListener("click", function () {
          if (card.dataset.done) return;
          card.dataset.done = "1";
          answered++;

          var isRight = oi === q.a;
          if (isRight) { correct++; btn.classList.add("correct"); }
          else {
            btn.classList.add("wrong");
            opts.children[q.a].classList.add("correct");
          }
          Array.prototype.forEach.call(opts.children, function (b) {
            b.disabled = true;
            if (b !== btn && !b.classList.contains("correct")) b.classList.add("dimmed");
          });
          if (q.explain) explain.style.display = "block";

          score.textContent = "已答 " + answered + "/" + questions.length +
            " · 正确 " + correct +
            (answered === questions.length ? " · 得分 " + Math.round(correct / questions.length * 100) + " 分 🎯" : "");
        });
        opts.appendChild(btn);
      });

      card.appendChild(opts);
      card.appendChild(explain);
      box.appendChild(card);
    });
  }

  function init() {
    document.querySelectorAll(".pyv2-quiz").forEach(build);
  }

  if (window.PYV2) PYV2.register("quiz", init);
  else if (document.readyState !== "loading") init();
  else document.addEventListener("DOMContentLoaded", init);
})();
