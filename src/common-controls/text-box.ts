import CommonControl from "./common-control";

export default class TextBox extends CommonControl<HTMLInputElement, string> {
  constructor(name?: string) {
    super(document.createElement("input"), name);
    
    this.element.addEventListener("change", () => this.notifyChange());
  }
  
  get value(): string {
    return this.element.value;
  }

  set value(value: any) {
    this.element.value = value || "";
  }
}