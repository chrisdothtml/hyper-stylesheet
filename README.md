![Screenshot](img/screenshot.gif)

# hyper-stylesheet

> Adds support for an external [hyper](https://hyper.is) stylesheet

## Install

Add to the `plugins` array in your `.hyper.js`:

```javascript
plugins: [
  'hyper-stylesheet'
]
```

**Note**: if you want your CSS to override all other plugins, it must be the last item in the array

## Use

Open your `.hyper.css` file from the menu via `Hyper > Stylesheet...`. You can define the `css` and/or `termCSS` properties with the following indicators:

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

To provide options, add `hyper-stylesheet` to your `.hyper.js` config:

```javascript
module.exports = {
  config: {
    'hyper-stylesheet': {
      autoReload: false
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

## License

[MIT](LICENSE)
