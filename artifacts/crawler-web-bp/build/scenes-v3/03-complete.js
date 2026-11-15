/* SCENE 03 · 完整 HTML：静态站与后端动态汇到同一个出口 */
BP.scene("sc-complete", function (root, gsap, api) {
  "use strict";
  var q = function (s) { return root.querySelector(s); };
  var qa = function (s) { return Array.prototype.slice.call(root.querySelectorAll(s)); };
  var reduced = !!(api && api.reduced);
  var tl = null;
  var cur = "html";
  var user = "安静";

  /* ================= 节点数据 ================= */

  var NODES = {
    disk: {
      tag: "源 01 · 磁盘", cls: "",
      title: "磁盘上的 index.html",
      sub: "静态站的全部秘密：文件本来就在那儿",
      meta: "示意 1,204 B",
      code:
        "<span class=\"c\"># static-website/index.html —— 磁盘上的一个普通文件</span>\n" +
        "<span class=\"p\">&lt;ul&gt;</span>\n" +
        "  <span class=\"p\">&lt;li&gt;</span>2023001 安静<span class=\"p\">&lt;/li&gt;</span>\n" +
        "  <span class=\"p\">&lt;li&gt;</span>2023002 小王<span class=\"p\">&lt;/li&gt;</span>\n" +
        "  <span class=\"p\">&lt;li&gt;</span>2023003 陈晨<span class=\"p\">&lt;/li&gt;</span>\n" +
        "<span class=\"p\">&lt;/ul&gt;</span>",
      resp:
        "<span class=\"rl2\"><span class=\"hd\">$ python -m http.server 8000</span></span>" +
        "<span class=\"rl2\"><span class=\"hk\">GET</span> /index.html  →  <span class=\"hv\">200 OK</span></span>" +
        "<span class=\"rl2\"><span class=\"hd\">Content-Type:</span> text/html; charset=utf-8</span>" +
        "<span class=\"rl2\"><span class=\"hd\">Content-Length:</span> 1204</span>" +
        "<span class=\"rl2\"> </span>" +
        "<span class=\"rl2\"><span class=\"hd\"># 响应体 = 磁盘文件字节，一个不多一个不少</span></span>",
      note: "Web 开发课（第十一节 P2）里，讲师对这一层的形容是「特别朴素」：服务器只是一台会找文件、会发文件的机器。文件哪天变了，页面哪天变；没人访问时不产生任何计算。"
    },

    srv: {
      tag: "Web server", cls: "proc",
      title: "读文件 → 原样返回",
      sub: "Nginx / http.server：找文件、读字节、写 socket",
      meta: "200 · 示意 1,204 B",
      code:
        "<span class=\"c\"># Web server 真正做的事</span>\n" +
        "path = root + <span class=\"s\">\"/index.html\"</span>\n" +
        "body = <span class=\"f\">open</span>(path, <span class=\"s\">\"rb\"</span>).read()   <span class=\"c\"># ≈1,204 字节</span>\n" +
        "<span class=\"f\">write</span>(socket, headers + body)      <span class=\"c\"># 原样塞回去</span>",
      resp:
        "<span class=\"rl2\"><span class=\"hv\">200 OK</span></span>" +
        "<span class=\"rl2\"><span class=\"hd\">Content-Type:</span> text/html; charset=utf-8</span>" +
        "<span class=\"rl2\"><span class=\"hd\">Content-Length:</span> 1204</span>" +
        "<span class=\"rl2\"> </span>" +
        "<span class=\"rl2\"><span class=\"hd\"># 不解模板、不查数据库、不跑 JS</span></span>",
      note: "只做三件事：找文件、读字节、写回 socket。所以静态站的响应体与磁盘文件逐字节相同 —— 这也是它能被 CDN 到处缓存的原因。"
    },

    tpl: {
      tag: "源 02 · 模板 + 数据", cls: "",
      title: "模板 + username / students",
      sub: "占位符等着被填：{{ username }} 与 {% for %}",
      meta: "渲染前",
      code:
        "<span class=\"c\"># templates/index.html —— 模板，占位符等着被填</span>\n" +
        "<span class=\"p\">&lt;h1&gt;</span>你好，<span class=\"f\">{{ username }}</span><span class=\"p\">&lt;/h1&gt;</span>\n" +
        "<span class=\"p\">&lt;ul&gt;</span>\n" +
        "<span class=\"c\">{% for s in students %}</span>\n" +
        "  <span class=\"p\">&lt;li&gt;</span><span class=\"f\">{{ s.id }} {{ s.name }}</span><span class=\"p\">&lt;/li&gt;</span>\n" +
        "<span class=\"c\">{% endfor %}</span>\n" +
        "<span class=\"p\">&lt;/ul&gt;</span>",
      resp: "",
      note: "同一个模板，换个 query 参数就换一份内容。Web 开发课（第十一节 P2）里，讲师把 CGI 那一步说得最直白：读某个 index.html，把里面「安静」那个字符串换成别的，再返回回去 —— Flask 里由 Jinja2 决定换哪一段。"
    },

    jinja: {
      tag: "Jinja2 · render_template()", cls: "proc",
      title: "填变量 → 拼成字符串",
      sub: "服务器内存里做完，交出一个 str",
      meta: "200 · 示意 1,240 B",
      code:
        "<span class=\"k\">@app</span>.route(<span class=\"s\">\"/\"</span>)\n" +
        "<span class=\"k\">def</span> <span class=\"f\">index</span>():\n" +
        "    <span class=\"k\">return</span> render_template(<span class=\"s\">\"index.html\"</span>,\n" +
        "        username=request.args.get(<span class=\"s\">\"username\"</span>),\n" +
        "        students=load_students())",
      resp:
        "<span class=\"rl2\"><span class=\"hd\">render_template()</span>  →  <span class=\"hv\">≈1,240 B 的 HTML 字符串（示意）</span></span>" +
        "<span class=\"rl2\"><span class=\"hv\">200 OK</span>  ·  text/html  ·  charset=utf-8</span>" +
        "<span class=\"rl2\"> </span>" +
        "<span class=\"rl2\"><span class=\"hd\"># 对客户端来说，它和磁盘上那个文件没区别</span></span>",
      note: "Jinja2 干两件事：把 {{ }} 换成值、把 {% for %} 展开成 N 段，最后交出一个字符串给 WSGI 写进响应体。页面是「算」出来的，但算完还是 HTML。"
    },

    html: {
      tag: "汇合点 · 响应体", cls: "out",
      title: "同一份完整 HTML",
      sub: "两条产线，一个出口 —— 这是本屏的题眼",
      meta: "示意字节数",
      code:
        "<span class=\"c\"># 两条产线的产出物，形状完全一样</span>\n" +
        "<span class=\"p\">&lt;!DOCTYPE html&gt;</span>\n" +
        "<span class=\"p\">&lt;html&gt;&lt;body&gt;</span>\n" +
        "  <span class=\"p\">&lt;h1&gt;</span>你好，安静<span class=\"p\">&lt;/h1&gt;</span>\n" +
        "  <span class=\"p\">&lt;ul&gt;</span>\n" +
        "    <span class=\"p\">&lt;li&gt;</span>2023001 安静<span class=\"p\">&lt;/li&gt;</span>\n" +
        "    <span class=\"p\">&lt;li&gt;</span>2023002 小王<span class=\"p\">&lt;/li&gt;</span>\n" +
        "  <span class=\"p\">&lt;/ul&gt;</span>\n" +
        "<span class=\"p\">&lt;/body&gt;&lt;/html&gt;</span>",
      resp:
        "<span class=\"rl2\"><span class=\"hd\">静态站</span>  <span class=\"hv\">200 OK · ≈1,204 B</span></span>" +
        "<span class=\"rl2\"><span class=\"hd\">动态站</span>  <span class=\"hv\">200 OK · ≈1,240 B</span></span>" +
        "<span class=\"rl2\"> </span>" +
        "<span class=\"rl2\"><span class=\"hd\"># 都是完整 HTML，li 里都是学生 —— 字节差异只来自名字长短</span></span>",
      note: "路径不同，产物同构。请求打下去，响应体里已经有数据了：爬虫不需要等任何 JavaScript 执行。"
    },

    req: {
      tag: "爬虫 01 · 取回来", cls: "craw",
      title: "requests.get(url)",
      sub: "拿到的就是那串 HTML 本身",
      meta: "示意 1,204 B",
      code:
        "<span class=\"k\">import</span> requests\n" +
        "\n" +
        "url = <span class=\"s\">\"http://127.0.0.1:8000\"</span>   <span class=\"c\"># 或 http://localhost:8000</span>\n" +
        "r = requests.get(url)\n" +
        "r.encoding = <span class=\"s\">\"utf-8\"</span>          <span class=\"c\"># 不设 → 中文乱码</span>\n" +
        "<span class=\"f\">print</span>(<span class=\"f\">len</span>(r.text))         <span class=\"c\"># ≈1204</span>",
      resp:
        "<span class=\"rl2\"><span class=\"hv\">200 OK</span>  ·  text/html  ·  charset=utf-8</span>" +
        "<span class=\"rl2\"><span class=\"hd\">len(r.text)</span> ≈ 1204</span>" +
        "<span class=\"rl2\"> </span>" +
        "<span class=\"rl2\"><span class=\"hd\"># 和浏览器看到的是同一份</span></span>",
      note: "讲师的验收方式：把 r.text 打印出来，确认「是一个完整的页面，跟我们用浏览器看到这个页面是一致的」。编码不对时标题里的中文是乱码，改 r.encoding 即可。"
    },

    soup: {
      tag: "爬虫 02 · 解析", cls: "craw",
      title: "BeautifulSoup + 选择器",
      sub: "soup.select(\"li\") 返回 list",
      meta: "示意 30 个",
      code:
        "<span class=\"k\">from</span> bs4 <span class=\"k\">import</span> BeautifulSoup\n" +
        "\n" +
        "soup = BeautifulSoup(r.text, <span class=\"s\">\"html.parser\"</span>)\n" +
        "li_list = soup.select(<span class=\"s\">\"li\"</span>)   <span class=\"c\"># 返回 list</span>\n" +
        "<span class=\"f\">print</span>(<span class=\"f\">len</span>(li_list))      <span class=\"c\"># 30</span>",
      resp:
        "<span class=\"rl2\">[&lt;li&gt;2023001 安静&lt;/li&gt;,</span>" +
        "<span class=\"rl2\"> &lt;li&gt;2023002 小王&lt;/li&gt;,</span>" +
        "<span class=\"rl2\"> &lt;li&gt;2023003 陈晨&lt;/li&gt;, …]</span>" +
        "<span class=\"rl2\"> </span>" +
        "<span class=\"rl2\"><span class=\"hd\"># 名字都在 li 里，所以选择器就写 li</span></span>",
      note: "选择器不是猜的：先在浏览器里右键检查元素，看到学生的 ID 与姓名都装在 li 里，再把 li 写进 soup.select()。"
    },

    text: {
      tag: "爬虫 03 · 取文本", cls: "craw",
      title: "li.text",
      sub: "只要文本，不要标签",
      meta: "30 行",
      code:
        "<span class=\"k\">for</span> li <span class=\"k\">in</span> li_list:\n" +
        "    <span class=\"f\">print</span>(li.text)    <span class=\"c\"># 元素里那串文字</span>",
      resp:
        "<span class=\"rl2\">2023001 安静</span>" +
        "<span class=\"rl2\">2023002 小王</span>" +
        "<span class=\"rl2\">2023003 陈晨</span>" +
        "<span class=\"rl2\"><span class=\"hd\">…（共 30 行）</span></span>",
      note: "到这里，静态站和后端渲染站走完的是同一条流水线 —— 因为它们的响应体是同一种东西。"
    }
  };

  /* 因果路径：点亮整条链 */
  var PATH = {
    disk: ["disk", "srv", "html", "req", "soup", "text"],
    srv: ["disk", "srv", "html", "req", "soup", "text"],
    tpl: ["tpl", "jinja", "html", "req", "soup", "text"],
    jinja: ["tpl", "jinja", "html", "req", "soup", "text"],
    html: ["html", "req", "soup", "text"],
    req: ["html", "req", "soup", "text"],
    soup: ["html", "req", "soup", "text"],
    text: ["html", "req", "soup", "text"]
  };

  var USERS = ["安静", "小王", "匿名"];

  /* ================= 渲染 ================= */

  function tplResp(u) {
    var chips = USERS.map(function (x) {
      return "<button class=\"pchip" + (x === u ? " is-on" : "") + "\" data-user=\"" + x + "\">" + x + "</button>";
    }).join("");
    return "<div class=\"pchips\">" + chips + "</div>" +
      "<span class=\"rl2\"><span class=\"hk\">GET</span> /?username=" + u + "  →  <span class=\"hv\">200 OK</span></span>" +
      "<span class=\"rl2\"><span class=\"p\">&lt;h1&gt;</span>你好，" + u + "<span class=\"p\">&lt;/h1&gt;</span></span>" +
      "<span class=\"rl2\"><span class=\"p\">&lt;ul&gt;&lt;li&gt;</span>2023001 安静<span class=\"p\">&lt;/li&gt;…&lt;/ul&gt;</span></span>" +
      "<span class=\"rl2\"> </span>" +
      "<span class=\"rl2\"><span class=\"hd\"># 只换了 query 参数，HTML 结构一个字都没变</span></span>";
  }

  function paintInspector(node, flash) {
    var d = NODES[node];
    var tag = q("#inspTag");
    tag.className = "tag" + (d.cls === "out" ? " g" : d.cls === "proc" ? " a" : d.cls === "craw" ? " m" : "");
    tag.textContent = d.tag;
    q("#inspTitle").textContent = d.title;
    q("#inspSub").textContent = d.sub;
    q("#inspMeta").textContent = d.meta || "";
    q("#inspCode").innerHTML = d.code;
    q("#inspResp").innerHTML = node === "tpl" ? tplResp(user) : d.resp;
    q("#inspNote").innerHTML = d.note;

    if (flash && gsap && !reduced) {
      gsap.fromTo([q("#inspCode"), q("#inspResp")], { opacity: .25 }, { opacity: 1, duration: .2, ease: "power1.out" });
      gsap.fromTo(q("#inspTag"), { scale: .94 }, { scale: 1, duration: .2, ease: "back.out(2)" });
    }
  }

  function setNode(node) {
    cur = node;
    qa(".gnode").forEach(function (el) {
      el.classList.toggle("is-on", el.getAttribute("data-node") === node);
      el.classList.toggle("lit", PATH[node].indexOf(el.getAttribute("data-node")) >= 0 && el.getAttribute("data-node") !== node);
    });
    paintInspector(node, true);
  }

  function setUser(u) {
    user = u;
    paintInspector("tpl", false);
    if (gsap && !reduced) {
      gsap.fromTo(q("#inspResp"), { opacity: .3 }, { opacity: 1, duration: .25 });
    }
  }

  /* ================= 入场（≤1.2s） ================= */
  function play() {
    if (tl) tl.kill();
    user = "安静";
    setNode("html");

    if (!gsap || reduced) return;

    tl = gsap.timeline({ defaults: { ease: "power2.out" } });
    tl.fromTo(qa(".gnode"), { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: .26, stagger: .045 }, 0)
      .fromTo(qa(".gs-label"), { opacity: 0 }, { opacity: 1, duration: .22, stagger: .035 }, 0)
      .fromTo([q(".insp")], { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: .26 }, .42)
      .fromTo([q(".deep")], { opacity: 0 }, { opacity: 1, duration: .28 }, .6);
    /* 总时长 ≈ 0.9s */
  }

  /* ================= 事件 ================= */
  root.addEventListener("click", function (e) {
    var et = (e.target && e.target.nodeType === 1) ? e.target : root;

    var chip = et.closest ? et.closest(".pchip") : null;
    if (chip) { setUser(chip.getAttribute("data-user")); return; }

    var node = et.closest ? et.closest(".gnode") : null;
    if (node) { setNode(node.getAttribute("data-node")); return; }
  });

  play();

  return {
    replay: play,
    onKey: function (e) {
      if (e.key === "ArrowRight" || e.key === "ArrowLeft") { return false; }
      return false;
    }
  };
});
