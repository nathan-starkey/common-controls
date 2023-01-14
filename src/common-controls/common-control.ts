import ICommonControl from "./i-common-control";

export default abstract class CommonControl<TElement extends HTMLElement, TValue> implements ICommonControl<TElement, TValue> {
  readonly element: TElement;
  readonly name: string;
  readonly children: ICommonControl<any, any>[] & { [s: string]: ICommonControl<any, any> };

  parent: ICommonControl<any, any> | null = null;

  constructor(element: TElement, name: string = "", children: ICommonControl<any, any>[] = []) {
    this.element = element;
    this.name = name;

    children = Array.from(children);

    for (let child of children) {
      child.parent = this;

      if (child.name) {
        children[child.name] = child;
      }
    }

    this.children = <ICommonControl<any, any>[] & { [s: string]: ICommonControl<any, any> }> children;
  }

  abstract get value(): TValue;

  abstract set value(value: any);

  get disabled(): boolean {
    return "disabled" in this.element ? <boolean> ((<unknown> this.element) as {disabled: any}).disabled : this.element.classList.contains("disabled");
  }

  set disabled(disabled: boolean) {
    if (disabled) {
      this.value = undefined;
    }

    if ("disabled" in this.element) {
      ((<unknown> this.element) as {disabled: any}).disabled = disabled;
    } else {
      if (disabled) {
        this.element.classList.add("disabled");
      } else {
        this.element.classList.remove("disabled");
      }
    }

    for (let child of this.children) {
      child.disabled = disabled;
    }
  }

  notifyChange(): void {
    if (this.parent) {
      this.parent.notifyChange();
    }
  }
}