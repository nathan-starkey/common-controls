import Control from "./Control";

export default class TextOutput extends Control<null> {
  readonly displayMode: "inline" | "block" = "inline";
  readonly element = document.createElement("span");

  constructor() {
    super("", []);
  }

  get value(): null {
    return null;
  }
  
  set disabled(disabled: boolean) {
    disabled ?
      (this.element.classList.add("disabled"), this.text = "") :
      (this.element.classList.remove("disabled"));
  }

  get disabled(): boolean {
    return this.element.classList.contains("disabled");
  }

  get text() {
    return this.element.innerText;
  }

  set text(text: string) {
    this.element.innerText = text;
  }

  get html() {
    return this.element.innerHTML;
  }

  set html(html: string) {
    this.element.innerHTML = html;
  }
}