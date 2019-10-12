import { INotation } from './INotation';
import { Stave } from '../Stave/Stave';
import { NoteKey } from '../Enums/NoteKey';
import { NoteDuration } from '..';
import { SequenceNoteKey } from '../constant';
import { NoteAccidental } from '../Enums/NoteAccidental';

export class Note implements INotation {
  private _ibegin: number = 0;
  get ibegin() {
    return this._ibegin;
  }

  private _iend: number = 0;
  get iend() {
    return this._iend;
  }

  /**
   *
   */
  constructor(
    public key: NoteKey = NoteKey.C1,
    public duration: NoteDuration = NoteDuration.Quarter,
    public accidental: NoteAccidental = NoteAccidental.None
  ) {
    
  }

  public pitchUp() {
    var iorg = SequenceNoteKey.indexOf(this.key);
    if (iorg === SequenceNoteKey.length - 1) false;
    
    var tempkey = SequenceNoteKey[++iorg];
    if (!tempkey) return false;
    this.key = tempkey;
    
    return true;
  }
  public pitchDown() {
    var iorg = SequenceNoteKey.indexOf(this.key);
    if (iorg === 0) false;
    
    var tempkey = SequenceNoteKey[--iorg];
    if (!tempkey) return false;
    this.key = tempkey;
    
    return true;
  }
  /**
   * 添加符号：升降，重升/降，自然
   */
  public addAccidential(accidentalType:NoteAccidental) {
    this.accidental = accidentalType;
    return this;
  }

  /**
   * 将"符号"写入"谱子"  
   * 订阅"谱子"相关的变化，自己的变化也将通知到"谱子"
   */
  public addToStave(stave: Stave): string {
    throw new Error('Method not implemented.');
  }
  public insertToStave(after: INotation, stave: Stave): string {
    throw new Error('Method not implemented.');
  }

  public toAbcString() {
    return this.accidental+this.key+this.duration;
  }
}