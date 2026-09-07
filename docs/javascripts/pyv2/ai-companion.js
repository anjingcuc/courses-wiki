/* ============================================================
 * ai-companion.js — AI 学伴浮窗
 * - OpenAI 兼容 /chat/completions 接口，SSE 流式输出
 * - 预设 DeepSeek / Kimi / GLM / 自定义，密钥仅存 localStorage
 * - 自动携带当前页面标题与章节上下文
 * 页面标记: <div data-pyv2-ai hidden></div>
 * ============================================================ */
(function () {
  "use strict";

  var CFG_KEY = "pyv2.ai.cfg";
  var HIST_KEY = "pyv2.ai.history";

  var PRESETS = {
    deepseek: { label: "DeepSeek", base: "https://api.deepseek.com/v1", model: "deepseek-chat" },
    kimi: { label: "Kimi", base: "https://api.moonshot.cn/v1", model: "kimi-k2-turbo-preview" },
    glm: { label: "智谱 GLM", base: "https://open.bigmodel.cn/api/paas/v4", model: "glm-4.7" },
    custom: { label: "自定义", base: "", model: "" }
  };

  var SYSTEM_PROMPT =
    "你是《Python 程序设计（AI 原生版）》课程的 AI 学伴，服务中国大学生。" +
    "课程理念：AI 时代学编程重在读代码、调试与系统设计，鼓励学生用 AI 协作但要求能讲清自己的代码。" +
    "回答用中文，简洁、循序渐进，多用短代码示例（Python），必要时给类比。学生问概念时优先给直觉解释再给严格定义。";

  function loadCfg() {
    try { return JSON.parse(localStorage.getItem(CFG_KEY)) || {}; } catch (e) { return {}; }
  }
  function saveCfg(c) { localStorage.setItem(CFG_KEY, JSON.stringify(c)); }

  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  function pageContext() {
    var h1 = document.querySelector("h1");
    var title = (h1 ? h1.textContent : document.title).trim();
    var heads = Array.prototype.slice.call(document.querySelectorAll("h2, h3")).slice(0, 12)
      .map(function (h) { return h.textContent.trim(); }).join("；");
    return "当前学习页面：「" + title + "」。页面小节：" + (heads || "无");
  }

  function ensureUi() {
    var old = document.querySelector(".pyv2-ai-fab");
    if (old) return document.querySelector(".pyv2-ai-panel");

    var fab = document.createElement("button");
    fab.className = "pyv2-ai-fab";
    fab.type = "button";
    fab.innerHTML = '<span class="spark">✦</span> AI 学伴';

    var panel = document.createElement("div");
    panel.className = "pyv2-ai-panel";

    panel.innerHTML =
      '<div class="ai-head">' +
      '  <b>✦ AI 学伴 <span class="model-tag">未配置</span></b>' +
      '  <div style="display:flex">' +
      '    <button class="icon-btn ai-cfg-btn" title="设置" type="button">⚙</button>' +
      '    <button class="icon-btn ai-close" title="收起" type="button">✕</button>' +
      '  </div>' +
      "</div>" +
      '<div class="ai-body">' +
      '  <div class="ai-msg system">配置 API 后即可对话 · 密钥只保存在你的浏览器本地</div>' +
      "</div>" +
      '<div class="ai-settings" style="display:none">' +
      '  <div><label>服务商</label><div class="preset-chips"></div></div>' +
      '  <div class="row2">' +
      '    <div><label>API Base URL</label><input class="f-base" placeholder="https://api.deepseek.com/v1"></div>' +
      '    <div><label>模型</label><input class="f-model" placeholder="deepseek-chat"></div>' +
      "  </div>" +
      '  <div><label>API Key</label><input class="f-key" type="password" placeholder="sk-…"></div>' +
      '  <div class="note">· 兼容 OpenAI 接口格式（DeepSeek / Kimi / GLM / 本地服务等均可用）<br>' +
      "  · Key 仅存于本浏览器 localStorage，不会上传到本网站<br>" +
      "  · 部分校内/内网地址为 http，在 https 页面下会被浏览器拦截，需使用 https 接口</div>" +
      '  <div class="actions">' +
      '    <button class="pyv2-btn ghost ai-clear" type="button">清空对话</button>' +
      '    <button class="pyv2-btn primary ai-save" type="button">保存</button>' +
      "  </div>" +
      "</div>" +
      '<div class="ai-input">' +
      '  <textarea class="ai-ta" placeholder="问我任何 Python 问题…（Enter 发送 / Shift+Enter 换行）"></textarea>' +
      '  <button class="send" type="button">发送</button>' +
      "</div>";

    document.body.appendChild(fab);
    document.body.appendChild(panel);

    var body = panel.querySelector(".ai-body");
    var ta = panel.querySelector(".ai-ta");
    var send = panel.querySelector(".send");
    var busy = false;
    var history = [];

    try { history = JSON.parse(sessionStorage.getItem(HIST_KEY)) || []; } catch (e) { history = []; }

    function refreshTag() {
      var c = loadCfg();
      var tag = panel.querySelector(".model-tag");
      if (c.model) tag.textContent = c.model;
      else { tag.textContent = "未配置"; }
    }

    function addMsg(role, text, streamTarget) {
      var div = document.createElement("div");
      div.className = "ai-msg " + role;
      if (role === "assistant") {
        // 极简 markdown：代码块与行内代码
        var html = esc(text)
          .replace(/```(\w*)\n([\s\S]*?)```/g, function (_, l, code) {
            return '<pre style="background:#f1f5f9;border:1px solid #e2e8f0;border-radius:8px;padding:9px 11px;overflow-x:auto;font-size:12px;color:#334155;"><code>' + code + "</code></pre>";
          })
          .replace(/`([^`\n]+)`/g, "<code>$1</code>");
        div.innerHTML = html;
      } else {
        div.textContent = text;
      }
      if (streamTarget) {
        div.innerHTML += '<span class="cursor"></span>';
      }
      body.appendChild(div);
      body.scrollTop = body.scrollHeight;
      return div;
    }

    function restore() {
      history.slice(-12).forEach(function (m) {
        if (m.role === "user" || m.role === "assistant") addMsg(m.role, m.content);
      });
    }

    function persist() {
      try { sessionStorage.setItem(HIST_KEY, JSON.stringify(history.slice(-24))); } catch (e) { /* noop */ }
    }

    /* ---- 设置区 ---- */
    var settings = panel.querySelector(".ai-settings");
    var chips = panel.querySelector(".preset-chips");
    var fBase = panel.querySelector(".f-base");
    var fModel = panel.querySelector(".f-model");
    var fKey = panel.querySelector(".f-key");

    function renderChips(active) {
      chips.textContent = "";
      Object.keys(PRESETS).forEach(function (k) {
        var p = PRESETS[k];
        var chip = document.createElement("button");
        chip.type = "button";
        chip.className = "chip" + (k === active ? " active" : "");
        chip.textContent = p.label;
        chip.addEventListener("click", function () {
          renderChips(k);
          if (k !== "custom") { fBase.value = p.base; fModel.value = p.model; }
        });
        chips.appendChild(chip);
      });
    }

    panel.querySelector(".ai-cfg-btn").addEventListener("click", function () {
      var c = loadCfg();
      var open = settings.style.display !== "none";
      settings.style.display = open ? "none" : "flex";
      if (!open) {
        renderChips(c.preset || "deepseek");
        fBase.value = c.base || "";
        fModel.value = c.model || "";
        fKey.value = c.key || "";
      }
    });

    panel.querySelector(".ai-save").addEventListener("click", function () {
      saveCfg({
        preset: (panel.querySelector(".chip.active") || {}).textContent || "custom",
        base: fBase.value.trim(),
        model: fModel.value.trim(),
        key: fKey.value.trim()
      });
      refreshTag();
      settings.style.display = "none";
      addMsg("system", "✓ 已保存配置" + (fBase.value ? "：" + fModel.value : ""));
    });

    panel.querySelector(".ai-clear").addEventListener("click", function () {
      history = [];
      persist();
      body.querySelectorAll(".ai-msg").forEach(function (m) { m.remove(); });
      addMsg("system", "对话已清空");
    });

    /* ---- 开合 ---- */
    fab.addEventListener("click", function () {
      panel.classList.toggle("open");
      if (panel.classList.contains("open")) { refreshTag(); ta.focus(); }
    });
    panel.querySelector(".ai-close").addEventListener("click", function () { panel.classList.remove("open"); });

    /* ---- 发送 ---- */
    async function doSend() {
      var text = ta.value.trim();
      if (!text || busy) return;
      var c = loadCfg();
      if (!c.base || !c.key) {
        panel.classList.add("open");
        settings.style.display = "flex";
        renderChips(c.preset || "deepseek");
        addMsg("system", "请先填写 API 地址与密钥（DeepSeek / Kimi / GLM 或任何 OpenAI 兼容服务）");
        return;
      }
      busy = true;
      send.disabled = true;
      ta.value = "";

      addMsg("user", text);
      history.push({ role: "user", content: text });

      var bubble = addMsg("assistant", "", true);
      var acc = "";

      try {
        var messages = [
          { role: "system", content: SYSTEM_PROMPT + "\n\n" + pageContext() },
        ].concat(history.slice(-10));

        var res = await fetch(c.base.replace(/\/+$/, "") + "/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + c.key
          },
          body: JSON.stringify({
            model: c.model || "deepseek-chat",
            messages: messages,
            stream: true,
            temperature: 0.6,
            max_tokens: 2048
          })
        });

        if (!res.ok) {
          var errText = await res.text();
          throw new Error("HTTP " + res.status + " — " + errText.slice(0, 300));
        }

        var reader = res.body.getReader();
        var decoder = new TextDecoder("utf-8");
        var buf = "";

        while (true) {
          var r = await reader.read();
          if (r.done) break;
          buf += decoder.decode(r.value, { stream: true });
          var lines = buf.split("\n");
          buf = lines.pop();
          for (var i = 0; i < lines.length; i++) {
            var line = lines[i].trim();
            if (line.indexOf("data:") !== 0) continue;
            var payload = line.slice(5).trim();
            if (payload === "[DONE]") continue;
            try {
              var j = JSON.parse(payload);
              var delta = j.choices && j.choices[0] && j.choices[0].delta;
              if (delta && delta.content) acc += delta.content;
            } catch (e) { /* 忽略心跳/半包 */ }
          }
          bubble.innerHTML = acc.replace(/`([^`\n]+)`/g, "<code>$1</code>") + '<span class="cursor"></span>';
          body.scrollTop = body.scrollHeight;
        }

        bubble.remove();
        addMsg("assistant", acc || "（模型返回空内容）");
        history.push({ role: "assistant", content: acc });
        persist();
      } catch (err) {
        bubble.remove();
        var msg = "请求失败：" + err.message;
        if (/Failed to fetch|NetworkError/i.test(err.message)) {
          msg += "\n\n可能原因：① API 地址或密钥有误 ② http 接口被 https 页面拦截（混合内容） ③ 网络不通";
        }
        addMsg("assistant", msg);
      } finally {
        busy = false;
        send.disabled = false;
        ta.focus();
      }
    }

    send.addEventListener("click", doSend);
    ta.addEventListener("keydown", function (e) {
      if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); doSend(); }
    });

    refreshTag();
    restore();
    return panel;
  }

  function init() {
    if (!document.querySelector("[data-pyv2-ai]")) return;
    ensureUi();
  }

  if (window.PYV2) PYV2.register("ai", init);
  else if (document.readyState !== "loading") init();
  else document.addEventListener("DOMContentLoaded", init);
})();
