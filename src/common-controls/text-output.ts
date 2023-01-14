import CommonControl from "./common-control";

export default class TextOutput extends CommonControl<HTMLSpanElement, null> {
  readonly hideName = true;
  
  constructor(name?: string) {
    super(document.createElement("span"), name);
  }
  
  get value(): null {
    return null;
  }

  set value(value: any) {
    this.text = value || ""
  }

  set disabled(disabled: boolean) {
    super.disabled = disabled;

    this.text = "";
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