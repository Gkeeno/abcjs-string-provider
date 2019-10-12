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
    private key: NoteKey = NoteKey.C1,
    private duration: NoteDuration = NoteDuration.Quarter,
    private accidental: NoteAccidental = NoteAccidental.None
  ) {
    
  }

  public pitchUp() {
    var iorg = SequenceNoteKey.indexOf(this.key);
    if (iorg === SequenceNoteKey.length - 1) return;
    
    this.key = SequenceNoteKey[iorg++];
  }
  public pitchDown() {
    var iorg = SequenceNoteKey.indexOf(this.key);
    if (iorg === 0) return;
    
    this.key = SequenceNoteKey[iorg--];
  }
  /**
   * 添加符号：升降，重升/降，自然
   */
  public addAccidential(accidentalType:NoteAccidental) {
    this.accidental = accidentalType;
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