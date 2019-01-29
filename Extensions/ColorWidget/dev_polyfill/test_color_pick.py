import numpy as np

from bokeh.io import show
from bokeh.plotting import figure
from bokeh.models import CustomJS
from color_pick import ColorPick
from bokeh.layouts import row, widgetbox

w1 = ColorPick(color="green", width=50, height=20)
w2 = ColorPick(color="red", width=50, height=20)

p = figure(x_range=(0, 1), y_range=(0, 1))
s1 = p.scatter(x=np.linspace(0.2, 0.8, 5), y=np.linspace(0.2, 0.8, 5), color=w1.color, size=20)
s2 = p.scatter(x=np.linspace(0.2, 0.8, 5), y=np.linspace(0.8, 0.2, 5), color=w2.color, size=20)
code = """
s.glyph.fill_color = cb_obj.color
"""
w1.js_on_change('color', CustomJS(args=dict(s=s1), code=code))
w2.js_on_change('color', CustomJS(args=dict(s=s2), code=code))

show(row(widgetbox(w1, w2), p))
