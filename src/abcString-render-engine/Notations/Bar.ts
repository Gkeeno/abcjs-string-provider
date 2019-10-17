import { INotation } from './INotation';
import {
  StaveCommand,
  stringsIndexChangeHandle,
  updateAbcStringHandle
} from '../types_defined';
import { NewLine } from '../utils';

export class BarLine implements INotation {
  get ibegin() {
    return this._ibegin;
  }
  get iend() {
    // tips: 因为stave选中回调中 不包括换行符，所以带换行符的符号要比实际少1，但是内部索引操作还是正常使用
    return this._iend + (this.hasNewlineInEnd ? -1 : 0);
  }
  private _ibegin: number = 0;
  private _iend: number = 0;
  private _command: StaveCommand;

  /**
   *
   */
  constructor(public hasNewlineInEnd: boolean = false) {}

  public addToStave(command: StaveCommand) {
    this._command = command;
    this._command.subscribeAbcStringIndexChange(this.stringIndexChangeHandle);
    this._command.updateAbcString(this.createUpdateAbcStringHandle());
  }
  public insertToStave(before: INotation, command: StaveCommand) {
    this._command = command;
    this._command.subscribeAbcStringIndexChange(this.stringIndexChangeHandle);
    this._command.updateAbcString(this.createUpdateAbcStringHandle(before));
  }
  public updateInStave() {
    this._command.updateAbcString(this.createUpdateAbcStringHandle());
  }
  public removeInStave() {
    // this._ibegin = this._iend = 0;
    this.toAbcString = () => ''; // 删除即更新为空字符串
    this._command.updateAbcString(this.createUpdateAbcStringHandle());
    this._command.unsubscribeAbcStringIndexChange();
  }

  public toAbcString() {
    return '|' + (this.hasNewlineInEnd ? NewLine : '');
  }
  public setNewlineInEnd() {
    this.hasNewlineInEnd = true;
    this.updateInStave();
  }

  private stringIndexChangeHandle: stringsIndexChangeHandle = (ie, org_ie) => {
    const isExceedThisEnd = this._ibegin > org_ie;
    if (!isExceedThisEnd) {
      return;
    }
    // 更新在abcString中的索引
    const change = ie - org_ie;
    this._ibegin += change;
    this._iend += change;
  }

  private createUpdateAbcStringHandle(
    before?: INotation
  ): updateAbcStringHandle {
    const notationStr = this.toAbcString();
    if (this._iend === 0) {
      // 尚未添加到 stave
      if (!before) {
        // 附加到最后
        return abcstr => {
          this._ibegin = abcstr.length;
          this._iend = this._ibegin + notationStr.length - 1;
          return {
            newStaveAbcString: abcstr + notationStr
          };
        };
      } else {
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
            newStaveAbcString: forward.concat(notationStr).concat(backend),
            changesInfo: { org_iend, iend: this.iend }
          };
        };
      }
    } else {
      // 已添加到 stave, 直接更新
      return abcstr => {
        // a.拆分出前后字符串
        const forward = abcstr.substring(0, this._ibegin);
        const backend = abcstr.substring(this._iend + 1);
        // b.处理相关记录的索引
        const org_iend = this._iend;
        this._ibegin = this._ibegin;
        this._iend = this._ibegin + notationStr.length - 1;

        return {
          newStaveAbcString: forward.concat(notationStr).concat(backend),
          changesInfo: { org_iend, iend: this.iend }
        };
      };
    }
  }
}
