import * as p from "core/properties"
import { BoxSelectTool, BoxSelectToolView } from "models/tools/gestures/box_select_tool"
import { Rect } from "models/glyphs/rect"
import { ColumnDataSource } from "models/sources/column_data_source"
import { GlyphRenderer } from "models/renderers/glyph_renderer"
import { GestureEvent, TapEvent, MoveEvent } from "core/ui_events"
import { Scale } from "models/scales/scale"

export interface HasRectCDS {
    glyph: Rect
    data_source: ColumnDataSource
}

export class ParallelSelectionView extends BoxSelectToolView {
    model: ParallelSelectionTool

    xscale: Scale
    yscale: Scale

    initialize(options: any): void {
        super.initialize(options)
        this.xscale = this.plot_view.frame.xscales["default"]
        this.yscale = this.plot_view.frame.yscales["default"]
    }    

    _pan_start(ev: GestureEvent){
        super._pan_start(ev)
        console.log("start")
    }

    _tap(ev: TapEvent): void {        
        console.log("tap")
    }

    _doubletap(ev: TapEvent): void {
        console.log("double tap")
    }
    
    _move(ev: MoveEvent): void {
        console.log("move")
    }

    _pan_end(ev: GestureEvent): void{
        const {sx, sy} = ev
        const curpoint: [number, number] = [sx, sy]

        const [sxlim, sylim] = this._compute_limits(curpoint)
        
        console.log("pan end")
        debugger
    }

}

export class ParallelSelectionTool extends BoxSelectTool {
    selection_renderer: (GlyphRenderer & HasRectCDS)
    default_view = ParallelSelectionView

    static initClass(): void {
        this.define({
            selection_renderer: [p.Any],
        })
    }
    type = "ParallelSelectionTool"
    tool_name = "Parallel Selection"
    event_type = "pan" as "pan"
}
ParallelSelectionTool.initClass()