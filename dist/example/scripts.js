(function () {
    'use strict';

    class CommonControl {
        constructor(element, name = "", children = []) {
            this.parent = null;
            this.element = element;
            this.name = name;
            children = Array.from(children);
            for (let child of children) {
                child.parent = this;
                if (child.name) {
                    children[child.name] = child;
                }
            }
            this.children = children;
        }
        get disabled() {
            return "disabled" in this.element ? this.element.disabled : this.element.classList.contains("disabled");
        }
        set disabled(disabled) {
            if (disabled) {
                this.value = undefined;
            }
            if ("disabled" in this.element) {
                this.element.disabled = disabled;
            }
            else {
                if (disabled) {
                    this.element.classList.add("disabled");
                }
                else {
                    this.element.classList.remove("disabled");
                }
            }
            for (let child of this.children) {
                child.disabled = disabled;
            }
        }
        notifyChange() {
            if (this.parent) {
                this.parent.notifyChange();
            }
        }
    }

    class Button extends CommonControl {
        constructor(arg0, arg1, arg2) {
            let label = "";
            let name = "";
            let callback = () => { };
            if (typeof arg1 == "string") {
                name = arg0;
                label = arg1;
                callback = arg2 || callback;
            }
            else {
                label = arg0;
                callback = arg1 || callback;
            }
            super(document.createElement("button"), name);
            this.hideName = true;
            this.element.innerText = label;
            this.element.addEventListener("click", () => callback());
        }
        get value() {
            return null;
        }
        set value(value) {
        }
        click() {
            this.element.click();
        }
    }

    class CheckBox extends CommonControl {
        constructor(name) {
            super(document.createElement("input"), name);
            this.element.type = "checkbox";
            this.element.addEventListener("change", () => this.notifyChange());
        }
        get value() {
            return this.element.checked;
        }
        set value(value) {
            this.element.checked = value;
        }
    }

    class ListGroupView {
        constructor(name, select, add, remove, move) {
            this.outer = document.createElement("div");
            this.header = document.createElement("div");
            this.body = document.createElement("div");
            this.label = document.createElement("label");
            this.combo = document.createElement("select");
            this.buttonAdd = document.createElement("button");
            this.buttonRemove = document.createElement("button");
            this.buttonMoveUp = document.createElement("button");
            this.buttonMoveDown = document.createElement("button");
            this.label.innerText = name;
            this.buttonAdd.innerText = "Add";
            this.buttonRemove.innerText = "Remove";
            this.buttonMoveUp.innerHTML = "&#9650;";
            this.buttonMoveDown.innerHTML = "&#9660;";
            this.outer.classList.add("list-group");
            this.header.append(this.label, this.combo, this.buttonAdd, this.buttonRemove, this.buttonMoveUp, this.buttonMoveDown);
            this.outer.append(this.header, this.body);
            this.label.addEventListener("click", () => this.outer.classList.toggle("collapsed"));
            this.combo.addEventListener("change", () => select(this.combo.selectedIndex));
            this.buttonAdd.addEventListener("click", () => add());
            this.buttonRemove.addEventListener("click", () => remove());
            this.buttonMoveUp.addEventListener("click", () => move(-1));
            this.buttonMoveDown.addEventListener("click", () => move(1));
        }
        render(isDisabled, options, index) {
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

    class MultiInstanceEditor {
        constructor(pull, push, notifyChange) {
            this.items = [];
            this.index = -1;
            this.pull = pull;
            this.push = push;
            this.notifyChange = notifyChange;
        }
        store() {
            if (this.index != -1) {
                this.items[this.index] = this.pull();
            }
        }
        restore() {
            this.push(this.index == -1 ? undefined : this.items[this.index]);
        }
        clear() {
            this.items.length = 0;
            this.index = -1;
            this.notifyChange(false);
        }
        add() {
            this.store();
            this.push(undefined);
            this.items.push(this.pull());
            this.index = this.items.length - 1;
            this.restore();
            this.notifyChange(false);
        }
        move(offset) {
            let index = this.index + offset;
            if (Number.isInteger(offset) && offset != 0 && index >= 0 && index < this.items.length && this.index != -1) {
                let other = this.items[index];
                this.items[index] = this.items[this.index];
                this.items[this.index] = other;
                this.index = index;
                this.notifyChange(false);
            }
        }
        remove() {
            this.items.splice(this.index, 1);
            this.index = Math.min(this.index, this.items.length - 1);
            this.restore();
            this.notifyChange(false);
        }
        select(index) {
            if (Number.isInteger(index) && index >= -1 && index < this.items.length) {
                this.store();
                this.index = index;
                this.restore();
                this.notifyChange(true);
            }
        }
        export() {
            this.store();
            return Array.from(this.items);
        }
        import(items) {
            if (!Array.isArray(items)) {
                items = [];
            }
            this.items.length = 0;
            for (let item of items) {
                this.push(item);
                this.items.push(this.pull());
            }
            this.index = this.items.length - 1;
            this.notifyChange(true);
        }
    }

    class ListGroup extends CommonControl {
        constructor(arg0, arg1, arg2) {
            let name = "";
            if (typeof arg0 == "string") {
                name = arg0;
            }
            let children = [];
            if (typeof arg0 == "object") {
                children.push(arg0);
            }
            else if (typeof arg1 == "object") {
                children.push(arg1);
            }
            let nameItem = (item, index) => index.toString();
            if (typeof arg1 == "function") {
                nameItem = arg1;
            }
            else if (typeof arg2 == "function") {
                nameItem = arg2;
            }
            let view = new ListGroupView(name, (index) => this.items.select(index), () => this.items.add(), () => this.items.remove(), (offset) => this.items.move(offset));
            super(view.outer, name, children);
            this.displayMode = "block";
            this.view = view;
            this.nameItem = nameItem;
            this.items = new MultiInstanceEditor(() => children[0].value, (item) => children[0].value = item, (clean) => { if (clean) {
                this.render();
            }
            else {
                this.notifyChange();
            } });
            this.view.body.appendChild(children[0].element);
            this.render();
        }
        get value() {
            return this.items.export();
        }
        set value(value) {
            this.items.import(value);
        }
        get disabled() {
            return this.element.classList.contains("disabled");
        }
        set disabled(disabled) {
            if (disabled) {
                this.value = undefined;
                this.element.classList.add("disabled");
            }
            else {
                this.element.classList.remove("disabled");
            }
            for (let child of this.children) {
                child.disabled = disabled;
            }
            this.render();
        }
        notifyChange() {
            super.notifyChange();
            this.render();
        }
        render() {
            this.items.store();
            this.children[0].disabled = this.disabled || this.items.index == -1;
            this.view.render(this.disabled, this.items.items.map((item, index) => this.nameItem(item, index) || "(empty)"), this.items.index);
        }
    }

    class NumericBox extends CommonControl {
        constructor(name) {
            super(document.createElement("input"), name);
            this.element.type = "number";
            this.element.addEventListener("change", () => this.notifyChange());
            this.value = 0;
        }
        get value() {
            return this.element.valueAsNumber || 0;
        }
        set value(value) {
            this.element.valueAsNumber = Number(value) || 0;
        }
    }

    class SelectBox extends CommonControl {
        constructor(arg0, arg1) {
            let name = "";
            if (typeof arg0 == "string") {
                name = arg0;
            }
            let options = [];
            if (Array.isArray(arg0)) {
                options = arg0;
            }
            else if (Array.isArray(arg1)) {
                options = arg1;
            }
            super(document.createElement("select"), name);
            for (let option of options) {
                this.element.add(new Option(option));
            }
            this.element.addEventListener("change", () => this.notifyChange());
        }
        get value() {
            return this.element.value;
        }
        set value(value) {
            this.element.value = value || "";
            if (this.element.selectedIndex == -1) {
                this.element.selectedIndex = 0;
            }
        }
    }

    class TextArea extends CommonControl {
        constructor(name) {
            super(document.createElement("textarea"), name);
            this.element.addEventListener("change", () => this.notifyChange());
        }
        get value() {
            return this.element.value;
        }
        set value(value) {
            this.element.value = value || "";
        }
    }

    class TextOutput extends CommonControl {
        constructor(name) {
            super(document.createElement("span"), name);
            this.hideName = true;
        }
        get value() {
            return null;
        }
        set value(value) {
            this.text = value || "";
        }
        set disabled(disabled) {
            super.disabled = disabled;
            this.text = "";
        }
        get text() {
            return this.element.innerText;
        }
        set text(text) {
            this.element.innerText = text;
        }
        get html() {
            return this.element.innerHTML;
        }
        set html(html) {
            this.element.innerHTML = html;
        }
    }

    class TableGroup extends CommonControl {
        constructor(arg0, arg1) {
            let name = "";
            if (typeof arg0 == "string") {
                name = arg0;
            }
            let children = [];
            if (Array.isArray(arg0)) {
                children = arg0;
            }
            else if (Array.isArray(arg1)) {
                children = arg1;
            }
            super(document.createElement("table"), name, children);
            this.displayMode = "block";
            this.element.classList.add("table-group");
            for (let child of this.children) {
                let row = document.createElement("tr");
                let col = document.createElement("td");
                if (child.displayMode == "block") {
                    col.colSpan = 2;
                    row.append(col);
                }
                else {
                    let lbl = document.createElement("td");
                    lbl.innerText = child.hideName ? "" : child.name;
                    row.append(lbl, col);
                }
                col.append(child.element);
                this.element.append(row);
            }
        }
        get value() {
            let value = {};
            for (let child of this.children) {
                if (child.name && !child.hideName) {
                    value[child.name] = child.value;
                }
            }
            return value;
        }
        set value(value) {
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

    class TextBox extends CommonControl {
        constructor(name) {
            super(document.createElement("input"), name);
            this.element.addEventListener("change", () => this.notifyChange());
        }
        get value() {
            return this.element.value;
        }
        set value(value) {
            this.element.value = value || "";
        }
    }

    class Observer extends CommonControl {
        constructor(child, callback) {
            super(null, "", [child]);
            this.callback = callback;
        }
        get value() {
            return null;
        }
        set value(value) {
        }
        get disabled() {
            return false;
        }
        set disabled(disabled) {
        }
        notifyChange() {
            if (this.callback) {
                this.callback(this);
            }
        }
    }

    const root = new ListGroup(new TableGroup("n", [
        new TextBox("name"),
        new NumericBox("count"),
        new SelectBox("type", ["option1", "option2", "option3"]),
        new CheckBox("enabled"),
        new TextArea("notes"),
        new ListGroup("palette", new TableGroup([
            new TextBox()
        ])),
        new Button("random float", function () {
            let output = root.children.n.children.output;
            output.value = Math.random().toString();
        }),
        new TextOutput("output")
    ]), (item) => item["name"]);
    new Observer(root, () => console.log("tree changed!"));
    document.body.append(root.element);
    console.log("root =", globalThis["root"] = root);

})();
