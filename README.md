# hyper-stylesheet

> Adds support for an external [hyper](https://hyper.is) stylesheet

![Screenshot][screenshot]

## Install

Open your `~/.hyper.js` file, and add `hyper-stylesheet` to the `plugins` array.

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

[screenshot]: https://raw.githubusercontent.com/chrisdothtml/hyper-stylesheet/master/img/screenshot.png
