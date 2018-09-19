/**
 * @example 0d7f
 * @return {string}
 */
function s4() {
  return Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1);
}

/**
 * Create random guid
 * @example 0d7f40c5-d03b-d5df-ae8f-a7255a94095a
 * @return {string}
 */
export default function guid() {
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}