import * as p from "core/properties"
import {empty, div, span} from 'core/dom'
import {Color} from 'core/types'
import {WidgetView, Widget} from "models/widgets/widget"
import {Signalable} from "core/signaling"


function isDescendant(parent: HTMLElement, child: EventTarget | null) {
    if (child == null) {
        return false
    }
    else {
        let node = child.parentNode
        while (node != null) {
            if (node == parent) {
                return true
            }
            node = node.parentNode
        }
        return false
    }
}

export class ColorPickView extends WidgetView {
    model: ColorPick

    protected colorPickerEl: HTMLDivElement
    protected containerSelectorEl: HTMLDivElement
    protected colorSpanEl: HTMLSpanElement
    protected gradientPanelView: GradientPanelView
    protected hueSliderView: HueSliderView

    initialize(options: any) {
        super.initialize(options)
        //init_html_elements
        this.colorPickerEl = div({
            class: "bk-widget-form-input bk-color-picker-wg",
            id: this.model.id,
        })
        this.colorSpanEl = span()
        this.colorPickerEl.appendChild(this.colorSpanEl)
        this.colorPickerEl.style.height = this.model.height + 'px'
        this.colorPickerEl.style.width = this.model.width + 'px'
        this.containerSelectorEl = div({
            class: "bk-color-picker-ctn",
        })
        this.gradientPanelView = new GradientPanelView()
        this.hueSliderView = new HueSliderView()
        this.containerSelectorEl.appendChild(this.gradientPanelView.gradienPanelEl)
        this.containerSelectorEl.appendChild(div({style: "width:7px"}))
        this.containerSelectorEl.appendChild(this.hueSliderView.hueSliderEl)
        this.model.color = hslToHex(hexToHsl(this.model.color))
        //show the picker on button click
        this.colorPickerEl.addEventListener("click", () => this._show_picker())
        //hide the picker
        document.addEventListener("mousedown", (ev) => this._hide_picker(ev))
        
        //events on models change
        this.connect(this.hueSliderView.model.change, () => {
            this.gradientPanelView.model.hue = this.hueSliderView.model.hue
        })
        this.connect(this.gradientPanelView.model.change, () => {
            this.model.color = hslToHex({
                h: this.gradientPanelView.model.hue,
                s: this.gradientPanelView.model.saturation,
                l: this.gradientPanelView.model.lightness,
            })
        })
        this.connect(this.model.change, () => this.update_span_color())
        this.render()
    }

    render(): void {
        super.render()
        empty(this.el)
        this.containerSelectorEl.style.visibility = "hidden"
        this.el.appendChild(this.colorPickerEl)
        this.el.appendChild(this.containerSelectorEl)
        this.update_span_color()
    }

    update_span_color() {
        this.colorSpanEl.style.backgroundColor = this.model.color
    }

    _hide_picker(ev: MouseEvent) {
        if (this.containerSelectorEl.style.visibility == "visible" &&
            !isDescendant(this.containerSelectorEl, ev.target) &&
            this.containerSelectorEl != ev.target) {
            this.containerSelectorEl.style.visibility = "hidden"
        }
    }

    _show_picker() {
        this.containerSelectorEl.style.visibility = "visible"
        //init values of models based on the current colorPicker color
        const {h, s, l} = hexToHsl(this.model.color)
        this.gradientPanelView.model.setv({saturation: s, lightness: l})
        this.hueSliderView.model.setv({hue: h})
    }

}

export class ColorPick extends Widget {
    color: Color

    static initClass(): void {
        this.prototype.type = "ColorPick"
        this.prototype.default_view = ColorPickView

        this.define({
            color: [p.Color, "#ff0000"], //red => h,s,l = 0, 100%, 100%
        })
    }
}
ColorPick.initClass()


class GradientPanelView extends Signalable(){
    gradienPanelEl: HTMLDivElement
    cursorEl: HTMLDivElement
    model: GradienPanel

    constructor() {
        super()
        this.gradienPanelEl = div({ class: "bk-gradient-pnl"})
        const overlay_1 = div({class: "bk-gradient-pnl-overlay-1"})
        const overlay_2 = div({class: "bk-gradient-pnl-overlay-2"})
        overlay_1.appendChild(overlay_2)
        this.cursorEl = div({class: "bk-gradient-pnl-cursor-outer"})
        this.cursorEl.appendChild(div({class: "bk-gradient-pnl-cursor-inner"}))
        overlay_2.appendChild(this.cursorEl)
        this.gradienPanelEl.appendChild(overlay_1)
        this.model = new GradienPanel()
        this.gradienPanelEl.addEventListener("mousedown", (ev) => this._drag_start(ev))
        this.connect(this.model.properties.hue.change, () => this._update_background())
        this.connect(this.model.properties.saturation.change, () => this._update_pos_x())
        this.connect(this.model.properties.lightness.change, () => this._update_pos_y())
    }

    _update_cursor_position(pageX: number, pageY: number): void {
        const {
            left: pn_left,
            top: pn_top,
        } = this.gradienPanelEl.getBoundingClientRect()
        const pos_x = pageX - pn_left
        const pos_y = pageY - pn_top
        this._set_pos_x(pos_x)
        this._set_pos_y(pos_y)
    }

