import { NewLine } from '../utils';
import { Notation } from './Notation.abstract';
import { NotationType, INotation } from '..';
import { StaveCommand } from '../types_defined';
import { BarlineType } from '../Enums/BarlineType';

export class BarLine extends Notation {
  public ntype = NotationType.BarLine;

  constructor(
    public type: BarlineType = BarlineType.SingleBarline,
    protected hasNewlineInEnd: boolean = false
  ) {
    super();
  }

  public toJSON() {
    return {
      ntype: this.ntype,
      state: [this.hasNewlineInEnd]
    };
  }

  public toAbcString() {
    return (
      (this.type === BarlineType.SingleBarline
        ? '|'
        : this.type === BarlineType.DoubleBarline
        ? '||'
        : this.type === BarlineType.ThickThin_DoubleBarline
        ? '[|'
        : this.type === BarlineType.ThinThick_DoubleBarline
        ? '|]'
        : this.type === BarlineType.RepeatedSetion_Start
        ? '|:'
        : this.type === BarlineType.RepeatedSetion_End
        ? ':|'
        : this.type === BarlineType.RepeatedSetion_StartAndEnd
        ? '::'
        : '|') + (this.hasNewlineInEnd ? NewLine : '')
    );
  }

  public query(param): boolean {
    if (!param.ichar_end) {
      return false;
    }
    // tips: 因为abcjs选中回调中 不包括换行符，所以带换行符的符号要比实际少1，但是内部索引操作还是正常使用
    return (
      this.ibegin === param.ichar_start &&
      this.iend + (this.hasNewlineInEnd ? -1 : 0) === param.ichar_end
    );
  }

  public setNewlineInEnd() {
    this.hasNewlineInEnd = true;
    this.updateInStave();
  }

  public setBarlineType(newtype: BarlineType) {
    this.type = newtype;
    this.updateInStave();
  }
}
