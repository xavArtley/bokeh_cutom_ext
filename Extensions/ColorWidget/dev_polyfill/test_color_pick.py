from bokeh.io import show
from color_pick import ColorPick
from bokeh.layouts import column, widgetbox

w1 = ColorPick(color="red", width=50, height=20)
w2 = ColorPick(color="red", width=50, height=20)


show(column(widgetbox(w1), widgetbox(w2)))
