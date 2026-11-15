/* ============================================================
   SCENE 02 · 一次往返（v3）
   主图完整落在首屏；节点 hover 出提示、点击展开报文；
   点图内子资源 → 定位下方瀑布行；只有「发送请求」一个控制
   入场 ≤1.2s，往返 ≤1.2s
   ============================================================ */
BP.scene("sc-flow", function (root, gsap, api) {
  "use strict";

  var q = function (s) { return root.querySelector(s); };
  var qa = function (s) { return Array.prototype.slice.call(root.querySelectorAll(s)); };
  var reduced = !!(api && api.reduced);

  var tl = null, loops = [], selKey = null;

  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  /* ---------------- 刻度尺 ---------------- */
  (function ruler() {
    var g = q(".fl-ruler");
    if (!g) return;
    var NS = "http://www.w3.org/2000/svg";
    for (var y = 54, i = 0; y <= 786; y += 22, i++) {
      var ln = document.createElementNS(NS, "line");
      ln.setAttribute("x1", "0");
      ln.setAttribute("x2", i % 5 === 0 ? "9" : "4");
      ln.setAttribute("y1", y); ln.setAttribute("y2", y);
      if (i % 5 === 0) ln.setAttribute("class", "maj");
      g.appendChild(ln);
    }
  })();

  /* ---------------- 步骤文档 ---------------- */
  var DOCS = {
    url: {
      no: "01", name: "输入 URL", tag: "INPUT", cls: "a",
      desc: "浏览器把地址栏里的字符串拆成 <b>scheme / host / path</b>，先查 HTTP 缓存与 HSTS 列表，未命中才真正发网络请求。",
      kv: [["scheme", "https（默认 443）"], ["host", "example.com"], ["path", "/course/m0"], ["缓存", "未命中 → 继续"]],
      code: "https://example.com/course/m0\n ├─ https        443\n ├─ example.com\n └─ /course/m0"
    },
    dns: {
      no: "02", name: "DNS 解析", tag: "DNS", cls: "p",
      desc: "递归解析链：浏览器 DNS 缓存 → 系统 hosts → 本地 DNS 服务器 → 根 / 顶级 / 权威。拿到一条 <b>A 记录</b>，才谈得上 TCP。",
      kv: [["查询", "example.com. IN A"], ["应答", "93.184.216.34"], ["TTL", "300 s"], ["耗时", "12 ms（命中缓存 <1 ms）"]],
      code: ";; ANSWER SECTION\nexample.com.   300   IN   A   93.184.216.34\n\n;; 跟 HTTP 无关，只是「域名 → IP」"
    },
    tcp: {
      no: "03", name: "TCP 连接", tag: "TCP", cls: "p",
      desc: "三次握手建立连接；https 还要多做一次 <b>TLS 握手</b>（1–2 RTT）。这一步之后才可能有 HTTP 语义。",
      kv: [["握手", "SYN → SYN-ACK → ACK"], ["端口", "443 / 80"], ["http2", "同一条连接多路复用"], ["耗时", "24 ms"]],
      code: "SYN        →\nSYN-ACK    ←\nACK        →\nTLS ClientHello / ServerHello …（https 再多 1–2 RTT）"
    },
    req: {
      no: "04", name: "HTTP 请求", tag: "REQUEST", cls: "a",
      desc: "一个纯文本报文：<b>请求行</b>（方法 + 路径 + 版本）、若干<b>请求头</b>、一个空行、可选请求体。GET 没有请求体——所以爬虫只要拼对 URL 和请求头，就等价于浏览器发的这个包。",
      kv: [["方法", "GET"], ["路径", "/index.html"], ["Host", "example.com"], ["Cookie", "sid=8f21c0d3"]],
      code: 'GET /index.html HTTP/1.1\nHost: example.com\nUser-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64)\nAccept: text/html,application/xhtml+xml\nCookie: sid=8f21c0d3; theme=blueprint\nConnection: keep-alive'
    },
    srv: {
      no: "05", name: "服务器处理", tag: "SERVER", cls: "g",
      desc: "静态文件服务器只做 <b>URL → 磁盘路径</b> 的映射：读到什么就返回什么，没有程序逻辑，也就没有「个性化」。（换成 Flask 时，返回的也仍是完整 HTML。）",
      kv: [["服务器", "nginx/1.25"], ["映射", "/course/m0 → /srv/www/course/m0"], ["处理", "读文件 → 写响应"], ["耗时", "≈ 18 ms"]],
      code: "/srv/www/course/m0/index.html\n   ↓ 原样读出\n响应体 = 文件内容（不加一个字节）"
    },
    res: {
      no: "06", name: "HTTP 响应", tag: "RESPONSE", cls: "g",
      desc: "状态行 + 响应头 + 空行 + 响应体。<b>这份 HTML 就是磁盘上那个文件</b>，一个字节都不差——requests 拿到的和浏览器拿到的完全一致。（报文里的字节数是示意值，不是实测。）",
      kv: [["status", "200 OK"], ["Content-Type", "text/html; charset=utf-8"], ["Content-Length", "1264（示意，非实测）"], ["Server", "nginx/1.25"]],
      code: 'HTTP/1.1 200 OK\nContent-Type: text/html; charset=utf-8\nContent-Length: 1264\nLast-Modified: Tue, 03 Nov 2026 02:11:40 GMT\nServer: nginx/1.25\n\n<!doctype html><html lang="zh-CN">\n<head><title>课程资料站</title></head>\n<body><h1>课程资料站</h1>\n<ul><li><a href="/m0">模块 0</a></li>…\n</body></html>'
    },
    parse: {
      no: "07", name: "解析 HTML", tag: "PARSE", cls: "a",
      desc: "浏览器按 HTML 规范做<b>容错解析</b>：未闭合的标签自动补全、错位的表格自动重排。这一步只读字节，<b>不执行 JS</b>。",
      kv: [["算法", "tokenizer → tree construction"], ["容错", "自动补全 </p> </li>"], ["JS", "此时还没跑"], ["产出", "标签树"]],
      code: "<html>\n  <head><title>课程资料站</title></head>\n  <body>\n    <h1>课程资料站</h1>\n    <ul><li>模块 0</li>…</ul>"
    },
    dom: {
      no: "08", name: "构建 DOM", tag: "DOM", cls: "a",
      desc: "标签树变成 <b>document 树</b>，节点可以被 CSS 选择器与 XPath 命中。爬虫用解析器拿到的，就是这棵树的静态快照。",
      kv: [["接口", "document.querySelectorAll"], ["节点数", "≈ 428"], ["选择器", "ul li → 12 个"], ["XPath", "//ul/li"]],
      code: 'document.querySelectorAll("ul li").length\n// 12\n\ndocument.querySelector("h1").textContent\n// "课程资料站"'
    },
    render: {
      no: "09", name: "渲染 Render", tag: "RENDER", cls: "a",
      desc: "布局（Layout）→ 绘制（Paint）→ 合成（Composite）。到这一步像素才出现，<b>但爬虫拿到的仍然只有 08 那棵树</b>。",
      kv: [["布局", "计算每个盒子的尺寸位置"], ["绘制", "填充像素"], ["合成", "分层合并上屏"], ["首屏", "≈ 180 ms"]],
      code: "Layout → Paint → Composite\n\n# 爬虫不关心这三步\n# 只关心 08 那棵树里有没有数据"
    },
    sub: {
      no: "08b", name: "子资源请求", tag: "SUBRESOURCE", cls: "m",
      desc: "HTML 到手后，浏览器继续发现并请求 CSS / JS / 图片 / 字体。一屏像素是<b>十几个请求</b>拼出来的，而 <b>requests 只拿了第一个</b>。点图里那四个资源，下方瀑布会定位到对应行。",
      kv: [["文档", "1 个"], ["子资源", "11 个"], ["最慢", "font.woff2 180 ms"], ["合计", "≈ 480 ms"]],
      code: "document    200  120 ms\nsite.css    200   30 ms\napp.js      200   70 ms\nfont.woff2  200  180 ms   ← 卡在这\ncover.png   200  130 ms\n/api/recent 200  120 ms"
    }
  };

  var TIPS = {
    url: "<b>01 输入 URL</b>　拆成 scheme / host / path，先查缓存",
    dns: "<b>02 DNS 解析</b>　example.com → 93.184.216.34（12 ms）",
    tcp: "<b>03 TCP 连接</b>　三次握手；https 还要多做 TLS",
    req: "<b>04 HTTP 请求</b>　纯文本报文：请求行 + 请求头",
    srv: "<b>05 服务器</b>　URL → 磁盘路径，读到什么返回什么",
    res: "<b>06 HTTP 响应</b>　状态行 + 响应头 + 响应体",
    parse: "<b>07 解析 HTML</b>　容错解析成标签树，不执行 JS",
    dom: "<b>08 构建 DOM</b>　document 树，选择器从此可命中",
    render: "<b>09 渲染</b>　布局 → 绘制 → 合成，像素才上屏",
    sub: "<b>08b 子资源</b>　点里面四个资源可定位瀑布行"
  };

  /* ---------------- 抽屉 ---------------- */
  var drawer = q("#flDrawer");
  var body = q("#flDrawerBody");

  function openDrawer(key) {
    var d = DOCS[key];
    if (!d) return;
    selKey = key;
    q("#flDrawerNo").textContent = d.no;
    q("#flDrawerName").textContent = d.name;
    var tag = q("#flDrawerTag");
    tag.className = "tag " + d.cls;
    tag.textContent = d.tag;
    q("#flDrawerHint").textContent = "再点一次收起 · 或点上方其他节点";

    body.innerHTML =
      '<div class="fl-dt-main">' +
        '<p class="fl-dt-desc">' + d.desc + "</p>" +
        '<div class="fl-dt-kv">' + d.kv.map(function (r) {
          return "<div><span>" + esc(r[0]) + "</span><b>" + esc(r[1]) + "</b></div>";
        }).join("") + "</div>" +
      "</div>" +
      '<div class="code fl-dt-code">' + esc(d.code) + "</div>";

    drawer.classList.add("is-open");
    qa(".fl-step").forEach(function (g) {
      g.classList.toggle("is-sel", g.getAttribute("data-key") === key);
    });
    if (gsap && !reduced) {
      gsap.fromTo(body.children, { opacity: 0, y: 8 },
        { opacity: 1, y: 0, duration: .26, stagger: .04, ease: "power2.out", clearProps: "transform,opacity" });
    }
  }

  function closeDrawer() {
    selKey = null;
    drawer.classList.remove("is-open");
    qa(".fl-step").forEach(function (g) { g.classList.remove("is-sel"); });
    q("#flDrawerNo").textContent = "—";
    q("#flDrawerName").textContent = "报文抽屉";
    var tag = q("#flDrawerTag");
    tag.className = "tag";
    tag.textContent = "COLLAPSED";
    q("#flDrawerHint").textContent = "点上面任意步骤节点 · 这里展开它的报文与说明";
  }

  /* ---------------- CRAWLER ---------------- */
  function replHTML() {
    return [
      '>>> r = requests.get(url, timeout=5)',
      '>>> r.status_code', '200',
      '>>> len(r.text)', '1264      # 示意，随页面而定',
      '>>> soup.select("h1")[0].get_text()', "'课程资料站'",
      '>>> r.text 里就有 li —— 不需要浏览器'
    ].map(function (l) {
      if (l.slice(0, 3) === ">>>") {
        return '<span class="c">&gt;&gt;&gt;</span> <span class="f">' + esc(l.slice(3).trim()) + "</span>";
      }
      return '<span class="s">' + esc(l) + "</span>";
    }).join("\n");
  }

  /* ---------------- 子资源 → 瀑布 ---------------- */
  function locateWf(key) {
    qa(".fl-schip-hit").forEach(function (g) { g.classList.toggle("is-hit", g.getAttribute("data-wf") === key); });
    var row = q('.fl-wf-row[data-wf="' + key + '"]');
    if (!row) return;
    qa(".fl-wf-row").forEach(function (r) { r.classList.toggle("is-hi", r === row); });
    try { row.scrollIntoView({ behavior: "smooth", block: "center" }); } catch (e) { row.scrollIntoView(); }
  }

  /* ---------------- 动画 ---------------- */
  var steps, pkts;

  function collect() {
    steps = qa(".fl-step");
    pkts = { req: q(".fl-pkt.req"), res: q(".fl-pkt.res") };
  }

  function killLoops() {
    loops.forEach(function (t) { if (t) t.kill(); });
    loops = [];
  }

  function reset() {
    if (tl) { tl.kill(); tl = null; }
    killLoops();
    if (!gsap) return;
    steps.forEach(function (g) {
      g.classList.remove("is-lit", "is-sel");
      gsap.set(g, { opacity: 0.34 });
    });
    ["req", "res"].forEach(function (k) {
      var g = pkts[k];
      gsap.set(g, { opacity: 0 });
      gsap.set(g.querySelectorAll("circle"), { attr: { cx: k === "req" ? 250 : 1345 } });
    });
    qa(".fl-arrow.solid").forEach(function (p) {
      gsap.set(p, { clearProps: "strokeDasharray,strokeDashoffset" });
    });
    gsap.set(qa(".fl-wf-track b"), { scaleX: 0 });
  }

  function litAll() {
    steps.forEach(function (g) {
      g.classList.add("is-lit");
      if (gsap) gsap.set(g, { opacity: 1 });
    });
  }

  function idle() {
    if (!gsap || reduced) return;
    var pulse = q(".fl-srv-pulse");
    if (!pulse) return;
    loops.push(gsap.fromTo(pulse, { opacity: 0.3 }, {
      opacity: 0.06, duration: 1.4, ease: "sine.inOut", repeat: -1, yoyo: true
    }));
  }

  function movePacket(key, from, to, at, dur) {
    var g = pkts[key], circles = g.querySelectorAll("circle");
    var halo = g.querySelector(".fl-pk-halo");
    gsap.set(circles, { attr: { cx: from } });
    tl.to(g, { opacity: 1, duration: 0.06 }, at)
      .to(circles, { attr: { cx: to }, duration: dur, ease: "none" }, at)
      .to(halo, { opacity: 0.5, duration: dur / 2 }, at)
      .to(halo, { opacity: 0.18, duration: dur / 2 }, at + dur / 2)
      .to(g, { opacity: 0, duration: 0.08 }, at + dur - 0.06);
  }

  function drawArrow(step, at, dur) {
    if (!step) return;
    var path = step.querySelector(".fl-arrow.solid");
    var head = step.querySelector(".fl-head");
    if (!path) return;
    var len = 0;
    try { len = path.getTotalLength(); } catch (e) { len = 0; }
    if (!len) return;
    gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
    if (head) gsap.set(head, { opacity: 0 });
    tl.to(path, { strokeDashoffset: 0, duration: dur, ease: "power2.inOut" }, at);
    if (head) tl.to(head, { opacity: 1, duration: 0.12 }, at + dur - 0.06);
  }

  function lit(step, at) {
    tl.to(step, { opacity: 1, duration: 0.18, ease: "power2.out" }, at)
      .call(function () { step.classList.add("is-lit"); }, null, at);
  }

  /* 入场 ≤1.2s */
  function build() {
    reset();
    closeDrawer();
    q("#flRepl").innerHTML = replHTML();
    qa(".fl-wf-row").forEach(function (r) { r.classList.remove("is-hi"); });
    qa(".fl-schip-hit").forEach(function (g) { g.classList.remove("is-hit"); });

    if (!gsap || reduced) {
      litAll();
      gsap && gsap.set(qa(".fl-wf-track b"), { scaleX: 1 });
      idle();
      return;
    }

    var lanes = qa(".fl-lane-bg, .fl-lane-sep, .fl-lane-top, .fl-lane-lb, .fl-life, .fl-ruler line");
    gsap.set(lanes, { opacity: 0 });

    tl = gsap.timeline({ defaults: { ease: "power2.out" } });
    tl.to(lanes, { opacity: 1, duration: 0.2, stagger: 0.003 }, 0);

    steps.forEach(function (g, i) { lit(g, 0.04 + i * 0.048); });

    drawArrow(q(".fl-step[data-key='req']"), 0.18, 0.22);
    drawArrow(q(".fl-step[data-key='res']"), 0.32, 0.22);

    tl.to(qa(".fl-wf-track b"), { scaleX: 1, duration: 0.3, stagger: 0.025, ease: "power2.inOut" }, 0.5);

    idle();
  }

  /* 一次往返 ≤1.2s */
  function send() {
    if (!gsap || reduced) return;
    killLoops();
    if (tl) tl.kill();
    litAll();

    tl = gsap.timeline();
    var reqStep = q(".fl-step[data-key='req']");
    var srvStep = q(".fl-step[data-key='srv']");
    var resStep = q(".fl-step[data-key='res']");

    tl.fromTo(reqStep, { opacity: 0.55 }, { opacity: 1, duration: 0.12 }, 0);
    movePacket("req", 250, 1345, 0.02, 0.44);
    tl.fromTo(srvStep, { opacity: 0.55 }, { opacity: 1, duration: 0.16 }, 0.46);
    movePacket("res", 1345, 250, 0.56, 0.44);
    tl.fromTo(resStep, { opacity: 0.55 }, { opacity: 1, duration: 0.16 }, 0.98);
    tl.fromTo(qa(".fl-step[data-key='parse'], .fl-step[data-key='dom'], .fl-step[data-key='render']"),
      { opacity: 0.55 }, { opacity: 1, duration: 0.14, stagger: 0.03 }, 0.98);

    idle();
  }

  /* ---------------- 悬停提示 ---------------- */
  var tip = q("#flTip"), stage = q("#flStage");

  function showTip(g) {
    var key = g.getAttribute("data-key");
    if (!TIPS[key] || !tip) return;
    tip.innerHTML = TIPS[key];
    var r = g.getBoundingClientRect(), s = stage.getBoundingClientRect();
    var x = r.left - s.left + r.width / 2;
    var y = r.top - s.top;
    var below = y < 64;
    tip.classList.toggle("below", below);
    tip.style.left = Math.max(150, Math.min(s.width - 150, x)) + "px";
    tip.style.top = (below ? r.bottom - s.top : y) + "px";
    tip.classList.add("is-on");
  }
  function hideTip() { if (tip) tip.classList.remove("is-on"); }

  root.addEventListener("mouseover", function (e) {
    var g = e.target.closest ? e.target.closest(".fl-step") : null;
    if (g) showTip(g);
  });
  root.addEventListener("mouseout", function (e) {
    var g = e.target.closest ? e.target.closest(".fl-step") : null;
    if (g) hideTip();
  });
  window.addEventListener("scroll", hideTip, { passive: true });

  /* ---------------- 点击 ---------------- */
  root.addEventListener("click", function (e) {
    if (!e.target || !e.target.closest) return;

    /* 子资源 chip 优先 */
    var chip = e.target.closest(".fl-schip-hit");
    if (chip) {
      locateWf(chip.getAttribute("data-wf"));
      return;
    }

    var g = e.target.closest(".fl-step");
    if (g) {
      var key = g.getAttribute("data-key");
      if (selKey === key) closeDrawer(); else openDrawer(key);
      return;
    }

    if (e.target.closest("[data-send]")) { send(); return; }
    if (e.target.closest("#flDrawerHd")) {
      if (drawer.classList.contains("is-open")) closeDrawer(); else openDrawer("req");
    }
  });

  root.addEventListener("keydown", function (e) {
    if (e.key !== "Enter" && e.key !== " ") return;
    var chip = e.target.closest ? e.target.closest(".fl-schip-hit") : null;
    if (!chip) return;
    e.preventDefault();
    locateWf(chip.getAttribute("data-wf"));
  });

  /* ---------------- 启动 ---------------- */
  collect();
  build();

  return {
    replay: function () { collect(); build(); }
  };
});
