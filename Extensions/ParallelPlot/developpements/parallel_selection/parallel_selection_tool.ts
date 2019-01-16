import * as p from "core/properties"
import {BoxSelectTool, BoxSelectToolView} from "models/tools/gestures/box_select_tool"
import {Rect} from "models/glyphs/rect"
import {ColumnDataSource} from "models/sources/column_data_source"
import {GlyphRenderer} from "models/renderers/glyph_renderer"
import {ColumnarDataSource, MultiLine, Scale, Selection} from "models"
import {TapEvent, MoveEvent, GestureEvent} from "core/ui_events"

export interface HasRectCDS {
    glyph: Rect
    data_source: ColumnDataSource
}

export interface HasMultiLineCDS {
    glyph: MultiLine
    data_source: ColumnDataSource
}

type SelectionMode = "add" | "resize" | "drag"

export class ParallelSelectionView extends BoxSelectToolView {
    model: ParallelSelectionTool
    private xscale: Scale
    private yscale: Scale
    private xdata: number[]
    private ydata: number[][]
    private selected: Selection
    private cds_select: ColumnDataSource
    private cds_data: ColumnDataSource
    private glyph_select: Rect
    private glyph_data: MultiLine
    private selection_mode: SelectionMode

    initialize(options: any): void {
        super.initialize(options)
        this.selection_mode = "add"
        const frame = this.plot_model.frame

        const {x_range_name: x_range_name_select, y_range_name: y_range_name_select} =
            this.model.renderer_select
        const {x_range_name: x_range_name_data, y_range_name: y_range_name_data} =
            this.model.renderer_data

        if (x_range_name_select == x_range_name_data && y_range_name_select == y_range_name_data) {
            this.xscale = frame.xscales[x_range_name_select]
            this.yscale = frame.yscales[y_range_name_select]
        }
        else {
            throw Error("selection and data does not share the same ranges")
        }

        //TODO test if parallel CDS is valid (xs for each line should be identical)
        this.glyph_select = this.model.renderer_select.glyph
        this.glyph_data = this.model.renderer_data.glyph

        this.cds_select = this.model.renderer_select.data_source
        this.cds_data = this.model.renderer_data.data_source

        const [xskey, yskey] = [(this.glyph_data as any).xs.field, (this.glyph_data as any).ys.field]
        this.xdata = this.cds_data.get_array(xskey)[0] as number[]
        this.ydata = this.cds_data.get_array(yskey)
        this.selected = this.cds_data.selected

        this.connect(this.plot_model.frame.x_ranges[this.model.renderer_select.x_range_name].change,
            () => this._resize_boxes())
    }



    get _box_width(): number {
        return this.xscale.invert(this.model.box_width) - this.xscale.invert(0)
    }

    _resize_boxes(): void {
        //resize selection boxes when zooming to keep a constant (pixel) size
        const cds = this.cds_select
        const array_width = cds.get_array((this.glyph_select as any).width.field)
        const new_width = this._box_width
        array_width.forEach((_, i) => array_width[i] = new_width)
        this._emit_cds_changes(cds)
    }

    _tap(_ev: TapEvent) {
        console.log('Tap')
    }

    _pan(ev: GestureEvent) {
        switch (this.selection_mode) {
            case "add": {
                super._pan(ev)
            }
            case "drag": {}
            case "resize": {}
        }
    }

    _move(_ev: MoveEvent) {
        //Switch mode
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

    _set_of_selected_indices(x_indices: number[], [y0, y1]: [number, number]): Set<number>[] {
        debugger
        if (x_indices.length != 0) {
            const y_axis_sel = x_indices.reduce((res: number[][], ind) => {
                res.push(this.ydata.reduce((yret: number[], y) =>
                    yret.concat(y[ind]), [])); return res
            }, [])
            return y_axis_sel.map(e =>
                new Set(e.reduce((a: number[], y, i) =>
                    (y >= y0 && y <= y1) ? a.concat(i) : a, [])))
        }
        else {
            return []
        }
    }

    _update_selection(x_indices: number[],
        [y0, y1]: [number, number]): void {

        const ind_axis_sel = this._set_of_selected_indices(x_indices, [y0, y1])
    }

    _set_selection_box(xs: number[], [y0, y1]: [number, number]): void {

        // Type once dataspecs are typed

        const y = (y0 + y1) / 2.
        const w = this._box_width
        const h = Math.min(1, y1) - Math.max(0, y0)

        const glyph_select: any = this.glyph_select
        const [xkey, ykey] = [glyph_select.x.field, glyph_select.y.field]
        const [wkey, hkey] = [glyph_select.width.field, glyph_select.height.field]

        xs.forEach(x => {
            if (xkey) this.cds_select.get_array(xkey).push(x)
            if (ykey) this.cds_select.get_array(ykey).push(y)
            if (wkey) this.cds_select.get_array(wkey).push(w)
            if (hkey) this.cds_select.get_array(hkey).push(h)
        })

        this._emit_cds_changes(this.cds_select)
    }

    _do_select([sx0, sx1]: [number, number], [sy0, sy1]: [number, number], _final: boolean = true, _append: boolean = true): void {

        // Get selection bbox in the data space
        const [x0, x1] = this.xscale.r_invert(sx0, sx1)
        const [y0, y1] = this.yscale.r_invert(sy0, sy1)

        const x_indices = this._find_x_indices([x0, x1])

        const xs = x_indices.reduce((a: number[], i) => a.concat(this.xdata[i]), [])

        // this._update_selection([x0, x1], [y0, y1])
        this._set_selection_box(xs, [y0, y1])
    }
}

export class ParallelSelectionTool extends BoxSelectTool {

    renderer_select: (GlyphRenderer & HasRectCDS)
    renderer_data: (GlyphRenderer & HasMultiLineCDS)
    box_width: number

    static initClass(): void {
        this.prototype.type = "ParallelSelectionTool"
        this.prototype.default_view = ParallelSelectionView

        this.define({
            renderer_select: [p.Any],
            renderer_data: [p.Any],
            box_width: [p.Number, 30],
        })
    }


    tool_name = "Parallel Selection"
    //override event_type property define in BoxSelectTool
    event_type: any = ["tap" as "tap", "pan" as "pan", "move" as "move"]

}

ParallelSelectionTool.initClass()