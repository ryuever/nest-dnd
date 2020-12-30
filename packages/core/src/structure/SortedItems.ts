import { Sorter } from '../types';
class SortedItems<T> {
  public sorter: Sorter<T>;
  public items: T[] = [];

  constructor({ sorter }: { sorter: Sorter<T> }) {
    this.sorter = sorter;
  }

  add(item: T) {
    this.items.push(item);
    this.items.sort(this.sorter);
  }

  remove(item: T) {
    const index = this.findIndex(item);
    if (index !== -1) this.items.splice(index, 1);
  }

  findIndex(item: T) {
    const { id } = item as any;
    return this.items.findIndex(item => (item as any).id === id);
  }

  getSize() {
    return this.items.length;
  }

  getItem(index: number) {
    return this.items[index];
  }

  slice(...args: Array<any>) {
    return [].slice.apply(this.items, args as any);
  }

  splice(...args: Array<any>) {
    return [].splice.apply(this.items, args as any);
  }

  sort() {
    this.items.sort(this.sorter);
  }
}

export default SortedItems;
