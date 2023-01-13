import Control from "./Control";

export default class Button extends Control<null> {
  readonly displayMode: "inline" | "block" = "inline";
  readonly element = document.createElement("button");

  constructor(label: string, callback?: () => void) {
    super("", []);

    this.element.innerText = label;

    if (callback) {
      this.element.addEventListener("click", () => callback());
    }
  }

  get value(): null {
    return null;
  }
  
  set disabled(disabled: boolean) {
    this.element.disabled = disabled;
  }

  get disabled(): boolean {
    return this.element.disabled;
  }
}