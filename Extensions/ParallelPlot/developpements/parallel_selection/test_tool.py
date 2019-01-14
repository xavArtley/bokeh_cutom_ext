from bokeh.plotting import figure, show
from bokeh.models import ColumnDataSource
from parallel_selection_tool import ParallelSelectionTool

p = figure(x_range=(0, 10), y_range=(0, 10), width=400, height=400,
           title='Box Edit Tool')

src = ColumnDataSource({
    'x': [], 'y': [], 'width': [], 'height': []
})

renderer = p.rect('x', 'y', 'width', 'height', source=src, alpha=0.3)

selection_tool = ParallelSelectionTool(selection_renderer=renderer)
p.add_tools(selection_tool)
p.toolbar.active_drag = selection_tool

show(p)
