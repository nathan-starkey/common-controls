import Control from "./Control";

export default class SelectBox extends Control<string> {
  readonly displayMode: "inline" | "block" = "inline";
  readonly element = document.createElement("select");

  constructor(name: string, options: string[]) {
    super(name, []);

    for (let value of options) {
      this.element.add(new Option(value));
    }

    this.element.addEventListener("change", () => this.notifyChange());
  }
  
  set value(value: any) {
    this.element.value = value || "";

    if (this.element.selectedIndex == -1) {
      this.element.selectedIndex = 0;
    }
  }

  get value(): string {
    return this.element.value;
  }
  
  set disabled(disabled: boolean) {
    this.element.disabled = disabled;
    disabled && (this.value = undefined);
  }

  get disabled(): boolean {
    return this.element.disabled;
  }
}