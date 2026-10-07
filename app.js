/* ==========================================================================
   渲染逻辑：读取 data.js 里的 NAV_DATA 并生成页面
   日常维护只改 data.js，本文件通常不需要动。
   ========================================================================== */
(function () {
  'use strict';

  var data = window.NAV_DATA || [];
  var app = document.getElementById('app');
  if (!app) return;

  var frag = document.createDocumentFragment();

  data.forEach(function (group) {
    if (!group || !group.items || !group.items.length) return;

    var section = document.createElement('section');
    section.className = 'group';

    // 分类名（灰色小字标签）
    var label = document.createElement('div');
    label.className = 'group-label';
    label.textContent = group.category || '';
    section.appendChild(label);

    var grid = document.createElement('div');
    grid.className = 'grid';

    group.items.forEach(function (item) {
      if (!item || !item.name) return;

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

  app.appendChild(frag);
})();