    _update_background() {
        this._hue_to_background(this.model.hue)
    }

    _update_pos_x() {
        this._set_pos_x(this._sat_to_pos_x(this.model.saturation))
    }

    _update_pos_y() {
        this._set_pos_y(this._light_to_pos_y(this.model.lightness))
    }

    _set_pos_x(pos_x: number) {
        const cursor_diameter = this.cursorEl.getBoundingClientRect().width
        const {width: pn_width} = this.gradienPanelEl.getBoundingClientRect()
        const bound_pos_x = Math.max(Math.min(pos_x, pn_width-1), 1)
        const cursor_margin_left = Math.round(bound_pos_x - cursor_diameter / 2 - 1).toString() + 'px'
        this.cursorEl.style.marginLeft = cursor_margin_left
        this.model.saturation = 100 * bound_pos_x / pn_width
    }

    _set_pos_y(pos_y: number) {
        const cursor_diameter = this.cursorEl.getBoundingClientRect().height
        const {height: pn_height} = this.gradienPanelEl.getBoundingClientRect()
        const bound_pos_y = Math.max(Math.min(pos_y, pn_height-1), 1)
        const cursor_margin_top = Math.round(bound_pos_y - cursor_diameter / 2 - 1).toString() + 'px'
        this.cursorEl.style.marginTop = cursor_margin_top
        this.model.lightness = 100 * (pn_height - bound_pos_y) / pn_height
    }

    _hue_to_background(hue: number) {
        this.gradienPanelEl.style.backgroundColor = hslToHex({
            h: hue,
            s: 100,
            l: 100,
        })
    }

    _sat_to_pos_x(s: number): number {
        const {width: pn_width} = this.gradienPanelEl.getBoundingClientRect()
        return s * pn_width / 100
    }

    _light_to_pos_y(l: number): number {
        const {height: pn_height} = this.gradienPanelEl.getBoundingClientRect()
        return pn_height - l * pn_height / 100
    }

    _drag_start = (ev: MouseEvent) => {
        ev.preventDefault ? ev.preventDefault() : ev.returnValue = false
        this._update_cursor_position(ev.pageX, ev.pageY)
        document.addEventListener("mouseup", this._drag_stop)
        document.addEventListener("mousemove", this._drag_move)
    }

