from bokeh.io import show
from bokeh.models import Slider, CustomJS
from bokeh.layouts import row

from vtk_js import VtkJs

vtkjs = VtkJs(resolution=10, width=400, height=400)
slider = Slider(value=10, start=1, end=100, step=1)
cb = CustomJS(args={'vtkjs': vtkjs}, code="""
vtkjs.resolution = cb_obj.value
""")
slider.js_on_change('value', cb)
show(row([vtkjs, slider]))
