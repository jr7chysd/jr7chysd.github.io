/* ==========================================================================
   渲染逻辑：读取 data.js 里的 NAV_DATA 并生成页面
   日常维护只改 data.js，本文件通常不需要动。

   一个页面、两份视图，按「服务归属」彻底二分，靠地址栏 hash 切换：
     index.html           —— 境内服务（默认）
     index.html#overseas  —— 境外服务（data.js 里带 overseas: true 的）

   这两边是严格互斥的：一条只会出现在其中一边，不会重复。
   页面底部那个几乎看不见的点就是切换入口，点击后原地重绘，不重新加载。

   想调整某条归到哪边，只改 data.js：加 / 删 `overseas: true` 即可。
   ========================================================================== */
(function () {
  'use strict';

  var app = document.getElementById('app');
  if (!app) return;

  var ghost = document.querySelector('.ghost-link');

  // 当前视图：domestic（境内）/ overseas（境外）
  function currentMode() {
    return location.hash === '#overseas' ? 'overseas' : 'domestic';
  }

  function belongsHere(item, mode) {
    var isOverseas = !!(item && item.overseas === true);
    return mode === 'overseas' ? isOverseas : !isOverseas;
  }

  // 生成整页内容；中途出错时不会往页面里塞半截内容
  function buildPage(data, mode) {
    var frag = document.createDocumentFragment();

    data.forEach(function (group) {
      if (!group || !group.items || !group.items.length) return;

      // 先筛出属于当前视图的条目；一组里一条都不剩，整组就不显示
      var items = group.items.filter(function (item) {
        return belongsHere(item, mode);
      });
      if (!items.length) return;

      var section = document.createElement('section');
      section.className = 'group';

      // 分类名（灰色小字标签）
      var label = document.createElement('div');
      label.className = 'group-label';
      label.textContent = group.category || '';
      section.appendChild(label);

      var grid = document.createElement('div');
      grid.className = 'grid';

      items.forEach(function (item) {
        if (!item.name) return;

        var a = document.createElement('a');
        a.className = 'item';
        a.href = item.url || '#';

        // 默认在本页打开；个别链接想开新窗口，在 data.js 里给该条加 target: true
        if (item.target === true || item.target === '_blank') {
          a.target = '_blank';
          a.rel = 'noopener noreferrer';
        } else {
          a.target = '_self';
        }

        var i = document.createElement('i');
        i.className = item.icon || 'fa-solid fa-link';
        i.setAttribute('aria-hidden', 'true');
        if (item.color) i.style.color = item.color;   // 需要单独上色时再用

        var name = document.createElement('span');
        name.className = 'item-name';
        name.textContent = item.name;
        if (item.desc) name.title = item.desc;

        a.appendChild(i);
        a.appendChild(name);
        grid.appendChild(a);
      });

      section.appendChild(grid);
      frag.appendChild(section);
    });

    return frag;
  }

  function showTip(text) {
    var tip = document.createElement('p');
    tip.className = 'load-error';
    tip.textContent = text;
    app.appendChild(tip);
  }

  function render() {
    var mode = currentMode();
    var data = window.NAV_DATA || [];

    // 清掉上一次绘制的内容（切换视图时复用同一个容器）
    while (app.firstChild) app.removeChild(app.firstChild);

    // data.js 语法写错时 NAV_DATA 会是 undefined，这里给出可读提示而不是空白页
    if (!data.length) {
      showTip('没有读到 NAV_DATA，检查 data.js 是否写错了（少逗号、少括号等）');
      return;
    }

    app.appendChild(buildPage(data, mode));

    // 当前视图一条都没有时给个提示，免得看起来像页面坏了
    if (!app.querySelector('.group')) {
      showTip('这一页还没有条目。');
    }

    // 入口：境内视图进 #overseas；境外视图再点一次回到境内
    if (ghost) {
      ghost.setAttribute('href', mode === 'overseas' ? '#' : '#overseas');
    }
  }

  function safeRender() {
    try {
      render();
    } catch (err) {
      while (app.firstChild) app.removeChild(app.firstChild);
      showTip('页面数据加载失败：' + (err && err.message ? err.message : String(err)));
      if (window.console && console.error) console.error(err);
    }
  }

  // 首屏 + hash 变化（点入口、浏览器前进后退都走这里）
  safeRender();
  window.addEventListener('hashchange', safeRender);
})();
