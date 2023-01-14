export default class ListGroupView {
  readonly outer = document.createElement("div");
  readonly header = document.createElement("div");
  readonly body = document.createElement("div");
  readonly label = document.createElement("label");
  readonly combo = document.createElement("select");
  readonly buttonAdd = document.createElement("button");
  readonly buttonRemove = document.createElement("button");
  readonly buttonMoveUp = document.createElement("button");
  readonly buttonMoveDown = document.createElement("button");

  constructor(name: string, select: (index: number) => void, add: () => void, remove: () => void, move: (offset: number) => void) {
    this.label.innerText = name;
    this.buttonAdd.innerText = "Add";
    this.buttonRemove.innerText = "Remove";
    this.buttonMoveUp.innerHTML = "&#9650;";
    this.buttonMoveDown.innerHTML = "&#9660;";
    
    this.outer.classList.add("list-group");

    this.header.append(this.label, this.combo, this.buttonAdd, this.buttonRemove, this.buttonMoveUp, this.buttonMoveDown);
    this.outer.append(this.header, this.body);

    this.combo.addEventListener("change", () => select(this.combo.selectedIndex));
    this.buttonAdd.addEventListener("click", () => add());
    this.buttonRemove.addEventListener("click", () => remove());
    this.buttonMoveUp.addEventListener("click", () => move(-1));
    this.buttonMoveDown.addEventListener("click", () => move(1));
  }

  render(isDisabled: boolean, options: string[], index: number) {
    this.combo.innerHTML = "";

    for (let option of options) {
      this.combo.options.add(new Option(option));
    }
    
    this.combo.selectedIndex = index;

    let isEmpty = options.length == 0;
    let isFirst = index == 0;
    let isLast = index == options.length - 1;
    
    this.combo.disabled = isDisabled || isEmpty;
    this.buttonAdd.disabled = isDisabled;
    this.buttonRemove.disabled = isDisabled || isEmpty;
    this.buttonMoveUp.disabled = isDisabled || isEmpty || isFirst;
    this.buttonMoveDown.disabled = isDisabled || isEmpty || isLast;
  }
}