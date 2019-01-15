import * as p from "core/properties"
import {BoxSelectTool, BoxSelectToolView} from "models/tools/gestures/box_select_tool"
import {Rect} from "models/glyphs/rect"
import {ColumnDataSource} from "models/sources/column_data_source"
import {GlyphRenderer} from "models/renderers/glyph_renderer"
import {ColumnarDataSource, MultiLine, Scale} from "models"

export interface HasRectCDS {
    glyph: Rect
    data_source: ColumnDataSource
}

export interface HasMultiLineCDS {
    glyph: MultiLine
    data_source: ColumnDataSource
}

export class ParallelSelectionView extends BoxSelectToolView {
    model: ParallelSelectionTool
    xscale: Scale
    yscale: Scale
    xdata: number[]
    ydata: number[][]

    initialize(options: any): void {
        super.initialize(options)
        const frame = this.plot_model.frame
        const sel_renderer = this.model.selection_renderer
        const parallel_renderer = this.model.parallel_renderer

        if (sel_renderer.x_range_name == parallel_renderer.x_range_name &&
            sel_renderer.y_range_name == parallel_renderer.y_range_name) {
            this.xscale = frame.xscales[sel_renderer.x_range_name]
            this.yscale = frame.yscales[sel_renderer.y_range_name]
        }
        else {
            throw Error('selection and data does not share the same ranges')
        }

        //TODO test if parallel CDS is valid (xs for each line should be identical)
        const parallel_glyph: any = parallel_renderer.glyph
        const parallel_cds = parallel_renderer.data_source
        const [xskey, yskey] = [parallel_glyph.xs.field, parallel_glyph.ys.field]
        this.xdata = parallel_cds.get_array(xskey)[0] as number[]
        this.ydata = parallel_cds.get_array(yskey)
        debugger
    }

    _emit_cds_changes(cds: ColumnarDataSource, redraw: boolean = true,
        clear: boolean = true, emit: boolean = true): void {
        if (clear)
            cds.selection_manager.clear()
        if (redraw)
            cds.change.emit()
        if (emit) {
            cds.data = cds.data
            cds.properties.data.change.emit()
        }
    }

    _find_x_indices([x0, x1]: [number, number]) {
        return this.xdata.reduce((a: number[], e, i) => (e >= x0 && e <= x1) ? a.concat(i) : a, [])
    }

    _set_selection_box([sx0, sx1]: [number, number],
        [sy0, sy1]: [number, number]): void {

        // Type once dataspecs are typed
        const sel_glyph: any = this.model.selection_renderer.glyph
        const sel_cds = this.model.selection_renderer.data_source

        // Get selection bbox in the data space
        const [x0, x1] = this.xscale.r_invert(sx0, sx1)
        const [y0, y1] = this.yscale.r_invert(sy0, sy1)

        const [x, y] = [(x0 + x1) / 2., (y0 + y1) / 2.]
        const [w, h] = [x1 - x0, y1 - y0]
        const [xkey, ykey] = [sel_glyph.x.field, sel_glyph.y.field]
        const [wkey, hkey] = [sel_glyph.width.field, sel_glyph.height.field]

        if (xkey) sel_cds.get_array(xkey).push(x)
        if (ykey) sel_cds.get_array(ykey).push(y)
        if (wkey) sel_cds.get_array(wkey).push(w)
        if (hkey) sel_cds.get_array(hkey).push(h)
        this._emit_cds_changes(sel_cds)
    }

    _do_select([sx0, sx1]: [number, number], [sy0, sy1]: [number, number], _final: boolean = true, _append: boolean = true): void {
        this._set_selection_box([sx0, sx1], [sy0, sy1])
    }

}

export class ParallelSelectionTool extends BoxSelectTool {
    selection_renderer: (GlyphRenderer & HasRectCDS)
    parallel_renderer: (GlyphRenderer & HasMultiLineCDS)
    selection_width: number

    static initClass(): void {
        this.prototype.type = "ParallelSelectionTool"
        this.prototype.tool_name = "Parallel Selection"
        this.prototype.event_type = "pan" as "pan"
        this.prototype.default_view = ParallelSelectionView
        this.define({
            selection_renderer: [p.Any],
            parallel_renderer: [p.Any],
            selection_width: [p.Number, 0.2],
        })
    }
}
ParallelSelectionTool.initClass()