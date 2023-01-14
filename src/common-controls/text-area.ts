import CommonControl from "./common-control";

export default class TextArea extends CommonControl<HTMLTextAreaElement, string> {
  constructor(name?: string) {
    super(document.createElement("textarea"), name);
    
    this.element.addEventListener("change", () => this.notifyChange());
  }
  
  get value(): string {
    return this.element.value;
  }

  set value(value: any) {
    this.element.value = value || "";
  }
}