export default abstract class Control<T> {
  abstract readonly displayMode: "inline" | "block";

  abstract readonly element: HTMLElement;
  
  readonly name: string;

  parent: Control<any> | null = null;

  readonly children: Control<any>[];
  
  abstract set value(value: any);

  abstract get value(): T;

  abstract set disabled(disabled: boolean);

  abstract get disabled();

  constructor(name: string, children: Control<any>[]) {
    this.name = name;
    this.children = children;

    for (let child of children) {
      child.parent = this;
    }
  }

  notifyChange() {
    this.parent?.notifyChange();
  }
}