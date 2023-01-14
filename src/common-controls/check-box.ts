import CommonControl from "./common-control";

export default class CheckBox extends CommonControl<HTMLInputElement, boolean> {
  constructor(name?: string) {
    super(document.createElement("input"), name);
    
    this.element.type = "checkbox";
    this.element.addEventListener("change", () => this.notifyChange());
  }
  
  get value(): boolean {
    return this.element.checked;
  }

  set value(value: any) {
    this.element.checked = value;
  }
}