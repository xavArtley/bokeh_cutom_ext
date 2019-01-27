from bokeh.models import Widget
from bokeh.core.properties import Color
from bokeh.colors import named

import os
dir_path = os.path.dirname(os.path.realpath(__file__))


class HueBar(Widget):

    __css__ = os.path.join(dir_path, 'huebar.css')
    __implementation__ = 'hue_bar.ts'
    color = Color(help="""
    Color only named and string of type hexadecimal values are valid
    """)

    def __init__(self, **kwargs):
        if 'color' in kwargs:
            if hasattr(named, kwargs['color']):
                kwargs['color'] = getattr(named, kwargs['color']).to_hex()
        super(HueBar, self).__init__(**kwargs)
