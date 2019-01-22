import * as p from "core/properties"
import {LayoutDOM, LayoutDOMView} from "models/layouts/layout_dom"
import {empty} from 'core/dom'

export class VtkJsView extends LayoutDOMView {
    model: VtkJs
    coneSource: any
    renderWindow: any

    initialize(options: any): void {
        super.initialize(options)
        const url = "https://unpkg.com/vtk.js@8.3.3/dist/vtk.js"

        const script = document.createElement('script')
        script.src = url
        script.async = false
        script.onreadystatechange = (script.onload = () => this._init())
        document.querySelector("head")!.appendChild(script)
    }

    _init() {
        super.render()
        empty(this.el)

        //Select div for rendering
        const vtkRenderScreen = vtk.Rendering.Misc.vtkFullScreenRenderWindow.newInstance({
            container: this.el,
            background: [0., 0., 0.],
        })
        debugger
        this.coneSource = vtk.Filters.Sources.vtkConeSource.newInstance({
            height: 1.0,
            resolution: 10,
        })
        const filter = vtk.Filters.General.vtkCalculator.newInstance()
        const AttributeTypes = vtk.Common.DataModel.vtkDataSetAttributes.AttributeTypes
        const FieldDataTypes = vtk.Common.DataModel.vtkDataSet.FieldDataTypes

        filter.setInputConnection(this.coneSource.getOutputPort())
        // filter.setFormulaSimple(FieldDataTypes.CELL, [], 'random', () => Math.random());
        filter.setFormula({
            getArrays: (inputDataSets) => ({
                input: [],
                output: [
                    {
                        location: FieldDataTypes.CELL,
                        name: 'Random',
                        dataType: 'Float32Array',
                        attribute: AttributeTypes.SCALARS,
                    },
                ],
            }),
            evaluate: (arraysIn, arraysOut) => {
                const [scalars] = arraysOut.map((d) => d.getData())
                for (let i = 0; i < scalars.length; i++) {
                    scalars[i] = Math.random()
                }
            },
        })


        //Create volume to render
        const mapper = vtk.Rendering.Core.vtkMapper.newInstance()
        mapper.setInputConnection(filter.getOutputPort())

        const actor = vtk.Rendering.Core.vtkActor.newInstance()
        actor.setMapper(mapper)

        //this.cone = vtk.Filters.Sources.vtkConeSource.newInstance()
        //this.cone.resolution(this.model.resolution)
        vtkRenderScreen.getRenderer().addActor(actor)
        vtkRenderScreen.getRenderer().resetCamera()
        //Start rendering
        this.renderWindow = vtkRenderScreen.getRenderWindow()
        this._render()
        this.connect(this.model.change, () => this.update_resolution())
    }

    update_resolution() {
        this.coneSource.setResolution(this.model.resolution)
        this._render()
    }

    get_width(): number {
        throw new Error("unused")
    }

    get_height(): number {
        throw new Error("unused")
    }

    _render() {
        this.renderWindow.render()
    }
}

export class VtkJs extends LayoutDOM {
    resolution: number

    static initClass(): void {
        this.prototype.type = "VtkJs"
        this.prototype.default_view = VtkJsView

        this.define({
            resolution: [p.Number, 10],
        })

    }
}
VtkJs.initClass()