    _process_drag_move(ev: MouseEvent): void {
        this._update_cursor_position(ev.pageX, ev.pageY)
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

namespace GradienPanel {
    export interface Attrs extends Widget.Attrs {
        hue: number
        saturation: number
        lightness: number
    }

    export interface Props extends Widget.Props {
        hue: p.Property<number>
        saturation: p.Property<number>
        lightness: p.Property<number>
    }
}
  
interface GradienPanel extends GradienPanel.Attrs {}

class GradienPanel extends Widget {

    properties: GradienPanel.Props

    constructor(attrs?: Partial<GradienPanel.Attrs>) {
        super(attrs)
    }

    static initClass(): void {
        this.prototype.type = "GradienPanel"
    
        this.define({
            hue: [p.Number, 0],
            saturation: [p.Number, 100],
            lightness: [p.Number, 100],
        })
    }
}
GradienPanel.initClass()

class HueSliderView extends Signalable(){
    hueSliderEl: HTMLDivElement
    protected cursorEl: {
        left: HTMLDivElement,
        right: HTMLDivElement,
    }
    protected bar: HTMLDivElement
    model: HueSlider

    constructor() {
        super()
        this.hueSliderEl = div({
            class: "bk-hue-sld-ctn",
        })
        this.bar = div({class: "bk-hue-sld-bar"})
        this.cursorEl = {
            left: div({class: "bk-hue-sld-larr"}),
            right: div({class: "bk-hue-sld-rarr"}),
        }
        this.hueSliderEl.appendChild(this.cursorEl.left)
        this.hueSliderEl.appendChild(this.bar)
        this.hueSliderEl.appendChild(this.cursorEl.right)
        this.model = new HueSlider()
        this._paint()
        this.hueSliderEl.addEventListener("mousedown", (ev) => this._drag_start(ev))
        this.connect(this.model.properties.hue.change, () => this._change_hue())
    }

    _change_hue() {
        this._set_cursor_pos(this._hue_to_pos(this.model.hue))
    }

    _paint() {
        const stops = ['#ff0000', '#ff0080', '#ff00ff', '#8000ff',
            '#0000ff', '#0080ff', '#00ffff', '#00ff80',
            '#00ff00', '#80ff00', '#ffff00', '#ff8000', '#ff0000']
        const stopList = stops.join(',')
        this.bar.setAttribute('style', 'background: linear-gradient(to bottom,' + stopList + ');')
    }

    _drag_start = (ev: MouseEvent) => {
        ev.preventDefault ? ev.preventDefault() : ev.returnValue = false
        this._update_cursor_position(ev.pageY)
        document.addEventListener("mouseup", this._drag_stop)
        document.addEventListener("mousemove", this._drag_move)
    }

    _set_cursor_pos(pos: number) {
        const cursor_height = this.cursorEl.left.getBoundingClientRect().height
        const cursor_margin = Math.round(pos - cursor_height/2 + 1).toString() + 'px'
        this.cursorEl.left.style.marginTop = cursor_margin
        this.cursorEl.right.style.marginTop = cursor_margin
    }

    _update_cursor_position(pageY: number): void {
        const slider_height = this.hueSliderEl.getBoundingClientRect().height
        const corrected_pos = pageY - this.hueSliderEl.getBoundingClientRect().top
        const bound_pos = Math.max(Math.min(corrected_pos, slider_height), 0)
        this.model.hue = this._pos_to_hue(bound_pos)
    }

    _hue_to_pos(hue: number): number{
        const slider_height = this.hueSliderEl.getBoundingClientRect().height
        return slider_height - (Math.round(hue) % 360) * slider_height /359
    }

    _pos_to_hue(pos: number): number{
        const slider_height = this.hueSliderEl.getBoundingClientRect().height
        return 359*(slider_height-pos)/slider_height //[0;359]
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


namespace HueSlider {
  export interface Attrs extends Widget.Attrs {
      hue: number
  }

  export interface Props extends Widget.Props {
      hue: p.Property<number>
  }
}

interface HueSlider extends HueSlider.Attrs {}

class HueSlider extends Widget {
    hue: number

    properties: HueSlider.Props

    constructor(attrs?: Partial<HueSlider.Attrs>) {
        super(attrs)
    }
  
    static initClass(): void {
        this.prototype.type = "HueSlider"
    
        this.define({
            hue: [p.Number, 0],
        })
    }
}
HueSlider.initClass()

/***********************************
Functions and types to works with convertion between hex hsl and rgb
************************************/

export type Rgb = {
    r: number,
    g: number,
    b: number
  }
  
  export type Hsl = {
    h: number,
    s: number,
    l: number,
  }
  
  export function hexToRgb(hex: string): Rgb {
    const hex_num = parseInt(((hex.indexOf('#') > -1) ? hex.substring(1) : hex), 16)
    return {r: hex_num >> 16, g: (hex_num & 0x00FF00) >> 8, b: (hex_num & 0x0000FF)}
  }
  
  export function hexToHsl(hex: string): Hsl {
    return rgbToHsl(hexToRgb(hex))
  }
  
  export function rgbToHsl(rgb: Rgb): Hsl {
    const hsl: Hsl = {h: 0, s: 0, l: 0}
    const min = Math.min(rgb.r, rgb.g, rgb.b)
    const max = Math.max(rgb.r, rgb.g, rgb.b)
    const delta = max - min
    hsl.l = max
    hsl.s = max != 0 ? 255 * delta / max : 0
    if (hsl.s != 0) {
        if (rgb.r == max) hsl.h = (rgb.g - rgb.b) / delta
        else if (rgb.g == max) hsl.h = 2 + (rgb.b - rgb.r) / delta
        else hsl.h = 4 + (rgb.r - rgb.g) / delta
    } else hsl.h = -1
    hsl.h *= 60
    if (hsl.h < 0) hsl.h += 360
    hsl.s *= 100 / 255
    hsl.l *= 100 / 255
    return hsl
  }
  
  export function hslToRgb(hsl: Hsl): Rgb {
    const rgb: Rgb = {
        r: 0,
        g: 0,
        b: 0,
    }
    let h = hsl.h
    const s = hsl.s * 255 / 100
    const v = hsl.l * 255 / 100
    if (s == 0) {
        rgb.r = rgb.g = rgb.b = v
    } else {
        const t1 = v
        const t2 = (255 - s) * v / 255
        const t3 = (t1 - t2) * (h % 60) / 60
        if (h == 360) h = 0
        if (h < 60) {
            rgb.r = t1
            rgb.b = t2
            rgb.g = t2 + t3
        }
        else if (h < 120) {
            rgb.g = t1
            rgb.b = t2
            rgb.r = t1 - t3
        }
        else if (h < 180) {
            rgb.g = t1
            rgb.r = t2
            rgb.b = t2 + t3
        }
        else if (h < 240) {
            rgb.b = t1
            rgb.r = t2
            rgb.g = t1 - t3
        }
        else if (h < 300) {
            rgb.b = t1
            rgb.g = t2
            rgb.r = t2 + t3
        }
        else if (h < 360) {
            rgb.r = t1
            rgb.g = t2
            rgb.b = t1 - t3
        }
        else {
            rgb.r = 0
            rgb.g = 0
            rgb.b = 0
        }
    }
    return {r: Math.round(rgb.r), g: Math.round(rgb.g), b: Math.round(rgb.b)}
  }
  
  export function rgbToHex(rgb: Rgb) {
    const hex = [
        rgb.r.toString(16),
        rgb.g.toString(16),
        rgb.b.toString(16),
    ]
    hex.forEach((val, idx) => {
        if (val.length == 1) {
            hex[idx] = '0' + val
        }
    })
    return '#' + hex.join('')
  }
  
  export function hslToHex(hsl: Hsl): string {
    return rgbToHex(hslToRgb(hsl))
  }