var FormControls = (function () {
    'use strict';

    class Control {
        constructor(name, children) {
            this.parent = null;
            this.name = name;
            this.children = children;
            for (let child of children) {
                child.parent = this;
            }
        }
        notifyChange() {
            var _a;
            (_a = this.parent) === null || _a === void 0 ? void 0 : _a.notifyChange();
        }
    }

    class Button extends Control {
        constructor(label, callback) {
            super("", []);
            this.displayMode = "inline";
            this.element = document.createElement("button");
            this.element.innerText = label;
            if (callback) {
                this.element.addEventListener("click", () => callback());
            }
        }
        get value() {
            return null;
        }
        set disabled(disabled) {
            this.element.disabled = disabled;
        }
        get disabled() {
            return this.element.disabled;
        }
    }

    class CheckBox extends Control {
        constructor(name) {
            super(name, []);
            this.displayMode = "inline";
            this.element = document.createElement("input");
            this.element.type = "checkbox";
            this.element.addEventListener("change", () => this.notifyChange());
        }
        set value(value) {
            this.element.checked = value;
        }
        get value() {
            return this.element.checked;
        }
        set disabled(disabled) {
            this.element.disabled = disabled;
            disabled && (this.value = undefined);
        }
        get disabled() {
            return this.element.disabled;
        }
    }

    class InstanceEditor {
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

    class RenderedListGroup {
        constructor(name, select, add, remove, move) {
            this.container = document.createElement("div");
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
            this.container.classList.add("list-group");
            this.header.append(this.label, this.combo, this.buttonAdd, this.buttonRemove, this.buttonMoveUp, this.buttonMoveDown);
            this.container.append(this.header, this.body);
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

    class ListGroup extends Control {
        constructor(name, child, nameItem) {
            super(name, [child]);
            this.displayMode = "block";
            this.nameItem = nameItem || ((item, index) => String(index));
            this.renderer = new RenderedListGroup(name, (index) => this.select(index), () => this.add(), () => this.remove(), (offset) => this.move(offset));
            this.element = this.renderer.container;
            this.stack = new InstanceEditor(() => child.value, (item) => child.value = item, () => this.notifyChange());
            this.renderer.body.append(child.element);
            this.render();
        }
        set value(value) {
            this.stack.import(value);
        }
        get value() {
            return this.stack.export();
        }
        set disabled(disabled) {
            disabled ?
                (this.element.classList.add("disabled")) :
                (this.element.classList.remove("disabled"));
            for (let child of this.children) {
                child.disabled = disabled;
            }
        }
        get disabled() {
            return this.element.classList.contains("disabled");
        }
        notifyChange() {
            super.notifyChange();
            this.render();
        }
        add() {
            this.stack.add();
        }
        remove() {
            this.stack.remove();
        }
        move(offset) {
            this.stack.move(offset);
        }
        select(index) {
            this.stack.select(index);
        }
        render() {
            let options = this.stack.export().map((item, index) => this.nameItem(item, index) || "(empty)");
            this.children[0].disabled = options.length == 0;
            this.renderer.render(this.disabled, options, this.stack.index);
        }
    }

    class NumberBox extends Control {
        constructor(name) {
            super(name, []);
            this.displayMode = "inline";
            this.element = document.createElement("input");
            this.element.type = "number";
            this.element.valueAsNumber = 0;
            this.element.addEventListener("change", () => this.notifyChange());
        }
        set value(value) {
            this.element.valueAsNumber = Number(value) || 0;
        }
        get value() {
            return this.element.valueAsNumber || 0;
        }
        set disabled(disabled) {
            this.element.disabled = disabled;
            disabled && (this.value = undefined);
        }
        get disabled() {
            return this.element.disabled;
        }
    }

    class SelectBox extends Control {
        constructor(name, options) {
            super(name, []);
            this.displayMode = "inline";
            this.element = document.createElement("select");
            for (let value of options) {
                this.element.add(new Option(value));
            }
            this.element.addEventListener("change", () => this.notifyChange());
        }
        set value(value) {
            this.element.value = value || "";
            if (this.element.selectedIndex == -1) {
                this.element.selectedIndex = 0;
            }
        }
        get value() {
            return this.element.value;
        }
        set disabled(disabled) {
            this.element.disabled = disabled;
            disabled && (this.value = undefined);
        }
        get disabled() {
            return this.element.disabled;
        }
    }

    class TableGroup extends Control {
        constructor(name, children) {
            super(name, children);
            this.displayMode = "block";
            this.element = document.createElement("div");
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
                    lbl.innerText = child.name;
                    row.append(lbl, col);
                }
                col.append(child.element);
                this.element.append(row);
            }
        }
        set value(value) {
            if (typeof value != "object" || value == null) {
                value = {};
            }
            for (let child of this.children) {
                if (child.name) {
                    child.value = value[child.name];
                }
            }
        }
        get value() {
            let value = {};
            for (let child of this.children) {
                if (child.name) {
                    value[child.name] = child.value;
                }
            }
            return value;
        }
        set disabled(disabled) {
            disabled ?
                (this.element.classList.add("disabled")) :
                (this.element.classList.remove("disabled"));
            for (let child of this.children) {
                child.disabled = disabled;
            }
        }
        get disabled() {
            return this.element.classList.contains("disabled");
        }
    }

    class TextArea extends Control {
        constructor(name) {
            super(name, []);
            this.displayMode = "inline";
            this.element = document.createElement("textarea");
            this.element.addEventListener("change", () => this.notifyChange());
        }
        set value(value) {
            this.element.value = value || "";
        }
        get value() {
            return this.element.value;
        }
        set disabled(disabled) {
            this.element.disabled = disabled;
            disabled && (this.value = undefined);
        }
        get disabled() {
            return this.element.disabled;
        }
    }

    class TextBox extends Control {
        constructor(name) {
            super(name, []);
            this.displayMode = "inline";
            this.element = document.createElement("input");
            this.element.addEventListener("change", () => this.notifyChange());
        }
        set value(value) {
            this.element.value = value || "";
        }
        get value() {
            return this.element.value;
        }
        set disabled(disabled) {
            this.element.disabled = disabled;
            disabled && (this.value = undefined);
        }
        get disabled() {
            return this.element.disabled;
        }
    }

    class TextOutput extends Control {
        constructor() {
            super("", []);
            this.displayMode = "inline";
            this.element = document.createElement("span");
        }
        get value() {
            return null;
        }
        set disabled(disabled) {
            disabled ?
                (this.element.classList.add("disabled"), this.text = "") :
                (this.element.classList.remove("disabled"));
        }
        get disabled() {
            return this.element.classList.contains("disabled");
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

    var Index = {
        Button,
        CheckBox,
        Control,
        InstanceEditor,
        ListGroup,
        NumberBox,
        RenderedListGroup,
        SelectBox,
        TableGroup,
        TextArea,
        TextBox,
        TextOutput
    };

    return Index;

})();
