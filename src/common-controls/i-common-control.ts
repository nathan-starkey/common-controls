export default interface ICommonControl<TElement extends HTMLElement, TValue> {
  readonly element: TElement;
  readonly name: string;
  readonly children: ICommonControl<any, any>[] & { [s: string]: ICommonControl<any, any> };
  readonly displayMode?: string;
  readonly hideName?: boolean;
  
  parent: ICommonControl<any, any> | null;

  get value(): TValue;

  set value(value: any);

  get disabled(): boolean;

  set disabled(disabled: boolean);

  notifyChange(): void;
}