# VTK JS

## Current demo

[demo](https://xavartley.github.io/bokeh/test_vtkjs.html)
Current extension is a Non dynamic visualisation where sphere is created and displayed directly from javascript (The only subtlety was to target a specific `div` for rendering)

## TODO

Create a vtk render on python side and send it through a column data source to a `VTKJS` view which can render it.

The idea is to use `vtkOBJExporter` of a `vtkRenderWindow`. It creates 2 files (`.obj` and `.mtl`) which will be zipped and then send through the column data source to the javascript view. To render it we need to refer to [vtk-js obj reader](https://kitware.github.io/vtk-js/examples/OBJReader.html)
