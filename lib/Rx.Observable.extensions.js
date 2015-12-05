
export function reject(callback, thisArg) {
  callback || (callback = Rx.helpers.identity);
  return this.filter((x, i, o) => !callback.call(thisArg, x, i, o));
};