from bokeh.models import TickFormatter


class MyFormatter(TickFormatter):

    __implementation__ = 'my_formatter.ts'
