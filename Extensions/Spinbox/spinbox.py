from bokeh.models import InputWidget
from bokeh.core.properties import Float


class SpinBox(InputWidget):

    __implementation__ = 'spinbox.ts'
    value = Float
    low = Float
    high = Float
    step = Float
