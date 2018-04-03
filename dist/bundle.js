'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var crypto = _interopDefault(require('crypto'));
var fs = require('fs');
var gaze = _interopDefault(require('gaze'));
var pfs = require('pfs');
var openFile = _interopDefault(require('open'));
var path = _interopDefault(require('path'));
var os = require('os');

var hyperCssTemplate = "/* #window */\n/* CSS for the window goes here */\n\n/* #terminal */\n/* CSS for the terminal goes here */\n";

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

/*
 * separate `.hyper.css` into sections
 */
function parse (src) {
  const { css, termCSS } = getSections(src);
  const result = {};

  if (!css && !termCSS) {
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

var name = "hyper-stylesheet";

function wrapConsoleMethod (method) {
  const decoration = `[${name}]`;

  return function () {
    return console[method].apply(
      console,
      [decoration].concat(Array.from(arguments))
    )
  }
}

const error = wrapConsoleMethod('error');
const log = wrapConsoleMethod('log');
const warn = wrapConsoleMethod('warn');

function fileExists (path$$1) {
  let result;

  try {
    fs.accessSync(path$$1);
    result = true;
  } catch (e) {
    result = false;
  }

  return result
}

function md5 (input) {
  return crypto
    .createHash('md5')
    .update(input)
    .digest('hex')
}

async function updateHash (paths) {
  const { updatePath, watchPath } = paths;
  const key = `${name}-hash`;
  const fileContent = await pfs.readFile(watchPath, 'utf-8');
  const hash = md5(`${key}:${fileContent}`);
  const hashLine = `// -- ${key}:${hash} --`;
  const pattern = new RegExp(`\\/\\/ -- ${key}:[^-]+--`);
  let config = await pfs.readFile(updatePath, 'utf-8');

  if (pattern.test(config)) {
    // replace existing
    config = config.replace(pattern, hashLine);
  } else {
    // add new
    config = `${hashLine}\n${config}`;
  }

  return pfs.writeFile(updatePath, config, 'utf-8')
}

class Watcher {
  constructor () {
    this.instance = null;
    this.state = {
      isWatching: false
    };
  }

  isWatching () {
    return this.state.isWatching
  }

  start (watchPath, updatePath) {
    gaze(watchPath, (err, watcher) => {
      if (err) {
        error('file watcher error', err.message);
      } else {
        Object.assign(this.state, { isWatching: true });

        watcher.on('changed', () => {
          updateHash({ updatePath, watchPath })
            .catch(err => error('error updating .hyper.js', err.message));
        });

        watcher.on('deleted', () => {
          warn('`.hyper.css` was deleted; autoReload disabled');
          this.stop();
        });

        this.instance = watcher;
      }
    });
  }

  stop () {
    this.instance.close();
    this.instance = null;
    Object.assign(this.state, { isWatching: false });
  }
}

var watcher = new Watcher()

function createStylesheet (filepath) {
  try {
    fs.writeFileSync(filepath, hyperCssTemplate, 'utf-8');
    log(`created new stylesheet at ${filepath}`);
  } catch (err) {
    error('failed to create new stylesheet', err.message);
  }
}

class Stylesheet {
  constructor () {
    this.state = {
      autoReload: null,
      hyperCssPath: null,
      hyperJsPath: null
    };
  }

  get () {
    const { hyperCssPath } = this.state;

    if (fileExists(hyperCssPath)) {
      return parse(
        fs.readFileSync(hyperCssPath, 'utf-8')
      )
    }
  }

  open () {
    const { hyperCssPath } = this.state;

    if (!fileExists(hyperCssPath)) {
      const { autoReload, hyperJsPath } = this.state;

      createStylesheet(hyperCssPath);

      if (autoReload) {
        watcher.start(hyperCssPath, hyperJsPath);
      }
    }

    openFile(hyperCssPath);
  }

  /*
   * updates state and handle side-effects caused by a state change.
   * the only reason this is so complicated is because of autoReload
   */
  applyOptions (options) {
    let { autoReload, CONFIG_PATH } = options;
    const hyperJsPath = path.normalize(CONFIG_PATH);

    // deprecated option
    if (options['auto-reload'] !== null) {
      warn('`auto-reload` option is deprecated; use `autoReload` instead');

      if (autoReload === true && options['auto-reload'] === false) {
        autoReload = false;
      }
    }

    // hyperJsPath changed
    if (this.state.hyperJsPath !== hyperJsPath) {
      if (fileExists(hyperJsPath)) {
        const hyperCssPath = path.join(path.dirname(hyperJsPath), '.hyper.css');

        Object.assign(this.state, { hyperJsPath });

        // in case the new js path caused the css path to change
        if (this.state.hyperCssPath !== hyperCssPath) {
          Object.assign(this.state, { hyperCssPath });

          if (!fileExists(hyperCssPath)) {
            createStylesheet(hyperCssPath);
          }

          if (watcher.isWatching()) {
            watcher.stop();
          }

          if (autoReload) {
            watcher.start(hyperCssPath, hyperJsPath);
          }
        }
      } else {
        warn('`CONFIG_PATH` provided does not exist');
      }
    }

    // autoReload changed
    if (this.state.autoReload !== autoReload) {
      Object.assign(this.state, { autoReload });

      if (autoReload === false && watcher.isWatching()) {
        watcher.stop();
      } else if (!watcher.isWatching()) {
        // get fresh paths from state in case they changed above
        const { hyperCssPath, hyperJsPath } = this.state;

        watcher.start(hyperCssPath, hyperJsPath);
      }
    }
  }
}

var stylesheet = new Stylesheet()

/*
 * override default options if provided; ignore all other properties
 */
function overrideDefaults (options, defaults) {
  const result = {};

  Object.keys(defaults)
    .forEach(key => {
      result[key] = typeof options[key] === 'undefined' ? defaults[key] : options[key];
    });

  return result
}

function decorateConfig (config) {
  const options = config[name] || {};

  stylesheet.applyOptions(
    overrideDefaults(options, {
      'auto-reload': null, // deprecated
      autoReload: true,
      CONFIG_PATH: path.join(os.homedir(), '.hyper.js')
    })
  );

  const configProperties = stylesheet.get();

  if (configProperties) {
    const { css, termCSS } = configProperties;

    config = Object.assign(config, {
      css: (config.css || '') + css,
      termCSS: (config.termCSS || '') + termCSS
    });
  }

  return config
}

function decorateMenu (menus) {
  const parentMenuName = process.platform === 'win32' ? 'Edit' : 'Hyper';
  const newItem = {
    label: 'Stylesheet...',
    click: stylesheet.open.bind(stylesheet)
  };

  // break reference
  menus = Array.from(menus);

  menusLoop: // eslint-disable-line no-labels
  for (let i = 0; i < menus.length; i++) {
    const menu = menus[i];

    if (menu.label === parentMenuName) {
      const items = menu.submenu;

      for (let i = 0; i < items.length; i++) {
        const item = items[i];

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
