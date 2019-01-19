import {Label, LabelView} from "models/annotations/label"

export class LatexLabelView extends LabelView {
  model: LatexLabel

  render() {
    let angle: number
    switch (this.model.angle_units) {
      case "rad":
        angle = -1 * this.model.angle
        break
      case "deg":
        angle = -1 * this.model.angle * Math.PI / 180.0
        break
      default:
        throw new Error("Unknowned unit")
    }
    const panel = (this.model.panel != null) ? this.model.panel : this.plot_view.frame
    const xscale = this.plot_view.frame.xscales[this.model.x_range_name]
    const yscale = this.plot_view.frame.yscales[this.model.y_range_name]

    let sx: number; let sy: number

    if (this.model.x_units == "data")
      sx = xscale.compute(this.model.x)
    else
      sx = panel.xview.compute(this.model.x)
    if (this.model.x_units == "data")
      sy = yscale.compute(this.model.y)
    else
      sy = panel.yview.compute(this.model.y)
    sx += this.model.x_offset
    sy += this.model.x_offset

    //--- End of copied section from ``Label.render`` implementation
    // Must render as superpositioned div (not on canvas) so that KaTex
    // css can properly style the text
    this._css_text(this.plot_view.canvas_view.ctx, "", sx, sy, angle)

    // ``katex`` is loaded into the global window at runtime
    // katex.renderToString returns a html ``span`` element
    return katex.render(this.model.text, this.el, {displayMode: true})
  }
}

export class LatexLabel extends Label {

  static initClass() {
    this.prototype.type = 'LatexLabel'
    this.prototype.default_view = LatexLabelView
  }
}
LatexLabel.initClass()
