import * as p from "core/properties"
import {empty, div} from 'core/dom'
import {Widget, WidgetView} from 'models/widgets/widget'
import {Color} from 'core/types'


type RGB = {
    r: number,
    g: number,
    b: number
}

type HSB = {
    h: number,
    s: number,
    b: number,
}

function hexToRgb(hex: string): RGB {
    const hex_num = parseInt(((hex.indexOf('#') > -1) ? hex.substring(1) : hex), 16)
    return {r: hex_num >> 16, g: (hex_num & 0x00FF00) >> 8, b: (hex_num & 0x0000FF)}
}

function hexToHsb(hex: string): HSB {
    return rgbToHsb(hexToRgb(hex))
}

function rgbToHsb(rgb: RGB): HSB {
    const hsb = {h: 0, s: 0, b: 0}
    const min = Math.min(rgb.r, rgb.g, rgb.b)
    const max = Math.max(rgb.r, rgb.g, rgb.b)
    const delta = max - min
    hsb.b = max
    hsb.s = max != 0 ? 255 * delta / max : 0
    if (hsb.s != 0) {
        if (rgb.r == max) hsb.h = (rgb.g - rgb.b) / delta
        else if (rgb.g == max) hsb.h = 2 + (rgb.b - rgb.r) / delta
        else hsb.h = 4 + (rgb.r - rgb.g) / delta
    } else hsb.h = -1
    hsb.h *= 60
    if (hsb.h < 0) hsb.h += 360
    hsb.s *= 100 / 255
    hsb.b *= 100 / 255
    return hsb
}

function hsbToRgb(hsb: HSB): RGB {
    const rgb = {
        r: 0,
        g: 0,
        b: 0,
    }
    let h = hsb.h
    const s = hsb.s * 255 / 100
    const v = hsb.b * 255 / 100
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

function rgbToHex(rgb: RGB) {
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
    return hex.join('')
}

function hsbToHex(hsb: HSB): string {
    return rgbToHex(hsbToRgb(hsb))
}

export class HueBarView extends WidgetView {
    model: HueBar

    protected hueBar: HTMLDivElement
    protected hueCursor: HTMLDivElement
    protected current: number = 0
    protected bar_bbox: ClientRect
    protected cursor_bbox: ClientRect

    initialize(options: any) {
        super.initialize(options)
        this.hueBar = div({
            class: "bk-wg-hue",
        })
        this.hueCursor = div({class: "bk-wg-hue-arrs"})
        this.hueCursor.appendChild(div({class: "bk-wg-hue-larr"}))
        this.hueCursor.appendChild(div({class: "bk-wg-hue-rarr"}))
        this.hueBar.appendChild(this.hueCursor)
        this.paint_hue_bar()
        this.hueBar.addEventListener("mousedown", (ev) => this._drag_start(ev))
    }

    render(): void {
        super.render()
        empty(this.el)
        this.el.appendChild(this.hueBar)
        this.bar_bbox = this.hueBar.getBoundingClientRect()
        this.cursor_bbox = this.hueCursor.getBoundingClientRect()
    }

    paint_hue_bar() {
        const stops = ['#ff0000', '#ff0080', '#ff00ff', '#8000ff',
            '#0000ff', '#0080ff', '#00ffff', '#00ff80',
            '#00ff00', '#80ff00', '#ffff00', '#ff8000', '#ff0000']
        const stopList = stops.join(',')
        this.hueBar.setAttribute('style',
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
        const unbound_pos = pageY - this.cursor_bbox.height - 16
        const bound_pos = Math.max(Math.min(unbound_pos, this.bar_bbox.height), 0)

        this.hueCursor.style.top = Math.round(bound_pos - this.cursor_bbox.height).toString() + 'px'
        const hex = Math.floor(360 * bound_pos / this.bar_bbox.height)
        this._update_color(hsbToHex({
            h: hex,
            s: 50,
            b: 100,
        }))
        this.render()
    }

    _update_color(color: string): void {
        this.model.color = '#' + color
    }

    _pos_to_hsv(pos: number) {
        360 * pos
    }

    _process_drag_move(ev: MouseEvent): void {
        this._update_cursor_position(ev.pageY)
    }

    _drag_move = (event: MouseEvent) => {
        this._process_drag_move(event)
    }

    _process_drag_stop(event: MouseEvent): void {
        console.log("drag stop :" + event)
    }

    _drag_stop = (event: MouseEvent) => {
        this._process_drag_stop(event)
        document.removeEventListener("mouseup", this._drag_stop)
        document.removeEventListener("mousemove", this._drag_move)
    }

}


export class HueBar extends Widget {
    color: Color

    static initClass(): void {
        this.prototype.type = "HueBar"
        this.prototype.default_view = HueBarView,

            this.define({
                color: [p.Color, "#ff0000"],
            })

    }
}

HueBar.initClass()
