from bokeh.models import BoxSelectTool, Renderer
from bokeh.core.properties import Instance, Float


class ParallelSelectionTool(BoxSelectTool):

    __implementation__ = 'parallel_selection_tool.ts'
    renderer_select = Instance(Renderer)
    renderer_data = Instance(Renderer)
    box_width = Float
