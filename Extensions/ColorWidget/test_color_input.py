from bokeh.io import show
from color_input import ColorInput
from bokeh.models import ColumnDataSource, CustomJS
from bokeh.plotting import Figure
from bokeh.layouts import row
cds = ColumnDataSource(data=dict(x=(0, 1), y=(0, 1)))

p = Figure(x_range=(0, 1), y_range=(0, 1))
w = ColorInput(title="Line Color", color="red", width=100, height=50)
line = p.line(x='x', y='y', source=cds, color=w.color)
cb = CustomJS(args={'line': line}, code="""
line.glyph.line_color = cb_obj.color
""")
w.js_on_change('color', cb)

show(row([w, p]))
