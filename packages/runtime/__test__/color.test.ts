import {
  hasCloseColors,
  hexToRgb,
  isColorClose,
  isColorCloseToBlackWhiteOrGray
} from '../src/utils'

describe('hexToRgb', () => {
  test('3位HEX转换', () => {
    expect(hexToRgb('f00')).toEqual([255, 0, 0])
    expect(hexToRgb('0f0')).toEqual([0, 255, 0])
  })

  test('6位HEX转换', () => {
    expect(hexToRgb('ff0000')).toEqual([255, 0, 0])
    expect(hexToRgb('00ff00')).toEqual([0, 255, 0])
  })

  test('带#号前缀处理', () => {
    expect(hexToRgb('#f00')).toEqual([255, 0, 0])
    expect(hexToRgb('#ff0000')).toEqual([255, 0, 0])
  })
})

describe('isColorClose', () => {
  test('相同颜色应返回true', () => {
    expect(isColorClose('#ff0000', '#ff0000')).toBe(true)
    expect(isColorClose('#00ff00', '#00ff00', 0)).toBe(true)
  })

  test('不同颜色在阈值内应返回true', () => {
    expect(isColorClose('#ff0000', '#ff1e00', 37)).toBe(true)
    expect(isColorClose('#ff0000', '#ff1900')).toBe(true)
  })

  test('超过阈值应返回false', () => {
    expect(isColorClose('#ff0000', '#ff1f00')).toBe(false)
    expect(isColorClose('#000000', '#ffffff', 440)).toBe(false)
  })
})

describe('hasCloseColors', () => {
  test('应检测到相近颜色', () => {
    const colors = ['#ff0000', '#ff1e00', '#00ff00']
    expect(hasCloseColors(colors, 37)).toBe(true)
  })

  test('应未检测到相近颜色', () => {
    const colors = ['#ff0000', '#00ff00', '#0000ff']
    expect(hasCloseColors(colors)).toBe(false)
  })

  test('单个颜色应返回false', () => {
    expect(hasCloseColors(['#ff0000'])).toBe(false)
  })

  test('空数组应返回false', () => {
    expect(hasCloseColors([])).toBe(false)
  })
})

describe('isColorCloseToBlackWhiteOrGray', () => {
  test('应识别接近黑色', () => {
    expect(isColorCloseToBlackWhiteOrGray('#1a1a1a', 30)).toBe(true)
  })

  test('应识别接近白色', () => {
    expect(isColorCloseToBlackWhiteOrGray('#f0f0f0', 15)).toBe(true)
  })

  test('应识别中性灰色', () => {
    expect(isColorCloseToBlackWhiteOrGray('#808080')).toBe(true)
    expect(isColorCloseToBlackWhiteOrGray('#7a7b7c')).toBe(true)
  })

  test('应排除非灰系颜色', () => {
    expect(isColorCloseToBlackWhiteOrGray('#ff0000')).toBe(false)
    expect(isColorCloseToBlackWhiteOrGray('#00ff12')).toBe(false)
  })
})
