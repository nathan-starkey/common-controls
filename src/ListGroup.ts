import Control from "./Control";
import InstanceEditor from "./InstanceEditor";
import RenderedListGroup from "./RenderedListGroup";

export default class ListGroup<T> extends Control<T[]> {
  readonly displayMode: "inline" | "block" = "block";
  readonly element: HTMLDivElement;
  private renderer: RenderedListGroup;
  private stack: InstanceEditor<T>;
  private nameItem: (item: T, index: number) => string;

  constructor(name: string, child: Control<any>, nameItem?: (item: T, index: number) => string) {
    super(name, [child]);

    this.nameItem = nameItem || ((item, index) => String(index));
    this.renderer = new RenderedListGroup(name, (index) => this.select(index), () => this.add(), () => this.remove(), (offset) => this.move(offset));
    this.element = this.renderer.container;
    this.stack = new InstanceEditor(() => child.value, (item) => child.value = item, () => this.notifyChange());

    this.renderer.body.append(child.element);
    this.render();
  }
  
  set value(value: any) {
    this.stack.import(value);
  }

  get value(): T[] {
    return this.stack.export();
  }

  set disabled(disabled: boolean) {
    disabled ?
      (this.element.classList.add("disabled")) :
      (this.element.classList.remove("disabled"));
    
    for (let child of this.children) {
      child.disabled = disabled;
    }
  }

  get disabled(): boolean {
    return this.element.classList.contains("disabled");
  }

  notifyChange(): void {
    super.notifyChange();

    this.render();
  }

  add() {
    this.stack.add();
  }

  remove() {
    this.stack.remove();
  }

  move(offset: number) {
    this.stack.move(offset);
  }

  select(index: number) {
    this.stack.select(index);
  }

  render() {
    let options = this.stack.export().map((item, index) => this.nameItem(item, index) || "(empty)");

    this.children[0].disabled = options.length == 0;

    this.renderer.render(this.disabled, options, this.stack.index);
  }
}