/*
Functions and types to works with convertion between hex hsl and rgb
*/

export type Rgb = {
  r: number,
  g: number,
  b: number
}

export type Hsl = {
  h: number,
  s: number,
  l: number,
}

export function hexToRgb(hex: string): Rgb {
  const hex_num = parseInt(((hex.indexOf('#') > -1) ? hex.substring(1) : hex), 16)
  return {r: hex_num >> 16, g: (hex_num & 0x00FF00) >> 8, b: (hex_num & 0x0000FF)}
}

export function hexToHsl(hex: string): Hsl {
  return rgbToHsl(hexToRgb(hex))
}

export function rgbToHsl(rgb: Rgb): Hsl {
  const hsl: Hsl = {h: 0, s: 0, l: 0}
  const min = Math.min(rgb.r, rgb.g, rgb.b)
  const max = Math.max(rgb.r, rgb.g, rgb.b)
  const delta = max - min
  hsl.l = max
  hsl.s = max != 0 ? 255 * delta / max : 0
  if (hsl.s != 0) {
      if (rgb.r == max) hsl.h = (rgb.g - rgb.b) / delta
      else if (rgb.g == max) hsl.h = 2 + (rgb.b - rgb.r) / delta
      else hsl.h = 4 + (rgb.r - rgb.g) / delta
  } else hsl.h = -1
  hsl.h *= 60
  if (hsl.h < 0) hsl.h += 360
  hsl.s *= 100 / 255
  hsl.l *= 100 / 255
  return hsl
}

export function hslToRgb(hsl: Hsl): Rgb {
  const rgb: Rgb = {
      r: 0,
      g: 0,
      b: 0,
  }
  let h = hsl.h
  const s = hsl.s * 255 / 100
  const v = hsl.l * 255 / 100
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

export function rgbToHex(rgb: Rgb) {
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
  return '#' + hex.join('')
}

export function hslToHex(hsl: Hsl): string {
  return rgbToHex(hslToRgb(hsl))
}