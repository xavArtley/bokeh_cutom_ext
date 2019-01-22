from bokeh.models import LayoutDOM
from bokeh.core.properties import Int


class VtkJs(LayoutDOM):
    __implementation__ = "vtk_js.ts"
    resolution = Int(default=10)
