# hyper-stylesheet

> Adds support for an external [hyper](https://hyper.is) stylesheet

![Screenshot](https://raw.githubusercontent.com/chrisdothtml/hyper-stylesheet/master/img/screenshot.png)

## Install

Either install with [hpm](https://github.com/zeit/hpm):

```bash
$ hpm install hyper-stylesheet
```

or add `hyper-stylesheet` to the `plugins` array in your `.hyper.js`

**Note**: if you want your CSS file to override all other plugins, it must be the last item in the `plugins` array

## Use

Open your `.hyper.css` file via `Hyper > Stylesheet...`. You can define the `css` and/or `termCSS` properties with the following indicators:

```css
/* #css */
.some-class {
  font-size: 20px;
}

/* #termCSS */
.some-class {
  color: #000;
}
```

`#css`/`#termCSS` are interchangeable with `#window`/`#terminal`. If no indicators are provided, the `css` property will be used

## Options

To provide options, add `hyper-stylesheet` to your `.hyper.js` config

```javascript
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

### autoReload

Type: `boolean`

Default: `true`

Upon saving `.hyper.css`, your terminal will auto-reload to show the changes

## Contributing

If you're running hyper in dev mode ([info](https://github.com/zeit/hyper/issues/2568#issuecomment-355227246)), add the following to your `.../[hyper-repo]/.hyper.js` config:

```javascript
module.exports = {
  config: {
    'hyper-stylesheet': {
      // this was `__filename` at first, but `.hyper.js` can't use that...
      CONFIG_PATH: '/absolute/path/to/this/.hyper.js',
    }
    // ...
  }
}
```

This allows the plugin to also run in dev mode

## License

[MIT](LICENSE)
