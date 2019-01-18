
import numpy as np

from bokeh.plotting import figure, show
from latex_label import LatexLabel


x = np.arange(0.0, 1.0 + 0.01, 0.01)
y = np.cos(2*2*np.pi*x) + 2

p = figure(title="LaTex Demonstration", plot_width=500, plot_height=500)
p.line(x, y)

# Note: must set ``render_mode="css"``
latex = LatexLabel(text="f = \sum_{n=1}^\infty\\frac{-e^{i\pi}}{2^n}!",
                   x=40, y=445, x_units='screen', y_units='screen',
                   render_mode='css', text_font_size='16pt',
                   background_fill_alpha=0)

p.add_layout(latex)

show(p)
