import { blobDownload, hasOverlapTime, numberRange } from '../src/utils'

describe('numberRange', () => {
  test('generates normal number range', () => {
    expect(numberRange(1, 5)).toEqual([1, 2, 3, 4])
    expect(numberRange(10, 13)).toEqual([10, 11, 12])
  })

  test('handles start equals end', () => {
    expect(numberRange(5, 5)).toEqual([])
    expect(numberRange(0, 0)).toEqual([])
  })

  test('handles negative ranges', () => {
    expect(numberRange(-2, 1)).toEqual([-2, -1, 0])
    expect(numberRange(-5, -3)).toEqual([-5, -4])
  })
})

describe('hasOverlapTime', () => {
  test('无重叠-时间段1在前', () => {
    expect(hasOverlapTime(1, 3, 4, 5)).toBe(false) // [1,3] 和 [4,5]
  })

  test('无重叠-时间段1在后', () => {
    expect(hasOverlapTime(5, 6, 2, 4)).toBe(false) // [5,6] 和 [2,4]
  })

  test('部分重叠', () => {
    expect(hasOverlapTime(1, 4, 3, 5)).toBe(true) // [1,4] 和 [3,5]
  })

  test('完全包含', () => {
    expect(hasOverlapTime(1, 5, 2, 3)).toBe(true) // [1,5] 包含 [2,3]
  })

  test('边界相等', () => {
    expect(hasOverlapTime(1, 3, 3, 5)).toBe(true) // [1,3] 和 [3,5] 端点相接
    expect(hasOverlapTime(3, 5, 1, 3)).toBe(true) // 反向顺序测试
  })

  test('完全相同', () => {
    expect(hasOverlapTime(2, 5, 2, 5)).toBe(true) // 完全相同的时间段
  })
})

describe('blobDownload', () => {
  beforeEach(() => {
    // 模拟DOM方法
    global.URL.createObjectURL = jest.fn()
    document.createElement = jest.fn(() => ({
      download: '',
      href: '',
      click: jest.fn()
    })) as any
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('应创建正确的下载链接', () => {
    const mockBlob = new Blob(['test'])
    blobDownload(mockBlob, 'test.txt')

    expect(global.URL.createObjectURL).toHaveBeenCalledWith(mockBlob)
    expect(document.createElement).toHaveBeenCalledWith('a')
    expect(document.createElement('a').download).toBe('test.txt')
    expect(document.createElement('a').click).toHaveBeenCalled()
  })

  test('传入null时应直接返回', () => {
    blobDownload(null, 'test.txt')
    expect(global.URL.createObjectURL).not.toHaveBeenCalled()
    expect(document.createElement).not.toHaveBeenCalled()
  })

  test('应正确处理不同类型文件', () => {
    const pngBlob = new Blob([''], { type: 'image/png' })
    blobDownload(pngBlob, 'screenshot.png')

    expect(global.URL.createObjectURL).toHaveBeenCalledWith(pngBlob)
    expect(document.createElement('a').download).toBe('screenshot.png')
  })
})
