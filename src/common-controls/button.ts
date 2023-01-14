import CommonControl from "./common-control";

export default class Button extends CommonControl<HTMLButtonElement, null> {
  readonly hideName = true;

  constructor(name: string, label: string, callback?: () => void);
  constructor(label: string, callback?: () => void);
  constructor(arg0: string, arg1?: string | (() => void), arg2?: () => void) {
    let label = "";
    let name = "";
    let callback = () => {};

    if (typeof arg1 == "string") {
      name = arg0;
      label = arg1;
      callback = arg2 || callback;
    } else {
      label = arg0;
      callback = arg1 || callback;
    }

    super(document.createElement("button"), name);
    
    this.element.innerText = label;
    this.element.addEventListener("click", () => callback());
  }
  
  get value(): null {
    return null;
  }

  set value(value: any) {
  }

  click() {
    this.element.click();
  }
}