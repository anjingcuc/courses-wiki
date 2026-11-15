/* ============================================================
   场景 06 · 把方法用回去
   三个课堂案例共用一条判断流程：① 观察证据 → ② 选择路线 → ③ 验证结果
   切案例只换「证据 / 选项 / 结果 / 讲师原话」，流程骨架不动
   A 静态学生名单：URL 归一化后再判重
   B 无限滚动名单：直取 data?page=N + json.loads（headless 是兜底）
   C 库存 1000→999：按顺序点亮「JS 发 XHR → 改 DOM」路径
   ============================================================ */
BP.scene("sc-practice", function (root, gsap, api) {
  var reduced = !!(api && api.reduced);
  var tl = null;
  var cur = "A";

  function qa(sel) { return Array.prototype.slice.call(root.querySelectorAll(sel)); }
  function q1(sel) { return root.querySelector(sel); }
  function closest(el, sel) {
    while (el && el !== root) {
      if (el.nodeType === 1 && el.matches && el.matches(sel)) return el;
      el = el.parentNode;
    }
    return null;
  }
  function freshState() {
    return {
      A: { done: false },
      B: { done: false },
      C: { done: false, seq: [] }
    };
  }

  /* ---------------- 三个案例的数据 ---------------- */
  var CASES = {
    A: {
      ev: [
        ["右键查看网页源代码", "学生 ID 都在 <code>&lt;li&gt;</code> 里 —— 一次请求就能拿到整页，不需要浏览器。"],
        ["页面里的链接", "每条 <code>&lt;a href=\"2.html\"&gt;</code> 都是相对路径，抓之前要拼上前缀 <code>http://127.0.0.1:8000/</code>。"],
        ["抓完对账", "首页被抓了两次：<code>index.html</code> 和「1」指向同一页 —— <b>字符串不同，字典判重失效</b>。"]
      ],
      foot: "证据顺序：先看源代码 → 再点链接看 href → 最后对账页数与人数。",
      kind: "pick",
      opts: [
        { k: "1", t: "加一个 time.sleep，抓慢一点", ok: false,
          hint: "慢不解决重复：同一页换个写法照样进待抓队列，还是会被再抓一次。" },
        { k: "2", t: "先把 URL 归一化，再进已抓集合判重", ok: true,
          hint: "对。先去锚点、去尾斜杠，拿归一化后的字符串当 key —— 同一个页面只剩一个 key。" },
        { k: "3", t: "换成 headless 再抓一遍", ok: false,
          hint: "静态页根本不需要浏览器：代价白花，重复抓取一点没解决。" }
      ],
      okline: "归一化 + 判重，重复抓取清零",
      res: {
        code: 'from urllib.parse import urljoin, urldefrag\n\n'
            + 'def norm(u):\n'
            + '    return urldefrag(u)[0].rstrip("/")       # 去锚点、去结尾斜杠\n\n'
            + 'if norm(url) in done:                      # 先归一化，再判重\n'
            + '    continue\n'
            + 'done[norm(url)] = True\n'
            + 'for a in soup.select("a[href]"):           # 相对链接补前缀\n'
            + '    links.append(urljoin(BASE, a["href"]))',
        stat: "去重后 4 页 · 学生 57 人 · 重复抓取 0 次"
      },
      quote: { t: "我们以前学字典的时候不是跟大家说了吗，字典里面的 key 是唯一的。", src: "P3 24:50" }
    },

    B: {
      ev: [
        ["首屏", "只有前 20 条；列表里没有 <code>&lt;a&gt;</code> 元素，翻页靠往下滚。"],
        ["Network", "滚到底多出一条 XHR：<code>data?page=2</code>，响应是一串 JSON。"],
        ["requests.get 页面", "拿到的 HTML 里，后面那些 <code>&lt;li&gt;</code> 全部不见 —— 它们还没被 JS 写上去。"]
      ],
      foot: "证据顺序：先数首屏条数 → 再盯 Network 的新请求 → 最后比对 requests 拿到的 HTML。",
      kind: "pick",
      opts: [
        { k: "1", t: "requests.get 页面 + 正则扫 HTML", ok: false,
          hint: "页面 HTML 里本来就没有后面的数据，正则也扫不出来。" },
        { k: "2", t: "直接打 data?page=N，用 json.loads 解析", ok: true,
          hint: "对。接口已经暴露在 Network 里，一次请求拿一页，全程不渲染。" },
        { k: "3", t: "上 headless，模拟滚动到底", ok: false,
          hint: "能拿到，但每页都要等浏览器渲染；接口就在眼前，先试接口，抓不到再退回 headless。" }
      ],
      okline: "打接口比开浏览器快一个数量级",
      res: {
        code: 'import requests, json\n\n'
            + 'students = []\n'
            + 'for page in range(1, 5):                        # 1..4，第 5 页取不到\n'
            + '    r = requests.get(BASE + "/data?page=" + str(page))\n'
            + '    r.encoding = "utf-8"\n'
            + '    data = json.loads(r.text)                   # 字符串 → 字典\n'
            + '    students += [x.strip() for x in data["data"]]',
        stat: "4 次请求 · 80 条 · 约 1 秒（headless 要几十秒）"
      },
      quote: { t: "我只能抓到前十个……我也没有办法去模拟这个滚动往下拉这个滚动条的过程。傻眼了。", src: "P4 05:39" }
    },

    C: {
      ev: [
        ["页面", "库存从 <b>1000</b> 变成 <b>999</b>，地址栏没变、页面也没跳。"],
        ["Network", "每 2 秒一条 XHR：<code>/stock?id=7</code>，响应 <code>{\"stock\": 999}</code>。"],
        ["文档请求", "整页 HTML 只请求了 1 次 —— 页面从来没有重新渲染。"]
      ],
      foot: "证据顺序：先看页面变没变 → 再看 Network 有没有新请求 → 最后数 Doc 请求条数。",
      kind: "path",
      path: [
        { k: "t", tag: "JS", t: "定时器到点，触发一次请求", ok: true },
        { k: "x", tag: "XHR", t: "浏览器发 XHR 到 /stock", ok: true },
        { k: "j", tag: "JSON", t: "拿到 {\"stock\": 999}", ok: true },
        { k: "d", tag: "DOM", t: "只改页面上那个数字的文本", ok: true },
        { k: "r", tag: "整页", t: "服务器重新渲染整页 HTML", ok: false }
      ],
      okline: "JS 发 XHR → 拿 JSON → 改 DOM",
      res: {
        code: '# 只要库存数字：不碰 DOM，直接打那条接口\n'
            + 'r = requests.get(BASE + "/stock?id=7")\n'
            + 'stock = json.loads(r.text)["stock"]        # 999',
        stat: "1 次请求 · 拿到 999 · 不用开浏览器"
      },
      quote: { t: "用户没有进行任何操作，你的页面自动就在局部进行了动态的变化。", src: "Web 开发 P2 15:35" }
    }
  };

  var state = freshState();

  var evEl = q1(".pr-ev");
  var chEl = q1(".pr-choice");
  var fbEl = q1(".pr-fb");
  var resEl = q1(".pr-res");
  var quoteEl = q1(".pr-quote");
  var hintEl = q1(".pr-st2h");
  var a1 = q1('.pr-arrow[data-arrow="1"]');
  var a2 = q1('.pr-arrow[data-arrow="2"]');

  function setFb(kind, html) {
    if (!fbEl) return;
    fbEl.className = "pr-fb" + (kind ? " is-" + kind : "");
    fbEl.innerHTML = html || "";
  }

  var footEl = q1(".pr-st-foot");

  function renderEvidence(c) {
    if (!evEl) return;
    evEl.innerHTML = c.ev.map(function (r) {
      return '<div class="pr-ev-row"><span class="pr-ev-k">' + r[0] + '</span>'
        + '<p class="pr-ev-v">' + r[1] + '</p></div>';
    }).join("");
    if (footEl) footEl.textContent = c.foot;
  }

  function renderChoice(c) {
    if (!chEl) return;
    var s = state[cur];
    if (c.kind === "pick") {
      chEl.className = "pr-choice";
      chEl.innerHTML = c.opts.map(function (o) {
        var cls = "pr-opt" + (s.done && o.ok ? " is-ok is-done" : "");
        return '<button class="' + cls + '" type="button" data-k="' + o.k + '">'
          + '<i>' + o.k + '</i><span>' + o.t + '</span></button>';
      }).join("");
    } else {
      chEl.className = "pr-path";
      chEl.innerHTML = c.path.map(function (n) {
        var on = s.done || s.seq.indexOf(n.k) >= 0;
        return '<button class="pr-node' + (on ? " is-done" : "") + '" type="button" data-k="' + n.k + '">'
          + '<span class="pr-node-k">' + n.tag + '</span><span>' + n.t + '</span></button>';
      }).join("");
    }
  }

  function renderResult(c) {
    if (!resEl) return;
    var s = state[cur];
    if (!s.done) {
      resEl.innerHTML = '<p class="pr-lock">先在 02 走到正确路线，这里才会出代码与结果。<br>'
        + '走错了也没关系 —— 反馈会告诉你代价花在哪。</p>';
      return;
    }
    resEl.innerHTML = '<div class="pr-ok"><span class="tag g">路线成立</span><span>' + c.okline + '</span></div>'
      + '<pre class="code pr-code">' + c.res.code + '</pre>'
      + '<p class="pr-stat">' + c.res.stat + '</p>';
  }

  function syncTabs() {
    qa(".pr-tab").forEach(function (b) {
      var id = b.getAttribute("data-case");
      var on = id === cur;
      b.classList.toggle("is-on", on);
      b.setAttribute("aria-selected", on ? "true" : "false");
      b.classList.toggle("is-done", !!state[id] && state[id].done);
    });
  }

  function render() {
    var c = CASES[cur];
    renderEvidence(c);
    renderChoice(c);
    renderResult(c);
    syncTabs();
    if (hintEl) hintEl.textContent = c.kind === "pick" ? "点一个你认为对的" : "按发生顺序点亮路径";
    if (quoteEl) {
      quoteEl.innerHTML = '<blockquote>「' + c.quote.t + '」</blockquote>'
        + '<span class="pr-quote-src">讲师原话 · ' + c.quote.src + '</span>';
    }
    if (state[cur].done) setFb("ok", "<b>已完成</b>" + c.okline);
    else setFb("", "");
    if (a2) a2.classList.toggle("is-live", state[cur].done);
    if (a1) a1.classList.toggle("is-live", state[cur].done);
  }

  /* ---------------- 交互 ---------------- */
  function solve() {
    var s = state[cur];
    if (s.done) return;
    s.done = true;
    renderResult(CASES[cur]);
    syncTabs();
    if (a1) a1.classList.add("is-live");
    if (a2) a2.classList.add("is-live");
    if (gsap && !reduced && resEl) {
      var kids = Array.prototype.slice.call(resEl.children);
      gsap.fromTo(kids, { opacity: 0, y: 8 },
        { opacity: 1, y: 0, duration: .32, stagger: .06, ease: "power2.out" });
    }
  }

  function pick(btn) {
    var c = CASES[cur], s = state[cur];
    if (s.done) return;
    var o = null;
    c.opts.forEach(function (x) { if (x.k === btn.getAttribute("data-k")) o = x; });
    if (!o) return;
    if (a1) a1.classList.add("is-live");
    if (o.ok) {
      btn.classList.add("is-ok");
      setFb("ok", "<b>对</b>" + o.hint);
      solve();
    } else {
      btn.classList.add("is-bad");
      setFb("bad", "<b>不对</b>" + o.hint);
      if (gsap && !reduced) gsap.fromTo(btn, { x: -4 }, { x: 0, duration: .28, ease: "power2.out" });
    }
  }

  function tapNode(btn) {
    var c = CASES[cur], s = state[cur];
    if (s.done) return;
    var k = btn.getAttribute("data-k");
    var expect = c.path.filter(function (p) { return p.ok; }).map(function (p) { return p.k; });
    if (a1) a1.classList.add("is-live");
    if (k === expect[s.seq.length]) {
      s.seq.push(k);
      btn.classList.add("is-done");
      if (s.seq.length === expect.length) {
        setFb("ok", "<b>对</b>顺序是：定时器 → 发 XHR → 拿 JSON → 改 DOM；整页自始至终没有重载。");
        solve();
      } else {
        setFb("", "");
      }
    } else {
      btn.classList.add("is-bad");
      setFb("bad", "<b>不对</b>" + (k === "r"
        ? "整页没有重载：Network 里 Doc 请求只有 1 条，页面骨架一直没换。"
        : "顺序反了 —— 先发生的不是它，回到 01 看证据的先后。"));
      if (gsap && !reduced) gsap.fromTo(btn, { x: -4 }, { x: 0, duration: .28, ease: "power2.out" });
      setTimeout(function () { btn.classList.remove("is-bad"); }, 1100);
    }
  }

  function setCase(id) {
    if (!CASES[id] || id === cur) return;
    cur = id;
    render();
    if (gsap && !reduced) {
      gsap.fromTo([evEl, chEl, resEl, quoteEl], { opacity: 0, y: 7 },
        { opacity: 1, y: 0, duration: .26, stagger: .04, ease: "power2.out" });
    }
  }

  root.addEventListener("click", function (e) {
    var t = closest(e.target, ".pr-tab");
    if (t) { setCase(t.getAttribute("data-case")); return; }
    var o = closest(e.target, ".pr-opt");
    if (o) { pick(o); return; }
    var n = closest(e.target, ".pr-node");
    if (n) { tapNode(n); }
  });

  /* ---------------- 入场（≤ 1s） ---------------- */
  function play() {
    if (tl) { tl.kill(); tl = null; }
    cur = "A";
    state = freshState();
    qa(".pr-tab").forEach(function (b) { b.classList.remove("is-done"); });
    if (a1) a1.classList.remove("is-live");
    if (a2) a2.classList.remove("is-live");
    render();

    if (!gsap || reduced) {
      qa(".pr-head, .pr-tabs, .pr-flow, .pr-foot").forEach(function (el) {
        el.style.opacity = "";
        el.style.transform = "";
      });
      return;
    }

    var head = qa(".pr-h1").concat(qa(".pr-lede"), qa(".pr-law"), qa(".pr-head .kicker"));
    var tabs = qa(".pr-tab");
    var stages = qa(".pr-stage");
    var arrows = qa(".pr-arrow");
    var foot = qa(".pr-foot");

    gsap.set(head, { opacity: 0, y: 9 });
    gsap.set(tabs, { opacity: 0, y: 9 });
    gsap.set(stages, { opacity: 0, y: 14 });
    gsap.set(arrows, { opacity: 0, scaleX: 0, transformOrigin: "left center" });
    gsap.set(foot, { opacity: 0, y: 8 });

    tl = gsap.timeline({ defaults: { ease: "power2.out" } });
    tl.to(head, { opacity: 1, y: 0, duration: .38, stagger: .05 }, 0)
      .to(tabs, { opacity: 1, y: 0, duration: .32, stagger: .05 }, .14)
      .to(stages, { opacity: 1, y: 0, duration: .38, stagger: .08 }, .24)
      .to(arrows, { opacity: 1, scaleX: 1, duration: .28, stagger: .1 }, .52)
      .to(foot, { opacity: 1, y: 0, duration: .34 }, .66)
      .add(function () {
        gsap.set([head, tabs, stages, foot], { clearProps: "opacity,transform" });
        gsap.set(arrows, { clearProps: "opacity,transform" });
      }, .98);
  }

  play();

  return { replay: play };
});
