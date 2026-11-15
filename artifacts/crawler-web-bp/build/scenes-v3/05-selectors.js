/* ============================================================
   SCENE 05 · CSS 与 XPath：同一棵 DOM 树的两种问法
   - 一套共享工作台：渲染页 / DOM 树 / 源码 + 一个表达式输入区
   - 输入任一语法 → 三处同时高亮同一批节点
   - 点 DOM 树节点 → 同时生成 CSS 与 XPath 两种写法（可点即执行）
   ============================================================ */
BP.scene("sc-selectors", function (root, gsap, api) {
  "use strict";

  var pageDoc = root.querySelector(".pg");
  var docRoot = pageDoc.querySelector("#app");
  var treeEl = root.querySelector("#selTree");
  var srcEl = root.querySelector("#selSrc");
  var inputEl = root.querySelector("#selInput");
  var chipsEl = root.querySelector("#selChips");
  var modeEl = root.querySelector("#selMode");
  var modeHint = root.querySelector("#selModeHint");
  var apiEl = root.querySelector("#selApi");
  var cmdEl = root.querySelector("#selCmd");
  var cmdK = root.querySelector("#selCmdK");
  var nEl = root.querySelector("#selN");
  var badgeEl = root.querySelector("#selBadge");
  var sayEl = root.querySelector("#selSay");
  var codeEl = root.querySelector("#selCode");
  var hitsEl = root.querySelector("#selHits");
  var listEl = root.querySelector("#selHitsList");
  var nodeBody = root.querySelector("#selNodeBody");
  var nodeHint = root.querySelector("#selNodeHint");
  var mapEl = root.querySelector("#selMap");
  var foldEl = root.querySelector("#selFold");

  var tl = null, dTimer = 0, mode = "css", lastHits = [], srcNids = [];
  var foldAll = false, curNode = null, curSelRow = null;
  var exprByMode = { css: ".title", xpath: '//h3[@class="title"]' };

  var PRESETS = {
    css: ["#app", ".card", "a", "div, p", ".title"],
    xpath: ['//*[@id="app"]', '//div[@class="card"]', "//a", "//div | //p", '//h3[@class="title"]']
  };
  var HINTS = {
    css: "按 id / class / 标签找元素",
    xpath: "按层级 / 位置 / 属性找元素"
  };
  var APIS = { css: "soup.select( )", xpath: "document.evaluate( )" };

  /* CSS ↔ XPath 对照（css 为 null 表示 CSS 表达不了） */
  var MAPS = [
    [".title", '//h3[@class="title"]'],
    ["#app", '//*[@id="app"]'],
    [".card", '//div[@class="card"]'],
    ["a", "//a"],
    ["div, p", "//div | //p"],
    [".feed > .card", '//main[@class="feed"]/div[@class="card"]'],
    [".card:nth-of-type(2)", '//div[@class="card"][2]'],
    ['a[href^="/video/"]', '//a[starts-with(@href,"/video/")]'],
    [null, "//a/@href"],
    [null, "//a/text()"]
  ];
  var MAP_NOTES = [
    "按 class 选标题（讲师 F12 那一步）",
    "id 全页唯一，像身份证",
    "class 可以对应多个元素",
    "所有链接",
    "并集：两种都算",
    "直接子元素（结构）",
    "第 2 个（XPath 从 1 数）",
    "属性前缀"
  ];

  /* ---------------- 小工具 ---------------- */
  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }
  function arr(nl) { return Array.prototype.slice.call(nl); }
  function nid(el) { return el.getAttribute("data-node-id"); }
  function tagOf(el) { return el.tagName.toLowerCase(); }
  function clsOf(el) { return (el.getAttribute("class") || "").trim().split(/\s+/).filter(Boolean); }
  function directText(el) {
    var t = "";
    for (var i = 0; i < el.childNodes.length; i++) {
      if (el.childNodes[i].nodeType === 3) t += el.childNodes[i].nodeValue;
    }
    return t.replace(/\s+/g, " ").trim();
  }
  function summarize(el) {
    var s = tagOf(el);
    if (el.id) s += "#" + el.id;
    var c = clsOf(el);
    if (c.length) s += "." + c.join(".");
    return s;
  }

  /* ---------------- 两套求值引擎 ---------------- */
  function queryCSS(s) {
    var list = pageDoc.querySelectorAll(s);
    return { ok: true, nodes: arr(list), els: arr(list), vals: [], err: "", kind: "nodes" };
  }
  function cssCount(s) {
    try { return pageDoc.querySelectorAll(s).length; } catch (e) { return -1; }
  }

  function normXP(e) {
    e = String(e || "").trim();
    if (!e) return e;
    if (/^\/html\/body/i.test(e)) e = "." + e.replace(/^\/html\/body/i, "");
    else if (e.charAt(0) === "/") e = "." + e;
    e = e.replace(/(^|[^\w.\]\-'"\/])\/\//g, "$1.//");
    return e;
  }

  function evalXP(expr) {
    var out = { ok: false, nodes: [], els: [], vals: [], err: "", kind: "nodes" };
    var n = normXP(expr);
    if (!n) { out.err = "请输入表达式"; return out; }
    var r;
    try { r = document.evaluate(n, pageDoc, null, XPathResult.ANY_TYPE, null); }
    catch (e) { out.err = e.message; return out; }
    if (r.resultType === XPathResult.NUMBER_TYPE) {
      out.ok = true; out.kind = "scalar"; out.vals = [String(r.numberValue)]; return out;
    }
    if (r.resultType === XPathResult.STRING_TYPE) {
      out.ok = true; out.kind = "scalar"; out.vals = ['"' + r.stringValue + '"']; return out;
    }
    if (r.resultType === XPathResult.BOOLEAN_TYPE) {
      out.ok = true; out.kind = "scalar"; out.vals = [String(r.booleanValue)]; return out;
    }
    var nodes = [], nd, guard = 0;
    try { while ((nd = r.iterateNext())) { nodes.push(nd); if (++guard > 4000) break; } }
    catch (e) { /* ignore */ }
    var els = [], vals = [], seen = {};
    nodes.forEach(function (x) {
      if (x.nodeType === 1) {
        var k = nid(x) || "";
        if (!seen[k]) { seen[k] = 1; els.push(x); }
      } else if (x.nodeType === 2) {
        vals.push(x.name + '="' + x.value + '"');
        if (x.ownerElement) {
          var k2 = nid(x.ownerElement) || "";
          if (!seen[k2]) { seen[k2] = 1; els.push(x.ownerElement); }
        }
      } else if (x.nodeType === 3) {
        vals.push('"' + x.nodeValue.replace(/\s+/g, " ").trim() + '"');
        if (x.parentNode) {
          var k3 = nid(x.parentNode) || "";
          if (!seen[k3]) { seen[k3] = 1; els.push(x.parentNode); }
        }
      }
    });
    out.ok = true; out.nodes = nodes; out.els = els; out.vals = vals;
    return out;
  }
  function xpCount(x) { var r = evalXP(x); return r.ok ? r.nodes.length : -1; }

  /* ---------------- 人话解释 ---------------- */
  function splitTop(s, sep) {
    var out = [], buf = "", d = 0;
    for (var i = 0; i < s.length; i++) {
      var ch = s.charAt(i);
      if (ch === "[" || ch === "(") { d++; buf += ch; continue; }
      if (ch === "]" || ch === ")") { d--; buf += ch; continue; }
      if (ch === sep && d === 0) { out.push(buf); buf = ""; continue; }
      buf += ch;
    }
    out.push(buf);
    return out;
  }
  function tokenizeSel(g) {
    var parts = [], buf = "", comb = "", d = 0;
    function flush(c) {
      var t = buf.trim();
      if (t) { parts.push({ comb: comb, sel: t }); buf = ""; }
      comb = c;
    }
    for (var i = 0; i < g.length; i++) {
      var ch = g.charAt(i);
      if (ch === "[" || ch === "(") { d++; buf += ch; continue; }
      if (ch === "]" || ch === ")") { d--; buf += ch; continue; }
      if (d === 0) {
        if (ch === ">" || ch === "+" || ch === "~") { flush(ch); continue; }
        if (/\s/.test(ch)) { if (buf.trim()) flush(" "); continue; }
      }
      buf += ch;
    }
    var t = buf.trim();
    if (t) parts.push({ comb: comb, sel: t });
    return parts;
  }
  var COMB = { "": "，", " ": " 内任意层的 ", ">": " 的直接子元素 ", "+": " 的紧邻兄弟 ", "~": " 的后续兄弟 " };

  function describeAttr(a) {
    a = a.trim();
    var m = /^([\w-]+)\s*(\^=|\$=|\*=|\|=|~=|=)\s*([\s\S]+)$/.exec(a);
    if (!m) return "带 " + a + " 属性";
    var v = m[3].trim().replace(/^["']|["']$/g, "");
    var map = { "=": "等于", "^=": "以…开头", "$=": "以…结尾", "*=": "包含",
                "|=": "等于或以其开头", "~=": "含这个词" };
    return "属性 " + m[1] + " " + map[m[2]] + ' "' + v + '"';
  }
  function describePseudo(name, arg) {
    var n = (name || "").toLowerCase();
    if (n === "nth-child") return "是父元素下第 " + arg + " 个子元素";
    if (n === "first-child") return "是父元素的第一个子元素";
    if (n === "last-child") return "是父元素的最后一个子元素";
    if (n === "nth-of-type") return "是同类型兄弟里的第 " + arg + " 个";
    if (n === "first-of-type") return "是同类型兄弟里的第一个";
    if (n === "last-of-type") return "是同类型兄弟里的最后一个";
    if (n === "not") return "且不匹配 " + arg;
    return ":" + n + (arg ? "(" + arg + ")" : "");
  }
  function describeCompound(c) {
    c = String(c).trim();
    if (!c) return "元素";
    if (c === "*") return "任意元素";
    var i = 0, tag = "", conds = [], tail = [], m;
    m = /^([a-zA-Z][\w-]*)/.exec(c);
    if (m) { tag = m[0].toLowerCase(); i = m[0].length; }
    while (i < c.length) {
      var ch = c.charAt(i);
      if (ch === "*") { tag = ""; i++; continue; }
      if (ch === ".") {
        m = /^\.([\w-]+)/.exec(c.slice(i));
        if (m) { conds.push("class 含 " + m[1]); i += m[0].length; continue; }
        i++; continue;
      }
      if (ch === "#") {
        m = /^#([\w-]+)/.exec(c.slice(i));
        if (m) { conds.push("id 为 " + m[1]); i += m[0].length; continue; }
        i++; continue;
      }
      if (ch === "[") {
        var j = c.indexOf("]", i);
        if (j < 0) { i = c.length; break; }
        conds.push(describeAttr(c.slice(i + 1, j)));
        i = j + 1; continue;
      }
      if (ch === ":") {
        m = /^::?([\w-]+)(\(([^)]*)\))?/.exec(c.slice(i));
        if (m) { tail.push(describePseudo(m[1], m[3])); i += m[0].length; continue; }
        i++; continue;
      }
      i++;
    }
    var name = tag || "元素";
    var s = conds.length
      ? conds.join(" 且 ") + (tag ? " 的 " + tag : " 的元素")
      : name;
    if (tail.length) s += "（" + tail.join("，") + "）";
    return s;
  }
  function describeGroup(g) {
    var parts = tokenizeSel(g);
    if (!parts.length) return g;
    var out = describeCompound(parts[0].sel);
    for (var i = 1; i < parts.length; i++) {
      out += (COMB[parts[i].comb] || "，") + describeCompound(parts[i].sel);
    }
    return out;
  }
  function explainCSS(sel) {
    var groups = splitTop(sel, ",").map(function (g) { return g.trim(); }).filter(Boolean);
    if (!groups.length) return sel;
    if (groups.length > 1) {
      return "并集（" + groups.length + " 组，各算各的再合并）：" + groups.map(describeGroup).join("；或 ");
    }
    return describeGroup(groups[0]);
  }

  function xpPhrase(ax, node, preds, first) {
    var isAttr = node.charAt(0) === "@";
    var isText = node === "text()";
    var s;
    if (ax === "//") s = first ? "文档内任意层级找 " : "，再往任意下层找 ";
    else if (ax === "/") s = first ? "从直接子元素开始 " : "，再取直接子元素 ";
    else s = first ? "" : "，接着 ";
    if (isAttr) s += "@" + node.slice(1) + " 属性的值";
    else if (isText) s += "文本节点";
    else if (node === "*") s += "任意元素";
    else s += node + " 元素";
    preds.forEach(function (p) {
      p = p.trim();
      if (/^-?\d+$/.test(p)) s += "（第 " + p + " 个）";
      else if (/^last\(\)$/.test(p)) s += "（最后一个）";
      else if (/^position\(\)/.test(p)) s += "（当前序号）";
      else {
        var mm = /^@([\w:-]+)\s*=\s*(.+)$/.exec(p);
        if (mm) s += "（属性 " + mm[1] + " = " + mm[2].replace(/["']/g, "") + "）";
        else if (/^text\(\)\s*=/.test(p)) s += "（文本 = " + p.replace(/^text\(\)\s*=\s*/, "").replace(/["']/g, "") + "）";
        else if (/^starts-with/.test(p)) s += "（以…开头）";
        else if (/^contains/.test(p)) s += "（包含…）";
        else s += "（" + p + "）";
      }
    });
    return s;
  }
  function explainPath(p) {
    var out = "", i = 0, first = true;
    while (i < p.length) {
      var ax = "";
      if (p.substr(i, 2) === "//") { ax = "//"; i += 2; }
      else if (p.charAt(i) === "/") { ax = "/"; i++; }
      var m = /^([\w:.-]+|\*|text\(\)|@[\w:.-]+|\.\.?)/.exec(p.slice(i));
      if (!m) { i++; continue; }
      var node = m[0]; i += node.length;
      var preds = [];
      while (p.charAt(i) === "[") {
        var d = 1, j = i + 1;
        while (j < p.length && d > 0) {
          if (p.charAt(j) === "[") d++;
          else if (p.charAt(j) === "]") d--;
          j++;
        }
        preds.push(p.slice(i + 1, j - 1));
        i = j;
      }
      out += xpPhrase(ax, node, preds, first);
      first = false;
    }
    return out || p;
  }
  function explainXP(expr) {
    var parts = splitTop(expr, "|").map(function (p) { return p.trim(); }).filter(Boolean);
    if (parts.length > 1) {
      return "并集（" + parts.length + " 组）：" + parts.map(explainPath).join("；或 ");
    }
    return explainPath(parts[0] || expr);
  }

  /* ---------------- 由节点反推写法 ---------------- */
  function ownCss(el) {
    var t = tagOf(el), cls = clsOf(el), out = [], i;
    if (el.id) out.push("#" + el.id);
    for (i = 0; i < el.attributes.length; i++) {
      var a = el.attributes[i];
      if (a.name === "data-node-id") continue;
      if (a.name.indexOf("data-") === 0) out.push(t + "[" + a.name + '="' + a.value + '"]');
    }
    var href = el.getAttribute("href");
    if (href) out.push(t + '[href="' + href + '"]');
    if (cls.length) { out.push(t + "." + cls.join(".")); out.push("." + cls[0]); }
    out.push(t);
    return out;
  }
  function anchorCss(el) {
    var a = el.parentElement, hops = 0;
    while (a && a !== pageDoc && hops++ < 6) {
      var c = ownCss(a);
      for (var i = 0; i < c.length; i++) if (cssCount(c[i]) === 1) return c[i];
      a = a.parentElement;
    }
    return null;
  }
  function cssFor(el) {
    var cands = ownCss(el), i;
    for (i = 0; i < cands.length; i++) if (cssCount(cands[i]) === 1) return cands[i];
    var anc = anchorCss(el);
    if (anc) {
      var t = tagOf(el), cls = clsOf(el), selfs = [];
      if (cls.length) selfs.push(t + "." + cls[0]);
      selfs.push(t);
      for (i = 0; i < selfs.length; i++) {
        var s = anc + " " + selfs[i];
        if (cssCount(s) === 1) return s;
      }
    }
    var k = 1, sib = el.previousElementSibling, t2 = tagOf(el);
    while (sib) { if (sib.tagName === el.tagName) k++; sib = sib.previousElementSibling; }
    return (anc ? anc + " " + t2 : t2) + ":nth-of-type(" + k + ")";
  }

  function ownXP(el) {
    var t = tagOf(el), cls = clsOf(el), out = [], i;
    if (el.id) out.push('//*[@id="' + el.id + '"]');
    for (i = 0; i < el.attributes.length; i++) {
      var a = el.attributes[i];
      if (a.name === "data-node-id") continue;
      if (a.name.indexOf("data-") === 0) out.push("//" + t + "[@" + a.name + '="' + a.value + '"]');
    }
    var href = el.getAttribute("href");
    if (href) out.push("//" + t + '[@href="' + href + '"]');
    if (cls.length) out.push("//" + t + '[@class="' + cls.join(" ") + '"]');
    out.push("//" + t);
    return out;
  }
  function anchorXP(el) {
    var a = el.parentElement, hops = 0;
    while (a && a !== pageDoc && hops++ < 6) {
      var c = ownXP(a);
      for (var i = 0; i < c.length; i++) if (xpCount(c[i]) === 1) return c[i];
      a = a.parentElement;
    }
    return null;
  }
  function xpathFor(el) {
    var cands = ownXP(el), i;
    for (i = 0; i < cands.length; i++) if (xpCount(cands[i]) === 1) return cands[i];
    var anc = anchorXP(el);
    if (anc) {
      var t = tagOf(el), cls = clsOf(el), selfs = [];
      if (cls.length) selfs.push("//" + t + '[@class="' + cls.join(" ") + '"]');
      selfs.push("//" + t);
      for (i = 0; i < selfs.length; i++) {
        var s = anc + selfs[i];
        if (xpCount(s) === 1) return s;
      }
    }
    var dt = directText(el);
    if (dt && dt.length <= 20) {
      var txtSel = "//" + tagOf(el) + '[text()="' + dt + '"]';
      if (xpCount(txtSel) === 1) return txtSel;
    }
    var t2 = tagOf(el), cls2 = clsOf(el);
    var base = cls2.length ? "//" + t2 + '[@class="' + cls2.join(" ") + '"]' : "//" + t2;
    var r = evalXP(base);
    var idx = r.ok ? r.nodes.indexOf(el) + 1 : 0;
    if (idx > 0) {
      var cand = base + "[" + idx + "]";
      if (xpCount(cand) === 1) return cand;
      cand = "(" + base + ")[" + idx + "]";
      if (xpCount(cand) === 1) return cand;
    }
    return base;
  }

  /* ---------------- DOM 树 / 源码 ---------------- */
  function elRow(el, depth) {
    var row = document.createElement("div");
    row.className = "tr";
    row.setAttribute("data-nid", nid(el));
    row.setAttribute("data-depth", depth);
    row.style.paddingLeft = (4 + depth * 12) + "px";
    var kids = el.children.length;
    var cls = clsOf(el), dt = "";
    for (var i = 0; i < el.attributes.length; i++) {
      var a = el.attributes[i];
      if (a.name.indexOf("data-") === 0 && a.name !== "data-node-id") {
        dt += "[" + a.name + '="' + a.value + '"]';
      }
    }
    if (kids) row.setAttribute("data-kids", "1");
    var txt = directText(el);
    if (txt.length > 16) txt = txt.slice(0, 16) + "…";
    var html = '<span class="tw">' + (kids ? "▾" : "·") + '</span>' +
               '<span class="tg">' + esc(tagOf(el)) + '</span>';
    if (el.id) html += '<span class="at">#' + esc(el.id) + '</span>';
    if (cls.length) html += '<span class="at">.' + esc(cls.join(".")) + '</span>';
    if (dt) html += '<span class="dt">' + esc(dt) + '</span>';
    if (txt) html += '<span class="tx">' + esc(txt) + '</span>';
    row.innerHTML = html;
    return row;
  }
  function txtRow(node, depth) {
    var row = document.createElement("div");
    row.className = "tr tr-txt";
    row.setAttribute("data-depth", depth);
    row.style.paddingLeft = (4 + depth * 12) + "px";
    row.innerHTML = '<span class="tw">·</span><span class="tgt">#text</span>' +
                    '<span class="tx">"' + esc(node.nodeValue.replace(/\s+/g, " ").trim()) + '"</span>';
    return row;
  }
  function buildTree() {
    treeEl.innerHTML = "";
    var frag = document.createDocumentFragment();
    frag.appendChild(elRow(docRoot, 0));
    (function walk(node, depth) {
      for (var i = 0; i < node.childNodes.length; i++) {
        var n = node.childNodes[i];
        if (n.nodeType === 1) { frag.appendChild(elRow(n, depth)); walk(n, depth + 1); }
        else if (n.nodeType === 3 && n.nodeValue.trim()) frag.appendChild(txtRow(n, depth));
      }
    })(docRoot, 1);
    treeEl.appendChild(frag);
    refreshFold();
  }
  function refreshFold() {
    var rows = arr(treeEl.children), stack = [];
    rows.forEach(function (r) {
      var d = parseInt(r.getAttribute("data-depth"), 10) || 0;
      while (stack.length && stack[stack.length - 1] >= d) stack.pop();
      var hid = stack.length > 0;
      r.classList.toggle("is-hid", hid);
      if (!hid && r.classList.contains("is-collapsed")) stack.push(d);
    });
  }
  function setAllFolded(fold) {
    arr(treeEl.querySelectorAll(".tr[data-kids]")).forEach(function (r) {
      r.classList.toggle("is-collapsed", fold);
      var tw = r.querySelector(".tw");
      if (tw) tw.textContent = fold ? "▸" : "▾";
    });
    refreshFold();
  }

  var SKIP_ATTR = { "data-node-id": 1, tabindex: 1 };

  function tagHTML(el) {
    var t = tagOf(el);
    var s = '<span class="sx">&lt;</span><span class="sg">' + t + '</span>';
    for (var i = 0; i < el.attributes.length; i++) {
      var a = el.attributes[i];
      if (SKIP_ATTR[a.name]) continue;
      s += ' <span class="sa">' + a.name + '</span>=<span class="sv">"' + esc(a.value) + '"</span>';
    }
    s += '<span class="sx">&gt;</span>';
    return s;
  }
  function closeHTML(el) {
    var t = tagOf(el);
    return '<span class="sx">&lt;/</span><span class="sg">' + t + '</span><span class="sx">&gt;</span>';
  }
  function inlineHTML(el) {
    var s = tagHTML(el);
    for (var i = 0; i < el.childNodes.length; i++) {
      var n = el.childNodes[i];
      if (n.nodeType === 3) {
        var t = n.nodeValue.replace(/\s+/g, " ");
        if (t.trim()) s += '<span class="st">' + esc(t) + '</span>';
      } else if (n.nodeType === 1) {
        s += inlineHTML(n);
      }
    }
    return s + closeHTML(el);
  }
  function buildSource() {
    var lines = [];
    function collect(el, out) {
      out.push(nid(el));
      for (var i = 0; i < el.children.length; i++) collect(el.children[i], out);
      return out;
    }
    function blocksAmong(el) {
      var n = 0;
      for (var i = 0; i < el.children.length; i++) {
        if (BLOCK[tagOf(el.children[i])]) n++;
      }
      return n;
    }
    function visibleLen(h) {
      return h.replace(/<[^>]*>/g, "").replace(/&[a-z]+;/g, "x").length;
    }
    (function emit(el, depth) {
      var pad = new Array(depth + 1).join("  ");
      if (!blocksAmong(el)) {
        var one = inlineHTML(el);
        if (visibleLen(pad + one) <= 64) {
          lines.push({ html: pad + one, nids: collect(el, []) });
          return;
        }
        lines.push({ html: pad + tagHTML(el), nids: [nid(el)] });
        for (var k = 0; k < el.childNodes.length; k++) {
          var ck = el.childNodes[k];
          if (ck.nodeType === 1) emit(ck, depth + 1);
          else if (ck.nodeType === 3 && ck.nodeValue.trim()) {
            lines.push({ html: pad + '  <span class="st">' + esc(ck.nodeValue.replace(/\s+/g, " ").trim()) + '</span>', nids: [] });
          }
        }
        lines.push({ html: pad + closeHTML(el), nids: [nid(el)] });
        return;
      }
      lines.push({ html: pad + tagHTML(el), nids: [nid(el)] });
      for (var i = 0; i < el.childNodes.length; i++) {
        var c = el.childNodes[i];
        if (c.nodeType === 1) emit(c, depth + 1);
        else if (c.nodeType === 3 && c.nodeValue.trim()) {
          lines.push({ html: pad + '  <span class="st">' + esc(c.nodeValue.replace(/\s+/g, " ").trim()) + '</span>', nids: [] });
        }
      }
      lines.push({ html: pad + closeHTML(el), nids: [nid(el)] });
    })(docRoot, 0);

    srcEl.innerHTML = "";
    srcNids = [];
    lines.forEach(function (ln) {
      var d = document.createElement("span");
      d.className = "src-line";
      d.innerHTML = ln.html;
      d.setAttribute("data-i", String(srcNids.length));
      srcEl.appendChild(d);
      srcNids.push(ln.nids);
    });
  }

  var BLOCK = { div: 1, header: 1, main: 1, section: 1, ul: 1, ol: 1, li: 1,
                p: 1, h1: 1, h2: 1, h3: 1, nav: 1, footer: 1 };

  /* ---------------- 高亮 ---------------- */
  function clearHits() {
    if (gsap) gsap.killTweensOf(arr(hitsEl.children));
    hitsEl.innerHTML = "";
  }
  function drawBoxes(list, animate) {
    clearHits();
    if (!list || !list.length) return;
    var base = hitsEl.getBoundingClientRect();
    var boxes = [];
    list.forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (!r.width && !r.height) return;
      var b = document.createElement("b");
      b.className = "hb";
      b.style.left = (r.left - base.left) + "px";
      b.style.top = (r.top - base.top) + "px";
      b.style.width = r.width + "px";
      b.style.height = r.height + "px";
      hitsEl.appendChild(b);
      boxes.push(b);
    });
    if (!gsap || api.reduced || animate === false || !boxes.length) return;
    gsap.fromTo(boxes, { scaleX: 0, opacity: 0 },
      { scaleX: 1, opacity: 1, duration: .3, ease: "power2.out", stagger: .035 });
  }
  function markRows(list) {
    var ids = {};
    (list || []).forEach(function (el) { if (el && el.nodeType === 1) ids[nid(el) || ""] = 1; });
    arr(treeEl.querySelectorAll(".tr")).forEach(function (r) {
      var id = r.getAttribute("data-nid");
      r.classList.toggle("is-hit", !!(id && ids[id]));
    });
  }
  function markSource(list) {
    var ids = {}, firstHitIdx = -1;
    (list || []).forEach(function (el) { if (el && el.nodeType === 1) ids[nid(el) || ""] = 1; });
    arr(srcEl.children).forEach(function (row, i) {
      var list2 = srcNids[i] || [], hit = false;
      for (var k = 0; k < list2.length; k++) {
        if (ids[list2[k]]) { hit = true; break; }
      }
      row.classList.toggle("is-hit", hit);
      if (hit && firstHitIdx < 0) firstHitIdx = i;
    });
    if (firstHitIdx > 1 && srcEl.scrollHeight > srcEl.clientHeight + 4) {
      var row = srcEl.children[firstHitIdx - 1];
      if (row) srcEl.scrollTop = Math.max(0, row.offsetTop - srcEl.offsetTop - 24);
    }
  }

  /* ---------------- 结果区 ---------------- */
  function setBadge(n, bad) {
    nEl.textContent = String(n);
    badgeEl.classList.toggle("is-zero", n === 0);
    badgeEl.classList.toggle("is-bad", !!bad);
  }
  function renderList(res, isXP) {
    listEl.innerHTML = "";
    if (!res.ok) {
      listEl.innerHTML = '<div class="hit"><span class="h-empty">表达式无效，改一下再看。</span></div>';
      return;
    }
    if (res.kind === "scalar") {
      listEl.innerHTML = '<div class="hit"><span class="h-empty">' +
        esc(res.vals[0] || "") + "</span></div>";
      return;
    }
    if (!res.nodes.length) {
      listEl.innerHTML = '<div class="hit"><span class="h-empty">空集：这套页面里没有元素符合。</span></div>';
      return;
    }
    var vals = res.vals || [];
    res.nodes.slice(0, 40).forEach(function (n, i) {
      var d = document.createElement("div");
      d.className = "hit";
      var el = n.nodeType === 1 ? n : (n.parentNode || null);
      if (el && el.nodeType === 1) d.setAttribute("data-nid", nid(el) || "");
      var tx = "";
      if (n.nodeType === 2) tx = '"' + n.value + '"';
      else if (n.nodeType === 3) tx = '"' + n.nodeValue.replace(/\s+/g, " ").trim() + '"';
      else if (vals[i]) tx = vals[i];
      else if (n.nodeType === 1) {
        var t = directText(n);
        if (t) tx = "「" + (t.length > 18 ? t.slice(0, 18) + "…" : t) + "」";
        else if (n.getAttribute && n.getAttribute("href")) tx = "href=" + n.getAttribute("href");
      }
      d.innerHTML = '<span class="h-n">' + (i + 1) + "</span>" +
        '<span class="h-main"><span class="h-tag">' +
        esc(n.nodeType === 1 ? summarize(n) : (n.nodeType === 2 ? "@" + n.name : "#text")) +
        '</span><span class="h-tx">' + esc(tx) + "</span></span>";
      listEl.appendChild(d);
    });
  }
  function updateCode() {
    var v = inputEl.value.trim();
    var q = esc(v);
    if (!v) { codeEl.innerHTML = '<span class="c"># 等待输入…</span>'; return; }
    if (mode === "css") {
      codeEl.innerHTML =
        '<span class="c"># BeautifulSoup / Selenium</span>\n' +
        '<span class="k">soup</span>.<span class="f">select</span>(<span class="s">"' + q + '"</span>)\n' +
        '<span class="k">driver</span>.<span class="f">find_elements</span>(<span class="p">By</span>.<span class="p">CSS_SELECTOR</span>, <span class="s">"' + q + '"</span>)';
    } else {
      codeEl.innerHTML =
        '<span class="c"># 浏览器 API / Selenium</span>\n' +
        '<span class="k">document</span>.<span class="f">evaluate</span>(<span class="s">"' + q + '"</span>, root, null, <span class="p">7</span>, null)\n' +
        '<span class="k">driver</span>.<span class="f">find_elements</span>(<span class="p">By</span>.<span class="p">XPATH</span>, <span class="s">"' + q + '"</span>)';
    }
  }

  /* ---------------- 主执行 ---------------- */
  function run(expr, animate) {
    var s = String(expr == null ? inputEl.value : expr).trim();
    cmdEl.classList.remove("is-bad");
    if (!s) {
      setBadge(0);
      sayEl.textContent = "输入一条 " + (mode === "css" ? "CSS 选择器" : "XPath 路径") + "。";
      listEl.innerHTML = "";
      clearHits(); markRows([]); markSource([]);
      updateCode();
      return;
    }
    var res, hits = [], errMsg = "";
    if (mode === "css") {
      if (/::?(before|after|first-line|first-letter|selection|placeholder|marker|backdrop|part|slotted)\b/.test(s)) {
        errMsg = "「::before / ::after」是伪元素：它不是 DOM 节点，而是浏览器画出来的装饰层。" +
                 "querySelectorAll 取不到，BeautifulSoup / Scrapy 更取不到——要拿这类内容，只能先取宿主元素再处理文本。";
      } else try { res = queryCSS(s); }
      catch (e) {
        errMsg = "CSS 选择器解析不了：" + e.message + "（CSS 语法严格，拼错一个字符整条作废）";
      }
    } else {
      res = evalXP(s);
      if (!res.ok) errMsg = "XPath 解析失败：" + res.err;
    }

    if (errMsg) {
      cmdEl.classList.add("is-bad");
      setBadge(0, true);
      sayEl.innerHTML = '<span class="bad">' + esc(errMsg) + "</span>";
      listEl.innerHTML = "";
      clearHits(); markRows([]); markSource([]);
      updateCode();
      return;
    }

    hits = res.els || [];
    lastHits = hits;
    setBadge(res.nodes.length);
    if (!res.nodes.length) {
      sayEl.innerHTML = "没有命中——" + (mode === "css"
        ? "检查 class 名大小写与层级：CSS 是严格匹配，不是模糊搜索。"
        : "检查层级与谓词：XPath 是路径，写错一层就断。");
    } else {
      var human = mode === "css" ? explainCSS(s) : explainXP(s);
      sayEl.innerHTML = "匹配：<b>" + esc(human) + "</b>";
    }
    markRows(hits);
    markSource(hits);
    drawBoxes(hits, animate);
    renderList(res, mode === "xpath");
    updateCode();
  }

  /* ---------------- 节点卡 ---------------- */
  function clearSel() {
    arr(treeEl.querySelectorAll(".is-sel")).forEach(function (r) { r.classList.remove("is-sel"); });
    curSelRow = null;
  }
  function clearNodeCard() {
    curNode = null;
    nodeBody.innerHTML = '<div class="nc-empty">点中间 DOM 树任意一行：这里会同时给出 CSS 与 XPath 两种写法、各自命中几个，' +
      '以及这个节点的 text() / href。点任一行即用该语法执行。</div>';
    nodeHint.textContent = "尚未选择节点";
  }
  function showNodeCard(el) {
    var cssSel = cssFor(el);
    var xpSel = xpathFor(el);
    var cN = cssCount(cssSel), xN = xpCount(xpSel);
    var prev = [];
    var dt = directText(el);
    if (dt) prev.push("「" + (dt.length > 22 ? dt.slice(0, 22) + "…" : dt) + "」");
    var href = el.getAttribute("href");
    if (href) prev.push("href=" + href);
    nodeBody.innerHTML =
      '<div class="nc-head"><code class="nc-tag">' + esc(summarize(el)) + '</code>' +
      '<span class="nc-prev">' + esc(prev.join("   ")) + '</span></div>' +
      '<button class="nc-row css' + (mode === "css" ? " is-on" : "") + '" type="button" data-mode="css">' +
        '<span class="nc-k">CSS</span><code class="nc-e">' + esc(cssSel) + '</code>' +
        '<b class="nc-n">' + cN + '</b></button>' +
      '<button class="nc-row xp' + (mode === "xpath" ? " is-on" : "") + '" type="button" data-mode="xpath">' +
        '<span class="nc-k">XPath</span><code class="nc-e">' + esc(xpSel) + '</code>' +
        '<b class="nc-n">' + xN + '</b></button>';
    nodeHint.textContent = "点行即用该语法执行";
    curNode = { el: el, css: cssSel, xpath: xpSel };
  }

  function inspect(el, row) {
    clearTimeout(dTimer);
    showNodeCard(el);
    var s = mode === "css" ? curNode.css : curNode.xpath;
    inputEl.value = s;
    exprByMode[mode] = s;
    clearSel();
    if (row) { row.classList.add("is-sel"); curSelRow = row; }
    run(s, true);
    syncChips();
  }

  /* ---------------- 模式 / 预设 / 对照表 ---------------- */
  function syncChips() {
    arr(chipsEl.querySelectorAll(".chip")).forEach(function (c) {
      c.classList.toggle("is-on", c.getAttribute("data-x") === inputEl.value.trim());
    });
  }
  function buildChips() {
    chipsEl.innerHTML = "";
    PRESETS[mode].forEach(function (p) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "chip";
      b.textContent = p;
      b.setAttribute("data-x", p);
      chipsEl.appendChild(b);
    });
    syncChips();
  }
  function setMode(m, opts) {
    mode = m;
    arr(modeEl.querySelectorAll(".mb")).forEach(function (b) {
      b.classList.toggle("is-on", b.getAttribute("data-mode") === m);
    });
    modeHint.textContent = HINTS[m];
    apiEl.textContent = APIS[m];
    cmdK.textContent = m === "css" ? "CSS" : "XPath";
    if (!(opts && opts.keep)) {
      inputEl.value = curNode ? (m === "css" ? curNode.css : curNode.xpath) : exprByMode[m];
    }
    buildChips();
    var cards = arr(nodeBody.querySelectorAll(".nc-row"));
    cards.forEach(function (r) { r.classList.toggle("is-on", r.getAttribute("data-mode") === m); });
  }
  function buildMap() {
    mapEl.innerHTML = "";
    MAPS.forEach(function (row, i) {
      var wrap = document.createElement("div");
      wrap.className = "map-row";
      var left;
      if (row[0]) {
        left = document.createElement("button");
        left.type = "button";
        left.className = "map-css";
        left.textContent = row[0];
        left.setAttribute("data-x", row[0]);
        left.setAttribute("data-mode", "css");
        left.title = "用 CSS 执行：" + row[0];
      } else {
        left = document.createElement("span");
        left.className = "map-css";
        left.style.color = "var(--text-3)";
        left.style.cursor = "default";
        left.textContent = "CSS 取不到";
      }
      var mid = document.createElement("i");
      mid.textContent = "↔";
      var right = document.createElement("button");
      right.type = "button";
      right.className = "map-xp";
      right.textContent = row[1];
      right.setAttribute("data-x", row[1]);
      right.setAttribute("data-mode", "xpath");
      right.title = "用 XPath 执行：" + row[1];
      wrap.appendChild(left); wrap.appendChild(mid); wrap.appendChild(right);
      mapEl.appendChild(wrap);
    });
  }

  /* ---------------- 交互 ---------------- */
  function clearHover() {
    arr(root.querySelectorAll(".is-peek")).forEach(function (el) { el.classList.remove("is-peek"); });
  }
  function hoverNid(id) {
    clearHover();
    if (!id) return;
    var el = pageDoc.querySelector('[data-node-id="' + id + '"]');
    if (el) el.classList.add("is-peek");
    var row = treeEl.querySelector('[data-nid="' + id + '"]');
    if (row) row.classList.add("is-peek");
  }

  function bind() {
    inputEl.addEventListener("input", function () {
      clearNodeCard();
      clearSel();
      syncChips();
      clearTimeout(dTimer);
      dTimer = setTimeout(function () {
        exprByMode[mode] = inputEl.value.trim();
        run(inputEl.value, true);
      }, 120);
    });
    inputEl.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        clearTimeout(dTimer);
        exprByMode[mode] = inputEl.value.trim();
        run(inputEl.value, true);
      }
    });
    modeEl.addEventListener("click", function (e) {
      var b = e.target.closest(".mb");
      if (!b) return;
      var m = b.getAttribute("data-mode");
      if (m === mode) return;
      setMode(m);
      run(inputEl.value, true);
    });
    chipsEl.addEventListener("click", function (e) {
      var c = e.target.closest(".chip");
      if (!c) return;
      clearTimeout(dTimer);
      clearNodeCard();
      clearSel();
      inputEl.value = c.getAttribute("data-x");
      exprByMode[mode] = inputEl.value;
      run(inputEl.value, true);
      syncChips();
    });
    mapEl.addEventListener("click", function (e) {
      var b = e.target.closest("button[data-x]");
      if (!b) return;
      var m = b.getAttribute("data-mode");
      if (m !== mode) { setMode(m, { keep: true }); }
      clearNodeCard();
      clearSel();
      inputEl.value = b.getAttribute("data-x");
      exprByMode[mode] = inputEl.value;
      run(inputEl.value, true);
      syncChips();
      var scrollTop = api && api.reader && api.getScrollTop ? api.getScrollTop() : root.scrollTop;
      if (scrollTop > 40) {
        root.scrollTo({ top: 0, behavior: api && api.reduced ? "auto" : "smooth" });
      }
    });
    nodeBody.addEventListener("click", function (e) {
      var row = e.target.closest(".nc-row");
      if (!row || !curNode) return;
      var m = row.getAttribute("data-mode");
      var s = m === "css" ? curNode.css : curNode.xpath;
      if (m !== mode) { setMode(m, { keep: true }); }
      inputEl.value = s;
      exprByMode[mode] = s;
      clearSel();
      var treeRow = treeEl.querySelector('[data-nid="' + (nid(curNode.el) || "") + '"]');
      if (treeRow) { treeRow.classList.add("is-sel"); curSelRow = treeRow; }
      arr(nodeBody.querySelectorAll(".nc-row")).forEach(function (r) {
        r.classList.toggle("is-on", r === row);
      });
      run(s, true);
      syncChips();
    });
    treeEl.addEventListener("click", function (e) {
      var tw = e.target.closest(".tw");
      var row = e.target.closest(".tr");
      if (!row) return;
      if (tw) {
        if (row.getAttribute("data-kids")) {
          var collapsed = row.classList.toggle("is-collapsed");
          tw.textContent = collapsed ? "▸" : "▾";
          refreshFold();
        }
        return;
      }
      var id = row.getAttribute("data-nid");
      if (!id) return;
      var el = pageDoc.querySelector('[data-node-id="' + id + '"]');
      if (el) inspect(el, row);
    });
    treeEl.addEventListener("mouseover", function (e) {
      var row = e.target.closest && e.target.closest(".tr");
      if (row) hoverNid(row.getAttribute("data-nid"));
    });
    treeEl.addEventListener("mouseleave", clearHover);
    pageDoc.addEventListener("mouseover", function (e) {
      var el = e.target.closest && e.target.closest("[data-node-id]");
      if (el && pageDoc.contains(el)) hoverNid(nid(el));
    });
    pageDoc.addEventListener("mouseleave", clearHover);
    srcEl.addEventListener("mouseover", function (e) {
      var ln = e.target.closest && e.target.closest(".src-line");
      if (!ln) return;
      clearHover();
      ln.classList.add("is-peek");
      (srcNids[+ln.getAttribute("data-i")] || []).forEach(function (id) {
        var el = pageDoc.querySelector('[data-node-id="' + id + '"]');
        if (el) el.classList.add("is-peek");
      });
    });
    srcEl.addEventListener("mouseleave", clearHover);
    listEl.addEventListener("click", function (e) {
      var h = e.target.closest(".hit");
      if (!h) return;
      var id = h.getAttribute("data-nid");
      if (!id) return;
      var el = pageDoc.querySelector('[data-node-id="' + id + '"]');
      var row = treeEl.querySelector('[data-nid="' + id + '"]');
      if (el) inspect(el, row);
    });
    listEl.addEventListener("mouseover", function (e) {
      var h = e.target.closest && e.target.closest(".hit");
      if (h) hoverNid(h.getAttribute("data-nid"));
    });
    listEl.addEventListener("mouseleave", clearHover);
    foldEl.addEventListener("click", function () {
      foldAll = !foldAll;
      setAllFolded(foldAll);
      foldEl.textContent = foldAll ? "全展开" : "全收起";
    });
    root.addEventListener("scroll", function () {
      if (!root.classList.contains("is-active")) return;
      drawBoxes(lastHits, false);
    }, { passive: true });
    window.addEventListener("resize", function () {
      if (!root.classList.contains("is-active")) return;
      drawBoxes(lastHits, false);
    });
  }

  /* ---------------- 入场（≤1s，不动根节点） ---------------- */
  function play() {
    clearTimeout(dTimer);
    mode = "css";
    exprByMode = { css: ".title", xpath: '//h3[@class="title"]' };
    foldAll = false;
    foldEl.textContent = "全收起";
    setAllFolded(false);
    clearSel();
    clearNodeCard();
    setMode("css");
    inputEl.value = exprByMode.css;
    if (tl) { tl.kill(); tl = null; }

    var head = arr(root.querySelectorAll(".sel-kickrow, .sel-titlerow"));
    var panels = arr(root.querySelectorAll(".sel-main > .panel, .sel-main > .sel-col1 > .panel"));
    var mapPanel = root.querySelector(".sel-map");
    var ticks = root.querySelector(".sheet-ticks");

    run(inputEl.value, false);

    if (!gsap || api.reduced) {
      if (gsap) gsap.set([head, panels, mapPanel, ticks], { opacity: 1, y: 0, clearProps: "transform" });
      return;
    }
    gsap.set(head, { opacity: 0, y: 8 });
    gsap.set(panels, { opacity: 0, y: 14 });
    gsap.set(mapPanel, { opacity: 0, y: 8 });
    gsap.set(ticks, { opacity: 0 });
    tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.to(ticks, { opacity: 1, duration: .26 })
      .to(head, { opacity: 1, y: 0, duration: .3, stagger: .04 }, "-=.18")
      .to(panels, { opacity: 1, y: 0, duration: .32, stagger: .05 }, "-=.16")
      .to(mapPanel, { opacity: 1, y: 0, duration: .26 }, "-=.12");
  }

  /* ---------------- 初始化 ---------------- */
  (function boot() {
    arr(pageDoc.querySelectorAll("*")).forEach(function (el, i) {
      el.setAttribute("data-node-id", "n" + i);
    });
    buildTree();
    buildSource();
    buildMap();
    bind();
    play();
  })();

  return { replay: play };
});
