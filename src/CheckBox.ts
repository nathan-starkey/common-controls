import Control from "./Control";

export default class CheckBox extends Control<boolean> {
  readonly displayMode: "inline" | "block" = "inline";
  readonly element = document.createElement("input");

  constructor(name: string) {
    super(name, []);

    this.element.type = "checkbox";
    this.element.addEventListener("change", () => this.notifyChange());
  }
  
  set value(value: any) {
    this.element.checked = value;
  }

  get value(): boolean {
    return this.element.checked;
  }
  
  set disabled(disabled: boolean) {
    this.element.disabled = disabled;
    disabled && (this.value = undefined);
  }

  get disabled(): boolean {
    return this.element.disabled;
  }
}