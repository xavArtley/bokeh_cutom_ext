import * as p from "core/properties"
import {empty, div} from 'core/dom'
import {Color} from 'core/types'
import {WidgetView, Widget} from "models/widgets/widget"


export class ColorPickView extends WidgetView {
    model: ColorPick

    protected colorPickerEl: HTMLDivElement
    protected containerSelector: HTMLDivElement
    protected hue_slider: HueSlider

    initialize(options: any) {
        super.initialize(options)
        //init_html_elements
        this.colorPickerEl = div({
            class: "bk-color-picker-wg",
            id: this.model.id,
        })
        this.colorPickerEl.style.height = this.model.height + 'px'
        this.colorPickerEl.style.width = this.model.width + 'px'
        this.containerSelector = div({
            class: "bk-color-picker-ctn",
        })
        this.containerSelector.style.top = this.model.height + 'px'
        this.containerSelector.style.visibility = "hidden"
        this.hue_slider = new HueSlider()
        this.containerSelector.appendChild(this.hue_slider.hueSliderEl)
        this.colorPickerEl.appendChild(this.containerSelector)

        this.render()
    }

    render(): void {
        super.render()
        empty(this.el)

        this.el.appendChild(this.colorPickerEl)
        this.colorPickerEl.addEventListener("click", this._show_picker)
        this.hue_slider.hueSliderEl.addEventListener("mousedown", this._stop_md_prop)
    }

    _stop_md_prop(ev: MouseEvent) {
        console.log('stop propagation :')
        console.log(ev)
        ev.stopPropagation()
    }

    _process_show_picker() {
        console.log("show picker")
        this.colorPickerEl.removeEventListener("click", this._show_picker)
        this.containerSelector.style.visibility = "visible"
        document.addEventListener('mousedown', this._hide_picker)
    }

    _process_hide_picker(ev: MouseEvent) {
        console.log("hide picker")
        ev.stopPropagation()
        ev.preventDefault()
        this.containerSelector.style.visibility = "hidden"
        document.removeEventListener('mousedown', this._hide_picker)
        this.colorPickerEl.addEventListener("click", this._show_picker)
    }

    _hide_picker = (ev: MouseEvent) => {
        this._process_hide_picker(ev)
    }

    _show_picker = () => {
        this._process_show_picker()
    }

}


export class HueSlider {
    hueSliderEl: HTMLDivElement
    cursor: HTMLDivElement
    value: number

    constructor() {
        this.hueSliderEl = div({
            class: "bk-hue-sld",
        })
        this.cursor = div({class: "bk-hue-sld-arrs"})
        this.cursor.appendChild(div({class: "bk-hue-sld-larr"}))
        this.cursor.appendChild(div({class: "bk-hue-sld-rarr"}))
        this.hueSliderEl.appendChild(this.cursor)
        this._paint()
        this.hueSliderEl.addEventListener("mousedown", (ev) => this._drag_start(ev))
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
        console.log(pageY)
        const slider_height = this.hueSliderEl.getBoundingClientRect().height
        const cursor_height = this.cursor.getBoundingClientRect().height
        const corrected_pos = pageY - this.hueSliderEl.getBoundingClientRect().top
        const bound_pos = Math.max(Math.min(corrected_pos, slider_height), 0)
        this.cursor.style.marginTop = Math.round(bound_pos - cursor_height).toString() + 'px'
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
