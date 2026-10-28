/* ==========================================================================
   Link data — near shore and far shore
   --------------------------------------------------------------------------
   Loaded by index.html. Two lists live here:

     DATA_INDEX   near shore — services that usually work from home
     DATA_OS      far shore  — services that may need a crossing

   Shape:
     var DATA_INDEX = [{ category: 'Name', items: [{ name, url, icon }] }];

   Item fields:
     name      visible label (required)
     url       destination
     icon      Font Awesome class, defaults to fa-solid fa-link
     target    true or '_blank' opens in a new tab
     color     hex string, tints that single icon

   Icons: https://fontawesome.com/search?o=r&m=free
   ========================================================================== */

var DATA_INDEX = [

  /* Internal Network ----------------------------------------------------- */
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

  /* AI ------------------------------------------------------------------- */
  {
    category: 'AI',
    items: [
      { name: 'DeepSeek', url: 'https://chat.deepseek.com/',   icon: 'fa-solid fa-magnifying-glass-chart' },
      { name: 'Kimi',     url: 'https://www.kimi.com/',        icon: 'fa-solid fa-moon' },
      { name: 'Qwen',     url: 'https://www.qianwen.com/',     icon: 'fa-solid fa-cloud' },
      { name: 'Doubao',   url: 'https://www.doubao.com/chat/', icon: 'fa-solid fa-seedling' },
      { name: 'ChatGLM',  url: 'https://chatglm.cn/',          icon: 'fa-solid fa-brain' }
    ]
  },

  /* AI Studio ------------------------------------------------------------ */
  {
    category: 'AI Studio',
    items: [
      { name: 'Jimeng',   url: 'https://jimeng.jianying.com/',        icon: 'fa-solid fa-wand-magic-sparkles' },
      { name: 'Kling',    url: 'https://app.klingai.com/',            icon: 'fa-solid fa-video' },
      { name: 'Hailuo',   url: 'https://hailuoai.com/',               icon: 'fa-solid fa-water' },
      { name: 'Vidu',     url: 'https://www.vidu.cn/',                icon: 'fa-solid fa-clapperboard' },
      { name: 'Wanxiang', url: 'https://tongyi.aliyun.com/wanxiang/', icon: 'fa-solid fa-palette' }
    ]
  },

  /* Essential ------------------------------------------------------------ */
  {
    category: 'Essential',
    items: [
      { name: 'Bilibili', url: 'https://www.bilibili.com/',   icon: 'fa-brands fa-bilibili' },
      { name: 'Douyin',   url: 'https://www.douyin.com/',     icon: 'fa-brands fa-tiktok' },
      { name: 'Weather',  url: 'https://www.weather.com.cn/', icon: 'fa-solid fa-cloud-sun' }
    ]
  },

  /* Tools ---------------------------------------------------------------- */
  {
    category: 'Tools',
    items: [
      { name: 'Cli.im',     url: 'https://cli.im/',        icon: 'fa-solid fa-qrcode' },
      { name: 'Tool.lu',    url: 'https://tool.lu/',       icon: 'fa-solid fa-screwdriver-wrench' },
      { name: 'JSON',       url: 'https://www.json.cn/',   icon: 'fa-solid fa-code' },
      { name: 'IPIP',       url: 'https://www.ipip.net/',  icon: 'fa-solid fa-globe' },
      { name: 'Chinaz',     url: 'https://tool.chinaz.com/', icon: 'fa-solid fa-wrench' }
    ]
  },

  /* Resources ------------------------------------------------------------ */
  {
    category: 'Resources',
    items: [
      { name: 'RoamDial',      url: 'https://roamdial.com/',  icon: 'fa-solid fa-radio' },
      { name: 'NetEase Music', url: 'https://music.163.com/', icon: 'fa-solid fa-music' },
      { name: 'WeRead',        url: 'https://weread.qq.com/', icon: 'fa-solid fa-book-open' }
    ]
  },

  /* Forums --------------------------------------------------------------- */
  {
    category: 'Forums',
    items: [
      { name: 'Chiphell', url: 'https://www.chiphell.com/forum.php', icon: 'fa-solid fa-microchip' },
      { name: 'NGA',      url: 'https://bbs.nga.cn/',                icon: 'fa-solid fa-gamepad' },
      { name: 'Hupu',     url: 'https://bbs.hupu.com/all-gambia',    icon: 'fa-solid fa-basketball' },
      { name: 'SSPAI',    url: 'https://sspai.com/',                 icon: 'fa-solid fa-feather-pointed' },
      { name: 'Newsmth',  url: 'https://www.newsmth.net/',           icon: 'fa-solid fa-building-columns' }
    ]
  }

];

/* Far shore ------------------------------------------------------------ */

