from bokeh.models import ColumnDataSource, LayoutDOM
from bokeh.core.properties import Instance, String, Bool, Float, Dict


class Vis3d(LayoutDOM):

    # The special class attribute ``__implementation__`` should contain a string
    # of JavaScript (or CoffeeScript) code that implements the JavaScript side
    # of the custom extension model.
    __implementation__ = "vis3d.ts"

    # Below are all the "properties" for this model. Bokeh properties are
    # class attributes that define the fields (and their types) that can be
    # communicated automatically between Python and the browser. Properties
    # also support type validation. More information about properties in
    # can be found here:
    #
    #    https://bokeh.pydata.org/en/latest/docs/reference/core.html#bokeh-core-properties

    # This is a Bokeh ColumnDataSource that can be updated in the Bokeh
    # server by Python code
    data_source = Instance(ColumnDataSource)
    style = String  # ['surface', 'scatter']
    # The vis.js library that we are wrapping expects data for x, y, and z.
    # The data will actually be stored in the ColumnDataSource, but these
    # properties let us specify the *name* of the column that should be
    # used for each field.
    x = String
    y = String
    z = String
    # other options
    cameraPosition = Dict(String, Float)
    showPerspective = Bool
    showGrid = Bool
    keepAspectRatio = Bool
    verticalRatio = Float
    legendLabel: String
