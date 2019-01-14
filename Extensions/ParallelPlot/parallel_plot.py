import colorcet as cc
import numpy as np
import pandas as pd

from bokeh.plotting import figure
from bokeh.models import (Range1d, ColumnDataSource, FactorRange, LinearAxis,
                          LinearColorMapper, BoxSelectTool, CustomJS, MultiLine,
                          FixedTicker, BasicTickFormatter, Rect,
                          CustomAction)
from bokeh.events import SelectionGeometry
from bokeh.io import show
import os
dir_path = os.path.dirname(os.path.realpath(__file__))


def parallel_plot(df, color=None):

    code = open(os.path.join(dir_path, 'custom_js.js')).read()

    data_source = ColumnDataSource(dict(
        xs=[df.columns.tolist()] * df.shape[0],
        ys=np.array((df-df.min())/(df.max()-df.min())).tolist(),
        color=color,
    )
    )

    cmap = LinearColorMapper(high=data_source.data['color'].min(),
                             low=data_source.data['color'].max(),
                             palette=cc.rainbow)

    x_padding_bounds = (-0.5, len(df.columns)+0.5)  # find a way to add it
    y_padding_bounds = (-0.1, 1.1)
    p = figure(x_range=FactorRange(factors=df.columns),
               width=1000, tools="pan,box_zoom")
    p.yaxis.visible = False
    p.y_range.bounds = y_padding_bounds
    p.y_range.start = 0
    p.y_range.end = 1
    p.xgrid.visible = False
    p.ygrid.visible = False

    p.add_tools(BoxSelectTool())
    tickformatter = BasicTickFormatter(precision=1)
    for col in df.columns:
        start = df[col].min()
        end = df[col].max()
        bound_min = start + abs(end-start) * (p.y_range.bounds[0] - p.y_range.start)
        bound_max = end + abs(end-start) * (p.y_range.bounds[1] - p.y_range.end)
        p.extra_y_ranges.update({col: Range1d(start=bound_min, end=bound_max, bounds=(bound_min, bound_max))})

        fixedticks = FixedTicker(
            ticks=np.linspace(start, end, 8), minor_ticks=[])

        p.add_layout(LinearAxis(fixed_location=col, y_range_name=col,
                                ticker=fixedticks, formatter=tickformatter), 'right')
    renderer = p.multi_line(xs="xs", ys="ys", source=data_source, line_color={
                            'field': 'color', 'transform': cmap}, line_width=0.3)
    selected_lines = MultiLine(line_color={'field': 'color', 'transform': cmap}, line_width=1)
    nonselected_lines = MultiLine(line_color='grey', line_width=0.1, line_alpha=0.5)

    renderer.selection_glyph = selected_lines
    renderer.nonselection_glyph = nonselected_lines
    p.y_range.start = y_padding_bounds[0]
    p.y_range.end = y_padding_bounds[1]

    rect_source = ColumnDataSource(data=dict(x=[], y=[], width=[], height=[]))

    # add rectange selections
    rect = Rect(x='x',
                y='y',
                width='width',
                height='height',
                fill_alpha=0.3,
                fill_color='#009933')

    p.add_glyph(rect_source, rect, selection_glyph=rect, nonselection_glyph=rect)

    # Add Javascript callback on SelectionGeometry event
    cb = CustomJS(args={'plot': p, 'data_source': data_source,
                        'rect_source': rect_source}, code=code)
    p.js_on_event(SelectionGeometry, cb)

    # custom resets
    reset_axes = CustomAction(icon=os.path.join(dir_path, 'Reset.png'),
                              callback=CustomJS(args={'plot': p},
                                                code="""
                                                    plot.x_range.reset()
                                                    plot.y_range.reset()
                                                    for(key in plot.extra_y_ranges){
                                                        plot.extra_y_ranges[key].reset()
                                                    }
                                                """),
                              action_tooltip='Reset Axes')

    reset_selection = CustomAction(icon=os.path.join(dir_path, 'ResetSelection.png'),
                                   action_tooltip='Reset Selections',
                                   callback=CustomJS(args={'data_source': data_source, 'rect_source': rect_source},
                                                     code="""
                                                        rect_source.data = {x : [], y : [], width: [], height: []}
                                                        data_source.selected.indices = []
                                                     """))
    p.add_tools(reset_axes)
    p.add_tools(reset_selection)
    return p


df = pd.read_csv("https://raw.githubusercontent.com/bcdunbar/datasets/master/parcoords_data.csv")
p = parallel_plot(df, color=df[df.columns[0]])
show(p)
