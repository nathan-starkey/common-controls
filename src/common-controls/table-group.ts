import CommonControl from "./common-control";
import ICommonControl from "./i-common-control";

export default class TableGroup extends CommonControl<HTMLTableElement, {}> {
  readonly displayMode = "block";

  constructor(children?: ICommonControl<any, any>[]);
  constructor(name?: string, children?: ICommonControl<any, any>[]);
  constructor(arg0?: string | ICommonControl<any, any>[], arg1?: ICommonControl<any, any>[]) {
    let name: string = "";

    if (typeof arg0 == "string") {
      name = arg0;
    }
    
    let children: ICommonControl<any, any>[] = [];

    if (Array.isArray(arg0)) {
      children = arg0;
    } else if (Array.isArray(arg1)) {
      children = arg1;
    }

    super(document.createElement("table"), name, children);

    this.element.classList.add("table-group");
    
    for (let child of this.children) {
      let row = document.createElement("tr");
      let col = document.createElement("td");

      if (child.displayMode == "block") {
        col.colSpan = 2;
        row.append(col);
      } else {
        let lbl = document.createElement("td");

        lbl.innerText = child.hideName ? "" : child.name;
        row.append(lbl, col);
      }

      col.append(child.element);
      this.element.append(row);
    }
  }

  get value(): {} {
    let value = {};

    for (let child of this.children) {
      if (child.name && !child.hideName) {
        value[child.name] = child.value;
      }
    }

    return value;
  }

  set value(value: any) {
    if (typeof value != "object" || value == null) {
      value = {};
    }
    
    for (let child of this.children) {
      if (child.name && !child.hideName) {
        child.value = value[child.name];
      }
    }
  }
}