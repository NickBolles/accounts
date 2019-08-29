export function isNumber(value?: any): value is number {
  return value && typeof value === "number";
}
export function isPromise<T = any>(value?: any): value is Promise<T> {
  return value && typeof value.then === "function";
}
