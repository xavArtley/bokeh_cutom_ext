import * as p from "core/properties"
import {empty, div} from 'core/dom'
import {Color} from 'core/types'
import { WidgetView, Widget } from "models/widgets/widget"


export class ColorPickView extends WidgetView {
    model: ColorPick

    protected colorPickerEl: HTMLDivElement
    protected hue_slider: HueSlider
    

    render(): void {
        super.render()
        empty(this.el)

        //init_html_elements
        this.colorPickerEl = div({
            class: "bk-color-picker-wg",
            id: this.model.id,
            width: this.model.width,
            height: this.model.height,
        })
        this.hue_slider = new HueSlider(25, 150)
        this.el.appendChild(this.colorPickerEl)
    }
    

}


export class HueSlider{
    hueSliderEl: HTMLDivElement
    cursor: HTMLDivElement
    value: number
    
    constructor(width: number, height: number){
      this.hueSliderEl = div({
        class: "bk-hue-sld",
        height: height,
        width: width,
      })
      this.cursor = div({class: "bk-wg-hue-arrs"})
      this.cursor.appendChild(div({class: "bk-wg-hue-larr"}))
      this.cursor.appendChild(div({class: "bk-wg-hue-rarr"}))
      this.hueSliderEl.appendChild(this.cursor)
      this._paint()
      this.cursor.addEventListener("mousedown", (ev) => this._drag_start(ev))
    }
  
    _paint() {
      const stops = ['#ff0000', '#ff0080', '#ff00ff', '#8000ff',
          '#0000ff', '#0080ff', '#00ffff', '#00ff80',
          '#00ff00', '#80ff00', '#ffff00', '#ff8000', '#ff0000']
      const stopList = stops.join(',')
      this.hueSliderEl.setAttribute('style',
          'background: -webkit-linear-gradient(top,' + stopList + ');' +
          'background: -o-linear-gradient(top,' + stopList + ');' +
          'background: -ms-linear-gradient(top,' + stopList + ');' +
          'background: -moz-linear-gradient(top,' + stopList + ');' +
          'background: linear-gradient(to bottom,' + stopList + ');')
    }
  
    _drag_start = (ev: MouseEvent) => {
      ev.preventDefault ? ev.preventDefault() : ev.returnValue = false
      this._update_cursor_position(ev.pageY)
      document.addEventListener("mouseup", this._drag_stop)
      document.addEventListener("mousemove", this._drag_move)
    }
  
    _update_cursor_position(pageY: number): void {
      // const slider_height = this.hueSliderEl.getBoundingClientRect().height
      const cursor_height = this.hueSliderEl.getBoundingClientRect().height
      // const unbound_pos = pageY - slider_height
      // const bound_pos = Math.max(Math.min(unbound_pos, slider_height), 0)
      this.hueSliderEl.style.top = Math.round(pageY - cursor_height).toString() + 'px'
    }
  
    _process_drag_move(ev: MouseEvent): void {
        this._update_cursor_position(ev.pageY)
    }
  
    _drag_move = (event: MouseEvent) => {
        this._process_drag_move(event)
    }
  
    _process_drag_stop(event: MouseEvent): void {
        console.log("drag stop :" + event)
        document.removeEventListener("mouseup", this._drag_stop)
        document.removeEventListener("mousemove", this._drag_move)
    }
  
    _drag_stop = (event: MouseEvent) => {
        this._process_drag_stop(event)
    }
  }
  

export class ColorPick extends Widget {
    color: Color

    static initClass(): void {
        this.prototype.type = "ColorPick"
        this.prototype.default_view = ColorPickView

        this.define({
            color: [p.Color, "#ff0000"], //red => h,s,l = 0, 100%, 50%
        })
    }
}

ColorPick.initClass()
