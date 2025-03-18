export function isUndef(value: unknown) {
  return value === undefined || value === null
}

export function isDef(value: unknown) {
  return value !== undefined && value !== null
}
