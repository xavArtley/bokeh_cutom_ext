import { TickFormatter } from "models/formatters/tick_formatter"

export class MyFormatter extends TickFormatter{
  type: "MyFormatter"

  // TickFormatters should implement this method, which accepts a lisst
  // of numbers (ticks) and returns a list of strings
  doFormat(ticks: string[] | number[]){
    // format the first tick as-is
    const formatted = [`${ticks[0]}`]
    for (let i = 1, len = ticks.length; i < len; i++) {
      formatted.push(`+${(Number(ticks[i])-Number(ticks[0])).toPrecision(2)}`)
    }
    return formatted 
  }
}