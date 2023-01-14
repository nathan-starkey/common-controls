import CommonControl from "./common-control";
import ICommonControl from "./i-common-control";

export default class Observer extends CommonControl<null, null> {
  private callback?: (root: this) => void;

  constructor(child: ICommonControl<any, any>, callback?: (root: Observer) => void) {
    super(null, "", [child]);
    
    this.callback = callback;
  }
  
  get value(): null {
    return null;
  }

  set value(value: any) {
  }

  get disabled() {
    return false;
  }

  set disabled(disabled: boolean) {
  }

  notifyChange(): void {
    if (this.callback) {
      this.callback(this);
    }
  }
}