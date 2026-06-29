# External Plugins

Place third-party plugin `.js` files in this directory and load them via:

```js
PluginSystem.loadFromUrl('plugins/your-plugin.js');
```

Built-in plugins live in `js/plugins/` and auto-register on load.

## Creating a Plugin

```js
PluginSystem.register('myPlugin', {
  onRegister: function () {
    console.log('My plugin loaded!');
  },
  onUnregister: function () {
    console.log('My plugin unloaded');
  }
});
```

Plugins can hook into any application event via `PluginSystem.on(event, fn)`.
