/// <reference path="../../dist/form-controls.d.ts"/>
const { Button, CheckBox, ListGroup, NumberBox, SelectBox, TableGroup, TextArea, TextBox, TextOutput } = FormControls;
let out;
const root = new ListGroup("root", new TableGroup("", [
    new TextBox("name"),
    new CheckBox("checkBox"),
    new NumberBox("numberBox"),
    new SelectBox("selectBox", ["option1", "option2", "option3"]),
    new TextArea("textArea"),
    new TextBox("textBox"),
    new Button("Random Float", () => out.text = "" + Math.random()),
    out = new TextOutput()
]), (item) => item["name"]);
document.body.append(root.element);
