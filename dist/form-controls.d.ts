declare namespace FormControls {
  class Button extends Control<null> {
    readonly displayMode: "inline" | "block";
    readonly element: HTMLButtonElement;
  
    constructor(label: string, callback?: () => void);
    get value(): null;
    set disabled(disabled: boolean);
    get disabled(): boolean;
  }

  class CheckBox extends Control<boolean> {
    readonly displayMode: "inline" | "block";
    readonly element: HTMLInputElement;

    constructor(name: string);
    set value(value: any);
    get value(): boolean;
    set disabled(disabled: boolean);
    get disabled(): boolean;
  }

  abstract class Control<T> {
    abstract readonly displayMode: "inline" | "block";
    abstract readonly element: HTMLElement;
    readonly name: string;
    parent: Control<any> | null;
    readonly children: Control<any>[];
    abstract set value(value: any);
    abstract get value(): T;
    abstract set disabled(disabled: boolean);
    abstract get disabled();

    constructor(name: string, children: Control<any>[]);
    notifyChange(): void;
  }

  class InstanceEditor<T> {
    items: T[];
    index: number;
  
    constructor(pull: () => T, push: (item: any) => void, notifyChange: (clean: boolean) => void);
    clear(): void;
    add(): void;
    move(offset: number): void;
    remove(): void;
    select(index: number): void;
    export(): void;
    import(items: any): void;
  }

  class ListGroup<T> extends Control<T[]> {
    readonly displayMode: "inline" | "block";
    readonly element: HTMLDivElement;
  
    constructor(name: string, child: Control<any>, nameItem?: (item: T, index: number) => string);
    set value(value: any);
    get value(): T[];
    set disabled(disabled: boolean);
    get disabled(): boolean;
    add(): void;
    remove(): void;
    move(offset: number): void;
    select(index: number): void;
  }
  
  class NumberBox extends Control<number> {
    readonly displayMode: "inline" | "block";
    readonly element: HTMLInputElement;
  
    constructor(name: string);
    set value(value: any);
    get value(): number;
    set disabled(disabled: boolean);
    get disabled(): boolean;
  }

  class RenderedListGroup {
    readonly container: HTMLDivElement;
    readonly header: HTMLDivElement;
    readonly body: HTMLDivElement;
    readonly label: HTMLLabelElement;
    readonly combo: HTMLSelectElement;
    readonly buttonAdd: HTMLButtonElement;
    readonly buttonRemove: HTMLButtonElement;
    readonly buttonMoveUp: HTMLButtonElement;
    readonly buttonMoveDown: HTMLButtonElement;

    constructor(name: string, select: (index: number) => void, add: () => void, remove: () => void, move: (offset: number) => void);

    render(isDisabled: boolean, options: string[], index: number): void;
  }

  class SelectBox extends Control<string> {
    readonly displayMode: "inline" | "block";
    readonly element: HTMLSelectElement;
  
    constructor(name: string, options: string[]);
    set value(value: any);
    get value(): string;
    set disabled(disabled: boolean);
    get disabled(): boolean;
  }

  class TableGroup extends Control<{}> {
    readonly displayMode: "inline" | "block";
    readonly element: HTMLDivElement;
  
    constructor(name: string, children: Control<any>[]);
    set value(value: any);
    get value(): {};
    set disabled(disabled: boolean);
    get disabled(): boolean;
  }

  class TextArea extends Control<string> {
    readonly displayMode: "inline" | "block";
    readonly element: HTMLTextAreaElement;
  
    constructor(name: string);
    set value(value: any);
    get value(): string;
    set disabled(disabled: boolean);
    get disabled(): boolean;
  }
  
  class TextBox extends Control<string> {
    readonly displayMode: "inline" | "block";
    readonly element: HTMLInputElement;

    constructor(name: string);
    set value(value: any);
    get value(): string;
    set disabled(disabled: boolean);
    get disabled(): boolean;
  }

  class TextOutput extends Control<null> {
    readonly displayMode: "inline" | "block";
    readonly element: HTMLSpanElement;
  
    constructor();
    get value(): null;
    set disabled(disabled: boolean);
    get disabled(): boolean;
    get text();
    set text(text: string);
    get html();
    set html(html: string);
  }
}