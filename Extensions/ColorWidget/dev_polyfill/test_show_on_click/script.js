window.onload = function () {
    var hide_color_selector = function () {
        console.log("hide selector")
        var color_selector = this.getElementsByClassName("color-selector")[0]
        color_selector.style.visibility = "hidden"
        document.removeEventListener('mousedown', hide_color_selector)
        add_button_listener()
    }

    var show_color_selector = function () {
        console.log("show selector")
        var color_selector = this.getElementsByClassName("color-selector")[0]
        var button = document.getElementsByClassName("button")[0]
        button.removeEventListener("click", show_color_selector)
        color_selector.style.visibility = "visible"
        document.addEventListener('mousedown', hide_color_selector)
    }

    var stop_event_propagation = function (ev) {
        console.log('stop propagation :')
        console.log(ev)
        ev.stopPropagation()
    }

    var add_selector_listener = function(){
        var color_selector = document.getElementsByClassName("color-selector")[0]
        color_selector.addEventListener("mousedown", stop_event_propagation)
    }

    var add_button_listener = function(){
        var button = document.getElementsByClassName("button")[0]
        button.addEventListener("click", show_color_selector)
    }

    var remove_button_listener = function(){
        var button = document.getElementsByClassName("button")[0]
        button.removeEventListener("click", show_color_selector)
    }


    add_selector_listener()
    add_button_listener()
    document.addEventListener("mousedown", hide_color_selector)
}
