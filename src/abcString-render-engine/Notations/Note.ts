import { NoteKey } from '../Enums/NoteKey';
import { NoteDuration, NotationType } from '..';
import { SequenceNoteKey } from '../constant';
import { NoteAccidental } from '../Enums/NoteAccidental';
import { Notation } from './Notation.abstract';

export class Note extends Notation {
  public ntype = NotationType.Note;

  private lastString: string = '';

  constructor(
    public key: NoteKey = NoteKey.C1,
    public duration: NoteDuration = NoteDuration.Quarter,
    public accidental: NoteAccidental = NoteAccidental.None
  ) {
    super();
  }
  public toJSON() {
    return {
      ntype:this.ntype,
      state:[this.key,this.duration,this.accidental]
    };
  }

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

    this.updateInStave();
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

    this.updateInStave();
  }

  public setEndSpacing() {
    this.lastString = ' ';
    this.updateInStave();
  }
  /**
   * 添加符号：升降，重升/降，自然
   */
  public setAccidential(accidentalType: NoteAccidental) {
    this.accidental = accidentalType;
    this.updateInStave();
  }

  public toAbcString() {
    return this.accidental + this.key + this.duration + this.lastString;
  }
}