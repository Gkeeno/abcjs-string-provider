import { NewLine } from '../utils';
import { Notation } from './Notation.abstract';

export class BarLine extends Notation {
  get ibegin() {
    return this._ibegin;
  }
  get iend() {
    // tips: 因为stave选中回调中 不包括换行符，所以带换行符的符号要比实际少1，但是内部索引操作还是正常使用
    return this._iend + (this.hasNewlineInEnd ? -1 : 0);
  }

  constructor(public hasNewlineInEnd: boolean = false) {
    super();
  }

  public toAbcString() {
    return '|' + (this.hasNewlineInEnd ? NewLine : '');
  }
  public setNewlineInEnd() {
    this.hasNewlineInEnd = true;
    this.updateInStave();
  }
}
