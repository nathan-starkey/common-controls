export default class InstanceEditor<T> {
    items: T[] = [];
    index: number = -1;
    private pull: () => T;
    private push: (item: any) => void;
    private notifyChange: (clean: boolean) => void;
  
    constructor(pull: () => T, push: (item: any) => void, notifyChange: (clean: boolean) => void) {
      this.pull = pull;
      this.push = push;
      this.notifyChange = notifyChange;
    }
  
    private store() {
      if (this.index != -1) {
        this.items[this.index] = this.pull();
      }
    }
  
    private restore() {
      this.push(this.index == -1 ? undefined : this.items[this.index]);
    }
  
    clear() {
      this.items.length = 0;
      this.index = -1;
      this.notifyChange(false);
    }
  
    add() {
      this.store();
      this.push(undefined);
      this.items.push(this.pull());
      this.index = this.items.length - 1;
      this.restore();
      this.notifyChange(false);
    }
  
    move(offset: number) {
      let index = this.index + offset;
      
      if (Number.isInteger(offset) && offset != 0 && index >= 0 && index < this.items.length && this.index != -1) {
        let other = this.items[index];
  
        this.items[index] = this.items[this.index];
        this.items[this.index] = other;
        this.index = index;
        this.notifyChange(false);
      }
    }
  
    remove() {
      this.items.splice(this.index, 1);
      this.index = Math.min(this.index, this.items.length - 1);
      this.restore();
      this.notifyChange(false);
    }
  
    select(index: number) {
      if (Number.isInteger(index) && index >= -1 && index < this.items.length) {
        this.store();
        this.index = index;
        this.restore();
        this.notifyChange(true);
      }
    }
  
    export() {
      this.store();
  
      return Array.from(this.items);
    }
  
    import(items: any) {
      if (!Array.isArray(items)) {
        items = [];
      }
  
      this.items.length = 0;
  
      for (let item of items) {
        this.push(item);
        this.items.push(this.pull());
      }
  
      this.index = this.items.length - 1;
      this.notifyChange(true);
    }
  }