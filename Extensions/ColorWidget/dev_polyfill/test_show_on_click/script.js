window.onload = function () {
    var hide_color_selector = function () {
        var color_selector = this.getElementsByClassName("color-selector")[0]
        color_selector.style.visibility = "hidden"
        document.removeEventListener('mousedown', hide_color_selector)
    }

    var show_color_selector = function () {
        var color_selector = this.getElementsByClassName("color-selector")[0]
        color_selector.style.visibility = "visible"
        document.addEventListener('mousedown', hide_color_selector)
    }

    var color_selector_stop_propagation = function (ev) {
        ev.stopPropagation()
    }

    var color_selector = document.getElementsByClassName("color-selector")[0]
    color_selector.addEventListener("mousedown", color_selector_stop_propagation)

    var button = document.getElementsByClassName("button")[0];
    button.addEventListener("click", show_color_selector)
    document.addEventListener("mousedown", hide_color_selector)
}
