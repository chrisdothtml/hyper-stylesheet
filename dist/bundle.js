'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var os = _interopDefault(require('os'));
var path = _interopDefault(require('path'));
var fs = require('fs');
var crypto = _interopDefault(require('crypto'));
var gaze = _interopDefault(require('gaze'));
var open = _interopDefault(require('open'));

/**
 * Parses each section out of the provided file source
 *
 * @returns {object}
 */
function getSections (src) {
  const result = {};
  const sections = {
    css: 'window|css',
    termCSS: 'terminal|termCSS'
  };

  Object.keys(sections).forEach(key => {
    const heading = sections[key];
    const regex = new RegExp(`\\n?\\/\\* #(?:${heading}) \\*\\/\\n?([\\s\\S]*)`);
    const match = src.match(regex);

    if (match) {
      const [ full, body ] = match;
      result[key] = { body, full };
    } else {
      result[key] = false;
    }
  });

  return result
}

/**
 * Separates CSS into sections
 *
 * @returns {object}
 */
function parse (src) {
  const { css, termCSS } = getSections(src);
  const result = {};

  if (!css && !termCSS) {
    // no sections in file
    result.css = src;
    result.termCSS = '';
  } else {
    result.css = css.body || '';
    result.termCSS = termCSS.body || '';
  }

  if (css && termCSS) {
    // strip sections out of eachother
    result.css = result.css.replace(termCSS.full, '');
    result.termCSS = result.termCSS.replace(css.full, '');
  }

  return result
}

const HOME_PATH = os.homedir();

var store = {
  CONFIG_PATH: path.normalize(`${HOME_PATH}/.hyper.js`),
  fileExists: false,
  initialized: false,
  isWatching: false,
  STYLESHEET_PATH: path.normalize(`${HOME_PATH}/.hyper.css`),
  STYLESHEET_TMPL: fs.readFileSync(path.resolve(`${__dirname}/../tmpl/hyper.css`), 'utf-8')
}

var name = "hyper-stylesheet";

const { CONFIG_PATH, STYLESHEET_PATH } = store;

function md5 (input) {
  return crypto
    .createHash('md5')
    .update(input)
    .digest('hex')
}

/**
 * Updates `hyper-stylesheet-hash` in .hyper.js to trigger
 * a plugin reload
 */
function updateHash () {
  const key = `${name}-hash`;
  const stylesheet = fs.readFileSync(STYLESHEET_PATH, 'utf-8');
  const hash = md5(`${key}:${stylesheet}`);
  const hashLine = `// -- ${key}:${hash} --`;
  const regex = new RegExp(`\\/\\/ -- ${key}:[^-]+--`);
  let config = fs.readFileSync(CONFIG_PATH, 'utf-8');

  if (regex.test(config)) {
    // replace existing
    config = config.replace(regex, hashLine);
  } else {
    // add new
    config = `${hashLine}\n${config}`;
  }

  fs.writeFileSync(CONFIG_PATH, config, 'utf-8');
}

/**
 * Creates a file watcher on .hyper.css
 */
function watch () {
  gaze(STYLESHEET_PATH, (error, watch) => {
    if (error) throw error

    watch.on('deleted', () => {
      watch.close();
      store.fileExists = false;
      store.isWatching = false;
    });

    watch.on('changed', () => {
      if (store.options['auto-reload']) {
        updateHash();
      }
    });

    store.isWatching = true;
  });
}

const { STYLESHEET_PATH: STYLESHEET_PATH$1, STYLESHEET_TMPL } = store;

/**
 * Creates new .hyper.css file and initializes watcher
 */
function initFile (createNew = true) {
  try {
    fs.accessSync(STYLESHEET_PATH$1);
  } catch (error) {
    if (createNew) {
      fs.writeFileSync(STYLESHEET_PATH$1, STYLESHEET_TMPL, 'utf-8');
    }
  }

  if (!store.fileExists) {
    store.fileExists = true;
  }

  if (!store.isWatching) {
    watch();
  }
}

/**
 * Initial one-time plugin setup
 */
function initMain (config) {
  store.options = Object.assign({
    'auto-reload': true
  }, (config[name] || {}));

  initFile(false);
  store.initialized = true;
}

const { STYLESHEET_PATH: STYLESHEET_PATH$2 } = store;

/**
 * Adds .hyper.css contents to the config object
 *
 * @returns {object}
 */
// TODO: preprocessor support
function decorateConfig (config) {
  if (!store.initialized) {
    initMain(config);
  }

  if (store.fileExists) {
    const src = fs.readFileSync(STYLESHEET_PATH$2, 'utf-8');
    const parsed = parse(src);

    return Object.assign({}, config, {
      css: (config.css || '') + parsed.css,
      termCSS: (config.termCSS || '') + parsed.termCSS
    })
  }

  return config
}

/**
 * Adds button to Hyper menu for opening stylesheet
 *
 * @returns {array}
 */
function decorateMenu (menus) {
  const newItem = {
    label: 'Stylesheet...',
    click () {
      if (!store.fileExists) {
        initFile();
      }

      open(STYLESHEET_PATH$2);
    }
  };

  // break reference
  menus = Array.from(menus);

  menusLoop: // eslint-disable-line no-labels
  for (let i = 0; i < menus.length; i++) {
    let menu = menus[i];

    if (menu.label === 'Hyper') {
      let items = menu.submenu;

      for (let i = 0; i < items.length; i++) {
        let item = items[i];

        if (item.label === 'Preferences...') {
          items.splice(i + 1, 0, newItem);
          break menusLoop // eslint-disable-line no-labels
        }
      }
    }
  }

  return menus
}

exports.decorateConfig = decorateConfig;
exports.decorateMenu = decorateMenu;
