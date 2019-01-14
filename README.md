# bokeh_cutom_ext

## Introduction

Repository with my `bokeh` custom extensions

It aims to provide an environment to develop `bokeh` custom extension in **Visual Code**.

I decided to use **TypeScript** for custom extension to take advantage of the `bokehjs` types library. It allows to add autocompletion through `tslint`.

## Environment setup

**Node.js** must be installed and in the **PATH**

Once the repository is cloned, install dependencies through the following commands:

```cmd
npm install -g typescript
npm install -g tslint
npm install -no-save
```

Recommended **Visual Code Plug-In**:

- `tslint` (TypeScript autocompletion)
- `python` (Python development plug-in)

Then you are ready to develop your custom extensions.

## Examples

In *Extension* directory you can find some examples of custom extensions development. Some are direct conversion of `bokeh` examples:

- [CustomTickFormatter](https://bokeh.pydata.org/en/latest/docs/user_guide/extensions_gallery/ticking.html#userguide-extensions-examples-ticking)
- More are coming

## Tips

- as mentioned in [bokeh user guide on custom extension](https://bokeh.pydata.org/en/latest/docs/user_guide/extensions.html), don't hesitated to study [bokehjs/src/lib/models](https://github.com/bokeh/bokeh/tree/1.0.4/bokehjs/src/lib/models)
- `debugger` instruction in .ts files and [Chrome DevTools](https://developers.google.com/web/tools/chrome-devtools/) can help you to debug your scripts logic
