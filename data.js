/* ==========================================================================
   导航数据 —— 以后维护只改这一个文件
   --------------------------------------------------------------------------
   格式说明：
     {
       category: '分类名',                    // 栏目名，不想要某栏目就整段删掉
       items: [
         {
           name: '显示的文字',                 // 必填
           url:  'https://example.com',        // 必填，点了去哪
           icon: 'fa-solid fa-robot'           // FontAwesome 类名（见下方图标速查）
         }
       ]
     }

   图标速查：https://fontawesome.com/search?o=r&m=free
     - 实心图标：fa-solid fa-xxx
     - 品牌图标：fa-brands fa-xxx（GitHub、YouTube、Bilibili 等）

   小技巧：
     - 加一行：复制任意一条 { ... }, 改掉 name / url / icon 即可。
     - 换顺序：直接上下移动整条 {} 。
     - 想换分类名：改 category 的文字。
     - 换行内数量：改 style.css 顶部的 --col-min（越小一行越多）。
   ========================================================================== */

window.NAV_DATA = [

  /* -------------------------------- Jobs -------------------------------- */
  {
    category: 'Jobs',
    items: [
      { name: 'CN',          url: 'https://www.gov.cn/',                  icon: 'fa-solid fa-landmark-flag' },
      { name: 'CSRC',        url: 'https://www.csrc.gov.cn/',             icon: 'fa-solid fa-scale-balanced' },
      { name: 'Mail',   url: 'https://mail.csrc.gov.cn/',                 icon: 'fa-solid fa-envelope' },
      { name: 'Law Library', url: 'https://neris.csrc.gov.cn/falvfagui/', icon: 'fa-solid fa-section' }
    ]
  },

  /* -------------------------- Internal Network -------------------------- */
  {
    category: 'Internal Network',
    items: [
      { name: 'Ax86u Pro',  url: 'http://10.10.10.10/',       icon: 'fa-solid fa-ethernet' },
      { name: 'MetaCubeXD', url: 'http://127.0.0.1:9090/ui',  icon: 'fa-solid fa-circle-nodes' },
      { name: 'immich',     url: 'http://10.10.10.254:2283/', icon: 'fa-solid fa-photo-film' },
      { name: 'Openlist',   url: 'http://10.10.10.254:5244/', icon: 'fa-solid fa-folder-tree' },
      { name: 'sNotepad',   url: 'http://10.10.10.254:8000/', icon: 'fa-solid fa-note-sticky' },
      { name: 'Adguard',    url: 'http://10.10.10.53:3000/',  icon: 'fa-solid fa-ban' }
    ]
  },

  /* --------------------------------- AI --------------------------------- */
  {
    category: 'AI',
    items: [
      { name: 'DeepSeek', url: 'https://chat.deepseek.com/',    icon: 'fa-solid fa-magnifying-glass-chart' },
      { name: 'Kimi',     url: 'https://www.kimi.com/',         icon: 'fa-solid fa-moon' },
      { name: 'Qwen',     url: 'https://www.qianwen.com/',      icon: 'fa-solid fa-cloud' },
      { name: 'Doubao',   url: 'https://www.doubao.com/chat/',  icon: 'fa-solid fa-seedling' },
      { name: 'ChatGPT',  url: 'https://chatgpt.com/',          icon: 'fa-brands fa-openai' },
      { name: 'Claude',   url: 'https://claude.ai/new',         icon: 'fa-brands fa-claude' },
      { name: 'Gemini',   url: 'https://gemini.google.com/app', icon: 'fa-solid fa-gem' },
      { name: 'Cursor',   url: 'https://cursor.com/',           icon: 'fa-solid fa-i-cursor' },
      { name: 'Copilot',  url: 'https://github.com/copilot',    icon: 'fa-brands fa-copilot' }
    ]
  },

  /* ----------------------------- Essential ------------------------------ */
  {
    category: 'Essential',
    items: [
      { name: 'Google',     url: 'https://www.google.com/',   icon: 'fa-brands fa-google' },
      { name: 'YouTube',    url: 'https://www.youtube.com/',  icon: 'fa-brands fa-youtube' },
      { name: 'GitHub',     url: 'https://github.com/',       icon: 'fa-brands fa-github' },
      { name: 'Cloudflare', url: 'https://cloudflare.com/',   icon: 'fa-brands fa-cloudflare' },
      { name: 'DMIT',       url: 'https://dmit.io/',          icon: 'fa-solid fa-server' },
      { name: 'Bilibili',   url: 'https://www.bilibili.com/', icon: 'fa-brands fa-bilibili' }
    ]
  },

  /* ------------------------------- Forums ------------------------------- */
  {
    category: 'Forums',
    items: [
      { name: 'V2EX',     url: 'https://www.v2ex.com/',              icon: 'fa-solid fa-comments' },
      { name: 'Chiphell', url: 'https://www.chiphell.com/forum.php', icon: 'fa-solid fa-microchip' },
      { name: 'NGA',      url: 'https://bbs.nga.cn/',                icon: 'fa-solid fa-gamepad' },
      { name: 'Hupu',     url: 'https://bbs.hupu.com/all-gambia',    icon: 'fa-solid fa-basketball' },
      { name: 'Newsmth',  url: 'https://www.newsmth.com/',           icon: 'fa-solid fa-building-columns' },
      { name: 'Reddit',   url: 'https://www.reddit.com/',            icon: 'fa-brands fa-reddit-alien' },
      { name: 'RSS',      url: 'https://feedly.com/',                icon: 'fa-solid fa-rss' },
      { name: '1p3a',     url: 'https://1point3acres.com/bbs',       icon: 'fa-solid fa-graduation-cap' }
    ]
  },

  /* ------------------------------- Others ------------------------------- */
  {
    category: 'Others',
    items: [
      { name: 'btnull',       url: 'https://肖申克的救赎.com/',                   icon: 'fa-solid fa-clapperboard' },
      { name: '1lou',         url: 'https://1lou.me/',                            icon: 'fa-solid fa-magnet' },
      { name: 'zlibrary',     url: 'https://zh.z-library.sk/',                    icon: 'fa-solid fa-book-open-reader' },
      { name: 'Dictionary',   url: 'https://www.oxfordlearnersdictionaries.com/', icon: 'fa-solid fa-spell-check' },
      { name: 'CloudConvert', url: 'https://cloudconvert.com/',                   icon: 'fa-solid fa-arrows-rotate' },
      { name: 'FontAwesome',  url: 'https://fontawesome.com/',                    icon: 'fa-brands fa-font-awesome' },
      { name: 'GeoViewer',    url: 'https://geoviewer.aloxaf.com/',               icon: 'fa-solid fa-location-crosshairs' }
    ]
  },

];