var DATA_OS = [

  /* AI ------------------------------------------------------------------- */
  {
    category: 'AI',
    items: [
      { name: 'ChatGPT', url: 'https://chatgpt.com/',          icon: 'fa-brands fa-openai' },
      { name: 'Claude',  url: 'https://claude.ai/new',         icon: 'fa-brands fa-claude' },
      { name: 'Gemini',  url: 'https://gemini.google.com/app', icon: 'fa-solid fa-gem' },
      { name: 'Grok',    url: 'https://grok.com/',             icon: 'fa-brands fa-x-twitter' },
      { name: 'Copilot', url: 'https://github.com/copilot',    icon: 'fa-brands fa-copilot' },
      { name: 'Cursor',  url: 'https://cursor.com/',           icon: 'fa-solid fa-i-cursor' }
    ]
  },

  /* AI Studio ------------------------------------------------------------ */
  {
    category: 'AI Studio',
    items: [
      { name: 'Midjourney', url: 'https://www.midjourney.com/', icon: 'fa-solid fa-paintbrush' },
      { name: 'Runway',     url: 'https://runwayml.com/',       icon: 'fa-solid fa-film' },
      { name: 'ElevenLabs', url: 'https://elevenlabs.io/',      icon: 'fa-solid fa-microphone-lines' },
      { name: 'OpenRouter', url: 'https://openrouter.ai/',      icon: 'fa-solid fa-route' }
    ]
  },

  /* Essential ------------------------------------------------------------ */
  {
    category: 'Essential',
    items: [
      { name: 'Google',    url: 'https://www.google.com/',   icon: 'fa-brands fa-google' },
      { name: 'Gmail',     url: 'https://mail.google.com/',  icon: 'fa-solid fa-envelope' },
      { name: 'YouTube',   url: 'https://www.youtube.com/',  icon: 'fa-brands fa-youtube' },
      { name: 'Wikipedia', url: 'https://zh.wikipedia.org/', icon: 'fa-brands fa-wikipedia-w' }
    ]
  },

  /* Tech ----------------------------------------------------------------- */
  {
    category: 'Tech',
    items: [
      { name: 'GitHub',         url: 'https://github.com/',      icon: 'fa-brands fa-github' },
      { name: 'Docker Hub',     url: 'https://hub.docker.com/',  icon: 'fa-brands fa-docker' },
      { name: 'Cloudflare',     url: 'https://cloudflare.com/',  icon: 'fa-brands fa-cloudflare' },
      { name: 'HE.NET',         url: 'https://he.net/',          icon: 'fa-solid fa-network-wired' },
      { name: 'DMIT',           url: 'https://dmit.io/',         icon: 'fa-solid fa-server' },
      { name: 'Let\'s Encrypt', url: 'https://letsencrypt.org/', icon: 'fa-solid fa-lock' }
    ]
  },

  /* Tools ---------------------------------------------------------------- */
  {
    category: 'Tools',
    items: [
      { name: 'Dictionary',   url: 'https://www.oxfordlearnersdictionaries.com/', icon: 'fa-solid fa-spell-check' },
      { name: 'CloudConvert', url: 'https://cloudconvert.com/',                   icon: 'fa-solid fa-arrows-rotate' },
      { name: 'GeoViewer',    url: 'https://geoviewer.aloxaf.com/',               icon: 'fa-solid fa-location-crosshairs' },
      { name: 'IP.sb',        url: 'https://ip.sb/',                              icon: 'fa-solid fa-location-dot' },
      { name: 'Speedtest',    url: 'https://www.speedtest.net/',                  icon: 'fa-solid fa-gauge-high' }
    ]
  },

  /* Resources ------------------------------------------------------------ */
  {
    category: 'Resources',
    items: [
      { name: 'btnull',           url: 'https://肖申克的救赎.com/',  icon: 'fa-solid fa-clapperboard' },
      { name: 'zlibrary',         url: 'https://zh.z-library.sk/',   icon: 'fa-solid fa-book-open-reader' },
      { name: 'Internet Archive', url: 'https://archive.org/',       icon: 'fa-solid fa-box-archive' },
      { name: 'FontAwesome',      url: 'https://fontawesome.com/',   icon: 'fa-brands fa-font-awesome' },
      { name: 'Goodreads',        url: 'https://www.goodreads.com/', icon: 'fa-brands fa-goodreads' }
    ]
  },

  /* Forums --------------------------------------------------------------- */
  {
    category: 'Forums',
    items: [
      { name: 'V2EX',   url: 'https://www.v2ex.com/',            icon: 'fa-solid fa-comments' },
      { name: 'Reddit', url: 'https://www.reddit.com/',          icon: 'fa-brands fa-reddit-alien' },
      { name: 'RSS',    url: 'https://feedly.com/',              icon: 'fa-solid fa-rss' },
      { name: '1p3a',   url: 'https://1point3acres.com/bbs/',    icon: 'fa-solid fa-graduation-cap' }
    ]
  }

];
