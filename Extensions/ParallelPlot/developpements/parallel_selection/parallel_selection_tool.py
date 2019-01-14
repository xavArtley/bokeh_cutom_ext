from bokeh.models import BoxSelectTool, Renderer
from bokeh.core.properties import Instance


class ParallelSelectionTool(BoxSelectTool):

    __implementation__ = 'parallel_selection_tool.ts'
    selection_renderer = Instance(Renderer)
