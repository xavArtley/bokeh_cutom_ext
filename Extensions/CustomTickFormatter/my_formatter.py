from bokeh.models import TickFormatter
from bokeh.util.compiler import TypeScript

class MyFormatter(TickFormatter):

    __implementation__ = 'my_formatter.ts'
