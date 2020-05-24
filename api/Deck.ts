/**
 * Represents a collection of items with a stable, shuffled ordering. Cards are added at a random location.
 */
export default class Deck<T> {
  private items: T[] = []

  constructor (items: T[] = []) {
    for (const item of items) {
      this.add(item)
    }
  }

  /**
   * Adapting the "inside-out" Fisher-Yates shuffle to add items in a random order
   */
  public add (item: T) {
    const last = this.items.length
    const i = Math.round(Math.random() * last)
    this.items[last] = this.items[i]
    this.items[i] = item
  }

  public pop (): T {
    if (this.items.length == 0) {
      throw new Error(`Cannot pop. Deck is empty.`)
    }
    return this.items.pop()!
  }

  public get (i: number): T {
    if (i >= this.items.length || i < 0) {
      throw new Error(`Index ${i} out of bounds`)
    }
    return this.items[i]
  }

  public all (): T[] {
    return this.items
  }

  public length (): number {
    return this.items.length
  }

  public clear () {
    this.items = []
  }
}
