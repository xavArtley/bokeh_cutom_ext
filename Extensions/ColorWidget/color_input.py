from bokeh.models import InputWidget
from bokeh.core.properties import Color
from bokeh.colors import named


class ColorInput(InputWidget):

    __implementation__ = 'color_input.ts'
    color = Color(default="#000000", help="""
    Color only named and string of type hexadecimal values are valid
    """)

    def __init__(self, **kwargs):
        if 'color' in kwargs:
            if hasattr(named, kwargs['color']):
                kwargs['color'] = getattr(named, kwargs['color']).to_hex()
        super(ColorInput, self).__init__(**kwargs)
