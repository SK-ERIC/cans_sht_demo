import { rangeSum } from './common';

class Cols {
  private _: any;
  private len: any;
  private width: any;
  private indexWidth: any;
  private minWidth: any;

  constructor({ len, width, indexWidth, minWidth }: any) {
    this._ = {};
    this.len = len;
    this.width = width;
    this.indexWidth = indexWidth;
    this.minWidth = minWidth;
  }

  getWidth(i: number) {
    if (this.isHide(i)) return 0;
    const col = this._[i];
    if (col && col.width) {
      return col.width;
    }
    return this.width;
  }

  isHide(ci: number) {
    const col = this._[ci];
    return col && col.hide;
  }

  sumWidth(min: number, max: number) {
    return rangeSum(min, max, (i: number) => this.getWidth(i));
  }
}

export default {};
export { Cols };
