import CommonControl from "./common-control";

export default class SelectBox extends CommonControl<HTMLSelectElement, string> {
  constructor(options?: string[]);
  constructor(name?: string, options?: string[]);
  constructor(arg0?: string | string[], arg1?: string[]) {
    let name: string = "";

    if (typeof arg0 == "string") {
      name = arg0;
    }
    
    let options: string[] = [];

    if (Array.isArray(arg0)) {
      options = arg0;
    } else if (Array.isArray(arg1)) {
      options = arg1;
    }

    super(document.createElement("select"), name);

    for (let option of options) {
      this.element.add(new Option(option));
    }
    
    this.element.addEventListener("change", () => this.notifyChange());
  }
  
  get value(): string {
    return this.element.value;
  }

  set value(value: any) {
    this.element.value = value || "";

    if (this.element.selectedIndex == -1) {
      this.element.selectedIndex = 0;
    }
  }
}