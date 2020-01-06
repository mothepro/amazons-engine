/**
 * Stringify the positions so we can check valid positions in constant time
 * This is because [] !== [] which Set's use this for comparision.
 */
export default class <T extends { toString(): string }> extends Set<T> {
  private data = new Map<string, T>()

  // Push both the stringified and raw versions
  add(value: T) {
    this.data.set(value.toString(), value)
    return this
  }

  // Check against only the stringified
  has(value: T) { return this.data.has(value.toString()) }

  // Check against only the stringified
  delete(value: T) { return this.data.delete(value.toString()) }
  
  // These are just overrides...
  
  get size() { return this.data.size }
  [Symbol.iterator]() { return this.data.values() }
  clear() { this.data.clear() }
  values() { return this.data.values() }
  keys() { return this.data.values() }
  entries() { return this.data.values() as unknown as IterableIterator<[T, T]> }
  forEach(cb: (value: T, value2: T, set: this) => void) {
    for (const item of this)
      cb(item, item, this)
  }
}
