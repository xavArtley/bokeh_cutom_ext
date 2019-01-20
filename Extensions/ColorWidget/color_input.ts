import {logger} from "core/logging"
import * as p from "core/properties"
import {empty, label, input} from 'core/dom'
import {InputWidget} from 'models/widgets/input_widget'
import {Color} from 'core/types'
import {BaseTextInputView} from 'models/widgets/text_input'


export class ColorInputView extends BaseTextInputView {
    model: ColorInput

    protected inputEl: HTMLInputElement

    render(): void {
        super.render()

        empty(this.el)

        const labelEl = label({for: this.model.id}, this.model.title)
        this.el.appendChild(labelEl)

        this.inputEl = input({
            class: "bk-widget-form-input",
            id: this.model.id,
            name: this.model.name,
            value: this.model.color,
            disabled: this.model.disabled,
            type: "color",
        })

        this.inputEl.append(this.model.color)
        this.inputEl.addEventListener("change", () => this.change_input())
        this.el.appendChild(this.inputEl)

        if (this.model.width)
            this.inputEl.style.width = `${this.model.width - 35}px`

        // TODO - This 35 is a hack we should be able to compute it
        if (this.model.height)
            this.inputEl.style.height = `${this.model.height - 35}px`
    }

    change_input(): void {
        const color = this.inputEl.value
        logger.debug(`widget/text_input: value = ${color}`)
        this.model.color = color
        super.change_input()
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
