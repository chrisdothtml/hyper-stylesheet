# hyper-stylesheet

> Adds support for an external [hyper][hyper] stylesheet

![Screenshot][screenshot]

## Install with [hpm][hpm]

```bash
hpm install hyper-stylesheet
```

## Use

Edit your `~/.hyper.css` file via `Hyper > Stylesheet...` (creates one if it doesn't exist). You can define both the `css` and `termCSS` properties with sections.

```css
/* #window */
.tab_active {
  border: 1px solid #fff;
}

/* #terminal */
.cursor-node {
  border-color: #fff;
}
```

`#window` and `#terminal` are interchangeable with `#css` and `#termCSS`.

## Options

To set options, open `~/.hyper.js`, and add a 'hyper-stylesheet' property to `config`:

```js
module.exports = {
  config: {
    ...
    'hyper-stylesheet': {
      ...
    }
  },
  plugins: [],
  localPlugins: []
}
```

### auto-reload

Type: `boolean`

Default: `false`

Full-reloads all open hyper windows upon saving `~/.hyper.css`

[hpm]: https://github.com/zeit/hpm
[hyper]: https://hyper.is
[screenshot]: https://raw.githubusercontent.com/chrisdothtml/hyper-stylesheet/master/img/screenshot.png
