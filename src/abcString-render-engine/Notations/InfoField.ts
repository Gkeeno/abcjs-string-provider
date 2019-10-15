import { INotation } from './INotation';
import {
  StaveCommand,
  updateAbcStringHandle,
  stringsIndexChangeHandle
} from '../types_defined';
import { InfoFiledType } from '../Enums/InfoFieldType';
import { NewLine } from '../utils';

export class InfoField implements INotation {
  get ibegin() {
    return this._ibegin;
  }
  get iend() {
    return this._iend;
  }

  private _ibegin: number = 0;
  private _iend: number = 0;
  private _command: StaveCommand;

  /**
   *
   */
  constructor(private fieldType: InfoFiledType, private content: string = '') {}

  public setContent(setHandle:(string) => string) {
    this.content = setHandle(this.content);
    this.updateInStave();
  }
  
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
    this._ibegin = this._iend = 0;
    this._command.unsubscribeAbcStringIndexChange();
  }

  public toAbcString() {
    return this.fieldType + this.content + NewLine;
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
      // 添加 尚未加入字符串到 stave
      if (!before) {
        // 附加到最后
        return abcstr => {
          this._ibegin = abcstr.length ? abcstr.length : 0;
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
      // 更新 已添加到 stave, 直接从stave中替换字符串
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
