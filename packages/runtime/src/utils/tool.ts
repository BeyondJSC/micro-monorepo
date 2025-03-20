// 指定文件名下载文件
export function blobDownload(blob: Blob | null, downloadName: string) {
  if (!blob) return
  const blobUrl = window.URL?.createObjectURL(blob)
  const a = document.createElement('a')
  a.download = downloadName
  a.href = blobUrl
  a.click()
}

// 生成数字区间数组
export function numberRange(start: number, end: number) {
  const result: number[] = []

  for (let i = start; i < end; i++) {
    result.push(i)
  }

  return result
}

// 检查两个时间戳是否有重叠
export function hasOverlapTime(
  startTimeStamp1: number,
  endTimeStamp1: number,
  startTimeStamp2: number,
  endTimeStamp2: number
) {
  if (endTimeStamp1 < startTimeStamp2 || endTimeStamp2 < startTimeStamp1) {
    return false
  } else {
    return true
  }
}
