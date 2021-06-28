import { rangeSum } from './common';

class Rows {
  private _: any;
  private len: any;
  private height: any;

  constructor({ len, height }: any) {
    this._ = {};
    this.len = len;
    // default row height
    this.height = height;
  }

  getHeight(ri) {
    if (this.isHide(ri)) return 0;
    const row = this.get(ri);
    if (row && row.height) {
      return row.height;
    }
    return this.height;
  }

  isHide(ri) {
    const row = this.get(ri);
    return row && row.hide;
  }

  get(ri) {
    return this._[ri];
  }

  sumHeight(min, max, exceptSet) {
    return rangeSum(min, max, i => {
      if (exceptSet && exceptSet.has(i)) return 0;
      return this.getHeight(i);
    });
  }
}

export default {};
export { Rows };
