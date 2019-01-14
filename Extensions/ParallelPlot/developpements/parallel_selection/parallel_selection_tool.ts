import * as p from "core/properties"
import { BoxSelectTool, BoxSelectToolView } from "models/tools/gestures/box_select_tool"
import { Rect } from "models/glyphs/rect"
import { ColumnDataSource } from "models/sources/column_data_source"
import { GlyphRenderer } from "models/renderers/glyph_renderer"
import { GestureEvent } from "core/ui_events"


export interface HasRectCDS {
    glyph: Rect
    data_source: ColumnDataSource
}

export class ParallelSelectionView extends BoxSelectToolView {
    model: ParallelSelectionTool

    _pan_start(ev: GestureEvent): void {
        console.log("_pan_start")
        super._pan_start(ev)
    }

    _pan(ev: GestureEvent): void {
        console.log("pan")
        super._pan(ev)
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