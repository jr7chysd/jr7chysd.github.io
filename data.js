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

   各字段说明（只有 name 和 url 是必须的）：
     name    '显示文字'               // 必填
     url     'https://example.com'    // 必填，点了去哪
     icon    'fa-solid fa-star'       // 可选，缺省用 fa-solid fa-link
     target  true                     // 可选，默认在当前页打开；写 true 或 '_blank' 则新标签打开
     desc    '悬停提示'               // 可选，鼠标停上去才显示（手机上无效）
     color   '#e0b050'                // 可选，单独给这个图标上色

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
      { name: 'ChatGLM',  url: 'https://chatglm.cn/',           icon: 'fa-solid fa-brain' },
      { name: 'ChatGPT',  url: 'https://chatgpt.com/',          icon: 'fa-brands fa-openai', overseas: true },
      { name: 'Claude',   url: 'https://claude.ai/new',         icon: 'fa-brands fa-claude', overseas: true },
      { name: 'Gemini',   url: 'https://gemini.google.com/app', icon: 'fa-solid fa-gem', overseas: true },
      { name: 'Grok',     url: 'https://grok.com/',             icon: 'fa-brands fa-x-twitter', overseas: true },
      { name: 'Copilot',  url: 'https://github.com/copilot',    icon: 'fa-brands fa-copilot', overseas: true },
      { name: 'Cursor',   url: 'https://cursor.com/',           icon: 'fa-solid fa-i-cursor', overseas: true }
    ]
  },

  /* ----------------------------- AI Studio ------------------------------ */
  {
    category: 'AI Studio',
    items: [
      { name: 'Jimeng',      url: 'https://jimeng.jianying.com/',        icon: 'fa-solid fa-wand-magic-sparkles' },
      { name: 'Kling',       url: 'https://app.klingai.com/',            icon: 'fa-solid fa-video' },
      { name: 'Hailuo',      url: 'https://hailuoai.com/',               icon: 'fa-solid fa-water' },
      { name: 'Vidu',        url: 'https://www.vidu.cn/',                icon: 'fa-solid fa-clapperboard' },
      { name: 'Wanxiang',    url: 'https://tongyi.aliyun.com/wanxiang/', icon: 'fa-solid fa-palette' },
      { name: 'OpenRouter',  url: 'https://openrouter.ai/',              icon: 'fa-solid fa-route', overseas: true },
      { name: 'Midjourney',  url: 'https://www.midjourney.com/',         icon: 'fa-solid fa-paintbrush', overseas: true }
    ]
  },

  /* ----------------------------- Essential ------------------------------ */
  {
    category: 'Essential',
    items: [
      { name: 'Bilibili',  url: 'https://www.bilibili.com/',     icon: 'fa-brands fa-bilibili' },
      { name: 'Douyin',    url: 'https://www.douyin.com/',       icon: 'fa-brands fa-tiktok' },
      { name: 'Weather',   url: 'https://www.weather.com.cn/',   icon: 'fa-solid fa-cloud-sun' },
      { name: 'Google',    url: 'https://www.google.com/',       icon: 'fa-brands fa-google', overseas: true },
      { name: 'Gmail',     url: 'https://mail.google.com/',      icon: 'fa-solid fa-envelope', overseas: true },
      { name: 'YouTube',   url: 'https://www.youtube.com/',      icon: 'fa-brands fa-youtube', overseas: true },
      { name: 'Wikipedia', url: 'https://zh.wikipedia.org/',     icon: 'fa-brands fa-wikipedia-w', overseas: true }
    ]
  },

  /* -------------------------------- Tech -------------------------------- */
  {
    category: 'Tech',
    items: [
      { name: 'GitHub',         url: 'https://github.com/',      icon: 'fa-brands fa-github', overseas: true },
      { name: 'Docker Hub',     url: 'https://hub.docker.com/',  icon: 'fa-brands fa-docker', overseas: true },
      { name: 'Cloudflare',     url: 'https://cloudflare.com/',  icon: 'fa-brands fa-cloudflare', overseas: true },
      { name: 'HE.NET',         url: 'https://he.net/',          icon: 'fa-solid fa-network-wired', overseas: true },
      { name: 'DMIT',           url: 'https://dmit.io/',         icon: 'fa-solid fa-server', overseas: true },
      { name: 'Let\'s Encrypt', url: 'https://letsencrypt.org/', icon: 'fa-solid fa-lock', overseas: true }
    ]
  },

  /* ------------------------------- Tools -------------------------------- */
  {
    category: 'Tools',
    items: [
      { name: 'Cli.im',       url: 'https://cli.im/',                             icon: 'fa-solid fa-qrcode' },
      { name: 'Tool.lu',      url: 'https://tool.lu/',                            icon: 'fa-solid fa-screwdriver-wrench' },
      { name: 'JSON',         url: 'https://www.json.cn/',                        icon: 'fa-solid fa-code' },
      { name: 'IPIP',         url: 'https://www.ipip.net/',                       icon: 'fa-solid fa-globe' },
      { name: 'Chinaz',       url: 'https://tool.chinaz.com/',                    icon: 'fa-solid fa-wrench' },
      { name: 'Dictionary',   url: 'https://www.oxfordlearnersdictionaries.com/', icon: 'fa-solid fa-spell-check', overseas: true },
      { name: 'CloudConvert', url: 'https://cloudconvert.com/',                   icon: 'fa-solid fa-arrows-rotate', overseas: true },
      { name: 'GeoViewer',    url: 'https://geoviewer.aloxaf.com/',               icon: 'fa-solid fa-location-crosshairs', overseas: true },
      { name: 'IP.sb',        url: 'https://ip.sb/',                              icon: 'fa-solid fa-location-dot', overseas: true },
      { name: 'Speedtest',    url: 'https://www.speedtest.net/',                  icon: 'fa-solid fa-gauge-high', overseas: true }
    ]
  },

  /* ----------------------------- Resources ------------------------------ */
  {
    category: 'Resources',
    items: [
      { name: 'RoamDial',         url: 'https://roamdial.com/',         icon: 'fa-solid fa-radio' },
      { name: 'NetEase Music',    url: 'https://music.163.com/',        icon: 'fa-solid fa-music' },
      { name: 'WeRead',           url: 'https://weread.qq.com/',        icon: 'fa-solid fa-book-open' },
      { name: 'btnull',           url: 'https://肖申克的救赎.com/',     icon: 'fa-solid fa-clapperboard', overseas: true },
      { name: 'zlibrary',         url: 'https://zh.z-library.sk/',      icon: 'fa-solid fa-book-open-reader', overseas: true },
      { name: 'Internet Archive', url: 'https://archive.org/',          icon: 'fa-solid fa-box-archive', overseas: true },
      { name: 'FontAwesome',      url: 'https://fontawesome.com/',      icon: 'fa-brands fa-font-awesome', overseas: true },
      { name: 'Goodreads',        url: 'https://www.goodreads.com/',    icon: 'fa-brands fa-goodreads', overseas: true }
    ]
  },

  /* ------------------------------- Forums ------------------------------- */
  {
    category: 'Forums',
    items: [
      { name: 'Chiphell', url: 'https://www.chiphell.com/forum.php', icon: 'fa-solid fa-microchip' },
      { name: 'NGA',      url: 'https://bbs.nga.cn/',                icon: 'fa-solid fa-gamepad' },
      { name: 'Hupu',     url: 'https://bbs.hupu.com/all-gambia',    icon: 'fa-solid fa-basketball' },
      { name: 'SSPAI',    url: 'https://sspai.com/',                 icon: 'fa-solid fa-feather-pointed' },
      { name: 'Newsmth',  url: 'https://www.newsmth.net/',           icon: 'fa-solid fa-building-columns' },
      { name: 'V2EX',     url: 'https://www.v2ex.com/',              icon: 'fa-solid fa-comments', overseas: true },
      { name: 'Reddit',   url: 'https://www.reddit.com/',            icon: 'fa-brands fa-reddit-alien', overseas: true },
      { name: 'RSS',      url: 'https://feedly.com/',                icon: 'fa-solid fa-rss', overseas: true },
      { name: '1p3a',     url: 'https://1point3acres.com/bbs/',      icon: 'fa-solid fa-graduation-cap', overseas: true }
    ]
  },


];
