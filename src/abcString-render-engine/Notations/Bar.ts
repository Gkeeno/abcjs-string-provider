import { NewLine } from '../utils';
import { Notation } from './Notation.abstract';
import { UpdateAbcStringHandle } from '../types_defined';
import { INotation } from './INotation';


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

  protected insertAbcStringHandle(before: INotation): UpdateAbcStringHandle{
    const notationStr = this.toAbcString();
    // 插入到前一符号后
    return abcstr => {
      // a.拆分出前后字符串
      const forward = abcstr.substring(0, before.ibegin);
      const backend = abcstr.substring(before.iend + 1);
      // b.处理相关记录的索引
      const org_iend = before.iend;
      this._ibegin = before.iend + 1;
      this._iend = this._ibegin + notationStr.length - 1;

      return {
        newStaveAbcString: forward
          .concat(before.toAbcString())
          .concat(notationStr)
          .concat(backend),
        changesInfo: { org_iend, iend: this.iend, sender: this }
      };
    };
  }
}
