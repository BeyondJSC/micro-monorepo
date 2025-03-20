export function hexToRgb(hex: string): [number, number, number] {
  // 检查是否为有效的16进制颜色字符串
  hex = hex.replace(/^#/, '')
  // 如果长度为3，则每个字符需要重复一次以转换为6位16进制
  if (hex.length === 3) {
    hex = hex
      .split('')
      .map((x) => x + x)
      .join('')
  }
  // 将16进制字符串转换为RGB数组
  const bigint = parseInt(hex, 16)
  const r = (bigint >> 16) & 255
  const g = (bigint >> 8) & 255
  const b = bigint & 255
  return [r, g, b]
}

// 比较两个颜色是否接近
export function isColorClose(
  hex1: string,
  hex2: string,
  threshold: number = 30
): boolean {
  // 将16进制颜色转换为RGB数组
  const color1 = hexToRgb(hex1)
  const color2 = hexToRgb(hex2)

  // 计算两个颜色之间的欧几里得距离
  const distance = Math.sqrt(
    Math.pow(color1[0] - color2[0], 2) +
      Math.pow(color1[1] - color2[1], 2) +
      Math.pow(color1[2] - color2[2], 2)
  )

  // 判断距离是否小于等于阈值
  return distance <= threshold
}

// 检查颜色数组中是否存在相近的颜色
export function hasCloseColors(
  colors: string[],
  threshold: number = 30
): boolean {
  // 遍历颜色数组，检查每对颜色是否相近
  for (let i = 0; i < colors.length; i++) {
    for (let j = i + 1; j < colors.length; j++) {
      // 允许相等，但不能相近
      if (
        colors[i] !== colors[j] &&
        isColorClose(colors[i], colors[j], threshold)
      ) {
        return true // 如果找到相近颜色，返回true
      }
    }
  }
  return false // 如果没有找到相近颜色，返回false
}

// 检查颜色是否接近黑色、白色或灰色
export function isColorCloseToBlackWhiteOrGray(
  hexColor: string,
  tolerance: number = 30
): boolean {
  const rgbColor = hexToRgb(hexColor)
  const [r, g, b] = rgbColor

  // 纯黑和纯白的RGB值
  const black = [0, 0, 0]
  const white = [255, 255, 255]

  // 计算颜色与纯黑、纯白的欧几里得距离
  const distanceToBlack = Math.sqrt(
    Math.pow(r - black[0], 2) +
      Math.pow(g - black[1], 2) +
      Math.pow(b - black[2], 2)
  )
  const distanceToWhite = Math.sqrt(
    Math.pow(r - white[0], 2) +
      Math.pow(g - white[1], 2) +
      Math.pow(b - white[2], 2)
  )

  // 判断颜色是否接近黑色、白色或灰色
  const isCloseToGray =
    Math.abs(r - (r + g + b) / 3) <= tolerance &&
    Math.abs(g - (r + g + b) / 3) <= tolerance &&
    Math.abs(b - (r + g + b) / 3) <= tolerance

  // 如果颜色接近黑色、白色或灰色，则返回true
  return (
    distanceToBlack <= tolerance ||
    distanceToWhite <= tolerance ||
    isCloseToGray
  )
}
