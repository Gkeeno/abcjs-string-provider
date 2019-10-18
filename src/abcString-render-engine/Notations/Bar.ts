import { NewLine } from '../utils';
import { Notation } from './Notation.abstract';
import { UpdateAbcStringHandle } from '../types_defined';
import { INotation } from './INotation';

export class BarLine extends Notation {
  get ibegin() {
    return this._ibegin;
  }
  get iend() {
    return this._iend;
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

  public query(param): boolean {
    if (!param.ichar_end) { return false; }
    // tips: 因为abcjs选中回调中 不包括换行符，所以带换行符的符号要比实际少1，但是内部索引操作还是正常使用
    return (
      this.ibegin === param.ichar_start &&
      this.iend + (this.hasNewlineInEnd ? -1 : 0) === param.ichar_end
    );
  }

}
