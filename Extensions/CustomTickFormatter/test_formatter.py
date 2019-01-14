from bokeh.io import show
from bokeh.plotting import figure
from my_formatter import MyFormatter

p = figure()
p.circle([1, 2, 3, 4, 6], [5, 7, 3, 2, 4])

p.xaxis.formatter = MyFormatter()

show(p)
