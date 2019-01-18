import numpy as np

from bokeh.io import show
from bokeh.models import ColumnDataSource
from bokeh.layouts import row

from vis3d import Vis3d


# This custom extension model will have a DOM view that should layout-able in
# Bokeh layouts, so use ``LayoutDOM`` as the base class. If you wanted to create
# a custom tool, you could inherit from ``Tool``, or from ``Glyph`` if you
# wanted to create a custom glyph, etc.


x = np.arange(0, 300, 10)
y = np.arange(0, 300, 10)
xx, yy = np.meshgrid(x, y)
xx = xx.ravel()
yy = yy.ravel()
value = np.sin(xx/50) * np.cos(yy/50) * 50 + 50

source = ColumnDataSource(data=dict(x=xx, y=yy, z=value))

scatter = Vis3d(x="x", y="y", z="z", data_source=source, width=600, height=600, style='scatter')
surface = Vis3d(x="x", y="y", z="z", data_source=source, width=600, height=600, style='surface',
                cameraPosition={'horizontal': -0.35, 'vertical': 0.22, 'distance': 32})


show(row([scatter, surface]))
