from bokeh.models import BoxSelectTool, Renderer
from bokeh.core.properties import Instance, Float


class ParallelSelectionTool(BoxSelectTool):

    __implementation__ = 'parallel_selection_tool.ts'
    selection_renderer = Instance(Renderer)
    parallel_renderer = Instance(Renderer)
    selection_width = Float
