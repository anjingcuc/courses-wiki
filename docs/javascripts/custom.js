window.onload = function () {
  var mind = {

  };

  var options = {
    container: "jsmind_container",
    theme: "primary",
    editable: false,
  };

  var jm = new jsMind(options);
  jm.show(mind);

  var isZoomOut = false;
  var isZoomIn = false;

  function zoomIn() {
    if (jm.view.zoomIn()) {
      isZoomOut = false;
    } else {
      isZoomIn = true;
    }
  }

  function zoomOut() {
    if (jm.view.zoomOut()) {
      isZoomIn = false;
    } else {
      isZoomOut = true;
    }
  }

  function scrollFunc(e) {
    e = e || window.event;

    if (e.wheelDelta) {
      if (e.wheelDelta > 0) {
        zoomIn();
      } else {
        zoomOut();
      }
      e.preventDefault();
      e.stopPropagation();
      return false;
    } else if (e.detail) {
      if (e.detail > 0) {
        zoomIn();
      } else {
        zoomOut();
      }

      e.preventDefault();
      e.stopPropagation();
      return false;
    }
    jm.resize();
  }

  var container = document.getElementById("jsmind_container");
  if (container.addEventListener) {
    container.addEventListener("mousewheel", scrollFunc, false);
    // Firefox
    container.addEventListener("DOMMouseScroll", scrollFunc, false);
  }
};
