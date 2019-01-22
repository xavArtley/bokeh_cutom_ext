from bokeh.models import InputWidget
from bokeh.core.properties import Float
import os

dir_path = os.path.dirname(os.path.realpath(__file__))


class SpinBox(InputWidget):

    __implementation__ = 'spinbox.ts'
    value = Float
    low = Float
    high = Float
    step = Float
