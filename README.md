# bokeh_cutom_ext

Repository with my `bokeh` custom extensions

It aims to provide an environment to develop `bokeh` custom extension in **Visual Code**.

I decided to use **TypeScript** for custom extension to take advantage of the `bokehjs` types library. It allows to add autocompletion through `tslint`.

**Node.js** must be installed and in the **PATH**

Once the repository is cloned, install dependencies through the following commands:

```cmd
npm install -g typescript
npm install -g tslint
npm install -no-save
```

Then you are ready to develop your custom extensions.

In *Extension* directory you can find some examples of custom extensions development. Some are direct conversion of `bokeh` examples:

- [CustomTickFormatter](https://bokeh.pydata.org/en/latest/docs/user_guide/extensions_gallery/ticking.html#userguide-extensions-examples-ticking)
- More are coming
