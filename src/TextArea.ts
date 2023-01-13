import Control from "./Control";

export default class TextArea extends Control<string> {
  readonly displayMode: "inline" | "block" = "inline";
  readonly element = document.createElement("textarea");

  constructor(name: string) {
    super(name, []);

    this.element.addEventListener("change", () => this.notifyChange());
  }
  
  set value(value: any) {
    this.element.value = value || "";
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