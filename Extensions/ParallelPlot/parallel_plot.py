import os
import colorcet as cc
import numpy as np
import pandas as pd

from bokeh.plotting import figure
from bokeh.models import (Range1d, ColumnDataSource, LinearAxis,
                          LinearColorMapper, CustomJS, MultiLine,
                          FixedTicker, BasicTickFormatter,
                          CustomAction, FuncTickFormatter)
from bokeh.io import show
from parallel_selection_tool import ParallelSelectionTool

dir_path = os.path.dirname(os.path.realpath(__file__))


def parallel_plot(df, color=None):

    npts = df.shape[0]
    ndims = len(df.columns)

    data_source = ColumnDataSource(dict(
        xs=np.arange(ndims)[None, :].repeat(npts, axis=0).tolist(),
        ys=np.array((df-df.min())/(df.max()-df.min())).tolist(),
        color=color,
    )
    )

    cmap = LinearColorMapper(high=data_source.data['color'].min(),
                             low=data_source.data['color'].max(),
                             palette=cc.rainbow)

    y_padding_bounds = (-0.1, 1.1)
    p = figure(x_range=(-1, ndims),
               y_range=(0, 1),
               width=1000,
               tools="pan, box_zoom")
    fixed_x_ticks = FixedTicker(
        ticks=np.arange(ndims), minor_ticks=[])
    formatter_x_ticks = FuncTickFormatter(
        code="return columns[index]", args={"columns": df.columns})
    p.xaxis.ticker = fixed_x_ticks
    p.xaxis.formatter = formatter_x_ticks

    p.yaxis.visible = False
    p.y_range.start = 0
    p.y_range.end = 1
    p.y_range.bounds = y_padding_bounds
    p.xgrid.visible = False
    p.ygrid.visible = False

    tickformatter = BasicTickFormatter(precision=1)
    for index, col in enumerate(df.columns):
        start = df[col].min()
        end = df[col].max()
        bound_min = start + abs(end-start) * (p.y_range.bounds[0] - p.y_range.start)
        bound_max = end + abs(end-start) * (p.y_range.bounds[1] - p.y_range.end)
        p.extra_y_ranges.update(
            {col: Range1d(start=bound_min, end=bound_max, bounds=(bound_min, bound_max))})

        fixedticks = FixedTicker(
            ticks=np.linspace(start, end, 8), minor_ticks=[])

        p.add_layout(LinearAxis(fixed_location=index, y_range_name=col,
                                ticker=fixedticks, formatter=tickformatter), 'right')
    parallel_renderer = p.multi_line(
        xs="xs", ys="ys", source=data_source, line_color='grey', line_width=0.1, line_alpha=0.5)
    selected_lines = MultiLine(line_color={'field': 'color', 'transform': cmap}, line_width=1)
    nonselected_lines = MultiLine(line_color='grey', line_width=0.1, line_alpha=0.5)

    parallel_renderer.selection_glyph = selected_lines
    parallel_renderer.nonselection_glyph = nonselected_lines
    p.y_range.start = y_padding_bounds[0]
    p.y_range.end = y_padding_bounds[1]

    rect_source = ColumnDataSource({
        'x': [], 'y': [], 'width': [], 'height': []
    })
    # add rectange selections
    selection_renderer = p.rect(x='x', y='y', width='width', height='height',
                                source=rect_source,
                                fill_alpha=0.7, fill_color='#009933')
    selection_tool = ParallelSelectionTool(
        renderer_select=selection_renderer, renderer_data=parallel_renderer,
        box_width=10)

    p.add_tools(selection_tool)
    p.toolbar.active_drag = selection_tool

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
    p.add_tools(reset_axes)
    return p


df = pd.read_csv("https://raw.githubusercontent.com/bcdunbar/datasets/master/parcoords_data.csv")
p = parallel_plot(df, color=df[df.columns[0]])
show(p)
