// This file contains the JavaScript (CoffeeScript) implementation
// for a Bokeh custom extension. The "surface3d.py" contains the
// python counterpart.
//
// This custom model wraps one part of the third-party vis.js library:
//
//     http://visjs.org/index.html
//
// Making it easy to hook up python data analytics tools (NumPy, SciPy,
// Pandas, etc.) to web presentations using the Bokeh server.

// These "require" lines are similar to python "import" statements
import * as p from "core/properties"
import {LayoutDOM, LayoutDOMView} from "models/layouts/layout_dom"


const OPTIONS = {
    showPerspective: Boolean,
    showGrid: Boolean,
    keepAspectRatio: Boolean,
    verticalRatio: Number,
    legendLabel: String,
    cameraPosition: {
        horizontal: Number,
        vertical: Number,
        distance: Number,
    },
    style: String,
    width: String,
    height: String,
}

export class Vis3dView extends LayoutDOMView {
    model: Vis3d
    _graph: any


    initialize(options: any): void {
        super.initialize(options)
        // Create a new Graph3s using the vis.js API. This assumes the vis.js has
        // already been loaded (e.g. in a custom app template). In the future Bokeh
        // models will be able to specify and load external scripts automatically.
        //
        // BokehJS Views create <div> elements by default, accessible as @el. Many
        // Bokeh views ignore this default <div>, and instead do things like draw
        // to the HTML canvas. In this case though, we use the <div> to attach a
        // Graph3d to the DOM.
        const url = "https://cdnjs.cloudflare.com/ajax/libs/vis/4.16.1/vis.min.js"

        const script = document.createElement('script')
        script.src = url
        script.async = false
        script.onreadystatechange = (script.onload = () => this._init())
        document.querySelector("head").appendChild(script)
    }

    _init() {
        OPTIONS.style = this.model.style
        OPTIONS.width = String(this.model.width + 'px')
        OPTIONS.height = this.model.height + 'px'
        OPTIONS.showGrid = this.model.showGrid
        OPTIONS.keepAspectRatio = this.model.keepAspectRatio
        OPTIONS.verticalRatio = this.model.verticalRatio
        OPTIONS.legendLabel = this.model.legendLabel
        OPTIONS.showPerspective = this.model.showPerspective
        for (let key in this.model.cameraPosition) {
            OPTIONS.cameraPosition[key] = this.model.cameraPosition[key]
        }

        this._graph = new vis.Graph3d(this.el, this.get_data(), OPTIONS)

        // Set a listener so that when the Bokeh data source has a change
        // event, we can process the new data
        this.connect(this.model.data_source.change, () => {
            return this._graph.setData(this.get_data())
        })
    }

    get_data() {
        const data = new vis.DataSet()
        const source = this.model.data_source
        for (let i = 0; i < source.get_length(); i++) {
            data.add({
                x: source.get_column(this.model.x)[i],
                y: source.get_column(this.model.y)[i],
                z: source.get_column(this.model.z)[i],
            })
        }
        return data
    }

    get_height(): number {
        return this.model.height
    }
    get_width(): number {
        return this.model.width
    }
}

// We must also create a corresponding JavaScript BokehJS model subclass to
// correspond to the python Bokeh model subclass. In this case, since we want
// an element that can position itself in the DOM according to a Bokeh layout,
// we subclass from ``LayoutDOM``
export class Vis3d extends LayoutDOM {

    static initClass(): void {

        // The ``type`` class attribute should generally match exactly the name
        // of the corresponding Python class.
        this.prototype.type = "Surface3d"
        // This is usually boilerplate. In some cases there may not be a view.
        this.prototype.default_view = Vis3dView
        // The define block adds corresponding "properties" to the JS model. These
        // should basically line up 1-1 with the Python model class. Most property
        // types have counterparts, e.g. ``bokeh.core.properties.String`` will be
        // ``p.String`` in the JS implementatin. Where the JS type system is not yet
        // as rich, you can use ``p.Any`` as a "wildcard" property type.

        this.define({
            showPerspective: [p.Bool, true],
            showGrid: [p.Bool, true],
            keepAspectRatio: [p.Bool, true],
            verticalRatio: [p.Number, 1.0],
            legendLabel: [p.String, 'Stuff'],
            cameraPosition: [p.Any, {
                horizontal: -0.35,
                vertical: 0.22,
                distance: 1.8,
            }],
            x: [p.String, 'x'],
            y: [p.String, 'y'],
            z: [p.String, 'z'],
            style: [p.String, "surface"],
            data_source: [p.Instance],
        })
    }
}
Vis3d.initClass()
