from bokeh.io import show
from bokeh.models import TextInput, CustomJS
from hue_bar import HueBar
from bokeh.layouts import column


s = HueBar()
t = TextInput()

cb = CustomJS(args={'t': t}, code="""
t.value = cb_obj.color
""")

s.js_on_change('color', cb)

show(column(s, t))
