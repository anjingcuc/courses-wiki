/* playground-worker.js — Pyodide Web Worker 沙箱
 * 在独立线程运行用户代码，死循环可被终止，不卡主页面。 */
/* eslint-disable no-undef */
importScripts("https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.js");

var PYODIDE_INDEX = "https://cdn.jsdelivr.net/pyodide/v0.26.4/full/";
var readyPromise = null;
var pyodide = null;

function boot() {
  if (!readyPromise) {
    readyPromise = loadPyodide({ indexURL: PYODIDE_INDEX }).then(function (py) {
      pyodide = py;
      py.setStdout({ batched: function (s) { postMessage({ type: "out", text: s }); } });
      py.setStderr({ batched: function (s) { postMessage({ type: "err", text: s }); } });
      // 浏览器沙箱内不可交互，input() 给出友好提示
      py.runPython(
        "import builtins\n" +
        "def _no_input(prompt=''):\n" +
        "    raise RuntimeError('浏览器运行场暂不支持 input()，请改用固定数据测试')\n" +
        "builtins.input = _no_input\n"
      );
      postMessage({ type: "booted" });
      return py;
    });
  }
  return readyPromise;
}

onmessage = function (e) {
  var code = e.data.code;
  boot().then(function () {
    return pyodide.runPythonAsync(code);
  }).then(function (result) {
    if (result !== undefined && result !== null) {
      postMessage({ type: "out", text: String(result) });
    }
    postMessage({ type: "done", ok: true });
  }).catch(function (err) {
    var msg = String(err && err.message ? err.message : err);
    // Python traceback 交给主线程按行染色
    postMessage({ type: "done", ok: false, error: msg });
  });
};
