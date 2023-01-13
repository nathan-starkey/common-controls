import Control from "./Control";

export default class TableGroup extends Control<{}> {
  readonly displayMode: "inline" | "block" = "block";
  readonly element = document.createElement("div");

  constructor(name: string, children: Control<any>[]) {
    super(name, children);

    this.element.classList.add("table-group");

    for (let child of this.children) {
      let row = document.createElement("tr");
      let col = document.createElement("td");

      if (child.displayMode == "block") {
        col.colSpan = 2;
        row.append(col);
      } else {
        let lbl = document.createElement("td");

        lbl.innerText = child.name;
        row.append(lbl, col);
      }

      col.append(child.element);
      this.element.append(row);
    }
  }
  
  set value(value: any) {
    if (typeof value != "object" || value == null) {
      value = {};
    }

    for (let child of this.children) {
      if (child.name) {
        child.value = value[child.name];
      }
    }
  }

  get value(): {} {
    let value = {};

    for (let child of this.children) {
      if (child.name) {
        value[child.name] = child.value;
      }
    }

    return value;
  }
  
  set disabled(disabled: boolean) {
    disabled ?
      (this.element.classList.add("disabled")) :
      (this.element.classList.remove("disabled"));
    
    for (let child of this.children) {
      child.disabled = disabled;
    }
  }

  get disabled(): boolean {
    return this.element.classList.contains("disabled");
  }
}