import { INotation } from './INotation';
import { NoteKey } from '../Enums/NoteKey';
import { NoteDuration } from '..';
import { SequenceNoteKey } from '../constant';
import { NoteAccidental } from '../Enums/NoteAccidental';
import {
  stringsIndexChangeHandle,
  StaveCommand,
  updateAbcStringHandle
} from '../types_defined';
import { Notation } from './Notation.abstract';

export class Note extends Notation {
  constructor(
    public key: NoteKey = NoteKey.C1,
    public duration: NoteDuration = NoteDuration.Quarter,
    public accidental: NoteAccidental = NoteAccidental.None
  ) {
    super();
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

  /**
   * 添加符号：升降，重升/降，自然
   */
  public setAccidential(accidentalType: NoteAccidental) {
    this.accidental = accidentalType;
    this.updateInStave();
  }

  public toAbcString() {
    return this.accidental + this.key + this.duration;
  }
}
