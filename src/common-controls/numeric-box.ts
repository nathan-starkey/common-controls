import CommonControl from "./common-control";

export default class NumericBox extends CommonControl<HTMLInputElement, number> {
  constructor(name?: string) {
    super(document.createElement("input"), name);

    this.element.type = "number";
    this.element.addEventListener("change", () => this.notifyChange());
    this.value = 0;
  }
  
  get value(): number {
    return this.element.valueAsNumber || 0;
  }

  set value(value: any) {
    this.element.valueAsNumber = Number(value) || 0;
  }
}