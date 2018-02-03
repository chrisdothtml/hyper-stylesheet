# hyper-stylesheet

> Adds support for an external [hyper](https://hyper.is) stylesheet

![Screenshot](https://raw.githubusercontent.com/chrisdothtml/hyper-stylesheet/master/img/screenshot.png)

## Install with [hpm](https://github.com/zeit/hpm)

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

To provide options, add `hyper-stylesheet` to your `.hyper.js` config

```js
module.exports = {
  config: {
    // ...
    'hyper-stylesheet': {
      // ...
    }
  },
  plugins: [
    'hyper-stylesheet'
  ]
}
```

### auto-reload

Type: `boolean`

Default: `true`

Upon saving your `.hyper.css`, hyper will auto refresh

## License

[MIT](LICENSE)
