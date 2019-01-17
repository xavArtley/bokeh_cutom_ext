import numpy as np

from bokeh.plotting import figure, show
from bokeh.models import ColumnDataSource

from parallel_selection_tool import ParallelSelectionTool

npts = 100
ndims = 10

data_source = ColumnDataSource(dict(
    xs=np.arange(ndims)[None, :].repeat(npts, axis=0).tolist(),
    ys=np.random.rand(npts, ndims).tolist(),
))

rect_source = ColumnDataSource({
    'x': [], 'y': [], 'width': [], 'height': []
})

p = figure(x_range=(-0.5, ndims-0.5), y_range=(0, 1), width=1000)
parallel_renderer = p.multi_line(xs="xs", ys="ys", source=data_source,
                                 line_color="#8073ac", line_width=1)

selection_renderer = p.rect('x', 'y', 'width', 'height', source=rect_source,
                            fill_alpha=0.3, fill_color='#009933')
selection_tool = ParallelSelectionTool(
    renderer_select=selection_renderer, renderer_data=parallel_renderer,
    box_width=10)

p.add_tools(selection_tool)
p.toolbar.active_drag = selection_tool

show(p)
