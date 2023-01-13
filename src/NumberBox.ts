import Control from "./Control";

export default class NumberBox extends Control<number> {
  readonly displayMode: "inline" | "block" = "inline";
  readonly element = document.createElement("input");

  constructor(name: string) {
    super(name, []);

    this.element.type = "number";
    this.element.valueAsNumber = 0;
    this.element.addEventListener("change", () => this.notifyChange());
  }
  
  set value(value: any) {
    this.element.valueAsNumber = Number(value) || 0;
  }

  get value(): number {
    return this.element.valueAsNumber || 0;
  }
  
  set disabled(disabled: boolean) {
    this.element.disabled = disabled;
    disabled && (this.value = undefined);
  }

  get disabled(): boolean {
    return this.element.disabled;
  }
}