import { INotation } from './INotation';
import { Stave } from '../Stave/Stave';
import { NoteKey } from '../Enums/NoteKey';
import { NoteDuration } from '..';
import { SequenceNoteKey } from '../constant';
import { NoteAccidental } from '../Enums/NoteAccidental';
import { stringsIndexChangeHandle } from '../types_defined';

export class Note implements INotation {
  get ibegin() {
    return this._ibegin;
  }
  get iend() {
    return this._iend;
  }
  private _ibegin: number = 0;
  private _iend: number = 0;
  private unsubscribeStingIndexChange;
  /**
   *
   */
  constructor(
    public key: NoteKey = NoteKey.C1,
    public duration: NoteDuration = NoteDuration.Quarter,
    public accidental: NoteAccidental = NoteAccidental.None
  ) {}

  public pitchUp() {
    let iorg = SequenceNoteKey.indexOf(this.key);
    if (iorg === SequenceNoteKey.length - 1) {
      return;
    }

    const tempkey = SequenceNoteKey[++iorg];
    if (!tempkey) {
      return;
    }
    this.key = tempkey;

    return true;
  }
  public pitchDown() {
    let iorg = SequenceNoteKey.indexOf(this.key);
    if (iorg === 0) {
      return false;
    }

    const tempkey = SequenceNoteKey[--iorg];
    if (!tempkey) {
      return false;
    }
    this.key = tempkey;

    return true;
  }

  /**
   * 添加符号：升降，重升/降，自然
   */
  public addAccidential(accidentalType: NoteAccidental) {
    this.accidental = accidentalType;
    return this;
  }

  /**
   * 将"符号"写入"谱子"
   * 订阅"谱子"相关的变化，自己的变化也将通知到"谱子"
   */
  public addToStave(stave: Stave) {
    this._ibegin = stave.abcString.length - 1;
    this._iend = this.toAbcString().length - 1;
    stave.subscribeStringIndexChange(this.stringIndexChangeHandle);
  }

  public insertToStave(after: INotation, stave: Stave) {
    let len = this.toAbcString().length;
    this._ibegin = after.iend + 1;
    this._iend = len - 1;
    stave.subscribeStringIndexChange(this.stringIndexChangeHandle);
  }

  public updateInStave(): string {
    throw new Error('Method not implemented.');
  }
  public removeInStave(): string {
    this.unsubscribeStingIndexChange();
    throw new Error('Method not implemented.');
  }

  public toAbcString() {
    return this.accidental + this.key + this.duration;
  }

  private beginListenStringIndexChange() {
    const org_length = this.toAbcString().length;
    return {
      org_length,
      isChange: () => org_length !== this.toAbcString().length
    };
  }

  private stringIndexChangeHandle: stringsIndexChangeHandle = (ie, org_ie) => {
    // 更新在abcString中的索引
    const isExceedThisEnd = this._ibegin > org_ie;
    if (!isExceedThisEnd) {
      return;
    }

    const change = ie - org_ie;
    this._ibegin -= change;
    this._iend -= change;
  }
}
