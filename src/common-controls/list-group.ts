import CommonControl from "./common-control";
import ICommonControl from "./i-common-control";
import ListGroupView from "./list-group-view";
import MultiInstanceEditor from "./multi-instance-editor";

export default class ListGroup<T> extends CommonControl<HTMLDivElement, T[]> {
  readonly displayMode = "block";
  
  private view: ListGroupView;
  private items: MultiInstanceEditor<T>;
  private nameItem: (item: T, index: number) => string;
  
  constructor(child: ICommonControl<any, T>, nameItem?: (item: T, index: number) => string);
  constructor(name: string, child: ICommonControl<any, T>, nameItem?: (item: T, index: number) => string);
  constructor(arg0?: string | ICommonControl<any, T>, arg1?: ICommonControl<any, T> | ((item: T, index: number) => string), arg2?: (item: T, index: number) => string) {
    let name: string = "";

    if (typeof arg0 == "string") {
      name = arg0;
    }
    
    let children: ICommonControl<any, any>[] = [];

    if (typeof arg0 == "object") {
      children.push(arg0);
    } else if (typeof arg1 == "object") {
      children.push(arg1);
    }

    let nameItem = (item: T, index: number) => index.toString();

    if (typeof arg1 == "function") {
      nameItem = arg1;
    } else if (typeof arg2 == "function") {
      nameItem = arg2;
    }

    let view = new ListGroupView(name, (index) => this.items.select(index), () => this.items.add(), () => this.items.remove(), (offset) => this.items.move(offset));

    super(view.outer, name, children);

    this.view = view;
    this.nameItem = nameItem;
    this.items = new MultiInstanceEditor(() => children[0].value, (item) => children[0].value = item, (clean) => { if (clean) { this.render(); } else { this.notifyChange(); } });
    this.view.body.appendChild(children[0].element);

    this.render();
  }

  get value(): T[] {
    return this.items.export();
  }

  set value(value: any) {
    this.items.import(value);
  }

  get disabled() {
    return this.element.classList.contains("disabled");
  }

  set disabled(disabled: boolean) {
    if (disabled) {
      this.items.items = [];
      this.items.index = -1;
      this.element.classList.add("disabled");
    } else {
      this.element.classList.remove("disabled");
    }

    for (let child of this.children) {
      child.disabled = disabled;
    }

    this.render();
  }

  notifyChange(): void {
    super.notifyChange();

    this.render();
  }

  render() {
    this.items.store();

    this.children[0].disabled = this.items.items.length == 0;

    this.view.render(this.disabled, this.items.items.map((item, index) => this.nameItem(item, index) || "(empty)"), this.items.index)
  }
}