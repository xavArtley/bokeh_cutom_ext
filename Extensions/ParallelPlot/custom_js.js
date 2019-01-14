x0 = cb_obj.geometry.x0
x1 = cb_obj.geometry.x1
y0 = cb_obj.geometry.y0
y1 = cb_obj.geometry.y1

arr = []
for(let key in plot.x_range._mapping){
    arr.push(plot.x_range._mapping[key].value)
}
x_indices = arr.reduce((a,e,i) => (e>=x0 && e<=x1) ? a.concat(i): a, [])

if (x_indices !== 'undefined' && x_indices.length > 0){
    y_axis_sel = x_indices.reduce((res,ind) => {res.push(data_source.data.ys.reduce((yret,y) => yret.concat(y[ind]),[])); return res} , [])
    ind_axis_sel = y_axis_sel.map(e => new Set(e.reduce((a,y,i) => (y>=y0 && y<=y1) ? a.concat(i): a, [])))
    if (data_source.selected.indices.length > 0){
        new_indices = [...ind_axis_sel.reduce((a,e) => [...a].filter(x => e.has(x)), new Set(data_source.selected.indices))]
    }
    else
    {
        new_indices = [...ind_axis_sel.slice(1).reduce((a,e) => [...a].filter(x => e.has(x)), ind_axis_sel[0])]
    }
    if(new_indices.length > 0){
        //rectangle creation
        rect_data = rect_source.data
        x_indices.forEach(x => {
            rect_width = 0.2 //default
            rect_height = Math.min(1,y1) - Math.max(0,y0)

            x_rect = x + 0.5
            y_rect = Math.max(rect_height/2,y0 + rect_height/2)

            rect_data['x'].push(x_rect)
            rect_data['y'].push(y_rect)
            rect_data['width'].push(rect_width)
            rect_data['height'].push(rect_height)
        })
        rect_source.change.emit()
        data_source.selected.indices = new_indices
    }
}
