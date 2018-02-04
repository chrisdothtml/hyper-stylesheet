# Contributing

If you're running hyper in dev mode ([info](https://github.com/zeit/hyper/issues/2568#issuecomment-355227246)), open your development config file (`.../[hyper-repo]/.hyper.js`) and provide the absolute path to itself:

```javascript
module.exports = {
  config: {
    'hyper-stylesheet': {
      CONFIG_PATH: '/path/to/.hyper.js',
    }
  }
}
```

`hyper-stylesheet` needs to be able to modify your config file to trigger auto-reload. This step allows the plugin to use your dev config file instead of the primary one
