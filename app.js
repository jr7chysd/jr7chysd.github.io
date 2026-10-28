/* ==========================================================================
   App — everything that runs on index.html
   --------------------------------------------------------------------------
   Four sections, in load order:

     1. Link renderer      builds the near / far shore lists from data.js
     2. Random Lab         the three generators
     3. Height equaliser   keeps the lab tabs and stages the same size
     4. App                header note, click switching, boot

   data.js must be loaded before this file (it defines DATA_INDEX / DATA_OS).
   No bundler, no modules: plain ES5 inside IIFEs.
   ========================================================================== */

/* ==========================================================================
   Link renderer — DATA_INDEX / DATA_OS → the two link views
   ========================================================================== */
(function () {
  'use strict';

  // One shared marker for every category: consistent, quiet, not per-group.
  var GROUP_MARK = 'fa-solid fa-minus';

  // Build the whole fragment first so a mid-render error cannot leave half a page.
  function buildPage(data) {
    var fragment = document.createDocumentFragment();

    data.forEach(function (group) {
      if (!group || !group.items || !group.items.length) return;

      var section = document.createElement('section');
      section.className = 'group';

      var label = document.createElement('h2');
      label.className = 'group-label';

      var glyph = document.createElement('i');
      glyph.className = GROUP_MARK + ' group-icon';
      glyph.setAttribute('aria-hidden', 'true');
      label.appendChild(glyph);

      label.appendChild(document.createTextNode(group.category || ''));
      section.appendChild(label);

      var grid = document.createElement('div');
      grid.className = 'grid';

      group.items.forEach(function (item) {
        if (!item || !item.name) return;

        var link = document.createElement('a');
        link.className = 'item';
        link.href = item.url || '#';
        link.title = item.name;

        if (item.target === true || item.target === '_blank') {
          link.target = '_blank';
          link.rel = 'noopener noreferrer';
        } else {
          link.target = '_self';
        }

        var icon = document.createElement('i');
        icon.className = item.icon || 'fa-solid fa-link';
        icon.setAttribute('aria-hidden', 'true');
        if (item.color) icon.style.color = item.color;

        var name = document.createElement('span');
        name.className = 'item-name';
        name.textContent = item.name;

        link.appendChild(icon);
        link.appendChild(name);
        grid.appendChild(link);
      });

      section.appendChild(grid);
      fragment.appendChild(section);
    });

    return fragment;
  }

  function showTip(app, text) {
    var tip = document.createElement('p');
    tip.className = 'load-error';
    tip.textContent = text;
    app.appendChild(tip);
  }

  function render(app, data) {
    while (app.firstChild) app.removeChild(app.firstChild);

    if (!data || !data.length) {
      showTip(app, 'Navigation data was not found. Check the page data file.');
      return;
    }

    try {
      app.appendChild(buildPage(data));
      if (!app.querySelector('.group')) showTip(app, 'This page has no links yet.');
    } catch (error) {
      while (app.firstChild) app.removeChild(app.firstChild);
      showTip(app, 'Navigation failed to load: ' + (error && error.message ? error.message : String(error)));
      if (window.console && console.error) console.error(error);
    }
  }

  window.renderLinks = render;
})();

/* ==========================================================================
 Random Lab — password / username / nickname generators
 ========================================================================== */
