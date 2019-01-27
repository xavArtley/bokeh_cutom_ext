import * as p from "core/properties"
import {empty, div} from 'core/dom'
import {InputWidget} from 'models/widgets/input_widget'
import {Color} from 'core/types'
import {BaseTextInputView} from 'models/widgets/text_input'


export class ColorInputView extends BaseTextInputView {
    model: ColorInput

    protected colorPickerEl: HTMLDivElement
    protected hueBar: HTMLDivElement
    protected hueCursor: HTMLDivElement
    protected hue_current: number

    render(): void {
        super.render()
        empty(this.el)

        //init_html_elements
        this.colorPickerEl = div({
            class: "bk-color-wg",
            id: this.model.id,
            style: "{z-index: 1;}",
        })

        const gradient = div({class: "bk-color-wg-gradient"})
        const inner_gradient = [div({class: "bk-color-wg-gradient-overlay-lr"}),
        div({class: "bk-color-wg-gradient-overlay-tb"}),
        div({class: "bk-color-wg-selector-outer"}),
        div({class: "bk-color-wg-selector-inner"})]
        inner_gradient.reduce((a, e) => {
            a.appendChild(e)
            return e
        }, gradient)
        this.colorPickerEl.appendChild(gradient)
        this.hueBar = div({class: "bk-color-wg-hue"})
        this.hueCursor = div({class: "bk-color-wg-hue-arrs"})
        this.hueCursor.appendChild(div({class: "bk-color-wg-hue-larr"}))
        this.hueCursor.appendChild(div({class: "bk-color-wg-hue-rarr"}))
        this.hueBar.appendChild(this.hueCursor)
        this.colorPickerEl.appendChild(this.hueBar)
        this.el.appendChild(this.colorPickerEl)

        //paint hue bar
        this.paint_hue_bar()

        //init events
        this.hueBar.addEventListener("mousedown", (event) => this.hue_start_drag(event))
    }

    pick_on_gradient(ev: MouseEvent): void {

    }

    paint_hue_bar() {
        const UA = navigator.userAgent.toLowerCase()
        const isIE = navigator.appName === 'Microsoft Internet Explorer'
        const IEver = isIE ? parseFloat(UA.match(/msie ([0-9]*[\.0-9]+)/)![1]) : 0
        const ngIE = (isIE && IEver < 10)
        const stops = ['#ff0000', '#ff0080', '#ff00ff', '#8000ff',
            '#0000ff', '#0080ff', '#00ffff', '#00ff80',
            '#00ff00', '#80ff00', '#ffff00', '#ff8000', '#ff0000']
        if (ngIE) {
            let i, div_e
            for (i = 0; i <= 11; i++) {
                div_e = div({
                    style: 'height:8.333333%; filter:progid:DXImageTransform.Microsoft.gradient(GradientType=0,startColorstr='
                        + stops[i] + ', endColorstr=' + stops[i + 1] + '); -ms-filter: '
                        + '"progid:DXImageTransform.Microsoft.gradient(GradientType=0,startColorstr='
                        + stops[i] + ', endColorstr=' + stops[i + 1] + ')";',
                })
                this.hueBar.append(div_e)
            }
        } else {
            const stopList = stops.join(',')
            this.hueBar.setAttribute('style',
                'background:-webkit-linear-gradient(top,'
                + stopList + '); background: -o-linear-gradient(top,'
                + stopList + '); background: -ms-linear-gradient(top,'
                + stopList + '); background:-moz-linear-gradient(top,'
                + stopList + '); -webkit-linear-gradient(top,'
                + stopList + '); background:linear-gradient(to bottom,'
                + stopList + '); ')
        }
    }

    hue_start_drag(ev: MouseEvent) {
        console.log('hue drag start')
        ev.preventDefault ? ev.preventDefault() : ev.returnValue = false
        this.hue_current = this.hueCursor.offsetTop
        document.addEventListener('mouseup', this.hue_drag_stop)
        document.addEventListener('mousemove', this.hue_drag_move)
    }

    hue_drag_move(ev: MouseEvent) {
        console.log('hue drag move')
    }

    hue_drag_stop() {
        console.log("hue drag stop")
        document.removeEventListener('mouseup', this.hue_drag_stop)
        document.removeEventListener('mousemove', this.hue_drag_move)
    }

    change() {
        console.log('change')
    }

}

export class ColorInput extends InputWidget {
    color: Color

    static initClass(): void {
        this.prototype.type = "ColorInput"
        this.prototype.default_view = ColorInputView

        this.define({
            color: [p.Color, "#000000"],
        })
    }
}

ColorInput.initClass()