(function () {
  'use strict';

  /* ======================================================================
     Base constants
     ====================================================================== */
  var PREF_KEY = 'randomlab.prefs.v3';
  var LEDGER_KEY = 'randomlab.usernames.v1';
  var MIN_USERNAME_LENGTH = 12;
  var MAX_USERNAME_LENGTH = 20;

  var CHARSETS = {
    upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    lower: 'abcdefghijklmnopqrstuvwxyz',
    digits: '0123456789',
    symbols: '!@#$%^&*()-_=+[]{};:,.?/'
  };
  var CHARSET_ORDER = ['upper', 'lower', 'digits', 'symbols'];
  var AMBIGUOUS_PATTERN = /[0OoIl1]/g;

  var FORMAT_LABELS = {
    camel: 'CamelCase',
    lower: 'lowercase',
    snake: 'snake_case',
    kebab: 'kebab-case',
    random: 'Any'
  };
  var FORMAT_KEYS = ['camel', 'lower', 'snake', 'kebab'];

  var STYLE_HINTS = {
    random: 'Random style',
    nature: 'Land, plants, and animals',
    cosmic: 'Stars, orbits, and light',
    tech: 'Code, machines, and electronics',
    poetic: 'Quiet, soft words',
    fantasy: 'Runes, myths, and adventure',
    ocean: 'Tides, reefs, and sea life',
    cozy: 'Warm, soft, and domestic',
    urban: 'Streets, transit, and city nights'
  };

  var USER_STYLES = {
    nature: {
      label: 'Nature',
      hint: STYLE_HINTS.nature,
      prefixes: [
        { w: 'Ivy' }, { w: 'Oak' }, { w: 'Elm' },
        { w: 'Bay' }, { w: 'Moss' }, { w: 'Clay' },
        { w: 'Fern' }, { w: 'Rain' }, { w: 'Sage' },
        { w: 'Cedar' }, { w: 'Maple' }, { w: 'Birch' },
        { w: 'Amber' }, { w: 'River' }, { w: 'Sunny' },
        { w: 'Honey' }, { w: 'Willow' }, { w: 'Clover' },
        { w: 'Meadow' }, { w: 'Pebble' }, { w: 'Bramble' },
        { w: 'Juniper' }, { w: 'Autumn' }, { w: 'Mossy' },
        { w: 'Acorn' }, { w: 'Aspen' }, { w: 'Hazel' },
        { w: 'Heather' }, { w: 'Laurel' }, { w: 'Lichen' },
        { w: 'Orchid' }, { w: 'Rowan' }, { w: 'Briar' },
        { w: 'Blossom' }, { w: 'Dapple' }, { w: 'Prairie' },
        { w: 'Timber' }, { w: 'Saffron' }, { w: 'Tansy' },
        { w: 'Thyme' }, { w: 'Poppy' }, { w: 'Sprout' },
        { w: 'Windy' }, { w: 'Sunlit' }
      ],
      nouns: [
        { w: 'Fox' }, { w: 'Otter' }, { w: 'Wren' },
        { w: 'Finch' }, { w: 'Pine' }, { w: 'Brook' },
        { w: 'Heron' }, { w: 'Badger' }, { w: 'Moth' },
        { w: 'Hare' }, { w: 'Koi' }, { w: 'Lark' },
        { w: 'Elk' }, { w: 'Crow' }, { w: 'Fawn' },
        { w: 'Reed' }, { w: 'Dune' }, { w: 'Grove' },
        { w: 'Robin' }, { w: 'Sparrow' }, { w: 'Salmon' },
        { w: 'Beaver' }, { w: 'Lynx' }, { w: 'Bison' },
        { w: 'Glen' }, { w: 'Marsh' }, { w: 'Crane' },
        { w: 'Dove' }, { w: 'Falcon' }, { w: 'Marten' },
        { w: 'Quail' }, { w: 'Stag' }, { w: 'Thrush' },
        { w: 'Turtle' }, { w: 'Vole' }, { w: 'Pony' }
      ]
    },
    cosmic: {
      label: 'Cosmic',
      hint: STYLE_HINTS.cosmic,
      prefixes: [
        { w: 'Sol' }, { w: 'Ion' }, { w: 'Luna' },
        { w: 'Mars' }, { w: 'Nova' }, { w: 'Vega' },
        { w: 'Lyra' }, { w: 'Astro' }, { w: 'Comet' },
        { w: 'Orbit' }, { w: 'Cosmo' }, { w: 'Solar' },
        { w: 'Lunar' }, { w: 'Pulsar' }, { w: 'Meteor' },
        { w: 'Nebula' }, { w: 'Galaxy' }, { w: 'Zenith' },
        { w: 'Aurora' }, { w: 'Eclipse' }, { w: 'Stellar' },
        { w: 'Orion' }, { w: 'Corona' }, { w: 'Cosmic' },
        { w: 'Equinox' }, { w: 'Helix' }, { w: 'Quasar' },
        { w: 'Rigel' }, { w: 'Sirius' }, { w: 'Umbra' },
        { w: 'Astra' }, { w: 'Celeste' }, { w: 'Nadir' },
        { w: 'Orbital' }, { w: 'Nyx' }, { w: 'Phobos' },
        { w: 'Pluto' }, { w: 'Rhea' }, { w: 'Titan' },
        { w: 'Vesper' }, { w: 'Zodiac' }, { w: 'Sunspot' }
      ],
      nouns: [
        { w: 'Fox' }, { w: 'Hawk' }, { w: 'Wolf' },
        { w: 'Koi' }, { w: 'Wren' }, { w: 'Ray' },
        { w: 'Drift' }, { w: 'Spark' }, { w: 'Beam' },
        { w: 'Voyager' }, { w: 'Flare' }, { w: 'Dust' },
        { w: 'Halo' }, { w: 'Echo' }, { w: 'Tide' },
        { w: 'Sail' }, { w: 'Asteroid' }, { w: 'Moth' },
        { w: 'Moon' }, { w: 'Planet' }, { w: 'Aster' },
        { w: 'Lumen' }, { w: 'Polaris' }, { w: 'Void' },
        { w: 'Wish' }, { w: 'Shade' }, { w: 'Arc' },
        { w: 'Beacon' }, { w: 'Cluster' }, { w: 'Compass' },
        { w: 'Horizon' }, { w: 'Pulse' }, { w: 'Rocket' },
        { w: 'Satellite' }, { w: 'Star' }, { w: 'Vista' }
      ]
    },
    tech: {
      label: 'Tech',
      hint: STYLE_HINTS.tech,
      prefixes: [
        { w: 'Bit' }, { w: 'Neo' }, { w: 'Byte' },
        { w: 'Data' }, { w: 'Neon' }, { w: 'Nano' },
        { w: 'Pixel' }, { w: 'Logic' }, { w: 'Cyber' },
        { w: 'Turbo' }, { w: 'Cloud' }, { w: 'Stack' },
        { w: 'Kernel' }, { w: 'Cipher' }, { w: 'Vector' },
        { w: 'Binary' }, { w: 'Signal' }, { w: 'Circuit' },
        { w: 'Silicon' }, { w: 'Quantum' }, { w: 'Crypto' },
        { w: 'Delta' }, { w: 'Fiber' }, { w: 'Fusion' },
        { w: 'Gizmo' }, { w: 'Hertz' }, { w: 'Laser' },
        { w: 'Neural' }, { w: 'Photon' }, { w: 'Proxy' },
        { w: 'Atomic' }, { w: 'Buffer' }, { w: 'Cache' },
        { w: 'Carbon' }, { w: 'Digital' }, { w: 'Engine' },
        { w: 'Gadget' }, { w: 'Glitch' }, { w: 'Matrix' },
        { w: 'Packet' }, { w: 'Radar' }, { w: 'Tensor' }
      ],
      nouns: [
        { w: 'Fox' }, { w: 'Bot' }, { w: 'Lab' },
        { w: 'Loop' }, { w: 'Node' }, { w: 'Core' },
        { w: 'Grid' }, { w: 'Wave' }, { w: 'Flux' },
        { w: 'Forge' }, { w: 'Pilot' }, { w: 'Port' },
        { w: 'Code' }, { w: 'Shift' }, { w: 'Mesh' },
        { w: 'Spark' }, { w: 'Craft' }, { w: 'Hatch' },
        { w: 'Chip' }, { w: 'Link' }, { w: 'Ping' },
        { w: 'Root' }, { w: 'Sync' }, { w: 'Task' },
        { w: 'Vault' }, { w: 'Wire' }, { w: 'Array' },
        { w: 'Bus' }, { w: 'Cell' }, { w: 'Dock' },
        { w: 'Gate' }, { w: 'Hub' }, { w: 'Key' },
        { w: 'Mode' }, { w: 'Patch' }, { w: 'Query' }
      ]
    },
    poetic: {
      label: 'Poetic',
      hint: STYLE_HINTS.poetic,
      prefixes: [
        { w: 'Dew' }, { w: 'Hush' }, { w: 'Rose' },
        { w: 'Warm' }, { w: 'Pale' }, { w: 'Soft' },
        { w: 'Quiet' }, { w: 'Honey' }, { w: 'Amber' },
        { w: 'Lucid' }, { w: 'Dusky' }, { w: 'Mellow' },
        { w: 'Velvet' }, { w: 'Silken' }, { w: 'Golden' },
        { w: 'Tender' }, { w: 'Gentle' }, { w: 'Wistful' },
        { w: 'Drowsy' }, { w: 'Moonlit' }, { w: 'Wandering' },
        { w: 'Candlelit' }, { w: 'Faint' }, { w: 'Gossamer' },
        { w: 'Hushed' }, { w: 'Ivory' }, { w: 'Lilac' },
        { w: 'Misty' }, { w: 'Silver' }, { w: 'Starlit' },
        { w: 'Fleeting' }, { w: 'Fragile' }, { w: 'Luminous' },
        { w: 'Paper' }, { w: 'Rustic' }, { w: 'Saffron' },
        { w: 'Satin' }, { w: 'Smoky' }, { w: 'Snowy' },
        { w: 'Solace' }, { w: 'Thistle' }, { w: 'Wispy' }
      ],
      nouns: [
        { w: 'Sigh' }, { w: 'Dream' }, { w: 'Echo' },
        { w: 'Petal' }, { w: 'Dawn' }, { w: 'Dusk' },
        { w: 'Tide' }, { w: 'Bloom' }, { w: 'Song' },
        { w: 'Moth' }, { w: 'Rain' }, { w: 'Vale' },
        { w: 'Wisp' }, { w: 'Lyric' }, { w: 'Drift' },
        { w: 'Whisper' }, { w: 'Lull' }, { w: 'Glow' },
        { w: 'Aura' }, { w: 'Breeze' }, { w: 'Chime' },
        { w: 'Feather' }, { w: 'Murmur' }, { w: 'Reverie' },
        { w: 'Snow' }, { w: 'Star' }, { w: 'Bell' },
        { w: 'Brook' }, { w: 'Candle' }, { w: 'Garden' },
        { w: 'Lake' }, { w: 'Lark' }, { w: 'Mist' },
        { w: 'Moon' }, { w: 'Ripple' }, { w: 'Willow' }
      ]
    },
    fantasy: {
      label: 'Fantasy',
      hint: STYLE_HINTS.fantasy,
      prefixes: [
        { w: 'Ash' }, { w: 'Fae' }, { w: 'Grim' },
        { w: 'Iron' }, { w: 'Myth' }, { w: 'Rune' },
        { w: 'Onyx' }, { w: 'Wild' }, { w: 'Ember' },
        { w: 'Frost' }, { w: 'Thorn' }, { w: 'Storm' },
        { w: 'Ashen' }, { w: 'Sable' }, { w: 'Fable' },
        { w: 'Mystic' }, { w: 'Arcane' }, { w: 'Shadow' },
        { w: 'Crystal' }, { w: 'Dragon' }, { w: 'Glimmer' },
        { w: 'Bane' }, { w: 'Cinder' }, { w: 'Elder' },
        { w: 'Gale' }, { w: 'Hex' }, { w: 'Obsidian' },
        { w: 'Phantom' }, { w: 'Runic' }, { w: 'Spectral' },
        { w: 'Ancient' }, { w: 'Blight' }, { w: 'Bone' },
        { w: 'Dread' }, { w: 'Dusk' }, { w: 'Flame' },
        { w: 'Gloom' }, { w: 'Grave' }, { w: 'Raven' },
        { w: 'Spell' }, { w: 'Titan' }, { w: 'Valor' }
      ],
      nouns: [
        { w: 'Mage' }, { w: 'Wyrm' }, { w: 'Oath' },
        { w: 'Fang' }, { w: 'Vale' }, { w: 'Sigil' },
        { w: 'Crown' }, { w: 'Blade' }, { w: 'Spire' },
        { w: 'Quest' }, { w: 'Realm' }, { w: 'Knight' },
        { w: 'Warden' }, { w: 'Tower' }, { w: 'Hollow' },
        { w: 'Saga' }, { w: 'Cloak' }, { w: 'Dagger' },
        { w: 'Druid' }, { w: 'Gate' }, { w: 'Golem' },
        { w: 'Oracle' }, { w: 'Relic' }, { w: 'Shield' },
        { w: 'Altar' }, { w: 'Banner' }, { w: 'Cavern' },
        { w: 'Citadel' }, { w: 'Grimoire' }, { w: 'Helm' },
        { w: 'Keep' }, { w: 'Lantern' }, { w: 'Mantle' },
        { w: 'Scepter' }
      ]
    },
    ocean: {
      label: 'Ocean',
      hint: STYLE_HINTS.ocean,
      prefixes: [
        { w: 'Tide' }, { w: 'Reef' }, { w: 'Wave' },
        { w: 'Salt' }, { w: 'Kelp' }, { w: 'Foam' },
        { w: 'Gulf' }, { w: 'Coral' }, { w: 'Shell' },
        { w: 'Pearl' }, { w: 'Breeze' }, { w: 'Harbor' },
        { w: 'Current' }, { w: 'Lagoon' }, { w: 'Coastal' },
        { w: 'Tidal' }, { w: 'Briny' }, { w: 'Marina' },
        { w: 'Anchor' }, { w: 'Azure' }, { w: 'Deep' },
        { w: 'Dock' }, { w: 'Fjord' }, { w: 'Island' },
        { w: 'Shore' }, { w: 'Surf' }, { w: 'Abyss' },
        { w: 'Atoll' }, { w: 'Beacon' }, { w: 'Brine' },
        { w: 'Coast' }, { w: 'Estuary' }, { w: 'Mist' },
        { w: 'Nautical' }, { w: 'Pelagic' }, { w: 'Sand' },
        { w: 'Splash' }, { w: 'Swell' }
      ],
      nouns: [
        { w: 'Eel' }, { w: 'Fin' }, { w: 'Ray' },
        { w: 'Crab' }, { w: 'Gull' }, { w: 'Tern' },
        { w: 'Cove' }, { w: 'Shoal' }, { w: 'Squid' },
        { w: 'Whale' }, { w: 'Otter' }, { w: 'Drift' },
        { w: 'Spray' }, { w: 'Crest' }, { w: 'Bay' },
        { w: 'Isle' }, { w: 'Dolphin' }, { w: 'Lobster' },
        { w: 'Nautilus' }, { w: 'Orca' }, { w: 'Oyster' },
        { w: 'Puffin' }, { w: 'Seal' }, { w: 'Shark' },
        { w: 'Anemone' }, { w: 'Clam' }, { w: 'Dune' },
        { w: 'Jelly' }, { w: 'Krill' }, { w: 'Marlin' },
        { w: 'Minnow' }, { w: 'Plankton' }, { w: 'Prawn' },
        { w: 'Urchin' }
      ]
    },
    cozy: {
      label: 'Cozy',
      hint: STYLE_HINTS.cozy,
      prefixes: [
        { w: 'Cocoa' }, { w: 'Vanilla' }, { w: 'Maple' },
        { w: 'Honey' }, { w: 'Velvet' }, { w: 'Pillow' },
        { w: 'Mellow' }, { w: 'Warm' }, { w: 'Soft' },
        { w: 'Cozy' }, { w: 'Plush' }, { w: 'Linen' },
        { w: 'Biscuit' }, { w: 'Candle' }, { w: 'Blanket' },
        { w: 'Toasty' }, { w: 'Amber' }, { w: 'Milky' },
        { w: 'Sunday' }, { w: 'Hearth' }, { w: 'Cinnamon' },
        { w: 'Cotton' }, { w: 'Cream' }, { w: 'Flannel' },
        { w: 'Peach' }, { w: 'Pudding' }, { w: 'Snug' },
        { w: 'Sugar' }, { w: 'Tea' }, { w: 'Wool' },
        { w: 'Almond' }, { w: 'Butter' }, { w: 'Cabin' },
        { w: 'Downy' }, { w: 'Fireside' }, { w: 'Fleece' },
        { w: 'Ginger' }, { w: 'Knitted' }, { w: 'Lullaby' },
        { w: 'Mitten' }, { w: 'Nutmeg' }, { w: 'Quilt' }
      ],
      nouns: [
        { w: 'Sigh' }, { w: 'Nest' }, { w: 'Nook' },
        { w: 'Mug' }, { w: 'Bun' }, { w: 'Paw' },
        { w: 'Dream' }, { w: 'Ember' }, { w: 'Glow' },
        { w: 'Hush' }, { w: 'Loaf' }, { w: 'Tale' },
        { w: 'Cloud' }, { w: 'Moth' }, { w: 'Toast' },
        { w: 'Spot' }, { w: 'Snooze' }, { w: 'Haven' },
        { w: 'Cookie' }, { w: 'Jam' }, { w: 'Kettle' },
        { w: 'Lamp' }, { w: 'Pie' }, { w: 'Rug' },
        { w: 'Spoon' }, { w: 'Yarn' }, { w: 'Basket' },
        { w: 'Bed' }, { w: 'Cushion' }, { w: 'Fire' },
        { w: 'Kitten' }, { w: 'Muffin' }, { w: 'Pancake' },
        { w: 'Scone' }, { w: 'Teapot' }, { w: 'Thread' }
      ]
    },
    urban: {
      label: 'Urban',
      hint: STYLE_HINTS.urban,
      prefixes: [
        { w: 'Metro' }, { w: 'Brick' }, { w: 'Neon' },
        { w: 'Alley' }, { w: 'Rooftop' }, { w: 'Transit' },
        { w: 'Signal' }, { w: 'Corner' }, { w: 'Avenue' },
        { w: 'City' }, { w: 'Local' }, { w: 'Concrete' },
        { w: 'Downtown' }, { w: 'Sidewalk' }, { w: 'Street' },
        { w: 'Traffic' }, { w: 'Midtown' }, { w: 'Boulevard' },
        { w: 'Arcade' }, { w: 'Billboard' }, { w: 'Bridge' },
        { w: 'District' }, { w: 'Junction' }, { w: 'Market' },
        { w: 'Station' }, { w: 'Subway' }, { w: 'Tunnel' },
        { w: 'Uptown' }, { w: 'Bakery' }, { w: 'Canal' },
        { w: 'Crossing' }, { w: 'Depot' }, { w: 'Electric' },
        { w: 'Lobby' }, { w: 'Parade' }, { w: 'Platform' },
        { w: 'Skyline' }, { w: 'Skyscraper' }, { w: 'Terminal' },
        { w: 'Theater' }
      ],
      nouns: [
        { w: 'Cab' }, { w: 'Bus' }, { w: 'Star' },
        { w: 'Beat' }, { w: 'Lane' }, { w: 'Loft' },
        { w: 'Sign' }, { w: 'Park' }, { w: 'Rail' },
        { w: 'Walk' }, { w: 'Block' }, { w: 'Plaza' },
        { w: 'Night' }, { w: 'Noise' }, { w: 'Light' },
        { w: 'Scene' }, { w: 'Sound' }, { w: 'Drift' },
        { w: 'Arch' }, { w: 'Cafe' }, { w: 'Curb' },
        { w: 'Door' }, { w: 'Roof' }, { w: 'Shop' },
        { w: 'Train' }, { w: 'Window' }, { w: 'Bar' },
        { w: 'Bike' }, { w: 'Cinema' }, { w: 'Crosswalk' },
        { w: 'Diner' }, { w: 'Elevator' }, { w: 'Fountain' },
        { w: 'Gallery' }, { w: 'Garage' }, { w: 'Museum' }
      ]
    }
  };

  var STYLE_ORDER = ['nature', 'cosmic', 'tech', 'poetic', 'fantasy', 'ocean', 'cozy', 'urban'];

  var NICKNAME_PATTERNS = {
    pair: 'Pair',
    of: 'Of',
    after: 'After'
  };

  var NICKNAME_MOOD_ORDER = ['still', 'dreamy', 'melancholy', 'radiant', 'wild'];

  var NICKNAME_MOODS = {
    still: {
      label: 'Still',
      hint: 'Quiet, cold, and clear.',
      adjectives: [
        'Misted', 'Quiet', 'Pale', 'Silken', 'Frozen', 'Silver',
        'Hushed', 'Moonlit', 'Glass', 'Still', 'Grey', 'Rainwashed',
        'Frosted', 'Dim', 'Chill', 'Bare', 'Steady',
        'Slate', 'Pearl', 'Smoky', 'Wintry', 'Unspoken'
      ],
      images: [
        'Harbor', 'Lake', 'Garden', 'Valley', 'Stone', 'Window',
        'Field', 'Shore', 'Orchard', 'Chapel', 'Pier', 'Meadow',
        'Fjord', 'Cloister', 'Causeway', 'Marsh', 'Tarn',
        'Rooftop', 'Balcony', 'Cabin', 'Hollow', 'Dock'
      ],
      seconds: [
        'Dusk', 'Frost', 'Fog', 'Silence', 'Snow', 'Dust',
        'Rain', 'Mist', 'Ash', 'Twilight', 'Dew', 'Winter',
        'Gloam', 'Rime', 'Hush', 'Sleet', 'Shade',
        'Evenfall', 'Pall', 'Snowfall', 'Drift', 'Cold'
      ]
    },
    dreamy: {
      label: 'Dreamy',
      hint: 'Soft, drifting, and half-awake.',
      adjectives: [
        'Drifting', 'Velvet', 'Lilac', 'Soft', 'Wandering', 'Golden',
        'Lucid', 'Starry', 'Honeyed', 'Sleepy', 'Pastel', 'Floating',
        'Drowsy', 'Faint', 'Dappled', 'Sunken', 'Whispering',
        'Hazy', 'Silvery', 'Dreaming', 'Weightless', 'Pearlescent'
      ],
      images: [
        'Dream', 'Garden', 'Orchard', 'Horizon', 'Meadow', 'Lantern',
        'Cloud', 'Tide', 'Ballroom', 'Carousel', 'Window', 'Bloom',
        'Attic', 'Observatory', 'Greenhouse', 'Lagoon', 'Terrace',
        'Spire', 'Cottage', 'Skylight', 'Grotto', 'Hammock'
      ],
      seconds: [
        'Dawn', 'Sleep', 'Haze', 'Starlight', 'Petals', 'Wonder',
        'Fireflies', 'Moon', 'Sugar', 'Echo', 'Reverie', 'Summer',
        'Mist', 'Drizzle', 'Lullaby', 'Daydream', 'Stardust',
        'Twilight', 'Sigh', 'Whisper', 'Snowfall', 'Glimmer'
      ]
    },
    melancholy: {
      label: 'Melancholy',
      hint: 'Faded, rain-soft, and blue.',
      adjectives: [
        'Ashen', 'Faded', 'Hollow', 'Weeping', 'Lonely', 'Rainy',
        'Somber', 'Blue', 'Wistful', 'Weathered', 'Faint', 'Cold',
        'Bleak', 'Weary', 'Sullen', 'Frosted', 'Dim',
        'Broken', 'Quiet', 'Rainwashed', 'Tarnished', 'Forlorn'
      ],
      images: [
        'Ash', 'Harbor', 'Room', 'Garden', 'Bell', 'Shore',
        'Tower', 'Window', 'Street', 'Piano', 'Mirror', 'Rooftop',
        'Balcony', 'Station', 'Attic', 'Cemetery', 'Bridge',
        'Cafe', 'Alley', 'Church', 'Hotel', 'Lighthouse'
      ],
      seconds: [
        'Sorrow', 'Dusk', 'Winter', 'Silence', 'Regret', 'Smoke',
        'Rain', 'Autumn', 'Midnight', 'Farewell', 'Dust', 'Fog',
        'Grey', 'Sleet', 'Elegy', 'Wither', 'Sepia',
        'December', 'Longing', 'Wane', 'Rainfall', 'Nightfall'
      ]
    },
    radiant: {
      label: 'Radiant',
      hint: 'Warm, bright, and golden.',
      adjectives: [
        'Golden', 'Bright', 'Amber', 'Sunlit', 'Radiant', 'Blazing',
        'Honeyed', 'Coral', 'Warm', 'Glowing', 'Lucent', 'Tangerine',
        'Gilded', 'Sunwashed', 'Peach', 'Saffron', 'Dazzling',
        'Lambent', 'Rosegold', 'Sunny', 'Gleaming', 'Buttery'
      ],
      images: [
        'Dawn', 'Meadow', 'Harbor', 'Garden', 'Field', 'Orchard',
        'Tide', 'Sky', 'Sunset', 'Balcony', 'Shore', 'Grove',
        'Courtyard', 'Terrace', 'Vineyard', 'Atrium', 'Lighthouse',
        'Market', 'Beach', 'Cliff', 'Pavilion', 'Greenhouse'
      ],
      seconds: [
        'Light', 'Summer', 'Morning', 'Gold', 'Fire', 'Bloom',
        'Honey', 'Noon', 'Ember', 'Daybreak', 'Warmth', 'Spark',
        'Sunrise', 'Solstice', 'Radiance', 'Afterglow', 'Aurora',
        'Blaze', 'Midday', 'Flare', 'Dawnlight', 'Kindling'
      ]
    },
    wild: {
      label: 'Wild',
      hint: 'Stormy, feral, and untamed.',
      adjectives: [
        'Wild', 'Stormy', 'Feral', 'Thorned', 'Iron', 'Ember',
        'Roving', 'Untamed', 'Bitter', 'Howling', 'Brambled', 'Flint',
        'Ragged', 'Wolfish', 'Savage', 'Lawless', 'Briared',
        'Smoldering', 'Restless', 'Ravenous', 'Unyielding', 'Grim'
      ],
      images: [
        'Forest', 'Mountain', 'River', 'Gale', 'Thorn', 'Hollow',
        'Tide', 'Storm', 'Canyon', 'Ridge', 'Fen', 'Wildwood',
        'Badlands', 'Rapids', 'Bluff', 'Moor', 'Thicket',
        'Summit', 'Gorge', 'Steppe', 'Crag', 'Marsh'
      ],
      seconds: [
        'Thunder', 'Wind', 'Frost', 'Flame', 'Ruin', 'Lightning',
        'Ash', 'Roar', 'Night', 'Wildfire', 'Rain', 'Dusk',
        'Squall', 'Havoc', 'Tempest', 'Frenzy', 'Howl',
        'Maelstrom', 'Ashfall', 'Frostfire', 'Thunderhead', 'Cinder'
      ]
    }
  };

  var ONSETS = ['b', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'm', 'n', 'p', 'r', 's', 't', 'v', 'w', 'y', 'z'];
  var VOWELS = ['a', 'e', 'i', 'o', 'u'];
  var BANNED_PARTS = [
    'fuk', 'dik', 'sex', 'cum', 'tit', 'ass', 'nig', 'fag',
    'piss', 'shit', 'cunt', 'rape', 'kkk', 'suk', 'boob', 'anus', 'anal'
  ];

  /* ======================================================================
     State and DOM
     ====================================================================== */
  var usedNames = loadLedger();

  var state = {
    length: 20,
    charsets: { upper: true, lower: true, digits: true, symbols: false },
    excludeAmbiguous: true,
    passwordVisible: true,
    style: 'random',
    format: 'camel',
    suffix: true,
    maxLength: 15,
    nicknameMood: 'random',
    nicknamePattern: 'pair'
  };

  var currentPassword = '';
  var currentUsername = '';
  var currentNickname = '';
  var recentNicknames = new Set();
  var toastTimer = null;

  var dom = {
    passwordOutput: document.getElementById('passwordOutput'),
    togglePassword: document.getElementById('togglePassword'),
    copyPassword: document.getElementById('copyPassword'),
    strengthBadge: document.getElementById('strengthBadge'),
    strengthText: document.getElementById('strengthText'),
    strengthMeter: document.getElementById('strengthMeter'),
    passwordMeta: document.getElementById('passwordMeta'),
    passwordLive: document.getElementById('passwordLive'),
    lengthRange: document.getElementById('lengthRange'),
    lengthValue: document.getElementById('lengthValue'),
    charsetCount: document.getElementById('charsetCount'),
    excludeAmbiguous: document.getElementById('excludeAmbiguous'),
    generatePassword: document.getElementById('generatePassword'),

    usernameOutput: document.getElementById('usernameOutput'),
    copyUsername: document.getElementById('copyUsername'),
    usernameCount: document.getElementById('usernameCount'),
    usernameMeaning: document.getElementById('usernameMeaning'),
    usernameStyleTag: document.getElementById('usernameStyleTag'),
    usernameSuffixTag: document.getElementById('usernameSuffixTag'),
    usernamePronounce: document.getElementById('usernamePronounce'),
    usernameLive: document.getElementById('usernameLive'),
    styleChips: document.getElementById('styleChips'),
    styleHint: document.getElementById('styleHint'),
    formatChips: document.getElementById('formatChips'),
    formatHint: document.getElementById('formatHint'),
    suffixToggle: document.getElementById('suffixToggle'),
    usernameLengthRange: document.getElementById('usernameLengthRange'),
    usernameLengthValue: document.getElementById('usernameLengthValue'),
    generateUsername: document.getElementById('generateUsername'),

    nicknameOutput: document.getElementById('nicknameOutput'),
    copyNickname: document.getElementById('copyNickname'),
    nicknameWordCount: document.getElementById('nicknameWordCount'),
    nicknameMoodTag: document.getElementById('nicknameMoodTag'),
    nicknamePatternTag: document.getElementById('nicknamePatternTag'),
    nicknameHint: document.getElementById('nicknameHint'),
    nicknameLive: document.getElementById('nicknameLive'),
    nicknameMoodChips: document.getElementById('nicknameMoodChips'),
    nicknameMoodHint: document.getElementById('nicknameMoodHint'),
    nicknamePatternChips: document.getElementById('nicknamePatternChips'),
    nicknamePatternHint: document.getElementById('nicknamePatternHint'),
    generateNickname: document.getElementById('generateNickname'),

    toast: document.getElementById('toast')
  };

  var charsetInputs = Array.prototype.slice.call(document.querySelectorAll('input[data-charset]'));
  var lengthStepButtons = Array.prototype.slice.call(document.querySelectorAll('[data-length-step]'));
  var usernameLengthStepButtons = Array.prototype.slice.call(document.querySelectorAll('[data-username-length-step]'));
  var tabButtons = Array.prototype.slice.call(document.querySelectorAll('[data-tab]'));
  var tabPanels = Array.prototype.slice.call(document.querySelectorAll('[data-panel]'));

  /* ======================================================================
     Utilities
     ====================================================================== */
  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function capitalize(value) {
    return value.charAt(0).toUpperCase() + value.slice(1);
  }

  function randomInt(max) {
    if (!window.crypto || typeof window.crypto.getRandomValues !== 'function') {
      throw new Error('Web Crypto is not available in this browser');
    }
    if (!Number.isInteger(max) || max <= 0 || max > 4294967296) {
      throw new Error('Invalid random range');
    }

    var buffer = new Uint32Array(1);
    var limit = Math.floor(4294967296 / max) * max;
    do {
      window.crypto.getRandomValues(buffer);
    } while (buffer[0] >= limit);
    return buffer[0] % max;
  }

  function pick(list) {
    return list[randomInt(list.length)];
  }

  function secureShuffle(list) {
    for (var i = list.length - 1; i > 0; i -= 1) {
      var j = randomInt(i + 1);
      var temporary = list[i];
      list[i] = list[j];
      list[j] = temporary;
    }
    return list;
  }

  function showToast(message) {
    if (!dom.toast) return;
    dom.toast.textContent = message;
    dom.toast.classList.add('is-visible');
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(function () {
      dom.toast.classList.remove('is-visible');
    }, 2200);
  }

  function safeStorageGet(key) {
    try {
      return window.localStorage.getItem(key);
    } catch (error) {
      return null;
    }
  }

  function safeStorageSet(key, value) {
    try {
      window.localStorage.setItem(key, value);
    } catch (error) {
      /* Keep the tool usable when storage is unavailable. */
    }
  }

  /* ======================================================================
     Preferences and username ledger
     ====================================================================== */
  function loadPreferences() {
    var raw = safeStorageGet(PREF_KEY);
    if (!raw) return;

    var saved;
    try {
      saved = JSON.parse(raw);
    } catch (error) {
      return;
    }
    if (!saved || typeof saved !== 'object') return;

    if (typeof saved.length === 'number' && Number.isFinite(saved.length)) {
      state.length = clamp(Math.round(saved.length), 8, 64);
    }

    if (saved.charsets && typeof saved.charsets === 'object') {
      CHARSET_ORDER.forEach(function (key) {
        if (typeof saved.charsets[key] === 'boolean') {
          state.charsets[key] = saved.charsets[key];
        }
      });
      var selectedCount = CHARSET_ORDER.filter(function (key) {
        return state.charsets[key];
      }).length;
      if (!selectedCount) state.charsets.lower = true;
    }

    if (typeof saved.excludeAmbiguous === 'boolean') {
      state.excludeAmbiguous = saved.excludeAmbiguous;
    }
    if (saved.style === 'random' || STYLE_ORDER.indexOf(saved.style) !== -1) {
      state.style = saved.style;
    }
    if (FORMAT_LABELS[saved.format]) {
      state.format = saved.format;
    }
    if (typeof saved.suffix === 'boolean') state.suffix = saved.suffix;
    if (typeof saved.maxLength === 'number' && Number.isFinite(saved.maxLength)) {
      state.maxLength = clamp(Math.round(saved.maxLength), MIN_USERNAME_LENGTH, MAX_USERNAME_LENGTH);
    }
    if (saved.nicknameMood === 'random' || NICKNAME_MOOD_ORDER.indexOf(saved.nicknameMood) !== -1) {
      state.nicknameMood = saved.nicknameMood;
    }
    if (NICKNAME_PATTERNS[saved.nicknamePattern]) {
      state.nicknamePattern = saved.nicknamePattern;
    }
  }

  function savePreferences() {
    safeStorageSet(PREF_KEY, JSON.stringify({
      length: state.length,
      charsets: state.charsets,
      excludeAmbiguous: state.excludeAmbiguous,
      style: state.style,
      format: state.format,
      suffix: state.suffix,
      maxLength: state.maxLength,
      nicknameMood: state.nicknameMood,
      nicknamePattern: state.nicknamePattern
    }));
  }

  function loadLedger() {
    var raw = safeStorageGet(LEDGER_KEY);
    if (!raw) return new Set();

    try {
      var saved = JSON.parse(raw);
      if (!Array.isArray(saved)) return new Set();
      return new Set(saved.filter(function (name) {
        return typeof name === 'string' && name.length > 0;
      }).slice(-500).map(function (name) {
        return name.toLowerCase();
      }));
    } catch (error) {
      return new Set();
    }
  }

  function recordUsername(name) {
    usedNames.add(name.toLowerCase());
    var names = Array.from(usedNames);
    if (names.length > 500) {
      names = names.slice(-400);
      usedNames = new Set(names);
    }
    safeStorageSet(LEDGER_KEY, JSON.stringify(names));
  }

  /* ======================================================================
     Password
     ====================================================================== */
  function activeCharsetSets() {
    return CHARSET_ORDER.filter(function (key) {
      return state.charsets[key];
    }).map(function (key) {
      var value = CHARSETS[key];
      return state.excludeAmbiguous ? value.replace(AMBIGUOUS_PATTERN, '') : value;
    }).filter(function (value) {
      return value.length > 0;
    });
  }

  function buildPassword() {
    var sets = activeCharsetSets();
    if (!sets.length) throw new Error('Select at least one character type');

    var pool = sets.join('');
    var characters = [];

    sets.forEach(function (set) {
      characters.push(set.charAt(randomInt(set.length)));
    });

    while (characters.length < state.length) {
      characters.push(pool.charAt(randomInt(pool.length)));
    }

    secureShuffle(characters);
    return {
      value: characters.join(''),
      poolSize: pool.length,
      classCount: sets.length
    };
  }

  function strengthFor(bits) {
    if (bits >= 110) return { level: 4, label: 'Very strong' };
    if (bits >= 80) return { level: 3, label: 'Strong' };
    if (bits >= 55) return { level: 2, label: 'Fair' };
    return { level: 1, label: 'Weak' };
  }

  function drawPassword(password, animate) {
    var output = dom.passwordOutput;
    output.classList.remove('is-refreshing', 'is-masked', 'is-long', 'is-xlong');

    if (!state.passwordVisible) {
      output.classList.add('is-masked');
      output.textContent = '•'.repeat(password.length);
      output.setAttribute('aria-label', 'Password hidden, ' + password.length + ' characters');
    } else {
      var fragment = document.createDocumentFragment();
      for (var i = 0; i < password.length; i += 1) {
        var character = password.charAt(i);
        var span = document.createElement('span');
        span.textContent = character;
        if (/[0-9]/.test(character)) {
          span.className = 'ch-digit';
        } else if (/[A-Z]/.test(character)) {
          span.className = 'ch-upper';
        } else if (!/[a-zA-Z]/.test(character)) {
          span.className = 'ch-symbol';
        }
        fragment.appendChild(span);
      }
      output.replaceChildren(fragment);
      /* Do not override visible content with aria-label; screen readers need the password itself. */
      output.removeAttribute('aria-label');
    }

    if (password.length > 36) {
      output.classList.add('is-xlong');
    } else if (password.length > 26) {
      output.classList.add('is-long');
    }

    if (animate) {
      void output.offsetWidth;
      output.classList.add('is-refreshing');
    }
  }

  function updateStrength(poolSize, classCount) {
    var bits = Math.round(state.length * (Math.log(poolSize) / Math.LN2));
    var info = strengthFor(bits);

    dom.strengthBadge.dataset.level = String(info.level);
    dom.strengthText.textContent = info.label + ' · ≈ ' + bits + ' bit';
    dom.strengthBadge.title = 'Estimated entropy: length × log2(pool), about ' + bits + ' bits';
    dom.strengthMeter.dataset.level = String(info.level);

    Array.prototype.forEach.call(dom.strengthMeter.children, function (bar, index) {
      bar.classList.toggle('is-on', index < info.level);
    });

    dom.passwordMeta.textContent = 'Pool ' + poolSize + ' · ' + classCount + ' sets · at least 1 each';
  }

  function syncLengthUI() {
    dom.lengthRange.value = String(state.length);
    dom.lengthValue.textContent = state.length + ' chars';

    var progress = ((state.length - 8) / (64 - 8)) * 100;
    dom.lengthRange.style.setProperty('--fill', progress.toFixed(2) + '%');

    lengthStepButtons.forEach(function (button) {
      var step = Number(button.getAttribute('data-length-step'));
      button.disabled = (step < 0 && state.length <= 8) || (step > 0 && state.length >= 64);
    });
  }

  function syncCharsetUI() {
    charsetInputs.forEach(function (input) {
      var key = input.getAttribute('data-charset');
      var selected = !!state.charsets[key];
      input.checked = selected;
      var option = input.closest('.char-option');
      if (option) option.classList.toggle('is-on', selected);
    });

    var count = CHARSET_ORDER.filter(function (key) {
      return state.charsets[key];
    }).length;
    dom.charsetCount.textContent = count + ' / ' + CHARSET_ORDER.length;
  }

  function syncVisibilityButton() {
    dom.togglePassword.classList.toggle('is-hidden', !state.passwordVisible);
    var action = state.passwordVisible ? 'Hide password' : 'Show password';
    dom.togglePassword.setAttribute('aria-label', action);
    dom.togglePassword.title = action;
  }

  function syncPasswordControls() {
    syncLengthUI();
    syncCharsetUI();
    dom.excludeAmbiguous.checked = state.excludeAmbiguous;
    syncVisibilityButton();
  }

  function generatePassword(animate) {
    try {
      var result = buildPassword();
      currentPassword = result.value;
      drawPassword(result.value, !!animate);
      updateStrength(result.poolSize, result.classCount);
      dom.passwordLive.textContent = 'Generated a ' + state.length + '-character password';
    } catch (error) {
      dom.passwordOutput.textContent = 'Generation failed';
      dom.passwordOutput.setAttribute('aria-label', 'Password generation failed');
      dom.passwordLive.textContent = error.message || 'Password generation failed';
      showToast(error.message || 'Password generation failed');
    }
  }

  /* ======================================================================
     Username
     ====================================================================== */
  function baseSeparatorLength(format) {
    return format === 'snake' || format === 'kebab' ? 1 : 0;
  }

  function bestSuffixForPair(pair, format) {
    var baseLength = pair.prefix.w.length + pair.noun.w.length;
    var separator = baseSeparatorLength(format);

    if (!state.suffix) {
      var plainTotal = baseLength + separator;
      return plainTotal <= state.maxLength
        ? { syllableCount: 0, totalLength: plainTotal }
        : null;
    }

    for (var count = 3; count >= 1; count -= 1) {
      var total = baseLength + (separator * 2) + count * 2;
      if (total <= state.maxLength) {
        return { syllableCount: count, totalLength: total };
      }
    }
    return null;
  }

  function pairsForStyle(styleKey) {
    var style = USER_STYLES[styleKey];
    var pairs = [];
    if (!style) return pairs;

    style.prefixes.forEach(function (prefix) {
      style.nouns.forEach(function (noun) {
        pairs.push({ prefix: prefix, noun: noun });
      });
    });
    return pairs;
  }

  function makeSuffix(syllableCount) {
    var count = clamp(syllableCount || 3, 1, 3);
    for (var attempt = 0; attempt < 100; attempt += 1) {
      var syllables = [];
      for (var index = 0; index < count; index += 1) {
        syllables.push(pick(ONSETS) + pick(VOWELS));
      }

      var repeated = false;
      for (var position = 1; position < syllables.length; position += 1) {
        if (syllables[position] === syllables[position - 1]) repeated = true;
      }
      if (repeated) continue;

      var text = syllables.join('');
      var banned = BANNED_PARTS.some(function (part) {
        return text.indexOf(part) !== -1;
      });
      if (!banned) {
        return { text: text, syllables: syllables };
      }
    }

    var fallback = ['ka', 'vo', 'mi'].slice(0, count);
    return { text: fallback.join(''), syllables: fallback };
  }

  function composeName(pair, suffix, format) {
    var first = pair.prefix.w;
    var second = pair.noun.w;
    var suffixText = suffix ? suffix.text : '';

    if (format === 'camel') {
      var camelBase = first + second;
      var camelSuffix = suffixText ? capitalize(suffixText) : '';
      return {
        baseText: camelBase,
        suffixText: camelSuffix,
        full: camelBase + camelSuffix
      };
    }

    if (format === 'lower') {
      var lowerBase = (first + second).toLowerCase();
      return {
        baseText: lowerBase,
        suffixText: suffixText,
        full: lowerBase + suffixText
      };
    }

    var separator = format === 'snake' ? '_' : '-';
    var joinedBase = (first + separator + second).toLowerCase();
    var joinedSuffix = suffixText ? separator + suffixText : '';
    return {
      baseText: joinedBase,
      suffixText: joinedSuffix,
      full: joinedBase + joinedSuffix
    };
  }

  function materializeUsername(styleKey, candidate, format) {
    var suffix = state.suffix ? makeSuffix(candidate.syllableCount) : null;
    var composed = composeName(candidate.pair, suffix, format);

    if (usedNames.has(composed.full.toLowerCase())) return null;

    return {
      styleKey: styleKey,
      style: USER_STYLES[styleKey],
      prefix: candidate.pair.prefix,
      noun: candidate.pair.noun,
      suffix: suffix,
      format: format,
      baseText: composed.baseText,
      suffixText: composed.suffixText,
      full: composed.full
    };
  }

  function selectUsernameCandidate(styleKey, candidates, format) {
    var longest = Math.max.apply(null, candidates.map(function (candidate) {
      return candidate.totalLength;
    }));
    var preferred = candidates.filter(function (candidate) {
      return candidate.totalLength === longest;
    });

    for (var attempt = 0; attempt < 120; attempt += 1) {
      var result = materializeUsername(styleKey, pick(preferred), format);
      if (result) return result;
    }

    var shorter = candidates.filter(function (candidate) {
      return candidate.totalLength < longest;
    });

    for (var fallbackAttempt = 0; fallbackAttempt < 120 && shorter.length; fallbackAttempt += 1) {
      var fallbackResult = materializeUsername(styleKey, pick(shorter), format);
      if (fallbackResult) return fallbackResult;
    }

    return null;
  }

  function buildUsername() {
    var availableStyles = STYLE_ORDER.filter(function (key) {
      return pairsForStyle(key).length > 0;
    });
    if (!availableStyles.length) return null;

    var styleKey = state.style === 'random' ? pick(availableStyles) : state.style;
    var pairs = pairsForStyle(styleKey);
    var formats = state.format === 'random'
      ? secureShuffle(FORMAT_KEYS.slice())
      : [state.format];

    for (var formatIndex = 0; formatIndex < formats.length; formatIndex += 1) {
      var format = formats[formatIndex];
      var candidates = [];

      pairs.forEach(function (pair) {
        var fit = bestSuffixForPair(pair, format);
        if (fit) {
          candidates.push({
            pair: pair,
            syllableCount: fit.syllableCount,
            totalLength: fit.totalLength
          });
        }
      });

      if (!candidates.length) continue;

      var result = selectUsernameCandidate(styleKey, candidates, format);
      if (result) return result;
    }

    return null;
  }

  function drawUsername(result, animate) {
    var output = dom.usernameOutput;
    output.replaceChildren();
    output.classList.remove('is-refreshing');

    var base = document.createElement('span');
    base.textContent = result.baseText;
    output.appendChild(base);

    if (result.suffixText) {
      var suffix = document.createElement('span');
      suffix.className = 'username-suffix';
      suffix.textContent = result.suffixText;
      output.appendChild(suffix);
    }

    output.setAttribute('aria-label', 'Generated username: ' + result.full);

    var length = result.full.length;
    dom.usernameCount.classList.remove('is-over');
    dom.usernameCount.textContent = length + ' / ' + state.maxLength;
    dom.usernameCount.title = 'Maximum ' + state.maxLength + ' characters';

    dom.usernameMeaning.textContent = result.prefix.w + ' + ' + result.noun.w;
    dom.usernameStyleTag.textContent = result.style.label;
    dom.usernameStyleTag.title = result.style.hint;
    dom.formatHint.textContent = state.format === 'random'
      ? 'Any · ' + FORMAT_LABELS[result.format]
      : FORMAT_LABELS[result.format];

    if (result.suffix) {
      var syllableCount = result.suffix.syllables.length;
      dom.usernameSuffixTag.textContent = 'Pronounceable suffix';
      dom.usernameSuffixTag.classList.remove('is-off');
      dom.usernameSuffixTag.title = syllableCount + ' pronounceable syllable' +
        (syllableCount === 1 ? '' : 's') + '; local dedupe';
    } else {
      dom.usernameSuffixTag.textContent = 'No suffix';
      dom.usernameSuffixTag.classList.add('is-off');
      dom.usernameSuffixTag.title = 'Suffix is off; duplicate risk is higher';
    }

    var pronunciation = result.prefix.w + ' ' + result.noun.w;
    if (result.suffix) {
      pronunciation += ' ' + result.suffix.syllables.map(function (syllable, index) {
        return index === 0 ? capitalize(syllable) : syllable;
      }).join('-');
    }
    dom.usernamePronounce.textContent = pronunciation;

    if (animate) {
      void output.offsetWidth;
      output.classList.add('is-refreshing');
    }
  }

  function syncUsernameControls() {
    Array.prototype.forEach.call(dom.styleChips.children, function (button) {
      var style = button.getAttribute('data-style');
      button.setAttribute('aria-pressed', String(style === state.style));
    });
    Array.prototype.forEach.call(dom.formatChips.children, function (button) {
      var format = button.getAttribute('data-format');
      button.setAttribute('aria-pressed', String(format === state.format));
    });

    dom.suffixToggle.checked = state.suffix;
    dom.styleHint.textContent = STYLE_HINTS[state.style];
    dom.formatHint.textContent = FORMAT_LABELS[state.format];

    dom.usernameLengthRange.value = String(state.maxLength);
    dom.usernameLengthValue.textContent = state.maxLength + ' chars';
    var progress = ((state.maxLength - MIN_USERNAME_LENGTH) /
      (MAX_USERNAME_LENGTH - MIN_USERNAME_LENGTH)) * 100;
    dom.usernameLengthRange.style.setProperty('--fill', progress.toFixed(2) + '%');

    usernameLengthStepButtons.forEach(function (button) {
      var step = Number(button.getAttribute('data-username-length-step'));
      button.disabled =
        (step < 0 && state.maxLength <= MIN_USERNAME_LENGTH) ||
        (step > 0 && state.maxLength >= MAX_USERNAME_LENGTH);
    });
  }

  function generateUsername(animate) {
    var result = buildUsername();

    if (!result) {
      showToast('No compatible name at this maximum length. Try increasing it.');
      return;
    }

    currentUsername = result.full;
    recordUsername(result.full);
    drawUsername(result, !!animate);
    dom.usernameLive.textContent = 'Generated username ' + result.full + ', ' +
      result.style.label + ' style, ' + result.full.length + ' characters';
  }

  /* ======================================================================
     Nickname
     ====================================================================== */
  function syncNicknameControls() {
    Array.prototype.forEach.call(dom.nicknameMoodChips.children, function (button) {
      var mood = button.getAttribute('data-nickname-mood');
      button.setAttribute('aria-pressed', String(mood === state.nicknameMood));
    });
    Array.prototype.forEach.call(dom.nicknamePatternChips.children, function (button) {
      var pattern = button.getAttribute('data-nickname-pattern');
      button.setAttribute('aria-pressed', String(pattern === state.nicknamePattern));
    });

    dom.nicknameMoodHint.textContent = state.nicknameMood === 'random'
      ? 'One of five moods.'
      : NICKNAME_MOODS[state.nicknameMood].hint;
    dom.nicknamePatternHint.textContent = NICKNAME_PATTERNS[state.nicknamePattern];
  }

  function buildNickname() {
    var moodKey = state.nicknameMood === 'random'
      ? pick(NICKNAME_MOOD_ORDER)
      : state.nicknameMood;
    var mood = NICKNAME_MOODS[moodKey];
    var pattern = state.nicknamePattern;

    for (var attempt = 0; attempt < 80; attempt += 1) {
      var adjective = pick(mood.adjectives);
      var image = pick(mood.images);
      var second = pick(mood.seconds);
      if (image === second) continue;

      var words = pattern === 'pair'
        ? [capitalize(adjective), capitalize(image)]
        : [capitalize(image), pattern, capitalize(second)];
      var phrase = words.join(' ');
      if (recentNicknames.has(phrase)) continue;

      return {
        moodKey: moodKey,
        mood: mood,
        pattern: pattern,
        phrase: phrase,
        wordCount: words.length
      };
    }

    return null;
  }

  function drawNickname(result, animate) {
    dom.nicknameOutput.classList.remove('is-refreshing');
    dom.nicknameOutput.textContent = result.phrase;
    dom.nicknameWordCount.textContent = result.wordCount + (result.wordCount === 1 ? ' word' : ' words');
    dom.nicknameMoodTag.textContent = result.mood.label;
    dom.nicknameMoodTag.title = result.mood.hint;
    dom.nicknamePatternTag.textContent = NICKNAME_PATTERNS[result.pattern];
    dom.nicknameHint.textContent = result.mood.hint;

    if (animate) {
      void dom.nicknameOutput.offsetWidth;
      dom.nicknameOutput.classList.add('is-refreshing');
    }
  }

  function generateNickname(animate) {
    var result = buildNickname();
    if (!result) {
      showToast('No new nickname found. Try again.');
      return;
    }

    currentNickname = result.phrase;
    recentNicknames.add(result.phrase);
    if (recentNicknames.size > 200) {
      recentNicknames = new Set(Array.from(recentNicknames).slice(-150));
    }

    drawNickname(result, !!animate);
    dom.nicknameLive.textContent = 'Generated nickname ' + result.phrase + ', ' +
      result.mood.label + ' mood, ' + result.wordCount + ' words';
  }

  /* ======================================================================
     Copy and clipboard
     ====================================================================== */
  function fallbackCopy(text) {
    var textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.top = '0';
    textarea.style.left = '-9999px';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();

    var copied = false;
    try {
      copied = document.execCommand('copy');
    } finally {
      textarea.remove();
    }

    if (!copied) throw new Error('The browser blocked the copy operation');
  }

  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text).catch(function () {
        /* Some browsers reject Clipboard API; fall back to legacy copy. */
        fallbackCopy(text);
      });
    }
    return new Promise(function (resolve, reject) {
      try {
        fallbackCopy(text);
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }

  function flashCopied(button) {
    var label = button.querySelector('[data-copy-label]');
    if (label && !button.dataset.originalLabel) {
      button.dataset.originalLabel = label.textContent;
    }

    button.classList.add('is-copied');
    if (label) label.textContent = 'Copied';

    window.clearTimeout(button._copyTimer);
    button._copyTimer = window.setTimeout(function () {
      button.classList.remove('is-copied');
      if (label) label.textContent = button.dataset.originalLabel || 'Copy';
    }, 1600);
  }

  function copyCurrentPassword() {
    if (!currentPassword) return;
    copyText(currentPassword).then(function () {
      flashCopied(dom.copyPassword);
      showToast('Password copied to clipboard');
    }).catch(function () {
      showToast('Copy failed. Select the password manually.');
    });
  }

  function copyCurrentUsername() {
    if (!currentUsername) return;
    copyText(currentUsername).then(function () {
      flashCopied(dom.copyUsername);
      showToast('Username copied to clipboard');
    }).catch(function () {
      showToast('Copy failed. Select the username manually.');
    });
  }

  function copyCurrentNickname() {
    if (!currentNickname) return;
    copyText(currentNickname).then(function () {
      flashCopied(dom.copyNickname);
      showToast('Nickname copied to clipboard');
    }).catch(function () {
      showToast('Copy failed. Select the nickname manually.');
    });
  }

  /* Generic tab switcher. Add matching data-tab / data-panel pairs to extend. */
  function currentTabFromHash() {
    var hash = window.location.hash.replace(/^#/, '');
    var match = tabButtons.some(function (button) {
      return button.getAttribute('data-tab') === hash;
    });
    if (match) return hash;
    return tabButtons.length ? tabButtons[0].getAttribute('data-tab') : '';
  }

  function activateTab(name, options) {
    options = options || {};
    var target = null;
    tabButtons.forEach(function (button) {
      var active = button.getAttribute('data-tab') === name;
      button.setAttribute('aria-selected', String(active));
      button.tabIndex = active ? 0 : -1;
      if (active) target = button;
    });
    if (!target) return;

    tabPanels.forEach(function (panel) {
      panel.hidden = panel.getAttribute('data-panel') !== name;
    });

    if (options.focus) target.focus();

    if (options.updateHash !== false) {
      var nextHash = '#' + name;
      if (window.location.hash !== nextHash) {
        try {
          history.replaceState(null, '', nextHash);
        } catch (error) {
          window.location.hash = name;
        }
      }
    }
  }

  function bindTabs() {
    tabButtons.forEach(function (button) {
      button.addEventListener('click', function () {
        activateTab(button.getAttribute('data-tab'), { updateHash: true });
      });

      button.addEventListener('keydown', function (event) {
        var index = tabButtons.indexOf(button);
        var nextIndex = index;
        if (event.key === 'ArrowRight') nextIndex = (index + 1) % tabButtons.length;
        else if (event.key === 'ArrowLeft') nextIndex = (index - 1 + tabButtons.length) % tabButtons.length;
        else if (event.key === 'Home') nextIndex = 0;
        else if (event.key === 'End') nextIndex = tabButtons.length - 1;
        else return;

        event.preventDefault();
        var next = tabButtons[nextIndex];
        activateTab(next.getAttribute('data-tab'), { focus: true, updateHash: true });
      });
    });

    window.addEventListener('hashchange', function () {
      activateTab(currentTabFromHash(), { updateHash: false });
    });
  }

  /* ======================================================================
     Event bindings
     ====================================================================== */
  function bindEvents() {
    dom.lengthRange.addEventListener('input', function () {
      state.length = clamp(Number(dom.lengthRange.value), 8, 64);
      syncLengthUI();
      generatePassword(false);
      savePreferences();
    });

    lengthStepButtons.forEach(function (button) {
      button.addEventListener('click', function () {
        var step = Number(button.getAttribute('data-length-step'));
        state.length = clamp(state.length + step, 8, 64);
        syncLengthUI();
        generatePassword(true);
        savePreferences();
      });
    });

    charsetInputs.forEach(function (input) {
      input.addEventListener('change', function () {
        var key = input.getAttribute('data-charset');
        var next = Object.assign({}, state.charsets);
        next[key] = input.checked;

        var selected = CHARSET_ORDER.filter(function (item) {
          return next[item];
        }).length;

        if (!selected) {
          input.checked = true;
          showToast('Keep at least one character type');
          return;
        }

        state.charsets = next;
        syncCharsetUI();
        generatePassword(true);
        savePreferences();
      });
    });

    dom.excludeAmbiguous.addEventListener('change', function () {
      state.excludeAmbiguous = dom.excludeAmbiguous.checked;
      generatePassword(true);
      savePreferences();
    });

    dom.togglePassword.addEventListener('click', function () {
      if (!currentPassword) return;
      state.passwordVisible = !state.passwordVisible;
      syncVisibilityButton();
      drawPassword(currentPassword, false);
    });

    dom.copyPassword.addEventListener('click', copyCurrentPassword);
    dom.generatePassword.addEventListener('click', function () {
      generatePassword(true);
    });

    dom.styleChips.addEventListener('click', function (event) {
      var button = event.target.closest('[data-style]');
      if (!button) return;
      state.style = button.getAttribute('data-style');
      syncUsernameControls();
      generateUsername(true);
      savePreferences();
    });

    dom.formatChips.addEventListener('click', function (event) {
      var button = event.target.closest('[data-format]');
      if (!button) return;
      state.format = button.getAttribute('data-format');
      syncUsernameControls();
      generateUsername(true);
      savePreferences();
    });

    dom.usernameLengthRange.addEventListener('input', function () {
      state.maxLength = clamp(Number(dom.usernameLengthRange.value),
        MIN_USERNAME_LENGTH, MAX_USERNAME_LENGTH);
      syncUsernameControls();
      generateUsername(false);
      savePreferences();
    });

    usernameLengthStepButtons.forEach(function (button) {
      button.addEventListener('click', function () {
        var step = Number(button.getAttribute('data-username-length-step'));
        state.maxLength = clamp(state.maxLength + step,
          MIN_USERNAME_LENGTH, MAX_USERNAME_LENGTH);
        syncUsernameControls();
        generateUsername(true);
        savePreferences();
      });
    });

    dom.suffixToggle.addEventListener('change', function () {
      state.suffix = dom.suffixToggle.checked;
      generateUsername(true);
      savePreferences();
    });

    dom.copyUsername.addEventListener('click', copyCurrentUsername);
    dom.generateUsername.addEventListener('click', function () {
      generateUsername(true);
    });

    dom.nicknameMoodChips.addEventListener('click', function (event) {
      var button = event.target.closest('[data-nickname-mood]');
      if (!button) return;
      state.nicknameMood = button.getAttribute('data-nickname-mood');
      syncNicknameControls();
      generateNickname(true);
      savePreferences();
    });

    dom.nicknamePatternChips.addEventListener('click', function (event) {
      var button = event.target.closest('[data-nickname-pattern]');
      if (!button) return;
      state.nicknamePattern = button.getAttribute('data-nickname-pattern');
      syncNicknameControls();
      generateNickname(true);
      savePreferences();
    });

    dom.copyNickname.addEventListener('click', copyCurrentNickname);
    dom.generateNickname.addEventListener('click', function () {
      generateNickname(true);
    });

    bindTabs();
    activateTab(currentTabFromHash(), { updateHash: false });
  }

  /* ======================================================================
     Init
     ====================================================================== */
  function init() {
    loadPreferences();
    syncPasswordControls();
    syncUsernameControls();
    syncNicknameControls();
    bindEvents();

    generatePassword(false);
    generateUsername(false);
    generateNickname(false);
  }

  init();
})();

/* ==========================================================================
Lab height equaliser — keeps the three lab tabs the same size
========================================================================== */
(function () {
  var workspace = document.querySelector('.workspace');
  var panels = document.querySelectorAll('.tool-panel');
  if (!workspace || !panels.length) return;

  function each(fn) {
    Array.prototype.forEach.call(panels, fn);
  }

  function show(panel, fn) {
    var wasHidden = panel.hidden;
    if (wasHidden) panel.hidden = false;
    var value = fn(panel);
    if (wasHidden) panel.hidden = true;
    return value;
  }

  // Match every result stage to the tallest one first.
  function equalizeStages() {
    var max = 0;
    each(function (panel) {
      var stage = panel.querySelector('.stage');
      if (stage) stage.style.minHeight = '';
    });
    each(function (panel) {
      var stage = panel.querySelector('.stage');
      if (!stage) return;
      max = Math.max(max, show(panel, function () {
        return stage.getBoundingClientRect().height;
      }));
    });
    each(function (panel) {
      var stage = panel.querySelector('.stage');
      if (stage) stage.style.minHeight = max + 'px';
    });
  }

  function equalizePanels() {
    var max = 0;
    each(function (panel) { panel.style.minHeight = ''; });
    each(function (panel) {
      max = Math.max(max, show(panel, function () {
        return panel.scrollHeight;
      }));
    });
    each(function (panel) { panel.style.minHeight = max + 'px'; });
  }

  function equalize() {
    equalizeStages();
    equalizePanels();
  }

  window.equalizeLab = equalize;
  window.addEventListener('load', equalize);
  var raf = 0;
  window.addEventListener('resize', function () {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(equalize);
  });
})();

/* ==========================================================================
 App — header note, view switching, boot
 ========================================================================== */
(function () {
  'use strict';

  /* Header note: one line picked per load. Add lines here, nowhere else. */
  var LINES = [
  'Two shores, one quiet index.',
  'Near shore — the everyday, kept close.',
  'Far shore — worth the crossing.',
  'The workshop — quiet tools, made by hand.',
  'A small map of the places worth keeping.',
  'Links, kept like stones in a pocket.',
  'The long way round, written down.',
  'Quiet links for loud days.',
  'A shelf of doors, left unlocked.',
  'Slow roads, short list.',
  'Everything here fits in one breath.',
  'Two shores, no hurry.',
  'The tide brings back what matters.',
  'Hand-picked, lightly held.',
  'A lantern for the far side.',
  'Small tools, long evenings.',
  'A quiet crossing, twice a day.',
  'Bookmarks with salt in them.',
  'The map is small; the sea is not.',
  'Built slowly, read quickly.',
  'A harbour for useful things.',
  'Nothing here shouts.',
  'Low tide, good light, few links.',
  'Made by hand, kept by habit.',
  'The useful and the beautiful, together.',
  'A short list for a long night.',
  'Ropes, lanterns, and a few good addresses.',
  'Quiet by default.',
  'The shore you left, the shore you found.',
  'Written in the margin of the sea.',
  'A pocket atlas of small necessities.',
  'Where the useful things come to rest.',
  'No noise, just coordinates.',
  'Two shores, one lamp.',
  'Kept small on purpose.',
  'A few doors, always open.'
  ];

  var note = document.querySelector('.site-note');

  if (note && LINES.length) {
    note.textContent = LINES[Math.floor(Math.random() * LINES.length)];
  }

  /* Views: a click on the note's second word cycles through them. */
  var VIEWS = [
    { name: 'index', title: 'Two Shores · Index' },
    { name: 'os',    title: 'Two Shores · Overseas' },
    { name: 'lab',   title: 'Two Shores · Random Lab' }
  ];

  var nodes = {
    index: document.getElementById('view-index'),
    os: document.getElementById('view-os'),
    lab: document.getElementById('view-lab')
  };
  var navCss = document.getElementById('css-nav');
  var labCss = document.getElementById('css-lab');
  var current = 0;

  function show(index, remember) {
    if (index < 0) index = VIEWS.length - 1;
    if (index >= VIEWS.length) index = 0;
    current = index;

    var view = VIEWS[index];
    Object.keys(nodes).forEach(function (name) {
      if (nodes[name]) nodes[name].hidden = name !== view.name;
    });

    var lab = view.name === 'lab';
    navCss.media = lab ? 'not all' : '';
    labCss.media = lab ? '' : 'not all';

    document.title = view.title;

    if (lab && typeof window.equalizeLab === 'function') {
      window.equalizeLab();
    }

    if (remember && window.history && history.replaceState) {
      history.replaceState(null, '', '#' + view.name);
    }

    window.scrollTo(0, 0);
  }

  function indexOf(name) {
    for (var i = 0; i < VIEWS.length; i += 1) {
      if (VIEWS[i].name === name) return i;
    }
    return -1;
  }

  /* The second word of the note switches to the next view. Hit-tested with a
     text Range so the markup stays plain text: no span, no hover, no cursor. */
  function secondWordRect() {
    if (!note || !note.firstChild || note.firstChild.nodeType !== 3) return null;

    var node = note.firstChild;
    var words = /\S+/g;
    var match;
    var count = 0;

    while ((match = words.exec(node.nodeValue))) {
      count += 1;
      if (count === 2) {
        var range = document.createRange();
        range.setStart(node, match.index);
        range.setEnd(node, match.index + match[0].length);
        return range.getBoundingClientRect();
      }
    }

    return null;
  }

  if (note) {
    note.addEventListener('click', function (event) {
      var rect = secondWordRect();
      if (!rect) return;

      var pad = 2; /* forgiving for touch */
      var inside = event.clientX >= rect.left - pad && event.clientX <= rect.right + pad
        && event.clientY >= rect.top - pad && event.clientY <= rect.bottom + pad;

      if (inside) show(current + 1, true);
    });
  }

  document.querySelector('.brand').addEventListener('click', function (event) {
    event.preventDefault();
    show(0, true);
  });

  /* Render both link lists once; only the visible one is ever seen. */
  window.renderLinks(document.getElementById('app-index'), DATA_INDEX);
  window.renderLinks(document.getElementById('app-os'), DATA_OS);

  var start = indexOf((location.hash || '').replace('#', ''));
  show(start < 0 ? 0 : start, false);
})();
